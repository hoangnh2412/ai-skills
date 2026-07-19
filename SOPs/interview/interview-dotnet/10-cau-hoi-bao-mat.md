# Bộ câu hỏi — Bảo mật

> 3 câu: Auth/Authz, password, JWT/OAuth/OIDC.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 31 | [Authentication và Authorization khác nhau thế nào?](#câu-31-authentication-và-authorization-khác-nhau-thế-nào) | 10 | 22 |
| 32 | [Password nên lưu như thế nào?](#câu-32-password-nên-lưu-như-thế-nào) | 10 | 22 |
| 33 | [Phân biệt JWT, OAuth2, OpenID Connect](#câu-33-phân-biệt-jwt-oauth2-openid-connect) | 10 | 22 |
| | **Tổng điểm tối đa** | **30** | **66** |
| | **Tổng ngưỡng đạt (gợi ý)** | **27** | **54** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *24* | |

---

### Câu 31 — Authentication và Authorization khác nhau thế nào?

#### Mục tiêu đánh giá

- Security foundation
- API/backend protection
- Enterprise auth mindset
- Threat awareness cơ bản

#### Đáp án kỳ vọng tổng quát

| | Authentication | Authorization |
|---|----------------|---------------|
| Mục đích | Xác thực **ai** đang đăng nhập | Xác định **được phép làm gì** |
| Hành vi | Verify identity | Verify permission |
| Ví dụ | Login, password, MFA, JWT subject | Role, policy, claim `can:edit` |

ASP.NET Core: `UseAuthentication()` → `UseAuthorization()`; `[Authorize(Roles = "Admin")]`, policy-based authorization.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt authentication vs authorization | +1 |
| Ví dụ login = authn, role check = authz | +1 |
| Thứ tự `UseAuthentication` → `UseAuthorization` | +1 |
| `[Authorize(Roles = "...")]` cơ bản | +1 |
| JWT là signed token, claims | +1 |
| Validate expiry / issuer cơ bản | +1 |
| HTTPS, không lộ password/token | +1 |
| Session vs bearer token (khái niệm) | +1 |
| Bảo vệ endpoint API | +1 |
| Ví dụ flow đăng nhập ASP.NET Core | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Nhầm authn/authz | Foundation gap |
| Token không expire | Security risk |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| OAuth2 / OIDC integration | +1 |
| SSO architecture | +1 |
| RBAC vs ABAC | +1 |
| Token replay mitigation | +1 |
| Revocation strategy | +1 |
| Zero trust concept | +1 |
| Threat model STRIDE basic | +1 |
| Security audit logging | +1 |
| Multi-tenant auth isolation | +1 |
| Incident credential leak response | +1 |
| Pen test finding remediation | +1 |
| Team security guideline | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **JWT logout thế nào?** → blacklist, short TTL, refresh rotate
2. **API key vs OAuth — khi nào?** → M2M, user delegation
3. **Admin impersonate user — design?** → audit, time-bound

---

### Câu 32 — Password nên lưu như thế nào?

#### Mục tiêu đánh giá

- Credential storage best practice
- Hashing vs encryption
- Attack awareness
- Compliance mindset

#### Đáp án kỳ vọng tổng quát

**Không bao giờ:** plain text, reversible encryption cho password, log password, gửi password email plaintext.

**Nên:** adaptive hashing **bcrypt / scrypt / Argon2** + unique salt per user; verify bằng constant-time compare; rate limit login; MFA cho account nhạy cảm.

```csharp
// ASP.NET Core Identity dùng PBKDF2; có thể cấu hình Argon2 qua package
var hasher = new PasswordHasher<User>();
var hash = hasher.HashPassword(user, plainPassword);
var result = hasher.VerifyHashedPassword(user, hash, plainPassword);
```

**Hash ≠ encrypt:** hash one-way; encrypt reversible — password cần one-way.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Không lưu plain text | +1 |
| Hash one-way (bcrypt/Argon2/PBKDF2) | +1 |
| Salt per user | +1 |
| Dùng `PasswordHasher` / Identity | +1 |
| Không log password | +1 |
| Rate limit / lockout login | +1 |
| Hash ≠ encrypt | +1 |
| MFA awareness | +1 |
| Không gửi password email plaintext | +1 |
| Verify constant-time (concept) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| MD5/SHA1 cho password | Fail security |
| Custom crypto "tự viết" | Critical |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Rainbow table attack explain | +1 |
| Adaptive hashing work factor tuning | +1 |
| Credential stuffing defense | +1 |
| MFA/WebAuthn strategy | +1 |
| Secret rotation policy | +1 |
| Compliance PCI/GDPR password | +1 |
| Breach response playbook | +1 |
| Timing attack awareness | +1 |
| Entropy vs memorability policy | +1 |
| Passwordless/OIDC migration | +1 |
| Security audit password storage | +1 |
| Team never roll own crypto rule | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **User dùng password cũ sau breach —?** → force reset, HIBP check
2. **Argon2 memory cost trên server nhỏ —?** → tune, dedicated auth
3. **Lưu password manager enterprise — khác gì?** → vault, not app DB

---

### Câu 33 — Phân biệt JWT, OAuth2, OpenID Connect

#### Mục tiêu đánh giá

- Modern auth standards
- Integration third-party login
- Token types và flows
- Enterprise IAM

#### Đáp án kỳ vọng tổng quát

| Chuẩn | Vai trò |
|-------|---------|
| **JWT** | Định dạng token (JSON, signed/encrypted); có thể là access token, id token |
| **OAuth 2.0** | Framework **ủy quyền** (authorization) — app được phép truy cập resource thay user, không nhất thiết biết identity đầy đủ |
| **OpenID Connect (OIDC)** | Layer **identity** trên OAuth2 — thêm id token, userinfo, chuẩn login |

**Flow phổ biến:** Authorization Code + **PKCE** (SPA/mobile); không dùng Implicit cho app mới.

```
User → Login Google (OIDC) → id_token (who) + access_token (call API)
API → validate JWT signature, issuer, audience, expiry
```

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| JWT = format token (JSON, signed) | +1 |
| OAuth2 = ủy quyền truy cập resource | +1 |
| OIDC = identity layer trên OAuth2 | +1 |
| Authorization Code flow | +1 |
| PKCE cho SPA/mobile | +1 |
| access_token vs id_token | +1 |
| Validate signature, audience, expiry | +1 |
| Không lưu token localStorage không bảo vệ | +1 |
| Refresh token (khái niệm) | +1 |
| Ví dụ đăng nhập Google/Microsoft | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Nhầm OAuth = login only | Incomplete |
| Implicit flow cho app mới | Outdated practice |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Federation SSO nhiều app | +1 |
| Identity Provider architecture (Entra, Keycloak) | +1 |
| Token introspection vs local validate | +1 |
| JWKS rotation | +1 |
| BFF pattern SPA security | +1 |
| mTLS service auth | +1 |
| Fine-grained consent | +1 |
| Zero trust API gateway | +1 |
| Compliance audit OIDC | +1 |
| Incident token leak revoke | +1 |
| Multi-tenant IdP | +1 |
| Compare SAML legacy migration | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **SPA lưu token đâu an toàn?** → BFF, httpOnly cookie, PKCE
2. **JWT self-contained vs opaque token — chọn?** → revoke, size, introspection
3. **Microservice validate JWT mỗi service — key rotation?** → JWKS endpoint, cache TTL

---

