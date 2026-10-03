# Bộ câu hỏi C# — Cơ bản

> 9 câu: OOP, async, collection/LINQ, ORM, database, index, caching (khái niệm).
>
> **Dành cho Junior, Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Junior/Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Junior, Mid và Senior.** Điểm Mid/Senior = tích lũy/câu.

| # | Câu hỏi | Junior (max) | Mid (max) | Senior (max) |
|---|--------|:------------:|:---------:|:------------:|
| 1 | [Interface và Abstract class khác nhau thế nào?](#câu-1-interface-và-abstract-class-khác-nhau-thế-nào) | 8 | 18 | 30 |
| 2 | [`class` và `struct` khác nhau như thế nào?](#câu-2-class-và-struct-khác-nhau-như-thế-nào) | 8 | 18 | 30 |
| 3 | [`Equals()`, `GetHashCode()` và `==` có vai trò gì?](#câu-3-equals-gethashcode-và-có-vai-trò-gì) | 8 | 18 | 30 |
| 4 | [`async`/`await` hoạt động như thế nào?](#câu-4-asyncawait-hoạt-động-như-thế-nào) | 8 | 18 | 30 |
| 5 | [`IEnumerable<T>`, `IQueryable<T>`, `List<T>` khác nhau thế nào?](#câu-5-ienumerablet-iqueryablet-listt-khác-nhau-thế-nào) | 8 | 18 | 30 |
| 6 | [ORM là gì? Vì sao dùng ORM?](#câu-6-orm-là-gì-vì-sao-dùng-orm) | 8 | 18 | 30 |
| 7 | [Cơ sở dữ liệu: bảng, quan hệ, chuẩn hóa (normalization) là gì?](#câu-7-cơ-sở-dữ-liệu-bảng-quan-hệ-chuẩn-hóa-normalization-là-gì) | 8 | 18 | 30 |
| 8 | [Index trong database là gì? Vì sao cần index?](#câu-8-index-trong-database-là-gì-vì-sao-cần-index) | 8 | 18 | 30 |
| 9 | [Caching là gì? Khi nào cache? Trade-off?](#câu-9-caching-là-gì-khi-nào-cache-trade-off) | 8 | 18 | 30 |
| | **Tổng điểm tối đa** | **72** | **162** | **270** |
| | **Tổng ngưỡng đạt (gợi ý)** | **45** | **126** | **216** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *72* | | |

---

### Câu 1 — Interface và Abstract class khác nhau thế nào?

#### Mục tiêu đánh giá

- Kiến thức OOP nền tảng
- Tư duy thiết kế
- Khả năng giải thích vấn đề
- Kinh nghiệm thực tế
- Hiểu SOLID/testing

#### Đáp án kỳ vọng tổng quát

**Interface**

- Là "hợp đồng" (contract)
- Chỉ định nghĩa hành vi
- Không chứa state thực thể truyền thống
- Một class có thể implement nhiều interface

```csharp
public interface ILogger
{
    void Log(string message);
}
```

**Abstract class**

- Là lớp cơ sở chưa hoàn chỉnh
- Có thể chứa: implementation, field, property, constructor
- Dùng để chia sẻ logic chung

```csharp
public abstract class Animal
{
    public void Eat()
    {
        Console.WriteLine("Eating");
    }

    public abstract void Sound();
}
```

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Trả lời được interface là contract | +1 |
| Trả lời được abstract class là base class có thể chứa logic | +1 |
| Biết interface không tạo instance trực tiếp | +1 |
| Biết abstract class cũng không tạo instance trực tiếp | +1 |
| Biết một class có thể implement nhiều interface | +1 |
| Đưa được ví dụ đơn giản | +1 |
| Giải thích được cho người non-tech hiểu | +1 |
| Phân biệt được "định nghĩa hành vi" và "chia sẻ logic" | +1 |

**Ví dụ trả lời đạt Junior:** Interface giống như "cam kết" một đối tượng phải làm được gì (ví dụ `IAttendance`). Abstract class giống như "mẫu cha" có sẵn logic dùng chung (ví dụ `Animal` có `Eat()` nhưng mỗi con vật có tiếng kêu khác nhau).

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không phân biệt được interface và class thường | Fail nền tảng |
| Nghĩ interface dùng để inheritance code | Sai concept |
| Không đưa được ví dụ thực tế | Học thuộc |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt được khi nào dùng interface | +1 |
| Phân biệt được khi nào dùng abstract class | +1 |
| Đưa được ví dụ thực tế trong project | +1 |
| Biết interface giúp loose coupling | +1 |
| Biết abstract class giúp reuse logic | +1 |
| Hiểu nhiều inheritance gây coupling | +1 |
| Hiểu composition vs inheritance | +1 |
| Nêu được rủi ro over-engineering interface | +1 |
| Biết dependency injection thường dùng interface | +1 |
| Phân tích được maintainability | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| "Cứ interface là tốt hơn" | Không hiểu trade-off |
| Lạm dụng abstract inheritance chain | Thiếu kinh nghiệm maintain |
| Không hiểu DI dùng interface để làm gì | Thiếu kiến trúc backend |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Chỉ ra interface giúp unit test/mock dễ hơn | +1 |
| Hiểu mocking framework hoạt động với interface | +1 |
| Liên hệ Dependency Inversion Principle | +1 |
| Liên hệ Open/Closed Principle | +1 |
| Phân tích impact tới scalability | +1 |
| Phân tích impact tới maintainability | +1 |
| Chỉ ra inheritance quá sâu gây rigid architecture | +1 |
| Biết prefer composition over inheritance | +1 |
| Đưa ví dụ refactor thực tế | +1 |
| Biết khi nào KHÔNG cần interface | +1 |
| Phân tích impact tới onboarding/teamwork | +1 |
| Nêu được architectural trade-off | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Nếu hệ thống chỉ có đúng 1 implementation thì có cần interface không?** → anti over-engineering, pragmatic mindset
2. **Abstract class và composition cái nào tốt hơn?** → design maturity, maintainability awareness
3. **Nếu abstract class sửa method base thì impact gì?** → backward compatibility, architecture risk

---

### Câu 2 — `class` và `struct` khác nhau như thế nào?

#### Mục tiêu đánh giá

- Hiểu reference type vs value type
- Tư duy chọn kiểu dữ liệu phù hợp
- Nhận biết tác động hiệu năng cơ bản
- Kinh nghiệm thiết kế API

#### Đáp án kỳ vọng tổng quát

| | `class` | `struct` |
|---|---------|----------|
| Loại | Reference type | Value type |
| Mặc định | `null` được phép | Không thể `null` (trừ nullable struct) |
| Kế thừa | Class kế thừa class | Struct không kế thừa struct; implement interface được |
| Copy | Biến giữ **tham chiếu** | Gán/copy theo **giá trị** |
| Heap | Thường cấp phát trên heap | Thường trên stack (hoặc inline trong object cha) |

```csharp
public class PointClass { public int X, Y; }
public struct PointStruct { public int X, Y; }

var a = new PointClass { X = 1 };
var b = a; b.X = 2; // a.X cũng = 2 (cùng tham chiếu)

var s1 = new PointStruct { X = 1 };
var s2 = s1; s2.X = 2; // s1.X vẫn = 1 (copy giá trị)
```

**Khi nào dùng struct:** dữ liệu nhỏ, immutable hoặc ít mutate, không cần identity (ví dụ `DateTime`, `Guid`, tọa độ). **Khi nào dùng class:** entity có identity, kế thừa, lifecycle phức tạp.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Nêu được class là reference type | +1 |
| Nêu được struct là value type | +1 |
| Hiểu gán class = copy tham chiếu | +1 |
| Hiểu gán struct = copy giá trị | +1 |
| Biết struct không kế thừa struct | +1 |
| Đưa được ví dụ đơn giản | +1 |
| Giải thích được bằng ngôn ngữ đời thường | +1 |
| Biết `new` với class vs struct cơ bản | +1 |

**Ví dụ trả lời đạt Junior:** Class giống như “địa chỉ nhà” — hai người cùng trỏ một nhà thì sửa nhà là cả hai thấy. Struct giống “photocopy tờ giấy” — sửa bản copy không đổi bản gốc.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không phân biệt được reference/value | Fail nền tảng |
| Nghĩ struct luôn nhanh hơn mọi trường hợp | Hiểu hời hợt |
| Dùng struct cho entity lớn, mutable | Thiếu kinh nghiệm |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Giải thích boxing/unboxing | +1 |
| Biết struct lớn (>16 bytes gợi ý) có thể chậm do copy | +1 |
| Hiểu nullable value type (`int?`) | +1 |
| Biết `readonly struct`, immutability | +1 |
| Phân tích khi nào **không** nên dùng struct | +1 |
| Hiểu struct trong collection (copy cost) | +1 |
| Biết `record class` vs `record struct` (C# 9+) | +1 |
| Đưa ví dụ thực tế trong project | +1 |
| Hiểu equality mặc định struct vs class | +1 |
| Nêu được trade-off maintainability | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Struct mutable lớn trong API public | Thiết kế kém |
| Không biết boxing khi cast sang `object` | Thiếu hiệu năng cơ bản |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Phân tích GC pressure khi struct lớn trong object graph | +1 |
| Hiểu `in`/`ref`/`out` với struct | +1 |
| Biết defensive copy với readonly API | +1 |
| Phân tích API design: DTO nên class hay struct | +1 |
| Liên hệ performance profiling thực tế | +1 |
| Hiểu `Span<T>`, stackalloc (nếu có kinh nghiệm) | +1 |
| Đánh giá impact versioning public struct | +1 |
| Nêu khi nào refactor struct → class | +1 |
| Phân tích team onboarding (struct misuse) | +1 |
| Trade-off distributed system (serialization) | +1 |
| Biết `IEquatable<T>` cho struct | +1 |
| Architectural guideline cho team | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Struct có thể `null` không?** → nullable value types
2. **List\<struct lớn\> vs List\<class\> — cái nào tốt hơn?** → copy cost, GC
3. **Khi nào `record struct` phù hợp?** → immutability, value semantics

---

### Câu 3 — `Equals()`, `GetHashCode()` và `==` có vai trò gì?

#### Mục tiêu đánh giá

- Hiểu equality contract trong .NET
- Sử dụng đúng collection băm (`Dictionary`, `HashSet`)
- Tránh bug logic khi so sánh object
- Kinh nghiệm override đúng chuẩn

#### Đáp án kỳ vọng tổng quát

- **`==`**: toán tử so sánh; có thể overload; với `string` so sánh giá trị; với class mặc định so sánh **reference** (cùng instance).
- **`Equals(object)`**: so sánh **logic** (nội dung); virtual, có thể override.
- **`GetHashCode()`**: sinh mã băm; dùng trong hash table. **Quy tắc:** nếu `a.Equals(b)` thì `a.GetHashCode() == b.GetHashCode()`.

```csharp
public class User : IEquatable<User>
{
    public int Id { get; init; }
    public string Email { get; init; } = "";

    public bool Equals(User? other) =>
        other is not null && Id == other.Id;

    public override bool Equals(object? obj) => Equals(obj as User);

    public override int GetHashCode() => Id.GetHashCode();
}
```

**Lưu ý:** `record` tự sinh equality members. Không override `Equals` mà quên `GetHashCode` → bug khó tìm trong `Dictionary`.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết `Equals()` so sánh nội dung (logic) | +1 |
| Biết `==` với class thường so reference | +1 |
| Biết `string` dùng `==` so giá trị | +1 |
| Biết `GetHashCode()` liên quan collection băm | +1 |
| Biết override `Equals` nên override `GetHashCode` | +1 |
| Đưa ví dụ `Dictionary`/`HashSet` | +1 |
| Giải thích được bằng ví dụ đơn giản | +1 |
| Biết `object.ReferenceEquals` cơ bản | +1 |

**Ví dụ trả lời đạt Junior:** Hai object class khác instance nhưng cùng `Id` — `==` có thể false nhưng `Equals` custom có thể true nếu override theo `Id`.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không biết khác `==` và `Equals` | Fail nền tảng |
| Override `Equals` không override `GetHashCode` | Bug tiềm ẩn |
| Nghĩ `GetHashCode` phải unique tuyệt đối | Hiểu sai |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Hiểu equality contract đầy đủ (reflexive, symmetric, transitive) | +1 |
| Biết `IEquatable<T>` tránh boxing | +1 |
| Hiểu `EqualityComparer<T>.Default` | +1 |
| Biết so sánh floating point cần epsilon | +1 |
| Hiểu mutable object trong `HashSet` nguy hiểm | +1 |
| Biết `record` auto equality | +1 |
| Đưa ví dụ bug production do hash sai | +1 |
| Hiểu `StringComparison` khi so sánh chuỗi | +1 |
| Biết `SequenceEqual` cho collection | +1 |
| Phân tích performance `GetHashCode` | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Dùng mutable field trong `GetHashCode` | Thiết kế nguy hiểm |
| So sánh `double` bằng `==` không epsilon | Bug logic |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Hiểu distributed cache key từ hash/equality | +1 |
| Phân tích collision và bucket performance | +1 |
| Biết `IEqualityComparer<T>` custom cho domain | +1 |
| Hiểu versioning entity ảnh hưởng equality | +1 |
| Đánh giá khi dùng identity (reference) vs value equality | +1 |
| Liên hệ DDD: entity identity | +1 |
| Phân tích thread-safety khi equality phụ thuộc state mutable | +1 |
| Biết `HashCode.Combine` best practice | +1 |
| Refactor case study | +1 |
| Impact testing (equality edge cases) | +1 |
| Guideline cho team về override equality | +1 |
| Trade-off serialization + equality | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Sửa property sau khi add vào `HashSet` — chuyện gì xảy ra?** → broken hash bucket
2. **`record` vs class manual equality — chọn nào?** → boilerplate, immutability
3. **So sánh object graph sâu — làm thế nào?** → shallow vs deep, performance

---

### Câu 4 — `async`/`await` hoạt động như thế nào?

#### Mục tiêu đánh giá

- Hiểu async thật hay chỉ copy code
- Kiến thức thread/task
- Kinh nghiệm production
- Khả năng debug deadlock/performance
- Scalability mindset

#### Đáp án kỳ vọng tổng quát

- `async/await` giúp viết code bất đồng bộ dễ đọc hơn callback.
- Chủ yếu phục vụ **I/O-bound** (DB, HTTP, file) — giải phóng thread trong lúc chờ I/O.
- `await` **không** mặc định tạo thread mới; tiếp tục trên context phù hợp khi I/O xong.
- `Task` ≠ thread; một thread có thể xử lý nhiều `Task` I/O-bound.
- Async **không** làm CPU-bound nhanh hơn; CPU-bound cần `Task.Run` hoặc parallel API có chủ đích.

```csharp
public async Task<User?> GetUserAsync(int id, CancellationToken ct)
{
    return await _db.Users.AsNoTracking()
        .FirstOrDefaultAsync(u => u.Id == id, ct);
}
```

**Anti-pattern:** `.Result` / `.Wait()` trên UI hoặc ASP.NET có `SynchronizationContext` → deadlock.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết async/await dùng cho bất đồng bộ | +1 |
| Biết tránh block thread/UI | +1 |
| Biết dùng `Task` | +1 |
| Biết dùng `await` | +1 |
| Biết method `async` trả về `Task`/`Task<T>` | +1 |
| Đưa ví dụ gọi API/DB async | +1 |
| Giải thích bằng ví dụ đời thường (đặt món chờ) | +1 |
| Biết không dùng `async void` (trừ event handler) | +1 |

**Ví dụ trả lời đạt Junior:** Async giống đặt đồ ăn rồi làm việc khác; khi món lên (I/O xong) quay lại xử lý tiếp.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| "Async tạo thread mới" | Sai nền tảng |
| "Dùng async là nhanh hơn" (mọi case) | Hiểu sai |
| `async void` khắp nơi | Khó debug |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt CPU-bound vs I/O-bound | +1 |
| Biết `await` không tạo thread mới | +1 |
| Hiểu thread pool cơ bản | +1 |
| Biết nguy cơ `.Result`/`.Wait()` deadlock | +1 |
| Biết `CancellationToken` | +1 |
| Biết async all the way (không mix sync) | +1 |
| Hiểu `Task.WhenAll` / `WhenAny` | +1 |
| Hiểu impact throughput API | +1 |
| Biết `ValueTask` khi nào cân nhắc | +1 |
| Đưa ví dụ fix deadlock thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không biết cancellation | Thiếu production |
| `Task.Run` bọc mọi thứ “cho async” | Lãng phí thread |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Giải thích `SynchronizationContext` | +1 |
| Hiểu `ConfigureAwait(false)` trong library | +1 |
| Hiểu thread pool starvation/exhaustion | +1 |
| Phân tích async impact scalability | +1 |
| Hiểu backpressure | +1 |
| Biết async overhead/allocation | +1 |
| Ví dụ production incident thật | +1 |
| Biết khi nào **không** nên async | +1 |
| Hiểu async DB/socket/file I/O stack | +1 |
| Phân tích memory với nhiều concurrent request | +1 |
| Guideline team về async API | +1 |
| Trade-off observability (async stack trace) | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Vì sao `.Result` gây deadlock trong ASP.NET cũ?** → SynchronizationContext
2. **`Task.Run` trong request pipeline có ổn không?** → thread pool, latency
3. **Khi nào dùng `IAsyncEnumerable`?** → streaming large data

---

### Câu 5 — `IEnumerable<T>`, `IQueryable<T>`, `List<T>` khác nhau thế nào?

#### Mục tiêu đánh giá

- Hiểu LINQ và deferred execution
- Tránh load dữ liệu thừa / query ngoài ý muốn
- Kinh nghiệm EF Core / ORM
- Tư duy tối ưu truy vấn

#### Đáp án kỳ vọng tổng quát

| Kiểu | Vai trò |
|------|---------|
| `List<T>` | Collection cụ thể trong memory; index O(1); đã materialize |
| `IEnumerable<T>` | Duyệt tuần tự; LINQ to Objects; deferred execution trong memory |
| `IQueryable<T>` | Biểu diễn query; provider dịch sang SQL (EF); execution deferred tới DB |

```csharp
// IQueryable — filter chạy trên SQL
var q = _db.Orders.Where(o => o.Total > 1000);

// IEnumerable — đã load hoặc xử lý in-memory
List<Order> list = q.ToList();
var filtered = list.Where(o => o.Status == "Paid"); // LINQ to Objects
```

**Rủi ro:** gọi `AsEnumerable()` quá sớm → kéo hết data về memory. Multiple enumeration `IEnumerable` → query/iterate lặp.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết `List<T>` là danh sách trong memory | +1 |
| Biết `IEnumerable<T>` có thể foreach | +1 |
| Biết `IQueryable<T>` liên quan query DB | +1 |
| Biết `ToList()` materialize | +1 |
| Đưa ví dụ LINQ filter đơn giản | +1 |
| Giải thích deferred vs immediate cơ bản | +1 |
| Biết không foreach `IQueryable` nhiều lần tùy tiện | +1 |
| Đưa ví dụ thực tế CRUD | +1 |

**Ví dụ trả lời đạt Junior:** `List` như thùng hàng đã bốc xuống kho; `IQueryable` như phiếu yêu cầu kho — chưa lấy hàng cho đến khi `ToList()`/`ToListAsync()`.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không biết `List` vs `IEnumerable` | Fail nền tảng |
| Load hết bảng rồi filter in-memory “cho dễ” | Thiếu DB sense |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Hiểu deferred execution chi tiết | +1 |
| Biết expression tree vs delegate | +1 |
| Hiểu `AsNoTracking`, projection `Select` | +1 |
| Biết method không translate sang SQL (client eval) | +1 |
| Hiểu multiple enumeration risk | +1 |
| Biết ` IAsyncEnumerable` cơ bản | +1 |
| Tránh `Count()` trước khi cần | +1 |
| Đưa ví dụ N+1 liên quan | +1 |
| Biết pagination `Skip`/`Take` trên `IQueryable` | +1 |
| Phân tích memory khi materialize sớm | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Gọi `.ToList()` đầu pipeline mọi nơi | Performance kém |
| Dùng custom method trong `Where` không translate | Client eval bất ngờ |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Đọc được SQL log / explain plan | +1 |
| Thiết kế repository trả `IQueryable` có kiểm soát | +1 |
| Phân tích leak `IQueryable` qua layer | +1 |
| Biết compiled query / split query EF | +1 |
| Trade-off CQRS read model | +1 |
| Streaming large dataset | +1 |
| Impact microservice boundary (không share `IQueryable` cross service) | +1 |
| Guideline team LINQ | +1 |
| Refactor case study | +1 |
| Testing với in-memory provider limitations | +1 |
| Performance benchmark thực tế | +1 |
| Architectural boundary DAL | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **`AsEnumerable()` đặt ở đâu trong pipeline?** → where filtering runs
2. **Tại sao không trả `IQueryable` ra API controller?** → encapsulation, security
3. **`First()` vs `FirstOrDefault()` trên empty query?** → exception, UX

---

### Câu 6 — ORM là gì? Vì sao dùng ORM?

#### Mục tiêu đánh giá

- Hiểu mapping object–relational
- Kinh nghiệm EF Core / LINQ
- Nhận biết trade-off ORM vs raw SQL
- Tư duy productivity vs control

#### Đáp án kỳ vọng tổng quát

**ORM (Object-Relational Mapping)** ánh xạ bảng/cột DB sang class/property trong code, cho phép thao tác dữ liệu bằng object thay vì SQL thuần từng dòng.

**Lợi ích:** productivity, type-safe query (LINQ), migration/schema tooling, ít boilerplate CRUD, portability giữa provider (mức độ nhất định).

**Nhược điểm:** query phức tạp khó tối ưu, N+1, abstraction leak, khó debug SQL sinh ra, overhead so với Dapper/raw SQL.

**Ví dụ .NET:** Entity Framework Core, Dapper (micro-ORM), NHibernate.

```csharp
public class Order
{
    public int Id { get; set; }
    public List<OrderLine> Lines { get; set; } = new();
}
// EF map Order -> Orders table, Lines -> OrderLines
```

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Giải thích được ORM là gì | +1 |
| Biết ORM map table ↔ class | +1 |
| Nêu lợi ích (ít viết SQL CRUD) | +1 |
| Biết EF Core là ORM phổ biến .NET | +1 |
| Đưa ví dụ entity + DbSet | +1 |
| Giải thích cho non-tech được | +1 |
| Biết ORM không thay thế hiểu DB | +1 |
| Nêu nhược điểm cơ bản (chậm nếu dùng sai) | +1 |

**Ví dụ trả lời đạt Junior:** ORM giống phiên dịch — code nói “lấy User có Id=1”, ORM dịch sang `SELECT ...`.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không biết ORM là gì | Fail backend cơ bản |
| Nghĩ ORM “không cần biết SQL” | Nguy hiểm production |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| So sánh EF Core vs Dapper | +1 |
| Biết migration/schema evolution | +1 |
| Hiểu change tracking cơ bản | +1 |
| Biết eager vs lazy loading | +1 |
| Nhận diện N+1 | +1 |
| Biết raw SQL / `FromSql` khi cần | +1 |
| Hiểu unit of work / DbContext scope | +1 |
| Đưa ví dụ tối ưu query thực tế | +1 |
| Biết transaction với ORM | +1 |
| Trade-off testability | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không bao giờ xem SQL generated | Thiếu debug skill |
| Lazy load mặc định mọi navigation | Performance trap |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế bounded context: ORM per module | +1 |
| Hybrid EF + Dapper cho hot path | +1 |
| Phân tích migration risk production | +1 |
| Global query filter, multi-tenant | +1 |
| Concurrency token / optimistic locking | +1 |
| Read replica / split read-write | +1 |
| Impact team velocity vs SQL expertise | +1 |
| Guideline khi **không** dùng ORM | +1 |
| Observability (slow query, interceptor) | +1 |
| Refactor legacy ADO → EF case | +1 |
| Trade-off microservice per database | +1 |
| Data migration zero-downtime | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Khi nào chọn Dapper thay EF?** → hot path, complex report
2. **Code First vs Database First — trade-off?** → team workflow
3. **ORM trong microservice chia DB thế nào?** → bounded context

---

### Câu 7 — Cơ sở dữ liệu: bảng, quan hệ, chuẩn hóa (normalization) là gì?

#### Mục tiêu đánh giá

- Hiểu mô hình dữ liệu quan hệ
- Thiết kế schema cơ bản
- Tránh redundancy và anomaly
- Nền tảng cho EF modeling

#### Đáp án kỳ vọng tổng quát

**Bảng (table):** tập bản ghi cùng cấu trúc (cột). **Khóa chính (PK)** định danh dòng. **Khóa ngoại (FK)** liên kết bảng.

**Quan hệ:** 1-1, 1-n, n-n (qua bảng trung gian). Ví dụ: `Customer` 1-n `Order`; `Student` n-n `Course` qua `Enrollment`.

**Chuẩn hóa (normalization):** tổ chức dữ liệu giảm trùng lặp, tránh update/delete/insert anomaly. Thường nhắc tới **1NF, 2NF, 3NF** (conceptual):
- **1NF:** giá trị nguyên tử, không lặp cột động
- **2NF:** không phụ thuộc bộ phận vào composite key
- **3NF:** không phụ thuộc bắc cầu giữa cột non-key

**Denormalize có chủ đích:** read performance, reporting — chấp nhận redundancy có kiểm soát.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết table, row, column | +1 |
| Biết primary key | +1 |
| Biết foreign key | +1 |
| Phân biệt 1-n cơ bản | +1 |
| Biết n-n cần bảng trung gian | +1 |
| Giải thích normalization “giảm trùng lặp” | +1 |
| Vẽ/diễn tả ER đơn giản | +1 |
| Đưa ví dụ domain (order, user) | +1 |

**Ví dụ trả lời đạt Junior:** Không nhét tên category lặp lại mỗi dòng `Product` — tách bảng `Category` và FK.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không biết FK | Fail DB cơ bản |
| Mọi thứ một bảng wide | Thiết kế kém |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Giải thích insert/update/delete anomaly | +1 |
| Biết unique constraint, index trên FK | +1 |
| Hiểu cascade delete vs restrict | +1 |
| Biết soft delete pattern | +1 |
| Thiết kế audit column (`CreatedAt`) | +1 |
| Hiểu surrogate key vs natural key | +1 |
| Biết khi denormalize có lý do | +1 |
| Mapping EF relationship (required/optional) | +1 |
| Đưa ví dụ migration schema | +1 |
| Trade-off join vs duplicate column | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Cascade delete mù quáng | Mất dữ liệu |
| Không index FK | Query chậm |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế multi-tenant schema | +1 |
| Partitioning / sharding concept | +1 |
| Event sourcing vs relational model | +1 |
| Data retention, archival | +1 |
| Cross-service data ownership | +1 |
| Zero-downtime schema change | +1 |
| Compliance (PII column encryption) | +1 |
| Read model CQRS | +1 |
| Capacity planning (row growth) | +1 |
| Team ER review process | +1 |
| Legacy schema refactor strategy | +1 |
| Trade-off BCNF vs delivery speed | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Soft delete ảnh hưởng unique index thế nào?** → filtered unique index
2. **Surrogate key `Guid` vs `int identity`?** → scale, index fragmentation
3. **Khi nào tách database theo service?** → bounded context

---

### Câu 8 — Index trong database là gì? Vì sao cần index?

#### Mục tiêu đánh giá

- Hiểu tăng tốc truy vấn
- Nhận biết chi phí ghi (write)
- Chọn cột index cơ bản
- Liên kết với EF / SQL thực tế

#### Đáp án kỳ vọng tổng quát

**Index** là cấu trúc phụ (thường B-Tree) giúp DB tìm row nhanh hơn thay vì full table scan.

**Lợi ích:** tăng tốc `WHERE`, `JOIN`, `ORDER BY` trên cột được index (đúng thứ tự composite).

**Chi phí:** chậm hơn khi `INSERT`/`UPDATE`/`DELETE`; tốn disk; index sai → không dùng được.

**Loại (conceptual):** clustered (xác định thứ tự vật lý — SQL Server PK thường clustered), non-clustered, unique index, composite index, covering index (INCLUDE columns).

```sql
CREATE INDEX IX_Orders_CustomerId_CreatedAt
ON Orders (CustomerId, CreatedAt DESC);
```

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết index giúp query nhanh hơn | +1 |
| Biết index gắn với cột thường tìm kiếm | +1 |
| Biết PK thường có index | +1 |
| Biết quá nhiều index có hại | +1 |
| Đưa ví dụ `WHERE Email = ...` | +1 |
| Giải thích full scan vs index seek đơn giản | +1 |
| Biết FK nên có index (concept) | +1 |
| Đưa ví dụ thực tế | +1 |

**Ví dụ trả lời đạt Junior:** Index như mục lục sách — tìm chương không cần đọc từ trang 1.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Index mọi cột | Thiếu hiểu trade-off |
| Không biết index là gì | Fail DB |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Hiểu composite index left-prefix rule | +1 |
| Biết unique index | +1 |
| Hiểu clustered vs non-clustered (concept) | +1 |
| Đọc execution plan cơ bản | +1 |
| Biết index không giúp `LIKE '%x'` | +1 |
| Biết selectivity | +1 |
| Index cho sort/pagination | +1 |
| Đưa ví dụ fix slow query bằng index | +1 |
| Hiểu included/covering column | +1 |
| Trade-off write-heavy table | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Index `(Status)` trên cột 2 giá trị duy nhất | Selectivity thấp |
| Không bao giờ xem execution plan | Thiếu thực chiến |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Index maintenance, fragmentation | +1 |
| Filtered index | +1 |
| Index trên JSON column (provider-specific) | +1 |
| Monitoring missing index DMV / pg_stat | +1 |
| Index strategy multi-tenant | +1 |
| Partition-aligned index | +1 |
| Impact migration lock time | +1 |
| Guid PK index fragmentation mitigation | +1 |
| Team index review checklist | +1 |
| Trade-off OLTP vs OLAP indexing | +1 |
| Hypothetical index test | +1 |
| Cost model disk/memory | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Composite index `(A,B)` dùng cho query chỉ `WHERE B`?** → left prefix
2. **Index có giúp `COUNT(*)` không?** → depends on plan
3. **Khi nào xóa index không dùng?** → monitoring, write perf

---

### Câu 9 — Caching là gì? Khi nào cache? Trade-off?

#### Mục tiêu đánh giá

- Hiểu giảm tải DB/API
- Nhận biết consistency và stale data
- Conceptual foundation trước Redis thực chiến
- Tư duy đúng/sai khi cache

#### Đáp án kỳ vọng tổng quát

**Caching:** lưu bản sao dữ liệu/tính toán ở tầng nhanh hơn (memory, CDN) để phục vụ request sau nhanh hơn.

**Khi nào:** read-heavy, dữ liệu ít đổi, chi phí tính toán cao, traffic spike.

**Trade-off:**
- **Pros:** latency thấp, giảm load DB
- **Cons:** stale data, invalidation phức tạp, memory cost, bug consistency distributed

**Pattern (concept):** cache-aside, read-through, write-through, TTL.

```
Request → Check cache → hit: return
                     → miss: load DB → set cache → return
```

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Giải thích cache là gì | +1 |
| Biết cache giúp nhanh hơn | +1 |
| Biết dữ liệu cache có thể “cũ” | +1 |
| Nêu ví dụ (cache danh mục, config) | +1 |
| Biết TTL concept | +1 |
| Giải thích đơn giản cho non-tech | +1 |
| Biết không cache mọi thứ | +1 |
| Đưa ví dụ `IMemoryCache` hoặc tương đương | +1 |

**Ví dụ trả lời đạt Junior:** Cache giống ghi nhớ câu trả lời hay dùng — hỏi lại lần sau không cần mở sách (DB) ngay.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Cache dữ liệu nhạy cảm không mã hóa | Security risk |
| Nghĩ cache thay DB | Sai kiến trúc |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt in-memory vs distributed cache | +1 |
| Biết cache key design | +1 |
| Hiểu cache-aside flow | +1 |
| Biết invalidation khi update | +1 |
| Hiểu thundering herd | +1 |
| Biết cache stampede mitigation (lock, early expiry) | +1 |
| TTL vs sliding expiration | +1 |
| Đưa ví dụ stale data bug | +1 |
| Biết không cache personalized secret per user sai cách | +1 |
| Trade-off memory limit | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không có chiến lược invalidate | Data inconsistency |
| Cache object mutable shared | Race bug |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Cache consistency multi-instance | +1 |
| Redis cluster / eviction policy | +1 |
| Cache penetration/breakdown/snowball (concepts) | +1 |
| Event-driven invalidation | +1 |
| CDN edge cache API | +1 |
| Observability hit rate metrics | +1 |
| Security (cache poisoning) | +1 |
| Financial/strong consistency — khi không cache | +1 |
| Team caching guideline | +1 |
| Load test prove cache benefit | +1 |
| Trade-off microservice local vs global cache | +1 |
| Disaster: cache flush impact | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Cache miss đồng thời 10k request — xử lý?** → stampede, single flight
2. **Update DB nhưng cache cũ — ai chịu trách nhiệm invalidate?** → ownership
3. **Dữ liệu financial balance có cache không?** → consistency requirement

---

