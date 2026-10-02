# Truy vấn danh sách — tham số ↔ `PagedListRequest` của backend

Không load mặc định — mở khi dựng bộ lọc / sắp xếp / phân trang gửi lên API. Luật hành động ở [SKILL.md](../SKILL.md).

## 1. Tham số query

`Get{Feature}ListParams` gửi qua `http.get(BASE, { params })` — axios đặt thành query string:

| Tham số | Kiểu | Ví dụ | Ghi chú |
|---|---|---|---|
| `page` | number | `1` | Bắt đầu từ 1 |
| `size` | number | `10` | Kích thước trang (`?size=`), không phải `pageSize` |
| `search` | string | `"nguyen"` | Tìm tự do — backend quyết cột nào; bỏ khi rỗng |
| `filter` | string | xem mục 2 | **Chuỗi JSON** của cây điều kiện, không phải object |
| `sort` | string | `"UpdatedAt:desc,Code:asc"` | `Property:asc|desc`, nhiều cột cách dấu phẩy |
| `columns` | string | `"Id,Code,Name"` | Chỉ lấy các property này |
| Lọc riêng của feature | tuỳ DOC-12 | `status=1` | Chỉ gửi khi có giá trị — `buildQuery` bỏ `'all'` |

Tên property trong `filter` / `sort` / `columns` là tên **phía backend** (thường PascalCase) — lấy từ DOC-12, không suy ra từ tên trường JSON camelCase.

## 2. Cây điều kiện `filter` (FilterParser)

```text
Lá      [field, operator, value]                   ["Status", "=", 1]
Nút     [trái, "and" | "or", phải]                 [["Status","=",1], "and", ["Name","contains","an"]]
```

Gửi: `filter: JSON.stringify(ast)` — dùng `toFilterJson(ast)` của kit (kiểm giới hạn trước khi stringify, vượt là `throw`).

| Toán tử | Giá trị |
|---|---|
| `=` · `!=` · `<>` · `>` · `<` · `>=` · `<=` | chuỗi / số / boolean |
| `contains` · `notcontains` · `startswith` · `endswith` | chuỗi |
| `between` | mảng **đúng 2** phần tử `["2026-01-01","2026-01-31"]` |
| `in` | mảng `["A","B"]` |
| `isnull` · `isnotnull` | `null` |

Giới hạn phía backend, kit kiểm trước bằng `validateFilterAst`: sâu tối đa **8** tầng, tối đa **50** điều kiện.

Helper có sẵn trong `@platform/core`:

| Hàm | Việc |
|---|---|
| `toFilterJson(ast)` | AST → chuỗi JSON (`undefined` khi `null`) |
| `toPagedListParams({ page, size, ast, sort, columns })` | Dựng đủ bộ tham số `PagedListQueryParams` |
| `parseFilterInput(input)` | Chuỗi JSON / AST → AST (đọc lại từ URL / state) |
| `validateFilterAst(ast)` | `{ ok: true }` hoặc `{ ok: false, message }` |
| `QueryBuilder` + `useQueryBuilderState` | UI dựng bộ lọc nâng cao (field catalog từ API) |

## 3. Kết quả danh sách

`unwrap{Feature}ListResult` chấp nhận mọi dạng dưới, trả về `{ items, total, page?, size? }`:

| Body | Hiểu thành |
|---|---|
| `[ … ]` | `items` = mảng, `total` = độ dài |
| `{ items, total, page, size }` | như trên |
| `{ data: [ … ], totalCount, pageSize }` | `items` ← `data`, `total` ← `totalCount`, `size` ← `pageSize` |

Backend bọc envelope một lớp nữa (vd. `{ data: { items, total } }`) ⇒ thêm `unwrapData` trong hàm unwrap theo đúng DOC-12 — hàm hiện tại **không đoán** lớp thứ hai.

## 4. Sắp xếp / lọc cột trên bảng

`DataTable.Sort` / `DataTable.Filter` của PrimeReact chạy **trên dữ liệu đang có trong bảng** — với phân trang server đó chỉ là trang hiện tại. Sort / lọc thật: giữ state ở page, đưa vào `sort` / `filter`, gọi lại API.
