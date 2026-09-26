# router — dispatcher

Pack **dispatcher** (ADR-033 QĐ-1/QĐ-14): gợi ý đúng một pack / phiên. Init = CLI `minipower init`, không phỏng vấn LLM. Hook máy vẫn neo `src/sdlc/hooks/` đến Đợt E.

Manifest: [PACK.md](PACK.md).

## Skill

| Skill | Tài liệu | Việc |
|---|---|---|
| **minipower-router** | [skills/minipower-router/README.md](./skills/minipower-router/README.md) | Intent → đúng một pack; không spawn |
| **minipower-router-init** | [skills/minipower-router-init/README.md](./skills/minipower-router-init/README.md) | Nhắc CLI `minipower init`; đã có marker thì không hỏi lại |
| **minipower-router-deliberation** | [skills/minipower-router-deliberation/README.md](./skills/minipower-router-deliberation/README.md) | Premise gate mềm PROCEED/RESHAPE/STOP |
| **minipower-router-readiness** | [skills/minipower-router-readiness/README.md](./skills/minipower-router-readiness/README.md) | Soát tiền đề trước thực thi, hỏi một lượt |

## Hook (Đợt D2 — luật; máy còn ở sdlc/hooks)

- [rules/dispatch.md](rules/dispatch.md) · [rules/identity.md](rules/identity.md) · [rules/l3.md](rules/l3.md)
- [hooks/face-mismatch.md](hooks/face-mismatch.md) — L3 lệch provider → dừng (QĐ-6)

