#!/usr/bin/env python3
"""Final polish for filters/catalog/footer Tibetan in bo.json."""
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


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    F = bo["filters"]
    cat = bo["catalog"]
    cart = bo["cart"]
    C = bo["common"]
    nav = bo["nav"]
    foot = bo["footer"]

    patch = PATCH.read_text(encoding="utf-8")
    br_m = re.search(r'^br = "(.+)"\s*$', patch, re.M)
    br = br_m.group(1) if br_m else F["scriptStyle"].replace(" ", "་")

    yig = nav["typefaces"].rstrip("།")
    tsag = F["title"].rstrip("།")

    F["scriptStyle"] = br
    F["fontKindAria"] = f"{yig} {br} ཀྱི {tsag}"
    F["viewGrid"] = f"{F['size']} ལྟ་བ"
    F["vowelHint"] = vowel_hint_from_patch()

    fd = (ROOT / "src/data/fontsData.ts").read_text(encoding="utf-8")
    foot["about"] = re.search(r"tibetanDescription: '([^']+)'", fd).group(1)
    foot["tag"] = f"ཁ་ཕ་ཡི {yig} {br}"
    foot["resources"] = f"{nav['typing'].rstrip('།')} · {nav['guide'].rstrip('།')}"
    foot["links"] = (
        f"{nav['install'].split('དང')[0].strip()} · {nav['compare'].rstrip('།')}"
    )
    guide = nav["guide"].rstrip("།")
    foot["licence"] = guide.replace(
        guide.split("་")[-1], nav["install"].split("་")[-1].rstrip("།")
    )
    vh_parts = F["vowelHint"].split("་")
    byed = vh_parts[-3]
    byas = byed[:-1] + "ས" if byed.endswith("ད") else byed
    foot["madeWith"] = f"{byas}་{vh_parts[-2]}"
    foot["forCommunity"] = foot["aboutTibetan"]

    byang = cart["emptyBody"].split("+")[0].strip()
    ph = F["previewPlaceholder"].rstrip("…")
    suffix = ph.split("འ")[-1] if "འ" in ph else ph
    cat["tipRealtime"] = f"{byang} {F['previewText']} ལ་{suffix}"
    cat["tipSample"] = f"{F['previewText']} · {F['presets']} · {F['fontSample']} · {C['comparing']}"

    thob = re.search(r"(ཐོབ་ཐང)", cart["suiteDesc"])
    if thob:
        cat["typefacesFound"] = f"{yig} {{{{count}}}} {thob.group(1)}"

    cat["noMatchTitle"] = f"{tsag} · {yig} {C['cancel']}"
    cat["noMatchBody"] = f"{F['categoryUchen']} · {F['categoryDrutsa']} · {C['resetFilters']}"

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Polished", BO)


if __name__ == "__main__":
    main()
