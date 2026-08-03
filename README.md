# Intelligent IDP Generator 🚀

An AI-powered Individual Development Plan (IDP) recommendation and career roadmap platform built with **React**, **TypeScript**, **TailwindCSS**, **Express**, and the **Google Gemini API**.

---

## ✨ Features

- 🎯 **AI-Generated IDPs**: Tailored career development roadmaps based on major, current skills, target roles, experience level, and time commitment.
- 💬 **Interactive AI Career Advisor**: Built-in AI chat assistant for immediate, dynamic guidance and clarification.
- 📊 **Progress & Skill Tracking**: Interactive milestones, actionable step-by-step career goals, and skill gap visualization.
- 🔥 **Streak & Achievement System**: Gamified login streak tracker to keep learning consistent.
- 🎨 **Modern Cyber-Aesthetic UI**: High-contrast, rich glassmorphism UI with responsive design.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS v4, Lucide Icons, Framer Motion
- **Backend / Server**: Node.js, Express, `tsx`
- **AI Integration**: `@google/genai` (Google Gemini 2.5 Flash API)
- **Build Tool**: Vite 6, esbuild

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/Dharanesh05/IDP-Generator.git
cd IDP-Generator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
├── public/                 # Static assets & media
│   └── background-video.mp4 # Background video asset
├── src/
│   ├── components/         # Modular React components
│   │   ├── AuthModal.tsx
│   │   ├── Background3DVideo.tsx
│   │   ├── Dashboard.tsx
│   │   ├── IdpChat.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProgressTracker.tsx
│   │   └── StudentForm.tsx
│   ├── App.tsx             # Root application component
│   ├── index.css           # Global CSS & Tailwind configuration
│   ├── main.tsx            # React DOM entrypoint
│   └── types.ts            # TypeScript definitions & interfaces
├── server.ts               # Express server with Gemini API endpoints
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

---

## 📜 License

This project is open-source and available under the MIT License.
