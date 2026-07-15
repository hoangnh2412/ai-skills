// Host — Jarvis authentication (composite: JWT + API Key + Basic)
// Namespace là Jarvis.Authentication.* (theo folder); PackageId là Jarvis.Authentications.* (có "s").
using Jarvis.Authentication;
using Jarvis.Authentication.ApiKey;
using Jarvis.Authentication.Basic;
using Jarvis.Authentication.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Entry point BẮT BUỘC: bind section "Authentication", validate Type lúc startup,
// đăng ký IPasswordPolicyValidator, set Default Authenticate/Challenge scheme,
// rồi gọi callback để satellite thêm scheme. KHÔNG gọi services.AddAuthentication() trực tiếp.
builder.Services.AddJarvisAuthentication(configuration, auth =>
{
    // Composite: forward theo header khi bật ≥ 2 scheme.
    // Đặt Authentication:DefaultAuthenticateScheme = "Composite" trong appsettings.
    // bearerScheme mặc định "Bearer" — truyền tên khác nếu đăng ký JWT dưới scheme khác.
    auth.AddJarvisCompositeScheme(includeBasic: true);

    // JWT Bearer — Authority (OIDC) HOẶC IssuerSigningKeys (symmetric dev/test).
    auth.AddCoreJwtBearer(configuration, JwtBearerDefaults.AuthenticationScheme);

    // API Key — mặc định ConfigApiKeyProvider đọc config; custom IApiKeyProvider cho DB/Redis/vault.
    auth.AddCoreApiKey<ConfigApiKeyProvider>(configuration);

    // Basic — mặc định ConfigBasicCredentialProvider đọc config; custom IBasicCredentialProvider cho DB.
    auth.AddCoreBasic<ConfigBasicCredentialProvider>(configuration);
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthentication();   // trước UseAuthorization
app.UseAuthorization();
app.MapControllers();

app.Run();
