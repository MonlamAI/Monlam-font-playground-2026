#!/usr/bin/env python3
"""Polish bo.json after merge_bo_clean.py."""
import ast
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"
PATCH = ROOT / "scripts/patch_bo_final.py"


def vowel_hint_from_patch() -> str:
    tree = ast.parse(PATCH.read_text(encoding="utf-8"))
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        tgt = node.targets[0]
        if (
            isinstance(tgt, ast.Subscript)
            and isinstance(tgt.value, ast.Subscript)
            and isinstance(tgt.value.slice, ast.Constant)
            and tgt.value.slice.value == "filters"
            and isinstance(tgt.slice, ast.Constant)
            and tgt.slice.value == "vowelHint"
        ):
            return ast.literal_eval(node.value)
    raise RuntimeError("vowelHint not found")


def panel_literal(key: str) -> str | None:
    text = PATCH.read_text(encoding="utf-8")
    m = re.search(rf'bo\["filters"\]\["{key}"\] = "(.+)"', text)
    return m.group(1) if m else None


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    F = bo["filters"]
    C = bo["common"]
    nav = bo["nav"]
    cart = bo["cart"]
    cat = bo["catalog"]
    foot = bo["footer"]
    yig = nav["typefaces"].rstrip("།")
    tsag = F["title"].rstrip("།")
    br = F["scriptStyle"].replace(" ", "་")

    F["scriptStyle"] = br
    F["fontSampleHint"] = f"{C['special'].rstrip('།')} {F['custom']} ཀྱི {F['fontSample']}"
    F["vowelHint"] = vowel_hint_from_patch()
    F["expandPanel"] = f"{tsag} རྒྱས་པ"
    F["clearSearch"] = "\u0f60\u0f56\u0f0b\u0f66\u0f0b\u0f62\u0f0b\u0f44\u0f0b \u0f66\u0f63\u0f0b\u0f62\u0f0b\u0f42\u0f0b\u0f66\u0f72\u0f0b"
    F["fontKindAria"] = f"{yig} {br} ཀྱི {tsag}"
    F["viewGrid"] = "\u0f42\u0f62\u0f0b \u0f66\u0f72\u0f44\u0f0b \u0f62\u0f92\u0f44\u0f0b \u0f62\u0f0b\u0f44\u0f0b"
    for key in ("collapsePanel", "closePanel", "openPanel"):
        val = panel_literal(key)
        if val:
            F[key] = val

    found = cart["chosenCount_one"]
    cat["typefacesFound"] = found.replace("བདམས་ཟིན", "རNYED")
    if "{count}" in cat["typefacesFound"]:
        cat["typefacesFound"] = cat["typefacesFound"].replace("{count}", "{{count}}")

    cat["searchPlaceholder"] = (
        f"{yig} ཀྱི་མིང་、{br}、{F['presets']}、{C['resetFilters']}……"
    )

    byang = cart["emptyBody"].split("+")[0].strip()
    cat["tipRealtime"] = (
        f"{byang} {F['previewText']} ལ་བརྡ་རྒyab་ནས་དeng་མa lag tu bris shing brtag nus"
    )
    cat["tipSample"] = (
        f"{F['previewText']} dang {F['presets']} bsgyur na {F['fontSample']} yang der ma lag 'dus 'gyur"
    )
    cat["noMatchTitle"] = f"{tsag} dang ma mthun pa'i {yig} ma rnyed"
    cat["noMatchBody"] = (
        f"「{F['categoryUchen']}」「{F['categoryDrutsa']}」sogs ming ngam sgo grangs gzhan 'tshol rogs, "
        f"yang na {C['resetFilters']}"
    )

    foot["tag"] = f"ཁ་ཕ་ཡི {yig} {br}"
    foot["about"] = (
        "སmon lam gyis gsar bzo gnang ba'i dbu can tshad ldan yig gzugs shig yin"
    )
    foot["resources"] = f"{nav['typing'].rstrip('།')} · {nav['guide']}"
    foot["links"] = "\u0f42\u0f62\u0f0b \u0f44\u0f7a\u0f0b \u0f42\u0f62\u0f0b \u0f60\u0f72\u0f0b \u0f62\u0f0b \u0f44\u0f0b \u0f42\u0f62\u0f0b \u0f44\u0f7a\u0f0b \u0f42\u0f62\u0f0b \u0f60\u0f72\u0f0b \u0f62\u0f0b \u0f44\u0f0b"
    foot["licence"] = "\u0f42\u0f62\u0f0b \u0f66\u0f72\u0f44\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b"
    foot["madeWith"] = "\u0f66\u0f72\u0f0b \u0f42\u0f0b \u0f44\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b"
    foot["forCommunity"] = (
        "\u0f60\u0f72\u0f0b \u0f62\u0f0b \u0f44\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b \u0f56\u0f72\u0f0b \u0f42\u0f62\u0f0b"
    )

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Polished", BO)


if __name__ == "__main__":
    main()
