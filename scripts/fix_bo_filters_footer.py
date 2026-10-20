#!/usr/bin/env python3
"""Fix corrupted bo.json filters/catalog/footer (UTF-8 from patch_bo_final + bo.json parts)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"
PATCH = ROOT / "scripts/patch_bo_final.py"


def main() -> None:
    patch = PATCH.read_text(encoding="utf-8")
    br = re.search(r'^br = "(.+)"\s*$', patch, re.M).group(1)
    vowel = re.search(
        r'bo\["filters"\]\["vowelHint"\] = \(\s*"([^"]+)"\s*\n\s*"([^"]+)"',
        patch,
        re.M,
    )
    vowel_hint = vowel.group(1) + vowel.group(2)

    bo = json.loads(BO.read_text(encoding="utf-8"))
    nav = bo["nav"]
    common = bo["common"]
    G = bo["filters"]
    cart = bo["cart"]
    catalog = bo["catalog"]
    footer = bo["footer"]

    yig = nav["typefaces"].rstrip("།")
    tsags = G["title"].rstrip("།")
    tsang_ma = cart["clearAll"].split("་", 1)[0]
    slar_gsos = common["resetFilters"].split("་", 1)[1]

    bo.setdefault("site", {})["titleTibetan"] = "སྨོན་ལམ་བོད་ཡིག་གཟུགས་ཀྱི་ཚོད་ལྟའི་སྡིངས་ཆ།"

    G["fontSampleHint"] = (
        f"{common['special'].rstrip('།')} {G['custom']} ཀྱི {yig} {G['sampleText']}"
    )
    G["scriptStyle"] = br
    G["vowelHint"] = vowel_hint
    G["resetAll"] = f"{tsang_ma}་{slar_gsos}"
    G["clearSearch"] = "འཚོལ་བཟad་བsal་བ"
    G["fontKindAria"] = f"{yig} {br} ཀྱི {tsags}"
    G["railPresetsCustom"] = f"{G['custom']} ཀྱི {G['presets']}"
    G["collapsePanel"] = "ཚagས་ཆ་འདum་པ"
    G["expandPanel"] = f"{tsags} རgyas་པ"
    G["closePanel"] = "ཚagས་ཆ་ཁ་བsdom་པ"
    G["openPanel"] = "ཚagས་ཆ་ཁ་ཕye་བ"

    for key, val in {
        "collapsePanel": "ཚagས་ཆ་འདum་པ",
        "closePanel": "ཚagས་ཆ་ཁ་བsdom་པ",
        "openPanel": "ཚagས་ཆ་ཁ་ཕye་བ",
    }.items():
        m = re.search(rf'bo\["filters"\]\["{key}"\] = "(.+)"', patch)
        if m:
            G[key] = m.group(1)

    G["noSpecialPresets"] = (
        f"དa lta {G['custom']} {G['presets']} ma 'dzugs pa red. Admin → {yig} ནas "
        f"{common['special'].rstrip('།')} {yig} la {G['presets']} sgrig rogs"
    )
    G["viewGrid"] = "sgyu gral lta ba"
    G["viewList"] = common["glyphs"]
    G["viewSample"] = G["fontSample"]

    catalog["searchPlaceholder"] = (
        f"{yig} ཀྱི་མིང་、{br}、{G['presets']}、{common['resetFilters']}……"
    )
    catalog["typefacesFound"] = cart["chosenCount_one"].replace("བདམས་ཟིན", "རNYED")
    catalog["collectionHint"] = f"Monlam IT · Himalayan Unicode · {yig} legs bsdus"
    catalog["noMatchTitle"] = f"{tsags} dang ma mthun pa'i {yig} ma rnyed"
    catalog["noMatchBody"] = (
        f"「{G['categoryUchen']}」「{G['categoryDrutsa']}」sogs sgo grangs gzhan bzhin 'tshol te, "
        f"yang na {common['resetFilters']} rogs"
    )

    m_tip = re.search(
        r'bo\["catalog"\]\["searchPlaceholder"\] = f"\{yig\} ཀྱི་མིང་、\{br\}、\{G\[\'presets\'\]\}、\{C\[\'resetFilters\'\]\}……"',
        patch,
    )
    catalog["searchPlaceholder"] = (
        f"{yig} ཀྱི་མིང་、{br}、{G['presets']}、{common['resetFilters']}……"
    )

    byang = "བyang bu"
    if "byang bu" in cart["emptyBody"]:
        byang = cart["emptyBody"].split("byang bu")[0].split()[-1] + "byang bu"

    catalog["tipRealtime"] = (
        f"{byang}'i nang gi {G['previewText']} la reg nas der ma lag tu bris shing brtag nus"
    )
    catalog["tipSample"] = (
        f"{G['previewText']} dang {G['presets']} bsgyur na {G['fontSample']} yang der ma lag 'dus 'gyur"
    )

    footer["tag"] = f"ཁ་ཕ་ཡི {yig} {br}"
    footer["about"] = (
        "སmon lam gyis gsar bzo gnang ba'i dbu can tshad ldan yig gzugs shig yin"
    )
    footer["resources"] = f"{nav['typing'].rstrip('།')} · {nav['compare']}"
    footer["links"] = "གzhung gi 'brel thag"
    footer["syllableAnatomy"] = nav["guide"]
    footer["licence"] = "ཕab len sgrig lam srol"
    footer["madeWith"] = "བyas"
    footer["forCommunity"] = footer["aboutTibetan"]

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Fixed", BO)


if __name__ == "__main__":
    main()
