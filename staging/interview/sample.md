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