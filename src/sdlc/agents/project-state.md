# Project State — giai đoạn dự án → phase → vai trò

Markdown thuần — giúp agent **biết dự án đang ở giai đoạn nào** để chọn đúng bộ skill + lăng kính vai trò (N2, ADR 2026-07-20 §3.2). **Bảng map là dữ liệu**, SSOT ở [hooks/lib/rules.json](../hooks/lib/rules.json) (`phase_meta`). Bảng dưới **sinh tự động** (`npm run gen`).

## Bảng giai đoạn dự án

<!-- BEGIN generated: project-state (nguồn: hooks/lib/rules.json — chạy `npm run gen`) -->

| Giai đoạn dự án | Phase minipower | Vai trò chính |
|-----------------|-----------------|----------------|
| Requirement | `discovery` | BA |
| Analysis | `requirements` | BA |
| Design | `architecture` | SA |
| Planning | `planning` | PM |
| Development → Testing → Deployment | `delivery` | DEV / QC / DevOps |
| Maintenance | `change-control` | Support |

<!-- END generated: project-state -->

Vòng đời chuẩn: `Requirement → Analysis → Design → Development → Testing → Deployment → Maintenance`. Nhiều giai đoạn (Development/Testing/Deployment) gộp vào phase `delivery` — phân biệt bằng intent (viết code / kiểm thử / triển khai).

## Agent — dùng thế nào

1. Suy ra phase (qua [auto-routing](auto-routing.md): DOC→phase, hoặc `Phase:` khai sẵn).
2. Tra bảng trên → biết **giai đoạn dự án** + **vai trò chính** → nạp [role tương ứng](../roles/README.md) làm lăng kính hỗ trợ (**không** tự thực hiện thay người — xem ADR §0).
3. Trước khi thực thi → qua [readiness-gate](../skills/readiness-gate/SKILL.md): tiền đề của giai đoạn đủ chưa.
4. Hook auto-routing nhét sẵn gợi ý *state + role* vào context khi enrich (một phase rõ).

**Lưu ý:** vai trò chỉ là **góc nhìn hỗ trợ con người ra quyết định** — không có "agent tự bàn giao cho agent". Con người điều phối giữa các vai trò.
