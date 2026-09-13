# 🍅 TOMATO CLOCK — 像素番茄时钟

**中文** · [English](README.en.md)

> 一个像素复古风格的番茄时钟 Chrome 插件。
> 由产品经理用 AI coding agent 从零独立构建。
> 专为学习与个人沉淀场景设计——每次打开新标签页，都是一次专注的开始。

🔗 [在线 Demo](https://你的用户名.github.io/tomato_clock) · 🧩 [Chrome Web Store](#)

---

## 🎯 为什么做这个

下班后想系统学点东西，但手机、社交媒体、短视频不断分散注意力。市面上的番茄钟要么太复杂，要么不够好看——作为一个有 vibe coding 经验的产品经理，我决定自己做一个。

这是一个 **PM × AI 协作** 的产物：产品设计我来定，代码由 AI coding agent 完成。

---

## ✨ 产品亮点

- **像素复古美学** — Press Start 2P 字体 + 像素阴影 + 动态渐变背景，减少视觉疲劳
- **新标签页即入口** — 每次打开新标签页就是一次专注的起点，零摩擦启动
- **三模式自动流转** — 专注 → 短休 → 专注 → 长休，无需手动切换
- **单任务聚焦** — 一次只做一件事，避免多任务并行带来的伪效率
- **后台计时不中断** — 关闭标签页计时继续，通过通知和 badge 提醒
- **零依赖，完全离线** — 单文件 HTML 可独立运行，Chrome 插件无需网络

---

## 📸 预览

![TOMATO CLOCK Demo](assets/demo.gif)

---

## 🚀 快速开始

### 在线体验

直接访问 [GitHub Pages Demo](https://你的用户名.github.io/tomato_clock)

### Chrome 插件安装

1. 下载本仓库
2. 打开 Chrome，进入 `chrome://extensions/`
3. 开启「开发者模式」
4. 点击「加载已解压的扩展程序」，选择 `extension/` 目录
5. 每次打开新标签页即可开始专注

---

## 🧠 产品设计思路

### 为什么是像素风格？

在碎片化信息过载的时代，像素风格有一种「回到纯粹」的心理暗示。低饱和度的红色背景降低攻击性，像素阴影和等宽字体减少视觉噪音，让用户更快进入专注状态。

### 为什么是单任务？

番茄工作法的核心是「一次只做一件事」。市面上很多番茄钟允许并行多个任务，这其实违背了方法论的本意。这里强制单任务聚焦——如果你想切换任务，需要先完成或放弃当前任务。

### 为什么是新标签页？

学习场景下，打开浏览器通常是分心的起点（刷社交媒体、看视频）。把番茄钟放在新标签页，意味着每次这个动作都被拦截，变成一次「要不要先专注一会儿」的自我提醒。

---

## 🤖 我是怎么用 AI 做的

| 阶段 | 我的角色 | AI 的角色 |
|------|---------|----------|
| 需求定义 | 确定场景（学习/个人沉淀）、功能边界、设计风格 | — |
| 交互设计 | 画出三模式状态机、任务管理流程 | — |
| 视觉风格 | 选定像素风格、配色方案、字体体系 | 生成 CSS 初稿 |
| 代码实现 | Code Review、逻辑校验、边界 case 测试 | 生成 HTML/CSS/JS |
| Chrome 插件化 | 定义 manifest、Service Worker 架构 | 生成插件代码 |
| 迭代打磨 | 像素级 UI 调整、动画细节、响应式适配 | 根据反馈修改 |

---

## 🛠 技术栈

- 纯前端，零框架依赖
- HTML5 + CSS3 + Vanilla JavaScript
- Chrome Extension Manifest V3
- Chrome Storage API / Service Worker / Notifications API
- GitHub Pages 部署

---

## 📂 项目结构

```
tomato_clock/
├── index.html          ← 在线 Demo（GitHub Pages）
├── README.md
├── extension/          ← Chrome 插件
│   ├── manifest.json
│   ├── newtab.html
│   ├── newtab.js
│   ├── background.js
│   ├── styles.css
│   └── icons/
└── assets/
    └── demo.gif
```

---

## 📝 License

MIT
