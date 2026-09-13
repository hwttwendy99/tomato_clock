# 🍅 TOMATO CLOCK — 像素番茄时钟

**中文** · [English](README_EN.md)

> 一个像素复古风格的番茄时钟，专为在线学习场景设计。
> 借助 AI coding agent 构建——产品思维 × vibe coding。

---

## 🎯 为什么做这个

上网课、看编程教程、读长文——没有持续的专注力，这些都很难完成。但手机通知、社交信息流、短视频总在分散注意力。

TOMATO CLOCK 就是为这个场景做的。打开它，选好要学的内容，然后开始。它会自动处理节奏（专注 → 休息 → 专注），你只需要关注眼前的学习内容。

---

## 📦 两种使用方式

### HTML Demo

一个自包含的单文件 HTML。用任何浏览器打开即可使用——无需安装，零依赖。完整的番茄钟功能：任务管理、模式切换、今日统计。适合快速体验或嵌入到任何地方。

### Chrome 插件

一个驻留在浏览器工具栏的 Side Panel。点击 🍅 图标，计时器从右侧滑出。随时关闭——计时在后台继续。通知和图标上的 badge 会在计时结束时提醒你。基于 Manifest V3、Service Worker 和 Side Panel API 构建。

---

## ✨ 功能

- **Side Panel 而非新标签页** — 工具栏图标打开，关闭后计时不中断
- **自包含 HTML Demo** — 单文件即开即用，支持离线
- **像素复古风格** — Press Start 2P 字体、像素阴影、动态渐变。专注红色，休息金色
- **自动模式切换** — 专注 → 短休 → 专注 → 长休，无需手动操作
- **单任务聚焦** — 一次只做一件事，空闲或暂停时才能切换
- **一键快速开始** — 没有任务时点 START，自动创建 🍅 任务并计时。再点创建 🍅🍅
- **今日统计** — 一眼看到今天完成了几个番茄、累计多少分钟
- **计时器光晕** — 空闲时暗沉，计时中明亮带光晕，一眼看出状态
- **离线零依赖** — Demo 无需网络，插件核心功能不需联网

---

## 🚀 快速开始

### HTML Demo

用浏览器打开 `index.html`。

### Chrome 插件

1. Clone 本仓库
2. Chrome → `chrome://extensions/` → 开启开发者模式
3. 「加载已解压的扩展程序」→ 选择 `extension/` 目录
4. 点击工具栏 🍅 图标

---

## 🧠 设计思路

**Side Panel vs 新标签页**  
新标签页替换会劫持浏览行为。侧边栏需要时打开，不需要时消失。

**为什么没有 SKIP**  
跳过打破了番茄工作法的约定。要停就按 STOP，开始了就走完。

**快速创建 🍅 任务**  
只想开始专注时，输入任务名是一种摩擦。一个 🍅 任务零输入，直接开始。

---

## 🤖 AI 协作过程

| 阶段 | 人的角色 | AI Agent 的角色 |
|------|---------|---------------|
| 产品定义 | 使用场景、功能边界、设计约束 | — |
| 交互设计 | 状态机、任务流程、边界情况 | — |
| 视觉风格 | 像素美学、配色体系、字体选择 | CSS 生成与迭代 |
| 代码实现 | Code Review、逻辑校验、测试 | HTML/CSS/JS 生成 |
| 插件架构 | Manifest V3、Service Worker、Side Panel API | 脚手架与 API 集成 |
| 打磨调优 | 像素级调整、响应式适配 | 快速反馈迭代 |

---

## 🛠 技术栈

- HTML5 + CSS3 + Vanilla JavaScript（Demo）
- Chrome Extension Manifest V3（Side Panel、Service Worker、Storage、Notifications）

---

## 📂 项目结构

```
tomato_clock/
├── index.html              # 在线 Demo（自包含）
├── extension/              # Chrome 插件
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
