# Zotero RAG (v1.0.1)

**专为 Zotero 7/8 打造的高可定制检索增强生成 (RAG) 插件。**
作者：AndersonM
主页：https://github.com/HudderMr/Zotero-RAG

Zotero RAG 实现了大型语言模型（LLMs）与你本地 Zotero 知识库的无缝对接，让你能够准确地"对话文献"——彻底解决"幻觉"盲答问题！其独创的"云端对话 + 本地嵌入提取"解耦架构，能同时保障绝佳的精确度与你的本地数据隐私。

## 🆕 v1.0.1 更新日志

- **完整 Zotero 8 支持**：现已完美兼容 Zotero 7 和 Zotero 8
- **LM Studio 修复**：修复了 LM Studio 集成的模型名称匹配问题
  - LM Studio 模型 ID 可能包含量化后缀（如 `qwen3-14b@Q4_K_M`）
  - 插件现在会自动检测并匹配 LM Studio 中的可用模型
- **改进的模型验证**：在对话前始终验证模型名称与可用模型的匹配

## 🌟 核心功能特性

### 1. 🧠 彻底解耦的架构：兼得鱼与熊掌
- **对话 AI 引擎 (Chat AI Provider)**：你可以将极其强大的云端算力模型（通过 OpenAI、SiliconFlow、阿里云等）独占用于"高级文献理解与对话输出"。
- **向量提取引擎 (Embedding AI Provider)**：将极其消耗算力且可能涉及数据隐私的"PDF 散点切片向量化"环节，卸载到纯本地环境——完全对接 **Ollama** 或 **LM Studio**。不泄露任何一篇未发表手稿的内容！

### 2. 📚 零幻觉强关联对话
依托于 Zotero 先进的 PDF 层级索引抽取方案。插件会在后台静默抓取你的文献并本地提取特征，在对话时 **只有与你提问最相关的几个文献段落** 才会被送往大模型处！
- UI 后台全透明日志展示，告诉你大模型到底收到了哪几句话作为 Prompt 垫底。
- 防止大模型"因为不懂而装懂"瞎编乱造！

### 3. 🖥️ 原生融合式 UI 交互
- 现代化的 Zotero 侧边栏融合面板设计。
- 完整的 Markdown 语法渲染及丰富的控制台指令集支持。

## 📦 安装指南

1. 进入本仓库下的 `release/v1.0.1` 目录。
2. 下载 `zotero-rag-v1.0.1.xpi` 安装包文件。
3. 打开你的 Zotero 7/8，点击右上方菜单进入 `工具 (Tools) > 附加组件 (Add-ons)`。
4. 点击右上角齿轮图标 `⚙️ > Install Add-on From File...` (从文件安装附加组件)，选择刚下载的 `.xpi` 文件即可。

## 🛠️ 设置与使用向导

### 情景 1：顶级回答智商 & 绝对文献隐私 (强烈推荐！)
你需要广阔且知识渊博的大模型当你的助手（靠云端 API），同时绝不能容忍把你硬盘里上 GB 的文献传到云端厂商那里。

1. 打开菜单 `编辑 (Edit) > 设置 (Settings) > Zotero RAG` 偏好页。
2. 将 **对话 AI 提供商 (Chat AI Provider)** 选为 `OpenAI (Cloud)`。
   - 基础 URL 中填入如硅基流动的 API `https://api.siliconflow.cn/v1` 等。
   - 填入你注册的 API Key。
   - 设置对话模型名称比如 `deepseek-chat` 或 `Qwen/Qwen2.5-7B-Instruct`。
3. 将 **嵌入提取 AI 提供商 (Embedding AI Provider)** 选定为 `Ollama (本地)`。
   - 首先得去你的电脑系统终端中运行一次 `ollama pull bge-m3` 下载轻量提取专用模型。
   - 模型名称填为 `bge-m3`，URL 保持默认的 `http://localhost:11434`。

### 情景 2：LM Studio 集成
LM Studio 提供友好的图形界面来运行本地模型：

1. 下载并安装 [LM Studio](https://lmstudio.ai/)。
2. 在 LM Studio 中加载一个模型（如 `qwen3-14b`）。
3. 在 LM Studio 中启用本地服务器（默认：`http://localhost:1234`）。
4. 在 Zotero RAG 设置中：
   - 将 **对话 AI 提供商** 或 **嵌入提取 AI 提供商** 设为 `LM Studio (本地)`。
   - 输入基础 URL（`http://localhost:1234`）。
   - 模型名称可留空或填写部分名称——插件会自动匹配可用模型。

### 情景 3：100% 断网隔离纯本地
如果你在保密网络中工作，不接入公网：
1. 请将 **对话 AI 提供商** 和 **嵌入提取 AI 提供商** 都指定为 `Ollama (本地)` 或 `LM Studio (本地)`。
2. 配置好你本地对应的大模型名称（例如对话用 `qwen2.5:0.5b`，向量用 `bge-m3`）。

## 🔄 清洗或更新你的知识库索引
当你无论出于什么原因更换了"嵌入(Embedding)模型"后，请务必清空历史数据的残留！
- 随时可以在 Zotero RAG 的设置页面中找到 **Clear Index (清空索引)** 按钮，将带有错误特征或残留的向量冲洗掉。下次点击任意文献时，它会在后台全自动重新生成最新的向量组！

## 🤝 贡献与支持
如遇 Bug 或建议反馈，欢迎提交 Issue!
- 主页：https://github.com/HudderMr/Zotero-RAG
- 问题反馈：https://github.com/HudderMr/Zotero-RAG/issues

## 📜 许可证 / 版权声明
**AndersonM Free Use License (免费使用专有协议)**

本软件作为专有免费软件（Proprietary Freeware）发布，**不属于开源软件**。
- ✅ **完全免费使用**：允许任何个人、学术机构、公司企业免费下载和在内部环境中使用。
- ❌ **禁止修改代码**：严禁对本软件及其代码进行任何形式的修改、逆向工程或开发衍生版。
- ❌ **禁止二次分发**：严禁任何人或平台重新打包、镜像或二次传播提供下载（使用者请一律认准原作者官方渠道）。
- ❌ **禁止商用盈利**：严禁出售本软件本身或直接利用本代码本体进行盈利。
- ❌ **禁止专利抢注**：严禁任何人据此代码逻辑与实现申请任何司法管辖区的专利。

完整的法律约束条款详见随附的 `LICENSE` 文件。