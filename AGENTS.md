# Repository Guidelines

> **Canonical AI instructions.** Codex、Cursor、Claude Code、Copilot 及其他 Agent 均以本文件为准。

## Related Sibling Repositories（必读）

本仓库为前端管理端 **aorinex-frontend**。配套后端、官网为**同级独立仓库**，默认位于同一父目录下：

| 角色 | 目录名 | 路径推导 |
|------|--------|----------|
| 前端（本仓） | `aorinex-frontend` | 当前项目根目录 |
| 后端接口 | `aorinex-backend` | 父目录 + `/aorinex-backend` |
| 官网 / 营销站 | `aorinex-nuxt` | 父目录 + `/aorinex-nuxt` |

示例：前端为 `/www/wwwroot/aorinex-frontend` 时：

- 后端：`/www/wwwroot/aorinex-backend`
- 官网：`/www/wwwroot/aorinex-nuxt`

### 何时访问兄弟仓库

需要查看或修改以下内容时，**直接读写**对应目录，不要只在本仓猜测：

- **aorinex-backend**：API / Controller / Logic / Model / 中间件 / 路由；表结构、种子 SQL、`database/schema_init.sql`；权限码、菜单规则（`ax_rules`）、鉴权逻辑；前后端接口契约联调
- **aorinex-nuxt**：官网公开/营销页如何消费后端公开 API；对照落地页字段与鉴权约定（勿把管理端页面逻辑塞进官网）

### 注意

- 三仓各自独立 Git；改后端或官网时在对应仓库提交/推送，勿混进本前端仓库。
- 本仓接口封装主要在 `apps/web-ele/src/api/`，须与后端路由对齐。
- Cursor 侧另有 `.cursor/rules/backend-sibling-repo.mdc`，与本约定一致；**其他 Agent 工具以本 `AGENTS.md` 为准。**

## Project Structure（摘要）

- 主应用：`apps/web-ele/`（Element Plus 管理端）
- 接口封装：`apps/web-ele/src/api/`
- 业务页面：`apps/web-ele/src/views/`
- 路由：`apps/web-ele/src/router/`
- 共享包：`packages/`
