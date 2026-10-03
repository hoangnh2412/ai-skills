# Claude Code — Tổng hợp 10 bài (dùng cho dự án Minipower)

> File tham khảo nhanh, gom toàn bộ 10 module. Mỗi bài gồm: **Là gì → Cú pháp/lệnh chính → Áp dụng cho Minipower**.
> Nguồn: tutorial `claude-howto`. Cập nhật theo Claude Code v2.1.x.

## Bảng tổng quan

| # | Module | Cốt lõi | Dùng khi nào |
|---|--------|---------|--------------|
| 01 | Lệnh Slash | Lệnh tắt `/xxx` | Lặp lại 1 quy trình nhiều lần |
| 02 | Bộ nhớ (Memory) | `CLAUDE.md` | Muốn Claude nhớ quy ước dự án |
| 03 | Skills | Kỹ năng tự kích hoạt | Đóng gói know-how theo ngữ cảnh |
| 04 | Subagents | Tác nhân phụ | Tách việc, chạy song song, giữ context sạch |
| 05 | MCP | Kết nối công cụ ngoài | Nối DB, API, Jira, Slack… |
| 06 | Hooks | Tự động theo sự kiện | Bắt buộc format/test/quy tắc |
| 07 | Plugins | Đóng gói & chia sẻ | Phát cho cả team dùng chung |
| 08 | Checkpoints | Điểm khôi phục | Thử nghiệm an toàn, undo |
| 09 | Nâng cao | Plan, Thinking, Permission | Việc lớn, cần suy luận sâu |
| 10 | CLI | Dòng lệnh chuyên sâu | Tự động hóa, CI/CD, script |

---

## 01 — Lệnh Slash (Slash Commands)

**Là gì:** Lệnh tắt gõ `/tên` để chạy một prompt/quy trình đã soạn sẵn. Có 2 loại: **built-in** (có sẵn) và **custom** (nay là Skills).

**Built-in hay dùng:**
- `/init` — sinh `CLAUDE.md` cho dự án
- `/memory` — mở/sửa file bộ nhớ
- `/review` — review Pull Request
- `/plan` — bật chế độ lập kế hoạch
- `/mcp` — quản lý server MCP
- `/goal` — đặt điều kiện hoàn thành cho session
- `/team-onboarding` — hướng dẫn thành viên mới

**Tạo lệnh custom (dưới dạng Skill):** đặt file trong `.claude/skills/<ten>/SKILL.md`
```markdown
---
name: minipower-review
description: Review code theo chuẩn Minipower
argument-hint: <đường dẫn file>
---
## Nhiệm vụ
Review $ARGUMENTS theo checklist Minipower...
```
- `$ARGUMENTS` — toàn bộ tham số; `$1`, `$2` — tham số theo vị trí
- `!` `lệnh shell` — nhúng ngữ cảnh động (vd `!git diff`)
- `@file` — tham chiếu file

**Cho Minipower:** tạo `/mp-commit`, `/mp-deploy`, `/mp-test` để chuẩn hóa quy trình lặp lại. Đặt trong repo → cả team dùng chung.

---

## 02 — Bộ nhớ (Memory / CLAUDE.md)

**Là gì:** File `CLAUDE.md` được nạp tự động mỗi session, chứa quy ước, lệnh, kiến trúc dự án. Đây là **nền tảng quan trọng nhất**.

**Phân cấp bộ nhớ (ưu tiên từ cao → thấp):**
1. Managed Policy (tổ chức)
2. Project `./CLAUDE.md` (theo repo, commit chung)
3. User `~/.claude/CLAUDE.md` (cá nhân, mọi dự án)
4. Local Project (`.claude/CLAUDE.md`, không commit)

**Lệnh:**
- `/init` — tạo mới
- `/memory` — mở editor để sửa
- `@đường-dẫn` trong CLAUDE.md — import file khác (vd `@docs/style.md`)

**Cấu trúc CLAUDE.md nên có cho Minipower:**
```markdown
# Minipower
## Tech stack & lệnh chính (build/test/lint)
## Kiến trúc (thư mục làm gì)
## Quy tắc bắt buộc (YOU MUST...)
## Quy ước commit / PR
## Điều CẦN tránh
```
- Rule theo path: dùng YAML frontmatter để áp quy tắc riêng cho từng thư mục.
- Auto Memory: Claude tự ghi nhớ ngữ cảnh vào file memory qua các phiên.

**Cho Minipower:** viết `CLAUDE.md` ngắn gọn, ra lệnh rõ ("YOU MUST", "DO NOT"), liệt kê lệnh build/test và quy ước commit. Đây là việc **nên làm đầu tiên**.

---

## 03 — Skills (Kỹ năng tùy chỉnh)

**Là gì:** Gói know-how mà Claude **tự kích hoạt khi ngữ cảnh phù hợp** (dựa vào `description`). Khác slash command ở chỗ không cần gõ tay.

**Cơ chế Progressive Disclosure (nạp 3 tầng):**
1. Chỉ `name` + `description` luôn nằm trong context (rẻ)
2. Nạp toàn bộ `SKILL.md` khi cần
3. Nạp file phụ (reference, script) khi thực sự dùng

**Cấu trúc:** `.claude/skills/<ten>/SKILL.md`
```markdown
---
name: minipower-api-docs
description: Sinh tài liệu API. Dùng khi có thay đổi endpoint hoặc file route.
---
## Instructions
...các bước...
```
- **Bắt buộc:** `name`, `description` (mô tả tốt = kích hoạt đúng)
- Có thể chạy Skill trong subagent để giữ context chính sạch
- 2 kiểu nội dung: *Reference* (kiến thức nền) và *Task* (quy trình)

**Cho Minipower:** đóng gói các quy trình đặc thù (review theo chuẩn, sinh tài liệu API, quy tắc brand voice) thành skills để Claude tự áp dụng đúng lúc.

---

## 04 — Subagents (Tác nhân phụ)

**Là gì:** Agent con có context riêng, prompt riêng, bộ tool riêng. Dùng để **tách việc**, chạy **song song**, và **không làm bẩn context chính**.

**Cấu trúc:** `.claude/agents/<ten>.md`
```markdown
---
name: mp-tester
description: Chạy và sửa test cho Minipower
tools: Bash, Read, Edit
model: sonnet
---
Bạn là chuyên gia test. Nhiệm vụ...
```

**Built-in có sẵn:** `general-purpose`, `Plan`, `Explore`, `Bash`, `statusline-setup`, `claude-code-guide`.

**Cách gọi:**
- Tự động ủy quyền (Claude tự chọn theo `description`)
- Gọi thẳng: "dùng subagent mp-tester để..."
- `@mp-tester` — mention trực tiếp
- Resumable: giữ `agentId` để tiếp tục agent cũ với context nguyên vẹn

**Cho Minipower:** tạo agent chuyên biệt (`mp-reviewer`, `mp-tester`, `mp-explorer`). Giới hạn `tools` để an toàn. Chạy nhiều agent song song khi việc độc lập.

---

## 05 — MCP (Model Context Protocol)

**Là gì:** Chuẩn kết nối Claude với **công cụ/dữ liệu bên ngoài** (DB, API, Jira, Slack, GitHub…).

**3 kiểu transport:**
- **HTTP** (khuyến nghị): `claude mcp add --transport http <ten> <url>`
- **Stdio** (chạy local): `claude mcp add <ten> -- node server.js`
- **SSE** (đã deprecated)

**Lệnh quản lý:**
```bash
claude mcp add --transport http jira https://...   # thêm
claude mcp list                                     # liệt kê
claude mcp get jira                                 # chi tiết
claude mcp remove jira                              # xóa
```
- `/mcp` — quản lý trong REPL, xác thực OAuth
- **Scope:** project (chia sẻ theo repo) hoặc user (cá nhân)
- **Tool Search:** tự nạp schema tool khi cần (tiết kiệm context)
- Tham chiếu tài nguyên MCP qua `@`; MCP prompt có thể thành slash command

**Cho Minipower:** nối tới DB/API nội bộ, Jira, GitHub. Dùng **project scope** + biến môi trường cho credential (không hardcode). Xác thực OAuth qua `/mcp`.

---

## 06 — Hooks (Tự động hóa sự kiện)

**Là gì:** Script/HTTP chạy **tự động** khi có sự kiện. Đây là cách **bắt buộc** thực thi quy tắc (harness chạy, không phải Claude "tự nhớ").

**Cấu hình:** trong `settings.json`
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "ruff format $CLAUDE_FILE" }]
    }]
  }
}
```

**Sự kiện chính:**
- `PreToolUse` / `PostToolUse` — trước/sau khi dùng tool
- `UserPromptSubmit` — khi gửi prompt
- `Stop` / `SubagentStop` / `SubagentStart`
- `SessionStart` / `SessionEnd`
- `Notification`, `PermissionRequest`

**Kiểu hook:** command, HTTP, prompt-based, MCP tool, agent.
- Matcher lọc theo tool; `if` lọc sâu theo tham số
- Input qua stdin (JSON); điều khiển qua exit code / JSON stdout

**Cho Minipower:** auto-format sau mỗi Edit, chặn lệnh nguy hiểm (PreToolUse validator), chạy test/lint trước khi Stop, quét bảo mật sau khi ghi file.

---

## 07 — Plugins (Đóng gói & chia sẻ)

**Là gì:** Gói **tất cả trong một** (commands + subagents + skills + MCP + hooks) để cài 1 lần, chia sẻ cho cả team.

**Cấu trúc:** thư mục có `plugin.json` (manifest) + các thành phần.
```
my-plugin/
├── plugin.json
├── commands/    # slash commands
├── agents/      # subagents
├── skills/
├── hooks/
└── bin/         # thêm vào PATH
```

**Tính năng:**
- Marketplace: publish + `claude` cài từ nguồn (git/npm…)
- `${CLAUDE_PLUGIN_DATA}` — lưu dữ liệu bền vững của plugin
- Background monitors, inline plugin qua settings (`source: 'settings'`)
- Strict mode để kiểm soát chặt

**Cho Minipower:** đóng gói toàn bộ quy trình (commands + agents + hooks + MCP) thành **1 plugin "minipower-dev"** → thành viên mới cài 1 lệnh là có đủ. Đây là "giải pháp hoàn chỉnh" cho chuẩn hóa team.

---

## 08 — Checkpoints (Điểm khôi phục an toàn)

**Là gì:** Snapshot **tự động mỗi prompt** cho phép "tua lại" code + hội thoại. An toàn để thử nghiệm.

**Cách dùng:**
- Nhấn **Esc hai lần**, hoặc `/rewind`
- Chọn: khôi phục *code + hội thoại* / chỉ *hội thoại* / chỉ *code* / tóm tắt từ đây / hủy

**Lưu ý:**
- Tạo tự động, không cần thao tác
- **Bổ sung cho Git, không thay thế** — vẫn commit như bình thường
- Có chính sách retention (dọn theo thời gian)

**Cho Minipower:** trước khi thử refactor lớn hoặc hướng đi rủi ro → cứ làm, sai thì `/rewind`. Kết hợp: checkpoint cho thử nghiệm ngắn, Git cho mốc ổn định.

---

## 09 — Tính năng nâng cao (Plan, Thinking, Permission)

**Planning Mode:**
- Bật bằng `/plan` (hoặc `--permission-mode plan`) → **chỉ đọc, không sửa**, lập kế hoạch trước khi làm
- Dùng cho tính năng lớn/nhiều bước; duyệt kế hoạch rồi mới thực thi
- **Ultraplan:** soạn plan trên cloud cho việc phức tạp

**Extended Thinking (suy luận sâu):**
- Bật khi cần quyết định kiến trúc, debug khó
- `--thinking-budget` (số token) và effort level: low `○` / medium `◐` / high `●` / xhigh / max (mặc định `high` trên Opus 4.8)

**Permission Modes:**
| Mode | Hành vi |
|------|---------|
| `manual` | Hỏi duyệt mọi hành động (mặc định) |
| `acceptEdits` | Tự nhận sửa file, hỏi việc khác |
| `plan` | Chỉ đọc, không sửa |
| `auto` | Bộ phân loại tự quyết |
| `dontAsk` | Chỉ tool đã duyệt trước mới chạy |
| `bypassPermissions` | Chấp nhận tất cả (cần `--dangerously-skip-permissions`) |

**Cho Minipower:** dùng `plan` cho việc lớn (duyệt trước), `acceptEdits` khi tin tưởng, cấu hình allowlist permission để giảm hỏi lặp lại.

---

## 10 — CLI (Dòng lệnh chuyên sâu)

**Là gì:** Dùng `claude` từ terminal — nền tảng cho tự động hóa & CI/CD.

**Chế độ:**
```bash
claude                          # phiên tương tác
claude "sửa bug X"              # tương tác kèm prompt đầu
claude -p "câu hỏi"            # print mode: trả lời rồi thoát
cat file | claude -p "tóm tắt" # xử lý qua pipe
```

**Model & cấu hình:**
```bash
claude --model opus            # việc phức tạp
claude --model haiku           # việc nhanh, rẻ
claude --model opusplan        # Opus lập kế hoạch, Sonnet thực thi
claude --fallback-model ...    # dự phòng khi lỗi
```

**System prompt:**
- `--system-prompt` (thay hoàn toàn) / `--append-system-prompt` (thêm vào)

**Tool & Permission:**
```bash
claude --permission-mode plan            # review chỉ đọc
claude --allowedTools "Read,Grep"        # giới hạn tool
claude --allowedTools "Bash(git diff)"   # cho phép lệnh cụ thể
```

**Output & thư mục:**
```bash
claude -p "..." --output-format json           # cho script
claude -p "..." --output-format stream-json     # realtime
claude --add-dir ../other-project               # đa thư mục
```

**Cho Minipower:** dùng `-p --output-format json` trong CI để tự động review/gen-docs; `opusplan` cho task lớn; giới hạn tool khi chạy tự động.

---

## Yêu cầu tuân thủ

Dự án Minipower **PHẢI tuân thủ đầy đủ các module tiêu chuẩn của Claude Code** nêu trên (01–10). Mọi cấu hình, quy trình và công cụ trong dự án phải theo đúng chuẩn chính thức của từng module: đặt file đúng vị trí, dùng đúng cú pháp frontmatter, đúng cơ chế phân cấp bộ nhớ, đúng chuẩn hook/MCP/plugin — không tự ý chế biến sai chuẩn.

---
*Tham khảo chi tiết: xem README trong từng thư mục `01-` … `10-` của repo `claude-howto`.*
