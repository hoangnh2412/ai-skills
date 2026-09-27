# Template — AGENTS.md (dự án đích)

Khuôn `AGENTS.md` lúc init. `CLAUDE.md` = cùng thân, thêm block import ở cuối file này.

- Thân render là khối giữa marker `template: agents-md`: khung, `{token}`, và ô `_(điền)_`. **Luôn đủ mục 0–8.** Cách điền xem [SAMPLE-agents.md](SAMPLE-agents.md).
- `AGENTS.md` ghi ra dự án không chứa link tới file khuôn này hay file mẫu.
- `{token}` trong bảng dưới lấy từ `memory/profile.json`. Ô `_(điền)_` để người điền sau. **Không** ghi `user_name`, honorific, hay tên người vào file git.
- Xưng hô và vai trò đọc lúc chạy từ `memory/profile.user.json` (gitignore). Thiếu hoặc `os_username` lệch user OS → hỏi khai báo lại, chưa làm DOC.
- Đây là quy ước cho **dự án đích** (sản phẩm), không copy `AGENTS.md` của repo factory.

## Placeholder

| Token | Nguồn |
|-------|--------|
| `{project_name}` | `profile.project_name` |
| `{project_summary}` | `profile.project_summary` |
| `{project_mode}` | `mvp` \| `standard` \| `maintain` |
| `{current_phase}` | `profile.current_phase` |
| `{docs_provider}` | `local` \| `outline` |
| `{tasks_provider}` | `openproject` \| `lark` \| `none` |
| `{chat_provider}` | `slack` \| `lark` \| `none` |
| `{code_provider}` | `local` \| `gitlab` |
| `{surfaces}` | `profile.surfaces` nối bằng `, ` |

## `memory/profile.json` (schema v3)

Dự án — **commit được**. Không chứa `user_name` / xưng hô.

```json
{
  "version": 3,
  "project_name": "billing-demo",
  "project_summary": "Hệ thống quản lý hóa đơn điện tử",
  "current_phase": "discovery",
  "project_mode": "standard",
  "docs_provider": "local",
  "tasks_provider": "none",
  "chat_provider": "none",
  "code_provider": "local",
  "trace_store": "sqlite"
}
```

| Field | Quy tắc |
|-------|---------|
| `version` | `3` bản mới. `1` và `2` vẫn hợp lệ — không chặn dự án cũ |
| `project_mode` | `mvp` · `standard` · `maintain` — đổi kèm DEC |
| `docs_provider` | `local` \| `outline` |
| `tasks_provider` | `openproject` \| `lark` \| `none` (`none` = hàng `artifact` trong SQLite, không folder task markdown) |
| `chat_provider` | `slack` \| `lark` \| `none` |
| `code_provider` | `local` (git trên đĩa) \| `gitlab` (cần `mcp.code`) |
| `trace_store` | `sqlite` — `memory/trace.db` gitignore; khuôn `memory/trace.sql` commit được |

Khi provider không phải `local`/`none`: thêm `"mcp": { "docs": "…" }` khớp mặt.

## `memory/profile.user.json` (local — gitignore)

```json
{
  "user_name": "Hoàng",
  "honorific": "anh",
  "agent_pronoun": "em",
  "roles": ["BA", "PM"],
  "minipower_experience": "new",
  "os_username": "hoang"
}
```

`os_username` phải khớp user OS. Tuỳ chọn cùng máy: `~/.minipower/user.json` (file trong dự án thắng).

---

<!-- BEGIN template: agents-md -->

````markdown
# {project_name}

Trợ lý trên dự án **{project_name}**. Có `.minipower/` thì chọn một skill đã cài, thông báo tên skill, việc nhiều bước chờ người OK. Tiếng Việt.

## 0. Metadata

| Mục | Giá trị |
|-----|---------|
| Dự án | {project_name} |
| Mô tả | {project_summary} |
| Khách hàng | _(điền)_ |
| Người quyết | _(điền)_ |
| Phạm vi in | _(điền)_ |
| Phạm vi out | _(điền)_ |
| Phiên bản hồ sơ | _(điền)_ |
| Baseline | _(điền)_ |
| Chế độ | {project_mode} |
| Phase | {current_phase} |
| Docs | {docs_provider} |
| Tasks | {tasks_provider} |
| Chat | {chat_provider} |
| Code | {code_provider} |
| Bề mặt | Bề mặt đang có: `{surfaces}` |

Xưng hô: đọc `memory/profile.user.json` mỗi phiên. Không ghi tên vào file này.

| Module | Prefix | In / out | Owner |
|--------|--------|----------|-------|
| _(điền)_ | _(điền)_ | _(điền)_ | _(điền)_ |
| _(điền)_ | _(điền)_ | _(điền)_ | _(điền)_ |
| _(điền)_ | _(điền)_ | _(điền)_ | _(điền)_ |

## 1. Tổng quan

| Thư mục | Vai trò | Việc của dự án này |
|---------|---------|-------------------|
| `memory/` | Profile, DEC, open-Q, doc-debt, sổ cá nhân | _(điền)_ |
| `assets/` | Bản gốc, không sửa | _(điền)_ |
| `brainstorm/` | Nháp; chốt thì đưa vào `docs/` | _(điền)_ |
| `docs/` | Artifact đã chốt | _(điền)_ |
| `.minipower/` | Marker. Có mặt thì bật Minipower | _(điền)_ |
| `backend/src/` | Code backend khi bề mặt có backend | _(điền)_ |
| _(điền)_ | _(điền)_ | _(điền)_ |

| Tầng `docs/` | Chứa | Điểm riêng |
|--------------|------|------------|
| `00-governance/` | _(điền)_ | _(điền)_ |
| `01-project/` | _(điền)_ | _(điền)_ |
| `02-baseline/` | _(điền)_ | _(điền)_ |
| `03-modules/` | _(điền)_ | _(điền)_ |
| `04-platform/` | _(điền)_ | _(điền)_ |
| `05-traceability/` | _(điền)_ | _(điền)_ |
| `06-changes/` | _(điền)_ | _(điền)_ |

## 2. Bắt đầu làm việc từ đâu

Một phiên = một module + một DOC + một section hoặc một ID.

| # | File | Mô tả | Điểm cần đọc |
|---|------|-------|--------------|
| 1 | `memory/profile.json` | _(điền)_ | _(điền)_ |
| 2 | `memory/profile.user.json` | _(điền)_ | _(điền)_ |
| 3 | `memory/memory.md` | _(điền)_ | _(điền)_ |
| 4 | `DOC-03` | _(điền)_ | _(điền)_ |
| 5 | _(điền)_ | File đích của slice | _(điền)_ |

| Loại file | Mô tả | Điểm cần đọc |
|-----------|-------|--------------|
| DOC-01 | _(điền)_ | _(điền)_ |
| DOC-02 | _(điền)_ | _(điền)_ |
| DOC-04 | _(điền)_ | _(điền)_ |
| DOC-05 | _(điền)_ | _(điền)_ |
| DOC-06 | _(điền)_ | _(điền)_ |
| DOC-07 | _(điền)_ | _(điền)_ |
| DOC-08 / 12 | _(điền)_ | _(điền)_ |
| _(điền)_ | _(điền)_ | _(điền)_ |

| Vai | Đọc thêm | Không mở lúc đầu |
|-----|----------|------------------|
| _(điền)_ | _(điền)_ | _(điền)_ |
| _(điền)_ | _(điền)_ | _(điền)_ |

## 3. Quy tắc

| # | Quy tắc | Áp dụng khi |
|---|---------|-------------|
| 1 | _(điền)_ | _(điền)_ |
| 2 | _(điền)_ | _(điền)_ |
| 3 | _(điền)_ | _(điền)_ |
| 4 | _(điền)_ | _(điền)_ |
| 5 | _(điền)_ | _(điền)_ |

## 4. Nguyên tắc

Chế độ đang chạy: {project_mode}.

| # | Nguyên tắc | Vì sao |
|---|------------|--------|
| 1 | _(điền)_ | _(điền)_ |
| 2 | _(điền)_ | _(điền)_ |
| 3 | _(điền)_ | _(điền)_ |
| 4 | _(điền)_ | _(điền)_ |

| Chế độ | Tài liệu đang giữ | Khoản đang nợ |
|--------|-------------------|---------------|
| `mvp` | _(điền)_ | _(điền)_ |
| `standard` | _(điền)_ | _(điền)_ |
| `maintain` | _(điền)_ | _(điền)_ |

## 5. Quy ước

| Việc | Quy ước |
|------|---------|
| ID | _(điền)_ |
| DEC | _(điền)_ |
| Version DOC | _(điền)_ |
| MOD đang dùng | _(điền)_ |
| H1 → Requirements | _(điền)_ |
| H2 → Architecture | _(điền)_ |
| H4 → Code | _(điền)_ |
| H5 → QA | _(điền)_ |
| H6 → Ops | _(điền)_ |
| Ngôn ngữ | _(điền)_ |

## 6. Cổng quyết định

| Cổng | Việc của AI | Ai chốt | Verdict ghi ở đâu |
|------|-------------|---------|-------------------|
| Premise | _(điền)_ | _(điền)_ | _(điền)_ |
| Execution | _(điền)_ | _(điền)_ | _(điền)_ |
| QC | _(điền)_ | _(điền)_ | _(điền)_ |

| Việc | Cổng | Ghi chú |
|------|------|---------|
| _(điền)_ | _(điền)_ | _(điền)_ |
| _(điền)_ | _(điền)_ | _(điền)_ |
| _(điền)_ | _(điền)_ | _(điền)_ |

## 7. Bảo mật

| Hạng mục | Quy định |
|----------|----------|
| Secret | _(điền)_ |
| Dữ liệu ví dụ | _(điền)_ |
| Dữ liệu cấm | _(điền)_ |
| MCP đọc | _(điền)_ |
| MCP ghi (L3) | _(điền)_ |
| Baseline | _(điền)_ |
| File không commit | _(điền)_ |

## 8. Definition of Done

| # | Điều kiện | Đạt khi |
|---|-----------|---------|
| 1 | _(điền)_ | _(điền)_ |
| 2 | _(điền)_ | _(điền)_ |
| 3 | _(điền)_ | _(điền)_ |
| 4 | _(điền)_ | _(điền)_ |
| 5 | _(điền)_ | _(điền)_ |
| 6 | _(điền)_ | _(điền)_ |
| 7 | _(điền)_ | _(điền)_ |
| 8 | _(điền)_ | _(điền)_ |
````

<!-- END template: agents-md -->

## `CLAUDE.md`

Cùng thân trên. Thêm cuối file:

```markdown
---

## Minipower pack (import)

@.cursor/skills/minipower-router/agents/token-guard.md
@.cursor/skills/minipower-router/agents/auto-routing.md
@.cursor/skills/minipower-router/agents/profile-guard.md
```

`AGENTS.md` không có block import. Cursor nạp rule qua `.cursor/rules/` sau khi cài.

## Init

Render thay `{token}` đã khai trong bảng trên, giữ ô `_(điền)_`, ghi `AGENTS.md` khi file chưa có. Không đè file người đã sửa. Không ghi tên người. Không chép link tới file khuôn hay file mẫu.
