// {Product}.Infrastructure/DependencyInjection/BlobStoringExtension.cs

using Jarvis.BlobStoring;
using Jarvis.BlobStoring.Extensions;
using Microsoft.Extensions.Hosting;

namespace {Product}.Infrastructure.DependencyInjection;

public static class BlobStoringExtension
{
  public static IHostApplicationBuilder AddBlobStoring(this IHostApplicationBuilder builder)
  {
    builder.AddCoreBlobStoring(o => o.DefaultProvider = nameof(BlobStoringType.FileSystem));
    // .UseMinIO() khi reference Jarvis.BlobStoring.MinIO
    // .UseAwsS3() khi reference Jarvis.BlobStoring.AwsS3
    return builder;
  }
}
