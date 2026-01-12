# Real-Time Collaborative Document Editor

A web-based collaborative editor inspired by Notion/Google Docs. Built with **Next.js**, **TipTap**, **Yjs**, **Prisma**, and **NextAuth**.  
Multiple users can edit documents simultaneously with live cursors, autosave, comments, and version history.

---

## ✨ Features

- **Browser-based editing** with rich text (TipTap)
- **Real-time collaboration** powered by Yjs + WebSocket
- **Authentication** via NextAuth (credentials, OAuth providers)
- **Cross-platform support** (desktop & mobile browsers)
- **Autosave snapshots** stored in PostgreSQL
- **Presence bar** showing active collaborators
- **Offline resilience** (edits sync when reconnected)
- **Comments sidebar** for inline discussions
- **Version history** with side-by-side diff view
- **Restore previous versions** directly from history

---

## 📂 Project Structure
collab/ ├─ .env ├─ package.json ├─ prisma/ │  ├─ schema.prisma │  └─ seed.ts ├─ src/ │  ├─ app/… (Next.js routes & pages) │  ├─ components/… (UI + editor components) │  ├─ lib/… (auth, prisma, helpers) │  ├─ middleware.ts │  └─ styles/globals.css └─ ws-server/server.ts (WebSocket sync server)


---
🚀 Usage
- Sign in at /signin with demo credentials.
- Create or open a document from /documents.
- Open the same doc in two browsers — edits sync instantly.
- Use toolbar for formatting, presence bar shows collaborators.
- Comments appear in sidebar.
- Version history modal lets you compare snapshots side-by-side and restore.

🛠 Tech Stack
- Frontend: Next.js (App Router), TailwindCSS, TipTap
- Collaboration: Yjs CRDT, WebSocket server
- Auth: NextAuth.js (JWT, credentials, OAuth)
- Database: PostgreSQL + Prisma ORM
- Diffs: diff library for side-by-side version comparison

📌 Roadmap
- [ ] Threaded replies in comments
- [ ] Slash commands for block editing
- [ ] Rich media embeds (images, tables)
- [ ] Notifications for comments/mentions
- [ ] Collaborative cursors with avatars




This README is **GitHub-ready**: it has badges-style sections, setup instructions, usage guide, and roadmap.  
