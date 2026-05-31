# Live code — Thiết kế tính năng gửi email

> **Yêu cầu:** Ứng viên thiết kế tính năng **gửi email** (welcome, reset password, notification…) ở mức **pseudocode / skeleton** — không cần implement chi tiết từng dòng.  
> **Thời gian gợi ý:** 25–40 phút.
>
> **Dành cho Mid và Senior** — chỉ chấm band Mid/Senior.

---

## Đề bài (đọc cho ứng viên)

Hệ thống ASP.NET Core cần gửi email khi:

- User đăng ký (welcome)
- User quên mật khẩu (reset link)
- Admin gửi thông báo hàng loạt (tùy chọn, bonus)

**Yêu cầu:**

1. Vẽ luồng xử lý (API → service → gửi mail)
2. Pseudocode các class/interface chính
3. Nêu cách xử lý **lỗi**, **retry**, **không block request**
4. (Mid+) Template email, cấu hình SMTP/SendGrid
5. (Senior+) Scale, queue, idempotency, observability

---

## Mục lục

> **Mid và Senior only.**

| Band | Điểm tối đa | Ngưỡng đạt (gợi ý) |
|------|:-----------:|:-------------------:|
| Mid | 10 | 9 |
| Senior (tích lũy) | 22 | 18 |
| *Form* | *16* | |

## Mục tiêu đánh giá

- Tách layer (API / application / infrastructure)
- Async I/O và không block HTTP request
- Cấu hình & bảo mật (secret, không hardcode)
- Khả năng mở rộng (queue, worker)
- Production mindset (log, metric, dead letter)

---

## Đáp án kỳ vọng tổng quát

```text
[API] POST /users/register
  → UserService.CreateUser()
  → IEmailSender.SendAsync(EmailMessage)   // interface
  → [optional] IOutbox / IMessageQueue.Enqueue()
  → Background worker / Hangfire / RabbitMQ consumer
  → SmtpEmailSender / SendGridEmailSender
```

```csharp
// Pseudocode — không cần compile
public interface IEmailSender
{
    Task SendAsync(EmailMessage message, CancellationToken ct = default);
}

public record EmailMessage(string To, string Subject, string HtmlBody, string? TemplateId);

public class RegisterUserHandler
{
    private readonly IUserRepository _users;
    private readonly IEmailSender _email; // hoặc IEmailQueue

    public async Task Handle(RegisterCommand cmd, CancellationToken ct)
    {
        var user = await _users.CreateAsync(cmd, ct);
        await _email.SendAsync(new EmailMessage(
            user.Email, "Welcome", RenderWelcome(user)), ct);
    }
}
```

**Điểm cần nhắc:**

- Gửi mail **async**; tránh `.Result` / block thread
- Secret (`SmtpPassword`, API key) từ **configuration / Key Vault**
- Lỗi gửi mail: log + retry; không rollback user đã tạo (hoặc outbox pattern)
- Template tách khỏi code (Razor/Fluid/scriban)
- Mid+: queue để API trả nhanh; Senior+: idempotency key, DLQ, rate limit provider

---

## Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Template email tách riêng | +1 |
| DI đăng ký `IEmailSender` implementation | +1 |
| Retry policy cơ bản (Polly / vòng lặp có giới hạn) | +1 |
| Không fail cả transaction user nếu mail lỗi (compensating / queue) | +1 |
| `CancellationToken` truyền xuống | +1 |
| Structured log (correlation id / user id) | +1 |
| Validate email định dạng trước khi gửi | +1 |
| Environment-specific config (dev dùng fake sender) | +1 |
| Đề xuất `IHostedService` hoặc background job đơn giản | +1 |
| Test: mock `IEmailSender` trong unit test | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Gửi mail trực tiếp trong controller | Thiếu layer |
| Không xử lý exception SMTP | Chưa production |

---

## Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Outbox pattern hoặc message queue (RabbitMQ/Kafka) | +1 |
| Idempotency (tránh gửi trùng welcome) | +1 |
| Rate limit / throttle theo provider | +1 |
| Dead letter queue khi hết retry | +1 |
| Observability: metric success/fail, latency | +1 |
| Phân tích trade-off sync vs async queue | +1 |
| Bảo mật: không log body chứa reset token | +1 |
| Scale horizontal worker + shared queue | +1 |
| Multi-tenant / template versioning | +1 |
| Disaster: provider down — fallback hoặc degrade | +1 |
| Compliance (opt-out, audit trail) nếu marketing mail | +1 |
| Ước lượng cost SendGrid vs self-host SMTP | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

---

## Follow-up

1. **Nếu SMTP chậm 30s, API đăng ký bị timeout — xử lý?** → queue, fire-and-forget có kiểm soát, không `.Wait()`
2. **Gửi 100k email marketing — thiết kế?** → batch, queue, rate limit, unsubscribe
3. **Cùng một reset link gửi 2 lần — tránh?** → idempotency key, token one-time
