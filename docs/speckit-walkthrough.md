# SpecKit 流水线实战示例

> 本文用一个完整的示例场景 —— **给博客网站添加评论系统** —— 串联整条 SpecKit 流水线,展示每个环节的输入、命令、产出与典型内容。
>
> 流水线: `初始化 → constitution → specify → clarify → plan → tasks → analyze → implement`

---

## 0. 初始化新项目(只做一次)

### 适用场景

- 全新仓库,第一次引入 SpecKit
- 老仓库迁入 SDD 流程

### 步骤

#### 0.1 安装 specify CLI

```powershell
# 推荐用 uv / pipx 安装,避免污染全局 Python
uv tool install specify-cli
# 或
pipx install specify-cli
```

#### 0.2 在仓库根目录初始化

```powershell
# 在已有文件夹内初始化(--here 表示就地)
specify init --ai copilot --here

# 如果团队多人用不同 IDE,每人加一份自己的入口(共用 .specify/)
specify init --ai cursor-agent   --here
specify init --ai qodercli   --here
```

执行后会生成:

```
.specify/
├── memory/                 # constitution.md 等长期记忆
├── templates/              # spec/plan/tasks/checklist 模板
├── scripts/
│   ├── bash/               # macOS/Linux 脚本
│   └── powershell/         # Windows 脚本
└── extensions/
    └── git/                # Git 钩子(branch、commit、validate...)

.github/agents/             # Copilot 入口(若 --ai copilot)
.github/prompts/
.github/copilot-instructions.md

.cursor/rules/              # Cursor 入口(若 --ai cursor-agent)
.cursor/skills/

.qoder/commands/            # Qoder 入口(若 --ai qodercli)
QODER.md                    # 

```

#### 0.3 提交基线

```powershell
git checkout -b chore/init-speckit
git add .specify .github CONTRIBUTING.md
git commit -m "chore: bootstrap SpecKit (SDD pipeline)"
git push --set-upstream origin chore/init-speckit
# 走标准 PR 流程合入 main
```

#### 0.4 配置团队约定(推荐)

编辑 `.specify/extensions/git/git-config.yml`:

```yaml
branch_numbering: timestamp        # 多人协作避免编号抢占
auto_commit:
  default: false
  after_specify:  { enabled: true, message: "spec: add specification" }
  after_plan:     { enabled: true, message: "plan: add implementation plan" }
  after_tasks:    { enabled: true, message: "tasks: generate task breakdown" }
```

#### 0.5 验证

在 IDE 中输入 `/speckit.constitution`,若 agent 能识别命令并提示进入向导,说明初始化成功。

---

## 1. `constitution` — 立项目宪章

### 输入

团队的红线规则,例如:

> 我们是 Next.js 博客项目,要求:① 所有功能必须可在静态导出模式运行;② 第三方依赖必须 MIT/Apache 兼容;③ 用户输入数据必须经过校验后再持久化。

### 命令

```text
/speckit.constitution 添加 3 条核心原则:静态导出兼容、依赖许可证白名单、输入校验强制
```

### 产出 `.specify/memory/constitution.md` 节选

```markdown
<!-- Sync Impact Report
Version: 0.0.0 → 1.0.0 (MAJOR, initial ratification)
Added: Principle I/II/III, Governance
-->
# Project Constitution

**Version**: 1.0.0
**Ratified**: 2026-05-29
**Last Amended**: 2026-05-29

## Principle I: Static-Export Compatibility (MUST)
所有功能必须在 `next export` 模式下可运行。**禁止**引入仅在 Node.js runtime 才能工作的 API(如动态路由 SSR、middleware)。
**Rationale**: 项目部署目标为 CDN 静态托管。

## Principle II: License Whitelist (MUST)
新增 npm 依赖前必须确认其 license ∈ {MIT, Apache-2.0, BSD-2/3, ISC}。

## Principle III: Input Validation (MUST)
任何来自用户的输入(表单、URL 参数、API body)必须先经 zod schema 校验,失败返回结构化错误。

## Governance
变更需 Tech Lead + 1 名维护者 PR Review,版本号遵循 SemVer。
```

> 这份宪章会被所有后续 agent 加载,作为"红线"自动检测。

---

## 2. `specify` — 把需求变成 spec

### 输入

PM 的一句话需求:

> 我想给博客文章详情页加评论系统,游客可发表昵称+内容,登录用户可点赞,管理员可删除违规评论。

### 命令

```text
/speckit.specify 给博客文章详情页添加评论系统:游客可发表昵称+评论内容,登录用户可点赞,管理员可删除违规评论
```

### Agent 自动行为

1. 生成短名 `comment-system`
2. 通过 `git.feature` 钩子创建分支 `20260529-101530-comment-system`
3. 创建目录 `specs/20260529-101530-comment-system/`
4. 生成 `spec.md` + `checklists/requirements.md`
5. 交互式补全 ≤3 个 `[NEEDS CLARIFICATION]`

### 产出 `spec.md` 节选

```markdown
# Feature: Comment System

## User Scenarios

### US1 (P1): 游客发表评论
作为未登录访客,我可以在文章详情页输入昵称(2-20 字)和评论内容(1-500 字),
提交后看到自己刚发表的评论。

### US2 (P2): 登录用户点赞
作为已登录用户,我可以对任意评论点赞/取消点赞,同一评论同一用户只计 1 次。

### US3 (P3): 管理员删除
作为管理员,我可以软删除任意违规评论,被删除评论显示"该评论已删除"。

## Functional Requirements
- **FR-001** 系统 MUST 在文章详情页底部展示评论列表(按时间倒序)
- **FR-002** 评论内容 MUST 经过敏感词过滤
- **FR-003** 同一 IP 1 分钟内最多发表 5 条评论
- **FR-004** 点赞数 MUST 实时更新(允许 ≤2s 延迟)

## Success Criteria
- **SC-001** 95% 评论提交在 1 秒内成功
- **SC-002** 文章页加载评论模块不阻塞首屏(LCP 不退化超过 100ms)
- **SC-003** 管理员删除评论后 3 秒内对所有用户不可见

## Key Entities
- **Comment**: id, articleId, authorName, authorUserId?, content, createdAt, likeCount, isDeleted
- **Like**: commentId, userId, createdAt

## Assumptions
- 现有用户系统提供 `currentUser` API
- 敏感词词库由现有 `lib/profanity` 模块提供
```

---

## 3. `clarify` — 消除歧义

### 输入

读 spec 后发现的模糊点。Agent 自动从 11 类(功能/数据/UX/非功能/集成/边界...)扫描出歧义。

### 命令

```text
/speckit.clarify
```

### 交互示例(Agent 一次问一个,最多 5 个)

> **Q1: 游客发表评论时,是否需要图形验证码防刷?**
>
> **Recommended: A** — 因为已有 IP 限流,加验证码会损伤体验。
>
> | Option | Description |
> |---|---|
> | A | 不加验证码,仅 IP 限流(FR-003) |
> | B | 第 3 条起触发图形验证码 |
> | C | 始终强制图形验证码 |
>
> 你的回答?

用户回 `A`,Agent 把答案写回 spec:

```markdown
## Clarifications

### Session 2026-05-29
- Q: 游客发表评论是否需图形验证码 → A: 不加验证码,仅依赖 IP 限流
- Q: 评论支持 Markdown 吗 → A: 仅纯文本 + 自动链接识别
- Q: 删除是软删除还是硬删除 → A: 软删除,保留 30 天后清理
```

并自动更新对应章节(如 FR-002 增加"仅纯文本")。

---

## 4. `plan` — 出技术方案

### 命令

```text
/speckit.plan 用 Next.js App Router + Route Handler + Cloudflare D1 (SQLite),前端 React Server Components
```

### Agent 自动行为

1. 加载 spec 与 constitution
2. 生成 Technical Context、Constitution Check
3. **Phase 0** 调研:Cloudflare D1 性能、zod schema 设计、敏感词过滤库选型
4. **Phase 1** 输出设计文档

### 产出文件

```
specs/20260529-101530-comment-system/
├── plan.md                # 总体方案
├── research.md            # 技术调研
├── data-model.md          # 数据模型
├── contracts/
│   ├── post-comment.openapi.yaml
│   ├── like-comment.openapi.yaml
│   └── delete-comment.openapi.yaml
└── quickstart.md          # 集成验证步骤
```

### `data-model.md` 节选

```markdown
## Comment
| Field | Type | Constraints |
|---|---|---|
| id | TEXT (uuid) | PK |
| articleId | TEXT | FK → articles.id, indexed |
| authorName | TEXT | NOT NULL, length 2-20 |
| authorUserId | TEXT? | FK → users.id |
| content | TEXT | NOT NULL, length 1-500 |
| isDeleted | INTEGER | 0 or 1, default 0 |
| createdAt | INTEGER | unix ms |

## Constitution Check
- ✅ Principle I: D1 通过 fetch API 调用,兼容静态导出 + Edge Function
- ✅ Principle II: zod (MIT)、d1-orm (MIT) 均合规
- ✅ Principle III: 所有 Route Handler 入口套 zod schema
```

---

## 5. `tasks` — 拆成可执行任务

### 命令

```text
/speckit.tasks
```

### 产出 `tasks.md` 节选

```markdown
# Tasks: Comment System

## Phase 1: Setup
- [ ] T001 在 Cloudflare 创建 D1 数据库并写入 wrangler.toml
- [ ] T002 [P] 安装依赖 zod, drizzle-orm/d1 并校验许可证

## Phase 2: Foundational
- [ ] T003 在 db/schema.ts 定义 comments、likes 表
- [ ] T004 在 lib/db.ts 暴露 getDb() 单例

## Phase 3: User Story 1 — 游客发表评论 (P1)
- [ ] T005 [P] [US1] 创建 zod schema lib/schemas/comment.ts
- [ ] T006 [P] [US1] 实现 POST /api/comments route handler app/api/comments/route.ts
- [ ] T007 [US1] 实现 IP 限流中间件 lib/rate-limit.ts
- [ ] T008 [US1] 实现 components/CommentForm.tsx 提交表单
- [ ] T009 [US1] 在 app/posts/[slug]/page.tsx 接入评论列表与表单

## Phase 4: User Story 2 — 点赞 (P2)
- [ ] T010 [P] [US2] POST /api/comments/[id]/like route handler
- [ ] T011 [US2] components/LikeButton.tsx (乐观更新)

## Phase 5: User Story 3 — 管理员删除 (P3)
- [ ] T012 [US3] DELETE /api/comments/[id] (需 admin 权限)
- [ ] T013 [US3] 管理员 UI: components/AdminCommentActions.tsx

## Phase 6: Polish
- [ ] T014 [P] 性能压测脚本验证 SC-001 (1s 内成功率 ≥95%)
```

> 严格遵守格式: `- [ ] [TaskID] [P?] [Story?] 描述 文件路径`。

---

## 6. `analyze` — 一致性体检(只读)

### 命令

```text
/speckit.analyze
```

### 产出报告(仅控制台,不落盘)

```markdown
## Specification Analysis Report

| ID | Category | Severity | Location | Summary | Recommendation |
|---|---|---|---|---|---|
| C1 | Constitution | CRITICAL | plan.md:L42 | 使用了 middleware,违反 Principle I | 改用 Route Handler 内联限流 |
| A1 | Ambiguity | HIGH | spec.md:FR-004 | "实时更新"未量化 | 已在 clarify 阶段定义为 ≤2s,确认无遗漏 |
| G1 | Gap | MEDIUM | tasks.md | SC-002 (LCP 不退化) 没有对应任务 | 新增 T015 测量 LCP 基线 |

## Coverage Summary
| Requirement | Has Task? | Task IDs |
|---|---|---|
| FR-001 | ✅ | T009 |
| FR-002 | ✅ | T005, T006 |
| FR-003 | ✅ | T007 |
| FR-004 | ✅ | T010, T011 |
| SC-002 | ❌ | (Gap → 建议加 T015) |

## Metrics
- Total Requirements: 4 FR + 3 SC
- Total Tasks: 14
- Coverage: 86% (6/7)
- CRITICAL Issues: 1
- Recommendation: **修复 C1 后再 implement**
```

> CRITICAL = 1,**禁止**进入 implement,必须先回 plan/tasks 修复。

---

## 7. `implement` — 真正写代码

### 前置检查

1. 所有 `checklists/*.md` 项已勾选 `[X]`
2. `analyze` CRITICAL = 0

### 命令

```text
/speckit.implement
```

### Agent 行为

1. 检测技术栈(Next.js + TypeScript)→ 校对 `.gitignore` 包含 `.next/`、`node_modules/`
2. 按 Phase 顺序执行 T001 → T014
3. 同 phase 内 `[P]` 任务并发,同文件任务串行
4. 每完成一个任务把 `tasks.md` 中 `- [ ]` 改为 `- [X]`
5. 任意非并行任务失败立即停下并报告

### 完成态 `tasks.md`

```markdown
## Phase 3: User Story 1 — 游客发表评论 (P1)
- [X] T005 [P] [US1] 创建 zod schema lib/schemas/comment.ts
- [X] T006 [P] [US1] 实现 POST /api/comments route handler app/api/comments/route.ts
- [X] T007 [US1] 实现 IP 限流中间件 lib/rate-limit.ts
- [X] T008 [US1] 实现 components/CommentForm.tsx 提交表单
- [X] T009 [US1] 在 app/posts/[slug]/page.tsx 接入评论列表与表单
```

### 完成报告

```text
✅ 14/14 tasks completed
✅ All FR/SC mapped to implementation
✅ Constitution principles upheld (re-checked post-implementation)

Suggested next:
  - 运行 npm run test
  - 提 PR 并按 CONTRIBUTING.md §7.1 自检
```

---

## 全流程速查表

| 阶段 | 谁来做 | 命令 | 关键产出 | 是否合入 main |
|---|---|---|---|---|
| 0. 初始化 | Tech Lead | `specify init --ai <ide> --here` | `.specify/`, IDE 入口 | ✅ |
| 1. constitution | Tech Lead | `/speckit.constitution` | `constitution.md` | ✅ |
| 2. specify | PM | `/speckit.specify <需求>` | `spec.md` | ✅ |
| 3. clarify | PM | `/speckit.clarify` | spec 增补 `## Clarifications` | ✅ |
| 4. plan | 资深开发 | `/speckit.plan <技术栈>` | `plan.md`, `data-model.md`, `contracts/` | ✅ |
| 5. tasks | 开发 | `/speckit.tasks` | `tasks.md` | ❌ 合并前清理 |
| 6. analyze | 任意 | `/speckit.analyze` | 控制台报告 | — |
| 7. implement | 开发 | `/speckit.implement` | 代码 + 已勾选 tasks | 代码 ✅ |

---

**关联文档**

- [agents-outline.md](agents-outline.md) — 每个 agent 的内部步骤
- [CONTRIBUTING.md](CONTRIBUTING.md) — 团队协作规范
