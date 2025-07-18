<p align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" align="center" width="30%">
</p>
<h1 align="center">QUICKLEARN</h1>

<p align="center">
  <em><code>❯ Empowering collaborative learning through AI-generated roadmaps and tests</code></em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/RishiKumarGade/QuickLearn?style=flat-square&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
  <img src="https://img.shields.io/github/last-commit/RishiKumarGade/QuickLearn?style=flat-square&logo=git&logoColor=white&color=0080ff" alt="last-commit">
  <img src="https://img.shields.io/github/languages/top/RishiKumarGade/QuickLearn?style=flat-square&color=0080ff" alt="repo-top-language">
  <img src="https://img.shields.io/github/languages/count/RishiKumarGade/QuickLearn?style=flat-square&color=0080ff" alt="repo-language-count">
  <img src="https://img.shields.io/badge/Built_with-Next.js-000?style=flat-square&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Database-MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel">
  <img src="https://img.shields.io/badge/Powered_by-AI-blueviolet?style=flat-square&logo=openai">
</p>

---

## 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [📁 Project Structure](#-project-structure)
  - [📂 Project Index](#-project-index)
- [🚀 Getting Started](#-getting-started)
  - [☑️ Prerequisites](#-prerequisites)
  - [⚙️ Installation](#-installation)
  - [🤖 Usage](#🤖-usage)
  - [🧪 Testing](#🧪-testing)
- [📌 Project Roadmap](#-project-roadmap)
- [🙌 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

**QuickLearn** is a full-stack collaborative learning platform that allows users to create **custom learning roadmaps, modules, and quizzes** tailored to their academic or skill-building goals.

It is designed to enhance productivity in both solo and group learning environments by allowing users to:

- Generate AI-powered roadmaps and quizzes based on any topic
- Create or join **workspaces** for group learning
- Share entire **syllabi** and track collective progress
- Enable **real-time collaboration** between members preparing for the same subject

Whether you're a student preparing for exams, part of a study group, or managing a team’s upskilling journey—QuickLearn helps you stay aligned, organized, and ahead.

---

## 👾 Features

- 🛣️ **Custom Roadmap Generator** – AI-assisted generation of structured learning paths  
- 🧪 **Mock Tests & Quizzes** – Create manual or auto-generated assessments  
- 🧠 **Module Management** – Create, assign, and track topic-based modules  
- 👥 **Collaborative Workspaces** – Team up and study together in real time  
- ✅ **Synchronized Syllabus** – Add topics once, sync with your team automatically  
- 🔐 **Authentication** – Secure login, registration, verification & password reset  
- ✉️ **Email Invites** – Invite members to your workspace via email  
- 📱 **Responsive UI** – Fast and accessible across all device types  

---

## 📁 Project Structure

```shell
.
├── app/
│   ├── api/              # Route handlers for backend API
│   ├── dashboard/        # Main dashboard UI for users
│   ├── auth/             # Login, signup, reset, verification pages
│   ├── learn/            # Roadmap and syllabus pages
│   ├── workspace/        # Workspace pages & components
│   └── layout.tsx        # Global layout
├── components/           # Shared React components
├── lib/                  # Helpers, DB utils, email services, etc.
├── models/               # Mongoose models (User, Workspace, Module, etc.)
├── public/               # Static files and images
├── styles/               # Tailwind CSS / global styles
├── types/                # TypeScript interfaces
├── .env.local            # Environment variables
└── README.md             # You are here!
```

---

## 📂 Project Index

| File / Folder              | Purpose                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| `app/api/`                | API routes (REST handlers for modules, auth, quizzes, etc.)             |
| `app/dashboard/`          | Main user dashboard UI after login                                      |
| `app/auth/`               | Auth-related pages (sign-in, sign-up, password reset, etc.)             |
| `app/learn/`              | Roadmap generation and learning progress interface                      |
| `app/workspace/`          | Workspace UI: create, join, invite members                              |
| `components/`             | Reusable UI components (buttons, modals, cards, inputs, etc.)           |
| `lib/`                    | Utility functions for database, emails, session management               |
| `models/`                 | MongoDB models (User, Workspace, Roadmap, Module, Quiz)                 |
| `types/`                  | Global TypeScript types/interfaces                                      |
| `.env.local`              | Private environment variables                                           |
| `README.md`               | Project documentation                                                   |

---

## 🚀 Getting Started

### ☑️ Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB URI
- (Optional) Vercel CLI for deployment

### ⚙️ Installation

```bash
git clone https://github.com/RishiKumarGade/QuickLearn.git
cd QuickLearn
npm install
```

Create a `.env.local` file and add:

```env
MONGODB_URI=your_mongodb_connection
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_SERVER=smtp://user:pass@smtp.mailtrap.io:2525
EMAIL_FROM=QuickLearn <support@quicklearn.dev>
```

### 🤖 Usage

```bash
npm run dev
```

Navigate to `http://localhost:3000`.

### 🧪 Testing

> Tests coming soon – unit and integration tests using Jest & React Testing Library.

---

## 📌 Project Roadmap

- [x] Roadmap generator using AI
- [x] Auth & secure email workflows
- [x] Collaborative workspace system
- [x] Mock tests and quiz engine
- [ ] Leaderboards and gamification
- [ ] Notification system (email + in-app)
- [ ] Real-time presence tracking
- [ ] Mobile PWA support

---

## 🔰 Contributing

We welcome contributions! Please:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -m 'Add xyz'`)
4. Push and create a PR

---

## 🙌 Acknowledgments

- ✨ **Next.js** for powering the frontend  
- 🌿 **MongoDB** for the backend database  
- 📬 **Resend / Nodemailer** for handling emails  
- 🤖 **OpenAI API** for AI-based roadmap and quiz generation  
- 🎨 **Tailwind CSS** for rapid and responsive UI design  
- 💡 Inspiration: Notion, StudyTogether, Roadmap.sh

---
