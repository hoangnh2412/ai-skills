# HƯỚNG DẪN ƯỚC LƯỢNG & BÁO GIÁ THEO CATALOG CHỨC NĂNG (ULNL)

> **Đơn vị:** Man-hour (**MH**). Quy đổi: `1 MD = 7.5 MH` (có thể đổi theo policy nội bộ — ghi rõ trên báo giá).

---

## 1. Mục đích

Phương pháp **ULNL** dùng để **ước lượng nỗ lực có căn cứ catalog** rồi quy ra **chi phí / báo giá**, khi đã có (hoặc có thể dựng) danh sách chức năng ở mức thao tác người dùng.

| Lần | Khi nào |
|-----|---------|
| **Lần 1 (chính)** | Đã liệt kê chức năng + mô tả ngắn; báo giá thương mại / chốt kế hoạch với khách |
| **Lần cuối** (tùy chọn) | Sau TKCT / baseline SRS — tái ước lượng trước phát triển nặng |

---

## 2. Khi nào dùng / không dùng

| Dùng ULNL | Không dùng / chuyển phương pháp khác |
|-----------|--------------------------------------|
| Đã có danh sách chức năng (hoặc screen/API) đủ để gán **mã loại** | Chỉ có goal / vài bullet phạm vi, chưa tách chức năng nguyên tử |
| Cần báo giá có bảng chứng minh MH theo từng dòng | Cần trace FR → Story Point / WBS baseline nội bộ (sau SRS) |
| So sánh phương án phạm vi (cắt BC4 → BC3, bỏ NFR…) | Đã ký baseline — đổi scope → Change Request, không “âm thầm” chỉnh CSDL |

---

## 3. Kiến trúc phương pháp

```text
┌─────────────────────────────────────────────────────────────┐
│  A. NL CHỨC NĂNG                                            │
│     Phân hệ → Nhóm → Chức năng nguyên tử                    │
│     → Gán mã loại (NV / GD_WEB / CN_WEB / DS / BC / …)     │
│     → Tra CSDL_CN: Giải pháp + Phát triển + Kiểm thử (MH)  │
├─────────────────────────────────────────────────────────────┤
│  B. NL PHI CHỨC NĂNG                                        │
│     HA, hiệu năng, bảo mật, giám sát, tài liệu, R&D tech…  │
│     → Tra CSDL Phi CN (MH) hoặc liệt kê theo yêu cầu NFR    │
├─────────────────────────────────────────────────────────────┤
│  C. TỔNG HỢP                                                │
│     Σ MH chức năng + Σ MH phi CN (±10% điều chỉnh cho phép)│
│     → MD → Nhân sự / lịch → Đơn giá → Báo giá              │
└─────────────────────────────────────────────────────────────┘
```

**Giải pháp bao gồm trong mỗi dòng chức năng (theo mẫu):**

- Phân tích / thiết kế kiến trúc–hệ thống–nghiệp vụ (**Giải pháp**)
- Phát triển: lập trình, sửa lỗi, unit test (**Phát triển**)
- Kiểm thử: kịch bản KT, test tính năng, HDSD liên quan (**Kiểm thử**)

---

## 4. Đầu vào tối thiểu

- [ ] Cây chức năng: Phân hệ → Nhóm → **Chức năng nguyên tử** (mỗi dòng = 1 thao tác / 1 màn hình thao tác được)
- [ ] Mô tả ngắn + tín hiệu độ khó (số trường, số bước nghiệp vụ, tích hợp)
- [ ] Danh sách NFR / công việc phi chức năng (nếu khách yêu cầu)
- [ ] Công nghệ dự kiến (ảnh hưởng chọn bộ mã loại / CSDL)
- [ ] % tái sử dụng theo dòng (nếu có)
- [ ] In scope / Out of scope + assumption log

---

## 5. Quy trình ước lượng (theo *HD ULNL*)

### Thời điểm

| Lần | Thời điểm | Đầu vào | Mục đích |
|-----|-----------|---------|----------|
| **Lần 1** | Khảo sát sơ bộ, **trước** khi chốt kế hoạch với khách | Khảo sát / danh sách chức năng | Báo giá / ULNL chính thức lần đầu |
| **Lần cuối** (tùy chọn) | Sau khi **TKCT** được phê duyệt | TKCT + TK CSDL | Hiệu chỉnh nỗ lực trước phát triển nặng |

### Các bước

| Bước | Việc làm |
|------|----------|
| **1** | Xác định stack / platform (vd. Web + API + DB). Chọn đúng bộ **mã loại chức năng** và **CSDL** tương ứng. |
| **2** | Liệt kê chức năng vào bảng NL chức năng: *Tên* + *Mô tả*. Gom theo phân hệ / nhóm để cộng dồn. |
| **3** | Gán **mã loại chức năng** theo định nghĩa (§6). Chỉ điền cột “trắng”; cột MH lấy từ CSDL. Ghi **% tái sử dụng** nếu có. Cho phép điều chỉnh từng dòng **±10%** so với CSDL. Thiếu mã loại mới → **không tự bịa**; báo phê duyệt trước khi thêm vào CSDL. |
| **4** | Liệt kê NL phi chức năng theo CSDL Phi CN / yêu cầu NFR (§8). Cũng cho phép ±10%. |
| **5** | Tổng hợp: Σ MH chức năng + Σ MH phi CN → MD → phân bổ nguồn lực / lịch → đơn giá tiền. |

```text
MH_dòng = (MH_GP + MH_PT + MH_KT) × (1 − %tái_sử_dụng) × (1 + hệ_số_điều_chỉnh)
         với |hệ_số_điều_chỉnh| ≤ 0.10 trừ khi có phê duyệt vượt khung

Tổng_MH = Σ MH_dòng_chức_năng + Σ MH_phi_CN
Tổng_MD = Tổng_MH / 7.5
```

---

## 6. Định nghĩa loại chức năng (catalog chuẩn)

Mỗi **chức năng nguyên tử** chỉ thuộc **một** mã. Nếu quá lớn (vd. >40 trường form) → **tách** thành 2 dòng (theo ghi chú CSDL gốc).

### 6.1. Xử lý nghiệp vụ (backend / API)

| Mã | Tên | Tiêu chí | Kỹ năng |
|----|-----|----------|---------|
| **NV1** | NV đơn giản | Chỉ backend/API; **&lt; 5 bước** logic | BACKEND |
| **NV2** | NV trung bình | Chỉ backend/API; **5–10 bước** | BACKEND |
| **NV3** | NV phức tạp | Backend + DB; **&gt; 10 bước** | BACKEND + DB |

*Bước* = một xử lý logic được mô tả trong tài liệu giải pháp.

### 6.2. Giao diện web (chỉ UI)

| Mã | Tên | Tiêu chí |
|----|-----|----------|
| **GD_WEB1** | UI đơn giản | &lt; 10 component / trường |
| **GD_WEB2** | UI trung bình | 10–20 trường |
| **GD_WEB3** | UI phức tạp | &gt; 20 trường |

Dùng khi **không** có service/API mới đáng kể — chỉ dựng / gắn UI.

### 6.3. Chức năng web (UI + Service)

| Mã | Tên | Tiêu chí |
|----|-----|----------|
| **CN_WEB1** | Đơn giản | UI + Service + DB; &lt; 10 component (input/tương tác/validate) |
| **CN_WEB2** | Trung bình | 10–20 trường |
| **CN_WEB3** | Phức tạp | &gt; 20 trường; nếu ~40 trường → **chia 2 × CN_WEB2** |
| **CN_WEB4** | **Chưa rõ yêu cầu** | Dùng tạm khi scope mơ hồ — MH cao, **bắt buộc** ghi câu hỏi làm rõ |

### 6.4. Danh sách dạng bảng

| Mã | Tiêu chí |
|----|----------|
| **DS1** | &lt; 10 cột; có filter; đã gồm dialog xóa / toast / export Excel “nguyên xi” |
| **DS2** | 10–20 cột **hoặc** component đặc biệt (calendar, tree…) |
| **DS3** | &gt; 20 cột **hoặc** component đặc biệt + filter phức tạp |
| **DS4** | **Chưa rõ yêu cầu** |

### 6.5. Danh mục

| Mã | Tiêu chí |
|----|----------|
| **DM1** | Từ điển, **không** tham chiếu bảng khác; CRUD load/save |
| **DM2** | 1–3 tham chiếu |
| **DM3** | &gt; 3 tham chiếu |

### 6.6. Báo cáo hàng cột

| Mã | Tiêu chí |
|----|----------|
| **BC1** | Không công thức / chỉ format; **&lt; 10** trường xuất; có tham số + Excel |
| **BC2** | Có công thức cột trung gian **và** &lt; 20 trường; **hoặc** không CT nhưng &gt; 10 trường |
| **BC3** | Có công thức **và** &gt; 20 trường |
| **BC4** | **Chưa rõ yêu cầu** (cần BA làm rõ) — MH cao |

### 6.7. Tiến trình đồng bộ / batch

| Mã | Tiêu chí |
|----|----------|
| **TT_DB1** | Đồng bộ đơn giản; &lt; 5 bước bổ sung |
| **TT_DB2** | Trung bình; 5–10 bước |
| **TT_DB3** | Phức tạp; &gt; 10 bước; nếu &gt; 20 → tách 2 × TT_DB2 |

### 6.8. Quy tắc chọn mã nhanh

```text
Có form nhập + API lưu/xử lý?     → CN_WEB*
Chỉ màn xem / form display?       → GD_WEB*
Bảng list + filter/export?        → DS*
Báo cáo / dashboard số liệu?      → BC*
Job/sync/integration nền?         → TT_DB* hoặc NV*
API thuần không UI?               → NV*
Master data CRUD?                 → DM*
Yêu cầu còn mơ hồ / thiếu AC?     → *4 (BC4 / CN_WEB4 / DS4) + ghi chú câu hỏi
```

---

## 7. CSDL chức năng — nỗ lực chuẩn (MH)

Nguồn: sheet *CSDL_CN* của file mẫu. **Giữ cố định trong cùng một báo giá**; thay đổi CSDL = phiên bản catalog mới + ghi nhận thay đổi.

| Mã | Giải pháp | Phát triển | Kiểm thử | **Tổng MH** |
|----|-----------|------------|----------|-------------|
| NV1 | 1 | 2 | 1 | **4** |
| NV2 | 2 | 4 | 3 | **9** |
| NV3 | 3 | 8 | 4 | **15** |
| GD_WEB1 | 1 | 2 | 3 | **6** |
| GD_WEB2 | 1 | 3 | 3 | **7** |
| GD_WEB3 | 2 | 4 | 5 | **11** |
| CN_WEB1 | 1 | 4 | 2 | **7** |
| CN_WEB2 | 2 | 6 | 4 | **12** |
| CN_WEB3 | 3 | 10 | 6 | **19** |
| CN_WEB4 | 16 | 16 | 6 | **38** |
| DS1 | 2 | 4 | 2 | **8** |
| DS2 | 3 | 6 | 3 | **12** |
| DS3 | 3 | 8 | 5 | **16** |
| DS4 | 16 | 16 | 5 | **37** |
| DM1 | 1 | 1 | 1 | **3** |
| DM2 | 1 | 2 | 2 | **5** |
| BC1 | 4 | 4 | 4 | **12** |
| BC2 | 6 | 6 | 6 | **18** |
| BC3 | 12 | 12 | 12 | **36** |
| BC4 | 32 | 40 | 16 | **88** |
| TT_DB1 | 2 | 4 | 2 | **8** |
| TT_DB2 | 3 | 8 | 3 | **14** |
| TT_DB3 | 3 | 12 | 4 | **19** |

> **Lưu ý thương mại:** mã `*4` (chưa rõ) đắt hơn rõ rệt vì đã gộp effort làm rõ. Ưu tiên **làm rõ yêu cầu** rồi hạ xuống BC3/CN_WEB3/DS3 trước khi chốt giá cứng.

---

## 8. NL phi chức năng (CSDL Phi CN)

Các hạng mục **không** gắn một màn hình cụ thể — cộng riêng.

| Mã | Đầu việc | MH gợi ý (mẫu) | Ghi chú dùng |
|----|----------|----------------|--------------|
| SZ1 | Sizing | 16 | Capacity / sizing hệ thống |
| HA | Triển khai HA | 72 | Active-active / failover |
| TP | Test hiệu năng | 40 | Có thể tách sheet KT hiệu năng chi tiết hơn |
| DOC1 | HDSD end-user | 16 | |
| DOC2 | HD quản trị admin | 16 | |
| TS | Rà soát ATTT | 40 | Pentest / OWASP… |
| TB | Sao lưu / phục hồi | 40 | |
| TM | Cảnh báo / giám sát | 16 | |
| NC1 | Nghiên cứu CN mức 1 | 8 | Tech mới nhẹ |
| NC2 | NC mức 2 | 24 | |
| NC3 | NC mức 3 | 40 | |
| NC4 | NC đặc biệt | 80 | Công nghệ đặc thù / POC nặng |

Trên dự án thực tế (vd. Lotus FM), NFR có thể được **bung chi tiết** thành nhiều dòng (tốc độ báo cáo &lt; 30s, CCU, scale-out BE/FE/DB, observability…) — miễn là mỗi dòng có MH và acceptance đo được.

```text
Σ_phi_CN = Σ MH_hạng_mục_đã_chọn (chỉ những mục “Có thực hiện”)
```

---

## 9. Cấu trúc bảng NL chức năng (mẫu điền)

| STT | Phân hệ / Nhóm | Tên chức năng | Mô tả | Mã loại | GP | PT | KT | Tổng MH | % tái sử dụng | MH sau TS | Assumption / câu hỏi |
|-----|----------------|---------------|-------|---------|----|----|----|---------|---------------|-----------|----------------------|
| 1 | Lịch bay / DS chuyến | Xem danh sách | &gt;20 cột, highlight… | DS3 | 3 | 8 | 5 | 16 | 0% | 16 | Nguồn Netlines ổn định |
| 2 | … | Sync Amadeus | Đồng bộ booking | DS3 hoặc TT_DB* | … | … | … | … | … | … | Field mapping TBD |

**Quy tắc cộng dồn:** hàng nhóm / phân hệ = tổng các dòng con (không gán mã loại cho hàng nhóm).

---

## 10. Từ MH → lịch → tiền

### 10.1. Quy đổi

```text
Tổng_MD = Tổng_MH / giờ_một_MD          # mặc định 7.5
Chi_phí = Tổng_MD × Đơn_giá_MD           # hoặc tách theo role
```

Có thể tách đơn giá: BA/Giải pháp · Dev · QC · PM — khi đó nhân MH từng cột GP/PT/KT với rate tương ứng.

### 10.2. Phân bổ nguồn lực (tham chiếu mẫu web)

| Công việc | Diễn giải | Tỷ lệ gợi ý (mẫu) |
|-----------|-----------|-------------------|
| Quản trị dự án | Kế hoạch, milestone, báo cáo, họp | ~9% |
| Phân tích | Khảo sát, PTYC, prototype, thống nhất KH | ~4–5% |
| Thiết kế | Tài liệu thiết kế | ~7% |
| Coding + Unit test | Phát triển chức năng | ~44% |
| KBKT + kiểm thử | Viết/review KBKT, test, BBNT nội bộ | ~36% |

*(Tỷ lệ trên lấy từ sheet mẫu; dự án thực tế lấy từ Σ GP/PT/KT thực tế sẽ chính xác hơn % cố định.)*

### 10.3. Contingency / độ mơ hồ

| Tín hiệu | Xử lý |
|----------|--------|
| Nhiều dòng `*4` (BC4/CN_WEB4/DS4) | Báo **khoảng giá**; ưu tiên workshop làm rõ trước khi lock |
| Scope rõ, ít assumption | Buffer thương mại **+10–15%** (ngoài ±10% kỹ thuật từng dòng) |
| File khách mơ hồ, dễ đội scope | Buffer **+25–40%** hoặc chỉ báo khoảng A–B |
| Sai số kỹ thuật từng dòng | **±10%** so với CSDL — không cần phê duyệt thêm |

```text
ROM_thấp = Tổng_sau_buffer × 0.90
ROM_cao  = Tổng_sau_buffer × 1.10   # hoặc rộng hơn theo policy
```

---

## 11. Format báo giá gửi khách (gợi ý)

1. **Phạm vi** In / Out (ngày chốt) + danh sách phân hệ
2. **Bảng chức năng** (có thể ẩn cột GP/PT/KT nội bộ; hiện Tổng MH hoặc MD theo nhóm)
3. **Phi chức năng / NFR** đã gồm / loại trừ
4. **Tổng MD / khoảng A–B** + đơn giá / thành tiền
5. **Assumption** ảnh hưởng giá (tích hợp, sẵn sàng API đối tác, môi trường, % tái sử dụng)
6. **Điều khoản:** ULNL lần 1 mang tính cam kết theo scope đã liệt kê; thay đổi chức năng / NFR → CR hoặc tái ước lượng
7. **Mục chưa rõ** (các dòng `*4`) — lộ trình làm rõ và ảnh hưởng giá

---

## 12. Ví dụ nhanh

Ba chức năng + một NFR:

| Dòng | Mã | MH |
|------|-----|-----|
| Xóa bản ghi cấu hình | CN_WEB1 | 7 |
| Danh sách 12 cột + filter | DS2 | 12 |
| Báo cáo có công thức, 15 cột | BC2 | 18 |
| **Σ chức năng** | | **37** |
| Test hiệu năng (TP) | | 40 |
| **Tổng MH** | | **77** |
| **Tổng MD** (÷7.5) | | **≈ 10.3 MD** |
| ±10% kỹ thuật | | **≈ 9.3 – 11.3 MD** |

Đổi tiền: `MD × đơn_giá_MD` (+ VAT / chi phí hạ tầng nếu tách hợp đồng).

---

## 13. Anti-patterns

- Gán mã loại cho **cả module** thay vì chức năng nguyên tử
- Dùng hàng loạt **BC4/CN_WEB4/DS4** rồi báo **một số cứng** không khoảng / không assumption
- **Tự invent** mã loại mới hoặc đổi MH CSDL giữa chừng không ghi phiên bản
- Điều chỉnh từng dòng **&gt; ±10%** mà không lý do / không phê duyệt
- Cộng trùng: vừa tính CN_WEB đầy đủ vừa cộng thêm GD_WEB cùng màn hình
- Bỏ quên **phi chức năng** (HA, ATTT, perf) khi khách đã nêu NFR
- Đếm **Out of scope** vào tổng “cho đủ”

---

## 14. Checklist hoàn thành báo giá

```text
- [ ] In/out scope + cây Phân hệ → Nhóm → Chức năng nguyên tử
- [ ] Mỗi dòng lá: mã loại đúng định nghĩa §6
- [ ] MH lấy từ CSDL §7 (GP/PT/KT); ghi % tái sử dụng nếu có
- [ ] Điều chỉnh dòng trong ±10% hoặc có phê duyệt
- [ ] NL phi chức năng §8 đã chọn / loại trừ có chủ đích
- [ ] Tổng MH → MD → tiền; nêu giờ/MD và đơn giá
- [ ] Assumption + danh sách câu hỏi (đặc biệt dòng *4)
- [ ] ROM/báo giá dạng khoảng hoặc điều kiện hiệu chỉnh sau làm rõ
- [ ] Ghi phiên bản catalog CSDL + ngày ước lượng + người lập
```

---

## 15. Phụ lục — ánh xạ sheet Excel mẫu

| Sheet | Vai trò trong phương pháp |
|-------|---------------------------|
| *Trang bia* | Metadata dự án, lần UL, người lập / duyệt |
| *Bang ghi nhan thay doi* | Versioning tài liệu ước lượng |
| *Plan* | Lịch giai đoạn (kickoff → NT) — không thay ULNL |
| *NL Chuc nang* | Bảng chức năng + mã loại + MH |
| *NL Phi CN* | Bảng phi chức năng |
| *Định nghĩa Loại Chức năng* | Catalog mã (§6) |
| *CSDL_CN* | Baseline MH theo mã × GP/PT/KT (§7) |
| *CSDL Phi CN* | Baseline MH phi CN (§8) |
| *Định nghĩa loại công việc* | Diễn giải QTDA / PTYC / TKCT / lập trình / KT… |
| *Ty le phan bo nguon luc du an* | Tham chiếu cơ cấu % |
| *HD ULNL* | Quy trình 5 bước (§5) |
| *BM_Kiem thu hieu nang* | Chi tiết thêm khi NFR perf phức tạp |

File mẫu tham chiếu: `Tekgo_Minvoice_LOTUS_AIRPORT_FM_Final.xlsx` (cùng thư mục template).
