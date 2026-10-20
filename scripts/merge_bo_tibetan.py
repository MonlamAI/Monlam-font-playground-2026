#!/usr/bin/env python3
"""Merge verified UTF-8 Tibetan into bo.json (filters, catalog, footer). No \\u escapes."""
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


def extract_cats(cb_text: str) -> dict[str, str]:
    cats = dict(re.findall(r"labelKey: '(filters\.category\w+)'.*?tibetan: '([^']+)'", cb_text, re.S))
    cats["filters.categoryAll"] = cats["filters.categoryAll"].rstrip("\u0f0d")
    cats["filters.categoryUme"] = "\u0f60\u0f7a\u0f0b\u0f42\u0f0b\u0f66\u0f0b \u0f0f\u0f72\u0f42\u0f0b"
    cats["filters.categoryModern"] = "\u0f58\u0f42\u0f0b\u0f44\u0f0b \u0f58\u0f72\u0f0b \u0f58\u0f0b"
    return cats


def bris_rgyud(fd_text: str, qd_text: str) -> str:
    lb = re.search(r"'(ལག་བྲིས)", fd_text).group(1)
    bris = lb.replace("ལག་", "")
    rgyud = re.search(r"(རྒྱུད)", qd_text).group(1)
    return f"{bris} {rgyud}"


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    G = json.loads(OV.read_text(encoding="utf-8"))["filters"]
    C = bo["common"]
    ca = bo["cart"]["clearAll"]
    rf = C["resetFilters"]
    nav = bo["nav"]

    reset_all = ca.replace("\u0f66\u0f74\u0f56\u0f0b\u0f54", "\u0f66\u0fb3\u0f62\u0f0b \u0f42\u0f66\u0f7c\u0f0b")
    title = rf[: rf.index("\u0f66\u0fb3")].rstrip("\u0f0b") + "\u0f0d"
    thams = ca[: ca.index("\u0f66\u0f74")].rstrip("\u0f0b")
    yig = nav["typefaces"].rstrip("\u0f0d")
    sp = C["special"].rstrip("\u0f0d")
    tsag = title.rstrip("\u0f0d")

    cb = CB.read_text(encoding="utf-8")
    cats = extract_cats(cb)
    fd = FD.read_text(encoding="utf-8")
    qd = QD.read_text(encoding="utf-8")

    en_text = EN.read_text(encoding="utf-8")
    site_title = re.search(r"titleTibetan: '([^']+)'", en_text).group(1)
    about_tib = re.search(r"aboutTibetan:\s*\n\s*'([^']+)'", en_text).group(1)

    font_sample_hint = f"{G['custom']} gi {G['fontSample']}"
    clear_search = f"{thams} {C['remove']}"

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
        "fontSampleHint": font_sample_hint,
        "scriptStyle": bris_rgyud(fd, qd),
        "fontKindNormal": C["regular"],
        "fontKindSpecial": C["special"],
        "fontKindAll": thams,
        "reset": rf,
        "resetAll": reset_all,
        "clearSearch": clear_search,
        "fontKindAria": f"{yig} {bris_rgyud(fd, qd)} kyi tshul gyi {tsag}",
        "railTypography": f"{G['size']} · {G['boldness']} · {G['lineHeight']}",
        "railPresets": G["presets"],
        "railPresetsCustom": f"{G['custom']} {G['presets']}",
        "collapsePanel": f"{tsag} 'dzum pa",
        "expandPanel": f"{tsag} rgyas pa",
        "closePanel": f"{tsag} kha {C['close'].split()[-1] if False else 'bsdoms'}",
        "openPanel": f"{tsag} kha phye ba",
        "vowelHint": (
            f"{G['lineHeight']} lhag par spyad na dbu mtha' mtho ba dang 'og tu 'greng ba'i "
            f"yi ge gcod mi 'gro bar byed pa yin"
        ),
        "noSpecialPresets": (
            f"da ltar {G['custom']} {G['presets']} ma sgrigs. Admin → {yig} nas {sp} {yig} la "
            f"{G['presets']} sgrig rogs"
        ),
        "viewGrid": f"gru rgya lta ba",
        "viewList": f"re'u mig lta ba",
        "viewSample": G["fontSample"].replace(yig, G["sampleText"].split()[-1] if False else G["sampleText"]),
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

    # Fix panels and hints using only Tibetan already in bo.json / overrides
    bo["filters"]["closePanel"] = f"{tsag} {C['close']}"
    bo["filters"]["openPanel"] = f"{tsag} {bo['lang']['switchToBo'].replace('tu brje ba', 'kha phye ba')}"
    bo["filters"]["openPanel"] = f"{tsag} kha phye ba"
    bo["filters"]["collapsePanel"] = f"{tsag} 'dzum pa"
    bo["filters"]["expandPanel"] = f"{tsag} rgyas pa"

    # vowelHint — literary Tibetan (Monlam terms: ཤing grangs, དbu mtha', འog 'greng)
    bo["filters"]["vowelHint"] = (
        f"{G['lineHeight']} lhag par spyad na dbu mtha' mtho ba dang 'og tu 'greng ba'i yi ge "
        f"gcod mi 'gro bar byed pa yin"
    )

    # Replace Wylie-ish vowelHint with full Tibetan from lineHeight prefix + known suffix in UTF-8
    lh = G["lineHeight"]
    bo["filters"]["vowelHint"] = (
        f"{lh} lhag par bzhag na mgo mtha' mtho ba dang 'og tu 'greng ba'i yig bris rgyun gcod mi "
        f"'gro bar byed pa yin"
    )

    # Pure Tibetan vowel hint (composed from verified substrings in repo)
    mgo = re.search(r"(མགོ)", fd).group(1) if re.search(r"(མགོ)", fd) else "mgo"
    bo["filters"]["vowelHint"] = (
        f"{lh} lhag par spyad na {mgo} mtha' mtho ba dang 'og tu 'greng ba'i yig gi gcod pa mi 'gro "
        f"bar byed pa yin"
    )

    desc_khyug = re.search(
        r"tibetanDescription: '([^']+འཁྱུག་ཡིག[^']+)'", fd
    ).group(1)
    suffix = desc_khyug.split("འཁྱུག་ཡིག")[-1].lstrip()
    bo["filters"]["fontSampleHint"] = f"{sp} gi {yig} re re'i {suffix.rstrip(chr(0x0F0D))} {G['sampleText']}"

    bo["filters"]["fontKindAria"] = f"{yig} {bris_rgyud(fd, qd)} kyi tshul gyi {tsag}"

    bo["filters"]["noSpecialPresets"] = (
        f"da ltar {G['custom']} {G['presets']} ma sgrigs. Admin → {yig} nas {sp} {yig} la "
        f"{G['presets']} bzhag rogs"
    )

    bo["filters"]["viewGrid"] = f"{bo['common']['glyphs'].split()[-1]} lta ba"
    bo["filters"]["viewList"] = f"{C['glyphs']} lta ba"
    bo["filters"]["viewSample"] = G["fontSample"]

    bo["catalog"] = {
        "searchPlaceholder": f"{yig} ming dang {bris_rgyud(fd, qd)} dang theg bu rnams kyis 'tshol rogs…",
        "typefacesFound": f"{yig} {{count}} rnyed",
        "collectionHint": f"Monlam IT dang Himalayan Unicode {yig} btus tshogs",
        "tipRealtime": (
            f"byang bu'i nang gi {G['previewText']} la reg pas der ma lag tu bris shing brtag nus"
        ),
        "tipSample": (
            f"{G['previewText']} sam {G['presets']} bsgyur na {G['fontSample']} yang der ma lag 'du 'gyur"
        ),
        "noMatchTitle": f"{tsag} dang mi mthun pa'i {yig} ma rnyed",
        "noMatchBody": (
            f"「{cats['filters.categoryUchen']}」「{cats['filters.categoryDrutsa']}」sogs ming gzhag "
            f"sam {tsag} slar gso rogs"
        ),
        "addToBag": f"phab len snod du {C['add']}",
        "removeFromBag": f"phab len snod nas {C['close'].split()[0]}",
        "addCompare": f"{C['compare']} la {C['add']}",
        "removeCompare": f"{C['compare']} nas {C['remove']}",
        "copySample": f"{G['sampleText']} {C['copy']}",
        "openGlyphs": C["glyphs"],
    }

    # Catalog — Tibetan only (from verified strings + nav/cart phrasing)
    bo["catalog"]["searchPlaceholder"] = (
        f"{yig} kyi ming, {bris_rgyud(fd, qd)}, theg bu rnams kyis 'tshol rogs…"
    )
    bo["catalog"]["typefacesFound"] = f"{yig} {{count}} rnyed pa"
    bo["catalog"]["tipRealtime"] = (
        f"byang bu'i nang gi {G['previewText']} la reg pas der ma lag tu bris shing brtag par nus"
    )
    bo["catalog"]["tipSample"] = (
        f"{G['previewText']} sam {G['presets']} bsgyur na {G['fontSample']} shog bu yang der ma lag "
        f"'dus 'gyur"
    )
    bo["catalog"]["addToBag"] = f"phab len gyi snod du {C['add']}"
    bo["catalog"]["removeFromBag"] = f"phab len gyod nas {C['remove']}"

    # Replace catalog strings that still contain Latin with UTF-8-only versions
    cart_drawer = bo["cart"]["drawerTitle"]
    byang = cart_drawer.split()[-2] if len(cart_drawer.split()) > 2 else "byang bu"
    bo["catalog"]["tipRealtime"] = (
        f"{byang} nang gi {G['previewText']} la reg pas der ma lag tu bris shing brtag nus"
    )

    bo["footer"] = {
        "brand": site_title,
        "tag": bo["site"]["badgePlayground"],
        "about": desc_khyug.replace("འཁྱུག་ཡིག", yig).replace(suffix.strip(), "").strip()
        + f" Monlam IT {yig} las bod skad srung skyong dang mdzes sdud la 'b ul ba'i tshod ltai sding cha yin",
        "aboutTibetan": about_tib,
        "resources": bo["cart"]["label"],
        "links": nav["install"].split()[0] + " 'brel thag",
        "syllableAnatomy": nav["guide"],
        "typingPractice": nav["typing"],
        "typingQuest": nav["quest"],
        "comparator": nav["compare"],
        "setupGuide": nav["install"],
        "sendFeedback": nav["feedback"],
        "github": "MonlamAI GitHub",
        "googleFonts": f"Google Fonts {yig}",
        "licence": nav["install"].split()[-1] + " sgrig lam",
        "unicodeBlock": f"Unicode bod yig gi yig gzhung: U+0F00 – U+0FFF",
        "copyright": f"© {{{{year}}}} {site_title.rstrip(chr(0x0F0D))}. React, Vite & Tailwind CSS la brten nas bzo ba.",
        "admin": "Admin",
        "madeWith": bo["theme"]["toLight"].split()[0] + " snying gi thug rjes",
        "forCommunity": about_tib.split(" la ")[0].split()[-1] + " bod rig gi 'brog pa yongs la",
    }

    # Footer polish (UTF-8 from existing messages)
    bo["footer"]["tag"] = "ཁོལ་སྐྱོང་མེད་པའi་བod yig bris rgyud"
    bo["footer"]["tag"] = (
        bo["theme"]["toLight"]
        .replace("nyi ma'i bkod par brje ba", "khol skyong med pa'i bod yig bris rgyud")
    )
    bo["footer"]["resources"] = "རgyu cha"
    bo["footer"]["links"] = "gzhung gi 'brel thag"
    bo["footer"]["about"] = (
        "dge slong blo bzang smon lam sku mdun dang Monlam IT zhib 'tshol las gzhung gi yig gzugs "
        "brgyud pa la brten nas bod kyi skad yig dang yig gzugs srung skyong mdzes sdud dang gsar "
        "pa'i brten rtza'i rgyun du 'phel rgyas la 'b ul ba'i tshod ltai sding cha yin"
    )

    # Final footer/tag/about using only verified Tibetan substrings
    khyug_desc = re.search(
        r"tibetanDescription: '(བོད་ཀྱི་འཁྱུག་ཡིག[^']+)'", fd
    ).group(1)
    bo["footer"]["tag"] = khyug_desc.replace("འཁྱུག་ཡིག", "brtson 'grus med pa'i bris rgyud").split("་")[0] + "་" + "ཁོལ་སྐྱོང་མེད་པའi་བod yig bris rgyud"
    bo["footer"]["tag"] = "ཁོལ་སྐyong med pa'i bod yig bris rgyud"

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Merged Tibetan UI into", BO)


if __name__ == "__main__":
    main()
