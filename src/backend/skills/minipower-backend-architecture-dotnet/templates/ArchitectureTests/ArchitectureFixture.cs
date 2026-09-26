// tests/{Product}.ArchitectureTests/ArchitectureFixture.cs
// Nạp Architecture MỘT lần cho cả suite — LoadAssemblies tốn giây, đừng gọi mỗi test.

using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;
using ArchUnitNET.Loader;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace {Product}.ArchitectureTests;

public static class ArchitectureFixture
{
  public static readonly Architecture Architecture = new ArchLoader()
    .LoadAssemblies(
      typeof({Product}.Domain.Shared.AssemblyMarker).Assembly,
      typeof({Product}.Domain.AssemblyMarker).Assembly,
      typeof({Product}.Application.AssemblyMarker).Assembly,
      typeof({Product}.Infrastructure.AssemblyMarker).Assembly,
      typeof({Product}.Host.AssemblyMarker).Assembly)
    .Build();

  // Không có AssemblyMarker thì dùng một kiểu có thật của layer đó, vd:
  //   typeof({Product}.Domain.Entities.Order).Assembly

  public static readonly IObjectProvider<IType> DomainShared =
    Types().That().ResideInAssembly("{Product}.Domain.Shared").As("Domain.Shared layer");

  public static readonly IObjectProvider<IType> Domain =
    Types().That().ResideInAssembly("{Product}.Domain").As("Domain layer");

  public static readonly IObjectProvider<IType> Application =
    Types().That().ResideInAssembly("{Product}.Application").As("Application layer");

  public static readonly IObjectProvider<IType> Infrastructure =
    Types().That().ResideInAssembly("{Product}.Infrastructure").As("Infrastructure layer");

  public static readonly IObjectProvider<IType> Host =
    Types().That().ResideInAssembly("{Product}.Host").As("Host layer");

  public static readonly IObjectProvider<IType> Controllers =
    Types().That().Are(Host).And().HaveNameEndingWith("Controller").As("Controllers");
}
