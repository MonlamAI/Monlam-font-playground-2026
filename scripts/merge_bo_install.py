#!/usr/bin/env python3
"""Rebuild install.* in bo.json from existing UTF-8 strings in the same file."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BO = ROOT / "src/i18n/messages/bo.json"


def main() -> None:
    bo = json.loads(BO.read_text(encoding="utf-8"))
    nav, C, cart, F, footer = bo["nav"], bo["common"], bo["cart"], bo["filters"], bo["footer"]
    yig = nav["typefaces"].rstrip("\u0f0d")
    inst = nav["install"].rstrip("\u0f0d")
    suite = cart["suiteTitle"]
    sp = suite.rstrip("\u0f0d").split("\u0f0b")
    # suiteTitle syllables: ཡིག·གཟུགས·དང·མཐེབ·གཞོང·…
    mtheb = "\u0f0b".join(sp[3:5]) if len(sp) >= 5 else "\u0f58\u0f0b\u0f42\u0f0b\u0f42\u0f74\u0f0b\u0f58\u0f0b\u0f42\u0f0b"

    bo["install"] = {
        "pageTitle": inst,
        "pageIntro": (
            f"{footer['aboutTibetan']} \u0f0b {suite} Mac & Windows "
            f"{cart['goInstall'].rstrip('\u0f0d')} \u0f0b {yig} .ttf {C['download']}"
        ),
        "suiteBadge": suite,
        "suiteDescription": (
            f"Monlam IT {suite} \u0f0b Unicode {yig} \u0f0b {mtheb} {C['download']} "
            f"Mac & Windows \u0f0b {footer['about'].rstrip('\u0f0d')}"
        ),
        "selectOs": f"{F['scriptStyle']} {C['add'].rstrip('\u0f0d')}:",
        "sourceLink": "monlamit.com/software/2",
        "assetsBadge": f"{cart['drawerTitle']} \u0f0b {cart['tabDownload']}",
        "assetsTitle": f"{yig} {C['download']} {C['downloadTtf']}",
        "assetsIntro": cart["emptyBody"],
        "assetsFooter": f"{cart['label']} {C['add']} \u0f0b {cart['tabDownload']} \u0f0b {cart['goInstall']}",
        "keyboardExtras": f"{mtheb} {C['download']} {C['add']}",
        "stepsTitle": cart["goInstall"],
        "stepsIntro": f"{F['scriptStyle']} {C['next']} \u0f0b {cart['goInstall'].rstrip('\u0f0d')}",
        "osWindows": "Windows",
        "osMac": "macOS",
        "osLinux": "Linux",
        "osMobile": "iOS & Android",
        "directDownloads": f"{yig} {C['downloadTtf']}",
        "directIntro": cart["suiteDesc"].replace("{{name}}", "Monlam").replace("{{version}}", ""),
        "typefacesAvailable": cart["chosenCount_one"].replace("\u0f56\u0f72\u0f0b\u0f58\u0f0b\u0f58\u0f72\u0f0b", "\u0f59\u0f0b\u0f51\u0f0d"),
        "macWindows": "Mac & Windows",
        "downloadMac": f"Mac \u0f0b {C['download']}",
        "downloadWin": f"Windows \u0f0b {C['download']}",
        "downloadKeyboardWin": f"Windows {mtheb} (2025)",
        "downloadIosStore": "iOS App Store",
        "fullTypefaceSet": yig,
        "keyboardInstallers": mtheb,
        "macAndWindows": "Mac & Windows",
        "selectedOnlyZip": cart["tabDownload"],
        "crossPlatformTtf": C["downloadTtf"],
        "typefacesListed": cart["chosenCount_one"].replace("\u0f56\u0f72\u0f0b\u0f58\u0f0b\u0f58\u0f72\u0f0b", "\u0f56\u0f72\u0f0b\u0f42\u0f62\u0f0b \u0f56\u0f72\u0f0b\u0f42\u0f62\u0f0b"),
        "openInstallCenter": f"{inst} \u2192",
        "steps": {
            "win1Title": f".ttf {yig} {inst.split('\u0f0b')[0] if '\u0f0b' in inst else inst}",
            "win2Title": f"Windows {mtheb} {C['add']}",
            "win3Title": f"{mtheb} brje \u0f0b {nav['typing'].rstrip('\u0f0d')}",
            "mac1Title": f"Font Book \u0f0b {yig} {inst}",
            "mac2Title": f"{mtheb} {C['add']}",
            "mac3Title": f"{mtheb} myur brje",
            "mobileIosTitle": "iOS / iPhone / iPad",
            "mobileAndroidTitle": "Android",
            "linux1Title": f"{yig} {C['copy']} (local)",
            "linux2Title": "font cache gsos",
            "linux3Title": f"{mtheb} IBus",
            "win1Body": f".ttf {C['download']} \u0f0b ZIP {C['remove']} \u0f0b {yig} {inst}",
            "win2Body": f"Windows Settings \u0f0b {bo['lang']['bo'].rstrip('\u0f0d')} {C['add']}",
            "win3Body": f"Win+Space \u0f0b {mtheb} brje \u0f0b {nav['typing']}",
            "mac1Body": f"Font Book \u0f0b .ttf {C['add']} \u0f0b {inst}",
            "mac2Body": f"System Settings \u0f0b {mtheb} {C['add']}",
            "mac3Body": f"Ctrl+Space \u0f0b {mtheb} brje",
            "mobileIosBody": f"iOS Settings \u0f0b {mtheb} {C['add']} \u0f0b {nav['typing']}",
            "mobileAndroidBody": f"Gboard \u0f0b {mtheb} {C['add']} \u0f0b Monlam {mtheb}",
            "linux1Body": f"~/.local/share/fonts \u0f0b {yig} {C['copy']}",
            "linux2Body": "fc-cache -f -v",
            "linux3Body": f"ibus-m17n \u0f0b {mtheb}",
        },
    }

    BO.write_text(json.dumps(bo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Wrote install section to", BO)


if __name__ == "__main__":
    main()
