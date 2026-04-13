# Zotero RAG (v1.0.1)

**A highly customizable Retrieval-Augmented Generation (RAG) plugin for Zotero 7/8.**
Author: AndersonM
Homepage: https://github.com/HudderMr/Zotero-RAG

Zotero RAG seamlessly integrates massive Large Language Models (LLMs) with your local Zotero knowledge base, allowing you to converse with your papers—without hallucination, and with a fully decoupled Cloud & Local execution architecture!

## 🆕 v1.0.1 Changelog

- **Full Zotero 8 Support**: Now works perfectly on both Zotero 7 and Zotero 8
- **LM Studio Fix**: Fixed model name matching issue for LM Studio integration
  - LM Studio model IDs may include quantization suffixes (e.g., `qwen3-14b@Q4_K_M`)
  - Plugin now auto-detects and matches available models from LM Studio
- **Improved Model Validation**: Always validates model names against available models before chat

## 🌟 Key Features

### 1. 🧠 Truly Decoupled Architecture: Best of Both Worlds
- **Chat AI Provider**: Assign an incredibly powerful cloud-based LLM (via OpenAI, SiliconFlow, etc.) strictly for high-fidelity reading comprehension and conversational ability.
- **Embedding AI Provider**: Offload the heavy and potentially privacy-violating PDF document vectorization step to completely local models via **Ollama** or **LM Studio**. No documents leave your PC!

### 2. 📚 Accurate Reading with No Hallucinations
By relying on Zotero's built-in PDF index and sophisticated text extraction mapping, the plugin reads exact chunks of your document, vectorizes them locally, and injects *only* the most highly related passages as context into the prompt sent to the LLM. 
- You get transparent logging of what exact text chunks were retrieved for the RAG pipeline.
- If it doesn't find text (e.g. non-OCR'd PDF), it warns you!

### 3. 🖥️ Interactive Chat UI
- Native embedded Zotero Action Panel.
- Supports formatting, dynamic context extraction updates, and standard Markdown rendering.

## 📦 Installation

1. Navigate to the `release/v1.0.1` folder of this repository.
2. Download the `zotero-rag-v1.0.1.xpi` file.
3. Open Zotero 7/8, go to `Tools > Add-ons`.
4. Click the gear icon `⚙️ > Install Add-on From File...` and select the downloaded `.xpi` file.

## 🛠️ Configuration Guide

### Scenario 1: Ultimate Accuracy & Privacy (Recommended)
You want an immense vocabulary and reasoning (Cloud LLM) but you can't afford to let your unpublished PDFs leak to the cloud.

1. Go to `Edit > Settings > Zotero RAG`.
2. Set **Chat AI Provider** to `OpenAI (Cloud)`.
   - Set up your 3rd party API (e.g. `https://api.siliconflow.cn/v1`)
   - Add your API Key.
   - Enter your large model name (e.g. `Qwen/Qwen2.5-7B-Instruct`).
3. Set **Embedding AI Provider** to `Ollama (Local)`.
   - Pull a high-quality local embedding model manually in the terminal: `ollama pull bge-m3` or `nomic-embed-text`.
   - Set your Ollama Base URL (`http://localhost:11434`).
   - Type your model name exactly as pulled (`bge-m3`).

### Scenario 2: LM Studio Integration
LM Studio provides a user-friendly GUI for running local models:

1. Download and install [LM Studio](https://lmstudio.ai/).
2. Load a model in LM Studio (e.g. `qwen3-14b`).
3. Enable the Local Server in LM Studio (default: `http://localhost:1234`).
4. In Zotero RAG settings:
   - Set **Chat AI Provider** or **Embedding AI Provider** to `LM Studio (Local)`.
   - Enter the Base URL (`http://localhost:1234`).
   - The model name can be left empty or partial - plugin will auto-match available models.

### Scenario 3: 100% Offline Local Privacy Setup
If you are completely offline:
1. Set **both** Chat & Embedding Provider to `Ollama (Local)` or `LM Studio (Local)`.
2. Configure a local model like `qwen2.5:0.5b` for Chat and `bge-m3` for embedding. 

## 🔄 Updating your Corpus
Whenever you add or switch the Embedding Model, ensure you clear the Vectorized Knowledge Base.
- Simply navigate to the internal Zotero settings, search for Zotero RAG and click "Clear Index". The next time you open a PDF, it will be vectorized cleanly and silently in the background!

## 🤝 Contribution & Support
Contributions, issues and feature requests are welcome!
- Homepage: https://github.com/HudderMr/Zotero-RAG
- Issues: https://github.com/HudderMr/Zotero-RAG/issues

## 📜 License
**AndersonM Free Use License**

This software is strictly licensed as Proprietary Freeware.
- ✅ **Free to Use**: 100% free for any individual, academic, or corporate entity to download and use.
- ❌ **No Modification**: You may not modify, reverse engineer, or create derivative works.
- ❌ **No Redistribution**: You may not redistribute, repackage, or mirror this software anywhere.
- ❌ **No Commercialization**: You may not sell or profit from this software.
- ❌ **No Patents**: You may not file patents for any concepts or code implemented herein.

See the complete `LICENSE` file for exact legal terms.