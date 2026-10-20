#!/usr/bin/env python3
"""Set typing.drills in bo.json from Tibetan target lines + existing bo strings."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"
TD = ROOT / "src/data/tibetanData.ts"

SPACE_NOTE = (
    "ཚེག་ནི་ནམ་རྒྱུན་གྱི་ Space མནན་ན་ཡོང་། "
    "བར་སྟོང་འཇོག་སྐབས་ Shift དང་མཉམ་དུ་ Space གནོན་དགོས།"
)


def short_target(text: str, max_chars: int = 22) -> str:
    t = text.replace("\u0f0d", "").strip()
    if len(t) <= max_chars:
        return t + "\u0f0d"
    chunk = t[:max_chars]
    if "\u0f0b" in chunk:
        chunk = chunk[: chunk.rindex("\u0f0b") + 1]
    return chunk.rstrip() + "\u2026"


def parse_drills() -> list[tuple[str, str]]:
    raw = TD.read_text(encoding="utf-8")
    block = raw.split("export const TYPING_DRILLS")[1].split("];")[0]
    entries = re.findall(
        r"id: '(drill-\d+)'.*?targetText: '([^']+)'",
        block,
        flags=re.S,
    )
    return entries


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    F, cart = bo["filters"], bo["cart"]
    hints = {
        "drill-1": f"{F['previewPlaceholder'].rstrip('\u2026')} {SPACE_NOTE}",
        "drill-2": F["railTypography"],
        "drill-3": F["vowelHint"],
        "drill-4": F["fontSampleHint"],
        "drill-5": F["previewText"],
        "drill-6": F["sampleText"],
        "drill-7": cart["emptyBody"],
    }

    drills: dict[str, dict[str, str]] = {}
    for drill_id, target in parse_drills():
        drills[drill_id] = {
            "title": short_target(target),
            "hint": hints.get(drill_id, F["previewPlaceholder"]),
        }

    if "typing" not in bo:
        bo["typing"] = {}
    bo["typing"]["drills"] = drills
    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Updated typing.drills in", BO)


if __name__ == "__main__":
    main()
