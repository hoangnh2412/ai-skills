---
name: minipower-presales-quotation
description: Quy đổi MH sang MD, buffer rủi ro, ROM, thành tiền từ rate local. Dùng khi tờ giá, quotation, buffer ROM — không gán mã loại, không commit đơn giá.
metadata:
  workflow: github
---

# minipower-presales-quotation

Đọc `estimate-v1.0.json` do estimation sinh. `toMD` / `risk` / `rom` / `price` / `validate` trong `lib/` — LLM không nhân tiền.

`quotation-rates.json` gitignore. Người duyệt rồi mới gửi khách (L3 kênh chat/docs).
