#!/usr/bin/env python3
"""Extract user-facing English strings from src/ into an Excel glossary."""
from __future__ import annotations

import re
from pathlib import Path

try:
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter
except ImportError as exc:
    raise SystemExit("Install openpyxl: pip install openpyxl") from exc

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
OUT = ROOT / "docs" / "localization" / "Monlam-Playground-App-Keywords-English.xlsx"

# Paths to scan (user-facing UI)
SCAN_GLOBS = ["**/*.tsx", "**/*.ts"]
SKIP_PARTS = {
    "/admin/api.ts",
    "/types/",
    "/utils/wylieConverter",
    "/utils/tibetanEngine",
    "/utils/keyboardLayout",
    "/utils/fontDownloader",
    "/data/tibetanData.ts",
    "/data/wylieTable.ts",
}

# Minimum quality: must look like UI English (not code identifiers)
SKIP_EXACT = {
    "useState",
    "useEffect",
    "true",
    "false",
    "null",
    "undefined",
    "GET",
    "POST",
    "application/json",
}

PROP_PATTERNS = [
    re.compile(r'(?:placeholder|aria-label|title|alt)\s*=\s*"([^"]{2,200})"'),
    re.compile(r"(?:placeholder|aria-label|title|alt)\s*=\s*'([^']{2,200})'"),
    re.compile(r'(?:placeholder|aria-label|title|alt)\s*=\s*\{\s*["\']([^"\']{2,200})["\']\s*\}'),
]

# name: 'English' / title: "English" in data objects (quest, achievements, etc.)
FIELD_PATTERNS = [
    re.compile(r'\b(?:name|title|label|description|heading|subtitle|message|text|hint|tip)\s*:\s*["\']([^"\']{2,200})["\']'),
    re.compile(r'\b(?:name|title|label|description|heading|subtitle|message|text|hint|tip)\s*:\s*`([^`]{2,200})`'),
]

# JSX visible text inside common tags (avoid raw `>…<` which catches code)
JSX_TAG_TEXT = re.compile(
    r"<(?:span|p|h1|h2|h3|h4|h5|h6|button|label|th|td|li|option|strong|em|a|div)\b[^>]*>"
    r"([^<{}]{2,160})"
    r"</(?:span|p|h1|h2|h3|h4|h5|h6|button|label|th|td|li|option|strong|em|a|div)>"
)

# JSX: {'English'} / {"English"} when used as visible copy
JSX_EXPR_STRING = re.compile(r'\{["\']([A-Za-z][^"\']{1,180})["\']\}')

# Option text
OPTION_TEXT = re.compile(r"<option[^>]*>([^<]{2,120})</option>")


def should_skip_file(path: Path) -> bool:
    rel = path.as_posix().replace(str(ROOT), "")
    if "/node_modules/" in rel:
        return True
    for part in SKIP_PARTS:
        if part in rel:
            return True
    return False


REJECT_SUBSTR = (
    "&&",
    "||",
    "=>",
    "===",
    "!==",
    "className",
    "onClick",
    "onChange",
    "http://",
    "https://",
    "KeyMap",
    "JSON",
    "SQLite",
    "tsx",
    "npm ",
    "word-break:",
    "break-all",
    "&lt;",
    "/>",
    "(!",
    "?.",
    "${",
)

def looks_like_ui_english(s: str) -> bool:
    s = s.strip()
    if not s or s in SKIP_EXACT:
        return False
    if len(s) < 2 or len(s) > 220:
        return False
    if not re.search(r"[A-Za-z]", s):
        return False
    if re.match(r"^[\d.)\(]", s):
        return False
    if re.match(r"^[/\\#]|^https?://|^U\+|^0x", s):
        return False
    if re.match(r"^[a-z]+(?:_[a-z]+)+$", s):
        return False
    if re.match(r"^[a-z]+(?:[A-Z][a-z0-9]+)+$", s) and " " not in s:
        return False
    if any(x in s for x in REJECT_SUBSTR):
        return False
    if re.search(r"[{}<>]", s):
        return False
    ascii_letters = sum(1 for c in s if c.isascii() and c.isalpha())
    if ascii_letters < 2:
        return False
    # Prefer strings that look like words/sentences (space or reasonable punctuation)
    if not re.search(r"[A-Za-z]{2,}", s):
        return False
    return True


def normalize(s: str) -> str:
    s = re.sub(r"\s+", " ", s.strip())
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        s = s[1:-1].strip()
    return s


def extract_from_file(path: Path) -> list[tuple[str, str]]:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return []
    rel = path.relative_to(ROOT).as_posix()
    found: list[tuple[str, str]] = []

    def add(raw: str) -> None:
        n = normalize(raw)
        if looks_like_ui_english(n):
            found.append((n, rel))

    for pat in PROP_PATTERNS:
        for m in pat.finditer(text):
            add(m.group(1))

    for pat in FIELD_PATTERNS:
        for m in pat.finditer(text):
            add(m.group(1))

    for m in JSX_TAG_TEXT.finditer(text):
        chunk = m.group(1)
        chunk = re.sub(r"\s+", " ", chunk)
        # Strip trailing/leading icon-only or punctuation junk
        add(chunk)

    for m in JSX_EXPR_STRING.finditer(text):
        add(m.group(1))

    for m in OPTION_TEXT.finditer(text):
        add(m.group(1))

    return found


def collect_all() -> list[tuple[str, str, str]]:
    """Returns (english, source_file, area) sorted unique by english."""
    by_text: dict[str, str] = {}
    for pattern in SCAN_GLOBS:
        for path in SRC.glob(pattern):
            if should_skip_file(path):
                continue
            for english, rel in extract_from_file(path):
                # Keep first source file seen
                by_text.setdefault(english, rel)

    rows: list[tuple[str, str, str]] = []
    for english in sorted(by_text.keys(), key=lambda x: x.lower()):
        rel = by_text[english]
        area = rel.split("/")[1] if "/" in rel else rel  # components, admin, data
        rows.append((english, rel, area))
    return rows


def main() -> None:
    rows = collect_all()
    OUT.parent.mkdir(parents=True, exist_ok=True)

    wb = Workbook()
    ws = wb.active
    ws.title = "Keywords"

    headers = ["english", "source_file", "area", "tibetan", "notes"]
    header_fill = PatternFill("solid", fgColor="2563EB")
    header_font = Font(bold=True, color="FFFFFF")
    for col, h in enumerate(headers, start=1):
        c = ws.cell(row=1, column=col, value=h)
        c.fill = header_fill
        c.font = header_font
        c.alignment = Alignment(horizontal="center")

    for r, (english, source, area) in enumerate(rows, start=2):
        ws.cell(row=r, column=1, value=english)
        ws.cell(row=r, column=2, value=source)
        ws.cell(row=r, column=3, value=area)
        ws.cell(row=r, column=4, value="")  # tibetan — fill during localization
        ws.cell(row=r, column=5, value="")

    ws.column_dimensions["A"].width = 52
    ws.column_dimensions["B"].width = 42
    ws.column_dimensions["C"].width = 14
    ws.column_dimensions["D"].width = 36
    ws.column_dimensions["E"].width = 24
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:E{max(1, len(rows) + 1)}"

    meta = wb.create_sheet("About")
    meta["A1"] = "Monlam Font Playground — app keywords (English)"
    meta["A3"] = f"Total strings: {len(rows)}"
    meta["A4"] = "Regenerate: python3 scripts/extract-app-keywords.py"
    meta["A6"] = "english column = user-facing copy abstracted from src/ (auto-extracted; review for false positives)."
    meta.column_dimensions["A"].width = 80

    wb.save(OUT)
    print(f"Wrote {len(rows)} keywords to {OUT}")


if __name__ == "__main__":
    main()
