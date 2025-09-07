# 📚 CodeDrifter – Real-Time Documentation Assistant  

![Build](https://img.shields.io/badge/build-passing-brightgreen)  
![License](https://img.shields.io/badge/license-MIT-blue)  
![Contributors](https://img.shields.io/github/contributors/TsangDaXin/codeDrifter)  
![Stars](https://img.shields.io/github/stars/TsangDaXin/codeDrifter?style=social)  
![Issues](https://img.shields.io/github/issues/TsangDaXin/codeDrifter)  

---

**CodeDrifter** makes documentation **effortless, accurate, and always up to date**.  
No more stale docs. No more onboarding nightmares. Just clean, living documentation that evolves with your code.  

If you want to visit our business webpage view , here are the links : https://github.com/TsangDaXin/CodeDrifter-Business-Webpage

---

## 🌟 Why CodeDrifter?  

In real-world dev environments, documentation is often:  

❌ **Slow to write** – Developers avoid writing them.  
❌ **Painful to read** – Inconsistent style, broken links.  
❌ **Quickly stale** – Code changes, docs don’t.  

This causes **onboarding delays, wasted time, and bugs**.  

✅ **CodeDrifter fixes that.**  

---

## ✨ Features  

### 📝 1. Smart Doc Writer (AI-Powered)  
- Auto-generates **starter docs** from your codebase (classes, methods, API routes, git commits).  
- AI-assisted **README generator** with Setup, Usage, API, Contributing.  
- Built-in **Markdown validator** to keep docs clean & professional.  

👉 *Benefit: Developers don’t start from scratch. Docs are created instantly, then refined with small edits.*  

---

### 🔄 2. Doc Drift Detector (Maintenance)  
- Detects **mismatches between code & docs**.  
- Example: If `getUser()` → renamed to `fetchUser()`, the tool flags outdated docs.  
- AI suggests doc updates when business logic changes (new params, return types, etc.).  
- GitHub Action bot + optional Slack/Discord alerts keep teams updated.  

👉 *Benefit: No more stale docs. Docs stay in sync with code.*  

---

### 📖 3. Doc Reader Mode  
- **Q&A chatbot for docs** → Ask: *“How do I create a payment?”* and get instant answers.  
- **AI auto-summarizer (TL;DR)** → Condense long design docs into digestible bullet points.  

👉 *Benefit: Faster onboarding. Easier to understand complex systems.*  

---

### ✍️ 4. Collaborative Documentation Editor  
- Share docs & **adjust permissions** (view, comment, edit).  
- Supports **command blocks `/` like Notion** for rich editing:  
  - ✅ Bullet lists, checklists  
  - ✅ Code blocks with syntax highlighting  
  - ✅ Auto-generate **UML diagrams & flowcharts**  
  - ✅ AI-powered inline formatting assistance  

👉 *Benefit: Docs become collaborative, living documents—not static text.*  

---

### ⚡ 5. Digest Any Git Repository Instantly  
- Point CodeDrifter to any GitHub repo.  
- AI instantly **summarizes architecture, key files, workflows**.  
- Provides a **project-level TL;DR** for quick onboarding.  

👉 *Benefit: Understand any repo in minutes. No more digging.*  

---

## 🛠️ Tech Stack  

<img width="1200" height="673" alt="techstack" src="https://github.com/user-attachments/assets/5633be78-1d89-46b8-84f4-045e2f7e9853" />


**Frontend:**  
- ⚛️ React + TailwindCSS (fast dev, clean UI)  
- 🎨 ShadCN/UI (for polished, hackathon-grade components)  

**Backend:**  
- 🐍 Flask (Python) **or** Node.js + Express  
- 🔗 GitHub API integration (clone repo, parse commits & PRs)  

**AI / NLP:**  
- 🤖 OpenAI API (generation, Q&A, summarization)  
- 🧩 LangChain (document search + embeddings store)  

**Database:**  
- 🗄️ SQLite / PostgreSQL (store embeddings & doc metadata)  

**Parsing:**  
- ☕ JavaParser / Swagger Parser for APIs  
- 🐍 Python AST for Python repos  

---

## 🛠️ Setup Guide  

### 2️⃣ Install Dependencies  

**Using Bun:**  
<pre>
bun install
</pre>  

**Using npm:**  
<pre>
npm install
</pre>  

---

### 3️⃣ Start Development Server  

**Using Bun:**  
<pre>
bun run dev
</pre>  

**Using npm:**  
<pre>
npm run dev
</pre>  

---

### 4️⃣ Open in Browser  

The dev server runs at:  
👉 [http://localhost:5173](http://localhost:5173)  

---

## 📸 Demo  
  
<img width="1151" height="909" alt="codedrifter1" src="https://github.com/user-attachments/assets/5c30fcc4-0f91-4b33-ba76-a8a908143a24" />
<img width="1673" height="899" alt="codedriter2" src="https://github.com/user-attachments/assets/848d19a9-58e5-4938-aa9a-44e5e24d9838" />
<img width="1704" height="909" alt="codedrifter3" src="https://github.com/user-attachments/assets/84ccdbc3-77d3-4438-8fa0-f58273496793" />
<img width="1656" height="905" alt="codedrifter4" src="https://github.com/user-attachments/assets/577dcbbf-b844-4608-8c3b-83e29439c0b8" />

---

## 🤝 Contributors  

Introducing **Team DELAY** 🚀  

| Name        | Role       | GitHub |
|-------------|------------|--------|
| Owen Tsang  | Developer  | [@TsangDaXin](https://github.com/TsangDaXin) |
| Tan Lok Qi  | Developer  | [@lennardtan]([https://github.com/lennardtan) |
| Chun Kit    | Developer  | [@delaynomore-png](https://github.com/delaynomore-png) |
| Wai Hong    | Developer  | [@WAIHONGGR](https://github.com/WAIHONGGR) |

---

## 📌 Roadmap  

- 🔌 VSCode extension support  
- 🛠️ Multi-language parser expansion (Go, Rust, etc.)  
- 📡 Slack/Discord integrations for doc alerts  
- 📊 More visualization tools (ERD, sequence diagrams)  
- 🌍 Cloud-hosted collaboration platform  

---

## 📄 License  

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.  

---

## 🤲 Contributing  

Contributions are welcome! Please check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.  

---

💡 *Docs shouldn’t slow you down — let’s make them smarter, together.*  
