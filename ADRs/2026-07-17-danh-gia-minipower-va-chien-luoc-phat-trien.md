# Đánh giá Minipower & Chiến lược phát triển

| | |
|---|---|
| **Ngày** | 2026-07-17 (cập nhật 2026-07-19) |
| **Trạng thái** | ✅ **Toàn bộ P0–P4 + R1–R6 xong.** R6 merged → main; R3/R4/R5 làm @ branch `feature/minipower-rules-as-data`. Quyết định mở: **không còn** (Q5, Q4 đã chốt) |
| **Phạm vi** | `minipower/` v2.5.0 · R3/R4/R5 @ branch `feature/minipower-rules-as-data` |
| **Đối chiếu** | [REPOZY/superpowers-optimized](https://github.com/REPOZY/superpowers-optimized) v6.6.1 |
| **Mục đích** | Ghi lại đánh giá, chiến lược và việc còn phải làm |

---

## §0. Kết luận

Minipower **mạnh ở tầng phương pháp luận, yếu ở tầng kỹ thuật**.

Nội dung skill (deliberation, doc-review, decision-log, token-guard) tốt hơn superpowers-optimized về chất lượng tư duy. Nhưng lớp thực thi — hooks, install, platform parity — từng phân rã: **4 bản cài đặt cùng một logic đã lệch nhau thành bug thật, không có một dòng test nào để biết.** Đây là vấn đề đã được giải quyết ở P0/P2 (Node SSOT + golden test + CI).

Điểm quan trọng nhất: **superpowers-optimized không phải hình mẫu để copy.** Nó mắc đúng cùng loại bệnh, ở quy mô lớn hơn (§3). Chiến lược "làm cho giống superpowers" là sai lầm.

Vấn đề gốc của Minipower không phải thiếu tính năng, mà là **~690 dòng code diễn đạt một cái map 18 dòng** — mọi tính năng mới bị nhân với 4 nền tảng. Chiến lược xuyên suốt: **co lại trước khi mở rộng.**

> **Bằng chứng cho luận điểm "không test → drift":** 5 bug (regex có/không dấu, path `/` vs `\`, `DOC-0[0-9]` bỏ sót DOC-10..18, read-guard baseline, char class `]` thừa) đã sống qua ≥1 release trên nhiều nền tảng vì không ai từng chạy một test nào. Cả 5 đã tự sửa khi port sang Node SSOT + golden test (P0/P2). Chi tiết bug giữ trong lịch sử git; ở đây chỉ giữ bài học.

---

## §1. Điểm mạnh

### §1.1. Chiều sâu domain — không đối thủ
superpowers **không có gì** tương đương 18 DOC template + trace matrix + baseline/CR governance. Đây là tài sản thật, khó copy, là lý do minipower tồn tại. **Không được đánh đổi.**

### §1.2. `deliberation` — skill tốt nhất trong pack
Premise Check Cổng 0 hỏi *"DOC này có consumer hay chỉ 'cho đủ bộ'?"* — câu hỏi mà phần lớn quy trình tài liệu doanh nghiệp không dám hỏi. Verdict bắt buộc PROCEED/RESHAPE/STOP; 7 góc nhìn, mỗi góc một lượt, không tranh luận; tách "điểm hội tụ" khỏi "căng thẳng còn sống"; reframe vấn đề **không kèm giải pháp**.

Đối chiếu: superpowers `premise-check` chỉ **38 dòng** — mỏng hơn nhiều.

### §1.3. `decision-log` hơn `session-log.md` của superpowers
Schema DEC có `superseded-by`, `Options`, `Why (loại B, C vì)`, `Confidence`, `Trace`. Recall protocol: gặp quyết định cũ thì **kế thừa hoặc supersede, không quyết lại từ đầu**.

superpowers chỉ có "manual decision log with rejection history" — không schema, không supersede chain.

### §1.4. Kỷ luật token — thực hành tốt hơn superpowers ở chính điểm họ rao giảng

| | Minipower | superpowers |
|---|---|---|
| Skill con | 26–102 dòng | median 113 |
| Lớn nhất | deliberation 102 | `frontend-design` **435** |

superpowers trích nghiên cứu *"verbose instructions reduce agent success rates"* rồi ship skill 435 dòng. **Bạn thực hành nguyên tắc đó tốt hơn họ.**

### §1.5. `agents/*.md` tool-agnostic — kiến trúc đúng về khái niệm
Markdown thuần làm SSOT, `install/*` là adapter. Sạch hơn `plugin.universal.yaml` của superpowers — file đó thậm chí không cover Cursor (§3.1).

### §1.6. Trung thực về giới hạn
Staleness hook tự ghi *"Chỉ để nhắc, không phán quyết — verdict cuối do người/deliberation"*. Hiếm và đáng giữ.

### §1.7. Mô hình shim của Claude adapter đã đúng
`install/claude/hooks/*` chỉ 5–6 dòng, `exec` sang script Cursor. **Đây chính là mô hình đã được nhân rộng** khi gộp về Node SSOT (P0).

---

## §2. Điểm yếu — đã xử lý toàn bộ

> Đã xử lý qua P0/P2/P3: **bốn bản cài đặt lệch nhau** (gộp về một Node SSOT), **không test/CI** (golden test + GitHub Action 3 OS), **không có chi phí tương xứng** (3 tầng micro/light/full), **Claude adapter ship file chết** (đã wire), **runtime coupling `.sh`→python** (bỏ python, thuần Node).

### §2.1. ✅ Routing regex giòn → rules-as-data (R3, 2026-07-19)
Trước: heuristic (map DOC→phase, edit-verbs, breadth) nhúng trong code, thêm DOC = sửa nhiều nơi. Nay tách **[hooks/lib/rules.json](../minipower/hooks/lib/rules.json)** làm SSOT dữ liệu; `auto-routing.js` + `token-guard.js` sinh cấu trúc từ đó; `agents/auto-routing.md` sinh bảng map qua `npm run gen` (CI `gen --check` chặn lệch). **Thêm DOC-19 = một dòng JSON.** Keyword lưu tiếng Việt có dấu (đọc được), strip-diacritics trước match → giữ diệt class bug có/không dấu.

### §2.2. ✅ Install thủ công → script + verify (R5, 2026-07-19)
`/ABSOLUTE/PATH/TO/...` thay bằng **[install/claude/install.mjs](../minipower/install/claude/install.mjs)**: tự resolve path, merge an toàn (giữ hook/permission khác, idempotent, backup `.bak`), và **verify** bằng smoke-test 4 shim dưới `node` thật. README cập nhật.

### §2.3. ✅ Rubric Complexity → đã viết (R4, 2026-07-19)
**[skills/planning/complexity-rubric.md](../minipower/skills/planning/complexity-rubric.md)** — 5 chiều × 0–4 = 0–20 → Small/Medium/Large/Enterprise, mỗi chiều có mốc 0/2/4 + ví dụ. `planning/SKILL.md` trỏ tới. Điểm complexity nay **tái lập được**.

### §2.4. ✅ Tiếng Việt — chốt giữ Việt-only (Q5, 2026-07-19)
**Quyết định:** giữ tiếng Việt. **Lý do:** chủ sở hữu pack đọc-hiểu & ứng dụng trực tiếp bằng tiếng Việt; ưu tiên tính dùng được của team hơn khả năng đóng góp ngoài. Chấp nhận đánh đổi (đóng cửa contributor ngoài) một cách có ý thức.

---

## §3. Sự thật về superpowers-optimized (đừng thần tượng)

Đã kiểm tra source thay vì tin README. **Bốn tuyên bố lớn đều rò rỉ** — đây là bài học định hình chiến lược, không phải việc phải làm.

### §3.1. "SSOT `plugin.universal.yaml`"
- `grep -i cursor plugin.universal.yaml` → **0 match**. `platforms: [claude-code, codex]` — Cursor không có mặt.
- File tự ghi `version: "6.5.2"`, trong khi `VERSION` + cả 3 manifest = **6.6.1** → compile lại hôm nay sẽ regress build về 6.5.2.
- Parity thật: `hooks.json` = 9 hook / 6 event; `hooks-cursor.json` = **2 hook**. Cursor **không có** skill activation, **không có** safety hook — im lặng.

### §3.2. "Codegen"
Compiler `hookbridge` **không nằm trong repo** (đã bị gỡ). **Clone ≠ build lại được.** Ràng buộc duy nhất là một câu README: *"are generated — never edit them directly"*.

### §3.3. "Shared lib"
`lib/skills-core.js` 251 dòng, **zero importer**. OpenCode plugin tự viết bản yếu hơn. Test vẫn assert file tồn tại → **test giữ code chết sống**.

### §3.4. "Testing"
7.735 dòng test, **không CI**. Post-push validation là **checklist markdown cho người đọc**.

### §3.5. 🔴 Lỗi nặng nhất của họ — bài học trực tiếp cho ta
`tools/autoimprove/eval.js` — vòng lặp để LLM tự tối ưu `skill-rules.json` — **re-implement `matchSkills()` và bản copy đã lệch**: eval.js dùng substring (`includes`), production dùng word-boundary (`\b`). File tự ghi *"Must match hooks/skill-activator.js exactly"* — **không hề**. Họ đang để AI tune keyword **chống lại một scorer không phải thứ đang chạy**.

### §3.6. Kết luận về superpowers
*Thiết kế* tốt, *thực thi* thủ công y hệt ta. Mọi invariant duy trì bằng kỷ luật thay vì bằng check — và **ít nhất 2 cái đã lệch rồi**. Họ chỉ hơn ta ở chỗ **đã viết ra các bài test**, dù không chạy.

**→ Định hình chiến lược: đừng đuổi theo quy mô của họ. Làm cái họ định làm mà làm không xong** — đó chính là điều P2 (test + CI thật) đã đạt.

---

## §4. Chiến lược

> **Nguyên tắc xuyên suốt: co lại trước khi mở rộng.**

### §4.1. ✅ P0 — Diệt drift bằng cách XOÁ, không phải codegen *(đã xong)*
Một implementation (Node `.js` thuần, 0 build, 0 dependency), mọi platform gọi qua shim ≤10 dòng. Xoá `.ps1`/`.py`/lib `.ts` trùng, gộp 3 `hooks.fragment*.json` → 1. Bug drift tự biến mất vì chỉ còn một regex.

### §4.2. ✅ P1 — Rules as data *(R3, xong 2026-07-19)*
Đã trích map DOC→phase và keyword heuristic ra **[hooks/lib/rules.json](../minipower/hooks/lib/rules.json)**:

```json
{
  "phase_by_doc": { "DOC-01": "discovery", "DOC-13": "requirements", "...": "..." },
  "edit_verbs":    ["sửa","cập nhật","viết","thêm","sync","đồng bộ","update","edit","write"],
  "breadth_words": ["toàn bộ","all modules","sync everything","review all"]
}
```

- ✅ Cả hook (`auto-routing.js` + `token-guard.js` qua `lib/rules.js`) lẫn `agents/auto-routing.md` (qua `npm run gen`) sinh ra từ đây → thêm DOC-19 = **một dòng JSON**. CI `gen --check` + test `rules.test.js` chặn lệch.
- ✅ **Chuẩn hoá tiếng Việt trước khi match** (bỏ dấu cả prompt lẫn keyword) — keyword lưu có dấu (đọc được), strip khi match.
- ✅ Theo **cơ chế** của superpowers `skill-rules.json`, **không** tách `eval.js` (§3.5): test `import` chính hàm production, không copy logic.

### §4.3. ✅ P2 — Test tối thiểu + CI *(đã xong)*
~181 golden case + GitHub Action matrix 3 OS chạy `node --test`. `auto-routing` là hàm thuần → test chạy < 1 giây, không tốn tiền, không cần LLM.

> **Đây là thứ duy nhất superpowers thiếu, khiến toàn bộ 7.735 dòng test của họ vô giá trị (§3.4). Một action nhỏ đặt Minipower trên họ ngay lập tức.**

### §4.4. ✅ P3 — Chi phí tương xứng (3 tầng) *(đã xong, Option C)*

| Tầng | Ví dụ | Gate |
|---|---|---|
| **Micro** | Sửa typo, thêm 1 dòng bảng | Không gate, không cần khai Phase |
| **Light** | Thêm FR vào DOC-06 đã có | Token-guard scope; bỏ deliberation |
| **Full** | Module mới, đổi kiến trúc, trước baseline | Deliberation → phase → doc-review → verdict |

### §4.5. ✅ P4 — Vá lỗ nội dung *(xong)*
- ✅ Wire token-guard + auto-routing vào `settings.fragment.json` của Claude · doc-sync mô tả hook.
- ✅ Rubric Complexity 5 chiều × 0–20 (§2.3 / R4).
- ✅ Script install + verify thay `/ABSOLUTE/PATH/TO/` (§2.2 / R5).

### §4.6. Việc KHÔNG nên làm *(giữ nguyên — vẫn áp dụng)*

| ❌ | Vì sao |
|---|---|
| Thêm platform thứ tư | Chi phí drift nhân tuyến tính, giá trị thì không |
| Viết README "research-backed" | superpowers trích 3 paper rồi ship skill 435 dòng vi phạm chính paper đó (§1.4). Đừng đánh đổi minimal context lấy marketing |
| Bê `plugin.universal.yaml` về | §3.1–3.2 — SSOT không có CI = thêm một thứ để lệch |

---

## §5. Việc còn phải làm — ✅ hết

Toàn bộ R1–R6 đã xong. Lịch sử để đối chiếu:

| # | Việc | Trạng thái |
|---|------|-----------|
| **R1** | Smoke-test hook IDE thật | ✅ đã smoke-test + cài Cursor, pass các case |
| **R3** | P1 — rules.json (rules-as-data) | ✅ 2026-07-19 — `rules.json` SSOT + generator + `rules.test.js` (194 pass) |
| **R4** | Rubric Complexity 5 chiều × 0–20 | ✅ 2026-07-19 — `complexity-rubric.md`, SKILL trỏ tới |
| **R5** | Script install + verify (Claude) | ✅ 2026-07-19 — `install.mjs` merge an toàn + smoke-test 4 shim |
| **R6** | Merge → `main` | ✅ đã merge |

**Kế tiếp (khi có nhu cầu, không bắt buộc):** merge branch `feature/minipower-rules-as-data` (R3/R4/R5) → `main`.

---

## §6. Quyết định — đã chốt

| # | Câu hỏi | Chốt |
|---|---------|------|
| **Q5** | Tiếng Việt: Việt-only hay song ngữ? | **Việt-only** (§2.4) — chủ pack đọc-hiểu & ứng dụng trực tiếp; ưu tiên team hơn contributor ngoài |
| **Q4** | Rubric Complexity: viết hay bỏ? | **Viết** (= R4) |
