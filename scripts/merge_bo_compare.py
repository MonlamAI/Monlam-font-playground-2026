#!/usr/bin/env python3
"""Rebuild compare.* in bo.json from existing UTF-8 strings in the same file."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"

OVERLAY_MODE = "འོད་ཕྲ་བསྒོམ་བསྡུར།"
OVERLAY_BASE = "གཞི་རྒྱུད (མདོག་སྔོན་པོ):"
OVERLAY_TOP = "སྟེང་རྒྱུད (མདོག་དམར་པོ):"
SIDE_BY_SIDE = "\u0f42\u0f61\u0f66\u0f0b\u0f42\u0f61\u0f7c\u0f53\u0f0b"
GNYIS = "\u0f42\u0f49\u0f72\u0f66"


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    F, C, nav, cart, catalog = bo["filters"], bo["common"], bo["nav"], bo["cart"], bo["catalog"]
    yig = nav["typefaces"].rstrip("\u0f0d")
    cmp_w = nav["compare"].rstrip("\u0f0d")
    comparing = C["comparing"].rstrip("\u0f0d")
    smon_lam = bo["footer"]["brand"].split("\u0f0b")[0] + "\u0f0b" + bo["footer"]["brand"].split("\u0f0b")[1]
    vh = F["vowelHint"]

    dbu = vh.find("\u0f51\u0f42\u0f0b\u0f58\u0f0b")
    dang = vh.find("\u0f51\u0f44\u0f0b", dbu)
    metric_asc = vh[dbu:dang].strip("\u0f0b ") if dbu >= 0 and dang > dbu else "\u0f51\u0f42\u0f0b\u0f58\u0f0b\u0f58\u0f72\u0f0b"

    og = vh.find("\u0f58\u0f0b\u0f42\u0f0b", dang)
    yi = vh.find("\u0f61\u0f0b", og)
    metric_desc = vh[og:yi].strip() if og >= 0 and yi > og else "\u0f58\u0f0b\u0f42\u0f0b \u0f58\u0f72\u0f0b \u0f58\u0f0b\u0f42\u0f0b"

    chosen_tail = cart["chosenCount_one"].split("{{")[0].replace(yig, "").strip()
    selected = chosen_tail if chosen_tail else "\u0f56\u0f72\u0f0b\u0f58\u0f0b\u0f58\u0f72\u0f0b"

    bo["compare"] = {
        "title": f"{yig} {SIDE_BY_SIDE}{cmp_w}\u0f0d",
        "subtitle": f"{smon_lam} {yig} {F['boldness']} \u0f0b {F['scriptStyle']} \u0f0b {vh}",
        "modeGrid": f"{SIDE_BY_SIDE}{F['viewGrid']}\u0f0d",
        "modeOverlay": OVERLAY_MODE,
        "syncLabel": f"{F['previewText']} ({comparing} \u0f42\u0f5f\u0f7c\u0f0b\u0f41\u0f0b \u0f50\u0f62\u0f66\u0f44\u0f0b\u0f41\u0f7c\u0f0b)\u0f0d",
        "syncPlaceholder": F["previewPlaceholder"],
        "size": f"{F['fontSize']}:",
        "lineHeight": f"{F['lineHeight']}:",
        "boldness": f"{F['boldness']}:",
        "addFont": f"{cmp_w} {C['add'].rstrip('\u0f0d')}:",
        "chooseTypeface": f"+ {yig} ({{{{count}}}} \u0f59\u0f0b\u0f51\u0f0d)",
        "overlayBase": OVERLAY_BASE,
        "overlayTop": OVERLAY_TOP,
        "overlayHint": vh,
        "metricsTitle": f"{nav['guide'].rstrip('\u0f0d')} \u0f0b {F['size']}\u0f0d",
        "metricCol": F["size"],
        "contrast": F["boldness"],
        "type": F["scriptStyle"],
        "metricStrokeType": F["scriptStyle"],
        "metricStrokeContrast": F["boldness"],
        "metricAscender": metric_asc,
        "metricDescender": metric_desc,
        "metricSpacing": F["lineHeight"],
        "emptyTitle": cart["emptyTitle"],
        "compareFirstTwo": f"{yig} {GNYIS} {cmp_w} ({C['add'].rstrip('\u0f0d')})",
        "removeFromCompare": catalog["removeCompare"],
        "selected": selected,
        "select": C["add"],
        "downloadTtf": ".ttf \u0f56\u0f72\u0f0b\u0f42\u0f62\u0f0d",
        "vs": "\u0f51\u0f44\u0f0b",
        "metricValueContrastHigh": C["bold"],
        "metricValueContrastMedium": C["medium"],
        "metricValueContrastLow": C["regular"],
        "metricValueCalligraphic": F["categoryUchen"],
        "metricValueCursive": F["categoryUme"],
        "metricValueChiseled": F["categoryDrutsa"],
    }

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Wrote compare section to", BO)


if __name__ == "__main__":
    main()
