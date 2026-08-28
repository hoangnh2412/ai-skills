# Workflow: Tạo skill lá mới

Áp dụng khi **chưa có** skill nào phủ việc cần làm. Nếu đã có skill gần đúng → [extend-skill.md](extend-skill.md).

## Checklist

```text
- [ ] 1. Lọc 3 câu hỏi — có đáng một skill riêng không, thuộc module nào
- [ ] 2. Đặt tên + viết description trước khi viết ruột
- [ ] 3. Dựng cây file tối thiểu (SKILL.md + README.md)
- [ ] 4. Viết SKILL.md — orchestrator
- [ ] 5. Viết README.md — người
- [ ] 6. Tách workflows / providers / templates nếu SKILL.md phình
- [ ] 7. Cập nhật hub {module}/README.md
- [ ] 8. Validate: npm test + npm run link:check
```

## Bước 1 — Lọc 3 câu hỏi

Chạy bảng ở [SKILL.md § Bước 0](../SKILL.md#bước-0--việc-này-có-đáng-một-skill-riêng-không). Kết quả phải là **một trong ba**, viết ra thành lời trước khi gõ phím:

- *"Skill lá mới trong `backend/`"* → tiếp bước 2.
- *"Chỉ là workflow của skill X"* → dừng, sang [extend-skill.md](extend-skill.md).
- *"Module mới"* → tiếp bước 2, nhưng đọc thêm [§ Module mới](#module-mới) ở cuối file — có 5 việc kèm theo và **cần ADR trước**.

## Bước 2 — Tên + description (viết TRƯỚC ruột)

```text
minipower-{module}-{capability}[-{stack}]
```

| Ràng buộc | Kiểm bằng |
|---|---|
| kebab-case, ≤64 ký tự, tiền tố đúng module | `{module}-pack.test.js` |
| `name` frontmatter ≡ tên thư mục | `{module}-pack.test.js` |
| `description` không rỗng | `{module}-pack.test.js` |
| `description` **kích hoạt đúng lúc** | ❌ không máy nào kiểm — người soát |

Viết `description` bằng cách trả lời hai câu, nối lại:

1. **WHAT** — skill này làm gì, một câu, ngôi thứ ba.
2. **WHEN** — người dùng sẽ gõ những chữ nào khi cần nó? (tên package, endpoint, config key, triệu chứng, động từ nghiệp vụ). Nhét đúng những chữ đó vào.

Thử ngược: đọc `description` mà không nhìn tên skill — có đoán được lúc nào gọi không? Không → viết lại.

## Bước 3 — Cây file tối thiểu

```bash
SKILL_DIR={module}/skills/minipower-{module}-{capability}
mkdir -p "$SKILL_DIR"
cp toolbox/skills/minipower-toolbox-skill-author/templates/SKILL.md.tpl   "$SKILL_DIR/SKILL.md"
cp toolbox/skills/minipower-toolbox-skill-author/templates/README.md.tpl  "$SKILL_DIR/README.md"
```

Chỉ hai file. `workflows/`, `providers/`, `templates/`, `reference/` tạo sau, **khi có nội dung thật**.

## Bước 4 — SKILL.md (agent)

Điền theo [templates/SKILL.md.tpl](../templates/SKILL.md.tpl). Bốn phần không được thiếu:

| Phần | Nội dung |
|---|---|
| Frontmatter | `name` ≡ thư mục · `description` WHAT+WHEN |
| Bảng định tuyến | Tình huống → workflow / provider nào. Đây là *mục lục*, agent đọc để biết load tiếp file gì |
| Quy tắc cốt lõi | Thứ hay sai nhất, nói ngắn. Rule máy kiểm được thì **đừng nhắc bằng lời** — để analyzer/test báo |
| Output bắt buộc | Điều kiện *xong*, ưu tiên thứ chạy được (`dotnet build`, endpoint trả 200, `npm test`) |

Không viết Purpose / Role / Process chung chung — xem map ở [reference/anatomy.md](../reference/anatomy.md).

## Bước 5 — README.md (người)

Điền theo [templates/README.md.tpl](../templates/README.md.tpl). Mục **không được thiếu**: *"Không dùng cho: …"* trỏ sang skill đúng. Đây là thứ chặn skill mới ăn tranh việc của skill cũ.

## Bước 6 — Tách khi phình

| Dấu hiệu | Tách thành |
|---|---|
| SKILL.md có checklist nhiều bước | `workflows/{việc}.md` |
| Nhiều biến thể hạ tầng cùng một API (Redis / Memory / Postgres) | `providers/<name>/SKILL.md` |
| Nhiều **mô hình** loại trừ nhau (single-db / separate-db / hybrid) | `patterns/<name>/SKILL.md` |
| Snippet dài copy nguyên vào repo đích | `templates/` (đuôi **không** `.md` nếu có link giả) |
| Giải thích nền dài, ít khi cần | `reference/*.md` |

Nguyên tắc: agent chỉ load **một** file biến thể cho một task. Provider/pattern không lặp lại nội dung orchestrator.

## Bước 7 — Cập nhật hub

Thêm **một dòng** vào bảng Skill của `{module}/README.md`, đúng dạng test canh:

```markdown
| **minipower-{module}-{capability}** | [skills/minipower-{module}-{capability}/README.md](./skills/minipower-{module}-{capability}/README.md) | {việc, một dòng} |
```

Thiếu dòng này → `npm test` đỏ (bảng hub phải khớp thư mục thật, không thừa không thiếu).

## Bước 8 — Validate

```bash
cd sdlc/hooks && npm test && npm run link:check
```

- `npm test` — name ≡ thư mục · kebab/≤64 · có description · bảng hub khớp
- `npm run link:check` — **0 link gãy MỚI**; nếu cố ý đổi cấu trúc thì soát diff rồi `npm run link:check -- --update-baseline`

## Module mới

Chỉ khi câu 2 của bảng lọc trả lời *có*. Ngoài skill, phải làm đủ — **thiếu bất kỳ mục nào là module nửa vời**:

```text
- [ ] ADR mới (mã kế tiếp ở ADRs/README.md) + một dòng index, CÙNG commit
- [ ] {module}/PACK.md — đủ trường schema contracts/pack-manifest.md
- [ ] {module}/README.md — hub: bảng skill, ranh giới "cái gì KHÔNG vào đây", cách cài
- [ ] sdlc/hooks/test/{module}-pack.test.js — khuôn ops-pack.test.js
- [ ] sdlc/hooks/test/pack-manifest.test.js — thêm "{module}" vào MODULES
- [ ] README.md (root) — bảng §Minipower có gì + cây thư mục
- [ ] AGENTS.md — §Quy ước đặt tên & thư mục, danh sách module
```

Không tạo thư mục module trước khi có skill thật trong đó (ADR-022 QĐ-7 luật 2).

## Anti-patterns

| ❌ | Vì sao |
|---|---|
| Viết ruột trước, `description` sau cho có | Lá-rời sống nhờ description — viết sau thì viết theo ruột, không theo cách người dùng gọi |
| Tên theo công cụ (`minipower-ops-grafana`) | Đổi công cụ là đổi tên skill; tên phải theo **việc** |
| Copy SKILL.md sang README.md | Hai đối tượng đọc khác nhau; bản sao lệch nhau sau lần sửa thứ hai |
| Tạo `workflows/` + `providers/` rỗng "cho đủ chuẩn" | Thư mục rỗng là lời hứa, agent vẫn phải mở ra mới biết trống |
| Viết "bắt buộc" cho thứ không FAIL được bằng máy | Chữ bắt buộc không có cổng phía sau làm mòn mọi chữ bắt buộc khác |
| Thêm skill nhưng quên dòng hub | `npm test` đỏ — và người không bao giờ tìm thấy skill |
