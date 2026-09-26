---
name: as-built
description: >-
  [minipower] Khai quật hệ thống ĐÃ XÂY thành tài liệu trace được — bản vẽ hoàn
  công. Dùng khi: tiếp quản hệ cũ, tài liệu thất lạc/không còn đúng, cần biết code
  đang làm gì trước khi sửa, chế độ maintain. Người trigger cho MỘT vùng chạm;
  wrap codegraph nếu có, không có thì Read/Grep. Không chạy nền, không quét cả repo.
---

# As-built — bản vẽ hoàn công

**Pack:** minipower · **Loại:** skill cross-phase · **Người trigger** — không hook nào tự gọi.

*As-built* là thuật ngữ xây dựng: **bản vẽ hoàn công** — mô tả cái **đã xây**, ngược chiều bản thiết kế mô tả cái **sắp xây**. Toàn bộ 19 DOC còn lại của minipower đặc tả cái sắp làm; skill này là chiều ngược.

**Điểm vào của chế độ `maintain`** ([router § Chế độ dự án](../../SKILL.md#chế-độ-dự-án-project_mode)). Dùng được ở mọi chế độ khi cần khai quật một vùng code không ai còn nhớ.

---

## Ranh giới — đọc trước khi dùng

| | |
|---|---|
| **Một vùng chạm, một lần chạy** | Không quét cả repo, không sinh DOC hàng loạt. Vùng = một module, một luồng nghiệp vụ, một file lớn |
| **Đầu ra là NHÁP + CÂU HỎI** | Không phải DOC. Người xác nhận thì mới thành DOC |
| **Mọi phát hiện phải trỏ bằng chứng** | `path:line`. Không có bằng chứng thì ghi vào phần *phỏng đoán*, không trộn vào phần *sự thật* |
| **Không chạy nền** | Không hook nào gọi skill này, không file watcher, không batch |
| **Không sửa code** | Đây là skill **đọc**. Muốn sửa thì mở CR |

> Vì sao chặt thế: agent tự khảo cổ rồi sinh hàng loạt DOC là cách nhanh nhất tạo ra một thư viện tài liệu **trông có vẻ đúng** mà không ai kiểm — tệ hơn không có tài liệu, vì người sau sẽ tin nó.

## Tầng tra cứu — codegraph (tuỳ chọn)

Wrap [codegraph](https://github.com/colbymchenry/codegraph) (tree-sitter → SQLite FTS5, 40+ ngôn ngữ, có MCP server + CLI, chạy local) làm tầng tra cứu cấu trúc.

| Có codegraph | Không có |
|---|---|
| Hỏi symbol / call graph / impact trực tiếp | Degrade về `Grep` + `Read` theo vùng hẹp |
| Rẻ token: trả đúng vùng liên quan | Đắt hơn — càng phải giữ vùng chạm hẹp |

**Kiểm khả dụng trước, không giả định.** Không có → nói ra một câu rồi làm tiếp bằng Read/Grep, **không** dừng và **không** bắt người cài.

**Index sống ở local + `.gitignore`** — không commit, không CI cache. Index là dẫn xuất từ code; commit nó là tạo thứ sẽ lệch.

> Codegraph **không thay được** skill này: nó trả *cấu trúc* (symbol, call graph), skill trả *tài liệu có ID trace được, có người xác nhận* (business rule, quyết định, runbook).

## Quy trình

1. **Chốt vùng chạm với người.** "Khảo sát luồng thanh toán" — không phải "khảo sát hệ thống". Chưa rõ vùng → hỏi, đừng đoán.
2. **Kiểm codegraph** khả dụng; báo một câu chế độ đang dùng.
3. **Đọc `assets/archive/`** trước khi đọc code — nhưng theo **cột độ tin cậy** trong [`archive/README.md`](../../project-skeleton/assets/archive/README.md): *"còn đúng"* đọc trước, *"đã lỗi thời"* chỉ đọc để hiểu lịch sử. **Không** tin tài liệu cũ hơn code.
4. **Khai quật.** Với mỗi phát hiện, ghi: điều rút ra · **bằng chứng `path:line`** · độ chắc chắn.
5. **Tách 3 nhóm** — không trộn:

   | Nhóm | Nghĩa |
   |------|-------|
   | ✅ **Sự thật** | Đọc thẳng từ code, có `path:line` |
   | ❓ **Phỏng đoán** | Suy ra từ tên biến/cấu trúc — **cần người xác nhận** |
   | ⛔ **Mâu thuẫn** | Code khác `assets/archive/` — nêu cả hai, **không** tự chọn bên đúng |

6. **Trình người**: bản nháp + **danh sách câu hỏi**. Người xác nhận từng mục.
7. **Chỉ mục đã xác nhận mới thành DOC**, có ID (`{MOD}-BR-001`…) để `trace:check` kiểm được. Mục chưa xác nhận → `memory/{phase}/open-questions.md`.
8. **Ghi nợ.** Vùng chưa khảo sát → [`memory/doc-debt.md`](../../project-skeleton/memory/doc-debt.md).

## Đích đến theo DOC

Bám `docs_focus` của chế độ `maintain`:

| DOC | Khai quật cái gì | Bằng chứng điển hình |
|-----|------------------|----------------------|
| **DOC-04** Business Rules | Rule nghiệp vụ chôn trong code | `if` điều kiện, validate, bảng cấu hình |
| **DOC-08** SAD | Thành phần, ranh giới, luồng chính | cấu trúc thư mục, entrypoint, DI wiring |
| **DOC-10** Integration Spec | Hệ ngoài đang gọi/bị gọi | HTTP client, queue consumer, cron |
| **DOC-11** Data Model | Bảng, quan hệ, ràng buộc thật | migration, schema, index |
| **DOC-12** API Spec | Endpoint đang phục vụ ai | route, controller, contract test |
| **DOC-17** Deployment Guide | Deploy/rollback thế nào | CI config, Dockerfile, script vận hành |
| **DOC-09** ADR | Quyết định **mới** khi sửa hệ cũ | — (viết mới, không khai quật) |

**DOC-17 (runbook) thường có giá trị cao nhất** ở `maintain`: người tiếp quản cần biết *deploy thế nào, hỏng thì làm gì* trước khi cần biết use case là gì.

## Sự cố vận hành

Hệ đang chạy thì sự cố là đầu vào thật. Chỗ đứng: `docs/06-changes/incident/` — template [TPL-incident-report](../../templates/TPL-incident-report.md) và [TPL-postmortem](../../templates/TPL-postmortem.md).

Postmortem hay lộ ra business rule không ai biết — đó là **đầu vào tốt** cho as-built.

## Exit criteria

- [ ] Vùng chạm đã chốt với người, **không** phải cả repo
- [ ] Mọi mục ✅ Sự thật có `path:line`
- [ ] Phỏng đoán và Mâu thuẫn tách riêng, **không** trộn vào phần sự thật
- [ ] Danh sách câu hỏi đã trình; chỉ mục **đã xác nhận** mới vào `docs/`
- [ ] Mục vào `docs/` có ID trace được
- [ ] Vùng chưa khảo sát đã ghi `memory/doc-debt.md`

## Anti-patterns

- Quét cả repo rồi sinh DOC hàng loạt (R5 — chính xác thứ skill này cấm)
- Trình phỏng đoán như sự thật · phát hiện không `path:line`
- Tin `assets/archive/` hơn code khi hai bên mâu thuẫn
- Tự chọn bên đúng khi code khác tài liệu — việc đó của người
- Bắt người cài codegraph mới làm được
- Commit index codegraph vào repo
