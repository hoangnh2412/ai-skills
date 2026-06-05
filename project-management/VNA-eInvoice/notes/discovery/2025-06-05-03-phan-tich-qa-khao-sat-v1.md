# Phân tích Q&A khảo sát v1

**Ngày:** 2025-06-05  
**Phase:** Discovery  
**Skill:** Minipower discovery  
**Nguồn:** `assets/internal/`, `assets/public/` (upload user)

---

## Yêu cầu user

Đọc file upload trong `assets/internal/` và `assets/public/`, thực hiện discovery skill, tra cứu tài liệu trên mạng, đánh giá:

1. Bộ câu hỏi đã đủ chưa? Cần bổ sung gì?
2. Câu trả lời khách hàng — cần bổ sung câu hỏi gì?

---

## Tài liệu đã đọc

| File | Mô tả |
|------|--------|
| `assets/internal/eInvoice VNA [Nội Bộ] _ 04062026.txt` | Biên bản họp nội bộ 04/06/2026 |
| `assets/internal/noi-bo_Khảo sát hệ thống - Khảo sát.csv` | Checklist Q&A đầy đủ (có câu TUNGNT, HUNGTH) |
| `assets/public/khach-hang_*Khảo sát.csv` | Checklist đã gửi VNA (rút gọn) |
| `assets/public/khach-hang_*Đầu mối ứng dụng VNA.csv` | Danh sách đầu mối 9 ứng dụng/hệ thống |

---

## Tóm tắt từ biên bản họp nội bộ (04/06/2026)

### Mục tiêu dự án

- **Thay thế** PM hóa đơn hiện tại VNA
- **Đồng bộ** dữ liệu từ **6 chương trình/ứng dụng** về **1 chương trình thống nhất**

### Timeline

- Timeline **3 tháng** triển khai → nội bộ đánh giá **KHÔNG KHẢ THI**
- Đang chờ phản hồi anh Hoàng, anh Hòa

### Kế hoạch khảo sát

- Deadline team đọc & bổ sung câu hỏi Q&A: **12/06/2026**
- Kick-off đầy đủ team **sau** giai đoạn khảo sát
- **Buổi 1:** chị Nga — bức tranh tổng thể, luồng dữ liệu, đầu mối (nghiệp vụ chị Hà, kỹ thuật)
- **Buổi 2–N:** từng ứng dụng — Đức, Giang ghi nhận; Dũng tham gia buổi trọng tâm
- Sau buổi 1: trả lời **có bám timeline 15/06 không** (anh Dũng)

---

## Bức tranh 6 luồng + hệ liên quan

| # | Luồng / ứng dụng | Hệ nguồn | Volume / đặc điểm |
|---|------------------|----------|-------------------|
| 1 | Receipt (vé, MCO, EMD, GC) | Amadeus 1A, PRA/REV, Back office | Realtime; phòng vé nhập tay, API dịch vụ |
| 2 | Cargo Receipt | Cargospot, CRA | ~50 HĐ/ngày; 4 kịch bản (lẻ/HĐ/CK/lao vụ) |
| 3 | Online TMĐT | Web + 1A | T+1→T+5; auto T+6; theo booking |
| 4 | Đại lý / BSP | HOST/GDS → HOT → REV | ~22–23k GD/ngày; HĐ 4 lần/tháng |
| 5 | GAS (thu khác) | GAS (vendor) | ~250 HĐ/tháng; manual |
| 6 | IATA SIS (ITL) | PRA, SISM, CRA → SIS | Advice Day; USD/VND |

**Hệ bổ sung (từ đầu mối):** PM kế toán REV/CRA/GAS, PM hóa đơn hiện tại (CT), nguồn 1A/Cargospot.

**Lưu ý ITL:** Trong ngữ cảnh VNA = **Interline** (IATA SIS). File đầu mối ghi nhầm "Indo Trans Logistics" — **cần sửa**.

---

## Module draft (cho DOC-03)

| Module ID | MOD | Mô tả |
|-----------|-----|-------|
| receipt | RCP | Vé, MCO, EMD, gift card |
| cargo | CRG | Hàng hóa, bưu kiện |
| online | ONL | TMĐT |
| agent | AGT | Đại lý chỉ định, BSP |
| gas | GAS | Thu khác |
| sis | SIS | Interline billing |
| reconcile | REC | Đối soát HĐ ↔ sổ kế toán (**mới**) |
| tax-rpt | TAX | Báo cáo kê khai GTGT |

---

## Stakeholder (từ đầu mối)

| Người | Phạm vi |
|-------|---------|
| Nguyễn T.Hồng Nga | Receipt, Online, ĐL — đầu mối tổng |
| Đỗ Thúy Hồng, Phạm Thu Hằng | Nghiệp vụ HK |
| Hoàng Tuấn Việt, Lê Thu Hằng | Cargo |
| Nguyễn Tuyết Liên, Hồ Xuân Tam | GAS |
| Nguyễn Huyền Linh, Phạm Thu Hà | ITL/SIS |
| Ngô Kim Lan | REV, đối soát kế toán |
| Chị Hà (dự kiến) | Đầu mối nghiệp vụ tổng |

---

## Đánh giá bộ câu hỏi

### Điểm mạnh (~75% nghiệp vụ HK/Online/ĐL)

- Thuế suất hỗn hợp trên 1 HĐ (0% + 8/10%)
- Hoàn/đổi vé, HĐ âm, truy vết vé gốc
- TMĐT: đăng ký 72h, T+5, auto T+6
- ĐL/BSP: HOT→REV, theo kỳ, 1 bảng kê = 1 HĐ
- Mục **Đối soát (36)** và **Báo cáo thuế** — mô tả mong muốn chi tiết

### Thiếu / chưa đủ

| Nhóm | Gap |
|------|-----|
| Kiến trúc & tích hợp | API/format HOT, REV, 1A, Cargospot; push/pull |
| PM HĐ hiện tại (CT) | Vendor, luồng ký CQT, 20 mẫu HĐ |
| REV/GAS kế toán | Mapping TK, đóng sổ PRA |
| Volume & hiệu năng | Peak online, flash sale, SLA tra cứu 2–3s |
| Migration | 10 năm lưu trữ (5 online) |
| Tuân thủ NĐ 70 | TMĐT: chậm nhất ngày 07 tháng sau — đối chiếu T+5/T+6 |
| Báo cáo thuế | 2 mục "CẦN LÀM RÕ" — chưa có mẫu |
| Cargo/GAS/SIS | Nhiều câu chỉ có ở bản internal, chưa trả lời |

### Lỗi checklist

1. Định nghĩa ITL sai trong file đầu mối
2. Câu "Postman collection", "TPS" → khách trả "Không hiểu" — cần diễn đạt lại
3. Bản public thiếu ~40 câu so với internal
4. Thiếu block cross-cutting cho 6 hệ (HUNGTH đã thêm, chưa có trả lời)

---

## Đánh giá câu trả lời khách hàng

### Trả lời tốt

- **Receipt:** loại GD, user, realtime, chống trùng, không backdate
- **Online:** T+1→T+5, hoàn vé truy vết, MST/HC, theo booking
- **ĐL/BSP:** HOT→REV, theo kỳ tuần, chênh lệch hạch toán chi tiết vs HĐ
- **SIS:** Advice Day, Form 1 thủ công, 3 nguồn billing
- **Đối soát (36):** quy trình mong muốn PRA→CTHĐ rõ ràng
- **HĐ hoàn vé:** khớp NĐ 123 Điều 19 (ngành HK — không bắt buộc ghi "điều chỉnh HĐ số...")

### Trả lời trống / mơ hồ (~30+ câu)

**Cargo:** điều chỉnh sau phát hành; auto/manual/batch; tỷ giá USD/EUR; customs date; gom AWB đại lý

**GAS:** trạng thái GD; gom HĐ; MST bổ sung sau; sửa sau chuyển HĐ; đối soát cuối ngày/tháng; hiển thị tên phí

**SIS:** loại billing bắt buộc HĐ; trạng thái eligible; 1 billing = 1 HĐ?; billing đổi sau accept

**Cross-cutting (HUNGTH):** quy tắc chung 6 hệ — toàn bộ trống

**Kỹ thuật:** API spec PRA/CRA/GAS; mẫu payload; TPS peak

### Cần xác nhận pháp lý–nghiệp vụ

1. **T+5/T+6 online** vs **NĐ 70** (TMĐT / vận tải HK): thời điểm lập HĐ = hoàn thành đối soát, chậm nhất **ngày 07 tháng sau** ([NĐ 70/2025](https://thuvienphapluat.vn/van-ban/Thue-Phi-Le-Phi/Nghi-dinh-70-2025-ND-CP-sua-doi-Nghi-dinh-123-2020-ND-CP-hoa-don-chung-tu-577816.aspx))
2. **Validation Receipt:** user xuất sai logic VAT — hệ mới cần rule engine
3. **Timeline 3 tháng** vs scope (6 luồng + đối soát mới + ~10 cấu trúc mẫu HĐ)

---

## Phát hiện scope lớn nhất

**Đối soát HĐ ↔ sổ kế toán** (mục 36, Ngô Kim Lan):

- Chức năng **mới hoàn toàn** — VNA chưa từng có hệ thống đối soát
- Nguồn: PRA (HK), CRA (HH), PRA/CRA/SISM (ITL)
- Gate: chỉ chạy báo cáo kê khai thuế khi **hết chênh lệch**
- Có thể tạo bút toán template upload lại PRA

---

## 10 câu hỏi bổ sung ưu tiên (deadline 12/06 / Buổi 1)

1. Luồng dữ liệu end-to-end: 1A/Cargospot/GAS/SIS → REV → CT → CQT — chỗ nào manual/API?
2. PM HĐ hiện tại (CT): vendor, thay thế hay tích hợp? Demo 2–3 mẫu HĐ khác cấu trúc
3. Danh sách 20 mẫu HĐ + file PDF/XML mẫu; nhóm ~10 cấu trúc
4. Quy tắc chung 6 hệ: 1 GD ↔ 1 HĐ? Gộp/tách? Thời điểm xuất? Điều chỉnh vs thay thế?
5. Volume peak: online (vé/giờ); ngày đóng kỳ ĐL/SIS
6. Đối soát: mẫu báo cáo chênh lệch hiện tại? Điều kiện nhận diện vé lệch?
7. Báo cáo kê khai GTGT: mẫu report hiện tại; quy tắc tách YR/YQ/phí AWB
8. Cargo/GAS — các câu trống (điều chỉnh sau HĐ, tỷ giá, auto vs user)
9. SIS: billing type bắt buộc HĐ; xử lý billing đổi sau Advice Day
10. Migration: import HĐ cũ? Tra cứu 10 năm read-only?

---

## Problem statement (draft)

> VNA vận hành **6 luồng xuất HĐ rời rạc** qua PM riêng và thao tác **manual**, dẫn đến thiếu validation, **không đối soát tự động HĐ–kế toán–kê khai thuế**, khó mở rộng theo NĐ 70. Dự án cần **một nền tảng HĐĐT thống nhất** tích hợp nguồn, rule nghiệp vụ HK, đối soát REV/PRA/CRA, báo cáo thuế — timeline **dài hơn 3 tháng**.

---

## Scope sơ bộ (draft)

**In scope:** 6 luồng; tích hợp nguồn; ký số CQT; ~10 cấu trúc mẫu HĐ; đối soát HĐ↔sổ (mới); báo cáo kê khai GTGT; tra cứu 10 năm (5 online).

**Out of scope (tạm):** ĐL xuất HĐ cho HK cuối; hạch toán tự động SIS; thay REV/GAS/1A.

---

## Rủi ro discovery

| Rủi ro | Mức |
|--------|-----|
| Timeline 3 tháng vs scope | Cao |
| Đối soát kế toán greenfield | Cao |
| Thiếu tài liệu kỹ thuật/API | Cao |
| 20 mẫu HĐ — effort template | Trung bình |
| Trả lời "không hiểu" → delay khảo sát | Trung bình |
| NĐ 70 vs T+5/T+6 | Trung bình |

---

## Kết luận exit criteria discovery

| Tiêu chí | Trạng thái |
|----------|------------|
| Goal + Success Criteria — sponsor xác nhận | ❌ Chưa |
| Stakeholder register + RACI sơ bộ | ⚠️ Draft từ đầu mối |
| Assumption log | ⚠️ Một phần trong note này |
| In/out scope review | ⚠️ Draft |
| Danh sách module | ⚠️ Draft 8 module |

**Exit discovery: CHƯA ĐẠT**

---

## Tham chiếu pháp lý đã tra cứu

- [Nghị định 70/2025/NĐ-CP](https://thuvienphapluat.vn/van-ban/Thue-Phi-Le-Phi/Nghi-dinh-70-2025-ND-CP-sua-doi-Nghi-dinh-123-2020-ND-CP-hoa-don-chung-tu-577816.aspx) — thời điểm lập HĐ TMĐT, vận tải HK
- [NĐ 123/2020 Điều 19 — HĐ hoàn/đổi vé máy bay](https://www.luatvietnam.net/vn/-vbpl119674.html)
- [IATA SIS / Advice Day](https://www.iata.org/en/services/finance/clearinghouse/faqs/) — SIS feed ICH, Advice Day → Call Day +7 ngày

---

## Việc tiếp theo (đã thống nhất trong trao đổi)

User **chưa** yêu cầu sinh DOC-01–03 hoặc checklist v2 — để follow-up.

- Gộp checklist master
- Tạo folder `notes/` *(đã thực hiện ở note 04)*
- Buổi 1 chị Nga

---

*Nguồn: trao đổi session 2025-06-05 — phân tích discovery Q&A v1*
