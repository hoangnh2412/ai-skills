# Phương pháp đánh giá chất lượng Minipower — khung 4 tầng + eval hành vi cho 3 gate

| | |
|---|---|
| **Ngày** | 2026-08-27 |
| **Trạng thái** | đề xuất, chờ Confirm §6 |
| **Phạm vi** | Định nghĩa *phương pháp luận đánh giá chất lượng* của toàn bộ minipower (sdlc · backend · ops · hooks · contracts) — cái gì đo, đo bằng gì, nhịp nào. Đợt triển khai đầu chỉ đụng `sdlc/evals/` (mới) + `sdlc/hooks/` (advisory check mới, nếu duyệt) |
| **Ngoài phạm vi** | Đánh giá *một lần* hiện trạng (đã có tiền lệ ADR-001); xây hạ tầng eval ngoài repo (dashboard, DB metric — trái ADR-022 QĐ-12); eval cho dự án đích cụ thể |
| **Nối tiếp** | [ADR-001](ADR-001-2026-07-17-danh-gia-minipower-va-chien-luoc-phat-trien.md) (tiền lệ đánh giá + bài học §3.5) · [ADR-020](ADR-020-2026-08-20-minipower-3-che-do-du-an-gate-bang-hook.md) (QĐ-11 gate mềm, "cứng bằng máy mềm bằng lời") · [ADR-022](ADR-022-2026-08-24-minipower-nen-tang-cong-cu-ai-toan-cong-ty.md) (QĐ-1 model là engine thay được) |
| **Mục đích** | Biến "minipower có tốt không?" từ câu hỏi cảm tính / đánh giá one-off thành quy trình đo lặp lại được, đúng triết lý repo |
| **Ảnh hưởng** | `sdlc/evals/` (mới — kịch bản golden + rubric) · `sdlc/hooks/` (nếu duyệt QĐ-2b: check advisory độ dài SKILL / chữ "bắt buộc") · `ADRs/` (khuôn ADR đánh giá định kỳ) |

---

## §1. Bối cảnh

Hiện trạng năng lực kiểm định của repo (đối chiếu 2026-08-27):

- **Đã mạnh ở tầng máy:** 23 test file trong `sdlc/hooks/test/`, 432 test; 4 gate CI (`gen:check` · `trace:check` · `link:check` · install-parity); cả 7 điều kiện cứng đều có test canh.
- **Đã có tiền lệ đánh giá:** ADR-001 là một lần đánh giá toàn diện (so với superpowers-optimized) — nhưng là **one-off**, không có khung lặp lại; và chủ yếu đánh giá *cấu trúc*, không đánh giá *hành vi agent khi chạy skill*.
- **Chưa có gì đo tầng giá trị lõi:** toàn bộ giá trị của minipower tập trung ở 3 gate (deliberation · readiness-gate · doc-review) và kỷ luật quy trình — nhưng chưa có bất kỳ cơ chế nào kiểm *agent thật có làm đúng như skill dạy không* (có hỏi trọn gói một lượt không, có nhảy giải pháp sớm không, verdict có ra trước artifact không).
- **Bài học định hình (ADR-001 §3.5):** superpowers chết vì eval script **re-implement** logic production rồi hai bản lệch nhau — họ tune keyword chống lại một scorer không phải thứ đang chạy. Repo này đã né đúng bẫy đó ở tầng hook (test `import` hàm production); phương pháp đánh giá mới phải giữ nguyên luật ấy ở mọi tầng.
- **Công cụ sẵn có:** Claude Code có `claude plugin eval` (eval suite cho plugin, chạy sandbox, có report JSON, chạy được CI) — repo đã là plugin (`minipower-sdlc`, ADR-011 🟢).

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | Không có định nghĩa "chất lượng minipower" đo được — mỗi lần hỏi lại đánh giá cảm tính từ đầu | Không biết một thay đổi (sửa SKILL, đổi rules.json, đổi model) làm pack tốt lên hay tệ đi |
| P2 | Giá trị lõi (3 gate, kỷ luật quy trình) hoàn toàn không được đo — chỉ tầng hook có test | Sửa SKILL.md của gate là "bay mù": regression ngữ nghĩa không ai phát hiện cho đến khi dự án đích trả giá |
| P3 | Định vị "model là engine thay được" (ADR-022 QĐ-1) chưa có bằng chứng | Đổi model = rủi ro không định lượng được; tuyên bố model-agnostic chỉ là lời nói |
| P4 | Không có tín hiệu ngược từ dự án đích (gate có bắt được lỗi thật không, nợ doc có được trả không) | Quy trình có thể "đẹp trên giấy" mà không ai biết |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | **"Cứng bằng máy, mềm bằng lời"** (ADR-020) áp cho chính việc đánh giá: chỉ máy-chấm cái máy kiểm được không cần phán đoán; tiêu chí ngữ nghĩa → rubric cho người/LLM-judge, kết quả là **advisory**, không thành điều kiện chặn CI |
| C2 | Gate mềm (ADR-020 QĐ-11) không mở lại — eval đo *chất lượng* gate, không biến kết quả eval thành gate cứng mới |
| C3 | **Eval phải chạy chính artifact production** (bài học ADR-001 §3.5): import hàm thật, load skill thật, chạy plugin thật — cấm mọi scorer re-implement logic |
| C4 | Không xây hạ tầng ngoài repo (ADR-022 QĐ-12): metric tầng outcome sinh từ artifact có sẵn của dự án đích (`trace:check`, `doc-debt.md`, DEC), không dựng dashboard/DB |
| C5 | Chi phí tương xứng (phân tầng micro/light/full): eval hành vi tốn LLM call — không chạy mỗi commit |

## §4. Phương án

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | Đánh giá định kỳ thủ công (lặp lại kiểu ADR-001 mỗi quý) | Không tốn hạ tầng | Cảm tính, không so sánh được giữa hai lần, không bắt regression theo commit | ❌ |
| O2 | Máy-hoá tối đa: đưa mọi tiêu chí vào CI chặn | Khách quan bề ngoài | Trái C1 — ép tiêu chí ngữ nghĩa thành số là giả khách quan; lặp lại sai lầm "gate cứng trên verdict" mà QĐ-11 đã bỏ | ❌ |
| O3 | **Khung 4 tầng**: tầng nào máy kiểm được thì CI, tầng ngữ nghĩa thì golden scenario + rubric (advisory), tầng outcome thì đo từ artifact dự án đích, tổng hợp theo nhịp thành ADR đánh giá | Đúng triết lý repo, mỗi loại chất lượng có thước đo đúng bản chất | Nhiều mảnh, cần kỷ luật nhịp; tầng 3 tốn LLM call | ✅ chọn |

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| QĐ-1 | **Khung 4 tầng** là định nghĩa chính thức của "chất lượng minipower" | **T1 Kỹ thuật** (máy, mỗi commit) · **T2 Nội dung skill** (lint tĩnh + rubric) · **T3 Hành vi agent** (golden scenario, theo thay đổi Full + đổi model) · **T4 Outcome dự án đích** (từ artifact, theo mốc). Chi tiết từng tầng: QĐ-2…QĐ-5 |
| QĐ-2 | **Tầng 1 — duy trì, không mở rộng**: mọi điều kiện cứng mới phải kèm test trong cùng commit (đã là thực hành, nay thành luật) | Metric: CI xanh + tỉ lệ điều kiện cứng có test canh = 100%. **QĐ-2b (tuỳ chọn, Q3):** thêm 2 check *advisory* vào `npm run gen:check` hoặc script riêng: (a) SKILL.md > 150 dòng → WARN (giữ lợi thế kỷ luật token, ADR-001 §1.4); (b) chữ "bắt buộc" trong markdown không kèm tham chiếu check máy → WARN (phép thử QĐ-3 ADR-020 tự động hoá một nửa) |
| QĐ-3 | **Tầng 3 — bộ kịch bản golden cho 3 gate**, đặt tại `sdlc/evals/` | Mỗi kịch bản = 3 phần: **(1) fixture** — skeleton dự án giả lập + `profile.json` (đủ 3 mode) + prompt đầu vào; **(2) hành vi kỳ vọng** — checklist quan sát được trên transcript, viết dạng CÓ/KHÔNG (vd readiness-gate: "liệt kê ≥ N thiếu sót đã gài trong MỘT lượt trả lời", "không sinh artifact trước verdict", "thiếu sót được hoãn có ghi vào `doc-debt.md`"); **(3) bẫy** — mỗi kịch bản gài lỗi biết trước để đo recall. Đợt đầu: **readiness-gate làm mẫu** (~6–8 kịch bản × 3 mode), sau đó nhân ra deliberation + doc-review. Chấm: LLM-as-judge theo checklist + **người soát xác suất ~20%**; điểm là advisory (C1, C2) |
| QĐ-4 | **Nhịp chạy tầng 3 theo phân tầng chi phí + theo model** | Chạy khi: (a) thay đổi **Full** đụng SKILL.md của gate / router / `rules.json` routing; (b) **đổi model engine** — chạy toàn bộ suite, kết quả là bằng chứng cho tuyên bố model-agnostic (P3); (c) trước khi tag release plugin. KHÔNG chạy cho micro/light (C5). Harness: ưu tiên `claude plugin eval` (đã có sandbox + report + CI); nếu thực nghiệm cho thấy không khớp (Q2) thì rơi về harness `node --test` tự viết gọi `claude -p` — nhưng luôn chạy plugin thật (C3) |
| QĐ-5 | **Tầng 4 — 4 metric outcome, sinh từ artifact dự án đích, không hạ tầng mới** (C4) | (1) **Trace coverage**: % FR có AC, % chuỗi UC→FR→AC→Test nối thông — nâng `trace:check` từ pass/fail thành in số liệu (thêm `--stats`, không đổi hành vi exit code); (2) **Gate precision**: tỉ lệ finding doc-review được người review chấp nhận / tỉ lệ verdict RESHAPE·STOP thật sự đổi hướng (đếm tay từ DEC — nếu 100% PROCEED thì gate đang là hình thức); (3) **Tuổi nợ doc**: tuổi trung bình mục mở trong `doc-debt.md` / `open-questions.md`; (4) **Rework sau baseline**: số CR mở vì thiếu sót lẽ ra gate phải bắt. Tổng hợp khi dự án đích qua mốc baseline hoặc theo quý |
| QĐ-6 | **Kết quả đánh giá định kỳ ghi thành ADR** — biến tiền lệ ADR-001 từ one-off thành nhịp | Mỗi kỳ (quý, hoặc sau mốc baseline đầu tiên của một dự án đích dùng minipower): một ADR ngắn ghi số liệu 4 tầng + kết luận + việc rút ra. So sánh được giữa hai kỳ vì cùng khung QĐ-1 |

## §6. Confirm

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt khung 4 tầng + 6 QĐ? | |
| Q2 | Harness tầng 3: thực nghiệm `claude plugin eval` trước (khuyến nghị — đỡ tự dựng), hay đi thẳng harness `node --test` + `claude -p` tự viết? | |
| Q3 | Có làm QĐ-2b (2 check advisory: WARN SKILL > 150 dòng · WARN "bắt buộc" không kèm check máy) trong đợt này không, hay để đợt sau? | |
| Q4 | Đợt đầu tầng 3 chỉ làm readiness-gate làm mẫu (khuyến nghị), hay làm cả 3 gate luôn? | |

Chốt xong: ghi ngày vào **Trạng thái** + cập nhật ghi chú index.

## §7. Việc triển khai

| Bước | Việc | Done khi | Phụ thuộc |
|---|---|---|---|
| 1 | Vòng thực nghiệm harness: chạy thử `claude plugin eval` với 1 kịch bản readiness-gate tối giản trên plugin thật | Biết được: có load được fixture skeleton không · report đọc được không · chi phí/lần chạy | Q1, Q2 |
| 2 | Viết khuôn kịch bản (`sdlc/evals/README.md` + schema thư mục: `evals/readiness-gate/{fixture,expected}.md`) | Khuôn đủ để người khác viết kịch bản mới không cần hỏi | Bước 1 |
| 3 | Viết 6–8 kịch bản readiness-gate × 3 mode, mỗi kịch bản có bẫy gài sẵn | Suite chạy hết, có điểm baseline đầu tiên ghi lại | Bước 2, Q4 |
| 4 | `trace:check --stats` — in trace coverage, không đổi exit code | Chạy trên `docs-skeleton` + 1 fixture có ID thật ra số đúng | Q1 |
| 5 | (nếu Q3 duyệt) 2 check advisory QĐ-2b + test canh | WARN đúng case gài, 0 false-positive trên repo hiện tại; vòng `gen → test → gen:check` xanh | Q3 |
| 6 | Nhân kịch bản ra deliberation + doc-review | Mỗi gate ≥ 5 kịch bản, suite có điểm baseline | Bước 3 |
| 7 | Khuôn "ADR đánh giá định kỳ" (mục cố định: số liệu 4 tầng + so kỳ trước) — thêm ghi chú vào TEMPLATE.md hoặc file khuôn riêng trong `evals/` | Kỳ đánh giá đầu tiên viết được ADR chỉ bằng điền số | Bước 3, 4 |

## §8. Xác minh (định nghĩa xong)

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | Chạy suite readiness-gate (bước 3) trên plugin thật, model hiện hành | Có report điểm; kịch bản gài bẫy bị bắt ≥ 80%; người soát 20% đồng ý với judge | 🔴 |
| T2 | Smoke | `trace:check --stats` trên fixture có ID | Số coverage đúng với đếm tay; exit code không đổi so với trước | 🔴 |
| T3 | Regression | `npm test` + `gen:check` + `link:check` 0 gãy mới | xanh | 🟡 |
| T4 | Mới | (nếu Q3) test canh 2 check advisory: case WARN đúng + repo hiện tại 0 false-positive | xanh | 🔴 |
| T5 | Smoke | Kịch bản "scorer lệch" cố ý: xác nhận eval gọi plugin/hàm production, không có bản copy logic nào trong `evals/` (grep không thấy re-implement routing/gate) | 0 hit | 🔴 |

Icon: 🟢 xong · 🟡 có sẵn, cần giữ xanh · 🔴 chưa có. **Không 🟢 Done khi còn T đỏ.**

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| Tốt | "Chất lượng minipower" có định nghĩa đo được, so được giữa hai kỳ; sửa SKILL của gate hết "bay mù" (P2); đổi model có bằng chứng thay vì niềm tin (P3); giữ được lợi thế kỷ luật token bằng số thay vì bằng trí nhớ |
| Xấu / chi phí | Tầng 3 tốn LLM call mỗi lần chạy (giới hạn bằng nhịp QĐ-4); viết + bảo trì kịch bản golden là công việc thật — kịch bản lỗi thời khi SKILL đổi lớn; LLM-judge có nhiễu, phải giữ kỷ luật người-soát-20% |
| Trung lập | `sdlc/evals/` là loại artifact mới trong repo (không phải skill, không phải hook) — cần một dòng trong AGENTS.md §thư mục khi đợt đầu xong; điểm eval là advisory nên giá trị phụ thuộc người có đọc nó không — đúng tinh thần gate mềm |
