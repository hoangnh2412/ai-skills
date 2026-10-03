# Workflow: Nhánh mock tạm — và đổi sang API thật

**Nhánh tuỳ chọn, không nằm trong luồng mặc định.** Mock là chỗ đứng tạm cho code thật khi backend chưa chạy — **không phải prototype**. Prototype / wireframe là DOC-19 của [analyst](../../../../analyst/README.md), làm trước SRS.

## Điều kiện vào nhánh

| Tình huống | Làm gì |
|---|---|
| DOC-12 **đã có** contract (method · path · request · response · enum) nhưng backend chưa chạy được | Được vào nhánh — **sau khi người duyệt hoãn** (bước 1) |
| DOC-12 **chưa có** hoặc còn đang bàn | **Dừng** — không viết UI trên dữ liệu giả; hỏi một lượt ở cổng readiness |
| Cần màn hình để khách / BA duyệt luồng | Không phải việc của nhánh này — DOC-19 của analyst |

## Checklist

```text
- [ ] 1. Người duyệt hoãn backend; ghi nợ: endpoint nào mock, chờ gì
- [ ] 2. types/ theo DOC-12 — như luồng mặc định
- [ ] 3. Copy nhánh mock: mocks/ · constants/ · services/{feature}Mock.ts + khối export
- [ ] 4. Page gọi mock* thay call* — lint M1 cảnh báo từng chỗ
- [ ] 5. Backend chạy: đổi lại call*, xoá mock, CI xanh
```

## Bước 1 — Hoãn có ghi nợ

Hỏi người duyệt: *"DOC-12 §x đã có, backend chưa chạy — làm UI trước trên mock tạm?"*. Đồng ý ⇒ một dòng trong `memory/doc-debt.md` (hoặc ticket) của dự án:

```text
{Feature}: list/create/update chạy mock — chờ backend deploy endpoint theo DOC-12 §x — người duyệt: …
```

Không ghi nợ ⇒ không ai nhớ gỡ.

## Bước 3 — Copy nhánh mock

| Template | Đích |
|---|---|
| [templates/mock/mocks/get-{feature}-list.json](../templates/mock/mocks/get-{feature}-list.json) | `mocks/get-{feature}-list.json` — sửa thành **đúng mẫu response trong DOC-12** |
| [templates/mock/mocks/index.ts](../templates/mock/mocks/index.ts) | `mocks/index.ts` |
| [templates/mock/constants/](../templates/mock/constants/) | `constants/` — feature đã có `constants/index.ts` thì chỉ thêm dòng export |
| [templates/mock/services/{feature}Mock.ts](../templates/mock/services/{feature}Mock.ts) | `services/{feature}Mock.ts` |

Thêm vào cuối `services/index.ts`:

```ts
// Nhánh mock tạm — xoá cùng {feature}Mock.ts khi backend chạy
export {
  mockGet{Feature}List,
  mockGet{Feature},
  mockCreate{Feature},
  mockUpdate{Feature},
  mockDelete{Feature},
  mockSet{Feature}Status,
  mockReset{Feature}s,
} from './{feature}Mock'
```

Mock giữ **đúng chữ ký** `call*` và trả đúng hình sau unwrap. Lỗi nghiệp vụ (trùng mã, không tìm thấy) `throw new Error('…')`. Dữ liệu sống trong bộ nhớ — tải lại trang là mất, đúng ý đồ. **Không** export `mock*` / `FAKE_*` qua barrel feature.

## Bước 4 — Đổi chỗ gọi trong page

Đổi **tên hàm**, giữ nguyên phần còn lại (unwrap nhận cả hai):

```ts
const result = unwrap{Feature}ListResult(await mockGet{Feature}List(query))   // tạm — M1
```

`npm run lint` hiện cảnh báo **M1** ở mỗi import `mock*` trong `pages/` — đó là danh sách việc phải gỡ, không phải lỗi cần tắt.

## Bước 5 — Đổi sang API thật

```text
1. Đối chiếu types/ với DOC-12 bản chốt — sửa kiểu trước, tsc chỉ chỗ lệch
2. Page: mock{…} → call{…} ở mọi chỗ gọi
3. Xoá services/{feature}Mock.ts, khối mock trong services/index.ts, constants/fake{Feature}s.ts, mocks/
4. CI=true npm run lint — M1 sạch (CI coi M1 là lỗi: còn mock thì không merge được)
5. Chạy thật qua proxy — đóng dòng nợ ở bước 1
```

## Page có sẵn của kit chạy mock

Một số page của kit mặc định dùng mock (vd. `RoleListPage`, file manager, import). Nối API thật **không sửa kit** — truyền `callback.*.onSubmit` từ host: [customization › role-list-real-api](../../minipower-frontend-customization-react/templates/examples/role-list-real-api.tsx).

## Anti-patterns

| ❌ | Vì sao |
|---|---|
| Mock khi DOC-12 chưa có | Viết UI trước tiền đề — đoán contract, làm lại khi DOC-12 ra |
| Dùng mock làm prototype cho khách duyệt | Prototype là DOC-19 của analyst; code thật trên dữ liệu giả không phải chỗ chốt luồng |
| Mock trả hình khác DOC-12 (mảng trần thay `{ items, total }`) | Đổi sang API là vỡ phân trang |
| Export `mock*` / `FAKE_*` qua barrel feature | Host vô tình dùng mock ở production |
| Tắt M1 hoặc thêm `eslint-disable` để CI xanh | Mock lọt production — đúng thứ M1 sinh ra để chặn |
| Bật/tắt mock bằng biến môi trường rải trong page | Hai đường code, lệch dần; đổi chỗ gọi một lần là đủ |
