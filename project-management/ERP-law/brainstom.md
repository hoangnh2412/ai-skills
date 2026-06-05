# Brainstorm / Decision log — ERP

Ghi lại **nội dung chính** từ trao đổi: khái niệm, thuật ngữ, giải thích, và **quyết định + lý do** — để đọc lại sau này. Không ghi transcript từng lượt.

## Quy ước ghi

| Ghi | Không ghi |
|-----|-----------|
| Câu hỏi về khái niệm / thuật ngữ + tóm tắt giải thích | Toàn bộ hội thoại word-by-word |
| Quyết định của user + **vì sao** | Thao tác kỹ thuật nhỏ, lệch hướng tạm |
| Insight / đồng thuận quan trọng | Log debug, diff code |

---

## 2026-05-31

### Quyết định

**D1 — Dùng `brainstom.md` làm sổ ghi nhớ dự án**  
- **Quyết định:** Assistant cập nhật file sau các phiên trao đổi.  
- **Lý do:** Giữ ngữ cảnh và lịch sử suy nghĩ khi làm ERP dài hạn.

**D2 — Dạng decision log, không phải transcript**  
- **Quyết định:** Chỉ ghi điểm chính: khái niệm, giải thích, quyết định kèm lý do.  
- **Lý do:** Dễ đọc lại trong tương lai; tránh nhiễu chi tiết hội thoại.

### Khái niệm / giải thích

**Câu hỏi:** Ngoài BABOK còn phương pháp/framework nào cho BA? Điểm mạnh/yếu?

**Tóm tắt (BA senior ERP):**
- **BABOK (IIBA):** “Từ điển nghề” — knowledge areas, techniques; mạnh khi cần chuẩn hóa deliverable/stakeholder; yếu nếu áp máy móc, thiếu discovery/agile sâu.
- **Agile/Lean (Scrum, Kanban, SAFe, DA):** mạnh iteration, backlog, PO; yếu traceability end-to-end, integration ERP phase lớn.
- **Discovery (Design Thinking, Double Diamond, JTBD, Event Storming):** mạnh bài toán mơ hồ, ngôn ngữ nghiệp vụ; yếu nếu không chốt scope/config ERP.
- **Requirements engineering (Volere, IEEE 29148):** mạnh spec/traceability/UAT; yếu nặng tài liệu, chậm nếu overkill sprint ngắn.
- **Process (BPMN, Lean/Six Sigma):** mạnh AS-IS/TO-BE, gap; yếu nếu chỉ vẽ flow mà không map master data / integration.
- **EA (TOGAF, Zachman):** mạnh landscape, integration, governance; yếu chi tiết transaction/UI — BA ERP cần “hạ cánh” xuống module.
- **ERP vendor (SAP Activate, Oracle AIM, Dynamics Success by Design):** mạnh fit-gap, CRP, cutover theo package; yếu nếu coi template = truth, bỏ qua local process.
- **Thực tế ERP:** thường **blend** BABOK + vendor method + discovery + agile/waterfall hybrid theo phase (discover → design → realize → deploy).

**Ghi chú:** Không chọn một framework duy nhất — blend theo phase (xem D3).

**D3 — Chuẩn BA dự án trong `ba-skill.md`**
- **Quyết định:** Pipeline 4 phase: (1) Discovery — Design Thinking / Event Storming / JTBD; (2) Process & scope — BPMN + vendor method; (3) Requirements — BABOK + Volere/IEEE cho critical; (4) Governance — stage gate mặc định, SAFe nếu nhiều stream.
- **Lý do:** Khớp thực tế ERP phức tạp; có exit criteria và deliverable rõ; agent/user cùng playbook khi @ba-skill.md.

**D4 — Domain: ERP cho doanh nghiệp Luật tại Việt Nam**
- **Quyết định:** Phase 1 ưu tiên HRM (12 cap.), CRM (11 cap.), Matter (9 cap.) + shared Product & Document.
- **Lý do:** Đúng mô hình vận hành luật — vụ việc trung tâm, nhân sự & kinh doanh hỗ trợ.

**D5 — Matter-centric + đa pháp nhân**
- **Quyết định:** Module Matter là hub; mỗi pháp nhân tách bạch; nhân sự có home entity nhưng assign chéo pháp nhân theo dự án/vụ việc.
- **Lý do:** User mô tả tổ chức thực tế; payroll/BHXH và ownership hồ sơ gắn pháp nhân.

**D6 — Bảo mật RBAC + ABAC**
- **Quyết định:** RBAC = quyền chức năng (Giám đốc, Kế toán, Chuyên viên); ABAC = quyền dữ liệu theo vụ việc/thuộc tính (chỉ xem sự vụ được gán, field nhạy cảm).
- **Lý do:** Yêu cầu user; bắt buộc với bí mật nghề luật và đa pháp nhân.

**D7 — Chia sẻ vụ việc**
- **Quyết định:** Vụ việc share được cho pháp nhân hoặc nhân sự khác (đánh giá/tư vấn) với loại quyền phân biệt.
- **Lý do:** Hợp tác liên pháp nhân mà vẫn kiểm soát truy cập.

### Khái niệm / giải thích (bổ sung)

| Thuật ngữ | Ý nghĩa trong dự án |
|-----------|---------------------|
| **Pháp nhân** | Legal entity — MST, BHXH, HĐLĐ, sổ riêng |
| **Home entity** | Pháp nhân gốc của nhân sự |
| **Matter / Vụ việc** | Hồ sơ pháp lý trung tâm sau khi mở vụ; khác Pre-matter CRM (đề xuất BA, chờ confirm) |
| **Pre-matter** | Giai đoạn CRM: cơ hội, đánh giá, trước khi Matter chính thức |
| **RBAC** | Role → menu/action |
| **ABAC** | Attribute (matter_id, matter_role, entity, classification) → row/field access |

**Artifact:** `discovery/phase1-law-firm-vn.md` (problem statement, capability map, MoSCoW đề xuất, câu hỏi mở).

**Chờ confirm:** MoSCoW Wave 1/2/3; CRM “Vụ việc” vs Matter; time billing Phase 1; danh sách pháp nhân.

### Artifact (2026-05-31)

**D8 — Thư mục `artifact/` — DOC discovery cơ bản**
- **Quyết định:** Sinh DOC-01, DOC-02, DOC-03 + assumption-risk-log từ `discovery/phase1-law-firm-vn.md` (minipower Phase: discovery).
- **Lý do:** Deliverable review được; chờ sponsor sign-off trước Phase requirements.
- **Path:** `artifact/01-project/`, `artifact/00-governance/`, `artifact/05-traceability/`.
