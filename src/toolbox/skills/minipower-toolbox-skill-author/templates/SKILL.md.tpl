---
name: minipower-{module}-{capability}
description: {WHAT — một câu, ngôi thứ ba}. Dùng khi {WHEN — từ khoá người dùng thật sự gõ: package, endpoint, config key, triệu chứng}.
metadata:
  audience: hoangnh
  workflow: github
---

# {Tên hiển thị} — Orchestrator

{Một hoặc hai câu: skill này điều phối cái gì, trên nền gì.}

Hướng dẫn người: [README.md](README.md).

## Khi nào dùng workflow nào

| Tình huống | Workflow |
|---|---|
| Project chưa có {module} | [workflows/init.md](workflows/init.md) |
| Đã có core, cần thêm {biến thể} | [workflows/add.md](workflows/add.md) |

## Quy tắc cốt lõi

- {Thứ hay sai nhất, nói ngắn}
- {Thứ tự phụ thuộc nếu có — vd. Caching đăng ký trước EF}
- Không hard-code secret / connection string

> Rule máy kiểm được thì đừng nhắc bằng lời — để analyzer/test báo.
> Rule máy không kiểm được thì đừng viết "bắt buộc" — nêu lý do, người quyết.

## Packages

| PackageId | Version | Layer |
|---|---|---|
| `{Package}` | x.x.x | Host / Infrastructure |

## Providers (atomic)

Chỉ đọc provider cần dùng — không load cả thư mục:

| Provider | Path |
|---|---|
| {Tên} | [providers/{name}/SKILL.md](providers/{name}/SKILL.md) |

## Templates

- [templates/{file}](templates/{file})

## Tham chiếu

- [reference/{file}.md](reference/{file}.md) — không load mặc định

## Output bắt buộc

- {Thay đổi file nào trong repo đích}
- {Config section nào}
- {Lệnh chạy được: `dotnet build` xanh / endpoint trả 200 / test xanh}
