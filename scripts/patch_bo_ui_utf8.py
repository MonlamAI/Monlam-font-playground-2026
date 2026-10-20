#!/usr/bin/env python3
"""Patch bo.json UI strings with UTF-8 Tibetan (Monlam-style literary Tibetan)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BO = ROOT / "src/i18n/messages/bo.json"


def main() -> None:
    data = json.loads(BO.read_text(encoding="utf-8"))

    data.setdefault("site", {})["titleTibetan"] = (
        "སྨོན་ལམ་བོད་ཡིག་གཟུགས་ཀྱི་ཚོད་ལྟའི་སྡིངས་ཆ།"
    )

    data["filters"].update(
        {
            "fontSampleHint": "ཁྱད་པar་ཅan GyI ཡig Gzugs re re'i rang bzhin gyi dpe yig",
            "scriptStyle": "བྲis rgyud",
            "resetAll": "ཚang ma slar gsos",
            "clearSearch": "འtshol zad bsal ba",
            "fontKindAria": "ཡig gzugs bris rgyud kyi tshags cha",
            "railPresetsCustom": "rang bzhin gyi sngon bzhag",
            "collapsePanel": "tshags cha 'dzum pa",
            "expandPanel": "tshags cha rgyas pa",
            "closePanel": "tshags cha kha bsdams pa",
            "openPanel": "tshags cha kha phye ba",
            "vowelHint": (
                "ཤing grangs lhag par bzhag na dbu mtha' mtho ba dang 'og tu 'greng ba'i yig gi "
                "cha nas mi gcod par byed do"
            ),
            "noSpecialPresets": (
                "དa lta rang sgrigs sngon bzhag ma 'dzugs pa red. Admin → ཡig Gzugs ནas "
                "ཁyad par can yig gzugs la sngon bzhag sgrig rogs"
            ),
            "viewGrid": "gru rgyal lta ba",
            "viewList": "re'u mig lta ba",
            "viewSample": "dpe mtshon shog bu",
        }
    )

    data["catalog"].update(
        {
            "searchPlaceholder": "ཡig gzugs kyi ming, bris rgyud, sgo grangs sogs kyis 'tshol rogs…",
            "typefacesFound": "ཡig gzugs {{count}} rnyed",
            "collectionHint": "Monlam IT dang Himalayan Unicode ཡig gzugs tshogs bkod pa",
            "tipRealtime": (
                "byang bu'i dpe yig steng du bzhin bris btab pas deng tsun du brtag dang lus shig"
            ),
            "tipSample": (
                "sngon lta yig dang sngon bzhag bstan bcos gso ba na dpe mtshon shog bu yang "
                "deng tsun du gsar ba yin"
            ),
            "noMatchTitle": "tshags cha dang ma mthun pa'i yig gzugs ma rnyed",
            "noMatchBody": (
                "「དbucan」「'bru tsa」sogs sgo grangs gzhan bzhin 'tshol te, yang na tshol zad "
                "slar gsos rogs"
            ),
        }
    )

    data["footer"].update(
        {
            "tag": "ཁ་ཕ་ཡི་བོད་ཡིག་ཡིག་གཟུགས",
            "about": (
                "ngang rgyal dbang sprul sku blo bzang smon lam mched dang Monlam IT zhib 'tshol "
                "las drung chen gyi yig gzugs brgyud pa'i steng nas bod kyi skad yig dang yig gzugs "
                "sru skyong dang mdzes ldan dang dus rab tu digital 'phel rgyas gtong ba'i thabs la "
                "snying bcas nas 'bad pa yin"
            ),
            "resources": "las sgrub dang yig cha",
            "links": "gzhung gi 'brel thag",
            "syllableAnatomy": "yang yang dpe byed kyi gad tshigs dbyibs 'char",
            "licence": "ཕab len dang sgrig lam srol",
            "madeWith": "བyas",
            "forCommunity": "'dzam gling bod yul yul gru bsdu ba'i dge 'dun chen po la",
        }
    )

    BO.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Patched", BO)


if __name__ == "__main__":
    main()
