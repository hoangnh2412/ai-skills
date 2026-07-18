# Đánh giá Minipower & Chiến lược phát triển

| | |
|---|---|
| **Ngày** | 2026-07-17 |
| **Trạng thái** | 🟢 Đang thực thi — Q1 đã chốt (§6.1), P2 xong (§7b). **P0 chờ duyệt Q7, Q8** |
| **Phạm vi** | `minipower/` v2.5.0 @ branch `feature/upgrade-brainstorming` |
| **Đối chiếu** | [REPOZY/superpowers-optimized](https://github.com/REPOZY/superpowers-optimized) v6.6.1 |
| **Mục đích** | Ghi lại đánh giá để đọc, hỏi làm rõ từng mục, rồi mới quyết định thực thi |

> **Cách dùng tài liệu này:** mỗi mục có ID (§1.2, §3.4…). Khi cần làm rõ, trích ID. Không mục nào được thực thi cho tới khi bạn duyệt tường minh.

---

## §0. Kết luận trước

Minipower **mạnh ở tầng phương pháp luận, yếu ở tầng kỹ thuật**.

Nội dung skill (deliberation, doc-review, decision-log, token-guard) tốt hơn superpowers-optimized về chất lượng tư duy. Nhưng lớp thực thi — hooks, install, platform parity — đang phân rã: **4 bản cài đặt cùng một logic, đã lệch nhau thành bug thật, không có một dòng test nào để biết.**

Điểm quan trọng nhất của tài liệu này: **superpowers-optimized không phải hình mẫu để copy.** Nó mắc đúng cùng loại bệnh, ở quy mô lớn hơn (§4). Chiến lược "làm cho giống superpowers" sẽ là sai lầm.

Vấn đề của Minipower không phải thiếu tính năng. Là **~690 dòng code diễn đạt một cái map 18 dòng**. Mọi tính năng mới đang bị nhân với 4 nền tảng.

---

## §1. Bằng chứng — bug đã xác minh trên máy

### §1.1. Regex lệch giữa PowerShell và bash/TS

`minipower/install/cursor/hooks/`:

```
minipower-token-guard.ps1:49
  $looksLikeEdit = $lower -match 'sua|cap nhat|viet|them|sync|dong bo|review|update|write|edit'
                                  ^^^ KHÔNG DẤU

minipower-token-guard.sh:78
  grep -qE 'sửa|cập nhật|viết|thêm|sync|đồng bộ|review'
            ^^^ CÓ DẤU, thiếu update|write|edit

opencode/plugins/lib/token-guard.ts:57
  /sửa|cập nhật|viết|thêm|sync|đồng bộ|review/i
```

**Hệ quả thực tế:**

| Prompt | Windows (.ps1) | Unix/OpenCode | Đúng ra |
|---|---|---|---|
| `sửa DOC-06` | ❌ không warn | ✅ warn | warn |
| `update DOC-06` | ✅ warn | ❌ không warn | warn |

Hai nền tảng hỏng theo **hai hướng ngược nhau**. Bạn đang chạy Windows → token-guard im lặng với prompt tiếng Việt có dấu, tức là **guardrail chính không hoạt động ở môi trường chính**.

### §1.2. Các lệch khác cùng họ

| Điểm | `.ps1` | `.sh` / `.ts` |
|---|---|---|
| Baseline path | chỉ `@docs/02-baseline` (dấu `/`) | `@docs[/\\]02-baseline` |
| Module detect | đòi `Module:` (hoa) | nhận `module:` (thường) |
| Message người dùng | ASCII không dấu | Tiếng Việt đủ dấu |

→ `@docs\02-baseline` (kiểu Windows) bị chặn trên Unix nhưng **lọt trên Windows**.

### §1.2b. 🔴 BUG-3 — `DOC-0[0-9]`: một nửa bộ tài liệu vô hình với token-guard

Phát hiện khi viết test (2026-07-17). **Cả ba bản đều sai giống nhau** → không phải drift, mà là **lỗi gốc**:

```
.sh :49  grep -qE 'DOC-0[0-9]'      && has_doc=true
.ps1:37  $hasDoc = $prompt -match 'DOC-0[0-9]'
.ts :32  const hasDoc = /DOC-0[0-9]/.test(prompt)
```

`DOC-0[0-9]` chỉ khớp **DOC-00…DOC-09**. **DOC-10 → DOC-18 không bao giờ set `has_doc`.**

| Prompt | `has_doc` | Kết quả |
|---|---|---|
| `Phase: requirements — sửa DOC-06, Module: billing` | ✅ | allow (đúng) |
| `Phase: architecture — sửa DOC-12, Module: billing` | ❌ | **warn "Thiếu scope: thêm DOC-XX"** (sai) |

**9/18 DOC bị ảnh hưởng** — SAD, ADR, integration, data model, API, NFR, WBS, project plan, test strategy, deployment, CR register. Người dùng khai đủ scope vẫn bị mắng thiếu scope → **học cách phớt lờ cảnh báo**, đó là cách guardrail chết.

Đây là bằng chứng mạnh nhất cho §3.2: bug sống qua ≥1 release trên **cả 3 nền tảng** vì không có test.

### §1.2c. 🔴 BUG-5 — char class `]` thừa: nhận diện module qua đường dẫn chưa bao giờ chạy

Phát hiện khi port (2026-07-18). Ẩn trong **cả `.py`, `.sh`, `.ts`** — regex nhận diện `03-modules/<module>`:

```
[^_/\\[\s:]]      ← có HAI ']'
```

JS parse thành: *một* ký tự phủ định `[^_/\\[\s:]`, **rồi một dấu `]` literal**. Tức pattern đòi chuỗi kiểu `03-modules/b]illing` — vô nghĩa, **luôn fail**.

**Hệ quả:** một trong bốn cách nhận diện module (qua đường dẫn `03-modules/x`) **chưa bao giờ hoạt động** trên bất kỳ nền tảng nào. Prompt `Phase: requirements — sửa DOC-06 trong 03-modules/billing` bị coi là thiếu module → cảnh báo sai. Chỉ 3 cách còn lại (`Module:`, `@docs/...`, ID `BIL-FR-012`) tình cờ che bug.

Đã sửa (FIX-5): viết lại bằng negative lookahead `/03-modules[/\\](?!_)[^/\\\s:]+/` — rõ nghĩa "sau `03-modules/` là segment 1+ ký tự, không bắt đầu bằng `_`" (loại `_template`, `_legacy`). Test bắt được ngay khi port.

> Đây là bug **thứ năm** tìm ra, và là bug thuyết phục nhất cho luận điểm §3.2: nó nằm trong bản `.ts` "sạch nhất", copy y nguyên qua 3 ngôn ngữ, sống qua nhiều release — vì **không ai từng chạy một test nào**.

### §1.3. Quy mô trùng lặp

| Logic | Các bản cài đặt | Tổng dòng |
|---|---|---|
| auto-routing | `.py` 289 + `.ps1` 191 + `.ts` 207 | **687** |
| token-guard | `.sh` 94 + `.ps1` 62 + `.ts` 78 | 234 |
| token-guard-read | `.sh` 39 + `.ps1` 41 + `.ts` 26 | 106 |
| decision-staleness | `.py` 133 + `.ts` 109 + 2 wrapper | 296 |
| bypass | `.py` 23 + `.ps1` 7 + `.ts` 7 | 37 |

**~1.360 dòng** cho ~5 luật. Map DOC→phase hardcode ở **≥3 nơi** — thêm DOC-19 là 3 chỗ sửa, không gì bắt lỗi nếu sót.

Thêm: 3 bản `hooks.fragment{,.unix,.windows}.json` (25 dòng mỗi bản, gần như giống hệt) phải sửa đồng bộ mỗi lần đổi tên hook.

---

## §2. Điểm mạnh

### §2.1. Chiều sâu domain — không đối thủ
superpowers **không có gì** tương đương 18 DOC template + trace matrix + baseline/CR governance. Đây là tài sản thật, khó copy, là lý do minipower tồn tại. **Không được đánh đổi.**

### §2.2. `deliberation` — skill tốt nhất trong pack
Premise Check Cổng 0 hỏi *"DOC này có consumer hay chỉ 'cho đủ bộ'?"* — câu hỏi mà phần lớn quy trình tài liệu doanh nghiệp không dám hỏi. Verdict bắt buộc PROCEED/RESHAPE/STOP; 7 góc nhìn, mỗi góc một lượt, không tranh luận; tách "điểm hội tụ" khỏi "căng thẳng còn sống"; reframe vấn đề **không kèm giải pháp**.

Đối chiếu: superpowers `premise-check` chỉ **38 dòng** — mỏng hơn nhiều.

### §2.3. `decision-log` hơn `session-log.md` của superpowers
Schema DEC có `superseded-by`, `Options`, `Why (loại B, C vì)`, `Confidence`, `Trace`. Recall protocol: gặp quyết định cũ thì **kế thừa hoặc supersede, không quyết lại từ đầu**.

superpowers chỉ có "manual decision log with rejection history" — không schema, không supersede chain.

### §2.4. Kỷ luật token — thực hành tốt hơn superpowers ở chính điểm họ rao giảng

| | Minipower | superpowers |
|---|---|---|
| Skill con | 26–102 dòng | median 113 |
| Lớn nhất | deliberation 102 | `frontend-design` **435** |

superpowers trích nghiên cứu *"verbose instructions reduce agent success rates"* rồi ship skill 435 dòng. **Bạn thực hành nguyên tắc đó tốt hơn họ.**

### §2.5. `agents/*.md` tool-agnostic — kiến trúc đúng về khái niệm
Markdown thuần làm SSOT, `install/*` là adapter. Sạch hơn `plugin.universal.yaml` của superpowers — file đó thậm chí không cover Cursor (§4.1).

### §2.6. Trung thực về giới hạn
Staleness hook tự ghi *"Chỉ để nhắc, không phán quyết — verdict cuối do người/deliberation"*. Hiếm và đáng giữ.

### §2.7. Mô hình shim của Claude adapter đã đúng
`install/claude/hooks/*` chỉ 5–6 dòng, `exec` sang script Cursor. **Đây chính là mô hình nên nhân rộng** (§5.1).

---

## §3. Điểm yếu — xếp theo mức nghiêm trọng

### §3.1. 🔴 Bốn bản cài đặt một logic, đã lệch thành bug
Chi tiết §1. Đây là gốc của mọi vấn đề còn lại.

### §3.2. 🔴 Không một dòng test, không CI
- Không `.github/workflows/`, không `package.json`, không pytest/bats/Pester.
- **595 dòng TypeScript chưa từng được build hay type-check.**
- `auto-routing.py` là **hàm thuần** (prompt vào → quyết định ra) — loại code dễ test nhất, mà không có test.

Hệ quả không phải "code xấu", mà là: **không có cách nào biết routing có hoạt động không.** Bug §1.1 đã sống qua ít nhất một release.

### §3.3. 🔴 Không có chi phí tương xứng (proportional overhead)
**Thiếu sót thiết kế lớn nhất.** Mọi prompt đều đi qua đủ gate: deliberation → phase skill → doc-review → verdict. Không có lối thoát cho việc nhỏ — "sửa typo trong DOC-06" vẫn phải khai Phase + Module + DOC.

superpowers có 3 tầng micro/lightweight/full, nói thẳng *"micro-tasks skip all gates"*.

**Guardrail không có van xả thì người dùng sẽ học cách gõ `BYPASS` — và lúc đó mất toàn bộ guardrail.**

### §3.4. 🟡 Routing bằng regex trên văn bản tự do tiếng Việt — giòn theo thiết kế
Heuristic nhúng trong 3 ngôn ngữ. Matcher bare `DOC-NN` bắn khi prompt chỉ *nhắc* tới hai DOC → **block cứng** prompt hợp lệ.

Đối chiếu — superpowers tách **rules-as-data**: `skill-rules.json` 163 dòng khai báo keyword + intentPattern + priority; scoring cộng dồn (keyword +1, intent +2); ngưỡng ≥2 (*"single keyword matches are noise"*). Thêm skill = thêm một object JSON, **không đụng code**.

### §3.5. 🟡 Adapter Claude ship file chết
`minipower-token-guard.{sh,ps1}` và `minipower-auto-routing.{sh,ps1}` tồn tại và delegate sang Cursor, nhưng `settings.fragment.json` **chỉ wire `SessionStart`** (staleness). Hai prompt guard không được nối, README không nhắc.

→ Người dùng Claude Code **tưởng có token-guard, thực tế không**. Im lặng còn tệ hơn không có.

### §3.6. 🟡 Install thủ công, không verify
- `/ABSOLUTE/PATH/TO/...` trong `settings.fragment.json` bắt sửa tay.
- Merge JSON tay, không có bước kiểm tra.
- Hướng dẫn "symlink hoặc copy" — copy thì phá giả định "symlink tự đồng bộ".
- `install/cursor/hooks/__pycache__/hook_bypass.cpython-310.pyc` **bị commit** (`.gitignore` chỉ có `.env`).

### §3.7. 🟡 Lỗ hổng nội dung: rubric Complexity không tồn tại
`skills/planning/SKILL.md` tham chiếu *"Complexity 0–20 × 5 chiều → Small…Enterprise"*. **Rubric không có ở đâu trong pack.** Agent phải tự bịa → điểm complexity không tái lập được giữa hai session.

### §3.8. ⚪ Tiếng Việt — đánh đổi cần quyết định có ý thức
Không phải lỗi. Nhưng nó đóng cửa mọi contributor ngoài team. Cần một quyết định tường minh (ghi vào decision-log), không để mặc định trôi.

### §3.9. ⚪ Runtime coupling lộn xộn
`.sh` shell out sang `python3` **chỉ để parse JSON** rồi re-serialize. OpenCode bỏ python (thuần TS) → staleness giờ có 2 code path độc lập, âm thầm lệch nhau.

---

## §4. Sự thật về superpowers-optimized (đừng thần tượng)

Đã kiểm tra source thay vì tin README. **Bốn tuyên bố lớn đều rò rỉ:**

### §4.1. "SSOT `plugin.universal.yaml`"
- `grep -i cursor plugin.universal.yaml` → **0 match**. `platforms: [claude-code, codex]` — Cursor không có mặt.
- File tự ghi `version: "6.5.2"`, trong khi `VERSION` + cả 3 manifest = **6.6.1**.
- → **Compile lại hôm nay sẽ regress toàn bộ build về 6.5.2.**
- Parity thật: `hooks.json` = 9 hook / 6 event; `hooks-cursor.json` = **2 hook**. Cursor **không có** skill activation, **không có** safety hook (`block-dangerous-commands`, `protect-secrets`) — im lặng.

### §4.2. "Codegen"
Compiler `hookbridge` **không nằm trong repo** (đã bị gỡ, ghi trong RELEASE-NOTES). **Clone ≠ build lại được.** Ràng buộc duy nhất là một câu README: *"are generated — never edit them directly"*.

### §4.3. "Shared lib"
`lib/skills-core.js` 251 dòng, **zero importer**. OpenCode plugin tự viết bản yếu hơn (không hỗ trợ block scalar → sẽ mangle chính `description: >` mà router của họ đang dùng). Test vẫn assert file tồn tại → **test giữ code chết sống**.

### §4.4. "Testing"
7.735 dòng test, **không CI** (`.github/` chỉ có FUNDING + ISSUE_TEMPLATE, không có `workflows/`). Post-push validation là **checklist markdown cho người đọc**.

### §4.5. 🔴 Lỗi nặng nhất của họ — bài học trực tiếp cho ta
`tools/autoimprove/eval.js` — vòng lặp để LLM tự tối ưu `skill-rules.json` — **re-implement `matchSkills()` và bản copy đã lệch**:

```js
// eval.js — substring
if (lower.includes(kw.toLowerCase())) score += 1;

// skill-activator.js (production) — word-boundary
const re = new RegExp(`\\b${escaped}`); if (re.test(lower)) score += 1;
```

Cụ thể: keyword `"ui"` của `frontend-design`, với prompt *"I want to **build** a notification system"* → eval.js cho **+1** (`b-u-i-ld`), production cho **+0**. File tự ghi *"Must match hooks/skill-activator.js exactly"* — **không hề**.

→ Họ đang để AI tune keyword **chống lại một scorer không phải thứ đang chạy**.

### §4.6. Kết luận về superpowers
*Thiết kế* tốt, *thực thi* thủ công y hệt ta. Mọi invariant (SSOT↔generated, eval↔production, skill list↔router prose↔rules) duy trì bằng kỷ luật thay vì bằng check — và **ít nhất 2 cái đã lệch rồi**.

Họ chỉ hơn ta ở chỗ **đã viết ra các bài test**, dù không chạy.

**→ Định hình lại chiến lược: đừng đuổi theo quy mô của họ. Hãy làm cái họ định làm mà làm không xong.**

---

## §5. Chiến lược đề xuất

> **Nguyên tắc xuyên suốt: co lại trước khi mở rộng.**

### §5.1. P0 — Diệt drift bằng cách XOÁ, không phải bằng codegen
**Ước tính: 1–2 tuần · Giảm ~700–900 dòng**

Bài học từ §4.1–4.2: *thêm một compiler mà không có CI thì chỉ có thêm một thứ để lệch.* Làm ngược lại — **một implementation, shim mỏng**:

| # | Việc | Ghi chú |
|---|---|---|
| 1 | Chọn **một** runtime cho hook logic | `.py` đã là SSOT thực tế (auto-routing 289 + staleness 133). Node cũng được nếu muốn dùng chung OpenCode. **Cần bạn quyết** (§6, Q1) |
| 2 | Mọi platform gọi qua shim ≤10 dòng | Đúng mô hình `install/claude/hooks/*` đang làm — §2.7 |
| 3 | **Xoá** `auto-routing.ps1` (191), `token-guard.ps1` (62), `token-guard-read.ps1` (41), lib TS trùng | Windows gọi `python`/`node` — cả hai đã là dependency thực tế (§3.9) |
| 4 | Gộp 3 bản `hooks.fragment*.json` → 1 + script sinh | |
| 5 | `.gitignore`: thêm `__pycache__/`, `*.pyc`; xoá `.pyc` khỏi git | §3.6 |

**Bug §1.1 tự biến mất** vì chỉ còn một regex.

### §5.2. P1 — Rules as data
**Ước tính: 1 tuần**

Trích map DOC→phase và mọi keyword heuristic ra **một file**:

```json
{
  "phase_by_doc": { "DOC-01": "discovery", "DOC-13": "requirements", "...": "..." },
  "edit_verbs":    ["sửa","cập nhật","viết","thêm","sync","đồng bộ","update","edit","write"],
  "breadth_words": ["toàn bộ","all modules","sync everything","review all"]
}
```

- Cả hook lẫn `agents/auto-routing.md` sinh ra từ đây → thêm DOC-19 = **một dòng JSON**.
- **Chuẩn hoá tiếng Việt trước khi match** (bỏ dấu cả prompt lẫn keyword) → diệt sạch class bug có-dấu/không-dấu.
- Lấy **cơ chế** của superpowers `skill-rules.json`, **không** lấy `eval.js` tách rời (§4.5): **eval phải `import` chính hàm production, không copy.**

### §5.3. P2 — Test tối thiểu + CI
**Ước tính: 3–5 ngày · Đòn bẩy cao nhất**

Không cần 7.735 dòng. Cần **~20 golden case**:

```
"sửa DOC-06 module billing"     → warn=false, phase=requirements
"update DOC-06"                 → warn=false            ← case bắt bug §1.1 hôm nay
"@docs/"                        → block
"review DOC-06 và DOC-08"       → block (2 phase, gợi ý tách)
"@docs\02-baseline"             → block                 ← case bắt bug §1.2
```

`auto-routing` là hàm thuần → test chạy **< 1 giây**, không tốn tiền, không cần LLM.

Cộng một GitHub Action ~20 dòng: chạy test + `git diff --exit-code` sau khi regen fragment.

> **Đây là thứ duy nhất superpowers thiếu, và nó khiến toàn bộ 7.735 dòng test của họ vô giá trị (§4.4). Một action nhỏ đặt Minipower trên họ ngay lập tức.**

### §5.4. P3 — Chi phí tương xứng (3 tầng)
**Ước tính: 1–2 tuần** · Giải quyết §3.3. Đây là chỗ mượn tư duy superpowers có lãi nhất.

| Tầng | Ví dụ | Gate |
|---|---|---|
| **Micro** | Sửa typo, thêm 1 dòng bảng | Không gate, không cần khai Phase |
| **Light** | Thêm FR vào DOC-06 đã có | Token-guard scope; bỏ deliberation |
| **Full** | Module mới, đổi kiến trúc, trước baseline | Deliberation → phase → doc-review → verdict |

### §5.5. P4 — Vá lỗ nội dung
**Ước tính: vài ngày, làm song song**

- Viết rubric Complexity 5 chiều × 0–20 — **hoặc bỏ** khỏi planning (§3.7).
- Wire token-guard + auto-routing vào `settings.fragment.json` của Claude — **hoặc xoá file chết** (§3.5).
- Thay `/ABSOLUTE/PATH/TO/` bằng script install + bước verify (§3.6).

### §5.6. Việc KHÔNG nên làm

| ❌ | Vì sao |
|---|---|
| Thêm platform thứ tư | Chi phí drift nhân tuyến tính, giá trị thì không |
| Viết README "research-backed" | superpowers trích 3 paper rồi ship skill 435 dòng vi phạm chính paper đó (§2.4). Ta đang thực hành minimal context tốt hơn — đừng đánh đổi lấy marketing |
| Thêm skill mới trước khi xong P0–P2 | Mỗi skill mới hiện phải trả thuế ×4 nền tảng và 0 test |
| Bê `plugin.universal.yaml` về | §4.1–4.2 — SSOT không có CI = thêm một thứ để lệch |

---

## §6. Câu hỏi cần quyết

### §6.1. ✅ ĐÃ CHỐT — DEC-ARC-001: Runtime SSOT = Node, viết bằng `.js` thuần

| | |
|---|---|
| **Ngày** | 2026-07-17 |
| **Status** | accepted |
| **Thay thế** | Q1 + Q2 (Q2 tự tan — xem bên dưới) |

**Context.** Cần một implementation duy nhất cho hook logic, chạy trên Win/Linux/macOS, tương thích Cursor + Claude Code + OpenCode.

**Options.**
- **A — Python.** `auto-routing.py` (289 dòng) + `decision-staleness.py` (133) là bản trưởng thành nhất, đang được `.sh` uỷ quyền tới.
- **B — Node (.js thuần).** ✅ **CHỌN**
- **C — Node (.ts + build).** Giữ nguyên codebase TS hiện có.

**Decision.** B — Node, file `.js` (ESM), **không build step, không dependency**.

**Why — loại A (Python) vì:**
1. **OpenCode là ràng buộc cứng và nó JS-native.** Plugin import in-process: `import { checkAutoRouting } from "./lib/auto-routing.ts"`. Python **không bao giờ** import được vào đây — chỉ có thể `spawn` subprocess hoặc port sang TS. **Chính đây là nguồn gốc drift** (207 dòng `auto-routing.ts` tồn tại vì lý do này). Chọn Python ⇒ P0 thất bại theo định nghĩa: không thể có một implementation.
   - Cursor và Claude **không ràng buộc gì** (hook chỉ là lệnh shell). Chỉ OpenCode ràng buộc → OpenCode chọn hộ.
2. **Python SSOT đang chết trên chính máy dev.** Kiểm chứng trực tiếp:
   ```
   $ echo '{"prompt":"sửa DOC-06 module billing"}' | bash minipower-token-guard.sh
   python3: command not found        exit=127
   ```
   Máy có Node v22.22.2 + npm 10.9.7; **không có** `python`, `python3`, `py`. Toàn bộ nhánh Unix của pack là code chết ở đây — chỉ còn `.ps1`, đúng bản lệch nhất.
3. **Team đã bỏ phiếu bằng chân.** Header `decision-staleness.ts`: *"Pure git (execFileSync) + fs — **không cần python runtime**"*. Ai đó đã thấy python là gánh nặng và thoát — nhưng thoát bằng cách viết bản thứ hai ⇒ thành drift thay vì thành giải pháp.
4. **Cross-platform:** `python` trên Windows có bẫy mở Microsoft Store; chia rẽ `python` vs `python3`; macOS không có `python3` dùng được nếu chưa cài Xcode CLT. Node là một binary, `node x.js` giống hệt trên cả ba OS.

**Why — loại C (.ts + build) vì:** Node 22 chưa chạy `.ts` trực tiếp ổn định (type-stripping còn experimental) ⇒ cần build step ⇒ lại có **artifact sinh ra mà không CI nào kiểm** — **đúng cái bẫy `plugin.universal.yaml` của superpowers (§4.2)**. Hôm nay 595 dòng TS chưa từng được build; đừng thể chế hoá thêm. `.js` + JSDoc cho type mà không cần compile.

**Q2 tự tan.** Không thêm dependency nào: Node đã có sẵn, Python thì không. Node SSOT **giảm** dependency.

**Consequences.**
- `.ps1` biến mất hoàn toàn — không phải vì ta xoá, mà vì hết lý do tồn tại. Shim còn một dòng: `node ${MINIPOWER_ROOT}/hooks/token-guard.js`.
- `.sh` hết shell out sang python để parse JSON (§3.9).
- **Rủi ro:** port lại `auto-routing.py` 289 dòng. **Giảm thiểu bằng P2 đi trước** — golden test chốt hành vi, port phải pass.

**Trace:** §5.1 · §3.9 · §4.2 · `minipower/hooks/`
**Confidence:** cao — dựa trên bằng chứng thực thi, không phải suy đoán.

### §6.2. Còn chờ quyết

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| **Q3** | §3.5 — Claude adapter: **wire** 2 hook đó vào, hay **xoá**? | |
| **Q4** | §3.7 — Rubric Complexity: **viết** hay **bỏ**? | |
| **Q5** | §3.8 — Tiếng Việt: giữ Việt-only, hay song ngữ (rule tiếng Anh + message tiếng Việt)? | Khả năng đóng góp |
| **Q6** | Thứ tự thực thi: theo §7, hay khác? | |
| **Q7** 🆕 | **read-guard hiện KHÔNG gọi `shouldBypass`** — `BYPASS` mở được token-guard và auto-routing, nhưng **không** mở được read-guard. Cố ý (an toàn) hay bug (thiếu nhất quán)? | Test `[Q7]` đang encode hành vi hiện tại (deny). Chốt trước khi port |
| **Q8** 🆕 | **BUG-3 (§1.2b) sửa tới đâu?** `hasDoc` nên là `/DOC-\d{2}/` (mọi số — coi "user đã nêu DOC" là tín hiệu scope) hay `/DOC-(0[1-9]\|1[0-8])/` (chỉ DOC hợp lệ)? | Test đang giả định **`/DOC-\d{2}/`** — lý do: token-guard chỉ là tín hiệu scope, không phải validator; tách khỏi map DOC→phase; thêm DOC-19 sau này không cần sửa token-guard. `DOC-99` sẽ lọt qua scope check — chấp nhận được? |

---

## §7. Thứ tự thực thi đề xuất

```
P2(test trước) → P0(xoá trùng) → P1(rules-as-data) → P3(3 tầng) → P4(vá nội dung)
└──────────── ~3 tuần ────────────┘
```

**Lý do đảo P2 lên trước P0:** viết golden test **trước** để chốt hành vi hiện tại, rồi mới xoá `.ps1`/`.ts`.

- Test chứng minh việc xoá không làm hỏng gì → xoá 700 dòng mà không sợ.
- Bắt luôn bug `sửa`/`update` (§1.1) ngay ở commit đầu tiên.

Sau 3 tuần đầu: **mọi tính năng mới chỉ tốn 1× thay vì 4×.**

---

## §7b. Tiến độ thực thi

| Mốc | Trạng thái | Ngày |
|---|---|---|
| DEC-ARC-001 — chốt runtime = Node/.js | ✅ | 2026-07-17 |
| Q7a/Q7b/Q8 — chốt | ✅ Q7a deny tuyệt đối · Q7b không bypass · Q8=A | 2026-07-17 |
| **P2 — golden test (RED)** | ✅ 138 case, 4 file | 2026-07-17 |
| **P0 — port → `lib/*.js` (GREEN)** | ✅ **pass. Sửa BUG 1,2,3,4,5** (138 → sau khi thêm staleness+bin: **169**) | 2026-07-18 |
| **P0 — shim + nối install + xoá bản cũ** | ✅ **xong** | 2026-07-18 |
| **P2 — GitHub Action (matrix 3 OS)** | ✅ `.github/workflows/minipower-hooks.yml` | 2026-07-18 |
| P4 — đồng bộ docs mô tả hook (docs/token-guard.md, agents/auto-routing.md) | ⏸ còn sót vài dòng mô tả cơ chế cũ | |
| P1 — rules.json | ⏸ | |

### P0 hoàn tất (2026-07-18)

**Thêm:** `hooks/lib/decision-staleness.js` (port nốt mảnh thứ 5) · `hooks/bin/*.js` (4 shim CLI + `_io.js`) · test `decision-staleness` + `bin` (integration) → **169 pass**.

**Nối install:**
- Cursor `hooks.fragment.json` → `node .cursor/skills/minipower/hooks/bin/*.js`. Bỏ symlink script riêng (pack đã symlink mang sẵn bin+lib). Gộp 3 fragment → 1.
- Claude `settings.fragment.json` → wire đủ `UserPromptSubmit` (3 hook) + `PreToolUse` read guard. Sửa §3.5 (file chết).
- OpenCode `minipower.ts` → import `../../../hooks/lib/*.js`. Giữ `parts.ts` (glue). Xoá 5 lib `.ts` trùng.

**Xoá:** cursor `*.{ps1,py,sh}` + `hooks.fragment.{unix,windows}.json` + `__pycache__` · claude/hooks (6 file) · opencode 5 lib `.ts`. `.gitignore` += `__pycache__/ *.pyc node_modules/`.

**CI:** matrix ubuntu/windows/macos × Node 22, chạy `node --test` mỗi push/PR đụng `minipower/hooks/**`.

> ⚠ **Ranh giới xác minh:** golden test + CI xác minh **logic + I/O contract** (verify được ở đây). Việc hook **thật sự nổ trong IDE** (Cursor/Claude/OpenCode) chỉ đúng-theo-cấu-trúc, **chưa smoke-test trong IDE thật** — cần bạn chạy thử một prompt trên mỗi nền tảng. Lệnh smoke ở README từng nền tảng.

**Kết quả port:** `lib/{bypass,token-guard,auto-routing,token-guard-read}.js` — 4 hàm thuần, 0 dependency, 0 build. `node --test` → **138 pass / 0 fail**. Việc port pass hết bộ test ⇒ **5 bug tự sửa** trong một lần, không cần commit "fix" riêng:

| Bug | Nội dung | Trạng thái |
|---|---|---|
| BUG-1 (§1.1) | regex `sửa` vs `sua` lệch PS1/sh | ✅ FIX-1 (chuẩn hoá bỏ dấu) |
| BUG-2 (§1.2) | path `/` vs `\` lệch | ✅ FIX-2 |
| BUG-3 (§1.2b) | `DOC-0[0-9]` bỏ sót DOC-10..18 | ✅ FIX-3 (`DOC-\d{2}`) |
| BUG-4 (§Q7a) | read-guard baseline: `allow_legacy` tính rồi bỏ quên | ✅ nay deny tuyệt đối CÓ CHỦ ĐÍCH |
| BUG-5 (§1.2c) | char class `]` thừa → module-path detection chết | ✅ FIX-5 (lookahead) |

### Bộ test đã viết

```
minipower/hooks/
├── package.json            {"type":"module"} — 8 dòng, 0 dependency, 0 build
├── lib/                    ← CHƯA TỒN TẠI (đây là phần port, P0)
└── test/
    ├── bypass.test.js            16 case
    ├── token-guard.test.js       40 case
    ├── auto-routing.test.js      42 case
    └── token-guard-read.test.js  22 case
```

Chạy: `cd minipower/hooks && node --test` (hoặc `npm test`). Không cần cài gì.

**Trạng thái RED hiện tại — đúng như mong đợi:**
```
# tests 4   # pass 0   # fail 4
Cannot find module '.../hooks/lib/auto-routing.js'
Cannot find module '.../hooks/lib/bypass.js'
Cannot find module '.../hooks/lib/token-guard.js'
Cannot find module '.../hooks/lib/token-guard-read.js'
```
Fail **chỉ** vì chưa port — không phải vì test sai.

### API chốt bởi test (kế thừa chữ ký bản TS, không phát minh lại)

```js
shouldBypass(prompt)                        -> boolean
checkTokenGuard(prompt)                     -> {action:"allow"|"warn"|"block", message?}
checkAutoRouting(prompt, filePaths, opts)   -> {action:"allow"|"enrich"|"block", phase?, prefix?, context?, message?}
checkReadGuard(filePath, prompt)            -> {action:"allow"|"deny", message?}
```

Hàm thuần — không `print`, không `exit`. In/exit là việc của shim mỗi nền tảng. Đây là điều kiện để vừa test được vừa `import` được từ OpenCode.

**Hai thay đổi API cố ý so với `.py`:**
1. `checkAutoRouting` trả `prefix` thay vì prompt đã ghép — mỗi nền tảng ghép khác nhau (Cursor `updated_input`, OpenCode `prependText`). Theo bản `.ts`.
2. `opts.root` thay cho đọc thẳng `process.env.MINIPOWER_ROOT` → test không phụ thuộc global state. Mặc định vẫn đọc env, rồi `"ai-skills/minipower"`.

### ⚠ Ghi chú phương pháp — vì sao test KHÔNG phải "golden capture"

Kế hoạch ban đầu (§7) là *"chốt hành vi hiện tại rồi mới xoá"*. **Bất khả thi**, vì hai lý do:

1. **Không có *một* hành vi hiện tại** — `.py`, `.ps1`, `.ts` bất đồng (§1.1, §1.2). Capture bản nào cũng là chọn một cách tuỳ tiện.
2. **Không chạy được bản Python để capture** — không có python trên máy (§6.1).

→ Test encode **hành vi ĐÚNG**, suy ra từ `.py` (bản đầy đủ nhất) + `agents/auto-routing.md` (SSOT tài liệu). Chỗ sửa lỗi đánh dấu `[FIX-n]` ngay trong test:

| Mã | Nội dung | Ai sai |
|---|---|---|
| `[FIX-1]` | Động từ sửa nhận cả có dấu/không dấu, Việt/Anh (chuẩn hoá bỏ dấu trước khi match) | `.ps1` thiếu chữ có dấu; `.sh`/`.ts` thiếu `update\|write\|edit` |
| `[FIX-2]` | Path nhận cả `/` và `\` trên mọi OS | `.ps1` chỉ `/` |
| `[FIX-3]` | `hasDoc` phủ DOC-01…DOC-18 | **cả ba** (§1.2b) |
| `[FIX-4]` | `module:` không phân biệt hoa thường | `.ps1` đòi hoa |

**Hệ quả quan trọng:** port xong mà pass hết ⇒ **4 bug tự động được sửa**, không cần một commit "fix bug" riêng. Nhưng cũng nghĩa là **JS sẽ không hành xử giống hệt bản cũ** — đó là chủ đích, và là lý do các mục `[FIX-n]` cần bạn duyệt.

## §8. Nguồn & phương pháp

- Minipower: đọc toàn bộ `skills/`, `agents/`, `docs/`, `install/`, `templates/`, skeleton, CHANGELOG (2 agent quét song song).
- superpowers-optimized: clone `--depth 1`, đọc source trực tiếp (`plugin.universal.yaml`, `lib/skills-core.js`, `hooks/skill-rules.json`, `hooks/skill-activator.js`, `skills/*/SKILL.md`, `tests/`, `tools/autoimprove/`) — **không dựa vào README**.
- Bug §1.1/§1.2: **đã xác minh trực tiếp bằng grep trên máy**, không phải suy đoán.
- Con số dòng: `wc -l` thực tế.

---

**Trạng thái: chờ bạn review §6 trước khi thực thi bất cứ mục nào.**
