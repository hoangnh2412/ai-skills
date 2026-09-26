# Roles — lăng kính hỗ trợ con người

Mỗi vai trò là **một góc nhìn để AI hỗ trợ đúng người đó ra quyết định** — **không** phải agent tự chạy hay tự bàn giao (ADR 2026-07-20 §0, §3.3). Con người giữ vai trò, AI soi theo lăng kính đó: nhắc mục tiêu, deliverable, checklist và **câu hỏi cần hỏi**.

Mỗi file gồm: **Goal · Deliverables · Checklist · Câu hỏi cần hỏi**. Ngắn, tool-agnostic.

## Chỉ mục vai trò

**Dữ liệu** ở [hooks/lib/rules.json](../hooks/lib/rules.json) (`roles`). Bảng dưới **sinh tự động** (`npm run gen`).

<!-- BEGIN generated: roles-index (nguồn: hooks/lib/rules.json — chạy `npm run gen`) -->

| Vai trò | Chức danh | Phase liên quan | File |
|---------|-----------|-----------------|------|
| **BA** | Business Analyst | discovery, requirements | [BA.md](BA.md) |
| **PM** | Project Manager | planning | [PM.md](PM.md) |
| **SA** | Solution Architect | architecture | [SA.md](SA.md) |
| **DEV** | Developer | delivery | [DEV.md](DEV.md) |
| **QC** | Quality Control | delivery | [QC.md](QC.md) |
| **DevOps** | DevOps | delivery | [DevOps.md](DevOps.md) |
| **Support** | Support / Maintenance | change-control | [Support.md](Support.md) |

<!-- END generated: roles-index -->

## Kết nối

- Chọn vai trò theo **giai đoạn dự án**: [agents/project-state.md](../agents/project-state.md) (phase → vai trò chính).
- Trước khi thực thi: [readiness-gate](../skills/readiness-gate/SKILL.md). Trước khi đề xuất: [context-load](../agents/context-load.md).
- Vai trò **không** thay con người quyết — chỉ hỗ trợ. Quyết định lớn → ghi [decision-log](../docs/decision-log.md).
