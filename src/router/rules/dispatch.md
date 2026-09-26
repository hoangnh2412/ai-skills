# dispatch

Một phiên: contracts tối thiểu + **một** pack. Không spawn. Không L3 hộ nghề.

**Route = LLM** (ADR-034 QĐ-4). Chọn **đúng một** `name:` skill lá trong catalog. Keyword `intent-dispatch.js` = gợi ý / test, không thay LLM.

**Thông báo trước khi chạy.** In một dòng rồi mới đọc `SKILL.md`:

`Sẽ chạy {tên skill} để xử lý {việc người hỏi}.`

Không chắc hai lá → hỏi người. Gatekeeper: kế hoạch nhiều bước, L3 MCP, Git, baseline — chờ người OK trước khi thực thi.

**Ngoại lệ script:** init / install → nhắc CLI, không route bằng phỏng vấn LLM.
