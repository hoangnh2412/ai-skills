// tests/{Product}.ArchitectureTests/LayerDependencyTests.cs
// R1–R7: hướng phụ thuộc + chỗ đặt code. Chạy: dotnet test -c Debug
// Luật đỏ ⇒ sửa CODE, không sửa luật. Xem workflows/add-arch-test.md mục "Khi luật đỏ".

using Xunit;
using static ArchUnitNET.Fluent.ArchRuleDefinition;
using static {Product}.ArchitectureTests.ArchitectureFixture;

namespace {Product}.ArchitectureTests;

public class LayerDependencyTests
{
  [Fact] // R1 — Domain là lõi, không biết gì về tầng ngoài
  public void Domain_khong_phu_thuoc_tang_ngoai() =>
    Types().That().Are(Domain)
      .Should().NotDependOnAny(Application)
      .AndShould().NotDependOnAny(Infrastructure)
      .AndShould().NotDependOnAny(Host)
      .Because("Domain là lõi — mọi phụ thuộc hướng vào trong")
      .Check(Architecture);

  [Fact] // R2 — persistence là việc của Infrastructure
  public void Domain_khong_cham_EntityFramework() =>
    Types().That().Are(Domain)
      .Should().NotDependOnAny(Types().That().ResideInNamespace("Microsoft.EntityFrameworkCore", true))
      .Because("Jarvis.DDD.Domain không reference EF; adapter EF thuộc Infrastructure")
      // CỐ Ý không cấm Newtonsoft.Json và Microsoft.Extensions.* —
      // Jarvis.DDD.Domain.Shared và Jarvis.DDD.Domain dùng chúng, cấm là đỏ oan.
      .Check(Architecture);

  [Fact] // R3 — use case không biết adapter
  public void Application_khong_phu_thuoc_Infrastructure_va_Host() =>
    Types().That().Are(Application)
      .Should().NotDependOnAny(Infrastructure)
      .AndShould().NotDependOnAny(Host)
      .Because("use case không biết database hay web framework")
      .Check(Architecture);

  [Fact] // R4 — Jarvis.DDD.Application không có FrameworkReference nào
  public void Application_khong_cham_AspNetCore_Mvc() =>
    Types().That().Are(Application)
      .Should().NotDependOnAny(Types().That().ResideInNamespace("Microsoft.AspNetCore.Mvc", true))
      .AndShould().NotDependOnAny(Types().That().ResideInNamespace("Microsoft.AspNetCore.Http", true))
      .Because("delivery là việc của Host")
      .Check(Architecture);

  [Fact] // R5 — controller gọi dispatcher, không chạm persistence
  public void Controller_khong_inject_persistence() =>
    Types().That().Are(Controllers)
      .Should().NotDependOnAny(Infrastructure)
      .AndShould().NotDependOnAny(Types().That().HaveNameEndingWith("DbContext"))
      .Because("controller mỏng — đi qua ICommandDispatcher/IQueryDispatcher")
      .Check(Architecture);

  [Fact] // R6 — quy ước minipower, KHÔNG rút từ Jarvis (Sample/ của Jarvis là project đơn)
  public void Controller_khong_lo_kieu_Domain_ra_API() =>
    Types().That().Are(Controllers)
      .Should().NotDependOnAny(Domain)
      .Because("API trả DTO/primitive/ID, không trả entity domain")
      .Check(Architecture);

  [Fact] // R7 — handler đặt đúng nhà
  public void Handler_chi_nam_trong_Application() =>
    Types().That().ImplementInterface("Jarvis.DDD.Application.Contracts.Commands.ICommandHandler`2")
      .Or().ImplementInterface("Jarvis.DDD.Application.Contracts.Queries.IQueryHandler`2")
      .Should().Be(Application)
      .Because("use case sống ở Application, không ở Host hay Infrastructure")
      .Check(Architecture);
}
