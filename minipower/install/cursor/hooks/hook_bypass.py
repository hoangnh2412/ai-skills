#!/usr/bin/env python3
"""Minipower hook bypass: skip guards when prompt uses BYPASS prefix."""

from __future__ import annotations

import re
import sys

# "BYPASS {skill} {content}" or "@{skill} BYPASS {content}"
BYPASS_RE = re.compile(r"(?im)(?:^\s*BYPASS(?:\s+|$)|@\S+\s+BYPASS(?:\s+|$))")


def should_bypass(prompt: str) -> bool:
    return bool(BYPASS_RE.search(prompt or ""))


def main() -> None:
    prompt = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
    sys.exit(0 if should_bypass(prompt) else 1)


if __name__ == "__main__":
    main()
