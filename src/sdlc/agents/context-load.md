# Context-load — nạp chuỗi ngữ cảnh trước khi đề xuất

Markdown thuần — sau khi [readiness-gate](../skills/readiness-gate/SKILL.md) xác nhận tiền đề **đủ**, agent **tự nạp chuỗi ngữ cảnh dự án** rồi mới đề xuất giải pháp (N4, ADR 2026-07-20 §3.4). Đây là lợi thế "context-aware" mà bộ skill coding-centric không có. **Thứ tự nạp là dữ liệu**, SSOT ở [hooks/lib/rules.json](../hooks/lib/rules.json) (`context_chain`).

## Chuỗi ngữ cảnh

<!-- BEGIN generated: context-chain (nguồn: hooks/lib/rules.json — chạy `npm run gen`) -->

| # | Nguồn ngữ cảnh | Vị trí |
|---|----------------|--------|
| 1 | BRD | DOC-03 (BRD) |
| 2 | SRS | DOC-06 (SRS) |
| 3 | Architecture (SAD) | DOC-08 (SAD) |
| 4 | Data model | DOC-11 (Data Model) |
| 5 | API spec | DOC-12 (API Spec) |
| 6 | Coding convention | `docs/00-governance/` |
| 7 | Decision log | `memory/{phase}/decision-log.md` |
| 8 | Open questions / issues | `memory/{phase}/open-questions.md` |
| 9 | Current sprint | DOC-15 (Project Plan) |

<!-- END generated: context-chain -->

## Agent — quy tắc

1. **Chỉ nạp khi cần** — theo intent + token-guard: nạp **một slice** liên quan module/DOC đang làm, **không** đọc cả kho (xem [token-guard.md](token-guard.md)).
2. **Theo thứ tự** — ngữ cảnh nền (BRD, SRS) trước, chi tiết (data/API) sau, rồi Decision Log + Open Questions để không quyết lại điều đã chốt.
3. **Thiếu nguồn trong chuỗi** → đó là tiền đề thiếu → quay lại [readiness-gate](../skills/readiness-gate/SKILL.md) (ghi nợ hoặc xin bổ sung), **không** tự suy diễn.
4. **Decision Log** ([schema](../docs/decision-log.md)) — đọc `memory/{phase}/decision-log.md`: gặp DEC liên quan thì kế thừa/supersede, không quyết lại từ đầu.

**Không** nạp `docs/02-baseline/` hay `_legacy` trừ khi migrate (token-guard chặn).
