# DOC-12 — Đặc tả API

| Phiên bản | Ngày | Tác giả | Trạng thái |
|-----------|------|---------|------------|
| 0.1 | YYYY-MM-DD | | Draft |

**Tiêu chuẩn tham khảo:** **OpenAPI Specification (OAS) 3.x** — tiêu chuẩn de facto REST API

---

## 1. Tổng quan

| Mục | Giá trị |
|-----|---------|
| **API title** | |
| **Version** | v1 |
| **Base URL** | `https://api.example.com/v1` |
| **OpenAPI file** | `openapi.yaml` (source of truth) |

## 2. Xác thực & Phân quyền

| Method | Mô tả |
|--------|-------|
| Bearer JWT | Header: `Authorization: Bearer {token}` |
| OAuth2 | Scopes: `read`, `write` |
| API Key | Header: `X-API-Key` |

**RBAC / ABAC:** [Rule tóm tắt — trace BR/FR]

## 3. Quy ước chung

### Request / Response

| Convention | Value |
|------------|-------|
| Content-Type | `application/json` |
| Date format | ISO 8601 |
| Pagination | `?page=1&size=20` |
| Sort | `?sort=created_at:desc` |

### Phản hồi lỗi chuẩn

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": [{ "field": "email", "issue": "invalid format" }]
  }
}
```

### Mã trạng thái HTTP

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 500 | Internal error |

## 4. Danh mục endpoint

| Method | Path | Summary | Auth | FR trace |
|--------|------|---------|------|----------|
| POST | `/auth/login` | Login | Public | FR-001 |
| GET | `/orders/{id}` | Get order | Bearer | FR-002 |

## 5. Chi tiết endpoint — [METHOD] [PATH]

### `[METHOD] /resource/{id}`

**Description:** [FR-xxx]

**Path parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string (UUID) | Y | |

**Query parameters:**

| Name | Type | Required | Default |
|------|------|----------|---------|
| | | | |

**Request body:**

```json
{
  "field": "value"
}
```

**Response 200:**

```json
{
  "id": "uuid",
  "field": "value"
}
```

**Response 4xx/5xx:** → Standard Error Response

## 6. Khung OpenAPI (copy to openapi.yaml)

```yaml
openapi: 3.0.3
info:
  title: API Name
  version: 1.0.0
paths:
  /auth/login:
    post:
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Success
```

## 7. Giới hạn tốc độ & SLA

| Limit | Value |
|-------|-------|
| Rate | 100 req/min per client |
| Timeout | 30s |

## 8. Truy vết

| Endpoint | FR | UC | INT |
|----------|----|----|-----|
| | | | |
