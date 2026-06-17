#!/usr/bin/env python3
"""Minipower beforeSubmitPrompt: DOC file -> phase, block on conflict.

SSOT map: agents/auto-routing.md
stdin:  {"prompt": "...", "attachments": [{"type":"file","file_path":"..."}]}
stdout: {"continue": true|false, "user_message": "..."}  (user_message when blocked)
exit:   0 allow | 2 block
"""

from __future__ import annotations

import json
import os
import re
import sys
from typing import Dict, List, Optional

PHASE_BY_DOC: Dict[str, str] = {
    "01": "discovery",
    "02": "discovery",
    "03": "discovery",
    "04": "requirements",
    "05": "requirements",
    "06": "requirements",
    "07": "requirements",
    "08": "architecture",
    "09": "architecture",
    "10": "architecture",
    "11": "architecture",
    "12": "architecture",
    "13": "requirements",
    "14": "planning",
    "15": "planning",
    "16": "delivery",
    "17": "delivery",
    "18": "change-control",
}

PHASE_LABEL: Dict[str, str] = {
    "discovery": "discovery (DOC-01–03)",
    "requirements": "requirements (DOC-04–07, 13)",
    "architecture": "architecture (DOC-08–12)",
    "planning": "planning (DOC-14–15)",
    "delivery": "delivery (DOC-16–17)",
    "change-control": "change-control (DOC-18)",
}

PHASES = frozenset(PHASE_LABEL.keys())
DOC_IN_PROMPT = re.compile(r"DOC-(\d{2})-[\w-]+\.md")
DOC_BARE_IN_PROMPT = re.compile(r"DOC-(\d{2})(?![-\w])")
DOC_IN_NAME = re.compile(r"DOC-(\d{2})")
EXPLICIT_PHASE = re.compile(
    r"(?i)Phase:\s*(discovery|requirements|architecture|planning|delivery|change-control)"
)


def skill_path(phase: str) -> str:
    root = os.environ.get("MINIPOWER_ROOT", "ai-skills/minipower").rstrip("/\\")
    return f"{root}/skills/{phase}/SKILL.md"


def allow() -> None:
    print(json.dumps({"continue": True}))
    sys.exit(0)


def warn(msg: str) -> None:
    print(f"[WARN] Minipower auto-routing: {msg}", file=sys.stderr)
    allow()


def block(msg: str) -> None:
    print(f"[BLOCK] {msg}", file=sys.stderr)
    print(json.dumps({"continue": False, "user_message": msg}, ensure_ascii=False))
    sys.exit(2)


def basename(path: str) -> str:
    return os.path.basename(path.replace("\\", "/"))


def phase_for_doc(doc_num: str) -> Optional[str]:
    return PHASE_BY_DOC.get(doc_num)


def add_doc_ref(
    by_phase: Dict[str, List[str]], seen: set[str], doc_num: str, label: str
) -> None:
    if not doc_num or not label.strip():
        return
    if doc_num in seen:
        return
    phase = phase_for_doc(doc_num)
    if not phase:
        return
    seen.add(doc_num)
    by_phase.setdefault(phase, []).append(label)


def add_entry(by_phase: Dict[str, List[str]], seen: set[str], path: str) -> None:
    if not path or not path.strip():
        return
    match = DOC_IN_NAME.search(basename(path))
    if not match:
        return
    add_doc_ref(by_phase, seen, match.group(1), path)


def collect_by_phase(data: dict, prompt: str) -> Dict[str, List[str]]:
    by_phase: Dict[str, List[str]] = {}
    seen: set[str] = set()
    for att in data.get("attachments") or []:
        if isinstance(att, dict):
            add_entry(by_phase, seen, att.get("file_path") or "")
    for match in DOC_IN_PROMPT.finditer(prompt):
        add_entry(by_phase, seen, match.group(0))
    for match in DOC_BARE_IN_PROMPT.finditer(prompt):
        add_doc_ref(by_phase, seen, match.group(1), f"DOC-{match.group(1)}")
    return by_phase


def parse_explicit_phase(prompt: str) -> Optional[str]:
    match = EXPLICIT_PHASE.search(prompt)
    return match.group(1).lower() if match else None


def build_route_prefix(
    prompt: str, phase: str, skill: str, doc_labels: List[str]
) -> str:
    lines: List[str] = []
    if "/minipower" not in prompt:
        lines.append("/minipower")
    if not re.search(rf"(?i)Phase:\s*{re.escape(phase)}\b", prompt):
        lines.append(f"Phase: {phase}")
    if skill not in prompt:
        lines.append(f"@{skill}")
    for doc in doc_labels:
        if not doc or not re.search(r"[/\\]DOC-\d{2}", doc):
            continue
        doc_norm = doc.replace("\\", "/")
        if doc_norm not in prompt:
            lines.append(f"@{doc_norm}")
    return "\n".join(lines)


def build_enriched_prompt(original: str, prefix: str) -> str:
    if not prefix:
        return original
    if not original:
        return prefix
    return f"{prefix}\n\n{original}"


def continue_with_route(
    original: str, enriched: str, phase: str, skill: str, info: str
) -> None:
    print(f"[INFO] Minipower auto-routing: {info}", file=sys.stderr)
    context = (
        "Minipower auto-route (DOC -> phase). "
        f"Phase: {phase} Skill: @{skill} "
        "Follow minipower-token-guard: one slice, read skill con for this phase only."
    )
    print(
        json.dumps(
            {
                "continue": True,
                "updated_input": {"prompt": enriched},
                "additional_context": context,
                "hookSpecificOutput": {
                    "hookEventName": "UserPromptSubmit",
                    "additionalContext": context,
                    "updatedInput": {"prompt": enriched},
                },
            },
            ensure_ascii=False,
        )
    )
    sys.exit(0)


def handle_single_phase(
    by_phase: Dict[str, List[str]], explicit: Optional[str], prompt: str
) -> None:
    detected = next(iter(by_phase))
    files = ", ".join(by_phase[detected])
    label = PHASE_LABEL.get(detected, detected)

    if explicit and explicit != detected:
        block(
            f"Phase conflict: prompt ghi Phase: {explicit} nhưng file DOC thuộc {label}.\n\n"
            f"File: {files}\n\n"
            f"Sửa prompt thành:\nPhase: {detected}\n/minipower\n@<file DOC>\n\n"
            f"Hoặc bỏ dòng Phase: và chỉ tag file thuộc phase {explicit}."
        )

    if not explicit:
        skill = skill_path(detected)
        prefix = build_route_prefix(prompt, detected, skill, by_phase[detected])
        enriched = build_enriched_prompt(prompt, prefix)
        continue_with_route(
            prompt,
            enriched,
            detected,
            skill,
            f"Da chen Phase: {detected} (+ /minipower, @{skill}).",
        )

    allow()


def handle_multi_phase(
    by_phase: Dict[str, List[str]], explicit: Optional[str]
) -> None:
    lines = [
        "Conflict phase — các file DOC bạn tag thuộc nhiều phase khác nhau.",
        "",
    ]

    for phase in sorted(by_phase):
        lines.append(f"• {PHASE_LABEL.get(phase, phase)}:")
        for path in by_phase[phase]:
            lines.append(f"  - {path}")
        lines.append("")

    lines.extend(
        [
            "Gợi ý — tách thành từng prompt (mỗi prompt 1 phase):",
            "",
        ]
    )

    for idx, phase in enumerate(sorted(by_phase), 1):
        sample = by_phase[phase][0]
        lines.extend(
            [
                f"{idx}) Phase: {phase}",
                "   /minipower",
                f"   @{sample}",
                f"   @{skill_path(phase)}",
                "   <mô tả task cho phase này>",
                "",
            ]
        )

    if explicit:
        lines.append(
            f"Lưu ý: prompt hiện có Phase: {explicit} — "
            "chỉ giữ file thuộc phase đó, bỏ tag file phase khác."
        )

    block("\n".join(lines))


def main() -> None:
    raw = sys.stdin.read()
    if not raw.strip():
        allow()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        allow()

    if not isinstance(data, dict):
        allow()

    prompt = data.get("prompt") or ""
    if not isinstance(prompt, str):
        prompt = str(prompt)

    by_phase = collect_by_phase(data, prompt)
    if not by_phase:
        allow()

    explicit = parse_explicit_phase(prompt)

    if len(by_phase) == 1:
        handle_single_phase(by_phase, explicit, prompt)

    handle_multi_phase(by_phase, explicit)


if __name__ == "__main__":
    main()
