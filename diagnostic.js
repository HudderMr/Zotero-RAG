// Zotero RAG - RAG Pipeline Diagnostic Script
// Run this in Zotero: Tools > Developer > Run JavaScript
// Compatible with Zotero 7 and 8
// Select a paper item first, then run this script

var item = ZoteroPane.getSelectedItems()[0];
var output = [];
output.push("=== RAG Pipeline Diagnostic ===");
output.push("Zotero version: " + Zotero.version);
output.push("Item: " + item.getField('title'));
output.push("Item ID: " + item.id);

// Step 1: Get attachment text
var attachmentIds = item.isAttachment() ? [item.id] : await item.getAttachments();
output.push("Attachments: " + JSON.stringify(attachmentIds));

var text = "";
for (var aid of attachmentIds) {
    var att = await Zotero.Items.getAsync(aid);
    if (att.attachmentContentType !== 'application/pdf') continue;
    
    try {
        var cacheFile = Zotero.Fulltext.getItemCacheFile(att);
        if (cacheFile && cacheFile.exists()) {
            text = await Zotero.File.getContentsAsync(cacheFile.path);
            output.push("✅ Extracted " + text.length + " chars from cache file");
        } else {
            output.push("❌ Cache file doesn't exist");
        }
    } catch(e) {
        output.push("❌ Cache file error: " + e);
    }
    break;
}

if (!text) {
    output.push("FAILED: No text extracted. Cannot continue.");
    return output.join("\n");
}

// Step 2: Read current preferences
output.push("\n--- Preference Diagnostic ---");
var prefsPrefix = "extensions.zotero.zoterorag";
var chatProvider = Zotero.Prefs.get(prefsPrefix + ".provider", true) || "(not set)";
var embedProvider = Zotero.Prefs.get(prefsPrefix + ".embeddingProvider", true) || "(not set)";
output.push("Chat Provider: " + chatProvider);
output.push("Embedding Provider: " + embedProvider);

// Dump all provider-specific prefs
var providerKeys = [
    "openaiBaseUrl", "openaiModel", "openaiApiKey", "openaiEmbeddingModel",
    "ollamaBaseUrl", "ollamaModel", "ollamaEmbeddingModel",
    "lmstudioBaseUrl", "lmstudioModel", "lmstudioEmbeddingModel"
];
for (var pk of providerKeys) {
    var val = Zotero.Prefs.get(prefsPrefix + "." + pk, true);
    // Mask API keys
    if (pk.includes("ApiKey") && val) val = val.substring(0, 4) + "***";
    output.push("  " + pk + " = " + (val || "(empty)"));
}

// Step 3: Test embedding via direct fetch (provider-agnostic)
output.push("\n--- Embedding Test ---");
var testText = text.substring(0, 500);

// Determine embedding endpoint from config
var embProvider = Zotero.Prefs.get(prefsPrefix + ".embeddingProvider", true) || "ollama";
var embModel, embUrl, embBody;

if (embProvider === "ollama") {
    embUrl = (Zotero.Prefs.get(prefsPrefix + ".ollamaBaseUrl", true) || "http://localhost:11434") + "/api/embed";
    embModel = Zotero.Prefs.get(prefsPrefix + ".ollamaEmbeddingModel", true) || "(not set!)";
    embBody = JSON.stringify({ model: embModel, input: testText });
} else if (embProvider === "lmstudio") {
    embUrl = (Zotero.Prefs.get(prefsPrefix + ".lmstudioBaseUrl", true) || "http://localhost:1234/v1") + "/embeddings";
    embModel = Zotero.Prefs.get(prefsPrefix + ".lmstudioEmbeddingModel", true) || "(not set!)";
    embBody = JSON.stringify({ model: embModel, input: testText });
} else if (embProvider === "openai") {
    embUrl = (Zotero.Prefs.get(prefsPrefix + ".openaiBaseUrl", true) || "https://api.openai.com/v1") + "/embeddings";
    embModel = Zotero.Prefs.get(prefsPrefix + ".openaiEmbeddingModel", true) || "(not set!)";
    embBody = JSON.stringify({ model: embModel, input: testText });
}

output.push("Provider: " + embProvider);
output.push("Model: " + embModel);
output.push("Endpoint: " + embUrl);

try {
    var headers = { 'Content-Type': 'application/json' };
    if (embProvider === "openai") {
        var apiKey = Zotero.Prefs.get(prefsPrefix + ".openaiApiKey", true) || "";
        if (apiKey) headers['Authorization'] = 'Bearer ' + apiKey;
    }
    
    var resp = await fetch(embUrl, {
        method: 'POST',
        headers: headers,
        body: embBody
    });
    
    if (!resp.ok) {
        var errText = await resp.text();
        output.push("❌ API error " + resp.status + ": " + errText.substring(0, 200));
        
        // Ollama fallback
        if (embProvider === "ollama") {
            output.push("Trying /api/embeddings fallback...");
            var fallbackUrl = embUrl.replace("/api/embed", "/api/embeddings");
            resp = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: embModel, prompt: testText })
            });
            if (!resp.ok) {
                output.push("❌ Fallback also failed: " + resp.status);
                return output.join("\n");
            }
        } else {
            return output.join("\n");
        }
    }
    
    var embData = await resp.json();
    var embedding;
    if (embData.embedding) {
        embedding = embData.embedding;
    } else if (embData.embeddings && embData.embeddings[0]) {
        embedding = embData.embeddings[0];
    } else if (embData.data && embData.data[0] && embData.data[0].embedding) {
        embedding = embData.data[0].embedding;
    } else {
        output.push("❌ Could not find embedding in response: " + JSON.stringify(embData).substring(0, 200));
        return output.join("\n");
    }
    
    output.push("✅ Embedding dimension: " + embedding.length);
    output.push("First 5 values: " + embedding.slice(0, 5).map(v => v.toFixed(6)).join(", "));
    output.push("Embedding norm: " + Math.sqrt(embedding.reduce((s, v) => s + v*v, 0)).toFixed(4));
    
    // Similarity test
    output.push("\n--- Similarity Test ---");
    var queryText = "What is this paper about?";
    var qResp = await fetch(embUrl, {
        method: 'POST',
        headers: headers,
        body: embProvider === "ollama" 
            ? JSON.stringify({ model: embModel, input: queryText })
            : JSON.stringify({ model: embModel, input: queryText })
    });
    var qData = await qResp.json();
    var qEmb;
    if (qData.embedding) qEmb = qData.embedding;
    else if (qData.embeddings && qData.embeddings[0]) qEmb = qData.embeddings[0];
    else if (qData.data && qData.data[0]) qEmb = qData.data[0].embedding;
    
    if (qEmb) {
        output.push("Query embedding dim: " + qEmb.length);
        var dotProduct = 0, normA = 0, normB = 0;
        for (var i = 0; i < Math.min(embedding.length, qEmb.length); i++) {
            dotProduct += embedding[i] * qEmb[i];
            normA += embedding[i] * embedding[i];
            normB += qEmb[i] * qEmb[i];
        }
        var similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        output.push("Cosine similarity: " + similarity.toFixed(6));
    }
    
} catch(e) {
    output.push("❌ Embedding error: " + e);
}

output.push("\n✅ Diagnostic complete.");
return output.join("\n");
