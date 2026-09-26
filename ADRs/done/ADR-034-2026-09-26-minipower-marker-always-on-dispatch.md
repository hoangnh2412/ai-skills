# `.minipower/` + luôn bật — học Codegraph: marker dự án, CLI hỏi, agent tự chọn skill

| | |
|---|---|
| **Ngày** | 2026-09-26 |
| **Trạng thái** | **Done** 2026-09-26. T1–T6 🟢. Chủ repo **chấp nhận dán tay** User Rules (Settings); smoke T5 PASS. Không tự động hóa cloud Cursor. QĐ-6 rename ADR sau |
| **Phạm vi** | Marker `.minipower/` ở gốc **dự án đích** (file cá nhân hoá + DB, học `.codegraph/`); rule always-on; intent **keyword + LLM**; kế hoạch đa skill **do người xác nhận**. CLI tạo folder: [ADR-031](../doing/ADR-031-2026-09-01-cli-install-init-thay-llm-thi-hanh.md) |
| **Ngoài phạm vi** | Không viết CLI (031) · không `src/` ([ADR-032](../done/ADR-032-2026-09-03-gop-module-vao-thu-muc-modules.md)) · không tự chạy kế hoạch khi chưa có OK người · **đổi tên repo GitHub** (QĐ-6 — chủ repo 2026-09-26: có chủ đích, **không block 034**; lúc thật sự đổi → ADR mới) |
| **Nối tiếp** | ADR-031 CLI · ADR-033 atomic *khi đang thực thi một bước* · ADR-022 QĐ-1: không runtime tự bàn giao — **kế hoạch** do người điều phối |
| **Mục đích** | Người không nhớ `/minipower-…`. Có `.minipower/` thì prompt thường → chọn đúng agent/skill → **kế hoạch** → người duyệt rồi mới làm |
| **Ảnh hưởng** | `.minipower/` (mới, dự án đích) · rule always-on (install) · [`router/lib/intent-dispatch.js`](../../src/router/lib/intent-dispatch.js) · [`README.md`](../README.md) § Gọi chung · [`router/rules/dispatch.md`](../../src/router/rules/dispatch.md) |

---

## §1. Bối cảnh

[Codegraph](https://github.com/colbymchenry/codegraph) (đã học một phần ở ADR-031): **`install` wire IDE**; **`init` dựng dữ liệu project**; nhận diện dự án bằng folder **`.codegraph/`**. Tool MCP hỏi `projectPath` rồi đi lên gần nhất có `.codegraph/`.

Minipower 2026-09-26:

| Mảnh | Hiện trạng |
|---|---|
| CLI wire + dựng cây | **ADR-031** — CLI unit 2026-09-26 (`minipower.mjs`) |
| Dispatcher | [minipower-router](../../src/router/skills/minipower-router/SKILL.md): **route = LLM**; `intent-dispatch` = test vàng / gợi ý |
| Kích hoạt lá | always-on mdc + `description` Cursor; smoke T4/T5 còn |
| Marker dự án | `init` ghi `.minipower/` (identity + sqlite); **chưa** smoke workspace thật |

Ma sát người dùng: **nhiều skill, không nhớ tên**. Mong muốn: sau lần cài, prompt tự nhiên.

ADR-031 **không** quyết `.minipower/` hay always-on rule — nên **không** nhét thêm vào 031; ADR này bổ sung lớp *nhận diện + dispatch*.

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | Không có marker kiểu `.codegraph/` | Agent không biết “dự án này dùng minipower” trừ khi người tag skill |
| P2 | Menu `/` không scale 40+ lá | Người bỏ qua dispatcher, skill không bao giờ được gọi |
| P3 | Loader Cursor khớp `description` **mềm** | Cùng prompt, model khác → skill khác; không có test vàng |
| P4 | `install` (031) chưa ghi identity/IDE vào một chỗ Agent luôn đọc | `profile.user.json` chỉ trên dự án đã init tay |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | **Không** agent-tự-bàn-giao-agent im lặng (ADR-022 QĐ-1). Được *soạn kế hoạch* nhiều pack/skill; **cấm thực thi** bước tiếp theo khi người chưa OK |
| C2 | CLI Node ESM, không dependency — thi hành mkdir/ghi JSON thuộc **ADR-031**; ADR này chỉ thêm *artifact marker* |
| C3 | Thông báo trước khi chạy SOP (đã có ở dispatch.md) — không lặng load |
| C4 | L3 MCP / Git / baseline vẫn hỏi người |
| C5 | `intent-dispatch` không thay phán đoán `project_mode` |

## §4. Phương án

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | Chỉ dựa `description` Cursor, không marker | Không thêm file | P1–P3 nguyên | ❌ |
| O2 | **`.minipower/`** + rule always-on + bảng intent máy (học `.codegraph/`) | Agent tự biết bật; test vàng được; người không nhớ `/` | Thêm folder dự án đích; rule global phải cài một lần | ✅ chọn |
| O3 | Plugin/runtime spawn skill | UX “tự chạy” | Trái C1 | ❌ |

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-1** | **Marker = thư mục `.minipower/`** (không file đơn) tại gốc **dự án đích**, cùng vai `.codegraph/`. Bên trong: **file cá nhân hoá** (identity, client đã cài, tuỳ chọn) + **DB** (SQLite — log intent/kế hoạch/trace local, học index Codegraph). Có mặt ⇒ Agent phải dùng Minipower. Không có ⇒ không ép | Không commit secret/token. Schema file+DDL chốt lúc thi hành 031 Đợt B; gitignore DB nếu cần |
| **QĐ-2** | **CLI tạo folder** (031). Thiếu trường → FAIL. **Hạn chế LLM:** không mkdir/ghi JSON/SQL bằng model | Script = thi hành |
| **QĐ-3** | **Always-on cả hai lớp:** project sau `install` + user-global. CLI ghi `~/.cursor/rules/` (opt-out `--no-user-rules`). **Agent Chat:** dán Bước 0 vào Cursor **User Rules** (Settings) — chủ repo 2026-09-26 chấp nhận thủ công; `--print-user-rules` chỉ copy clipboard. Không ghi cloud/`state.vscdb` | Không tag `/` |
| **QĐ-4** | **Install/init = script. Route = LLM.** `install`/`init` không phỏng vấn model (QĐ-2). **Chọn skill lúc làm việc:** LLM đọc catalog lá (`name:`) rồi chọn **đúng một** skill; bảng keyword `intent-dispatch` chỉ là gợi ý / test vàng, **không** thay LLM khi route. Output bắt buộc: đúng pack + đúng lá. Skill mới phải có `description` + khóa test được | Sai skill ⇒ kế hoạch sai — cổng chất lượng vẫn là **OK kế hoạch** (QĐ-5) |
| **QĐ-5** | **Kế hoạch rồi người điều phối.** Sau QĐ-4: soạn kế hoạch (thứ tự pack/skill, I/O, gate). **Cấm thực thi** (code, L3, ghi DOC cuối) trước khi người **OK kế hoạch**. Người điều phối; AI không tự nhảy pack B | Siết ADR-033: một *bước đang chạy* = một pack; chuỗi bước = do người duyệt, không spawn im lặng |
| **QĐ-6** | Tên đích của factory trên GitHub là **`minipower`**. Đây là **repo làm ra** Minipower, **không** phải repo *sử dụng* trên dự án khách. **Thi hành rename không thuộc đợt này** — không chặn đóng 034; khi cần đổi remote/folder → ADR độc lập | Không gói CLI |

```text
minipower install  →  người chọn 1..n client  →  wire (script)
         ↓
   init / identity (script)  →  .minipower/{cá nhân hoá + DB}
         ↓
Agent: **LLM chọn skill** (keyword chỉ gợi ý) → kế hoạch → người OK → từng bước
```

## §6. Confirm *(chốt 2026-09-26)*

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt QĐ-1…6? | **Có** — 2026-09-26. **Siết QĐ-4 cùng ngày:** script chỉ `install`/`init`; **route = LLM** chọn lá |
| Q2 | Thư mục hay file đơn? | **Thư mục**; trong đó file cá nhân hoá + DB |
| Q3 | Rule global / project? | **Cả hai** |
| Q4 | Marker lúc install / init? | **Cả hai**, idempotent |
| Q5 | Marker trong đợt B `init` 031? | **Có** — sau khi 031 đủ chốt để viết CLI |

## §7. Việc triển khai

| Bước | Việc | Done khi | Kết quả |
|---|---|---|---|
| A | Catalog + `intent-dispatch` + `npm test` gốc | Suite xanh; *Khởi tạo dự án sample* → `minipower-router-init` | 🟢 2026-09-26 |
| B | ADR-031 Confirm + CLI ghi `.minipower/` | `init --check` thấy marker | 🟢 unit 031 |
| C | Rule always-on + **kế hoạch trên chat, chờ OK** | File `minipower-always-on.mdc` + `dispatch.md`; init = CLI (không smoke LLM) | 🟢 file + T4 |
| D | README/AGENTS: factory vs consumer | Catalog + gọi chung | 🟢 chữ; 0 gãy mới |
| E | Đổi tên repo Git `ai-skills` → `minipower` | Remote | 🟣 **không block 034** — QĐ-6 hướng; thi hành = ADR sau |

## §8. Xác minh

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Mới | `matchIntent("Khởi tạo dự án sample")` | `minipower-router-init` | 🟢 2026-09-26 (`intent-dispatch.test.js`) |
| T2 | Mới | Catalog 43 lá + 11 kho SOP + agents trong README | `minipower-catalog.test.js` | 🟢 cùng ngày |
| T3 | Regression | `npm test` từ gốc repo | xanh | 🟢 2026-09-26 (sau CLI) |
| T4 | Smoke | Init đã có `.minipower/` | **CLI** `init --check OK` — không kiểm thử bằng LLM (chủ repo 2026-09-26). Always-on không-slash: prompt việc khác (T2 ADR-033 Lark) | 🟢 |
| T5 | Smoke | Workspace **không** `.minipower/` | Không ép pack minipower | 🟢 2026-09-26 chủ repo: dán User Rules + test PASS (`temmp`) |
| T6 | Mới | Route: LLM chọn một `name:` catalog; keyword không thay LLM | lời always-on + router SKILL; golden keyword giữ cho test | 🟢 lời + smoke Cursor 2026-09-26 (init · FR ORD · Lark; cài lại sample) |

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| **Tốt** | Cài một lần, prompt thường; intent kép giảm lệch skill; người giữ tay lái trên kế hoạch |
| **Xấu** | Keyword∪LLM vẫn có thể đề cử sai — cổng là **OK kế hoạch**. User-global `~/.cursor/rules` có thể **không** inject vào Agent — T5 dựa User Rules (Settings) |
| **Trung lập** | QĐ-6 đặt tên đích `minipower`; rename Git **không** là điều kiện Done của 034 |

**Nợ ngoài đóng 034 (ghi 2026-09-26):** `minipower-analyst-srs` chưa soi tiền đề trước slice DOC-06 — xem skill analyst, làm sau. Không chặn QĐ-1…5.
