---
name: reactjs-source-code-reading
description: Phương pháp luận đọc và reverse-engineer ReactJS source code theo user flow, architecture, component tree, state, data flow và runtime behavior.
---

# ReactJS Source Code Reading Skill

## 1. Mục tiêu

Skill này cung cấp phương pháp luận để đọc và reverse-engineer một ReactJS codebase, đặc biệt phù hợp với SPA, SSR hoặc monorepo frontend lớn.

Mục tiêu không phải là đọc toàn bộ source code theo thứ tự file, mà là xây dựng mô hình hiểu hệ thống theo chuỗi:

```text
Context
  ↓
Architecture
  ↓
Module
  ↓
User / Execution Flow
  ↓
Implementation
  ↓
Runtime / Data / Side Effects
  ↓
Knowledge Model
```

Nguyên tắc cốt lõi:

> Không đọc code theo file. Hãy đọc behavior theo user flow.

JSX là hình chiếu của state lên UI. Hành vi nghiệp vụ thường nằm ở route, event handler, hook, store và API client — không nằm ở thứ tự thẻ trong cây JSX.

---

## 2. Nguyên tắc chung

### 2.1. Xác định scope trước khi đọc

Trước khi mở source, xác định câu hỏi cần trả lời:

- Ứng dụng này cho phép người dùng làm gì?
- Một user flow cụ thể chạy như thế nào?
- Màn hình / tính năng nằm ở đâu?
- State sống ở đâu?
- Data đi từ API đến UI qua những đâu?
- Mutation nào làm đổi dữ liệu trên server?
- Sau mutation, UI được cập nhật bằng cơ chế nào?
- External system nào được gọi từ browser?
- Auth và phân quyền được thể hiện ở đâu trên client?
- Loading, empty, error và retry được xử lý như thế nào?

Không cố gắng hiểu toàn bộ repository nếu câu hỏi chỉ liên quan đến một flow hoặc một feature.

### 2.2. Phân biệt fact và inference

Trong quá trình reverse-engineering, phân loại thông tin thành:

**Observed** — thông tin trực tiếp quan sát được từ source.

**Documented** — thông tin được mô tả trong README, ADR, comment, OpenAPI, storybook hoặc cấu hình deploy.

**Inferred** — kết luận được suy ra từ nhiều bằng chứng. Gắn nhãn `[Suy luận]`.

**Unknown** — chưa đủ bằng chứng để kết luận. Gắn nhãn `[Chưa xác minh]`.

Không chuyển `Inferred` hoặc `Unknown` thành fact.

Ẩn một nút trên UI không chứng minh server từ chối thao tác đó. `useEffect` gọi API không chứng minh đó là đường data chính nếu route loader hoặc Server Component đã fetch trước.

---

## 3. Mô hình đọc source 6 tầng

```text
L0 Context
    ↓
L1 Architecture
    ↓
L2 Module
    ↓
L3 Execution Flow
    ↓
L4 Implementation
    ↓
L5 Runtime / Data / Side Effects
```

### L0 — Context

Trả lời:

```text
Ứng dụng làm gì?
Ai sử dụng?
Màn hình chính là gì?
Input của người dùng là gì?
Output người dùng nhìn thấy là gì?
Business capability nào được expose trên UI?
API / BFF / realtime nào được gọi?
```

Kết quả:

```text
System Context
├── Users / Roles nhìn từ UI
├── Screens / Routes
├── Business Capabilities
├── API / BFF
├── Auth Provider
├── Realtime Channels
├── Analytics / Error Reporting
└── Hosting / CDN
```

---

## 4. L1 — Architecture

Khảo sát repository trước khi đọc component.

Với ReactJS, ưu tiên nhận diện toolchain và kiểu ứng dụng:

```text
package.json
pnpm-workspace.yaml
package-lock.json / yarn.lock / pnpm-lock.yaml
tsconfig.json / jsconfig.json
vite.config.*
next.config.*
rsbuild.config.*
webpack.config.*
remix.config.*
app/
pages/
src/
public/
```

Xác định kiểu runtime trước khi đọc flow:

```text
SPA (Vite, CRA, Rsbuild, Webpack)
Next.js Pages Router
Next.js App Router
Remix / React Router framework mode
Module Federation / micro-frontend
Monorepo (apps/* + packages/*)
```

Tìm entry và lớp bọc ứng dụng:

```text
src/main.tsx
src/index.tsx
src/App.tsx
app/layout.tsx
app/page.tsx
pages/_app.tsx
pages/_document.tsx
entry.client.tsx
entry.server.tsx
```

Tìm provider gốc — đây là bản đồ phụ thuộc của cả app:

```text
BrowserRouter / RouterProvider
QueryClientProvider
Provider (Redux)
AuthProvider
ThemeProvider
I18nProvider
ErrorBoundary
```

Tìm entry của behavior:

```text
Route / page
Layout
Loader / action
Server Component
Server Action
Route Handler (route.ts)
Event handler (onClick, onSubmit, onChange)
Form action
Middleware (Next.js middleware.ts)
```

Xác định:

- Routing
- Feature / page modules
- Design system / shared UI
- State (client store, server cache, URL, form)
- API / BFF client
- Auth
- i18n
- Observability
- Build và deploy

Kết quả cần đạt: **Architecture Map**.

Ví dụ SPA:

```text
Browser
  ↓
index.html + JS bundle
  ↓
main.tsx providers
  ↓
Router
  ↓
Page / Feature
  ↓
Hooks
  ↓
API client
  ↓
Backend
```

Ví dụ Next.js App Router:

```text
Request
  ↓
middleware.ts
  ↓
layout.tsx (Server)
  ↓
page.tsx (Server Component)
  ↓
"use client" boundary
  ↓
Client hooks / event handlers
  ↓
Server Action hoặc fetch tới BFF
```

---

## 5. L2 — Module

Xác định responsibility của từng app, package, feature.

Ví dụ monorepo:

```text
apps/
├── web
└── admin
packages/
├── ui
├── api-client
├── auth
└── config
```

Ví dụ feature-sliced trong một app:

```text
src/
├── app/            # bootstrap, router, providers
├── pages/          # route-level composition
├── features/       # use-case: create-invoice, invoice-list
├── entities/       # invoice, customer
├── shared/         # ui, api, lib
└── widgets/
```

Không mặc định mọi repo dùng cùng một cách cắt folder. Đọc `package.json` workspaces và import thực tế.

Với mỗi module, xác định:

```text
Responsibility
Public exports
Dependencies
Entry Points (route, exported component, hook)
Outputs (UI, navigation, mutation, event)
External Dependencies
```

Đồng thời đặt câu hỏi:

> Module này không nên chịu trách nhiệm về việc gì?

Điều này giúp phát hiện page vừa fetch, vừa chứa rule, vừa gọi analytics, vừa format tiền — boundary đã vỡ.

---

## 6. L3 — Execution Flow

Đây là tầng quan trọng nhất.

Không bắt đầu bằng việc đọc một component lớn từ trên xuống dưới.

Hãy chọn một user flow và trace:

```text
Trigger
  ↓
Route / Screen
  ↓
Data read
  ↓
Decision
  ↓
Render
  ↓
User action
  ↓
Mutation / Navigation / Side effect
  ↓
UI cập nhật
```

Ví dụ tạo hóa đơn:

```text
/invoices/new
    ↓
CreateInvoicePage
    ↓
useCustomersQuery()
    ↓
InvoiceForm
    ↓
onSubmit → useCreateInvoiceMutation()
    ↓
POST /api/invoices
    ↓
invalidateQueries(["invoices"])
    ↓
navigate("/invoices/:id")
```

Phân biệt hai thì:

```text
Thì đọc (lần đầu vào màn)
URL → loader/query → render

Thì ghi (người dùng thao tác)
event → handler → mutation → cache/navigation → render lại
```

Đọc lẫn hai thì sẽ gán nhầm `useEffect` thành xương sống của flow.

---

## 7. Trace theo 5 câu hỏi

### 7.1. Entry

Tìm thứ người dùng hoặc trình duyệt chạm vào trước:

```text
path / search params
Route element
page.tsx / pages/*.tsx
loader / clientLoader
getServerSideProps / getStaticProps
Server Component fetch
Link / navigate / redirect
onClick / onSubmit / onChange
Form action / Server Action
```

Câu hỏi:

```text
Ai trigger? (người dùng, URL, redirect, timer, websocket)
Input là gì? (params, search, form, props)
Màn hình nào mount?
Data nào đã có sẵn trước khi component client chạy?
```

### 7.2. Transformation

Trace hình dạng data đổi qua các biên:

```text
HTTP JSON
    ↓
DTO / schema (zod, io-ts)
    ↓
View model
    ↓
Props
    ↓
JSX
```

và chiều ngược:

```text
Form values
    ↓
Mapper / serializer
    ↓
Request body
```

Tìm:

```text
select trong useQuery
createSelector (Reselect)
mapXxx
adapter
schema.parse
formatter (date, money, i18n)
normalizr / entity adapter
```

Không dừng ở component nhận `data`. Tiếp tục trace query function và mapper.

### 7.3. Decision

Tìm chỗ rẽ nhánh mà người dùng nhìn thấy hoặc không nhìn thấy:

```text
if / else trong render
conditional render (&&, ternary)
early return
route guard / ProtectedRoute
<Navigate> / redirect()
feature flag
role / permission check
enabled trên useQuery
disabled / hidden field
schema validation
```

Với mỗi decision:

```text
Condition
    ↓
Possible Branches
    ↓
Ý nghĩa với người dùng
    ↓
Chỉ là UI hay có kiểm tra tương ứng ở server?
```

### 7.4. Side Effect

Tìm việc làm thay đổi thế giới bên ngoài render thuần:

```text
HTTP mutation
router navigation
queryClient.invalidateQueries / setQueryData
dispatch(store)
localStorage / sessionStorage / cookie / IndexedDB
document title, scroll, focus
analytics.track
errorReporter.capture
websocket send
file download
clipboard
window.open
```

Ví dụ:

```text
Submit invoice
├── POST /api/invoices
├── invalidate ["invoices"]
├── navigate /invoices/:id
├── toast success
└── analytics "invoice_created"
```

`useEffect` là một nơi side effect xảy ra, không phải nơi duy nhất. Event handler, loader, action và Server Action cũng là side effect.

### 7.5. Error / Recovery

Tìm cả trạng thái lỗi, không chỉ nhánh thành công:

```text
Error Boundary
error.tsx / global-error.tsx
Suspense fallback / loading.tsx
isLoading / isFetching / isError
isPending trên mutation
toast / inline field error
retry / refetch
onError
HTTP 401 → refresh token → retry hoặc logout
empty state
```

Kiểm tra failure flow, ví dụ:

```text
Query thành công
    ↓
Mutation fail
    ↓
Cache không bị ghi đè
    ↓
Form giữ nguyên giá trị
```

hoặc:

```text
Mutation thành công
    ↓
invalidateQueries fail / refetch cũ
    ↓
UI vẫn hiện data cũ
```

Chỉ kết luận behavior từ source và cấu hình thực tế (`retry`, `staleTime`, `ErrorBoundary` bọc ở đâu).

---

## 8. L4 — Implementation

Sau khi hiểu flow mới đọc sâu implementation.

Đọc theo semantic blocks, không đọc JSX như một kịch bản chạy từ trên xuống:

```tsx
const customers = useCustomersQuery();

const form = useForm({ resolver: invoiceSchema });

const onSubmit = form.handleSubmit(async (values) => {
  const created = await createInvoice.mutateAsync(toRequest(values));
  navigate(`/invoices/${created.id}`);
});
```

Với mỗi block:

```text
What does it do?
Why is it needed?
What data does it consume?
What data does it produce?
Does it render, or does it perform a side effect?
Can it fail?
What does the user see while it is pending?
```

Nếu chưa xác định được "Why" từ source, đánh dấu `Unknown`.

Khi đọc một component lớn, tách ba phần:

```text
Data vào (props, hooks, params)
Quyết định (guard, map, filter)
Hình chiếu (JSX)
```

Business rule nằm ở hai phần đầu. JSX cho biết rule đó được hiển thị thế nào.

---

## 9. L5 — Runtime / Data / Side Effects

Map source với runtime thực tế:

```text
Browser
    ↓
HTML shell + JS/CSS bundle (CDN)
    ↓
React root
    ↓
Router + providers
    ↓
API / BFF
```

hoặc:

```text
Node (Next.js / Remix server)
├── Server Components / loaders
├── Server Actions / route handlers
└── Browser bundle cho client boundary
```

Tìm cấu hình runtime trong:

```text
.env
.env.local
.env.production
VITE_*
NEXT_PUBLIC_*
next.config.* env / rewrites / headers
vite.config.ts define / proxy
public/config.js (runtime config)
window.__ENV__
Docker / Nginx
Vercel / Netlify / Kubernetes
```

Phân biệt config **dính vào bundle lúc build** và config **đọc lúc chạy**. `NEXT_PUBLIC_` và `VITE_` lộ ra browser. Không ghi giá trị secret vào tài liệu.

Không giả định mọi thứ gọi được là REST từ browser. Có thể có BFF, rewrite proxy, Server Action hoặc GraphQL cùng tồn tại.

---

## 10. React-specific reading order

Ưu tiên:

```text
1. README / documentation
2. package.json (scripts + dependencies)
3. Workspace / lockfile nếu là monorepo
4. Bundler config (vite, next, rsbuild, webpack)
5. Entry: main.tsx / index.tsx / app/layout.tsx
6. Providers
7. Router / file-based routes
8. Auth guard / middleware
9. Một page của flow đang xét
10. Feature hooks
11. API client / query functions
12. Store / server-cache keys
13. Form schema
14. Shared UI chỉ khi flow đụng tới
15. i18n keys nếu nhãn là bằng chứng nghiệp vụ
16. Env và proxy
17. Tests của flow đó
18. E2E
19. CI / Docker / hosting
```

Đọc `package.json` để biết họ công cụ trước khi grep mù:

```text
react-router / @tanstack/react-router / next / remix
@tanstack/react-query / swr / @reduxjs/toolkit / zustand / jotai / apollo
react-hook-form / formik
zod / yup
axios / ky / graphql-request
msw / vitest / jest / @testing-library/react / playwright / cypress
```

---

## 11. Composition — component, hook, provider

React không có DI container kiểu .NET. Phụ thuộc được nối bằng **import**, **props**, **context** và **provider**.

Trace:

```text
Page
    ↓
Feature container
    ↓
Hook (useCreateInvoice)
    ↓
Presentational component
    ↓
Design-system primitive
```

và:

```text
Provider đặt ở root hay ở route?
Context value là state hay chỉ là service?
Ai là owner của state — page, hook, hay store?
```

Tìm:

```text
createContext
useContext
children / render props
cloneElement (hiếm, đáng chú ý)
forwardRef
props callback: onChange, onSubmit, onSuccess
```

Đặc biệt chú ý:

```text
Một hook bị gọi ở nhiều nơi — behavior không nằm trong một component
Provider bọc thiếu route — context undefined
Default context che mất lỗi thiếu provider
Props drilling xuyên module — boundary chưa được đặt tên
```

Không coi component cha là implementation của behavior nếu logic nằm trong hook được import từ feature khác.

---

## 12. Render pipeline

Với một lần cập nhật UI:

```text
setState / dispatch / query cache / router state / props
    ↓
Render (function component chạy lại)
    ↓
Reconcile
    ↓
Commit DOM
    ↓
useLayoutEffect
    ↓
Paint
    ↓
useEffect
```

Tìm:

```text
useState
useReducer
useSyncExternalStore
useMemo
useCallback
memo
useLayoutEffect
useEffect
startTransition
useDeferredValue
Suspense
```

Kiểm tra:

```text
State nào làm component này render lại?
Giá trị nào là derived (tính khi render) chứ không lưu thêm?
useEffect đang đồng bộ state dẫn xuất — dấu hiệu lệch mô hình?
memo/useCallback có chặn update cần thiết không?
Key của list có đổi identity của row không?
```

Khi flow phụ thuộc vào thứ tự effect, phải ghi nhận effect nào chạy sau paint và effect nào đọc DOM trước paint (`useLayoutEffect`).

Không đọc thân function component như một transaction. Thân function chạy lại nhiều lần, có thể chạy rồi bị bỏ (Strict Mode, concurrent render). Side effect trong thân render là dấu hiệu cần ghi lại, không phải pattern để suy ra business rule.

---

## 13. Routing

Xác định router thực tế rồi mới trace URL.

React Router:

```text
createBrowserRouter
Route
Outlet
loader / action
Navigate
useParams / useSearchParams
useNavigate
```

TanStack Router:

```text
createRoute
loader
validateSearch
beforeLoad
Link
```

Next.js Pages Router:

```text
pages/**/*.tsx
pages/api/**
getServerSideProps
getStaticProps
getInitialProps
next/router
```

Next.js App Router:

```text
app/**/page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
route.ts
middleware.ts
"use client"
redirect / notFound
searchParams / params (Promise ở bản mới)
```

Trace:

```text
URL
 ↓
Matcher / file convention
 ↓
Middleware / beforeLoad / guard
 ↓
Layout (data dùng chung)
 ↓
Loader hoặc Server Component fetch
 ↓
Page
 ↓
Nested outlet / children
```

Kiểm tra:

```text
Path params và search params — cái nào là nguồn sự thật?
Guard chạy ở middleware, loader, hay chỉ trong component?
Layout có fetch lại khi chuyển route con không?
Redirect xảy ra ở server hay client?
Parallel route / intercepting route (Next) có đổi màn hình người dùng thấy không?
```

Search param thường là state của màn danh sách (filter, page, sort). Bỏ qua URL sẽ dựng sai data flow.

---

## 14. State

Phân loại state trước khi đọc từng dòng. Trộn các loại này sẽ suy ra sai owner.

```text
URL state          path, search params
Local UI state     useState trong component
Lifted state       useState ở cha, truyền props
Context            dùng chung một cây con
Client store       Redux, Zustand, Jotai, Recoil
Server cache       React Query, SWR, RTK Query, Apollo
Form state         RHF, Formik, useState từng field
Ref                giá trị không kích render
Browser storage    localStorage, sessionStorage, IndexedDB, cookie
```

Với mỗi mẩu dữ liệu trên màn hình, trả lời:

```text
Nguồn sự thật là gì?
Ai được phép ghi?
Render nào đọc nó?
Sau F5 nó còn không?
```

Redux / Zustand — trace:

```text
UI event
 ↓
action / setter
 ↓
reducer / store
 ↓
selector
 ↓
component
```

Tìm `createSlice`, `createAsyncThunk`, middleware, `persist`, immer mutation.

React Query / SWR — xem mục 16. Đó là server state, không phải client store.

Context — kiểm tra value có đổi reference mỗi render không, và consumer nào thực sự cần nó. Context dùng cho dependency (theme, auth session) khác context dùng như store toàn cục.

---

## 15. Hooks và effects

Hook là đơn vị tái sử dụng behavior. Đọc hook như đọc một service nhỏ.

Custom hook thường giấu:

```text
fetch
subscription
form wiring
permission check
derived flags (canSubmit, isDirty)
kết hợp nhiều query
```

Trace:

```text
Component
 ↓
useInvoiceEditor()
 ↓
useQuery / useMutation / useForm / store
 ↓
giá trị trả về + hàm lệnh
```

`useEffect` — đặt câu hỏi trước khi coi nó là luồng chính:

```text
Effect này đồng bộ với hệ thống ngoài (subscribe, document title) hay đang bắt chước data flow?
Dependency array có đủ không?
Cleanup có chạy không (unsubscribe, abort)?
Effect có setState gây vòng render không?
Có race khi id đổi trước khi request cũ về không?
```

Dấu hiệu data flow bị đặt nhầm vào effect:

```tsx
useEffect(() => {
  fetchInvoice(id).then(setInvoice);
}, [id]);
```

Ghi nhận đây là đường fetch thực tế nếu không có loader/query nào khác. Không diễn giải nó thành "đúng kiến trúc".

`useEffectEvent`, `useLayoutEffect`, và subscribe trong `useSyncExternalStore` cần được đọc riêng: chúng không cùng thời điểm với effect thường.

Strict Mode ở development chạy effect hai lần. Không kết luận production gọi API hai lần chỉ vì thấy behavior đó lúc dev, trừ khi source không có cleanup/abort.

---

## 16. Data fetching và server state

Flow đọc:

```text
Route hoặc component
 ↓
useQuery / loader / Server Component / apollo query
 ↓
queryFn / fetch / axios / graphql
 ↓
API
 ↓
parse
 ↓
select / map
 ↓
UI
```

Flow ghi:

```text
onSubmit / action
 ↓
useMutation / fetch / server action
 ↓
API
 ↓
onSuccess: invalidate | setQueryData | navigate | toast
```

Tìm:

```text
useQuery / useInfiniteQuery / useSuspenseQuery
useMutation
queryKey
queryFn
enabled
staleTime / gcTime
placeholderData / initialData
select
prefetchQuery
invalidateQueries / setQueryData
useSWR
createApi (RTK Query)
useQuery (Apollo)
fetch trong Server Component
server action
```

Đặc biệt kiểm tra:

```text
Query key có chứa filter/page/tenant không?
Query có bị tắt bởi enabled không?
Request có AbortSignal không?
Pagination là page, cursor, hay infinite query?
Mutation có optimistic update và rollback không?
onSuccess có cập nhật đúng key đang hiển thị không?
Có chỗ nào fetch thủ công song song với cache, tạo hai nguồn sự thật?
```

Không suy luận contract API chỉ từ tên hook. Đọc URL, method, body và kiểu parse.

---

## 17. Form và user input

Form là execution flow riêng, không phải chi tiết implementation.

Xác định kiểu form:

```text
Controlled (value + onChange)
Uncontrolled (ref, defaultValue)
React Hook Form
Formik
Server Action + form action
File input
Field array
Wizard nhiều bước
```

Trace:

```text
Giá trị khởi tạo (defaultValues, query data)
 ↓
User input
 ↓
Validation (onChange / onBlur / onSubmit)
 ↓
Transform sang request
 ↓
Submit
 ↓
Field error hoặc success
```

Tìm:

```text
useForm
register / Controller
resolver (zodResolver, yupResolver)
handleSubmit
formState.errors / isDirty / isSubmitting
setError
useFieldArray
schema
```

Kiểm tra:

```text
Giá trị hiển thị và giá trị submit có khác nhau không (mask, số tiền, ngày)?
Lỗi đến từ schema client, từ API 400, hay cả hai?
Reset form khi query đổi id — có bị đè dữ liệu người dùng đang gõ không?
Nút submit disable dựa trên isValid hay chỉ dựa trên isSubmitting?
Double submit bị chặn chưa?
```

Schema client là bằng chứng rule hiển thị. Không nâng nó thành rule của hệ thống nếu server có bộ validate khác — ghi cả hai và đánh dấu chỗ chưa đối chiếu.

---

## 18. Cache, đồng bộ và trạng thái sau mutation

Câu hỏi trung tâm sau khi ghi:

```text
Cái gì làm UI đang mở đổi theo dữ liệu mới?
```

Các cơ chế thường gặp:

```text
invalidateQueries → refetch
setQueryData → sửa cache tại chỗ
dispatch vào store
setState local
router.refresh()
revalidatePath / revalidateTag
reload cả trang
optimistic update + rollback khi lỗi
```

Trace:

```text
Mutation success
    ↓
Cơ chế đồng bộ
    ↓
Query / store / URL nào đổi
    ↓
Component nào đang subscribe
    ↓
Người dùng thấy gì
```

Kiểm tra:

```text
Màn danh sách và màn chi tiết có dùng chung key không?
Filter trên URL có nằm trong query key không?
Optimistic row có id tạm không — reconcile với id server thế nào?
Hai tab hoặc hai request chồng nhau thì bản nào thắng?
gcTime hết hạn thì dữ liệu biến mất hay refetch?
```

Không mặc định rằng gọi API thành công thì mọi màn hình đang mở đều đúng. Chỉ những subscriber của cache/store đó mới cập nhật.

---

## 19. Realtime

Nếu UI tự đổi không do người dùng thao tác, tìm kênh đẩy:

```text
WebSocket
Socket.IO
SignalR client
Server-Sent Events
GraphQL subscription
polling (refetchInterval)
BroadcastChannel
```

Flow:

```text
Server event
    ↓
Client subscriber
    ↓
Parse payload
    ↓
Cập nhật cache / store
    ↓
Render
```

Kiểm tra:

```text
Kết nối mở ở đâu (root, page, hook)?
Cleanup khi unmount / đổi tenant?
Reconnect và resync (full refetch sau khi mất kết nối)?
Event có bị áp vào sai query key không?
Thứ tự event và mutation local — cái nào ghi đè?
```

Polling cũng là realtime theo nghĩa hành vi. Ghi `refetchInterval` thành nguồn cập nhật nếu không có socket.

---

## 20. Việc hoãn và chạy nền trên client

Tìm:

```text
setTimeout / setInterval
requestIdleCallback
startTransition
useDeferredValue
Web Worker
Service Worker
queueMicrotask
debounce / throttle
```

Flow:

```text
Trigger
    ↓
Hoãn / chuyển sang worker
    ↓
Kết quả quay lại main thread
    ↓
setState / postMessage
    ↓
Render
```

Kiểm tra:

```text
Timer có bị clear khi unmount hoặc khi input đổi không?
Worker có giữ bản sao state cũ không?
Debounce có nuốt sự kiện cuối không?
Service worker có cache API — UI có đang đọc bản cũ không?
```

Không coi `async` trong event handler là xử lý nền. Nó vẫn là một lượt thao tác của người dùng, trừ khi có worker hoặc scheduler tách khỏi lượt đó.

---

## 21. Render, reconciliation và concurrency

Không coi mỗi lần function component chạy là một nghiệp vụ được thực thi.

Kiểm tra:

```text
Danh sách: key ổn định hay key={index}?
Conditional mount: nhánh ẩn có unmount và mất state không?
Strict Mode
Suspense boundary nằm ở đâu — fallback che cả page hay một khối?
startTransition có đánh dấu update không khẩn không?
useDeferredValue có làm UI đọc giá trị cũ hơn input không?
React Compiler / memo thủ công có đang giữ UI cũ không?
```

Đặt câu hỏi:

```text
Update này có khẩn với những gì người dùng vừa gõ không?
Có state nào bị reset vì đổi vị trí trên cây không?
Có hai nguồn cùng render một vùng (server HTML rồi client hydrate) không — lệch nội dung lúc hydrate?
```

Hydration mismatch là lỗi runtime, không phải chi tiết styling. Nếu màn hình phụ thuộc vào `window`, `Date.now()` hoặc random trong render, ghi thành rủi ro đã quan sát.

---

## 22. Authentication / Authorization

Trace những gì **client** thực sự làm:

```text
App boot
 ↓
Đọc session (cookie, memory, /me)
 ↓
Auth context / store
 ↓
Route guard / middleware
 ↓
Ẩn hiện nút, field, route
 ↓
Gắn credential lên request (cookie, Authorization header)
 ↓
401 / 403 → refresh, redirect login, hoặc thông báo
```

Tìm:

```text
AuthProvider
useAuth / useSession
ProtectedRoute
middleware.ts
beforeLoad
httpOnly cookie vs localStorage token
interceptor refresh
role / permission map
<Can> / hide by role
```

Cần trả lời:

```text
Session được thiết lập thế nào?
Token nằm ở đâu?
Request nào được gắn credential?
Guard nào chỉ đổi UI?
Có gọi /me không, và cache bao lâu?
Logout xóa những store/cache nào?
```

Phân quyền trên UI là cách trình bày. Quyết định cho phép hay không thuộc server. Khi đọc source React, ghi rõ từng kiểm tra là **presentation** hay là **điều kiện gọi API**, và không kết luận hệ thống an toàn chỉ vì nút bị ẩn.

---

## 23. Error handling

Map:

```text
Lỗi phát sinh (render, query, mutation, event, boundary)
    ↓
Nơi bắt (boundary, onError, catch trong handler)
    ↓
Người dùng thấy gì (fallback, field error, toast, redirect)
    ↓
Hệ thống ngoài có được báo không (Sentry)
```

Tìm:

```text
ErrorBoundary
componentDidCatch / getDerivedStateFromError
error.tsx
global-error.tsx
QueryErrorResetBoundary
throwOnError
onError
try/catch trong handler
problem-details parser
mapApiError
```

Nếu source đủ evidence, phân biệt:

```text
Lỗi validate form
Lỗi nghiệp vụ từ API (4xx có body)
Lỗi kỹ thuật (network, 5xx)
Lỗi render (boundary)
Lỗi auth (401/403)
```

Error Boundary không bắt lỗi trong event handler, async, hay server. Nếu chỉ thấy boundary, chưa đủ kết luận mọi lỗi đều có UI.

---

## 24. Observability

Tìm:

```text
Sentry / Bugsnag / Datadog RUM
ErrorBoundary tích hợp reporter
analytics.track / page
web-vitals
OpenTelemetry browser
console.* (chỉ là dấu vết dev trừ khi có transport)
source map upload trong CI
```

Trace:

```text
User action hoặc crash
 ↓
Breadcrumb / event
 ↓
Tag (route, release, user, tenant)
 ↓
Exporter
```

Kiểm tra:

```text
Release có gắn git sha không?
User id có được set sau login và clear sau logout không?
PII có lọt vào breadcrumb (email, token, body) không?
Sự kiện analytics có khớp tên business flow không?
```

Không mô tả hành vi sản phẩm từ tên event analytics nếu handler không gọi tới event đó.

---

## 25. API client và BFF

Tìm:

```text
axios instance
fetch wrapper
ky / wretch
graphql client
openapi-fetch / orval / swagger codegen
Server Action
app/api/** hoặc pages/api/**
rewrites / proxy trong next.config hoặc vite.config
```

Trace:

```text
Feature
 ↓
Hàm client (getInvoice, createInvoice)
 ↓
Instance dùng chung (baseURL, header, interceptor)
 ↓
HTTP hoặc server action
 ↓
Backend / BFF
```

Kiểm tra:

```text
Base URL
Timeout
Retry
Gắn auth
Xử lý 401
Serialize ngày, tiền, null
Map lỗi
Idempotency key
CSRF header
```

Proxy dev (`server.proxy`) không phải contract production. Đối chiếu env production trước khi kết luận browser gọi thẳng service nào.

---

## 26. Configuration

Trace:

```text
.env*
    ↓
Biến public dính bundle (VITE_, NEXT_PUBLIC_)
    ↓
Biến chỉ có trên server
    ↓
Runtime config (nếu có)
    ↓
Feature flag
    ↓
Code đọc flag
```

Đặc biệt kiểm tra:

```text
API URL
Auth issuer / client id
Feature flags
Timeout
Tên tenant
Cờ bật mock (MSW)
```

Mock bật nhầm ở production là behavior, không phải chi tiết toolchain. Nếu thấy `msw` start trong entry, trace điều kiện bật.

Không ghi secret values vào documentation.

---

## 27. Tests

Ưu tiên test mô tả behavior người dùng nhìn thấy:

```text
Component test (Testing Library)
Hook test
Integration test với MSW
Playwright / Cypress
Storybook play function
```

Từ test xác định:

```text
Input người dùng
Kỳ vọng trên UI
Rule hiển thị
Trạng thái loading / empty / error
Contract request (method, URL, body) nếu assert trên MSW
```

Tìm:

```text
vitest / jest
@testing-library/react
userEvent
msw
playwright
cypress
renderWithProviders
```

Provider bọc trong test cho biết component cần những dependency nào (router, query client, auth). Đó là bằng chứng composition.

Không mặc định test bao phủ production. Snapshot dễ xanh khi behavior đã đổi nghĩa — ưu tiên assertion theo vai trò và text người dùng thấy.

---

## 28. User Flow Map

Mỗi user flow nên là một artifact riêng:

```text
flows/
├── list-invoices.md
├── create-invoice.md
├── edit-invoice.md
├── cancel-invoice.md
└── download-invoice-pdf.md
```

Template:

```markdown
# <User Flow>

## 1. Entry (route + component)

## 2. Trigger

## 3. Input (URL, form, props)

## 4. Execution Flow

## 5. Business Rules nhìn thấy trên UI

## 6. Data Read

## 7. Data Write

## 8. Cache / Store cập nhật

## 9. Navigation

## 10. External Calls

## 11. Loading / Empty / Error

## 12. Retry / Recovery

## 13. Security (UI versus server)

## 14. Observability

## 15. Source References

## 16. Unknowns / Open Questions
```

---

## 29. Call Graph

Không chỉ ghi danh sách component.

Tạo call graph theo flow. Phân nhánh **render** và **event** nếu không chúng sẽ bị đọc như một chuỗi đồng bộ.

```text
GET /invoices/new
│
├── CreateInvoicePage
│   ├── useCustomersQuery()
│   │     └── api.getCustomers()
│   └── InvoiceForm
│         └── onSubmit
│               ├── toCreateInvoiceRequest()
│               ├── useCreateInvoiceMutation()
│               │     └── api.createInvoice()
│               ├── invalidateQueries(["invoices"])
│               └── navigate(/invoices/:id)
```

Khi cần deep dive, expand từng node: query key, schema validate, mapper.

---

## 30. Data Flow

Theo dõi data thay vì chỉ theo dõi component.

Ví dụ đọc:

```text
URL /invoices?status=draft&page=2
    ↓
search params
    ↓
queryKey ["invoices", { status, page }]
    ↓
GET /api/invoices
    ↓
InvoiceDto[]
    ↓
select → InvoiceRowView[]
    ↓
<table>
```

Ví dụ ghi:

```text
Form values
    ↓
zod schema
    ↓
CreateInvoiceRequest
    ↓
POST /api/invoices
    ↓
InvoiceDto
    ↓
navigate + invalidate list query
```

Nếu có realtime:

```text
WebSocket invoice.updated
    ↓
setQueryData(["invoice", id])
    ↓
Detail view
```

Ghi rõ chỗ nào data bị copy sang state local. Bản copy đó có thể lệch nguồn sau khi cache đổi.

---

## 31. Dependency Map

Phân loại dependency:

```text
Internal package (monorepo)
npm package
API / BFF
Auth provider
Realtime endpoint
Browser storage
Analytics / error reporting
Feature flag service
CDN / hosting
```

Ví dụ:

```text
CreateInvoicePage
├── useCustomersQuery
├── useCreateInvoiceMutation
├── InvoiceForm
├── useAuth
├── navigate
└── analytics.track
```

Sau đó trace implementation:

```text
useCreateInvoiceMutation
    ↓
api.createInvoice
    ↓
http client
    ↓
NEXT_PUBLIC_API_URL hoặc Server Action
```

---

## 32. Three-pass reading strategy

### Pass 1 — Reconnaissance

Khoảng 10–20% effort.

Tìm:

```text
README
package.json
Workspace
Bundler config
Entry + providers
Router
Feature folders
API module
Store / query client
Env
Tests
CI / hosting
```

Output:

```text
Architecture Map
Module Map
Route / Entry Map
State taxonomy (URL, local, store, server cache)
```

### Pass 2 — Trace

Khoảng 50–60% effort.

Chọn 3–5 flow quan trọng:

```text
Vào app / đăng nhập
Màn danh sách + filter
Xem chi tiết
Tạo hoặc sửa
Một hành động phụ (hủy, tải file, duyệt)
```

Trace:

```text
Trigger
→ Màn hình
→ Data read
→ Decision
→ User action
→ Mutation
→ UI cập nhật
```

Output:

```text
User Flow Map
Call Graph
Data Flow
Dependency Map
```

### Pass 3 — Deep Dive

Khoảng 20–40% effort.

Chỉ đọc sâu:

```text
Business rules trên UI và chỗ chưa đối chiếu server
Đồng bộ cache sau mutation
Race (đổi id, double submit, optimistic)
Auth presentation versus request thật
Loading / error / empty
Hiệu năng render chỉ khi flow bị ảnh hưởng
```

---

## 33. Chuẩn evidence khi reverse-engineering

Mỗi kết luận quan trọng nên có source reference.

Ví dụ:

```text
Observed:
CreateInvoicePage onSubmit gọi mutateAsync rồi navigate tới /invoices/:id.
Source:
CreateInvoicePage.tsx:86
```

Inference:

```text
[Suy luận]
Danh sách hóa đơn có khả năng tự làm mới sau khi tạo,
vì onSuccess invalidate query key ["invoices"]
và màn danh sách đang useQuery với key đó.
```

Unknown:

```text
[Chưa xác minh]
Chưa thấy server có từ chối tạo hóa đơn khi UI đã ẩn nút theo role.
```

---

## 34. Output artifacts

Khi reverse-engineer một React repository lớn:

```text
01-system-context.md
02-architecture.md
03-module-map.md
04-route-map.md
05-user-flows/
06-data-flow.md
07-state-and-cache.md
08-integration-map.md
09-security-ui.md
10-observability.md
11-build-and-runtime.md
12-open-questions.md
```

Trong đó `user-flows` là artifact quan trọng nhất khi mục tiêu là hiểu behavior.

---

## 35. Anti-patterns

### Không đọc tuần tự toàn repository

Không nên:

```text
components/Button.tsx
→ components/Input.tsx
→ utils/format.ts
→ ...
```

### Không bắt đầu từ implementation detail

Không nên bắt đầu bằng:

```text
design-system button
helper format tiền
file types.ts dài
theme token
```

nếu chưa biết user flow nào dùng chúng.

### Không suy luận business rule chỉ từ tên component

Ví dụ:

```tsx
<InvoiceGuard>
```

Tên không đủ chứng minh rule. Phải đọc điều kiện bên trong, caller, test và — nếu cần — đối chiếu API.

### Không chỉ đọc happy path

Luôn kiểm tra:

```text
loading
empty
error
disabled
unauthorized trên UI
submit fail
mất mạng
```

### Không coi page component là owner của behavior

Luôn trace:

```text
Page
    ↓
Hook / store / query / form
    ↓
API client
    ↓
Nơi cache được ghi
```

### Không coi useEffect là xương sống data flow

Effect chạy sau paint. Đường data chính có thể là loader, Server Component, React Query hoặc event handler.

Phải trả lời được:

```text
Data vào UI từ đâu?
Effect có đang fetch, subscribe, hay chỉ đồng bộ hệ quả?
Có đường thứ hai cùng ghi state đó không?
```

### Không coi mỗi lần render là một giao dịch nghiệp vụ

Function component chạy lại vì props, state, store hoặc context đổi. Nó cũng có thể chạy rồi bị hủy trong concurrent render hoặc Strict Mode.

Chỉ event handler, loader, action, mutation và effect mới là chỗ việc xảy ra một lần theo nghĩa người dùng hoặc hệ thống ngoài quan sát được.

### Không coi ẩn nút là phân quyền

Trace tiếp request. Nếu không có bằng chứng ở API client hoặc server, ghi `[Chưa xác minh]` cho lớp enforce.

---

## 36. Quy trình tổng thể

```text
Repository
    │
    ▼
┌─────────────────────┐
│ 1. Repository Scan  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 2. Architecture     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 3. Module Map       │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 4. Routes / Entries │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 5. User Flows       │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 6. Call Graph       │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 7. Data Flow        │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 8. State and Cache  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 9. Runtime Mapping  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 10. Validate/Test   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Knowledge Model     │
└─────────────────────┘
```

---

## 37. Definition of Done

Một flow chỉ được xem là đã hiểu tương đối đầy đủ khi có thể trả lời:

```text
□ Flow bắt đầu ở route / component nào?
□ Ai trigger (người dùng, URL, redirect, timer, realtime)?
□ Input là gì (params, search, form, props)?
□ Các bước chính từ lúc vào màn đến lúc UI ổn định?
□ Business rules trên UI nằm ở đâu?
□ Decision points là gì (guard, conditional render, enabled)?
□ Data được đọc từ đâu?
□ Data được ghi đi đâu?
□ Cache / store / URL nào đổi sau mutation?
□ Điều hướng xảy ra khi nào?
□ API hoặc BFF nào được gọi?
□ Auth trên UI khác gì với credential gắn trên request?
□ Loading, empty, error trông như thế nào?
□ Retry / refresh token / rollback optimistic ra sao?
□ Có race (đổi id, double submit, event đến muộn) không?
□ Người dùng thấy gì khi thành công?
□ Source evidence nằm ở đâu?
□ Những điểm nào vẫn Unknown?
```

Nếu chưa trả lời được một mục, không tự điền bằng giả định; đánh dấu `Unknown` và tiếp tục trace source liên quan.
