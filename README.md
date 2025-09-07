# 📚 CodeDrifter – Real-Time Documentation Assistant  

![Build](https://img.shields.io/badge/build-passing-brightgreen)  
![License](https://img.shields.io/badge/license-MIT-blue)  
![Contributors](https://img.shields.io/github/contributors/TsangDaXin/codeDrifter)  
![Stars](https://img.shields.io/github/stars/TsangDaXin/codeDrifter?style=social)  
![Issues](https://img.shields.io/github/issues/TsangDaXin/codeDrifter)  

---
# CodeDrifter

**CodeDrifter** makes documentation **effortless, accurate, and always up to date**.  
No more stale docs. No more onboarding nightmares. Just clean, living documentation that evolves with your code.

If you want to visit our business webpage, here are the links:

- **Business Webpage Repository:**  
  [https://github.com/TsangDaXin/CodeDrifter-Business-Webpage](https://github.com/TsangDaXin/CodeDrifter-Business-Webpage)

- **Slide Link (Canva Presentation):**  
  [https://www.canva.com/design/DAGxueAIYCQ/PmSSEdoeJe8Hp7zVbac2dA/edit?utm_content=DAGxueAIYCQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](https://www.canva.com/design/DAGxueAIYCQ/PmSSEdoeJe8Hp7zVbac2dA/edit?utm_content=DAGxueAIYCQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

- **YouTube Video:**  
  [https://www.youtube.com/watch?v=AnHmQitOoqE](https://www.youtube.com/watch?v=AnHmQitOoqE)
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

### Step 1
<pre>
  cd codeDrifter_extension
</pre>

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
  
### Main page
<img width="1917" height="949" alt="v1" src="https://github.com/user-attachments/assets/f3427cf0-0000-44f1-884b-2975d5fbb64a" />
<img width="937" height="962" alt="v2" src="https://github.com/user-attachments/assets/d1e6dc51-e0cf-4d26-b3fc-305f2d086b04" />

### Documentation page
<img width="1902" height="954" alt="v3" src="https://github.com/user-attachments/assets/b0a6994b-8281-496c-8f3d-a3434cc441e4" />
<img width="1589" height="940" alt="v4" src="https://github.com/user-attachments/assets/f06697bb-02e4-469f-a4b9-511db8009220" />
<img width="1114" height="659" alt="v13" src="https://github.com/user-attachments/assets/86fe783d-f5ca-4502-9de1-bfda9b4afecc" />
<img width="1915" height="950" alt="v5" src="https://github.com/user-attachments/assets/ab340062-5f93-4c6e-98ff-4be2dbb58cc1" />

### GitHub Digest page
<img width="1903" height="954" alt="v6" src="https://github.com/user-attachments/assets/f3328dc6-0e85-44b1-8cd0-693f81e45afa" />

### Maintenance page
<img width="1910" height="946" alt="v7" src="https://github.com/user-attachments/assets/8e95fe45-7232-4de5-a31d-b310a4c4979d" />

### Ai summarization page
<img width="1665" height="946" alt="v8" src="https://github.com/user-attachments/assets/159a5019-dd5f-41a4-8322-c7ee53401502" />
<img width="1654" height="944" alt="v9" src="https://github.com/user-attachments/assets/8bb5f197-7846-4137-bb2a-7cb249ed60f2" />

### Code visualization page
<img width="1916" height="950" alt="v10" src="https://github.com/user-attachments/assets/7aec398b-0b09-4b2e-bda6-a310e2f5c95e" />
<img width="1043" height="655" alt="v11" src="https://github.com/user-attachments/assets/2ca20d7a-a653-4ba7-8c11-5e99f2b0815d" />
<img width="1227" height="924" alt="v12" src="https://github.com/user-attachments/assets/3f89677c-5db8-4582-b5be-d407ee2700f2" />




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
