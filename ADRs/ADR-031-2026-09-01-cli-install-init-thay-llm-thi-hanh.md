# CLI `minipower install` / `init` — script thi hành, LLM chỉ hỏi

| | |
|---|---|
| **Ngày** | 2026-09-01 |
| **Trạng thái** | đề xuất, chờ Confirm §6 — trạng thái việc xem [README index](README.md) |
| **Phạm vi** | Một CLI Node duy nhất cho **hai bề mặt deterministic** đang giao cho LLM/người làm tay: **(A) wire minipower vào client** (Claude Code · Cursor · OpenCode · Codex) và **(B) khởi tạo cấu trúc dự án đích**. Đụng `sdlc/install/`, `sdlc/SKILL.md` (mục Khởi tạo), `sdlc/hooks/{package.json,test}`, `*/PACK.md` (đọc, không sửa) |
| **Ngoài phạm vi** | Không đổi logic guard trong `hooks/lib/*.js` · không đổi `rules.json` schema · không thêm hook thứ 7 · không tự động hoá phần **phán đoán** (chọn `project_mode`, viết nội dung DOC) · kênh Codex vẫn thuộc [ADR-025](ADR-025-2026-08-26-ho-tro-codex-kenh-cai-thu-tu.md) (ADR này chỉ chừa **chỗ cắm dữ liệu**, không mở kênh) · không làm packaging npm/`npx` (QĐ-11 ghi nhận là hướng, chưa quyết) |
| **Nối tiếp** | [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) QĐ-6 (`install --with <module>` — **ADR này đóng**) · QĐ-8 (`PACK.md` manifest = nguồn danh sách module) · [ADR-025](ADR-025-2026-08-26-ho-tro-codex-kenh-cai-thu-tu.md) QĐ-6 (parity 4 kênh có máy canh) · [ADR-020](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) QĐ-3 ("cứng bằng máy, mềm bằng lời" — nguyên tắc gốc) + QĐ-4 (mọi kênh cùng bộ guard) · [ADR-014](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md) (wrap-not-build, không nền tảng thứ tư) · [ADR-011](ADR-011-2026-07-26-minipower-claude-code-plugin.md)/[ADR-012](ADR-012-2026-07-26-minipower-cursor-plugin.md) (kênh plugin — song song, không thay thế) |
| **Mục đích** | Ghi lại một ranh giới: **việc có logic xác định thì viết thành script, LLM chỉ là kênh giao tiếp tự nhiên giữa người và script**. Cài đặt và khởi tạo phải đúng 100% mỗi lần, không phụ thuộc phiên bản model hay độ dài context |
| **Ảnh hưởng** | `sdlc/install/minipower.mjs` (**mới** — CLI) · `sdlc/install/{claude,cursor,opencode}/` (README hạ xuống tham chiếu; fragment + rule giữ nguyên vai trò dữ liệu) · `sdlc/install/claude/install.mjs` (**hấp thụ** vào CLI, giữ shim mỏng) · [`sdlc/SKILL.md`](../sdlc/SKILL.md) mục "Thao tác agent khi init" + "Exit init" (viết lại theo QĐ-7/QĐ-9) · [`sdlc/hooks/package.json`](../sdlc/hooks/package.json) (script `install`/`init`) · `sdlc/hooks/test/{install-cli,init-cli}.test.js` (**mới**) + `install-parity.test.js` (mở rộng) · [`AGENTS.md`](../AGENTS.md) mục Build/Test/Run + Kiến trúc |

---

## §1. Bối cảnh

Chủ repo đọc tài liệu [CodeGraph](https://github.com/colbymchenry/codegraph) ngày 2026-09-01 và chỉ ra một khuôn đáng học — nó tách **sạch hai lệnh** và nói rõ lệnh nào làm gì:

> `codegraph install` — dò và tự cấu hình Claude Code, Cursor, Codex CLI, opencode, Gemini CLI, Copilot… wire MCP server vào từng cái. **Nó chỉ wire agent — không index code**; dựng graph từng project là `codegraph init` riêng.

Điều đáng học **không phải** danh sách client, mà là: toàn bộ việc này là **chọn option → chạy script**, không có LLM ở giữa. Kết quả đúng 100% mỗi lần, không phụ thuộc model nào đang chạy.

Đối chiếu minipower ngày 2026-09-01 — repo có **đúng hai bề mặt đó**, ở hai mức trưởng thành rất lệch:

| Bề mặt | Hiện trạng | Ai thi hành |
|---|---|---|
| **Wire vào client** — Claude Code | [`install/claude/install.mjs`](../sdlc/install/claude/install.mjs) — 150 dòng, idempotent, backup `.bak`, `--check`/`--print`, smoke-test 4 shim, xử lý escape path Windows | **script** ✅ |
| — Cursor | `install/cursor/README.md`: người tự `New-Item -ItemType SymbolicLink` ×3 rule + tự merge `hooks.fragment.json` | người / LLM ❌ |
| — OpenCode | `install/opencode/README.md`: symlink ×3 + merge `opencode.fragment.json` + đặt plugin `.ts` | người / LLM ❌ |
| — Codex | chưa có ([ADR-025](ADR-025-2026-08-26-ho-tro-codex-kenh-cai-thu-tu.md) ⚪, chặn ở Q1–Q3 §6) | — |
| **Khởi tạo dự án** | [`sdlc/SKILL.md:208`](../sdlc/SKILL.md) "Thao tác agent khi init": 8 bước bằng chữ (copy 2 skeleton, ghi `profile.json` v2, sinh `AGENTS.md`+`CLAUDE.md`, tạo 6 folder `memory/{phase}/`, điền README) + checklist "Exit init" 5 gạch đầu dòng | **LLM 100%** ❌ |

Hai việc treo sẵn có đã trỏ đúng về đây, cả hai đều **chưa mở**:

- **ADR-022 QĐ-6** — *"`install.mjs` nâng cấp nhận `--with <module>` (đọc manifest QĐ-8); ai cần gì cài nấy"*; §6 ghi rõ là *"việc sau-đợt, trao đổi sau"*.
- **ADR-025 QĐ-6** — parity 4 kênh phải có test canh, và gợi ý *"nếu fragment Claude đang sinh-từ-SSOT qua `npm run gen` thì fragment Codex cũng sinh cùng đường"*.

Nguyên tắc thì repo đã có từ [ADR-020 QĐ-3](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md): *"cứng bằng máy, mềm bằng lời"* — thứ máy kiểm được mà không cần phán đoán thì đừng giao cho phán đoán. **ADR này không mở hướng mới; nó áp nguyên tắc sẵn có vào bề mặt duy nhất chưa được chạm.**

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | 3 kênh cài, **1 kênh có script** — Cursor/OpenCode vẫn là "đọc README rồi gõ tay 6–8 lệnh, tự merge JSON" | Sai lặng: symlink thiếu một rule, merge đè mất hook cũ của người dùng, path Windows escape sai — **không có gì FAIL** để phát hiện. Đúng lỗi mà `install.mjs` đã sinh ra để chữa cho riêng Claude |
| P2 | Bước 3–6 của init (copy `project-skeleton/` + `docs-skeleton/`, ghi `profile.json`, sinh 2 file persona, tạo 6 folder memory) **không có một dòng nào cần suy luận** nhưng đang giao cho LLM | Thiếu folder / lệch tên / quên `doc-debt.md` là chuyện xảy ra được và **im lặng**; kết quả init khác nhau giữa hai lần chạy cùng câu trả lời |
| P3 | "Exit init" là **checklist bằng chữ** trong SKILL.md | Không qua được phép thử của repo: *cái gì FAIL được bằng máy khi làm sai?* — hiện tại: **không gì cả** |
| P4 | Mỗi kênh mới (Codex là kênh thứ tư) = viết thêm một README quy trình tay + một cách merge riêng | Chi phí thêm kênh tuyến tính; parity giữa kênh dựa vào kỷ luật đọc README, trái ADR-020 QĐ-4 |
| P5 | Danh sách module (`sdlc`/`backend`/`ops`/`toolbox`, sắp có thứ năm ở [ADR-030](ADR-030-2026-08-29-mo-module-presales-skill-uoc-luong-ulnl.md)) **chưa có consumer nào đọc `PACK.md`** | `PACK.md` (ADR-022 QĐ-8) mới là manifest chờ người dùng; "ai cần gì cài nấy" vẫn là lời hứa |
| P6 | Ranh giới *LLM hỏi ↔ máy làm* **chưa được viết ở đâu** thành quy tắc | Mỗi lần thêm năng lực lại phải cãi lại từ đầu "cái này để agent làm hay viết script" |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | **Không nền tảng thứ tư** ([ADR-014](ADR-014-2026-07-28-minipower-spine-tong-hop-wrap-not-build.md)) — CLI là **Node ESM plain, không build step, không dependency, Node ≥ 18**, cùng hệ với `hooks/`. Không thêm bundler, không thêm framework CLI |
| C2 | **SSOT ở giữa** — CLI là *consumer* của `rules.json` · `PACK.md` · fragment; nó **không** được chứa bản sao thứ hai của danh sách hook, danh sách module hay danh sách rule |
| C3 | [ADR-020 QĐ-4](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) — mọi kênh khai **cùng bộ 6 hook, cùng bộ guard**; parity phải có **test canh**, không dựa kỷ luật |
| C4 | **Triết lý bất biến** (AGENTS.md §Bối cảnh) — CLI **không** ra quyết định thay người: không tự chọn `project_mode`, không tự đoán câu trả lời thiếu, không tự sửa file đã tồn tại của người dùng. Tự động hoá dừng ở **thi hành**, không lấn sang **phán đoán** |
| C5 | **Không thêm điều kiện cứng dạng hook.** Bảy điều kiện cứng hiện hành giữ nguyên số lượng; `init --check` là **verifier gọi theo yêu cầu** (exit code), không phải hook chặn prompt |
| C6 | **Tương thích ngược** — bản đã cài bằng tay theo README cũ phải chạy lại CLI được mà không nhân đôi hook, không mất cấu hình riêng của người dùng (khuôn `stripMinipower` + `.bak` của `install.mjs` hiện tại) |
| C7 | **Windows là first-class** — repo đã có bug thật vì escape path (`D:\Working\…` → `\W`) và bug installer chết trên Windows (ADR-020 việc #4). Mọi đường dẫn qua `node:path`, mọi chèn vào JSON qua `JSON.stringify` |

## §4. Phương án — vị trí và hình dạng CLI

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | **Giữ per-channel** — viết thêm `install/cursor/install.mjs`, `install/opencode/install.mjs` | Thay đổi nhỏ nhất, mỗi script độc lập | 4 script × phần detect/merge/backup/verify **lặp 4 lần** → đúng thứ đã làm 4 bản guard `.py/.ps1/.sh/.ts` lệch nhau trước đây; parity lại dựa kỷ luật | ❌ |
| O2 | **Một CLI ở `sdlc/install/minipower.mjs`**, kênh hạ xuống **dữ liệu** (fragment + rule + bảng detect) | Một chỗ chứa logic; thêm kênh = thêm một entry dữ liệu, không thêm code; dùng lại nguyên `hooks/` package (test, Node, CI) đã có | Tên hơi lệch: installer cho cả `backend`/`ops` lại sống trong `sdlc/` — chấp nhận, vì `sdlc/` đã là module duy nhất ship hook và `install/` đã là bề mặt cài của cả repo | ✅ chọn |
| O3 | **Module/thư mục CLI mới ở root** (`installer/` hoặc `bin/`) | Tên sạch nhất theo ADR-022 QĐ-2 | Thêm top-level thứ sáu + package Node thứ hai để bảo trì; trái C1 và "co lại trước khi mở rộng". Không đáng cho ~400 dòng script | ❌ |
| O4 | Đưa vào `toolbox/` | Đúng nghĩa "công cụ" | Sai người dùng: `toolbox/` là công cụ **làm ra** minipower, chỉ cài trong repo này ([ADR-027](ADR-027-2026-08-28-module-toolbox-cong-cu-lam-ra-minipower.md)); installer phục vụ **người dùng cuối** ở dự án đích | ❌ |

*Ghi chú O2:* nếu sau này `sdlc/` tách repo ([cross-repo-bridge](../contracts/cross-repo-bridge.md)) thì CLI đi cùng `sdlc/` — vẫn đúng, vì hook và skeleton cũng ở đó. Không cần dự phòng thêm.

## §5. Quyết định

### Ranh giới nền — hai lệnh, không nhập nhằng

Học đúng chỗ CodeGraph làm tốt: **wire công cụ** và **khởi tạo dữ liệu của một project** là hai lệnh khác nhau, tài liệu phải nói rõ lệnh này *không* làm việc kia.

| Lệnh | Làm gì | Chạy ở đâu | Bao nhiêu lần |
|---|---|---|---|
| `minipower install` | Wire skill + hook + rule của **module đã chọn** vào **client đã dò được** | root dự án đích (hoặc bất kỳ, có `--target`) | mỗi máy / mỗi client, lặp lại vô hại |
| `minipower init` | Dựng **cấu trúc dự án** + `profile.json` + persona từ 7 câu trả lời | root dự án đích | một lần / dự án (rồi `--check` lặp lại) |

| # | Quyết định | Chi tiết |
|---|---|---|
| **QĐ-1** | **Một CLI Node duy nhất, hai lệnh con `install` và `init`.** Vị trí `sdlc/install/minipower.mjs` (O2). Node ESM plain, không dependency, Node ≥ 18 | Đóng ADR-022 QĐ-6. `install/claude/install.mjs` **hấp thụ** vào CLI; giữ lại một shim mỏng gọi sang CLI để lệnh cũ trong README/ADR cũ không chết (C6) |
| **QĐ-2** | **Ranh giới nền — LLM hỏi, script làm.** LLM chịu trách nhiệm: hỏi tự nhiên, giải thích, **gợi ý** `project_mode`, đọc kết quả và tóm tắt cho người. Script chịu trách nhiệm: mọi `mkdir`/`cp`/ghi JSON/merge fragment/symlink/verify. **Không LLM nào tự tay dựng cấu trúc nữa** | Đây là QĐ trung tâm của ADR. Viết thành **một dòng quy tắc** trong AGENTS.md, để lần sau không phải cãi lại (P6): *"việc có logic xác định → script; LLM là kênh giao tiếp, không phải kênh thi hành"* |
| **QĐ-3** | **Auto-detect client theo dấu vết ở dự án đích** — `.claude/` · `.cursor/` · `.opencode/` · (`.codex/` khi ADR-025 mở). In ra **cái dò được + cái sẽ ghi**, rồi hỏi xác nhận. `--client <tên>` ép tay, `--all` làm hết, `--dry-run` chỉ in | Dò bằng **sự tồn tại thư mục**, không đoán bằng process/PATH — đơn giản, kiểm được, không sai lặng. Không dò được cái nào → in hướng dẫn tạo thư mục, **không** tự tạo |
| **QĐ-4** | **Đơn vị cài = module, danh sách đọc từ `*/PACK.md`** — `--with sdlc,backend`; mặc định `sdlc`. Trường `pack` + `repo` trong manifest quyết định cài gì (skill router-gộp vs lá-rời) | Không hardcode danh sách module trong CLI (C2). Module thứ năm ([ADR-030](ADR-030-2026-08-29-mo-module-presales-skill-uoc-luong-ulnl.md) `presales/`) khi ra đời **không phải sửa CLI**. `toolbox/` mang cờ loại trừ khỏi mặc định (chỉ cài trong repo này) |
| **QĐ-5** | **Kênh = dữ liệu, không phải code.** Mỗi kênh khai một entry: thư mục dò · nơi đặt skill · nơi đặt rule · file cấu hình + cách merge (JSON path). Thêm kênh thứ tư/năm = thêm **entry**, không thêm nhánh `if` | Trực tiếp hạ chi phí P4; và làm ADR-025 chỉ còn phải trả lời **4 ẩn số vòng thực nghiệm N**, không phải viết installer riêng |
| **QĐ-6** | **Idempotent · backup · verify — cho cả 4 kênh, không riêng Claude.** Kế thừa nguyên khuôn `install.mjs` hiện có: nhận diện khối minipower cũ (cả path `sdlc/` lẫn `minipower/` trước ADR-022 QĐ-3) rồi thay, `.bak` trước khi ghi đè, **chỉ đụng khối minipower**, kết thúc bằng smoke-test shim | C6 + C7. `--check` = chỉ verify, không ghi (dùng được trong CI) |
| **QĐ-7** | **`init` nhận câu trả lời, không tự hỏi bằng LLM.** Hai đường vào cùng một lõi: `--answers <file.json>` (LLM ghi ra sau khi hỏi 7 câu) hoặc `--interactive` (readline, **chạy được khi không có LLM nào**). Thiếu trường → **FAIL nêu đúng trường thiếu**, không tự điền | Đường `--interactive` là phép thử của QĐ-2: nếu init không chạy được khi không có LLM, nghĩa là vẫn còn logic nằm nhầm chỗ |
| **QĐ-8** | **"Exit init" thành exit code.** `minipower init --check` verify: `profile.json` hợp lệ schema **v2** · đủ 4 nhánh (`memory/` 6 chủ đề · `assets/` · `brainstorm/` · `docs/` 7 folder) · `FAQ.md` · `memory/{phase}/{README,decision-log}.md` · `mvp`/`maintain` có `doc-debt.md` · `brainstorm/` không có folder con | Checklist bằng chữ ở SKILL.md **được thay**, không phải viết thêm cạnh nó. **Không** thành hook (C5) — người/CI gọi khi cần |
| **QĐ-9** | **Router viết lại theo script.** [`sdlc/SKILL.md`](../sdlc/SKILL.md) mục "Thao tác agent khi init": 8 bước → **3 bước** (1. hỏi trọn gói 7 câu · 2. ghi `answers.json` · 3. gọi `init`, đọc kết quả và thuật lại). Xoá đoạn `cp -R` tham chiếu và checklist "Exit init" thủ công | Giữ nguyên **7 câu hỏi** và bảng gợi ý mode (`maintain` cho repo cũ, `mvp` cho sản phẩm mới vội) — đó là phần LLM làm tốt hơn script |
| **QĐ-10** | **Không tự động hoá phần phán đoán.** CLI **không**: chọn `project_mode` thay người · viết nội dung DOC · sửa file đã tồn tại của dự án (init vào repo có sẵn giữ nguyên `README.md`/`AGENTS.md` cũ, chỉ báo cái thiếu) · đoán `approval_source` khác `local` | C4. Đây là đường ranh khiến ADR này **không** kéo repo về phía "agent tự động hoá" |
| **QĐ-11** | **Chưa làm packaging.** Không `npm publish`, không `npx minipower`, không cài global. Gọi bằng đường dẫn: `node <MP>/install/minipower.mjs install`, kèm alias `npm run install:mp` trong `hooks/package.json` | Ghi nhận `npx` là **hướng tốt** (CodeGraph dùng) nhưng cần quyết riêng: tên gói, ai publish, versioning so với `PACK.md`. Không mở trong ADR này |

### Hình dạng sau khi thi hành

```text
sdlc/install/
├── minipower.mjs              MỚI  — CLI: install | init   (toàn bộ logic)
├── channels.json              MỚI  — dữ liệu 4 kênh (QĐ-5): dò ở đâu, ghi vào đâu, merge kiểu gì
├── claude/
│   ├── install.mjs            shim mỏng → minipower.mjs install --client claude   (C6)
│   ├── settings.fragment.json (giữ — dữ liệu)
│   └── README.md              hạ xuống: tham chiếu + cách cài tay khi cần
├── cursor/{hooks.fragment.json, rules/*.mdc, README.md}     (giữ — dữ liệu)
├── opencode/{opencode.fragment.json, plugins/, rules/, README.md}
└── codex/                     chừa chỗ — mở khi ADR-025 chốt (chỉ thêm entry channels.json + fragment)
```

```text
  người ──7 câu──> LLM ──answers.json──> minipower init ──> cấu trúc + profile.json
                    │                          │
                    │                          └── init --check ──> exit code (QĐ-8)
                    └── thuật lại kết quả, gợi ý bước tiếp
```

## §6. Confirm *(bắt buộc trước khi thi hành)*

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt QĐ-1…QĐ-11? | |
| Q2 | Vị trí CLI: `sdlc/install/minipower.mjs` (O2) — chấp nhận cái wart "installer của `backend`/`ops` sống trong `sdlc/`"? Hay muốn O3 (thư mục root mới)? | |
| Q3 | `install` có tự **symlink skill** không, hay chỉ wire hook + rule? (Symlink cần quyền admin trên Windows — đề xuất: **có làm**, thất bại thì degrade sang copy + cảnh báo, không FAIL cả lệnh) | |
| Q4 | `init --interactive` (readline, chạy không cần LLM) — làm ở **Đợt B** hay để sau? Đề xuất: **làm**, vì đó là phép thử ranh giới QĐ-2 | |
| Q5 | Fragment 4 kênh có **sinh từ `rules.json` qua `npm run gen`** luôn trong đợt này không (đóng luôn ADR-025 QĐ-6), hay giữ fragment viết tay + chỉ mở rộng `install-parity.test.js`? Đề xuất: **giữ viết tay + test canh** ở đợt này; sinh-từ-SSOT tách việc riêng để đợt không phình | |
| Q6 | Thứ tự: **Đợt A trước, dừng lại nghiệm thu, rồi Đợt B** — hay chạy liền hai đợt? | |

Chốt xong: ghi ngày vào **Trạng thái** + cập nhật ghi chú index.

## §7. Việc triển khai — hai đợt

### Đợt A — `install` (đóng ADR-022 QĐ-6)

| Bước | Việc | Done khi | Phụ thuộc |
|---|---|---|---|
| A1 | `channels.json` — khai 3 kênh hiện có (claude · cursor · opencode) theo QĐ-5: thư mục dò · đích skill · đích rule · file config + JSON path merge | 3 entry mô tả **đúng** những gì README hiện đang bảo người dùng gõ tay; diff README ↔ entry = 0 | Q1 |
| A2 | `minipower.mjs install` — detect (QĐ-3) · `--with` đọc `*/PACK.md` (QĐ-4) · merge idempotent + `.bak` + chỉ-đụng-khối-minipower (QĐ-6) · `--check`/`--dry-run`/`--client`/`--all`/`--target` | Cài sạch từ folder trống trên **cả 3 kênh**; chạy lần 2 không nhân đôi; `--check` xanh | A1 |
| A3 | Hấp thụ `claude/install.mjs` → shim mỏng; giữ nguyên hành vi cờ cũ (`--check`, `--print`) | Lệnh cũ trong README/ADR-020 §8 vẫn chạy đúng | A2 |
| A4 | Mở rộng `install-parity.test.js` + thêm `install-cli.test.js` (T1·T4·T6) | Suite xanh; parity 3 kênh do **máy** canh, không do README | A2 |
| A5 | Viết lại 3 `README.md` kênh: lệnh CLI lên đầu, hướng dẫn tay xuống mục "khi không chạy được script"; cập nhật AGENTS.md §Build/Test/Run | `link:check` 0 gãy mới; không còn chỗ nào bảo người dùng merge JSON tay như **đường chính** | A2 |

### Đợt B — `init` (đóng P2/P3)

| Bước | Việc | Done khi | Phụ thuộc |
|---|---|---|---|
| B1 | `minipower.mjs init` — `--answers <file.json>` + `--interactive` (QĐ-7): copy 2 skeleton · ghi `profile.json` v2 · sinh `AGENTS.md`/`CLAUDE.md` từ [TPL-agent-profile](../sdlc/templates/TPL-agent-profile.md) · tạo 6 `memory/{phase}/` · `doc-debt.md` cho `mvp`/`maintain` | Dự án dựng ra **giống hệt** kết quả 8 bước tay hiện tại, hai lần chạy cùng input cho kết quả byte-đối-byte như nhau | Đợt A nghiệm thu, Q4 |
| B2 | `init --check` (QĐ-8) — verify đủ 4 nhánh + profile v2 + `doc-debt` + `brainstorm/` không folder con; exit code 0/1, in **đúng cái thiếu** | Xoá một folder bất kỳ ⇒ FAIL nêu đúng tên; dự án dựng bằng B1 ⇒ PASS | B1 |
| B3 | Đường **init vào repo đã có sẵn** (SKILL.md mục riêng): không đè file tồn tại, chỉ liệt kê cái thiếu + đề nghị; tài liệu cũ → `assets/archive/` | Chạy trên repo có sẵn `README.md`/`AGENTS.md` ⇒ **không file nào bị sửa**, in danh sách thiếu | B1 |
| B4 | Viết lại `sdlc/SKILL.md` mục "Thao tác agent khi init" (8 bước → 3) + thay "Exit init" bằng `init --check` (QĐ-9); xoá đoạn `cp -R` tham chiếu | `router.test.js` + `skeleton.test.js` xanh; grep `cp -R "$MINIPOWER` = 0 hit trong SKILL.md | B2 |
| B5 | `init-cli.test.js` (T2·T5) + một dòng quy tắc QĐ-2 vào AGENTS.md | Suite xanh; quy tắc ranh giới có chỗ đứng cố định | B4 |

## §8. Xác minh (định nghĩa xong)

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | `install` từ folder trống, không cờ | Dò đúng client có mặt, in cái sẽ ghi, cài xong `--check` xanh trên cả 3 kênh | 🔴 |
| T2 | Smoke | `init --answers` với 7 trường đủ, rồi `init --check` | Cấu trúc đủ 4 nhánh + `profile.json` v2 hợp lệ; `--check` exit 0 | 🔴 |
| T3 | Regression | `npm test` + `npm run gen:check` + `npm run link:check` (0 gãy **mới**) + grep tàn dư đường dẫn cũ = 0 | xanh cả bốn | 🔴 |
| T4 | Mới | Parity: `channels.json` khai **cùng bộ 6 hook / cùng thứ tự shim** cho mọi kênh; lệch một hook ⇒ test đỏ | test đỏ khi cố tình bỏ 1 hook | 🔴 |
| T5 | Mới | `init --check` bắt được từng thiếu sót: xoá `memory/planning/` · hạ `profile.json` về v1 · `mvp` thiếu `doc-debt.md` · tạo folder con trong `brainstorm/` | FAIL, message nêu **đúng** cái thiếu (4 case) | 🔴 |
| T6 | Mới | Windows: `PACK_ROOT` dạng `D:\…` chèn vào JSON hợp lệ; symlink thất bại ⇒ degrade copy + cảnh báo, **không** crash | Không lặp lại bug ADR-020 việc #4 | 🔴 |
| T7 | Mới | **Ranh giới QĐ-2**: `init --interactive` chạy trọn vẹn **không có LLM**; và không file nào trong `hooks/lib`/`hooks/bin` import CLI | 2 assert xanh — tầng cứng không phụ thuộc CLI, CLI không phụ thuộc LLM | 🔴 |
| T8 | Smoke | Idempotent: chạy `install` 3 lần liên tiếp; và chạy trên `.claude/settings.json` **có sẵn hook của người dùng** | Không nhân đôi khối minipower; hook người dùng còn nguyên; có `.bak` | 🔴 |

Icon: 🟢 xong · 🟡 có sẵn, cần giữ xanh · 🔴 chưa có. **Không 🟢 Done khi còn T đỏ.**

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| **Tốt** | Cài đặt và khởi tạo **đúng 100% mỗi lần**, không phụ thuộc model/context — đúng điều chủ repo muốn. Cursor/OpenCode lên ngang Claude, hết P1. "Exit init" từ lời nói thành exit code, hết P3 |
| **Tốt** | Thêm kênh = thêm **entry dữ liệu**: [ADR-025](ADR-025-2026-08-26-ho-tro-codex-kenh-cai-thu-tu.md) rút gọn còn "đóng 4 ẩn số vòng thực nghiệm N", không phải viết installer riêng (P4) |
| **Tốt** | `PACK.md` có **consumer thật** đầu tiên (ADR-022 QĐ-8 thôi là lời hứa); module thứ năm của [ADR-030](ADR-030-2026-08-29-mo-module-presales-skill-uoc-luong-ulnl.md) cài được mà không sửa CLI (P5) |
| **Tốt** | Ranh giới *LLM hỏi ↔ script làm* có chỗ đứng cố định trong AGENTS.md — lần sau không phải cãi lại (P6) |
| **Xấu / chi phí** | Thêm **~400–500 dòng** Node phải bảo trì, và một bề mặt lỗi mới: CLI hỏng thì **cả 4 kênh** hỏng (trước đây hỏng lẻ từng kênh). Giảm thiểu bằng T1/T4/T8 + đường cài tay giữ trong README |
| **Xấu / chi phí** | `channels.json` là **bản mô tả** hành vi client bên ngoài — client đổi format cấu hình thì entry lệch **âm thầm**. Không có cách tự phát hiện; phải smoke thật khi nâng phiên bản client |
| **Xấu / chi phí** | Hai đợt kéo dài; giữa hai đợt repo ở trạng thái **lệch nhịp** (install đã script, init còn LLM). Chấp nhận được vì hai bề mặt độc lập, không có ràng buộc chéo |
| **Trung lập** | Kênh **plugin** ([ADR-011](ADR-011-2026-07-26-minipower-claude-code-plugin.md)/[ADR-012](ADR-012-2026-07-26-minipower-cursor-plugin.md)) **không đổi** — plugin và CLI là hai đường cài song song, ADR-020 QĐ-4 vẫn buộc chúng cùng hành vi |
| **Trung lập** | Số điều kiện cứng **vẫn là 7** (C5) — `init --check` là verifier gọi theo yêu cầu, không phải hook thứ 7 |
