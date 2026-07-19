# ĐỀ XUẤT GIẢI PHÁP KỸ THUẬT

| | |
| --- | --- |
| **Tên hệ thống / sản phẩm** | `{TÊN HỆ THỐNG}` |
| **Khách hàng** | `{TÊN KHÁCH HÀNG}` |
| **Nhà thầu / đơn vị đề xuất** | `{TÊN ĐƠN VỊ}` |
| **Địa điểm — tháng/năm** | `{ĐỊA ĐIỂM} {MM/YYYY}` |
| **Phiên bản tài liệu** | `v0.1` |

> **Cách dùng khung này**
>
> 1. Copy file → điền meta trang bìa → lần lượt Phần I → II → III.
> 2. Phần II.2: mỗi dòng chức năng nguyên tử = 1 hàng (STT dạng `1`, `1.1`, `1.1.1`).
> 3. Phần III phải **đáp ứng** Phần II (không nêu giải pháp chưa có yêu cầu tương ứng).
> 4. Mỗi mục có note **Nguồn** — lấy nội dung từ tài liệu / DOC tương ứng (xem bảng ánh xạ bên dưới); ưu tiên distill từ Minipower đã chốt, không tự bịa.
> 5. Placeholder `{…}` = bắt buộc thay; `[…]` = gợi ý / tùy chọn.

---

## Ánh xạ nguồn nội dung (tài liệu → mục khung)

> Dùng khi soạn / review: cột **Nguồn chính** = artifact nên đọc trước; **Bổ sung** = tùy chọn nếu có.

| Mục khung | Nguồn chính (Minipower / nội bộ) | Nguồn bổ sung (KH / thương mại) |
| --- | --- | --- |
| Meta trang bìa, ký duyệt | `README` dự án · contract / proposal cover | Công văn / RFP trang bìa KH |
| Định nghĩa / viết tắt | Glossary chung dự án · DOC-08 phụ lục | Thuật ngữ trong TOR / RFP |
| **I.1** Hiện trạng | **DOC-01** (business case / problem) · biên bản khảo sát | TOR mô tả hiện trạng · SOP / quy trình KH hiện có |
| **I.2** Mục tiêu | **DOC-01** goal + success criteria · **DOC-03** (hướng scope) | Mục tiêu trong RFP / chỉ đạo nội bộ KH |
| **II.1** Yêu cầu chung, phạm vi | **DOC-03** in/out scope · **DOC-08** nguyên tắc kiến trúc (sơ bộ) | RFP mục “yêu cầu chung” · assumption log Discovery |
| **II.2** Yêu cầu nghiệp vụ chi tiết | **DOC-05** UC · **DOC-06** FR · **DOC-04** BR · **DOC-07** AC | Danh sách chức năng KH · prototype đã chốt |
| **II.3** Hạ tầng & sẵn sàng | **DOC-13** NFR (HA, perf, capacity) | Spec DC / cloud KH · SLA vận hành |
| **II.4** Kết nối, tích hợp | **DOC-10** Integration | Interface list KH · tài liệu API đối tác |
| **II.5** Hỗ trợ kỹ thuật | **DOC-13** (support SLA) · **DOC-17** (ops sơ bộ) | Điều khoản bảo hành / AMC trong RFP |
| **II.6** ANTT (yêu cầu) | **DOC-13** Security NFR | Chính sách ATTT KH · checklist tuân thủ |
| **II.7** Giao diện | **DOC-06**/UC UI · brand guideline | Design system / CI KH · mẫu màn hình |
| **II.8** Lưu trữ dữ liệu | **DOC-13** retention · **DOC-11** Data Model (policy) | Quy định lưu trữ / pháp lý ngành |
| **III.1** Đáp ứng nghiệp vụ (phạm vi, sơ đồ CN, luồng, mockup) | **DOC-03** · **DOC-05/06** · mockup/UI pack · II.2 đã viết | Sơ đồ chức năng KH đã duyệt |
| **III.2.1** Kiến trúc hệ thống | **DOC-08 SAD** · **DOC-09 ADR** | Sơ đồ kiến trúc đã trình KH |
| **III.2.2** Giải pháp ứng dụng | **DOC-08** · **DOC-11** · **DOC-12** OpenAPI · ADR stack | Chuẩn công nghệ nội bộ nhà thầu |
| **III.2.3** Hạ tầng CNTT | **DOC-08** deployment view · sizing từ **DOC-13** | Bảng máy chủ / BOM KH yêu cầu |
| **III.3** Kế hoạch triển khai | **DOC-15** roadmap · **DOC-14** WBS · **DOC-17** cutover | Lịch milestone trong hợp đồng / proposal |
| **III.4** ANTT (giải pháp) | **DOC-08** security view · đáp ứng **II.6** / **DOC-13** | Báo cáo pentest plan · policy KH |
| **III.5** Đảm bảo hoạt động | **DOC-17** · đáp ứng **II.5** | SLA AMC / hỗ trợ trong HĐ |
| **III.6 / III.7** Phạm vi NT vs KH | **DOC-03** RACI · assumption · điều khoản HĐ | Phụ lục trách nhiệm trong RFP |
| Ước lượng / giá *(nếu đính kèm)* | [ULNL.md](ULNL.md) · [T-SHIRT.md](T-SHIRT.md) | Bảng giá / BoQ thương mại |

**Luồng distill khuyến nghị**

```text
Discovery (DOC-01…03, khảo sát, RFP)
    → Requirements (DOC-04…07, 13)  →  điền Phần I–II
    → Architecture (DOC-08…12)      →  điền Phần III.1–III.2
    → Planning/Delivery (DOC-14…17) →  điền Phần III.3–III.5
    → RACI / HĐ                     →  điền Phần III.6–III.7
```

---

## BẢNG GHI NHẬN THAY ĐỔI TÀI LIỆU

*T: thêm mới; S: sửa đổi; X: Xoá*

| Ngày thay đổi | Mục, bảng thay đổi | T/S/X | Mô tả thay đổi | Phiên bản mới |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |

---

## TRANG KÝ — PHÊ DUYỆT TÀI LIỆU

| Vai trò | Họ tên | Chữ ký | Ngày |
| --- | --- | --- | --- |
| Người lập | | | |
| Người kiểm tra | | | |
| Người phê duyệt | | | |

---

## MỤC LỤC

- [Ánh xạ nguồn nội dung (tài liệu → mục khung)](#ánh-xạ-nguồn-nội-dung-tài-liệu--mục-khung)
- [PHẦN I. HIỆN TRẠNG VÀ NHU CẦU](#phần-i-hiện-trạng-và-nhu-cầu)
  - [I.1. Hiện trạng](#i1-hiện-trạng)
  - [I.2. Mục tiêu](#i2-mục-tiêu)
- [PHẦN II. YÊU CẦU VỀ NGHIỆP VỤ](#phần-ii-yêu-cầu-về-nghiệp-vụ)
  - [II.1. Yêu cầu chung, phạm vi triển khai](#ii1-yêu-cầu-chung-phạm-vi-triển-khai)
  - [II.2. Yêu cầu nghiệp vụ chi tiết](#ii2-yêu-cầu-nghiệp-vụ-chi-tiết)
  - [II.3. Yêu cầu về hạ tầng và tính sẵn sàng](#ii3-yêu-cầu-về-hạ-tầng-và-tính-sẵn-sàng)
  - [II.4. Yêu cầu về kết nối, tích hợp](#ii4-yêu-cầu-về-kết-nối-tích-hợp)
  - [II.5. Yêu cầu đảm bảo hoạt động và hỗ trợ kỹ thuật](#ii5-yêu-cầu-đảm-bảo-hoạt-động-và-hỗ-trợ-kỹ-thuật)
  - [II.6. Yêu cầu đảm bảo an ninh thông tin](#ii6-yêu-cầu-đảm-bảo-an-ninh-thông-tin)
  - [II.7. Yêu cầu giao diện](#ii7-yêu-cầu-giao-diện)
  - [II.8. Yêu cầu lưu trữ dữ liệu](#ii8-yêu-cầu-lưu-trữ-dữ-liệu)
- [PHẦN III. GIẢI PHÁP KỸ THUẬT ĐỀ XUẤT](#phần-iii-giải-pháp-kỹ-thuật-đề-xuất)
  - [III.1. Xây dựng phần mềm đáp ứng các yêu cầu nghiệp vụ](#iii1-xây-dựng-phần-mềm-đáp-ứng-các-yêu-cầu-nghiệp-vụ)
  - [III.2. Giải pháp về xây dựng phần mềm](#iii2-giải-pháp-về-xây-dựng-phần-mềm)
  - [III.3. Kế hoạch triển khai](#iii3-kế-hoạch-triển-khai)
  - [III.4. An ninh thông tin (ANTT)](#iii4-an-ninh-thông-tin-antt)
  - [III.5. Đảm bảo hoạt động](#iii5-đảm-bảo-hoạt-động)
  - [III.6. Phạm vi do Nhà thầu thực hiện](#iii6-phạm-vi-do-nhà-thầu-thực-hiện)
  - [III.7. Phạm vi do Khách hàng thực hiện](#iii7-phạm-vi-do-khách-hàng-thực-hiện)
- [Định nghĩa và các thuật ngữ viết tắt](#định-nghĩa-và-các-thuật-ngữ-viết-tắt)

---

## Định nghĩa và các thuật ngữ viết tắt

> **Nguồn:** glossary dự án · phụ lục DOC-08 · thuật ngữ trong TOR/RFP KH.

| STT | Từ viết tắt / Thuật ngữ | Mô tả |
| :---: | --- | --- |
| 1 | `{VIẾT TẮT}` | `{MÔ TẢ}` |
| 2 | | |
| 3 | | |

---

# PHẦN I. HIỆN TRẠNG VÀ NHU CẦU

## I.1. Hiện trạng

> **Nguồn:** DOC-01 · biên bản khảo sát · TOR/RFP (mô tả hiện trạng) · SOP hiện có.
>
> Gợi ý: bối cảnh nghiệp vụ → hệ thống hiện có → hạn chế / pain point (bullet) → kết luận cần thay đổi.

**Bối cảnh**

- `{Mô tả ngắn hoạt động nghiệp vụ cần hỗ trợ}`

**Hệ thống / quy trình hiện tại**

- Tên: `{…}`
- Đơn vị vận hành: `{…}`
- Công nghệ / nền tảng: `{…}`
- Phạm vi đang dùng: `{…}`

**Hạn chế / vấn đề**

- `{Hạn chế 1}`
- `{Hạn chế 2}`
- `{Hạn chế 3}`
- `[…]`

**Kết luận hiện trạng**

> `{1–2 câu: vì sao hiện trạng không còn đáp ứng}`

---

## I.2. Mục tiêu

> **Nguồn:** DOC-01 (goal, success criteria, ROI) · DOC-03 (hướng phạm vi).
>
> Gợi ý: lợi ích khi thay đổi → mục tiêu chính của hệ thống mới → bridge sang Phần II/III.

**Lợi ích kỳ vọng**

- `{…}`
- `{…}`
- `{…}`

**Mục tiêu chính của `{TÊN HỆ THỐNG}`**

- `{Mục tiêu 1}`
- `{Mục tiêu 2}`
- `{Mục tiêu 3}`
- `[…]`

**Cấu trúc tài liệu**

- **Phần II** — yêu cầu nghiệp vụ (chức năng + phi chức năng).
- **Phần III** — giải pháp kỹ thuật tương ứng, kế hoạch triển khai và phân chia phạm vi.

---

# PHẦN II. YÊU CẦU VỀ NGHIỆP VỤ

> **Nguồn tổng:** DOC-03…07, DOC-13 · RFP/TOR · assumption log. Phần III chỉ đề xuất giải pháp cho những gì đã nêu ở đây.

## II.1. Yêu cầu chung, phạm vi triển khai

> **Nguồn:** DOC-03 (in/out) · DOC-08 nguyên tắc kiến trúc sơ bộ · RFP mục yêu cầu chung.
### II.1.1. Yêu cầu thiết kế và kiến trúc hệ thống

- Môi trường triển khai: `{On-prem / Cloud / Hybrid — ghi rõ}`
- Nền tảng client: `{Web / Mobile iOS / Android / …}`
- Trình duyệt hỗ trợ: `{Chrome, Edge, …}`
- `[Yêu cầu mở rộng, đa địa điểm, đồng bộ dữ liệu…]`

### II.1.2. Yêu cầu chung về phần mềm

Hệ thống gồm các nhóm chức năng chính:

| STT | CHỨC NĂNG | MÔ TẢ CHUNG CHỨC NĂNG |
| --- | --- | --- |
| **I. PHẦN MỀM WEB APP** | | |
| 1 | `{Nhóm chức năng}` | `{Mô tả 1–2 câu}` |
| 2 | | |
| **II. PHẦN MỀM MOBILE APP** *(nếu có)* | | |
| 1 | `{Nhóm chức năng}` | `{Mô tả / tham chiếu Web}` |
| 2 | | |

> Không có Mobile → xóa khối II; chỉ có API/Back-office → đổi nhãn cho phù hợp.

---

## II.2. Yêu cầu nghiệp vụ chi tiết

> **Nguồn:** DOC-05 (UC) · DOC-06 (FR) · DOC-04 (BR) · DOC-07 (AC) · danh sách chức năng / prototype đã chốt với KH.

### II.2.1. Yêu cầu chi tiết tính năng phần mềm WEB

| STT | CHỨC NĂNG | MÔ TẢ CHỨC NĂNG |
| :---: | --- | --- |
| **1** | **`{Nhóm}`** | |
| 1.1 | `{Chức năng}` | |
| 1.1.1 | `{Chức năng nguyên tử}` | `{Mô tả hành vi / quy tắc}` |
| 1.1.2 | | |
| **2** | **`{Nhóm}`** | |
| 2.1 | | |

### II.2.2. Yêu cầu chi tiết tính năng phần mềm Mobile APP *(nếu có)*

| STT | CHỨC NĂNG | MÔ TẢ CHỨC NĂNG |
| :---: | --- | --- |
| **1** | **`{Nhóm}`** | |
| 1.1 | `{Chức năng}` | `{Mô tả / “tham chiếu Web §…”}` |
| **2** | | |

---

## II.3. Yêu cầu về hạ tầng và tính sẵn sàng

> **Nguồn:** DOC-13 (NFR: HA, perf, capacity) · spec DC/cloud KH · SLA vận hành.

- Môi trường / chủ sở hữu hạ tầng: `{…}`
- Mô hình sẵn sàng (HA / DR): `{…}`
- Mục tiêu sẵn sàng (SLA uptime): `{vd. 99%}`
- Đồng bộ dữ liệu: `{Realtime / theo lịch / cả hai}`
- `[…]`

---

## II.4. Yêu cầu về kết nối, tích hợp

> **Nguồn:** DOC-10 Integration · interface list KH · tài liệu API / đặc tả đối tác.

- Phương thức tích hợp chấp nhận: `{API / DB link / file / message bus…}`
- Hệ thống cần kết nối (bảng chi tiết):

| STT | Hệ thống | Chiều dữ liệu | Nội dung chính | Ghi chú |
| :---: | --- | --- | --- | --- |
| 1 | `{Tên hệ thống}` | `{In / Out / 2 chiều}` | `{…}` | |
| 2 | | | | |

- Số người dùng dự kiến: `{…}`
- Số kết nối đồng thời: `{…}`
- `[Kho dữ liệu dùng chung / MDM / …]`

---

## II.5. Yêu cầu đảm bảo hoạt động và hỗ trợ kỹ thuật

> **Nguồn:** DOC-13 (support SLA) · DOC-17 (ops sơ bộ) · điều khoản bảo hành/AMC trong RFP/HĐ.

- `{Khắc phục sự cố phần mềm}`
- `{Chỉnh sửa lỗi chức năng / báo cáo}`
- `{Hỗ trợ người dùng trong thời gian hợp đồng}`
- `[…]`

---

## II.6. Yêu cầu đảm bảo an ninh thông tin

> **Nguồn:** DOC-13 Security NFR · chính sách ATTT KH · checklist tuân thủ pháp lý.

- Tuân thủ: `{Quy định NN / nội bộ KH / GDPR / …}`
- Vá bảo mật (OS, middleware, DB): `{SLA thời gian}`
- Nhật ký truy cập / chính sách mật khẩu: `{…}`
- Dữ liệu nhạy cảm / dữ liệu cá nhân: `{…}`
- `[…]`

---

## II.7. Yêu cầu giao diện

> **Nguồn:** DOC-06 / UC liên quan UI · brand guideline / design system KH · mẫu màn hình đã duyệt.

- Màu sắc / brand: `{…}`
- Bố cục: `{rõ ràng, đồng nhất…}`
- Ngôn ngữ UI: `{Tiếng Việt / English / …}`
- Quy trình phê duyệt UI với KH: `{…}`

---

## II.8. Yêu cầu lưu trữ dữ liệu

> **Nguồn:** DOC-13 (retention) · DOC-11 Data Model (policy) · quy định lưu trữ / pháp lý ngành.

- Thời gian lưu trữ: `{vd. 10 năm}`
- `[Loại dữ liệu, archive, xóa theo policy…]`

---

# PHẦN III. GIẢI PHÁP KỸ THUẬT ĐỀ XUẤT

> **Nguồn tổng:** DOC-08…12, DOC-14…17 · đáp ứng lần lượt các mục Phần II đã chốt. Không đưa giải pháp ngoài phạm vi II.

## III.1. Xây dựng phần mềm đáp ứng các yêu cầu nghiệp vụ

> **Nguồn:** DOC-03 · DOC-05/06 · Phần II.1–II.2 · mockup/UI pack · sơ đồ chức năng đã duyệt với KH.
>
> Tóm tắt phạm vi xây dựng + ánh xạ yêu cầu Phần II + sơ đồ chức năng + mockup tiêu biểu (đính kèm).

### III.1.1. Tóm tắt phạm vi xây dựng

Từ các yêu cầu Phần II, đề xuất xây dựng `{TÊN HỆ THỐNG}` nhằm:

- `{Mục tiêu nghiệp vụ 1 — đáp ứng II.1 / I.2}`
- `{Mục tiêu nghiệp vụ 2}`
- `[…]`

**Phạm vi In / Out (khớp II.1)**

| | Nội dung |
| --- | --- |
| **In scope** | `{Các phân hệ / chức năng sẽ xây dựng trong gói này}` |
| **Out of scope** | `{Hạng mục không thuộc gói — xử lý riêng / giai đoạn sau}` |
| **Giả định** | `{API đối tác sẵn sàng / môi trường KH cung cấp / …}` |

### III.1.2. Phân hệ / kênh triển khai

| STT | Phân hệ / kênh | Mô tả ngắn | Actor chính | Ánh xạ yêu cầu (II.2) |
| :---: | --- | --- | --- | --- |
| 1 | `{Web App — Portal vận hành}` | `{…}` | `{Vai trò A, B}` | `{1.x, 2.x}` |
| 2 | `[Mobile App]` | | | |
| 3 | `[Admin / Cấu hình]` | | | |
| 4 | `[API / Integration hub]` | | | |
| 5 | `[Khác]` | | | |

### III.1.3. Sơ đồ chức năng tổng thể

```text
[Đính kèm sơ đồ chức năng / mindmap / tree phân hệ → nhóm → chức năng]
```

> Gợi ý: sơ đồ bám cây chức năng đã liệt kê ở **II.2** (STT `1` / `1.1` / `1.1.1`).

**Bảng nhóm chức năng chính** *(tóm tắt — chi tiết giữ ở II.2)*

| STT | Nhóm chức năng | Mô tả | Ghi chú kỹ thuật |
| :---: | --- | --- | --- |
| 1 | `{Nhóm A}` | `{…}` | `{Online / batch / báo cáo…}` |
| 2 | `{Nhóm B}` | | |
| 3 | | | |

### III.1.4. Luồng nghiệp vụ tiêu biểu

> Chọn 2–5 luồng then-chốt để minh họa giải pháp đáp ứng II.2 (không liệt kê hết).

| STT | Luồng nghiệp vụ | Actor | Tóm tắt các bước | Kết quả mong đợi |
| :---: | --- | --- | --- | --- |
| 1 | `{Tên luồng}` | `{…}` | `1) … → 2) … → 3) …` | `{…}` |
| 2 | | | | |
| 3 | | | | |

```text
[Đính kèm sơ đồ BPMN / sequence cho luồng quan trọng — tùy chọn]
```

### III.1.5. Giao diện tiêu biểu

> Liệt kê màn hình / mockup minh họa; chi tiết UI tuân thủ **II.7**.

| STT | Màn hình / luồng | Phân hệ | File đính kèm / link | Ghi chú |
| :---: | --- | --- | --- | --- |
| 1 | `{Tên màn hình}` | `{Web}` | `{mockup-01.png}` | |
| 2 | | | | |
| 3 | | | | |

**Nguyên tắc UI đề xuất**

- Ngôn ngữ: `{Tiếng Việt / song ngữ…}`
- Layout / brand: `{…}`
- Responsive: `{Desktop / Tablet / Mobile}`
- Quy trình duyệt UI với KH: `{Prototype → Review → Sign-off}`

---

## III.2. Giải pháp về xây dựng phần mềm

### III.2.1. Kiến trúc hệ thống

> **Nguồn:** DOC-08 SAD · DOC-09 ADR · đáp ứng II.3, II.4, II.6, II.8.
>
> Mô tả kiến trúc logic / triển khai đáp ứng II.3 (sẵn sàng), II.4 (tích hợp), II.6 (ANTT), II.8 (lưu trữ).

**Nguyên tắc kiến trúc**

| STT | Nguyên tắc | Mô tả áp dụng |
| :---: | --- | --- |
| 1 | `{Tách lớp Presentation / API / Domain / Data}` | `{…}` |
| 2 | `{API-first / tích hợp qua gateway}` | `{…}` |
| 3 | `{Stateless app + session tập trung}` | `{…}` |
| 4 | `{HA / scale ngang theo nhu cầu}` | `{…}` |
| 5 | `[…]` | |

**Sơ đồ kiến trúc tổng thể**

```text
[Đính kèm sơ đồ kiến trúc — logical / deployment]

Ví dụ khung (thay bằng sơ đồ thật):

  [Users] → [CDN / WAF] → [API Gateway / Proxy]
                              ├→ [Web / BFF]
                              ├→ [Mobile API]
                              ├→ [Core Services]
                              ├→ [Identity]
                              └→ [Integration / ETL]
                                    ↓
                         [DB] [Cache] [Queue] [Object storage]
```

**Môi trường triển khai**

| Môi trường | Mục đích | Ghi chú |
| --- | --- | --- |
| `{DEV}` | Phát triển | |
| `{SIT / Test}` | Kiểm thử tích hợp | |
| `{UAT}` | Nghiệm thu với KH | |
| `{PROD}` | Vận hành | `{HA / DR nếu có}` |

**Mô tả các thành phần**

| Thành phần | Mô tả |
| --- | --- |
| `{PROXY / API Gateway}` | `{…}` |
| `{Website}` | `{…}` |
| `{Mobile}` | `{…}` |
| `{CoreService}` | `{…}` |
| `{IdentityService}` | `{…}` |
| `{NotificationService}` | `{…}` |
| `{ETL / Integration}` | `{…}` |
| `{Cache}` | `{…}` |
| `{Message bus}` | `{…}` |
| `{Object storage}` | `{…}` |
| `{Database}` | `{…}` |
| `{Realtime}` | `{…}` |
| `[…]` | |

### III.2.2. Giải pháp về ứng dụng

> **Nguồn:** DOC-08 (application view) · DOC-11 Data Model · DOC-12 OpenAPI · ADR chọn stack · chuẩn công nghệ nội bộ nhà thầu.
>
> Lựa chọn công nghệ / framework / mô hình triển khai ứng dụng — khớp kiến trúc III.2.1 và yêu cầu II.2–II.8.

#### a) Tổng quan stack

| Lớp | Công nghệ đề xuất | Phiên bản (gợi ý) | Lý do chọn |
| --- | --- | --- | --- |
| Front-end | `{React / Angular / Vue / …}` | `{…}` | `{…}` |
| Back-end / API | `{.NET / Java / Node / …}` | `{…}` | `{…}` |
| Mobile *(nếu có)* | `{Flutter / RN / Native}` | `{…}` | `{…}` |
| Database | `{PostgreSQL / SQL Server / …}` | `{…}` | `{…}` |
| Cache | `{Redis / …}` | `{…}` | `{…}` |
| Message / Queue | `{RabbitMQ / Kafka / …}` | `{…}` | `{…}` |
| Object storage | `{MinIO / S3 / …}` | `{…}` | `{…}` |
| Job / Scheduler | `{Hangfire / Quartz / …}` | `{…}` | `{…}` |
| Realtime *(nếu có)* | `{SignalR / WebSocket / …}` | `{…}` | `{…}` |
| Báo cáo *(nếu có)* | `{…}` | `{…}` | `{…}` |
| `[…]` | | | |

#### b) Front-end

| Hạng mục | Nội dung đề xuất |
| --- | --- |
| Framework / thư viện UI | `{…}` |
| Kiến trúc FE | `{SPA / BFF / micro-frontend…}` |
| State / routing | `{…}` |
| Chuẩn UI / design system | `{khớp II.7}` |
| Trình duyệt / thiết bị hỗ trợ | `{Chrome, Edge, … / Desktop–Tablet}` |
| Build & deploy FE | `{CI pipeline, static host / CDN}` |
| `[i18n / PWA / offline…]` | `{…}` |

#### c) Back-end

| Hạng mục | Nội dung đề xuất |
| --- | --- |
| Runtime / framework | `{…}` |
| Kiến trúc BE | `{Modular monolith / microservices / …}` |
| API style | `{REST / gRPC / GraphQL…}` + chuẩn `{OpenAPI}` |
| AuthN / AuthZ | `{OIDC / JWT / RBAC…}` — khớp Identity ở III.2.1 |
| Job / batch | `{…}` — lịch, retry, idempotent |
| Realtime / push | `{…}` |
| Logging / tracing | `{structured log, correlation id, APM…}` |
| Unit / integration test | `{framework, coverage tối thiểu…}` |

**Các service / module ứng dụng chính**

| STT | Module / Service | Trách nhiệm | Ghi chú |
| :---: | --- | --- | --- |
| 1 | `{CoreService}` | `{Nghiệp vụ chính}` | |
| 2 | `{IdentityService}` | `{Đăng nhập, phân quyền}` | |
| 3 | `{IntegrationService}` | `{Đồng bộ / API đối tác}` | |
| 4 | `{NotificationService}` | `{Email / SMS / in-app}` | |
| 5 | `[…]` | | |

#### d) Dữ liệu & hạ tầng ứng dụng

| Hạng mục | Công nghệ | Mục đích | Ghi chú (II.8 / sizing) |
| --- | --- | --- | --- |
| OLTP DB | `{…}` | Dữ liệu giao dịch | `{retention, backup}` |
| `[OLAP / DW]` | `{…}` | Báo cáo / analytics | |
| Cache | `{…}` | Session / hot data | |
| Queue / bus | `{…}` | Async, tích hợp | |
| Object storage | `{…}` | File, chứng từ, export | |
| `[Search engine]` | `{…}` | Full-text | |

**Nguyên tắc dữ liệu**

- Mô hình: `{quan hệ / document…}`; schema versioning: `{…}`
- Migration: `{tool / quy trình}` 
- Sao lưu / phục hồi ứng dụng: `{RPO / RTO sơ bộ — chi tiết III.2.3 / III.5}`
- Dữ liệu nhạy cảm: `{mã hóa at-rest / in-transit — khớp II.6}`

#### e) Tích hợp ứng dụng *(khớp II.4)*

| Hệ thống đối tác | Giao thức | Chiều | Cơ chế | Ghi chú |
| --- | --- | --- | --- | --- |
| `{Tên hệ thống}` | `{REST / SFTP / MQ…}` | `{In / Out / 2 chiều}` | `{sync / async, retry}` | |
| | | | | |

#### f) Chất lượng & vận hành ứng dụng

| Hạng mục | Đề xuất |
| --- | --- |
| CI/CD | `{pipeline build → test → deploy theo môi trường}` |
| Cấu hình theo môi trường | `{config map / secret store — không hard-code}` |
| Giám sát ứng dụng | `{health check, metric, alert — khớp III.5}` |
| Feature flag / toggle | `[Có / Không]` |
| Tài liệu kỹ thuật giao nộp | `{API spec, ERD, runbook…}` |

### III.2.3. Giải pháp về hạ tầng CNTT

> **Nguồn:** DOC-08 deployment view · sizing từ DOC-13 · bảng máy chủ / BOM (nếu KH yêu cầu).

| STT | Nội dung yêu cầu kỹ thuật tối thiểu | | Đơn vị tính | Số lượng |
| --- | --- | --- | --- | --- |
| **A** | **Hệ thống chính** | | | |
| **1** | **Máy chủ `{vai trò}`** | | **Bộ** | `{n}` |
| | CPU | `{…}` Cores | | |
| | RAM | `{…}` GB | | |
| | SSD | `{…}` GB | | |
| | OS | `{…}` | | |
| **2** | **Máy chủ `{vai trò}`** | | **Bộ** | `{n}` |
| | CPU | | | |
| | RAM | | | |
| | SSD | | | |
| | OS | | | |
| **B** | **Hệ thống backup / HA** *(nếu cần)* | | | |
| **1** | **Máy chủ `{vai trò}`** | | **Bộ** | `{n}` |
| | CPU | | | |
| | RAM | | | |
| | SSD | | | |
| | OS | | | |

> Điều chỉnh số dòng máy chủ theo sizing thực tế; ghi rõ On-prem / Cloud / managed service nếu không dùng VM thô.

---

## III.3. Kế hoạch triển khai

> **Nguồn:** DOC-15 roadmap · DOC-14 WBS · DOC-17 cutover · milestone hợp đồng / proposal. Ước lượng effort: [ULNL.md](ULNL.md) / [T-SHIRT.md](T-SHIRT.md) nếu đính kèm BoQ.

```text
[Đính kèm timeline / Gantt / milestone]
```

| Giai đoạn | Nội dung chính | Thời gian dự kiến | Ghi chú |
| --- | --- | --- | --- |
| `{Khảo sát / TK}` | | `{…}` | |
| `{Phát triển}` | | | |
| `{UAT}` | | | |
| `{Go-live}` | | | |
| `{Bàn giao / ổn định}` | | | |

---

## III.4. An ninh thông tin (ANTT)

> **Nguồn:** DOC-08 security view · đáp ứng II.6 / DOC-13 · kế hoạch pentest · policy ATTT KH.

- Tuân thủ: `{chính sách KH + luật ANTT / ATTT}`
- Kiểm tra ANTT mã nguồn / pentest: `{ai làm, SLA phản hồi, ảnh hưởng lịch dự án}`
- `[…]`

---

## III.5. Đảm bảo hoạt động

> **Nguồn:** DOC-17 · đáp ứng II.5 · SLA AMC / hỗ trợ trong HĐ.

- Hỗ trợ người dùng: `{…}`
- Xử lý sự cố: `{…}`
- Thời gian phản hồi / khắc phục: `{vd. 4h sau khi nhận thông báo}`
- `[Chế độ 24/7 / giờ hành chính…]`

---

## III.6. Phạm vi do Nhà thầu thực hiện

> **Nguồn:** DOC-03 RACI · assumption log · điều khoản / phụ lục trách nhiệm nhà thầu trong RFP/HĐ.

- Xây dựng chức năng theo yêu cầu đã thống nhất
- Triển khai hệ thống:
  - Cài đặt, cấu hình
  - Đào tạo, hướng dẫn người dùng
  - Bàn giao tài liệu
- Đảm bảo hoạt động `{phần mềm / hạ tầng do NT phụ trách}`
- `[…]`

---

## III.7. Phạm vi do Khách hàng thực hiện

> **Nguồn:** DOC-03 RACI · assumption (phụ thuộc KH) · phụ lục trách nhiệm KH trong RFP/HĐ.

- Cung cấp / phê duyệt hạ tầng theo sizing (nếu KH host)
- Cung cấp thông tin, dữ liệu nghiệp vụ đầu vào
- Chủ trì quyết định quy trình, chức năng, giao diện
- Cử nhân sự UAT / chạy thử
- Cử nhân sự tiếp nhận đào tạo quản trị
- `[…]`

---

## Phụ lục *(tùy chọn)*

| Mã | Nội dung | File đính kèm |
| --- | --- | --- |
| PL-01 | Sơ đồ kiến trúc | |
| PL-02 | Mockup / UI | |
| PL-03 | Ma trận tích hợp chi tiết | |
| PL-04 | Timeline triển khai | |
| PL-05 | Assumption / Out of scope | |

---

## Checklist hoàn thiện (trước gửi KH)

- [ ] Trang bìa + version + bảng thay đổi + trang ký
- [ ] Thuật ngữ viết tắt đủ dùng trong tài liệu
- [ ] Phần I: hiện trạng có pain point đo được / kiểm chứng được
- [ ] Phần II.2: chức năng nguyên tử, không trùng / mơ hồ
- [ ] II.3–II.8: NFR có con số (SLA, user, retention…) khi có thể
- [ ] III.2 trace được về II (architecture ↔ requirement)
- [ ] III.6 / III.7 không chồng chéo trách nhiệm
- [ ] Hình / phụ lục đã đính kèm và được tham chiếu trong thân bài
