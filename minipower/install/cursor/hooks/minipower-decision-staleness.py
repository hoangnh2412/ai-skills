#!/usr/bin/env python3
"""Minipower — decision-log staleness scanner (SSOT, advisory, KHÔNG chặn).

Quét memory/*/decision-log.md, với mỗi entry DEC còn hiệu lực (chưa superseded)
so ngày quyết định với lịch sử git của các DOC trong dòng `Trace:`. Nếu DOC bị
sửa SAU ngày quyết định → in cảnh báo "DEC có thể lỗi thời, cần review".

Nguồn logic dùng chung cho mọi nền tảng:
  - Claude Code: SessionStart hook (delegate về file này).
  - Cursor: beforeSubmitPrompt wrapper `minipower-decision-staleness.sh/.ps1`
    (keyword-gate rồi gọi file này).
  - OpenCode: port TS `plugins/lib/decision-staleness.ts` (cùng hành vi).
  - CLI thủ công mọi IDE.

Heuristic (chỉ để nhắc, không phán quyết): ánh xạ `DOC-NN` → file theo tên
(một DOC-NN dùng ở nhiều module sẽ kiểm mọi file khớp); path viết thẳng trong
Trace cũng nhận. Yêu cầu: git + python3 (stdlib). Chạy từ root dự án. Luôn exit 0.
"""
import glob
import os
import re
import subprocess
import sys

ROOT = os.environ.get("MP_PROJECT_ROOT") or os.getcwd()

ENTRY_RE = re.compile(r"^###\s+(DEC-[A-Z]{2,4}-\d+)\b.*?\[(\d{4}-\d{2}-\d{2})\]")
DOC_TOKEN_RE = re.compile(r"\bDOC-(\d{2})\b")
DOC_PATH_RE = re.compile(r"\b(docs/[\w./-]+?DOC-\d{2}[\w./-]*\.md)\b")


def git(args):
    try:
        r = subprocess.run(
            ["git", *args], capture_output=True, text=True, cwd=ROOT
        )
        return r.stdout.strip()
    except Exception:
        return ""


def is_git_repo():
    return git(["rev-parse", "--is-inside-work-tree"]) == "true"


_DOCS_CACHE = None


def docs_files():
    """Danh sách file tracked dưới docs/ (cache) — độc lập cách git glob '**'."""
    global _DOCS_CACHE
    if _DOCS_CACHE is None:
        out = git(["ls-files", "docs"])
        _DOCS_CACHE = [l.strip() for l in out.splitlines() if l.strip()]
    return _DOCS_CACHE


def resolve_docs(trace_line):
    """Trả về tập file DOC từ dòng Trace (token DOC-NN hoặc path viết thẳng)."""
    files = set()
    for m in DOC_PATH_RE.finditer(trace_line):
        files.add(m.group(1))
    for m in DOC_TOKEN_RE.finditer(trace_line):
        nn = m.group(1)
        for f in docs_files():
            if re.search(rf"/DOC-{nn}-[^/]*\.md$", "/" + f):
                files.add(f)
    return files


def last_commit_date(path):
    """Ngày commit gần nhất (YYYY-MM-DD) của file, hoặc '' nếu chưa có history."""
    return git(["log", "-1", "--format=%cs", "--", path])


def parse_entries(text):
    """Yield dict(id, date, status, trace) cho từng entry."""
    cur = None
    for line in text.splitlines():
        m = ENTRY_RE.match(line)
        if m:
            if cur:
                yield cur
            cur = {"id": m.group(1), "date": m.group(2), "status": "", "trace": ""}
            continue
        if cur is None:
            continue
        s = line.strip()
        low = s.lower()
        if low.startswith("- status:"):
            cur["status"] = s
        elif low.startswith("- trace:"):
            cur["trace"] = s
    if cur:
        yield cur


def main():
    if not is_git_repo():
        return 0
    logs = sorted(glob.glob(os.path.join(ROOT, "memory", "*", "decision-log.md")))
    if not logs:
        return 0

    findings = []
    for log_path in logs:
        try:
            with open(log_path, encoding="utf-8") as f:
                text = f.read()
        except OSError:
            continue
        for e in parse_entries(text):
            if "superseded-by" in e["status"].lower():
                continue
            if not e["trace"]:
                continue
            for doc in resolve_docs(e["trace"]):
                cd = last_commit_date(doc)
                if cd and cd > e["date"]:
                    findings.append(f"  - {e['id']} ({e['date']}) ← {doc} đổi {cd}")

    if findings:
        rel = "\n".join(sorted(set(findings)))
        print(
            "[Minipower] Decision-log có thể lỗi thời — DOC đã đổi sau ngày quyết định.\n"
            "Chạy deliberation Premise Check để xác nhận / supersede:\n"
            f"{rel}"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
