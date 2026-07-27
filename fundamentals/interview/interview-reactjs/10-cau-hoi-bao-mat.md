# Bộ câu hỏi — Bảo mật Frontend

> 3 câu: XSS trong React, token storage & auth frontend, CSP/env/secrets.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 31 | [XSS trong React: rủi ro và cách phòng tránh?](#câu-31-xss-trong-react-rủi-ro-và-cách-phòng-tránh) | 10 | 22 |
| 32 | [Token storage và auth frontend: lưu ở đâu an toàn?](#câu-32-token-storage-và-auth-frontend-lưu-ở-đâu-an-toàn) | 10 | 22 |
| 33 | [CSP, biến môi trường và secrets (`VITE_`, `.env`)?](#câu-33-csp-biến-môi-trường-và-secrets-vite_-env) | 10 | 22 |
| | **Tổng điểm tối đa** | **30** | **66** |
| | **Tổng ngưỡng đạt (gợi ý)** | **27** | **54** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *24* | |

---

### Câu 31 — XSS trong React: rủi ro và cách phòng tránh?

#### Mục tiêu đánh giá

- XSS awareness trong SPA
- React escaping mặc định
- `dangerouslySetInnerHTML` và sanitization
- Threat model cơ bản

#### Đáp án kỳ vọng tổng quát

**XSS (Cross-Site Scripting):** attacker inject script chạy trên browser user — đánh cắp cookie/token, thao tác DOM, keylog.

**React mặc định an toàn:** JSX escape string trong `{}` — `<div>{userInput}</div>` không execute script.

**Rủi ro khi:**

| Trường hợp | Rủi ro |
|------------|--------|
| `dangerouslySetInnerHTML={{ __html: html }}` | HTML không sanitize → XSS |
| URL không validate: `href={userUrl}` với `javascript:alert(1)` | Protocol injection |
| Render HTML từ CMS/rich text editor | Stored XSS |
| Third-party script không tin cậy | Supply chain |

**Phòng tránh:**

```tsx
import DOMPurify from 'dompurify';

// Chỉ khi thật sự cần HTML
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(cmsHtml, { USE_PROFILES: { html: true } })
}} />

// URL — whitelist protocol
const safeUrl = userUrl.startsWith('https://') ? userUrl : '#';
<a href={safeUrl}>Link</a>
```

- Tránh `eval`, `innerHTML` trực tiếp, `document.write`
- CSP (câu 33) là lớp phòng thủ bổ sung
- Không log sensitive data ra console production

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Hiểu XSS là gì và impact | +1 |
| React escape JSX mặc định | +1 |
| Rủi ro `dangerouslySetInnerHTML` | +1 |
| Sanitize (DOMPurify hoặc tương đương) | +1 |
| Validate URL / không tin user HTML | +1 |
| Stored vs reflected XSS (khái niệm) | +1 |
| Không dùng `eval` / inline script user data | +1 |
| Rich text editor cần sanitize server + client | +1 |
| CSP awareness | +1 |
| Ví dụ thực tế (CMS, comment) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| "React tự chống XSS nên không lo" | Incomplete — bỏ qua dangerouslySetInnerHTML |
| Render HTML CMS không sanitize | Critical |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| CSP nonce/hash strategy | +1 |
| Trusted Types (concept) | +1 |
| Supply chain script audit | +1 |
| Pen test XSS remediation workflow | +1 |
| Sanitize policy theo use case (markdown vs full HTML) | +1 |
| DOM-based XSS vector (postMessage, fragment) | +1 |
| Security review checklist cho PR | +1 |
| Encode context-aware (HTML vs URL vs JS) | +1 |
| Third-party widget isolation (iframe sandbox) | +1 |
| Team training XSS case study | +1 |
| Bug bounty / responsible disclosure | +1 |
| Balance UX rich content vs security | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Markdown user-generated — render thế nào?** → parser safe subset, sanitize output, no raw HTML
2. **`target="_blank"` without `rel="noopener"` — rủi ro?** → tabnabbing
3. **JSON-LD inject từ API — XSS?** → validate schema, không `dangerouslySetInnerHTML` JSON

---

### Câu 32 — Token storage và auth frontend: lưu ở đâu an toàn?

#### Mục tiêu đánh giá

- Client-side auth storage trade-off
- XSS vs CSRF threat model
- BFF và httpOnly cookie pattern
- OAuth/OIDC flow cho SPA

#### Đáp án kỳ vọng tổng quát

**Không an toàn cho access token nhạy cảm:**

| Cách lưu | Rủi ro |
|----------|--------|
| `localStorage` / `sessionStorage` | Đọc được bởi bất kỳ JS nào — XSS = mất token |
| Biến global / state Redux persist | Cùng rủi ro XSS |

**Khuyến nghị hiện đại (SPA):**

```
Browser → BFF (Backend-for-Frontend, same-site cookie)
       → BFF gọi API với token server-side
       → httpOnly + Secure + SameSite cookie session
```

**OAuth2 Authorization Code + PKCE:**

- SPA không giữ client secret
- Token exchange qua BFF hoặc server
- Refresh token rotation server-side

**Nếu bắt buộc bearer token client:**

- Short TTL access token
- Refresh qua httpOnly cookie endpoint
- Không log token; clear on logout
- Hiểu rủi ro XSS vẫn tồn tại nếu token trong memory-only nhưng XSS có thể intercept fetch

**CSRF:** cookie session cần SameSite=Lax/Strict hoặc CSRF token cho mutation.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Rủi ro localStorage token (XSS) | +1 |
| httpOnly cookie không đọc được từ JS | +1 |
| BFF pattern (khái niệm) | +1 |
| PKCE cho SPA/public client | +1 |
| Không lưu refresh token long-lived trong localStorage | +1 |
| Logout clear session server + client | +1 |
| HTTPS bắt buộc | +1 |
| Access token TTL ngắn | +1 |
| SameSite cookie cơ bản | +1 |
| Ví dụ flow login thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| "localStorage OK vì HTTPS" | Sai threat model |
| Lưu JWT refresh token vô thời hạn client | Critical |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Token rotation / revocation strategy | +1 |
| SSO OIDC federation nhiều app | +1 |
| CSRF defense với cookie session | +1 |
| Secure cookie flags đầy đủ (Secure, HttpOnly, SameSite) | +1 |
| Impersonation / admin audit | +1 |
| Incident token leak response | +1 |
| Multi-tab logout sync | +1 |
| Compare BFF vs pure SPA token | +1 |
| mTLS / service mesh (edge case) | +1 |
| Compliance session timeout | +1 |
| Pen test auth finding fix | +1 |
| Team security guideline document | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **JWT trong memory (React state) — an toàn hơn localStorage?** → XSS vẫn steal qua hook fetch; giảm persistence only
2. **Third-party iframe cần token — design?** → postMessage scoped, short-lived, origin check
3. **Logout mà refresh token còn — xử lý?** → revoke server-side blacklist

---

### Câu 33 — CSP, biến môi trường và secrets (`VITE_`, `.env`)?

#### Mục tiêu đánh giá

- Content Security Policy
- Vite env exposure model
- Secret vs public config
- Build-time vs runtime config

#### Đáp án kỳ vọng tổng quát

**Vite env rules:**

- Chỉ biến prefix `VITE_` được embed vào client bundle — **coi như public**
- Không bao giờ: `VITE_API_SECRET`, private key, DB password trong `VITE_*`
- `.env`, `.env.local` trong `.gitignore`; `.env.example` commit template không secret
- `import.meta.env.VITE_API_URL` — build-time replacement

```bash
# .env.example — OK commit
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0

# KHÔNG commit
# VITE_STRIPE_SECRET=sk_live_xxx  ← lộ trong bundle!
```

**Secret thật:** chỉ server/BFF; client gọi API server đã auth.

**CSP (Content Security Policy):**

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
```

- Giảm impact XSS (block inline script không nonce)
- Report-uri / report-to cho violation monitoring
- Trade-off: third-party analytics, inline style — cần tune

**Runtime config:** inject `window.__ENV__` từ server HTML cho multi-env deploy một artifact — tránh rebuild mỗi env.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| `VITE_*` = public trong bundle | +1 |
| Không commit secret vào repo | +1 |
| `.env.example` vs `.env.local` | +1 |
| CSP là gì và mục đích | +1 |
| `script-src 'self'` cơ bản | +1 |
| Secret chỉ ở server/BFF | +1 |
| Không log env production console | +1 |
| API key public (Maps embed) vs secret phân biệt | +1 |
| Build CI inject env an toàn (secret manager) | +1 |
| Hiểu `import.meta.env` build-time | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Stripe/AWS secret trong `VITE_` | Critical leak |
| Commit `.env` production | Security incident |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| CSP nonce/hash cho inline script | +1 |
| CSP report-only rollout | +1 |
| Runtime config injection pattern | +1 |
| Secret rotation CI/CD | +1 |
| Subresource Integrity (SRI) CDN | +1 |
| Audit bundle for leaked keys (grep CI) | +1 |
| Multi-tenant env isolation | +1 |
| Compliance (PCI — no card data in frontend) | +1 |
| Incident secret in git history | +1 |
| Feature flag vs secret distinction | +1 |
| Third-party script CSP exception review | +1 |
| Team `.env` hygiene training | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Analytics script third-party — CSP?** → allowlist domain, SRI, tag manager review
2. **Cùng Docker image deploy nhiều env — config?** → runtime env inject, không bake `VITE_` prod vào build dev
3. **Source map public lộ logic — rủi ro?** → private source map, không upload secret comment

---
