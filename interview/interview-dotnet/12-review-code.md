# Review code — Tìm lỗi trong đoạn code mẫu

> **Yêu cầu:** Đưa đoạn code dưới cho ứng viên (không kèm đáp án). Yêu cầu **chỉ ra từng lỗi/rủi ro**, giải thích và gợi ý sửa.  
> **Thời gian gợi ý:** 20–35 phút.
>
> **Dành cho Senior** — chỉ chấm band Senior.

---

## Mục lục

> **Senior only.**

| Band | Điểm tối đa | Ngưỡng đạt (gợi ý) |
|------|:-----------:|:-------------------:|
| Senior | 12 | 9 |
| *Form* | *15* | |

## Đề bài (đưa cho ứng viên)

Đoạn code sau phục vụ API lấy danh sách đơn hàng và gửi thông báo.  
Hãy **review** và liệt kê các vấn đề về:

- async/await
- N+1 query
- nullable / null safety
- DI lifetime
- logging
- exception handling
- memory leak / resource

```csharp
// OrderNotificationService.cs
L1:  public class OrderNotificationService
L2:  {
L3:      private readonly AppDbContext _db;
L4:      private readonly IEmailSender _email;
L5:      private static EventHandler? _onSent;
L6:
L7:      public OrderNotificationService(AppDbContext db, IEmailSender email)
L8:      {
L9:          _db = db;
L10:          _email = email;
L11:          _onSent += HandleSent; // subscribe instance
L12:      }
L13:
L14:     public async void NotifyPendingOrdersAsync(int customerId)
L15:     {
L16:         var orders = _db.Orders.Where(o => o.CustomerId == customerId).ToList();
L17:
L18:         foreach (var order in orders)
L19:         {
L20:             var items = _db.OrderItems.Where(i => i.OrderId == order.Id).ToList();
L21:             var customer = _db.Customers.Find(order.CustomerId);
L22:
L23:             var total = items.Sum(i => i.Price * i.Quantity);
L24:             var body = $"Order {order.Id} total {total} for {customer.Name}";
L25:
L26:             try
L27:             {
L28:                 _email.SendAsync(customer.Email, "Pending", body).Wait();
L29:             }
L30:             catch (Exception ex)
L31:             {
L32:                 // ignore — sẽ gửi lại sau
L33:             }
L34:
L35:             _logger.LogInformation("Sent email to " + customer.Email + " order " + order.Id);
L36:         }
L37:     }
L38:
L39:     private void HandleSent(object? sender, EventArgs e) { }
L40: }
```

```csharp
// Startup.cs (excerpt)
S1: services.AddSingleton<OrderNotificationService>();
S2: services.AddDbContext<AppDbContext>();
S3: services.AddScoped<IEmailSender, SmtpEmailSender>();
```

---

## Mục tiêu đánh giá

- Đọc code production-style
- Phát hiện anti-pattern phổ biến
- Ưu tiên mức độ nghiêm trọng
- Đề xuất sửa cụ thể

---

## Đáp án kỳ vọng (dành cho interviewer)

| # | Dòng | Vấn đề | Loại | Giải thích / Sửa |
|---|------|--------|------|------------------|
| 1 | **L14** | `async void` | async/await | Dùng `async Task`; `async void` chỉ cho event handler |
| 2 | **L28** | `.Wait()` trên `SendAsync` | async/await | Deadlock risk; dùng `await` |
| 3 | **L20, L21** | Query trong `foreach` (items, customer) | N+1 | `Include` / projection / single query; tránh query mỗi vòng lặp |
| 4 | **L21, L24** | `customer` có thể null từ `Find` | nullable | Null-check trước L24; `customer!.Name` không đủ nếu null |
| 5 | **L28, L35** | `customer.Email` có thể null | nullable | Validate email trước khi gửi / log |
| 6 | **S1**, **L3–L4** | `Singleton` service + `DbContext` / `Scoped` `IEmailSender` | DI lifetime | `AddScoped<OrderNotificationService>`; không inject scoped vào singleton |
| 7 | **L35** | String concat log | structured logging | `LogInformation("Sent email to {Email} order {OrderId}", email, order.Id)` |
| 8 | **L35** | `_logger` không khai báo / không inject | logging | Thêm field + `ILogger<OrderNotificationService>` qua constructor |
| 9 | **L30–L32** | `catch` rỗng / swallow (`ex` không dùng) | exception | `_logger.LogError(ex, ...)`; rethrow hoặc result type |
| 10 | **L11** | `_onSent += HandleSent` trong ctor, không unsubscribe | memory leak | `IDisposable` unsubscribe; tránh giữ reference instance |
| 11 | **L5** | `static EventHandler? _onSent` | memory leak | Static event giữ delegate → GC không thu instance |
| 12 | **L16, L20** | `_db` dùng sync `ToList()` trong method async | async/await | `ToListAsync`, `await` end-to-end |
| 13 | **L14** | Không `CancellationToken` | async/await | `NotifyPendingOrdersAsync(int customerId, CancellationToken ct = default)` |

---

## Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Kiến nghị outbox / queue thay gửi mail sync trong loop | +1 |
| Idempotency gửi notification | +1 |
| Polly retry + không swallow | +1 |
| Observability (trace id per order) | +1 |
| Refactor boundary (application vs infrastructure) | +1 |
| Transaction boundary / consistency user vs email | +1 |
| Static event anti-pattern — giải thích GC root | +1 |
| Code review comment mẫu (constructive) | +1 |
| So sánh mediator/handler pattern | +1 |
| Rate limit email provider | +1 |
| Security: log không lộ PII | +1 |
| Checklist review cho team | +1 |

**Pass criteria:** Senior 9/12

---

## Red flags

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không thấy `.Wait()` / `async void` | Chưa đủ backend async |
| Không thấy N+1 | Chưa làm EF thực tế |
| Không thấy DI lifetime | Chưa production ASP.NET |
| Chỉ nêu naming/style | Thiếu depth |

---

## Follow-up

1. **Viết lại signature và registration đúng lifetime**
2. **Một query LINQ lấy orders + items + customer**
3. **Nếu gửi mail fail — có rollback order không?**
