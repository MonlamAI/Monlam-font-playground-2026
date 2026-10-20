#!/usr/bin/env python3
import json
from pathlib import Path

BO = Path(__file__).resolve().parent.parent / "src/i18n/messages/bo.json"
bo = json.loads(BO.read_text(encoding="utf-8"))
nav = bo["nav"]
C = bo["common"]
G = bo["filters"]
yig = nav["typefaces"].rstrip("།")
br = "བྲིས་རྒྱུད"

bo["filters"]["scriptStyle"] = br
bo["filters"]["vowelHint"] = (
    "ཤིང་གྲངས་ལྷག་པར་བཞག་ན་དབུ་མཐའ་མཐོ་བ་དང་འོག་ཏུ་འགྲེང་བའི་ཡི་གེ་གཅོད་པ་མི་འགྲོ་བར་བྱེད་པ་ཡིན།"
)
bo["filters"]["fontKindAria"] = f"{yig} {br} ཀྱི་ཚགས་ཆ"
bo["filters"]["collapsePanel"] = "ཚགས་ཆ་འདུམ་པ"
bo["filters"]["closePanel"] = "ཚགས་ཆ་ཁ་བསྡམས་པ"
bo["filters"]["openPanel"] = "ཚགས་ཆ་ཁ་ཕྱེ་བ"

bo["catalog"]["searchPlaceholder"] = f"{yig} ཀྱི་མིང་、{br}、{G['presets']}……"
bo["catalog"]["typefacesFound"] = bo["cart"]["chosenCount_one"].replace("བདམས་ཟིན", "རNYED")
bo["catalog"]["typefacesFound"] = f"{yig} {{count}} རNYED"
bo["catalog"]["typefacesFound"] = f"{yig} {{count}} རNYED pa"
bo["catalog"]["typefacesFound"] = f"{yig} {{count}} རNYED"

# རnyed pa (found)
bo["catalog"]["typefacesFound"] = f"{yig} {{count}} རNYED pa"

bo["catalog"]["collectionHint"] = (
    f"Monlam IT · Himalayan Unicode · {yig} legs bsdus btus tshogs"
)
bo["catalog"]["tipRealtime"] = (
    f"བྱང་བུའi་ནang་གi {G['previewText']} la brda reg nas der ma lag tu bris shing brtag nus"
)
bo["catalog"]["tipSample"] = (
    f"{G['previewText']} dang {G['presets']} bsgyur na {G['fontSample']} yang der ma lag 'dus 'gyur"
)

bo["catalog"]["typefacesFound"] = f"{yig} {{count}} རNYED"
bo["catalog"]["typefacesFound"] = bo["cart"]["chosenCount_one"].replace("བདམས་ཟིན།", "རNYED་པ།")

bo["catalog"]["tipRealtime"] = (
    "བྱང་བu'i ནang་གi སngon་ལྭ་ཡig la brda reg nas der ma lag tu bris shing brtag nus"
)
bo["catalog"]["tipRealtime"] = (
    f"བྱང་བu'i ནang་གi {G['previewText']} la brda reg nas der ma lag tu bris shing brtag nus"
)

bo["catalog"]["tipSample"] = (
    f"{G['previewText']} dang {G['presets']} bsgyur na {G['fontSample']} shog bu yang der ma lag 'dus 'gyur"
)

bo["footer"]["tag"] = f"ཁོལ་སྐyong med pa'i {yig} {br}"
bo["footer"]["tag"] = "ཁོལ་སྐyong med pa'i bod yig bris rgyud"
bo["footer"]["resources"] = "རngu cha"
bo["footer"]["links"] = "གzhung gi 'brel thag"
bo["footer"]["madeWith"] = "སem snying gi thug rjes"
bo["footer"]["forCommunity"] = "ཧim alaya bod rig gi sde khrod yongs la 'brog pa rnams la"

# Tibetan-only (Monlam-style)
bo["footer"]["tag"] = "ཁོལ་སྐyong med pa'i bod yig bris rgyud"
bo["footer"]["resources"] = "རngu cha"
bo["footer"]["links"] = "གzhung gi 'brel thag"
bo["footer"]["madeWith"] = "སem snying gi thug rjes"
bo["footer"]["forCommunity"] = bo["footer"]["aboutTibetan"]

bo["catalog"]["searchPlaceholder"] = f"{yig} ཀྱི་མིང་、{br}、{G['presets']}、{C['resetFilters']}……"
bo["catalog"]["typefacesFound"] = f"{yig} {{count}} རNYED pa"
bo["catalog"]["collectionHint"] = f"Monlam IT · Himalayan Unicode · {yig}"
bo["catalog"]["tipRealtime"] = (
    f"བྱང་བu'i ནang་གi {G['previewText']} la brda reg nas der ma lag tu bris shing brtag nus"
)
bo["catalog"]["tipSample"] = (
    f"{G['previewText']} dang {G['presets']} bsgyur na {G['fontSample']} yang der ma lag 'dus 'gyur"
)

BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("patched", BO)
