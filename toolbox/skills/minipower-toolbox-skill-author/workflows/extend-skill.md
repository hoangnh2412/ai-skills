# Workflow: Mở rộng / soát skill có sẵn

Áp dụng khi **đã có** skill phủ việc, cần thêm một biến thể — hoặc khi một skill cũ lệch chuẩn.

Mọi quyết định (loại biến thể, chỗ đặt, sửa gì / không sửa gì, câu chữ) đi qua [SKILL.md § Gate người](../SKILL.md#gate-người--xác-nhận-trước-khi-viết) — đề xuất, dừng, chờ xác nhận, rồi mới ghi.

## Checklist — thêm biến thể

```text
- [ ] 0. Đã hỏi và được xác nhận mọi quyết định còn mở của lượt này
- [ ] 1. Xác định loại biến thể: workflow / provider / pattern / template
- [ ] 2. Kiểm tra không trùng với biến thể đã có
- [ ] 3. Viết file biến thể — MỘT file, không lặp orchestrator
- [ ] 4. Thêm dòng vào bảng tương ứng trong SKILL.md
- [ ] 5. Cập nhật README.md nếu người cần biết
- [ ] 6. Validate: npm test + npm run link:check
```

## Bước 1 — Loại biến thể

| Cần gì | Đặt vào | Ví dụ trong repo |
|---|---|---|
| Một chuỗi bước có thứ tự | `workflows/{việc}.md` | `minipower-backend-entityframework-dotnet/workflows/init.md` |
| Một cách cấu hình **hạ tầng** cho cùng một API | `providers/<name>/SKILL.md` | Redis / Memory cho `minipower-backend-caching-dotnet` |
| Một **mô hình** loại trừ nhau, chọn một là bỏ cái kia | `patterns/<name>/SKILL.md` | single-db / separate-tenant-db của EF |
| File copy nguyên vào repo đích | `templates/…` | `.editorconfig`, `Directory.Build.props.xml` |
| Giải thích nền dài, ít khi cần | `reference/*.md` | `reference/setup.md` của EF |

`providers/` và `patterns/` **không dùng chung một skill** — chọn một, theo bản chất biến thể. Chi tiết: [reference/anatomy.md § providers vs patterns](../reference/anatomy.md#providers-vs-patterns).

## Bước 2 — Không trùng

Đọc bảng provider/pattern hiện có trong `SKILL.md` trước. Hai file cấu hình **cùng một thứ** bằng hai cách là nguồn mâu thuẫn — gộp, đừng thêm.

## Bước 3 — Viết file biến thể

Theo [templates/provider-SKILL.md.tpl](../templates/provider-SKILL.md.tpl). Ba phần: config → registration → validate. Ngắn.

**Không** lặp lại quy tắc cốt lõi, packages, hay bảng workflow của orchestrator — agent đã đọc `SKILL.md` trước khi tới đây.

`name` của provider con: `<skill-cha>-<provider>` (ví dụ `minipower-backend-healthcheck-dotnet-postgresql`), vẫn ≤64 ký tự.

## Bước 4 — Nối vào orchestrator

Thêm một dòng vào bảng Providers/Patterns của `SKILL.md`. Một biến thể không có dòng trong bảng = agent không bao giờ mở tới.

## Bước 6 — Validate

```bash
cd sdlc/hooks && npm test && npm run link:check
```

---

## Soát skill có sẵn

Dùng khi nghi một skill cũ lệch chuẩn. Soát theo thứ tự **đắt dần**, dừng khi hết vấn đề. Phát hiện lệch → nêu đề xuất sửa, **chờ xác nhận**, rồi mới ghi — không tự vá.

| # | Soát | Sai thì sao | Ai bắt được |
|---|---|---|---|
| 1 | `name` ≡ tên thư mục · kebab · ≤64 · đúng tiền tố module | Loader không khớp skill | `npm test` |
| 2 | `description` tồn tại | Lá-rời không bao giờ được gọi | `npm test` |
| 3 | Có dòng trong bảng hub `{module}/README.md` | Người không tìm thấy | `npm test` |
| 4 | Link trong skill không gãy | Agent đọc vào chỗ trống | `npm run link:check` |
| 5 | `description` có WHAT + WHEN, chứa từ khoá người dùng thật sự gõ | Kích hoạt sai lúc hoặc không kích hoạt | ❌ người |
| 6 | `README.md` có mục *"Không dùng cho"* | Hai skill ăn tranh việc nhau | ❌ người |
| 7 | SKILL.md là mục lục, không phải sách | Tốn context mỗi lần gọi | ❌ người |
| 8 | Chữ *bắt buộc* nào cũng có cổng máy phía sau | Chữ bắt buộc mất giá | ❌ người |

Bốn dòng đầu chạy được ngay:

```bash
cd sdlc/hooks && npm test && npm run link:check
```

Bốn dòng cuối phải đọc bằng mắt — đó là lý do chúng hay hỏng.

## Anti-patterns

| ❌ | Vì sao |
|---|---|
| Thêm skill mới trong khi chỉ cần thêm một `workflows/*.md` | Càng nhiều lá, `description` càng chồng nhau, loader càng chọn sai |
| Provider lặp lại toàn bộ orchestrator | Sửa một chỗ, quên chỗ kia — hai bản lệch nhau |
| Vừa `providers/` vừa `patterns/` trong một skill | Người đọc không biết mở thư mục nào |
| Load cả thư mục `providers/` cho một task | Đốt context; mỗi task chỉ cần một file |
| Sửa nội dung skill trong repo product | Nguồn là `{module}/skills/` ở minipower — sửa ở đó rồi sync lại |
