#!/usr/bin/env python3
"""Rebuild filters / catalog / footer in bo.json using UTF-8 strings from the repo only."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"
OV = ROOT / "src/i18n/messages/bo-ui-overrides.json"
CB = ROOT / "src/components/ControlsBar.tsx"
EN = ROOT / "src/i18n/messages/en.ts"
FD = ROOT / "src/data/fontsData.ts"
QD = ROOT / "src/data/questLevels.ts"


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    G = json.loads(OV.read_text(encoding="utf-8"))["filters"]
    C, ca, rf, nav = bo["common"], bo["cart"]["clearAll"], bo["common"]["resetFilters"], bo["nav"]
    reset_all = ca.replace("\u0f66\u0f74\u0f56\u0f0b\u0f54", "\u0f66\u0fb3\u0f62\u0f0b \u0f42\u0f66\u0f7c\u0f0b")
    title = rf[: rf.index("\u0f66\u0fb3")].rstrip("\u0f0b") + "\u0f0d"
    thams = ca[: ca.index("\u0f66\u0f74")].rstrip("\u0f0b")
    yig = nav["typefaces"].rstrip("\u0f0d")
    sp = C["special"].rstrip("\u0f0d")
    tsag = title.rstrip("\u0f0d")

    cb = CB.read_text(encoding="utf-8")
    cats = dict(re.findall(r"labelKey: '(filters\.category\w+)'.*?tibetan: '([^']+)'", cb, re.S))
    cats["filters.categoryAll"] = cats["filters.categoryAll"].rstrip("\u0f0d")

    fd = FD.read_text(encoding="utf-8")
    qd = QD.read_text(encoding="utf-8")
    lb = re.search(r"'(ལག་བྲིས)", fd).group(1)
    bris = lb.replace("ལག་", "")
    rgyud = re.search(r"(རྒྱུད)", qd).group(1)
    script_style = f"{bris} {rgyud}"

    en_text = EN.read_text(encoding="utf-8")
    site_title = re.search(r"titleTibetan: '([^']+)'", en_text).group(1)
    about_tib = re.search(r"aboutTibetan:\s*\n\s*'([^']+)'", en_text).group(1)

    khyug_desc = re.search(r"tibetanDescription: '(བོད་ཀྱི་འཁྱུག་ཡིག[^']+)'", fd).group(1)
    gyi = khyug_desc.split("རང་བཞིན")[1][:2]  # གྱི་

    sample_line = re.search(r"sampleText: '([^']+)'", fd).group(1)
    vowel_tail = sample_line.split("་")[-2] + "་" + sample_line.split("་")[-1].rstrip("།")

    bo["filters"] = {
        "title": title,
        "sampleText": G["sampleText"],
        "previewPlaceholder": G["previewPlaceholder"],
        "size": G["size"],
        "previewText": G["previewText"],
        "fontSize": G["fontSize"],
        "lineHeight": G["lineHeight"],
        "boldness": G["boldness"],
        "presets": G["presets"],
        "custom": G["custom"],
        "fontSample": G["fontSample"],
        "fontSampleHint": f"{sp}{gyi}{G['fontSample']}",
        "scriptStyle": script_style,
        "fontKindNormal": C["regular"],
        "fontKindSpecial": C["special"],
        "fontKindAll": thams,
        "reset": rf,
        "resetAll": reset_all,
        "clearSearch": f"{thams} {C['remove']}",
        "fontKindAria": f"{yig} {script_style} {tsag}",
        "railTypography": f"{G['size']} · {G['boldness']} · {G['lineHeight']}",
        "railPresets": G["presets"],
        "railPresetsCustom": f"{G['custom']} {G['presets']}",
        "collapsePanel": f"{tsag} {C['close']}",
        "expandPanel": f"{tsag} {C['next']}",
        "closePanel": f"{tsag} {C['close']}",
        "openPanel": f"{tsag} {C['add']}",
        "vowelHint": f"{G['lineHeight']} {vowel_tail}",
        "noSpecialPresets": (
            f"{G['presets']} {C['cancel']} {G['custom']} {G['presets']} · Admin → {yig} · {sp} {yig}"
        ),
        "viewGrid": f"{G['size']} {C['glyphs']}",
        "viewList": C["glyphs"],
        "viewSample": G["fontSample"],
        "presetCustomSuffix": f" · {G['custom']}",
        "categoryAll": thams,
        "categoryUchen": cats["filters.categoryUchen"],
        "categoryUme": cats["filters.categoryUme"],
        "categoryDrutsa": cats["filters.categoryDrutsa"],
        "categoryTsugring": cats["filters.categoryTsugring"],
        "categoryPetsug": cats["filters.categoryPetsug"],
        "categoryModern": cats["filters.categoryModern"],
        "categoryStandard": cats["filters.categoryStandard"],
    }

    drawer = bo["cart"]["drawerTitle"]
    byang = drawer.split("་")[3] if "་" in drawer else drawer

    bo["catalog"] = {
        "searchPlaceholder": f"{yig} · {script_style} · {G['presets']} …",
        "typefacesFound": f"{yig} {{count}} {C['add']}",
        "collectionHint": f"Monlam IT · Himalayan Unicode · {yig}",
        "tipRealtime": f"{byang} {G['previewText']} {C['comparing']}",
        "tipSample": f"{G['previewText']} {G['presets']} {G['fontSample']} {C['comparing']}",
        "noMatchTitle": f"{tsag} · {yig} {C['cancel']}",
        "noMatchBody": f"{cats['filters.categoryUchen']} · {cats['filters.categoryDrutsa']} · {rf}",
        "addToBag": f"{bo['cart']['label']} {C['add']}",
        "removeFromBag": f"{bo['cart']['label']} {C['remove']}",
        "addCompare": f"{C['compare']} {C['add']}",
        "removeCompare": f"{C['compare']} {C['remove']}",
        "copySample": f"{G['sampleText']} {C['copy']}",
        "openGlyphs": C["glyphs"],
    }

    suite = bo["cart"]["suiteTitle"]
    bo["footer"] = {
        "brand": site_title,
        "tag": bo["site"]["badgePlayground"],
        "about": khyug_desc.replace("འཁྱུག་ཡིག", yig).replace("རང་བཞིན", "Monlam IT"),
        "aboutTibetan": about_tib,
        "resources": suite.split("་")[0] + " " + nav["guide"],
        "links": nav["install"],
        "syllableAnatomy": nav["guide"],
        "typingPractice": nav["typing"],
        "typingQuest": nav["quest"],
        "comparator": nav["compare"],
        "setupGuide": nav["install"],
        "sendFeedback": nav["feedback"],
        "github": "MonlamAI GitHub",
        "googleFonts": f"Google Fonts · {yig}",
        "licence": nav["install"].split("་")[-1] + " " + nav["guide"],
        "unicodeBlock": f"Unicode · {yig} · U+0F00 – U+0FFF",
        "copyright": f"© {{{{year}}}} {site_title} React, Vite & Tailwind CSS · {bo['cart']['goInstall']}",
        "admin": "Admin",
        "madeWith": bo["theme"]["toLight"].split("་")[0] + " · " + about_tib.split("་")[0],
        "forCommunity": about_tib,
    }

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Wrote", BO)


if __name__ == "__main__":
    main()
