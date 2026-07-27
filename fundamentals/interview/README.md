# Interview — skill pack

Bộ câu hỏi phỏng vấn kỹ thuật có tiêu chí chấm điểm, form đánh giá, bài live code và hướng dẫn cho HR / interviewer.

Không cần symlink vào `.cursor/skills/` — dùng bằng **`@`** trỏ tới file trong repo (hoặc copy track cần dùng vào workspace).

## Track

| Track | README | Band |
|-------|--------|------|
| **C# / .NET** | [interview-dotnet/](interview-dotnet/README.md) | Junior → Senior |
| **React / Frontend** | [interview-reactjs/](interview-reactjs/README.md) | Junior → Senior |

Lịch sử brainstorming: [brainstoming.md](brainstoming.md)

## Cách dùng trong Cursor

1. Mở track phù hợp (`.NET` hoặc `React`) — mỗi track có README riêng, cấu trúc câu hỏi theo band.
2. Trong chat, `@` file cần dùng, ví dụ:
   - `@interview/interview-dotnet/03-cau-hoi-co-ban.md`
   - `@interview/interview-reactjs/14-form-phong-van.md`
3. Ghi rõ band, vai trò (HR / tech lead) và thời lượng buổi phỏng vấn trong prompt.

**Prompt mẫu:**

```text
@interview/interview-dotnet/README.md
Chuẩn bị buổi phỏng vấn Mid-level .NET 60 phút — lấy câu hỏi + rubric chấm điểm
```

```text
@interview/interview-reactjs/README.md
Tạo form chấm điểm Senior Frontend cho vòng technical 90 phút
```

## Cấu trúc

```text
interview/
├── interview-dotnet/     ← Track C# / .NET
├── interview-reactjs/    ← Track React / Frontend
└── brainstoming.md       ← Ghi chú thiết kế ban đầu
```

Hub repo gốc: [README.md](../README.md).
