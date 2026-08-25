# ADR Template — repo `ai-skills`

> Khuôn chuẩn cho quyết định định hướng của repo này. Chưng cất từ khuôn de-facto (ADR-011/012/020/022) + vay cấu trúc mục và hệ mã vai trò từ template Platform (họ [Nygard ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) / [MADR](https://adr.github.io/madr/)).
> **Cách dùng:** copy phần từ dấu `---` thứ hai trở xuống → `ADR-NNN-yyyy-MM-dd-slug.md` (mã NNN lấy ở dòng cuối [README.md](README.md)), điền nội dung, xoá mục *(tuỳ chọn)* không dùng, thêm **một dòng** vào bảng index + tăng "mã kế tiếp" trong **cùng commit**.

---

## Quy ước (bắt buộc — phần này KHÔNG copy vào ADR mới)

### Tên file & trạng thái — theo repo, KHÔNG theo Platform

- Tên file: `ADR-NNN-yyyy-MM-dd-slug.md` — **mã `ADR-NNN` bất biến**, cấp tuần tự, không tái sử dụng. Ngày = ngày **tạo**, không đổi.
- **Trạng thái sống ở [README.md](README.md)** (🟡 Doing · ⚪ Todo · 🔴 Pending · 🟢 Done · 🟣 Cancel) — index là chân lý; dòng Trạng thái trong file chỉ là phụ, ghi mốc sự kiện ("chốt/PASS/mở lại ngày…"). **Không** dùng hệ Proposed/Accepted/Superseded và không gán nghĩa khác cho 🔴/🟡.
- ADR đã chốt **không rewrite** để đổi ý: đổi hướng nhỏ → thêm mục "Điều chỉnh yyyy-MM-dd" (khuôn ADR-012 §7); đổi hẳn → ADR mới + index đánh 🟣 Cancel kèm ghi "ADR nào thay, kế thừa gì".
- Cross-ref bằng **mã**: `ADR-014`, `ADR-020 QĐ-11` — không dựa vào tên file.

### Hệ mã mục — theo VAI TRÒ, không theo chủ đề

Trong một ADR, mọi hàng bảng dùng đúng bộ prefix này, **không chế prefix mới** (không `M` = ma sát, `R` = lộ trình, `E` = EF…):

| Prefix | Vai trò | Ví dụ |
|---|---|---|
| **P** | Problem / ma sát / lực kéo | P1, P2 |
| **C** | Constraint — ràng buộc không đàm phán trong ADR này | C1 |
| **O** | Option — phương án cân nhắc, trước khi chọn | O1 |
| **QĐ** | Quyết định đã chọn (khớp 20+ ADR hiện có; không dùng `D`) | QĐ-1 |
| **Q** | Câu hỏi chốt với chủ repo | Q1 |
| **T** | Điểm xác minh / test | T1 |

Phase triển khai đánh số riêng (`Bước 1`, `Đợt A`…) — không trùng nghĩa với prefix trên. ADR cũ dùng prefix lệch chuẩn thì **giữ nguyên** (mã đã được tham chiếu), chỉ ADR mới theo bảng này.

### Xác minh — bắt buộc khi ADR kéo theo thay đổi file

Mỗi hàng T phân loại theo một trong ba: **Smoke** (luồng chính chạy — luôn có ≥1) · **Regression** (thứ cũ không gãy — luôn có; trong repo này thường là `npm test` + `gen:check` + `link:check` 0 gãy mới + grep tàn dư = 0) · **Mới** (test canh invariant mới — chỉ khi cần). Đụng `rules.json`/`lib/*.js` ⇒ vòng bắt buộc `gen → test → gen:check`. **Không chuyển 🟢 Done khi còn hàng T chưa xanh.** Việc chỉ máy không kiểm được (smoke interactive, chạy Cursor thật) → ghi rõ "chủ repo tự chạy".

### Một ADR = một quyết định — có ngoại lệ

Mặc định một ADR một quyết định chính; việc phái sinh → ADR riêng, link ở **Nối tiếp**. Ngoại lệ hợp lệ: **ADR-đợt** (khuôn ADR-020/022) gom nhiều QĐ-n của cùng một đợt tái cấu trúc — chấp nhận khi các QĐ chỉ có nghĩa khi đi cùng nhau.

---

# {Tiêu đề: quyết định + phạm vi, một dòng}

| | |
|---|---|
| **Ngày** | yyyy-MM-dd |
| **Trạng thái** | {mốc sự kiện — "đề xuất, chờ Confirm §5" / "chốt yyyy-MM-dd" — trạng thái việc xem [README index](README.md)} |
| **Phạm vi** | {ADR này quyết cái gì, đụng folder/module nào} |
| **Ngoài phạm vi** | {cố ý không làm ở đây; trỏ ADR khác nếu có} *(tuỳ chọn)* |
| **Nối tiếp** | {ADR/tài liệu liên quan, dạng link} |
| **Mục đích** | {một câu: ADR tồn tại để ghi lại điều gì} |
| **Ảnh hưởng** | {file/vùng bị chi phối — ADR trỏ xuống file, file KHÔNG trỏ ngược} |

---

## §1. Bối cảnh

{Hiện trạng + điều gì vừa thay đổi khiến phải quyết. Dẫn số liệu/grep/docs đã xác minh, kèm ngày đọc nếu nguồn ngoài.}

## §2. Vấn đề

| # | Vấn đề | Hệ quả |
|---|---|---|
| P1 | … | … |

## §3. Ràng buộc

| # | Ràng buộc |
|---|---|
| C1 | {điều KHÔNG mở lại trong ADR này — tham chiếu QĐ cũ bằng mã} |

## §4. Phương án *(tuỳ chọn — nên có khi có trade-off thật)*

| # | Phương án | Ưu | Nhược | |
|---|---|---|---|---|
| O1 | … | … | … | ❌ |
| O2 | … | … | … | ✅ chọn |

## §5. Quyết định

| # | Quyết định | Chi tiết |
|---|---|---|
| QĐ-1 | … | … |

{Sơ đồ / inventory move-file nếu cần.}

## §6. Confirm *(bắt buộc trước khi thi hành)*

| # | Câu hỏi | Trả lời |
|---|---|---|
| Q1 | Duyệt QĐ-1…n? | {trống → chủ repo điền} |

Chốt xong: ghi ngày vào **Trạng thái** + cập nhật ghi chú index.

## §7. Việc triển khai

| Bước | Việc | Done khi | Phụ thuộc |
|---|---|---|---|
| 1 | … | … | Q1 |

## §8. Xác minh (định nghĩa xong)

| # | Loại | Case | Expect | Trạng thái |
|---|---|---|---|---|
| T1 | Smoke | … | … | 🔴 |
| T2 | Regression | `npm test` + `gen:check` + `link:check` 0 gãy mới | xanh | 🔴 |

Icon: 🟢 xong · 🟡 có sẵn, cần giữ xanh · 🔴 chưa có. **Không 🟢 Done khi còn T đỏ.**

## §9. Hệ quả

| Hướng | Hệ quả |
|---|---|
| Tốt | … |
| Xấu / chi phí | … |
| Trung lập | … |

<!--
Nhắc nhanh khi viết ADR mới:
1. Mã NNN lấy từ dòng cuối README.md; thêm dòng index + tăng mã kế tiếp CÙNG commit.
2. Chỉ prefix P / C / O / QĐ / Q / T — không chế prefix theo chủ đề.
3. Trạng thái việc sống ở index, không ở file này.
4. Đụng rules.json / lib ⇒ gen → test → gen:check cả ba xanh.
5. Chốt rồi không rewrite — thêm mục "Điều chỉnh yyyy-MM-dd" hoặc ADR mới.
6. Ảnh hưởng: ADR trỏ xuống file; file không trỏ ngược về ADR.
-->
