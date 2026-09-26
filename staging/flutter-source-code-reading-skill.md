---
name: flutter-source-code-reading
description: Phương pháp luận đọc và reverse-engineer Flutter/Dart source code theo user flow, architecture, widget tree, state, data flow và runtime behavior.
---

# Flutter Source Code Reading Skill

## 1. Mục tiêu

Skill này cung cấp phương pháp luận để đọc và reverse-engineer một Flutter codebase, đặc biệt phù hợp với ứng dụng mobile, desktop hoặc multi-platform lớn.

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

`build()` là hình chiếu của state lên UI. Hành vi nghiệp vụ thường nằm ở route, callback, controller, bloc/notifier và data source — không nằm ở thứ tự widget trong cây `build()`.

---

## 2. Nguyên tắc chung

### 2.1. Xác định scope trước khi đọc

Trước khi mở source, xác định câu hỏi cần trả lời:

- Ứng dụng này cho phép người dùng làm gì?
- Một user flow cụ thể chạy như thế nào?
- Màn hình / tính năng nằm ở đâu?
- State sống ở đâu, và scope rebuild là gì?
- Data đi từ API hoặc DB local đến UI qua những đâu?
- Mutation nào làm đổi dữ liệu trên server hoặc máy?
- Sau mutation, UI được cập nhật bằng cơ chế nào?
- External system nào được gọi?
- Auth và phân quyền được thể hiện ở đâu trên client?
- Loading, empty, error và retry được xử lý như thế nào?

Không cố gắng hiểu toàn bộ repository nếu câu hỏi chỉ liên quan đến một flow hoặc một feature.

### 2.2. Phân biệt fact và inference

Trong quá trình reverse-engineering, phân loại thông tin thành:

**Observed** — thông tin trực tiếp quan sát được từ source.

**Documented** — thông tin được mô tả trong README, ADR, comment, OpenAPI, hoặc cấu hình flavor/deploy.

**Inferred** — kết luận được suy ra từ nhiều bằng chứng. Gắn nhãn `[Suy luận]`.

**Unknown** — chưa đủ bằng chứng để kết luận. Gắn nhãn `[Chưa xác minh]`.

Không chuyển `Inferred` hoặc `Unknown` thành fact.

Ẩn một nút không chứng minh server từ chối thao tác đó. `FutureBuilder` không chứng minh đó là đường data chính nếu route đã load trước, hoặc một bloc đã giữ stream.

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
Chạy trên nền tảng nào (iOS, Android, web, desktop)?
Business capability nào được expose trên UI?
API / local DB / realtime nào được gọi?
```

Kết quả:

```text
System Context
├── Users / Roles nhìn từ UI
├── Screens / Routes
├── Platforms
├── Business Capabilities
├── API / BFF
├── Local persistence
├── Auth Provider
├── Realtime Channels
├── Analytics / Crash reporting
└── Store / distribution
```

---

## 4. L1 — Architecture

Khảo sát repository trước khi đọc widget.

Với Flutter, ưu tiên nhận diện toolchain và cách cắt app:

```text
pubspec.yaml
analysis_options.yaml
lib/
test/
integration_test/
android/
ios/
web/
windows/ / macos/ / linux/
melos.yaml
```

Xác định kiểu tổ chức trước khi đọc flow:

```text
Một package lib/
Melos / monorepo nhiều package
Feature-first (lib/features/<name>)
Layer-first (presentation / domain / data)
Clean architecture / DDD
Modular (package interface + implementation)
```

Tìm entry và lớp bọc ứng dụng:

```text
lib/main.dart
lib/main_dev.dart / main_stg.dart / main_prod.dart
lib/bootstrap.dart
MaterialApp / CupertinoApp / WidgetsApp
```

Tìm thứ gắn ở root — đây là bản đồ phụ thuộc của cả app:

```text
Provider / MultiProvider
ProviderScope (Riverpod)
BlocProvider
GetMaterialApp
RouterConfig / MaterialApp.router
localizationsDelegates
navigatorObservers
```

Tìm entry của behavior:

```text
Route / GoRoute / AutoRoute
Page widget
onPressed / onTap / onSubmitted
Controller method
Bloc event / Cubit method
Notifier method
Platform channel / plugin
```

Xác định:

- Navigation
- Feature modules
- Design system / shared widgets
- State (local, inherited, bloc, riverpod, getx)
- API / local DB
- Auth
- i18n (`arb`, `gen-l10n`)
- Observability
- Flavor và build

Kết quả cần đạt: **Architecture Map**.

Ví dụ:

```text
OS
  ↓
Flutter engine
  ↓
main() → runApp
  ↓
App (providers + router)
  ↓
Route → Screen
  ↓
Bloc / Notifier / Controller
  ↓
Repository
  ↓
API client hoặc local DB
```

---

## 5. L2 — Module

Xác định responsibility của từng package và feature.

Ví dụ monorepo:

```text
apps/
└── mobile
packages/
├── ui
├── api_client
├── auth
└── invoice
```

Ví dụ feature-first:

```text
lib/
├── app/                 # bootstrap, router, theme
├── features/
│   └── invoice/
│       ├── presentation/
│       ├── application/ # bloc, notifier
│       ├── domain/
│       └── data/
└── shared/
```

Không mặc định mọi repo dùng clean architecture. Đọc `pubspec.yaml` dependencies và import thực tế.

Với mỗi module, xác định:

```text
Responsibility
Public exports (barrel file)
Dependencies
Entry Points (route, widget, controller)
Outputs (UI, navigation, mutation, event)
External Dependencies
```

Đồng thời đặt câu hỏi:

> Module này không nên chịu trách nhiệm về việc gì?

Điều này giúp phát hiện screen vừa gọi HTTP, vừa chứa rule, vừa `Navigator.push`, vừa ghi analytics — boundary đã vỡ.

---

## 6. L3 — Execution Flow

Đây là tầng quan trọng nhất.

Không bắt đầu bằng việc đọc một `build()` dài từ trên xuống dưới.

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
build()
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
CreateInvoiceScreen
    ↓
CustomersBloc load
    ↓
InvoiceForm
    ↓
onPressed → CreateInvoiceEvent
    ↓
InvoiceRepository.create()
    ↓
POST /api/invoices
    ↓
emit success → context.go(/invoices/:id)
```

Phân biệt hai thì:

```text
Thì đọc (lần đầu vào màn)
Route → initState / provider create / bloc add(Started) → build

Thì ghi (người dùng thao tác)
callback → event/method → repository → state mới → build lại
```

Đọc lẫn hai thì sẽ gán nhầm `initState` hoặc `build()` thành toàn bộ nghiệp vụ.

---

## 7. Trace theo 5 câu hỏi

### 7.1. Entry

Tìm thứ người dùng hoặc hệ điều hành chạm vào trước:

```text
initialRoute / GoRoute path
deep link / app link
Screen widget
initState / provider build
onPressed / onTap / onSubmitted / onChanged
Form onSaved
Route guard / redirect
Push notification handler
AppLifecycleState
```

Câu hỏi:

```text
Ai trigger? (người dùng, deep link, notification, timer, stream)
Input là gì? (path param, query, extra, form)
Màn hình nào được push/go?
Data nào đã có sẵn trước khi build lần đầu?
```

### 7.2. Transformation

Trace hình dạng data đổi qua các biên:

```text
JSON
    ↓
DTO (fromJson / freezed / json_serializable)
    ↓
Domain entity
    ↓
State của bloc/notifier
    ↓
View model / props của widget
    ↓
Widget tree
```

và chiều ngược:

```text
Form values
    ↓
Mapper
    ↓
Request body
```

Tìm:

```text
fromJson / toJson
freezed
json_serializable
mapper / extension toEntity()
Equatable state
```

Không dừng ở widget nhận `state.invoices`. Tiếp tục trace repository và DTO.

### 7.3. Decision

Tìm chỗ rẽ nhánh mà người dùng nhìn thấy hoặc không nhìn thấy:

```text
if / switch trong build
early return
redirect của GoRouter
Route guard
visibility: Offstage / Visibility / if (canEdit)
disabled của nút
feature flag
filter trên state
validator của form
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

Tìm việc làm thay đổi thế giới bên ngoài `build()` thuần:

```text
HTTP / GraphQL mutation
Navigator.push / context.go / pop
emit state mới
ghi local DB / shared_preferences / secure storage
analytics
crash reporter
mở URL, share, file picker
in-app purchase / payment SDK
local notification
platform channel
```

Ví dụ:

```text
Submit invoice
├── POST /api/invoices
├── emit InvoiceCreated
├── context.go(/invoices/:id)
├── SnackBar success
└── analytics "invoice_created"
```

Side effect nằm trong event handler, `initState`, listener (`BlocListener`, `ref.listen`), không nằm trong `build()`. Gặp `build()` gọi API hoặc `Navigator` là dấu hiệu cần ghi lại.

### 7.5. Error / Recovery

Tìm cả trạng thái lỗi, không chỉ nhánh thành công:

```text
state.error / AsyncError / AsyncValue.error
BlocListener listenWhen error
try/catch trong repository
SnackBar / Dialog
FlutterError.onError / PlatformDispatcher.instance.onError
ErrorWidget.builder
retry button
401 → refresh token → retry hoặc logout
empty state
```

Kiểm tra failure flow, ví dụ:

```text
Load danh sách thành công
    ↓
Submit fail
    ↓
State form không bị xóa
    ↓
SnackBar hiện message từ API
```

Chỉ kết luận behavior từ source thực tế (retry policy của Dio, `AsyncValue.guard`, chỗ nào `catch` nuốt lỗi).

---

## 8. L4 — Implementation

Sau khi hiểu flow mới đọc sâu implementation.

Đọc theo semantic blocks, không đọc `build()` như một kịch bản chạy từ trên xuống:

```dart
final customers = ref.watch(customersProvider);

onPressed: () async {
  final request = toCreateInvoiceRequest(formKey);
  await ref.read(createInvoiceProvider.notifier).submit(request);
}
```

Với mỗi block:

```text
What does it do?
Why is it needed?
What data does it consume?
What data does it produce?
Does it build UI, or does it perform a side effect?
Can it fail?
What does the user see while it is pending?
```

Nếu chưa xác định được "Why" từ source, đánh dấu `Unknown`.

Khi đọc một screen lớn, tách ba phần:

```text
Data vào (constructor, route extra, watch/read, BlocBuilder)
Quyết định (guard, map, filter)
Hình chiếu (build)
```

Business rule nằm ở hai phần đầu. `build()` cho biết rule đó được hiển thị thế nào.

---

## 9. L5 — Runtime / Data / Side Effects

Map source với runtime thực tế:

```text
iOS / Android / desktop / web
    ↓
Flutter engine + Dart VM / AOT
    ↓
main() theo flavor
    ↓
App + router + DI/providers
    ↓
API / local DB / plugin
```

Tìm cấu hình runtime trong:

```text
--dart-define / --dart-define-from-file
flavor (main_dev.dart, productFlavors Android, scheme iOS)
firebase config theo flavor (google-services.json, GoogleService-Info.plist)
env class sinh từ define
AndroidManifest / Info.plist (permission, deep link)
```

Phân biệt config **dính vào binary lúc build** và config **đọc lúc chạy** (remote config). `--dart-define` lộ trong binary nếu ai đó đảo ngược app. Không ghi giá trị secret vào tài liệu.

Không giả định mọi thứ gọi được là REST. Có thể có GraphQL, gRPC, local DB và platform channel cùng tồn tại.

---

## 10. Flutter-specific reading order

Ưu tiên:

```text
1. README / documentation
2. pubspec.yaml (sdk, dependencies, assets, flavors)
3. melos.yaml nếu là monorepo
4. lib/main*.dart và bootstrap
5. App widget + router + provider gốc
6. Redirect / guard
7. Một screen của flow đang xét
8. Bloc / notifier / controller của screen đó
9. Repository
10. API client / local data source
11. DTO và mapper
12. Form + validator
13. Shared widget chỉ khi flow đụng tới
14. l10n / arb nếu nhãn là bằng chứng nghiệp vụ
15. Flavor / dart-define
16. Test của flow đó
17. integration_test
18. android/ và ios/ chỉ khi flow đụng permission, deep link, plugin
```

Đọc `pubspec.yaml` để biết họ công cụ trước khi grep mù:

```text
go_router / auto_route / beamer
flutter_bloc / bloc / flutter_riverpod / hooks_riverpod / provider / get
dio / http / retrofit / chopper / graphql
freezed / json_serializable / equatable
drift / isar / hive / sqflite / shared_preferences / flutter_secure_storage
firebase_* / sentry_flutter
```

---

## 11. Composition — widget, controller, provider

Flutter không có DI container kiểu .NET, trừ khi repo tự gắn `get_it` / `injectable`. Phụ thuộc được nối bằng **import**, **constructor**, **InheritedWidget / Provider**, và **service locator**.

Trace:

```text
Screen
    ↓
Bloc / Notifier / Controller
    ↓
Repository (interface)
    ↓
Data source
    ↓
Widget lá (design system)
```

và:

```text
Provider được tạo ở root, ở route, hay mỗi lần push screen?
Bloc có được close khi pop route không?
get_it đăng ký singleton hay factory?
```

Tìm:

```text
BlocProvider(create:)
ProviderScope / ProviderContainer
ref.watch / ref.read / ref.listen
context.read / context.watch
Get.put / Get.find
getIt.registerSingleton / registerFactory
```

Đặc biệt chú ý:

```text
ref.read trong build() — đọc một lần, không subscribe
context.watch đặt cao — rebuild cả cây lớn
BlocProvider tạo ở trên route — sống lâu hơn màn hình
GetX đăng ký toàn cục — khó thấy ai sở hữu state
Hai implementation của một repository — flavor nào được bind?
```

Không coi screen là implementation của behavior nếu logic nằm trong bloc hoặc repository ở package khác.

---

## 12. Render và lifecycle

Với một lần cập nhật UI:

```text
setState / emit / state = / notifyListeners
    ↓
Element cần rebuild được đánh dấu
    ↓
build() chạy lại ở subtree đó
    ↓
Reconcile Element tree (theo runtimeType + Key)
    ↓
RenderObject cập nhật
    ↓
Paint
```

Lifecycle của `State`:

```text
createState
    ↓
initState
    ↓
didChangeDependencies
    ↓
build
    ↓
didUpdateWidget (khi parent đổi config)
    ↓
deactivate / dispose
```

Tìm:

```text
StatefulWidget / StatelessWidget
setState
Key / ValueKey / ObjectKey / GlobalKey / PageStorageKey
AutomaticKeepAliveClientMixin
RouteAware / RouteObserver
WidgetsBindingObserver
AppLifecycleListener
addPostFrameCallback
```

Kiểm tra:

```text
State nào làm widget này build lại — và widget nào nằm dưới nó?
Key của list có đổi identity của row không?
dispose có hủy subscription, controller, timer không?
Screen trong IndexedStack / TabBarView có bị dispose khi đổi tab không?
```

Không đọc `build()` như một transaction. `build()` chạy lại nhiều lần và phải thuần. Side effect trong `build()` là dấu hiệu cần ghi lại, không phải pattern để suy ra business rule.

---

## 13. Navigation

Xác định API navigation thực tế rồi mới trace màn hình.

Navigator 1:

```text
Navigator.push / pop
MaterialPageRoute
onGenerateRoute
Navigator.pop(result)
```

GoRouter:

```text
GoRouter
GoRoute / ShellRoute / StatefulShellRoute
redirect
pathParameters / queryParameters
extra
context.go / context.push / context.pop
```

auto_route / beamer:

```text
@RoutePage
router.push
guard
```

Trace:

```text
Trigger
 ↓
go hoặc push (khác nhau: go thay stack, push chồng)
 ↓
redirect / guard
 ↓
Shell (bottom nav, drawer) có giữ nhánh không
 ↓
Page
 ↓
extra / path param / query
```

Kiểm tra:

```text
Path param và extra — cái nào là nguồn sự thật? extra mất khi process chết.
Guard chạy ở redirect hay chỉ ẩn nút?
pop trả result về caller thế nào?
Deep link có vào đúng route không?
Back Android có bị chặn (PopScope / WillPopScope) không?
```

Query trên URL (GoRouter) thường là state của màn danh sách. Bỏ qua nó sẽ dựng sai data flow. `extra` không sống sót sau khi app bị giết — nếu màn chi tiết chỉ nhận entity qua `extra`, ghi thành giới hạn đã quan sát.

---

## 14. State

Phân loại state trước khi đọc từng dòng. Trộn các loại này sẽ suy ra sai owner.

```text
Local UI          setState, ValueNotifier trong State
Inherited         InheritedWidget, Provider đặt ở một cây con
Route             path param, query, extra
App-wide          Bloc/Notifier/GetX ở root
Server cache      repository cache, hoặc state đã load
Form              TextEditingController, FormState, flutter_form_builder
Local persistence shared_preferences, secure storage, DB
```

Với mỗi mẩu dữ liệu trên màn hình, trả lời:

```text
Nguồn sự thật là gì?
Ai được phép ghi?
Widget nào rebuild khi nó đổi?
Sau khi kill app nó còn không?
```

Bloc — trace:

```text
UI callback
 ↓
add(Event)
 ↓
on<Event> handler
 ↓
emit(State)
 ↓
BlocBuilder / BlocListener
```

Tìm `sealed` event/state, `Emitter`, `emit.forEach`, transformer (`droppable`, `restartable`, `concurrent`).

Riverpod — trace:

```text
ref.watch(provider)
 ↓
Provider / Notifier / AsyncNotifier
 ↓
state =
 ↓
widget đang watch rebuild
ref.listen cho side effect (navigate, snackbar)
```

Phân biệt `ref.watch` (subscribe, dùng trong build) và `ref.read` (một lần, dùng trong callback).

GetX — `Obx` / `GetxController` sống theo registration, không theo cây widget. Trace `Get.put` và `Get.delete` trước khi kết luận scope.

---

## 15. Async, Stream và lifecycle

Dart `async/await` là lịch của một tác vụ, không phải bằng chứng tác vụ chạy song song trên nhiều isolate.

Trace:

```text
initState / provider build / event handler
 ↓
Future hoặc Stream
 ↓
await repository
 ↓
emit / setState
 ↓
build
```

Đặt câu hỏi:

```text
Future có bị hủy khi dispose / pop không?
Stream subscription có cancel trong dispose hoặc ref.onDispose không?
Đổi id khi request cũ chưa về — bản nào ghi state? (restartable so với concurrent)
Có listen stream trong build() không?
await xong còn dùng context đã unmount không? (context.mounted)
```

`FutureBuilder` / `StreamBuilder` tạo lại future nếu future được tạo ngay trong `build()` mà không được nhớ. Ghi nhận nếu thấy pattern đó — đó là behavior, không phải chi tiết phong cách.

Isolate (`compute`, `Isolate.spawn`, worker) mới là chạy nền thật. Kiểm tra dữ liệu đưa qua isolate có serializable được không, và kết quả quay về isolate UI bằng cách nào.

---

## 16. Data fetching và repository

Flow đọc:

```text
Screen mở
 ↓
event Started / AsyncNotifier.build / initState
 ↓
Repository
 ↓
Remote data source (Dio, http, graphql)
 ↓
fromJson → entity
 ↓
state
 ↓
BlocBuilder / ref.watch
```

Flow ghi:

```text
onPressed
 ↓
event Submit / notifier.submit
 ↓
Repository.create
 ↓
API
 ↓
emit success hoặc error
 ↓
listener: navigate, snackbar, refresh list
```

Tìm:

```text
Dio / InterceptorsWrapper
Retrofit @GET @POST
http.Client
GraphQL client
Repository interface và impl
@freezed state: initial, loading, data, error
AsyncValue
```

Đặc biệt kiểm tra:

```text
Base URL và interceptor (auth, log, retry)
CancelToken khi dispose
Timeout
Map lỗi DioException → failure type
Cache trong memory có bị dùng làm nguồn thứ hai không?
Pagination: page, cursor, hay append vào state cũ?
Refresh list sau create là gọi lại API hay chỉ chèn item?
```

Không suy luận contract API chỉ từ tên method. Đọc path, method, body và `fromJson`.

---

## 17. Form và user input

Form là execution flow riêng, không phải chi tiết implementation.

Xác định kiểu form:

```text
Form + GlobalKey<FormState> + TextFormField
TextEditingController thủ công
flutter_form_builder / reactive_forms
Wizard nhiều bước (PageView + state giữ ở cha)
```

Trace:

```text
Giá trị khởi tạo (controller.text, initialValue)
 ↓
User input
 ↓
validator
 ↓
onSaved / đọc controller
 ↓
Mapper sang request
 ↓
Submit
 ↓
Field error hoặc SnackBar
```

Kiểm tra:

```text
Giá trị hiển thị và giá trị submit có khác nhau không (mask tiền, ngày)?
Lỗi đến từ validator client, từ API 400, hay cả hai?
Đổi id màn hình có tạo State mới không — nếu không, controller còn dữ liệu cũ?
Nút submit disable dựa trên đâu?
Double tap có gửi hai request không? (debounce, cờ submitting, transformer droppable)
dispose có dispose controller không?
```

Validator client là bằng chứng rule hiển thị. Không nâng nó thành rule của hệ thống nếu server có bộ validate khác — ghi cả hai và đánh dấu chỗ chưa đối chiếu.

---

## 18. Đồng bộ sau mutation và dữ liệu local

Câu hỏi trung tâm sau khi ghi:

```text
Cái gì làm UI đang mở đổi theo dữ liệu mới?
```

Các cơ chế thường gặp:

```text
emit state mới trong cùng bloc
reload list bloc sau khi pop trả result
ref.invalidate(provider)
ghi DB local rồi UI watch stream của DB
optimistic emit rồi rollback khi API lỗi
```

Trace:

```text
Mutation success
    ↓
Cơ chế đồng bộ
    ↓
Bloc / provider / DB stream nào đổi
    ↓
Widget nào đang listen
    ↓
Người dùng thấy gì
```

Kiểm tra:

```text
Màn danh sách và màn chi tiết có cùng nguồn không?
pop(result) có được caller dùng không — nếu không, list vẫn cũ?
Hai màn cùng sửa một entity thì bản nào thắng?
DB local là cache hay nguồn sự thật offline?
```

Không mặc định rằng gọi API thành công thì mọi màn đang nằm trong stack đều đúng. Chỉ subscriber của state hoặc stream đó mới cập nhật.

---

## 19. Realtime và notification

Nếu UI tự đổi không do người dùng thao tác, tìm kênh đẩy:

```text
WebSocket / socket_io / SignalR client
GraphQL subscription
Stream từ Firestore / Firebase
polling (Timer.periodic)
FCM / APNs — data message làm refresh
```

Flow:

```text
Server event hoặc push
    ↓
Subscriber đăng ký ở đâu (root, screen)
    ↓
Parse payload
    ↓
emit / ghi DB
    ↓
build
```

Kiểm tra:

```text
Subscription mở ở đâu?
cancel khi dispose hoặc đổi user/tenant?
Reconnect có full refetch không?
Push khi app killed đi vào route nào?
Event đến muộn có ghi đè mutation local không?
```

---

## 20. Nền, plugin và kênh nền tảng

Tìm:

```text
Timer
Workmanager / background fetch
firebase_messaging background handler
Isolate / compute
MethodChannel / EventChannel
Pigeon
FFI
```

Flow:

```text
Trigger (OS, timer, push)
    ↓
Background entry (không có Flutter UI)
    ↓
Xử lý giới hạn của isolate nền
    ↓
Kết quả hiện khi user mở app
```

Kiểm tra:

```text
Background handler có được đăng ký trước runApp không?
Nó có đụng plugin cần đăng ký lại không?
Kết quả ghi vào đâu để UI đọc sau?
Permission (camera, location, notification) được xin ở màn nào, và từ chối thì flow đi đâu?
```

`android/` và `ios/` chỉ cần đọc khi flow phụ thuộc permission, deep link, capability, hoặc code native tự viết. Không đọc lần lượt mọi file Gradle khi câu hỏi là một màn hình Dart.

---

## 21. Rebuild, Key và danh sách

Không coi mỗi lần `build()` chạy là một nghiệp vụ được thực thi.

Kiểm tra:

```text
Danh sách: itemExtent, Key ổn định hay Key theo index?
Đổi Key có làm State (controller, scroll, form) bị tạo lại không?
const constructor có đang giữ cấu hình cũ không?
BlocBuilder buildWhen / ref.watch select có lọc đúng không?
ListView.builder có dispose hàng ra khỏi viewport không?
AutomaticKeepAlive có giữ màn tab không nhìn thấy không?
```

Đặt câu hỏi:

```text
Update này rebuild những widget nào?
State nào bị reset vì phần tử bị remove/insert trên cây?
AnimationController có bị tạo lại mỗi build không?
```

---

## 22. Authentication / Authorization

Trace những gì **app** thực sự làm:

```text
Boot
 ↓
Đọc session (secure storage, cookie, /me)
 ↓
Auth state (bloc / notifier)
 ↓
redirect / guard
 ↓
Ẩn hiện nút, route
 ↓
Interceptor gắn credential
 ↓
401 / 403 → refresh, về login, hoặc thông báo
```

Tìm:

```text
AuthBloc / authProvider
GoRouter.redirect
flutter_secure_storage
Interceptor gắn Authorization
refresh token
role / permission trên state
```

Cần trả lời:

```text
Session được thiết lập thế nào?
Token nằm ở đâu?
Request nào được gắn credential?
Guard nào chỉ đổi UI?
Logout xóa những bloc, DB cache, secure storage nào?
```

Phân quyền trên UI là cách trình bày. Quyết định cho phép hay không thuộc server. Ghi rõ từng kiểm tra là **presentation** hay là **điều kiện gọi API**.

---

## 23. Error handling

Map:

```text
Lỗi phát sinh (API, parse, render, platform)
    ↓
Nơi bắt (repository, bloc, runZonedGuarded, FlutterError.onError)
    ↓
Người dùng thấy gì (SnackBar, dialog, error state, ErrorWidget)
    ↓
Crash reporter có nhận không
```

Tìm:

```text
try/catch
Either / Result / Failure
AsyncValue.guard
BlocObserver.onError
FlutterError.onError
PlatformDispatcher.instance.onError
runZonedGuarded
ErrorWidget.builder
```

Nếu source đủ evidence, phân biệt:

```text
Lỗi validate form
Lỗi nghiệp vụ từ API (4xx có body)
Lỗi kỹ thuật (network, 5xx, timeout)
Lỗi parse
Lỗi auth (401/403)
Lỗi render
```

`catch (_)` nuốt lỗi là behavior. Ghi lại nếu không thấy logger hay state error.

---

## 24. Observability

Tìm:

```text
sentry_flutter / firebase_crashlytics
BlocObserver / ProviderObserver log
analytics (firebase_analytics, amplitude)
NavigatorObserver
talker / logger
```

Trace:

```text
User action hoặc crash
 ↓
Breadcrumb / event
 ↓
Tag (route, release, user, flavor)
 ↓
Exporter
```

Kiểm tra:

```text
Release có gắn version từ pubspec không?
User id có được set sau login và clear sau logout không?
PII có lọt vào breadcrumb không?
Sự kiện analytics có được gọi từ đúng handler của flow không?
```

Không mô tả hành vi sản phẩm từ tên event analytics nếu handler không gọi tới event đó.

---

## 25. API client và backend

Tìm:

```text
Dio instance dùng chung
Retrofit service
http wrapper
GraphQL client
chopper
interceptor
```

Trace:

```text
Feature
 ↓
Repository
 ↓
Api service
 ↓
Dio / client
 ↓
Backend
```

Kiểm tra:

```text
Base URL theo flavor
Timeout
Retry
Gắn auth
Xử lý 401
Serialize ngày, tiền, null
Map lỗi
Certificate pinning (nếu có)
```

Base URL trong `main_dev.dart` không phải contract production. Đối chiếu flavor production trước khi kết luận app gọi service nào.

---

## 26. Configuration và flavor

Trace:

```text
main_<flavor>.dart
    ↓
--dart-define
    ↓
lớp Env / Flavor
    ↓
Firebase options / API URL / feature flag
    ↓
Code đọc flag
```

Đặc biệt kiểm tra:

```text
API URL
Auth issuer / client id
Tên app, bundle id, applicationId
Feature flags
Cờ bật log hoặc mock
```

Mock hoặc log interceptor bật ở flavor production là behavior. Trace điều kiện bật.

Không ghi secret values vào documentation.

---

## 27. Tests

Ưu tiên test mô tả behavior người dùng nhìn thấy:

```text
Widget test
Bloc / notifier test
Repository test với mock client
integration_test / patrol
Golden test (chỉ khi câu hỏi là hình dạng UI)
```

Từ test xác định:

```text
Input người dùng
Kỳ vọng trên UI (find.text, find.byType)
Rule hiển thị
Trạng thái loading / empty / error
Contract request nếu assert trên mock adapter
```

Tìm:

```text
testWidgets
pumpWidget / pumpAndSettle
blocTest
ProviderContainer
mocktail / mockito
dio_adapter / http mock
integration_test
```

Harness bọc `pumpWidget` cho biết screen cần những dependency nào (router, provider, l10n). Đó là bằng chứng composition.

Không mặc định test bao phủ production. `pumpAndSettle` treo nếu animation không kết thúc — không suy ra production treo chỉ từ cách viết test, trừ khi source cũng có animation lặp.

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

## 1. Entry (route + screen)

## 2. Trigger

## 3. Input (path, query, extra, form)

## 4. Execution Flow

## 5. Business Rules nhìn thấy trên UI

## 6. Data Read

## 7. Data Write

## 8. State / DB cập nhật

## 9. Navigation (go, push, pop result)

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

Không chỉ ghi danh sách widget.

Tạo call graph theo flow. Phân nhánh **build** và **callback** nếu không chúng sẽ bị đọc như một chuỗi đồng bộ.

```text
/invoices/new
│
├── CreateInvoiceScreen.build
│   ├── watch(customersProvider)
│   │     └── CustomerRepository.fetch()
│   └── InvoiceForm
│         └── onPressed
│               ├── toCreateInvoiceRequest()
│               ├── CreateInvoiceNotifier.submit()
│               │     └── InvoiceRepository.create()
│               └── context.go(/invoices/:id)
```

Khi cần deep dive, expand từng node: event, state, DTO, interceptor.

---

## 30. Data Flow

Theo dõi data thay vì chỉ theo dõi widget.

Ví dụ đọc:

```text
/invoices?status=draft
    ↓
GoRouter query
    ↓
InvoiceListNotifier
    ↓
GET /api/invoices?status=draft
    ↓
InvoiceDto → Invoice
    ↓
InvoiceListState.data
    ↓
ListView
```

Ví dụ ghi:

```text
TextEditingController
    ↓
validator
    ↓
CreateInvoiceRequest
    ↓
POST /api/invoices
    ↓
Invoice
    ↓
emit success + go detail
```

Nếu có DB local:

```text
API
    ↓
Drift write
    ↓
watch stream
    ↓
state
    ↓
ListView
```

Ghi rõ chỗ nào entity bị copy sang `State` local của widget. Bản copy đó có thể lệch bloc sau khi state đổi.

---

## 31. Dependency Map

Phân loại dependency:

```text
Package nội bộ (melos)
pub.dev package
API
Auth provider
Local DB
Plugin nền tảng
Analytics / crash reporting
Feature flag / remote config
Store distribution
```

Ví dụ:

```text
CreateInvoiceScreen
├── customersProvider
├── createInvoiceProvider
├── InvoiceForm
├── authState
├── context.go
└── analytics.logEvent
```

Sau đó trace implementation:

```text
createInvoiceProvider
    ↓
InvoiceRepositoryImpl
    ↓
InvoiceApi (Dio)
    ↓
Env.apiUrl của flavor
```

---

## 32. Three-pass reading strategy

### Pass 1 — Reconnaissance

Khoảng 10–20% effort.

Tìm:

```text
README
pubspec.yaml
melos.yaml
main*.dart
App + router + provider gốc
Feature folders
Repository và API
Flavor / dart-define
Tests
android/ios manifest chỉ ở mức permission và deep link
```

Output:

```text
Architecture Map
Module Map
Route / Entry Map
State taxonomy (local, route, bloc/notifier, DB)
```

### Pass 2 — Trace

Khoảng 50–60% effort.

Chọn 3–5 flow quan trọng:

```text
Mở app / đăng nhập
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
Đồng bộ state sau mutation và sau pop
Race (đổi id, double tap, stream đến muộn)
Auth presentation versus request thật
Loading / error / empty
dispose / cancel
Plugin và permission chỉ khi flow đụng tới
```

---

## 33. Chuẩn evidence khi reverse-engineering

Mỗi kết luận quan trọng nên có source reference.

Ví dụ:

```text
Observed:
CreateInvoiceScreen onPressed gọi submit rồi context.go tới /invoices/:id khi state success.
Source:
create_invoice_screen.dart:86
```

Inference:

```text
[Suy luận]
Danh sách hóa đơn có khả năng vẫn cũ sau khi tạo,
vì success chỉ navigate mà không thấy invalidate list provider
hay pop(result) về màn danh sách.
```

Unknown:

```text
[Chưa xác minh]
Chưa thấy server có từ chối tạo hóa đơn khi UI đã ẩn nút theo role.
```

---

## 34. Output artifacts

Khi reverse-engineer một Flutter repository lớn:

```text
01-system-context.md
02-architecture.md
03-module-map.md
04-route-map.md
05-user-flows/
06-data-flow.md
07-state-and-sync.md
08-integration-map.md
09-security-ui.md
10-observability.md
11-flavors-and-runtime.md
12-open-questions.md
```

Trong đó `user-flows` là artifact quan trọng nhất khi mục tiêu là hiểu behavior.

---

## 35. Anti-patterns

### Không đọc tuần tự toàn repository

Không nên:

```text
lib/shared/widgets/app_button.dart
→ lib/core/utils/format.dart
→ android/app/build.gradle
→ ...
```

### Không bắt đầu từ implementation detail

Không nên bắt đầu bằng:

```text
theme
widget nút dùng chung
file freezed sinh ra
extension format tiền
```

nếu chưa biết user flow nào dùng chúng.

### Không suy luận business rule chỉ từ tên widget

Ví dụ:

```dart
class InvoiceGuard extends StatelessWidget
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

### Không coi screen là owner của behavior

Luôn trace:

```text
Screen
    ↓
Bloc / notifier / controller
    ↓
Repository
    ↓
API hoặc DB
```

### Không coi build() là xương sống nghiệp vụ

`build()` chạy lại mỗi lần state đổi và phải không có side effect. Đường data chính có thể là bloc event, notifier, repository hoặc listener.

Phải trả lời được:

```text
Data vào UI từ đâu?
build() có đang gọi API hoặc Navigator không?
Có đường thứ hai cùng ghi state đó không?
```

### Không coi mỗi lần build là một giao dịch nghiệp vụ

`build()` chạy vì ancestor rebuild, `setState`, `emit`, hoặc `ref.watch`. Nó không tương đương một lượt người dùng bấm.

Chỉ callback, event handler, listener và repository mới là chỗ việc xảy ra một lần theo nghĩa người dùng hoặc hệ thống ngoài quan sát được.

### Không coi async/await là xử lý song song

`await` tuần tự trên cùng isolate UI. Song song thật là `Future.wait`, nhiều request không chờ nhau, hoặc isolate khác. Phải đọc chỗ gọi, không kết luận từ từ khóa `async`.

### Không coi ẩn nút là phân quyền

Trace tiếp request. Nếu không có bằng chứng ở interceptor hoặc server, ghi `[Chưa xác minh]` cho lớp enforce.

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
│ 8. State and Sync   │
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
□ Flow bắt đầu ở route / screen nào?
□ Ai trigger (người dùng, deep link, notification, timer, stream)?
□ Input là gì (path, query, extra, form)?
□ Các bước chính từ lúc vào màn đến lúc UI ổn định?
□ Business rules trên UI nằm ở đâu?
□ Decision points là gì (guard, nhánh build, validator)?
□ Data được đọc từ đâu?
□ Data được ghi đi đâu?
□ Bloc / provider / DB nào đổi sau mutation?
□ Navigation là go, push, hay pop(result)?
□ API hoặc plugin nào được gọi?
□ Auth trên UI khác gì với credential gắn trên request?
□ Loading, empty, error trông như thế nào?
□ Retry / refresh token / rollback ra sao?
□ Có race (đổi id, double tap, stream đến muộn) không?
□ dispose / cancel những gì?
□ Người dùng thấy gì khi thành công?
□ Source evidence nằm ở đâu?
□ Những điểm nào vẫn Unknown?
```

Nếu chưa trả lời được một mục, không tự điền bằng giả định; đánh dấu `Unknown` và tiếp tục trace source liên quan.
