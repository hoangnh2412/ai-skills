---
name: minipower-presales-estimation-ulnl
description: Ước lượng ULNL — điền số đếm được, máy chọn mã và cộng MH. Dùng khi báo giá trước ký, catalog chức năng, man-hour, estimate-v1 — không khảo sát lại, không nhân đơn giá.
metadata:
  audience: hoangnh
  workflow: github
---

# minipower-presales-estimation-ulnl

Input tối thiểu = **H0**: in/out scope + cây chức năng mức thao tác + assumption log. Elicit thiếu → đọc [discovery](../../../sdlc/skills/discovery/SKILL.md), **không** soạn khảo sát trong pack này.

## LLM làm gì

Chỉ điền `kind`, `fields`/`columns`/`steps`/`refs`/`has_formula` **kèm trích nguồn**. Đếm không ra → `unclear: true`. Không chọn mã, không cộng MH.

## Máy

`classify()` · `lineMH()` · `sumMH()` trong `lib/`. Catalog `catalog/ulnl-default.json`. Xuất `estimate-v1.0.json` (schema `presales/schema/`).

Người duyệt Σ MH trước khi sang quotation.
