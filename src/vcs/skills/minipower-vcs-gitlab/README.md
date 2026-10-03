# minipower-vcs-gitlab

SOP **GitLab** + git. Không thay `backend/` viết code nghiệp vụ.

## L1 / L2 / L3

Đọc project = L1. Tạo MR/issue/comment/pipeline write = L3. `git commit` / `git push` = L3 sau preview, lệnh do người đã cho phép trong phiên.

## Cài

Pack `vcs/` atomic. `mcp.code` trỏ server GitLab của workspace.

## Không làm

- `git push --force` lên default branch
- Merge thay người
- Publish pack ra product repo
