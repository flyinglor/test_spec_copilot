# Spec-Kit Agents 大纲

本文件汇总 `.github/agents/` 目录下每个 agent 提示词的职责与执行步骤。这些 agent 共同实现了 **Spec-Driven Development(SDD,规约驱动开发)** 工作流,把一个特性从自然语言想法 → 规约 → 澄清后的规约 → 计划 → 任务 → 分析 → 实现一路推进,并由可选的 Git/GitHub 集成 agent 作为钩子(hook)穿插其中。

所有 agent 都遵循统一的结构:

- YAML 头部(`description`,可选的 `handoffs` 用于指向下一个 agent)。
- 一个消费 `$ARGUMENTS` 的 `## User Input` 段落。
- **执行前钩子(Pre-Execution Hooks)**:读取 `.specify/extensions.yml` 中的 `hooks.before_<command>` 条目,并打印或执行它们。
- 核心的 **Outline / Execution Steps(执行步骤)** 段落。
- **执行后钩子(Post-Execution Hooks)**:对 `hooks.after_<command>` 执行同样的逻辑。

典型的端到端流程:

```
constitution → specify → clarify → plan → tasks → (analyze) → implement
                                              ↓
                                      (taskstoissues 用于推送到 GitHub)

git.* 系列 agent 在全程作为钩子参与(initialize、feature 分支、commit、validate、remote)
```

---

## 核心工作流 Agents

### 1. `speckit.constitution.agent.md`
**目的**:创建或更新项目宪章(`.specify/memory/constitution.md`)—— 这是后续所有阶段都不可妥协的红线原则。

**步骤**:
1. 运行 `before_constitution` 钩子。
2. 加载现有宪章(若不存在则从模板复制);识别所有 `[ALL_CAPS]` 占位符。
3. 为占位符收集/推导具体值(来自用户输入、仓库上下文或历史版本)。
4. 决定语义化版本号 bump 类型(MAJOR / MINOR / PATCH),并更新日期(`RATIFICATION_DATE`、`LAST_AMENDED_DATE`)。
5. 起草更新后的宪章:替换占位符,确保每条原则都有规则 + 理由,确保治理(Governance)章节存在。
6. 运行一致性传播校验:对照 `plan-template.md`、`spec-template.md`、`tasks-template.md`、command 文件以及运行时指引文档。
7. 在文件顶部以 HTML 注释方式生成 **Sync Impact Report(同步影响报告)**:版本变更、修改/新增/删除的章节、需要更新的模板、延后的 TODO。
8. 校验:不再有遗留的方括号占位符、日期是 ISO 格式、原则是声明式且可被检验的。
9. 写回 `.specify/memory/constitution.md`。
10. 输出摘要 + 建议的 commit message。
11. 运行 `after_constitution` 钩子。

**Handoff(下一步)**:→ `speckit.specify`

---

### 2. `speckit.specify.agent.md`
**目的**:把自然语言的特性描述转化为结构化的 `spec.md`,聚焦"做什么(WHAT)"和"为什么(WHY)"——不涉及实现细节。

**步骤**:
1. 运行 `before_specify` 钩子(通常会调用 `git.feature` 创建分支)。
2. 从描述中生成一个 2–4 个词的短名称(动词-名词形式)。
3. 解析 `SPECIFY_FEATURE_DIRECTORY`(位于 `specs/` 下,使用 `NNN-` 顺序编号或 `YYYYMMDD-HHMMSS-` 时间戳前缀)。
4. 创建目录,把 `spec-template.md` 复制为 `spec.md`,并把路径持久化到 `.specify/feature.json`。
5. 解析描述 → 提取参与者(actors)、动作(actions)、数据(data)、约束(constraints)。
6. 对模糊点做合理推测;只对最高影响的项最多标注 **3 个** `[NEEDS CLARIFICATION]` 标记。
7. 填充用户场景(User Scenarios)、功能需求(Functional Requirements,可测试)、成功标准(Success Criteria,可度量、与技术栈无关)、关键实体(Key Entities)。
8. 写出规约。
9. **质量校验**:
   - 生成 `checklists/requirements.md`,包含内容/完整性/就绪度三类检查项。
   - 最多迭代 3 次解决失败项;以表格形式交互解决 `[NEEDS CLARIFICATION]`(最多 3 个问题)。
10. 报告 `SPECIFY_FEATURE_DIRECTORY`、`SPEC_FILE`、checklist 结果。
11. 运行 `after_specify` 钩子。

**Handoffs**:→ `speckit.clarify` 或 → `speckit.plan`

---

### 3. `speckit.clarify.agent.md`
**目的**:通过最多 **5 个有针对性的问题**消除 `spec.md` 中的歧义,并把答案回写到规约中。

**步骤**:
1. 运行 `before_clarify` 钩子。
2. 运行 `check-prerequisites.ps1 -Json -PathsOnly`;加载规约。
3. 运行**结构化歧义扫描**,覆盖 11 类分类法(功能范围、领域与数据、UX 流程、非功能性、集成、边界情况、约束、术语、完成信号、其他/占位符),为每类标记 Clear / Partial / Missing。
4. 构建优先级队列(≤ 5 个候选问题,可选项 2–5 项的多选题或 ≤ 5 字短答)。
5. **顺序交互循环**:每次只问一个问题,附带推荐/建议答案 + 选项表;接受 "yes"/"recommended"/"suggested" 或选项字母。
6. 每接受一个答案,**增量更新规约**:
   - 确保 `## Clarifications` 段落与 `### Session YYYY-MM-DD` 子标题存在。
   - 追加 `- Q: ... → A: ...` 这一行。
   - 把答案应用到对应章节(功能需求、用户故事、数据模型、成功标准、边界情况、术语)。
   - 每次合并后原子化保存文件。
7. 校验:已接受问题 ≤ 5 个、无矛盾、标题层级未被破坏。
8. 最终报告:已问问题数、被改动的章节、覆盖率表(Resolved / Deferred / Clear / Outstanding)、建议的下一条命令。
9. 运行 `after_clarify` 钩子。

**Handoff**:→ `speckit.plan`

---

### 4. `speckit.plan.agent.md`
**目的**:产出实现计划(`plan.md`)及配套的设计工件(`research.md`、`data-model.md`、`contracts/`、`quickstart.md`)。

**步骤**:
1. 运行 `before_plan` 钩子。
2. 运行 `setup-plan.ps1 -Json` → 得到 `FEATURE_SPEC`、`IMPL_PLAN`、`SPECS_DIR`、`BRANCH`。
3. 加载规约与宪章;加载 IMPL_PLAN 模板。
4. 填写技术上下文(Technical Context,未知项标 `NEEDS CLARIFICATION`);填写宪章一致性检查(Constitution Check);评估准入门(gates)。
5. **Phase 0 — Research(调研)**:对每个未知点/依赖/集成派发调研任务;在 `research.md` 中固化(Decision / Rationale / Alternatives,即决策/理由/备选方案),直至所有 `NEEDS CLARIFICATION` 都被消除。
6. **Phase 1 — Design & Contracts(设计与契约)**:
   - 提取实体 → `data-model.md`(字段、关系、校验、状态迁移)。
   - 定义接口契约(API/CLI/UI 视项目而定)→ `/contracts/`。
   - 更新 `.github/copilot-instructions.md` 中位于 `<!-- SPECKIT START -->` / `<!-- SPECKIT END -->` 标记之间的 agent 上下文。
7. 设计完成后再次重新执行宪章一致性检查。
8. 在 Phase 2 规划完成后停下;报告分支、IMPL_PLAN 路径以及生成的工件。
9. 运行 `after_plan` 钩子。

**Handoffs**:→ `speckit.tasks` 或 → `speckit.checklist`

---

### 5. `speckit.tasks.agent.md`
**目的**:生成 `tasks.md` —— 一份可执行、按依赖排序、按用户故事组织的任务列表。

**步骤**:
1. 运行 `before_tasks` 钩子。
2. 运行 `setup-tasks.ps1 -Json` → 得到 `FEATURE_DIR`、`TASKS_TEMPLATE`、`AVAILABLE_DOCS`。
3. 加载 `plan.md`(必需)、`spec.md`(必需);可选:`data-model.md`、`contracts/`、`research.md`、`quickstart.md`。
4. **按用户故事**(P1、P2、P3 …)组织生成任务:
   - 把实体、契约、组件映射到它们所服务的故事。
   - 构建依赖图与并行执行示例。
5. 基于模板生成 `tasks.md`,包含:
   - Phase 1:Setup(初始化)
   - Phase 2:Foundational(阻塞性前置)
   - Phase 3+:每个用户故事一个 Phase(按优先级排序)
   - Final Phase:Polish 与跨切面收尾
6. **严格的 checklist 格式**:`- [ ] [TaskID] [P?] [Story?] 描述 文件路径`(例如 `T012 [P] [US1] Create User model in src/models/user.py`)。
7. 测试任务为可选 —— 仅在显式要求或采用 TDD 模式时生成。
8. 报告:任务总数、并行机会、MVP 范围(通常是 US1)。
9. 运行 `after_tasks` 钩子。

**Handoffs**:→ `speckit.analyze` 或 → `speckit.implement`

---

### 6. `speckit.analyze.agent.md`
**目的**:在实现前对 `spec.md`、`plan.md`、`tasks.md` 做**只读**的跨工件一致性/质量分析。

**步骤**:
1. 运行 `before_analyze` 钩子。
2. 运行 `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`;解析 SPEC、PLAN、TASKS 的绝对路径;若缺失则中止。
3. **渐进式加载**:仅从每个工件以及宪章中加载最少必要的章节。
4. 构建内部语义模型:需求清单(以 FR-/SC- 为主键)、用户故事动作清单、任务→需求的覆盖映射、宪章规则集。
5. **六类检测**(总数 ≤ 50 条):
   - A. Duplication(重复)
   - B. Ambiguity(歧义,模糊形容词、TODO/`<placeholder>`)
   - C. Underspecification(规约不足)
   - D. Constitution alignment(宪章一致性,MUST 原则)
   - E. Coverage gaps(覆盖缺口,需求 ↔ 任务)
   - F. Inconsistency(不一致,术语漂移、顺序冲突)
6. 分配严重级别:CRITICAL / HIGH / MEDIUM / LOW(违反宪章一律 CRITICAL)。
7. 输出 Markdown 报告:发现表、覆盖率表、宪章问题、未映射任务、度量指标。
8. 给出下一步行动(继续推进或先修复),并提供改进建议(**不**自动修改文件)。
9. 运行 `after_analyze` 钩子。

**约束**:严格只读 —— 永不修改任何文件。

---

### 7. `speckit.implement.agent.md`
**目的**:端到端执行 `tasks.md`,真正把特性构建出来。

**步骤**:
1. 运行 `before_implement` 钩子。
2. 运行 `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`。
3. **Checklist 门禁**:扫描 `FEATURE_DIR/checklists/`;若有未完成项,展示表格并询问用户是否继续。
4. 加载上下文:`tasks.md` + `plan.md`(必需);`data-model.md`、`contracts/`、`research.md`、`constitution.md`、`quickstart.md`(可选)。
5. **项目设置校验**:从 plan.md 检测技术栈,基于技术栈对应模式集创建/校验各类 ignore 文件(`.gitignore`、`.dockerignore`、`.eslintignore`、`.prettierignore`、`.npmignore`、`.terraformignore`、`.helmignore`)。
6. 解析 `tasks.md` → 提取阶段(Setup、Tests、Core、Integration、Polish)、依赖、`[P]` 并行标记。
7. **按阶段执行**:
   - 遵守"串行 vs 并行 `[P]`"规则。
   - 同一文件的任务始终串行。
   - TDD:存在测试任务时,测试先于实现。
8. 跟踪进度,在 `tasks.md` 中把已完成任务标记为 `[X]`;非并行任务失败立即停下;并行任务部分失败则继续完成成功的部分。
9. 完成校验:任务全部完成、特性与 spec 匹配、测试通过、计划被遵循。
10. 运行 `after_implement` 钩子。

---

### 8. `speckit.checklist.agent.md`
**目的**:生成领域专用的质量 checklist —— 被定义为"**英文的单元测试(Unit Tests for English)**",用于验证*需求是否写得好*,而不是验证实现行为。

**步骤**:
1. 运行 `before_checklist` 钩子。
2. 运行 `check-prerequisites.ps1 -Json`。
3. **澄清意图**:动态生成最多 3 个问题(可升级到 5 个),覆盖范围、风险优先级、深度、受众、排除项、场景缺口。使用 markdown 选项表。
4. 综合 `$ARGUMENTS` + 问答 → 推导主题(UX/安全/API/性能等)、深度、受众。
5. 加载 `spec.md` / `plan.md` / `tasks.md` 中相关的局部内容(渐进式披露,不要整篇 dump)。
6. 在 `FEATURE_DIR/checklists/[domain].md` 创建或追加:
   - 新文件 → ID 从 `CHK001` 开始;已存在文件 → 编号续接。
   - 项按质量维度分组:**完整性、清晰度、一致性、验收标准、场景覆盖、边界情况、非功能性、依赖与假设、歧义与冲突**。
7. **条目规则**:每条都是检验需求质量的问句(例如:*"'fast loading' 是否被量化为具体的时间阈值?[Clarity, Spec §NFR-2]"*)—— 永远不要写 `Verify/Test/Confirm` 等针对实现行为的检查。
8. ≥ 80% 条目必须包含可追溯标记 `[Spec §X.Y]` 或 `[Gap]`/`[Ambiguity]`/`[Conflict]`/`[Assumption]`。
9. 软上限约 40 条;合并重复项。
10. 报告文件路径、条目数、聚焦领域、深度、用户指定的 must-have 是否纳入。
11. 运行 `after_checklist` 钩子。

---

### 9. `speckit.taskstoissues.agent.md`
**目的**:通过 GitHub MCP 服务,把 `tasks.md` 中的每个任务转换为一个 GitHub Issue。

**工具**:`github/github-mcp-server/issue_write`

**步骤**:
1. 运行 `before_taskstoissues` 钩子。
2. 运行 `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`;定位 `tasks.md`。
3. 运行 `git config --get remote.origin.url`。
4. **硬性护栏**:仅当远端为 GitHub URL 时继续;**绝不**在不匹配的仓库下创建 issue。
5. 对每个任务 → 通过 MCP 在对应仓库下创建一个 GitHub issue。
6. 运行 `after_taskstoissues` 钩子。

---

## Git 扩展 Agents(钩子)

这些 agent 通常由 `.specify/extensions.yml` 中声明的 `before_*` / `after_*` 钩子机制触发,文件位于 `.specify/extensions/git/`。

### `speckit.git.initialize.agent.md`
**目的**:在缺失 Git 仓库时进行初始化。

**步骤**:
1. 运行扩展脚本(`initialize-repo.sh` / `.ps1`);若不存在则降级到 `git init && git add . && git commit -m "Initial commit from Specify template"`。
2. 若 Git 不可用或已经在 Git 仓库中,直接跳过。
3. 出现部分初始化失败时,把错误抛给用户并停下。

---

### `speckit.git.feature.agent.md`
**目的**:用顺序编号或时间戳编号创建特性分支。**只**负责分支创建 —— spec 目录与文件由 `speckit.specify` 负责。

**步骤**:
1. 验证 Git 可用。
2. 决定编号模式:`git-config.yml.branch_numbering` → `init-options.json.branch_numbering` → 默认 `sequential`。
3. 若用户提供了 `GIT_BRANCH_NAME`,逐字透传(跳过前缀逻辑)。
4. 生成 2–4 个词的短名称(动词-名词形式,保留首字母缩略词)。
5. 执行 `create-new-feature.sh/.ps1 --json --short-name "..." [--timestamp] "<feature description>"`。
6. 输出 JSON 中的 `BRANCH_NAME` + `FEATURE_NUM`。每个特性**只**运行一次。

---

### `speckit.git.commit.agent.md`
**目的**:在 Spec-Kit 命令完成后自动 stage 并 commit 改动。

**步骤**:
1. 确定触发事件名(例如 `after_specify`、`after_plan`)。
2. 读取 `.specify/extensions/git/git-config.yml` → 查找 `auto_commit.<event>`;若没有则回退到 `auto_commit.default`。
3. 优先使用每个命令配置的 `message`,否则使用默认值。
4. 若启用且存在未提交改动 → 执行 `git add . && git commit`。
5. 优雅降级:无 Git、无仓库、无配置或无改动时直接跳过。

---

### `speckit.git.remote.agent.md`
**目的**:检测 Git 远端 URL,用于 GitHub 集成(例如 `taskstoissues`)。

**步骤**:
1. 检查 Git/仓库;若不可用则告警并返回空。
2. 运行 `git config --get remote.origin.url`。
3. 从 HTTPS 或 SSH 形式中解析 owner / repo 名。
4. 仅当 URL 实际指向 `github.com` 时才把 `Is GitHub` 设为真。
5. 远端缺失或非 GitHub 时返回空(不抛错)。

---

### `speckit.git.validate.agent.md`
**目的**:校验当前分支名符合特性分支命名约定。

**步骤**:
1. 检查 Git/仓库。
2. 通过 `git rev-parse --abbrev-ref HEAD` 读取当前分支。
3. 匹配以下模式:
   - 顺序编号 `^[0-9]{3,}-`(例如 `001-feature-name`)
   - 时间戳 `^[0-9]{8}-[0-9]{6}-`(例如 `20260319-143022-feature-name`)
4. 若位于特性分支:打印结果;并校验 `specs/<prefix>-*` 目录是否存在。
5. 若不在特性分支:输出说明,告知期望的命名模式。
6. 兜底:Git 不可用时,改为校验 `SPECIFY_FEATURE` 环境变量。

---

## 跨切面约定

- **钩子(Hooks)**:每个核心 agent 都会读取 `.specify/extensions.yml` 中的 `before_<cmd>` / `after_<cmd>`,要么打印(可选钩子)要么执行(必选钩子)所注册的命令。
- **前置脚本**:以 PowerShell 为主(`.specify/scripts/powershell/*.ps1 -Json`),用于路径发现。
- **路径策略**:文件系统操作使用绝对路径;文档与 agent 上下文的引用使用项目相对路径。
- **宪章权威**:违反宪章一律视为 CRITICAL;通过修改 spec/plan/tasks 来解决,**不得**通过弱化原则来绕过。
- **Handoff 链路**:`constitution → specify → clarify → plan → tasks → analyze → implement`;`checklist` 可从 `plan` 之后切入,`taskstoissues` 可从 `tasks` 之后切入。
# Spec-Kit Agents Outline

This document summarizes each agent prompt under `.github/agents/`. The agents implement a **Spec-Driven Development (SDD)** workflow that moves a feature from a natural-language idea → spec → clarified spec → plan → tasks → analysis → implementation, with optional Git/GitHub integration agents acting as hooks.

All agents share a common pattern:

- A YAML front matter (`description`, optional `handoffs` to the next agent).
- A `## User Input` block consuming `$ARGUMENTS`.
- **Pre-Execution Hooks**: read `.specify/extensions.yml` for `hooks.before_<command>` entries and emit/execute them.
- A core **Outline / Execution Steps** section.
- **Post-Execution Hooks**: same logic for `hooks.after_<command>`.

The typical end-to-end flow:

```
constitution → specify → clarify → plan → tasks → (analyze) → implement
                                              ↓
                                      (taskstoissues for GitHub)

git.* agents act as hooks throughout (initialize, feature branch, commit, validate, remote)
```

---

## Core Workflow Agents

### 1. `speckit.constitution.agent.md`
**Purpose**: Create or update the project constitution (`.specify/memory/constitution.md`) — the non-negotiable principles governing all later phases.

**Steps**:
1. Run `before_constitution` hooks.
2. Load existing constitution (or copy from template); identify `[ALL_CAPS]` placeholders.
3. Collect/derive concrete values for placeholders (from user input, repo context, or prior versions).
4. Determine semantic version bump (MAJOR / MINOR / PATCH) and update dates (`RATIFICATION_DATE`, `LAST_AMENDED_DATE`).
5. Draft updated constitution: replace placeholders, ensure each Principle has rules + rationale, ensure Governance section.
6. Run consistency propagation against `plan-template.md`, `spec-template.md`, `tasks-template.md`, command files, and runtime guidance docs.
7. Produce a **Sync Impact Report** (HTML comment at the top): version delta, modified/added/removed sections, templates needing updates, deferred TODOs.
8. Validate: no leftover bracket tokens, ISO dates, declarative testable principles.
9. Write back to `.specify/memory/constitution.md`.
10. Output summary + suggested commit message.
11. Run `after_constitution` hooks.

**Handoff**: → `speckit.specify`

---

### 2. `speckit.specify.agent.md`
**Purpose**: Convert a natural-language feature description into a structured `spec.md`, focused on WHAT/WHY (no implementation details).

**Steps**:
1. Run `before_specify` hooks (typically `git.feature` to create a branch).
2. Generate a 2–4 word short name (action-noun format) from the description.
3. Resolve `SPECIFY_FEATURE_DIRECTORY` (under `specs/`, with sequential `NNN-` or timestamp `YYYYMMDD-HHMMSS-` prefix).
4. Create directory, copy `spec-template.md` to `spec.md`, persist path to `.specify/feature.json`.
5. Parse description → extract actors, actions, data, constraints.
6. Make informed guesses for ambiguities; mark up to **3** `[NEEDS CLARIFICATION]` markers only for high-impact items.
7. Fill User Scenarios, Functional Requirements (testable), Success Criteria (measurable, technology-agnostic), Key Entities.
8. Write the spec.
9. **Quality Validation**:
   - Generate `checklists/requirements.md` with content/completeness/readiness items.
   - Iterate up to 3 times to resolve failing items; resolve `[NEEDS CLARIFICATION]` interactively (max 3 questions, table format).
10. Report `SPECIFY_FEATURE_DIRECTORY`, `SPEC_FILE`, checklist results.
11. Run `after_specify` hooks.

**Handoffs**: → `speckit.clarify` or → `speckit.plan`

---

### 3. `speckit.clarify.agent.md`
**Purpose**: Reduce ambiguity in `spec.md` by asking up to **5 targeted questions** and writing answers back into the spec.

**Steps**:
1. Run `before_clarify` hooks.
2. Run `check-prerequisites.ps1 -Json -PathsOnly`; load spec.
3. Run a **structured ambiguity scan** across an 11-category taxonomy (Functional Scope, Domain & Data, UX Flow, Non-Functional, Integration, Edge Cases, Constraints, Terminology, Completion Signals, Misc/Placeholders), marking each Clear/Partial/Missing.
4. Build a prioritized queue of ≤5 candidate questions (multiple-choice 2–5 options OR ≤5-word answer).
5. **Sequential interactive loop**: ask one question at a time with a recommended/suggested answer + table of options; accept "yes"/"recommended"/"suggested" or option letter.
6. After each accepted answer, **incrementally update the spec**:
   - Ensure `## Clarifications` section + `### Session YYYY-MM-DD` subheading exist.
   - Append `- Q: ... → A: ...` bullet.
   - Apply the answer to the appropriate spec section (Functional Requirements, User Stories, Data Model, Success Criteria, Edge Cases, Terminology).
   - Save file atomically after every integration.
7. Validate: ≤5 accepted, no contradictions, headings intact.
8. Final report: questions count, sections touched, coverage table (Resolved / Deferred / Clear / Outstanding), suggested next command.
9. Run `after_clarify` hooks.

**Handoff**: → `speckit.plan`

---

### 4. `speckit.plan.agent.md`
**Purpose**: Produce the implementation plan (`plan.md`) plus design artifacts (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`).

**Steps**:
1. Run `before_plan` hooks.
2. Run `setup-plan.ps1 -Json` → get `FEATURE_SPEC`, `IMPL_PLAN`, `SPECS_DIR`, `BRANCH`.
3. Load spec and constitution; load IMPL_PLAN template.
4. Fill Technical Context (mark unknowns `NEEDS CLARIFICATION`); fill Constitution Check; evaluate gates.
5. **Phase 0 — Research**: dispatch research tasks for each unknown/dependency/integration; consolidate `research.md` (Decision / Rationale / Alternatives) until no `NEEDS CLARIFICATION` remain.
6. **Phase 1 — Design & Contracts**:
   - Extract entities → `data-model.md` (fields, relationships, validation, state transitions).
   - Define interface contracts (API/CLI/UI as appropriate) → `/contracts/`.
   - Update agent context between `<!-- SPECKIT START -->` / `<!-- SPECKIT END -->` markers in `.github/copilot-instructions.md`.
7. Re-evaluate Constitution Check post-design.
8. Stop after Phase 2 planning; report branch + IMPL_PLAN path + artifacts.
9. Run `after_plan` hooks.

**Handoffs**: → `speckit.tasks` or → `speckit.checklist`

---

### 5. `speckit.tasks.agent.md`
**Purpose**: Generate `tasks.md` — an actionable, dependency-ordered, user-story-organized task list.

**Steps**:
1. Run `before_tasks` hooks.
2. Run `setup-tasks.ps1 -Json` → get `FEATURE_DIR`, `TASKS_TEMPLATE`, `AVAILABLE_DOCS`.
3. Load `plan.md` (required), `spec.md` (required); optional: `data-model.md`, `contracts/`, `research.md`, `quickstart.md`.
4. Generate tasks organized **by user story** (P1, P2, P3 …):
   - Map entities, contracts, and components to the story they serve.
   - Build dependency graph and parallel-execution examples.
5. Generate `tasks.md` from the template with:
   - Phase 1: Setup
   - Phase 2: Foundational (blocking prerequisites)
   - Phase 3+: One phase per user story (in priority order)
   - Final Phase: Polish & cross-cutting
6. **Strict checklist format**: `- [ ] [TaskID] [P?] [Story?] Description with file path` (e.g., `T012 [P] [US1] Create User model in src/models/user.py`).
7. Tests are optional — only generated if explicitly requested or TDD mode.
8. Report task counts, parallel opportunities, MVP scope (usually US1).
9. Run `after_tasks` hooks.

**Handoffs**: → `speckit.analyze` or → `speckit.implement`

---

### 6. `speckit.analyze.agent.md`
**Purpose**: **Read-only** cross-artifact consistency/quality analysis across `spec.md`, `plan.md`, `tasks.md` before implementation.

**Steps**:
1. Run `before_analyze` hooks.
2. Run `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`; resolve absolute paths to SPEC, PLAN, TASKS; abort if missing.
3. **Progressive load** only minimal sections from each artifact + the constitution.
4. Build internal semantic models: requirements inventory (FR-/SC- keys), user-story actions, task→requirement coverage map, constitution rule set.
5. **Six detection passes** (≤50 findings total):
   - A. Duplication
   - B. Ambiguity (vague adjectives, TODO/`<placeholder>`)
   - C. Underspecification
   - D. Constitution alignment (MUST principles)
   - E. Coverage gaps (requirement↔task)
   - F. Inconsistency (terminology drift, ordering, conflicts)
6. Assign severity: CRITICAL / HIGH / MEDIUM / LOW (constitution violations are always CRITICAL).
7. Output a Markdown report: findings table, coverage table, constitution issues, unmapped tasks, metrics.
8. Provide Next Actions (proceed or fix first) and offer remediation suggestions (do NOT auto-edit).
9. Run `after_analyze` hooks.

**Constraint**: STRICTLY READ-ONLY — never modifies any file.

---

### 7. `speckit.implement.agent.md`
**Purpose**: Execute `tasks.md` end-to-end to actually build the feature.

**Steps**:
1. Run `before_implement` hooks.
2. Run `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`.
3. **Checklist gate**: scan `FEATURE_DIR/checklists/`; if any item incomplete, present table and ask the user to confirm before proceeding.
4. Load context: `tasks.md` + `plan.md` (required); `data-model.md`, `contracts/`, `research.md`, `constitution.md`, `quickstart.md` (optional).
5. **Project Setup Verification**: detect tech stack from plan.md and create/verify ignore files (`.gitignore`, `.dockerignore`, `.eslintignore`, `.prettierignore`, `.npmignore`, `.terraformignore`, `.helmignore`) using technology-specific pattern lists.
6. Parse `tasks.md` → extract phases (Setup, Tests, Core, Integration, Polish), dependencies, `[P]` markers.
7. **Execute phase-by-phase**:
   - Respect sequential vs. parallel `[P]` rules.
   - Same-file tasks always sequential.
   - TDD: tests before implementation when test tasks exist.
8. Track progress, mark completed tasks `[X]` in `tasks.md`, halt on non-parallel failure, continue on partial parallel failures.
9. Completion validation: tasks done, features match spec, tests pass, plan followed.
10. Run `after_implement` hooks.

---

### 8. `speckit.checklist.agent.md`
**Purpose**: Generate domain-specific quality checklists — described as **"Unit Tests for English"**, validating that *requirements are well-written*, NOT verifying implementation.

**Steps**:
1. Run `before_checklist` hooks.
2. Run `check-prerequisites.ps1 -Json`.
3. **Clarify intent**: dynamically generate up to 3 (escalation up to 5) questions covering scope, risk priority, depth, audience, exclusions, scenario gaps. Use markdown option tables.
4. Combine `$ARGUMENTS` + answers → derive theme (UX/security/API/performance/etc.), depth, audience.
5. Load relevant portions of `spec.md` / `plan.md` / `tasks.md` (progressive disclosure, no full dumps).
6. Create or append to `FEATURE_DIR/checklists/[domain].md`:
   - New file → IDs start at `CHK001`; existing file → continue numbering.
   - Items grouped by quality dimension: **Completeness, Clarity, Consistency, Acceptance Criteria, Scenario Coverage, Edge Cases, Non-Functional, Dependencies/Assumptions, Ambiguities/Conflicts**.
7. **Item rules**: every item is a question testing requirement quality (e.g., *"Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]"*) — never `Verify/Test/Confirm` implementation behavior.
8. ≥80% items must include traceability `[Spec §X.Y]` or markers `[Gap]`/`[Ambiguity]`/`[Conflict]`/`[Assumption]`.
9. Soft-cap ~40 items; consolidate duplicates.
10. Report file path, item count, focus areas, depth, must-haves incorporated.
11. Run `after_checklist` hooks.

---

### 9. `speckit.taskstoissues.agent.md`
**Purpose**: Convert each task in `tasks.md` into a GitHub Issue via the GitHub MCP server.

**Tools**: `github/github-mcp-server/issue_write`

**Steps**:
1. Run `before_taskstoissues` hooks.
2. Run `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`; locate `tasks.md`.
3. Run `git config --get remote.origin.url`.
4. **HARD GUARD**: only proceed if remote is a GitHub URL; never create issues in a different repo.
5. For each task → create one GitHub issue in the matching repo via MCP.
6. Run `after_taskstoissues` hooks.

---

## Git Extension Agents (Hooks)

These agents are usually triggered by the `before_*` / `after_*` hook system declared in `.specify/extensions.yml` and live under `.specify/extensions/git/`.

### `speckit.git.initialize.agent.md`
**Purpose**: Initialize a Git repository if missing.

**Steps**:
1. Run extension script (`initialize-repo.sh` / `.ps1`) or fall back to `git init && git add . && git commit -m "Initial commit from Specify template"`.
2. Skip if Git unavailable or already in a repo.
3. Surface errors and stop on partial init failure.

---

### `speckit.git.feature.agent.md`
**Purpose**: Create a feature branch using sequential or timestamp numbering. Branch creation only — spec dir/files are owned by `speckit.specify`.

**Steps**:
1. Verify Git available.
2. Determine numbering mode: `git-config.yml.branch_numbering` → `init-options.json.branch_numbering` → default `sequential`.
3. If user supplied `GIT_BRANCH_NAME`, pass through verbatim (skip prefix logic).
4. Generate a 2–4-word short name (action-noun, preserve acronyms).
5. Run `create-new-feature.sh/.ps1 --json --short-name "..." [--timestamp] "<feature description>"`.
6. Output JSON `BRANCH_NAME` + `FEATURE_NUM`. Always run only **once** per feature.

---

### `speckit.git.commit.agent.md`
**Purpose**: Auto-stage and commit changes after a Spec-Kit command.

**Steps**:
1. Determine the triggering event name (e.g., `after_specify`, `after_plan`).
2. Read `.specify/extensions/git/git-config.yml` → look up `auto_commit.<event>` and fall back to `auto_commit.default`.
3. Use per-command `message` if configured, else default.
4. If enabled and there are uncommitted changes → run `git add . && git commit`.
5. Graceful degradation: skip if no Git, no repo, no config, or no changes.

---

### `speckit.git.remote.agent.md`
**Purpose**: Detect the Git remote URL for GitHub integration (e.g., for `taskstoissues`).

**Steps**:
1. Verify Git/repo; warn and return empty if not.
2. Run `git config --get remote.origin.url`.
3. Parse owner / repo name from HTTPS or SSH form.
4. Set `Is GitHub` only if the URL truly points to `github.com`.
5. Return empty (no error) on missing remote or non-GitHub remote.

---

### `speckit.git.validate.agent.md`
**Purpose**: Validate the current branch name follows the feature-branch convention.

**Steps**:
1. Verify Git/repo.
2. Read current branch via `git rev-parse --abbrev-ref HEAD`.
3. Match against:
   - Sequential `^[0-9]{3,}-` (e.g., `001-feature-name`)
   - Timestamp `^[0-9]{8}-[0-9]{6}-` (e.g., `20260319-143022-feature-name`)
4. If on a feature branch: report; verify `specs/<prefix>-*` directory exists.
5. If not: emit guidance with the expected naming patterns.
6. Fallback: if Git unavailable, validate `SPECIFY_FEATURE` env var instead.

---

## Cross-Cutting Conventions

- **Hooks**: every core agent reads `.specify/extensions.yml` for `before_<cmd>` / `after_<cmd>` and either prints (optional) or executes (mandatory) the registered command.
- **Prerequisites scripts**: PowerShell-first (`.specify/scripts/powershell/*.ps1 -Json`) used for path discovery.
- **Path policy**: absolute paths for filesystem ops; project-relative paths in docs/agent context.
- **Constitution authority**: violations are always CRITICAL; resolved by amending spec/plan/tasks (not by weakening the principle).
- **Handoff chain**: `constitution → specify → clarify → plan → tasks → analyze → implement`, with `checklist` available off `plan` and `taskstoissues` available off `tasks`.
