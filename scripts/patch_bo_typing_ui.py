#!/usr/bin/env python3
"""Polish typing.* chrome strings in bo.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"
FD = ROOT / "src/data/fontsData.ts"


def preset_title(key: str) -> str:
    fd = FD.read_text(encoding="utf-8")
    m = re.search(rf"key: '{key}'.*?tibetanTitle: '([^']+)'", fd, re.S)
    return m.group(1) if m else key


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    F, C, nav, cart = bo["filters"], bo["common"], bo["nav"], bo["cart"]
    yig = nav["typefaces"].rstrip("\u0f0d")
    t = bo.setdefault("typing", {})
    kb_part = cart["suiteTitle"].split("\u0f0b")[1] if "\u0f0b" in cart["suiteTitle"] else F["scriptStyle"]

    t.update(
        {
            "subtitle": f"{cart['suiteTitle']} \u0f0b {F['previewText'].rstrip('\u0f0d')}",
            "tabWylie": f"brda yig sbyor \u0f0b {F['previewText'].rstrip('\u0f0d')}",
            "wpm": "\u0f66\u0f0b/min {{count}}",
            "shiftOn": "Shift: \u0f61\u0f0b\u0f58\u0f0d",
            "shiftOff": "Shift: \u0f58\u0f72\u0f0b\u0f58\u0f0d",
            "shiftNeeded": "Shift dgos",
            "layoutWindows": f"Windows \u0f0b {kb_part}",
            "layoutMac": f"Mac \u0f0b {kb_part}",
            "wylieInputLabel": f"brda yig {F['previewText'].rstrip('\u0f0d')}:",
            "wylieGuideTitle": f"brda yig {nav['guide'].rstrip('\u0f0d')}:",
            "convertedLabel": f"Unicode {F['previewText'].rstrip('\u0f0d')}:",
            "copyUnicode": f"Unicode {C['copy']}",
            "samples": {
                "omMani": preset_title("mantra"),
                "tashiDelek": preset_title("tashi"),
                "bodYig": yig,
                "buddhaDharma": preset_title("four-immeasurables"),
                "sentientBeings": preset_title("four-immeasurables"),
            },
        }
    )

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Patched typing UI in", BO)


if __name__ == "__main__":
    main()
