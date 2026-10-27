#!/usr/bin/env python3
"""Deterministic checks shared by the orchestrator and the tech-lead.

  python3 factory/check_review.py ui-change <worktree>
      Prints "yes" if the job branch changes anything a visitor can see
      (compared with main), otherwise "no".

  python3 factory/check_review.py review <review.md> <security|ux|ui|code> <yes|no>
      Validates one review against factory/review-protocol.md for a job whose
      ui-change is yes/no. Prints "valid" (exit 0) or one problem per line (exit 1).
"""
import re
import subprocess
import sys

# Paths whose changes show up in the rendered site.
UI_PATHS = re.compile(
    r"^(src/app/.*\.(tsx|css)$"
    r"|src/components/"
    r"|src/lib/fonts\.ts$"
    r"|messages/"
    r"|public/)"
)

REQUIRED_LINES = {
    "spec": "Spec sections read:",
    "rendered": "Rendered checks:",
    "screenshots": "Screenshots viewed:",
    "criteria": "Acceptance criteria verified myself:",
}


def ui_change(worktree):
    out = subprocess.run(
        ["git", "-C", worktree, "diff", "--name-only", "main...HEAD"],
        capture_output=True, text=True, check=True,
    ).stdout.split()
    return "yes" if any(UI_PATHS.match(path) for path in out) else "no"


def field(evidence, label):
    """Value of an Evidence line such as '- Rendered checks (…): value'."""
    name = re.escape(label.rstrip(":"))
    pattern = re.compile(r"^%s\b[^:]*:\s*(.*)$" % name, re.IGNORECASE)
    for line in evidence.splitlines():
        match = pattern.match(line.lstrip("-* ").strip())
        if match:
            return match.group(1).strip()
    return None


def is_na(value):
    return value.lower().startswith("n/a")


def check_review(path, reviewer, ui):
    problems = []
    try:
        text = open(path, encoding="utf-8").read()
    except OSError:
        return ["file missing: %s" % path]

    first = text.lstrip().split("\n", 1)[0].strip()
    if first not in ("VERDICT: PASS", "VERDICT: CHANGES"):
        problems.append("first line must be 'VERDICT: PASS' or 'VERDICT: CHANGES', got %r" % first)

    if "## Evidence" not in text:
        return problems + ["missing '## Evidence' section"]
    evidence = text.split("## Evidence", 1)[1]

    values = {}
    for key, label in REQUIRED_LINES.items():
        value = field(evidence, label)
        if not value:
            problems.append("Evidence is missing a non-empty '%s' line" % label)
        values[key] = value or ""

    visual_reviewer = reviewer in ("ux", "ui")
    spec, shots = values["spec"], values["screenshots"]

    # Spec citations: always for security/code; for ux/ui only on UI changes.
    if spec and "§" not in spec:
        if visual_reviewer and ui == "no" and is_na(spec):
            pass
        else:
            problems.append("'Spec sections read' must cite design-spec sections as §x.y")

    # Screenshots: required for ux/ui on UI changes; n/a otherwise.
    if visual_reviewer and ui == "yes":
        needed = {
            "ux": ["en-mobile-light", "ar-mobile-light", "ar-desktop-light"],
            "ui": ["en-desktop-light", "ar-desktop-light", "en-desktop-dark",
                   "en-mobile-light", "ar-mobile-light"],
        }[reviewer]
        missing = [name for name in needed if name not in shots]
        if is_na(shots) or missing:
            problems.append("UI change: screenshots required and viewed: missing %s"
                            % ", ".join(missing or needed))

    if values["rendered"] and is_na(values["rendered"]):
        problems.append("'Rendered checks' cannot be n/a — curl the preview")

    return problems


def main(argv):
    if len(argv) == 3 and argv[1] == "ui-change":
        print(ui_change(argv[2]))
        return 0
    if len(argv) == 5 and argv[1] == "review" and argv[3] in ("security", "ux", "ui", "code") \
            and argv[4] in ("yes", "no"):
        problems = check_review(argv[2], argv[3], argv[4])
        print("\n".join(problems) if problems else "valid")
        return 1 if problems else 0
    print(__doc__.strip())
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
