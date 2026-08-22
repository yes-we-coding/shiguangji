---
title: SDD 工具横评：Spec Kit / OpenSpec / get-shit-done / Kiro 该选谁
date: 2026-08-22
excerpt: GitHub Spec Kit 一年了，1.0.0 刚发；同时 OpenSpec、get-shit-done、AWS Kiro 都还在被重写。这篇是 2026 年中 SDD 工具的一次横评 —— 各自定位、适用场景、上手成本，以及真实项目里踩过的坑。
tags: [AI, 工具]
pinned: false
---

最近一周发现 SDD（Spec-Driven Development，规格驱动开发）这个赛道**同时在重新洗牌**：

- GitHub 官方的 [spec-kit](https://github.com/github/spec-kit) 8 月 21 号发了一周年纪念 + 1.0.0（"it is now just a number"）
- [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) 还在以每周 PR 的速度改写 spec 流程
- [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) 是 Claude Code 用户里**最常被提到的**非官方工具
- AWS [Kiro](https://kiro.dev) 作为商业 IDE 已经发布，但定位完全不同
- 还有 [spec-workflow-mcp](https://github.com/Pimzino/spec-workflow-mcp)、[agent-os](https://github.com/buildermethods/agent-os) 这一类"补充件"

我最近一周把主流的几个都跑了一遍（除了 Kiro 之外都是开源）。这篇给正在选型的朋友一个**尽量不偏不倚的对比**。

## 先说 SDD 到底是什么

简单说，**把 spec 当成代码的"唯一事实来源"**，AI agent 据此生成代码，而不是反过来。

GitHub Spec Kit 自己的定义很直白：

> Specifications become **executable**, directly generating working implementations rather than just guiding them.

这条原则下，主流工具做的事大致是：

1. **写 spec**（自然语言 / 模板 / 结构化文档）
2. **生成任务清单 / 拆分**
3. **AI agent 按 spec 实现**
4. **验证 + 迭代**

但每个工具在这四步上**侧重点不同**。这也是横评的意义 —— 不能只看 star 数。

## 横评总览

| 工具 | 维护方 | 形态 | star | 上手成本 | 适合谁 |
|---|---|---|---:|---|---|
| **GitHub Spec Kit** | GitHub 官方 | CLI + 模板 | 130k | 中 | 任何 AI 编码工具的团队/个人 |
| **OpenSpec** | Fission-AI | CLI + 多 agent 支持 | 65k | 低 | 想"轻装上 SDD"的个人开发者 |
| **get-shit-done** | gsd-build | Claude Code 子系统 | 64k | 高 | Claude Code 重度用户 / 想做长跑任务 |
| **AWS Kiro** | AWS | 商业 IDE | — | 中 | 在 AWS 生态、想要 IDE 内体验 |
| **spec-workflow-mcp** | Pimzino | MCP server + 仪表盘 | 4k | 中 | 想在 IDE 里看 spec 状态的人 |
| **agent-os** | buildermethods | 标准注入 | 5k | 低 | 老项目想"对 AI 注入内部规范" |

## 详细对比

### 1. GitHub Spec Kit（1.0.0 刚发）

GitHub 去年 8 月立项，今年 8 月发 1.0.0。维护者 Manorrock 在周年文章里写了一句很 GitHub 风格的话：

> the value moves from stability to adaptability

意思是：**版本号不再代表"稳定"，而是代表"成熟到足以继续演进"**。这跟 SaaS 化之后的 GitHub 整套哲学一致。

Spec Kit 的核心是 `specify` CLI，加上大量**预设模板（templates / presets）**。你可以选：

- `constitution.md` — 项目宪法层（不可改的核心原则）
- `spec.md` — 需求层
- `plan.md` — 技术方案层
- `tasks.md` — 任务拆分层

**优势：**
- **官方背书 + 1.0.0**，生态在快速长大。Microsoft、GitHub 内部已经在用
- 任何 AI coding agent 都能用，不绑死工具（Cursor / Claude Code / Copilot / Gemini CLI）
- 模板系统很灵活，可以做"角色化配置"（bundles）
- 文档质量高：spec-kit 的 [github.io/spec-kit](https://github.github.io/spec-kit/) 站是 SDD 工具里写得最清楚的

**坑：**
- 1.0.0 刚发，**breaking change 仍在持续**。我跑下来发现 0.x 的 spec 文件在 1.0.0 上**不一定能平滑迁移**
- "constitution" 这个概念很重——你不一定需要那么重
- 对小项目 / hackathon 太重，杀鸡用牛刀

**适合：** 团队级项目、要做长期维护的代码、对 spec 流程有规范化要求的组织。

### 2. Fission-AI OpenSpec

定位很直白：**"SDD for AI coding assistants"**。

跟 Spec Kit 的区别在于：

- **没有 constitution 层**，门槛低
- **CLI 设计更简洁**，5 个命令就能跑通完整流程：`openspec init / proposal / apply / archive / show`
- **支持任意 AI 助手**，但配置上稍微偏 Cursor / Claude Code

我跑了一遍完整流程，体感：

- `openspec proposal <name>` 一条命令生成 proposal（spec + tasks + design）
- AI 助手按 proposal 实现
- `openspec archive` 把已实现的 spec 归档

**优势：**
- 上手 10 分钟，**比 Spec Kit 体感轻 50%**
- 流程闭环完整：写 spec → 实现 → 归档
- proposal 文件结构好读，团队 review 友好

**坑：**
- **维护节奏激进**，最近一个月几乎每周都有 breaking change。我跑的版本上周升过一次，要重写已经写的 spec
- 没有 Spec Kit 那么强的"组织级"配置（bundles / presets）
- 文档相对薄

**适合：** 个人项目 / 小团队 / 想要"先跑起来"的人。

### 3. gsd-build/get-shit-done

这个名字...我承认第一次看到时笑了。但它**不是玩梗**——README 写得很认真，star 数 64k 不是白来的。

定位：**Claude Code 专属的 SDD 系统**。

跟 Spec Kit / OpenSpec 最大的区别：

- **深度集成 Claude Code 的 subagent 体系**
- 核心是**长跑任务的 context engineering**
- 强调 "**meta-prompting**"：用一个 spec 帮你生成更好的 prompt

我跑下来的体感：

- 它不是 CLI，是一个**Claude Code 的工作流框架**
- 你 `git clone` 下来之后，Claude Code 会自动识别 `/gsd:*` 命令
- 工作流：`/gsd:new-project` → `/gsd:plan-phase` → `/gsd:execute-phase`

**优势：**
- **长跑任务表现极好**——这是它的核心卖点。如果你要让 Claude Code 跑 1 小时以上不出错，get-shit-done 是目前最好的工具
- meta-prompting 的思路真的有效：先写 spec，spec 帮你生成更好的 prompt，prompt 帮你写出更好的代码
- 跟 Claude Code 的集成是**原生深度**——不是 wrapper

**坑：**
- **只能用在 Claude Code**——这是最大限制。如果你用 Cursor / Copilot / Gemini，绕路很多
- 学习曲线陡。`/gsd:*` 命令有 20+ 个，不读 README 根本玩不转
- 项目里**所有 spec 都用 markdown**，没有强 schema 校验。如果团队里有"spec 写法不统一"的倾向，会很乱

**适合：** Claude Code 重度用户 / 想做复杂长跑任务的人 / 不怕学习曲线的人。

### 4. AWS Kiro

商业 IDE，2025 年发布。

跟上面三个**完全不在一个赛道**——Spec Kit / OpenSpec / GSD 都是开源 CLI 或 framework，Kiro 是一个**完整的 AI IDE**。类似 Cursor + SDD 内置。

我没深度用，但看了一圈 demo：

**优势：**
- **IDE 内一体化**——写代码、写 spec、看 diff 都在一个界面
- AWS 生态集成（如果你在 AWS 上跑业务，可能有用）
- 文档质量好（毕竟是商业产品）

**坑：**
- **贵**（订阅制，具体价格我没查清楚）
- **Vendor lock-in**：spec 跟 IDE 绑死。换工具要重写
- AI 模型锁定（推测是 Claude / Amazon Nova 二选一）
- 开源生态隔离——你写的 spec 不能直接迁到 Spec Kit / OpenSpec

**适合：** 已经在 AWS 生态 / 不在意 vendor lock-in / 想要 IDE 体验 / 团队有预算。

### 5. spec-workflow-mcp（MCP server）

是个 **MCP server**——你跑起来之后，Claude Code / Cursor 之类支持 MCP 的 IDE 就能用它的工具。

**优势：**
- **有一个 web dashboard**——可以在浏览器里看 spec 状态
- VSCode 扩展
- 跟 Spec Kit / OpenSpec 都能配合用

**坑：**
- 本身不是 SDD 工具，是**配合 SDD 工具的可视化层**
- star 4k，社区还在早期

**适合：** 已经在用 Spec Kit 或 OpenSpec、想要更好的可视化的人。

### 6. agent-os

定位很特别："**往 agent 里注入你的代码库标准**"。

我跑了一下，发现它干的事其实更接近"团队规范管理"——你写一套 `standards/*.md`，agent-os 让 AI 在写代码前**先读这些规范**。

**优势：**
- 老项目友好——可以把内部规范（命名、目录结构、错误处理风格）变成 agent 必读项
- 跟其它 SDD 工具配合用，不冲突

**坑：**
- 不单独构成完整 SDD 流程
- 文档很薄

**适合：** 老项目 / 团队规范很重的代码库。

## 我的选择

如果是 2026 年 8 月的"我自己"开始一个新项目：

1. **小项目 / 个人**：直接 **OpenSpec**。上手快，门槛低，跑通完整流程 1 小时
2. **中等项目 / 团队**：用 **GitHub Spec Kit**。1.0.0 之后稳定性上来了，组织级功能齐全，未来迁移成本低
3. **长跑任务 / Claude Code 重度用户**：**get-shit-done**。长跑表现没对手，但要学它的 `/gsd:*` 命令
4. **不想折腾 / 团队有预算**：**Kiro**。交钱省时间

我自己的 my-blog 项目之前是用 Spec Kit 跑的 0.x 版本，最近升级到 1.0.0 的时候**确实要重写一些 spec**——这就是"版本号不再代表稳定"的代价。但长远看，官方背书 + 大社区，值得这个切换成本。

## 一些观察

1. **SDD 工具现在是"每周一版"状态**。OpenSpec、Spec Kit、GSD 最近一个月都有过 breaking change。要做好"spec 文件也要版本管理"的心理准备
2. **「spec 写法」比「spec 工具」重要 10 倍**。工具换来换去，spec 内容写不好都白搭。建议先学 OpenSpec 的 proposal 模板写法，再选工具
3. **「meta-prompting」（get-shit-done 的核心）是个被低估的概念**。spec 不只是给 agent 看的——它是给后续 agent 生成 prompt 用的中间产物。这个思路未来几年会很值钱
4. **Kiro 这种"商业 IDE 化"的路径风险大**。一旦绑死，未来想换 Spec Kit / OpenSpec 生态就要重写一切。我个人会**优先选开源**
5. **AI agent 工具链还在剧烈整合**。Spec Kit 1.0.0 + OpenSpec 活跃开发 + GSD 持续迭代，说明大家都还在找"最舒服的工作流"。**别选站边太早，先跑半年再说**

## 参考

- [GitHub Spec Kit 官网](https://github.github.io/spec-kit/)
- [Spec Kit Turns One（1.0.0 发布说明）](https://www.manorrock.com/blog/2026/08/21/spec_kit_turns_one.html)
- [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)
- [AWS Kiro](https://kiro.dev)
- [Pimzino/spec-workflow-mcp](https://github.com/Pimzino/spec-workflow-mcp)
- [buildermethods/agent-os](https://github.com/buildermethods/agent-os)

> 这篇是 2026-08-22 这一周的快照。SDD 工具变化很快，过几个月有些数据可能会过时——以 GitHub 仓库 README 为准。