#!/usr/bin/env python3
"""Rebuild typing.* in bo.json from existing UTF-8 strings in the same file."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"

GNYIS = "\u0f42\u0f49\u0f72\u0f66"


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    nav, C, F, cart = bo["nav"], bo["common"], bo["filters"], bo["cart"]
    typing_nav = nav["typing"].rstrip("\u0f0d")
    yig = nav["typefaces"].rstrip("\u0f0d")
    guide = nav["guide"].rstrip("\u0f0d")
    smon_lam = "\u0f0b".join(bo["footer"]["brand"].split("\u0f0b")[:2])

    std = F["categoryStandard"].rstrip("\u0f0d")
    drills = {
        "drill-1": {
            "title": f"gsal byed thog ma {GNYIS} ({std})",
            "hint": f"gsal byed 'bri. yig rim dang tshig rgyun brda gnon (Space / tsheg).",
        },
        "drill-2": {
            "title": f"gsal byed gsum · bzhi · lnga",
            "hint": "tha dang pha sbyor la shan 'byed (ta/tha · pa/pha).",
        },
        "drill-3": {
            "title": "dbYangs bzhi (gi gu · zhabs kyu · dreng bu · na ro)",
            "hint": F["vowelHint"],
        },
        "drill-4": {
            "title": "'dogs can (ya ta · ra ta)",
            "hint": F["fontSampleHint"],
        },
        "drill-5": {
            "title": "thugs rje chen po'i sngags",
            "hint": F["previewText"],
        },
        "drill-6": {
            "title": "bkra shis bde legs 'phrad",
            "hint": F["sampleText"],
        },
        "drill-7": {
            "title": "sems can la smon lam yig tshogs",
            "hint": cart["emptyBody"],
        },
    }

    bo["typing"] = {
        "title": f"{yig} · {typing_nav}",
        "subtitle": f"{cart['suiteTitle']} · {F['previewText']} · Unicode",
        "tabTutor": f"{typing_nav} · {F['viewSample'].rstrip('\u0f0d')}",
        "tabWylie": f"Wylie · {F['previewText'].rstrip('\u0f0d')}",
        "drillsLabel": f"{typing_nav}:",
        "speed": f"{F['size']}:",
        "wpm": "{{count}} WPM",
        "accuracy": "\u0f42\u0f74\u0f0b\u0f58\u0f0b \u0f61\u0f0b\u0f58\u0f0b\u0f42\u0f0b \u0f46\u0f0b\u0f58\u0f0d",
        "targetLabel": f"{F['previewText']}:",
        "inputPlaceholder": F["previewPlaceholder"],
        "tipLabel": f"{F['fontSample']}:",
        "completed": "\u0f63\u0f0b\u0f58\u0f0b\u0f42\u0f0b\u0f66\u0f0b\u0f58\u0f0d",
        "nextDrill": f"{C['next']} →",
        "resetDrill": f"{typing_nav} {C['resetFilters']}",
        "wylieInputLabel": f"Wylie {F['previewText'].rstrip('\u0f0d')}:",
        "wylieStandard": "EWTS (Extended Wylie Transliteration)",
        "wyliePlaceholder": F["previewPlaceholder"],
        "quickExamples": f"{F['fontSample']}:",
        "wylieGuideTitle": f"Wylie {guide}:",
        "convertedLabel": f"Unicode {F['previewText'].rstrip('\u0f0d')}:",
        "convertedEmpty": "…",
        "sendPlayground": f"{yig} \u0f0b \u0f56\u0f72\u0f0b\u0f42\u0f62\u0f0b \u0f42\u0f74\u0f0b\u0f58\u0f0b \u0f50\u0f62\u0f66\u0f44\u0f0b\u0f41\u0f7c\u0f0b \u0f51\u0f7a\u0f0b\u0f60\u0f72\u0f44\u0f0b\u0f46\u0f0b\u0f0d",
        "copyUnicode": f"Unicode {C['copy']}",
        "copiedUnicode": C["copied"],
        "keyboardHint": cart["suiteTitle"],
        "keyboardLabel": cart["suiteTitle"].split("\u0f0b")[1] if "\u0f0b" in cart["suiteTitle"] else "Keyboard",
        "layoutLabel": F["scriptStyle"],
        "layoutWindows": f"Windows · {F['scriptStyle']}",
        "layoutMac": f"Mac · {F['scriptStyle']}",
        "shiftOn": "SHIFT: ON",
        "shiftOff": "SHIFT: OFF",
        "shiftNeeded": "SHIFT: NEEDED",
        "keysFollowOs": F["fontKindAria"],
        "fallbackKeyboard": "Monlam Bodyig 2025",
        "keyBackspace": C["remove"],
        "keyTab": "Tab",
        "keyCapsLock": "Caps Lock",
        "keyEnter": "Enter",
        "keyShift": "Shift",
        "keySpace": "Space",
        "nextKey": f"{C['next']}:",
        "nextKeySpace": "SPACE",
        "nextKeyShiftSuffix": " + Shift",
        "drills": drills,
        "samples": {
            "omMani": "Om ma ni pad me hum",
            "tashiDelek": "bkra shis bde legs",
            "bodYig": f"bod yig ({yig})",
            "buddhaDharma": "sangs rgyas chos dge 'dun",
            "sentientBeings": "sems can thams cad",
        },
    }

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Wrote typing section to", BO)


if __name__ == "__main__":
    main()
