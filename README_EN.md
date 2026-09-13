# 🍅 TOMATO CLOCK — Pixel Pomodoro Timer

[中文](README_CN.md) · **English**

> A pixel-art Pomodoro timer for focused online learning.
> Built with AI coding agents — product thinking meets vibe coding.

---

## 🎯 Why

Online courses, coding tutorials, reading long-form articles — none of them work without sustained focus. But between notifications, social feeds, and the endless scroll, staying locked in is hard.

TOMATO CLOCK is made for that exact problem. Open it, pick what you're learning, and go. It handles the rhythm (Focus → Break → Focus) so you don't have to think about anything except the material in front of you.

---

## 📦 Two Ways to Use

### HTML Demo

A single self-contained HTML file. Open it in any browser — no install, no dependencies. Full Pomodoro timer with task management, mode switching, and today's stats. Perfect for trying it out or embedding anywhere.

### Chrome Extension

A Side Panel that lives in your browser toolbar. Click the 🍅 icon, and the timer slides out from the right. Close it anytime — the timer keeps running in the background. Notifications and a badge on the icon tell you when a session ends. Built with Manifest V3, Service Worker, and the Side Panel API.

---

## ✨ Features

- **Side Panel, not a tab** — Opens from the toolbar icon. Timer persists when closed.
- **Self-contained HTML demo** — One file, open and go. Works offline.
- **Pixel retro style** — Press Start 2P font, pixel shadows, dynamic gradients. Red for focus, gold for breaks.
- **Auto mode switching** — Focus → Short Break → Focus → Long Break. No manual toggling.
- **Single-task focus** — One active task at a time. Switch only when idle or paused.
- **Quick-start** — No task yet? Tap START to auto-create a 🍅 task. Repeat for 🍅🍅, 🍅🍅🍅...
- **Today's stats** — Focus sessions and minutes logged today, shown at a glance.
- **Timer glow states** — Dim when idle, bright with a glow while running. You always know if you're on the clock.
- **Offline & zero dependencies** — Demo runs without internet. Extension needs no network for core features.

---

## 🚀 Quick Start

### HTML Demo

Open `index.html` in any browser.

### Chrome Extension

1. Clone this repo
2. Chrome → `chrome://extensions/` → Enable Developer mode
3. **Load unpacked** → select the `extension/` folder
4. Click the 🍅 toolbar icon

---

## 🧠 Design Decisions

**Side Panel vs. New Tab**  
A new-tab override hijacks your browsing. A side panel is there when you need it, invisible when you don't.

**No SKIP**  
Skipping breaks the Pomodoro contract. Stop if you need to. Finish if you started.

**Quick-create 🍅 tasks**  
When you just want to start focusing, naming a task is friction. A 🍅 task says "I'm here to learn" with zero typing.

---

## 🤖 Built with AI

| Phase | Human | AI Agent |
|-------|-------|----------|
| Product definition | Use case, feature scope, constraints | — |
| Interaction design | State machine, task flow, edge cases | — |
| Visual identity | Pixel aesthetic, color system, typography | CSS generation & iteration |
| Implementation | Code review, logic validation, testing | HTML/CSS/JS generation |
| Extension architecture | Manifest V3, Service Worker, Side Panel API | Scaffolding & API integration |
| Polish | Pixel-level adjustments, responsive tuning | Rapid iteration |

---

## 🛠 Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript (Demo)
- Chrome Extension Manifest V3 (Side Panel, Service Worker, Storage, Notifications)

---

## 📂 Structure

```
tomato_clock/
├── index.html              # Live demo (self-contained)
├── extension/              # Chrome extension
│   ├── manifest.json
│   ├── sidepanel.html / sidepanel.js
│   ├── background.js       # Service Worker
│   ├── styles.css
│   └── icons/
└── assets/
```

---

## 📝 License

MIT
