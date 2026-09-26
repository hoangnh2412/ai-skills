# Profile — Minipower

## Đầu session

1. Đọc `memory/profile.json` (dự án: mode, provider) — **không** lấy tên từ file này.
2. Đọc `memory/profile.user.json` (rồi `~/.minipower/user.json`). Thiếu hoặc `os_username` ≠ user OS → **chỉ** khai báo người dùng; chưa làm DOC.
3. Xưng hô theo file user local; agent xưng `em`; tiếng Việt.

## Hook

`profile-guard` chặn việc minipower khi thiếu profile v3 hợp lệ hoặc identity lệch. Chi tiết: [profile-guard.md](../../../src/sdlc/agents/profile-guard.md).
