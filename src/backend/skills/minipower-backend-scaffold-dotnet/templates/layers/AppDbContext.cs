using Jarvis.EntityFramework.DataStorages;
using Microsoft.EntityFrameworkCore;

namespace {Product}.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options)
  : BaseStorageContext(options)
{
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
    // modelBuilder.ApplyConfiguration(new ...);
  }
}
