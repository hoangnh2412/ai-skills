# minipower-{module}-{capability}

{Một câu: skill này giúp làm gì.} Agent đọc [SKILL.md](./SKILL.md).

## Khi nào dùng

| Tình huống | Workflow |
|---|---|
| {…} | [workflows/init.md](./workflows/init.md) |
| {…} | [workflows/add.md](./workflows/add.md) |

**Không dùng cho:** {việc gần giống} → [{skill đúng}](../{skill-đúng}/README.md)

## Cách gọi

```text
@.opencode/skills/minipower-{module}-{capability}/workflows/add.md

{Mô tả task cụ thể: tên project, config path, biến thể cần dùng}
```

Hoặc mô tả việc bằng lời — skill tự kích hoạt qua `description`.

## Quy tắc (tóm tắt)

- {2–4 gạch đầu dòng, không copy nguyên SKILL.md}

## Providers / Patterns

| Biến thể | SKILL |
|---|---|
| {Tên} | [providers/{name}/SKILL.md](./providers/{name}/SKILL.md) |

## Liên quan

- {skill phụ thuộc} — [../{skill}/README.md](../{skill}/README.md)
- Bản đồ module: [{module}/README.md](../../README.md)
