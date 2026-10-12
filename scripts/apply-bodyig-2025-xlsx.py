#!/usr/bin/env python3
"""Apply Monlam Keyboard To be fixed.xlsx corrections to tibetanData.ts Bodyig 2025 layout."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TS_PATH = ROOT / "src" / "data" / "tibetanData.ts"

# Use \u escapes so the script source cannot be corrupted in transit.
U = lambda h: chr(int(h, 16))

# Shorthand Tibetan / marks used below
TSHEG = "\u0f0b"
SHAD = "\u0f0d"
KA = "\u0f40"
KHA = "\u0f41"
GA = "\u0f42"
NGA = "\u0f44"
CA = "\u0f45"
CHA = "\u0f46"
JA = "\u0f47"
NYA = "\u0f49"
TTA = "\u0f4a"
TTHA = "\u0f4b"
DDA = "\u0f4c"
NNA = "\u0f4e"
TA = "\u0f4f"
THA = "\u0f50"
DA = "\u0f51"
NA = "\u0f53"
PA = "\u0f54"
PHA = "\u0f55"
BA = "\u0f56"
MA = "\u0f58"
TSA = "\u0f59"
TSHA = "\u0f5a"
DZA = "\u0f5b"
WA = "\u0f5d"
ZHA = "\u0f5e"
ZA = "\u0f5f"
ACHUNG = "\u0f60"
YA = "\u0f61"
RA = "\u0f62"
LA = "\u0f63"
SHA = "\u0f64"
SSA = "\u0f65"
SA = "\u0f66"
HA = "\u0f67"
A = "\u0f68"
I_VOWEL = "\u0f72"
U_VOWEL = "\u0f74"
E_VOWEL = "\u0f7a"
O_VOWEL = "\u0f7c"
HALANTA = "\u0f84"
YA_SUB = "\u0fb1"
RA_SUB = "\u0fb2"
LA_SUB = "\u0fb3"
WA_SUB = "\u0fad"
HA_SUB = "\u0fb7"
RA_FIXED = "\u0fbc"

# Digits / marks
D0, D1, D2, D3, D4 = "\u0f20", "\u0f21", "\u0f22", "\u0f23", "\u0f24"
D5, D6, D7, D8, D9 = "\u0f25", "\u0f26", "\u0f27", "\u0f28", "\u0f29"
YIG_MGO = "\u0f04\u0f05"  # ༄༅
YIG_MGO_2 = "\u0f05"  # ༅
NYIS_SHAD_LEFT = "\u0f3c"  # ༼
NYIS_SHAD_RIGHT = "\u0f3d"  # ༽
MARK_F08 = "\u0f08"  # ༈
MARK_F38 = "\u0f38"  # ༸
MARK_F37 = "\u0f37"  # ༷
MARK_F35 = "\u0f35"  # ༵
MARK_F39 = "\u0f39"  # ༹
MARK_F11 = "\u0f11"  # ༑
MARK_F80 = "\u0f80"  # ྀ
MARK_F81 = "\u0f81"  # ཱྀ
MARK_F83 = "\u0f83"  # ྃ
MARK_F7E = "\u0f7e"  # ཾ
MARK_F7B = "\u0f7b"  # ཻ
MARK_F7D = "\u0f7d"  # ཽ
MARK_F75 = "\u0f75"  # ཱུ
MARK_F73 = "\u0f73"  # ཱི
GHA = "\u0f43"  # གྷ
DDHA = "\u0f4d"  # ཌྷ
DHA = "\u0f52"  # དྷ
BHA = "\u0f57"  # བྷ
MARK_F7F = "\u0f7f"  # ཿ
RA_PLUS = RA + HALANTA  # ར྄
LA_PLUS = LA + HALANTA  # ལ྄
SA_PLUS = SA + HALANTA  # ས྄
JA_SUB = "\u0fac"  # ྫྷ  (approx j-sub used previously)

# Caps-layer specific
C_F09 = "\u0f09"  # ༉
C_F15 = "\u0f15"  # ༕
C_F2A = "\u0f2a"  # ༪
C_F16 = "\u0f16"  # ༖
C_F2B = "\u0f2b"  # ༫
C_F2C = "\u0f2c"  # ༬
C_F2D = "\u0f2d"  # ༭
C_F2E = "\u0f2e"  # ༮
C_F2F = "\u0f2f"  # ༯
C_F30 = "\u0f30"  # ༰
C_F31 = "\u0f31"  # ༱
C_F32 = "\u0f32"  # ༲
C_F33 = "\u0f33"  # ༳
C_F18 = "\u0f18"  # ༘
C_FC0 = "\u0fc0"  # ࿀
C_FC1 = "\u0fc1"  # ࿁
C_FC2 = "\u0fc2"  # ࿂
C_FC4 = "\u0fc4"  # ࿄
C_FC5 = "\u0fc5"  # ࿅
C_FC6 = "\u0fc6"  # ࿆
C_FC8 = "\u0fc8"  # ࿈
C_FC9 = "\u0fc9"  # ࿉
C_FCA = "\u0fca"  # ࿊
C_FCB = "\u0fcb"  # ࿋
C_FCC = "\u0fcc"  # ࿌
C_FCF = "\u0fcf"  # ࿏
C_F3A = "\u0f3a"  # ༺
C_F3B = "\u0f3b"  # ༻
C_F7F_C = "\u0f7f"  # reuse
C_FBF = "\u0fbf"  # ྿
C_F86 = "\u0f86"  # ྆
C_F87 = "\u0f87"  # ྇
C_F01 = "\u0f01"  # ༁
C_F02 = "\u0f02"  # ༂
C_F7F2 = "\u0f7f"
C_F3E = "\u0f3e"  # ༾
C_F3F = "\u0f3f"  # ༿
C_F06 = "\u0f06"  # ༆
C_F07 = "\u0f07"  # ༇
C_F13 = "\u0f13"  # ༓
C_F03 = "\u0f03"  # ༃
C_F0A = "\u0f0a"  # ༊
C_F0F = "\u0f0f"  # ༏
C_F10 = "\u0f10"  # ༐
C_F88 = "\u0f88"  # ྈ
C_F12 = "\u0f12"  # ༒
C_F17 = "\u0f17"  # ༗
C_F19 = "\u0f19"  # ༙
C_F1A = "\u0f1a"  # ༚
C_F1B = "\u0f1b"  # ༛
C_F1C = "\u0f1c"  # ༜
C_F1D = "\u0f1d"  # ༝
C_F1E = "\u0f1e"  # ༞
C_F1F = "\u0f1f"  # ༟
C_F89 = "\u0f89"  # ྉ

# key, char, shiftChar, label, wylie, shiftWylie, capsChar|None, capsShiftChar|None
ROWS: list[list[tuple]] = [
    [
        ("`", TSHEG, MARK_F38, "`", "tsheg", "mark", C_F09, C_F15),
        ("1", D1, MARK_F11, "1", "1", "!", C_F2A, C_F16),
        ("2", D2, YIG_MGO, "2", "2", "yig-mgo", C_F2B, C_FC0),
        ("3", D3, YIG_MGO_2, "3", "3", "yig-mgo", C_F2C, C_FC1),
        ("4", D4, MARK_F39, "4", "4", "mark", C_F2D, C_FC2),
        ("5", D5, MARK_F35, "5", "5", "mark", C_F2E, C_FC4),
        ("6", D6, MARK_F08, "6", "6", "mark", C_F2F, C_FC5),
        ("7", D7, NYIS_SHAD_LEFT, "7", "7", "(", C_F30, C_FC6),
        ("8", D8, NYIS_SHAD_RIGHT, "8", "8", ")", C_F31, C_FC8),
        ("9", D9, "(", "9", "9", "(", C_F32, C_FC9),
        ("0", D0, ")", "0", "0", ")", C_F33, C_FCA),
        ("-", MARK_F80, MARK_F81, "-", "i-rev", "i-rev", C_F18, C_FCB),
        ("=", MARK_F83, MARK_F7E, "=", "M", "M", MARK_F73, C_FCC),
    ],
    [
        ("q", TTA, TTHA, "Q", "Ta", "Tha", C_F3A, C_FCF),
        ("w", WA, WA_SUB, "W", "wa", "w-sub", C_F3B, None),
        ("e", E_VOWEL, MARK_F7B, "E", "e", "ai", C_FBF, None),
        ("r", RA, RA_PLUS, "R", "ra", "r+", C_F86, None),
        ("t", TA, THA, "T", "ta", "tha", C_F87, None),
        ("y", YA, YA_SUB, "Y", "ya", "y-sub", C_F01, None),
        ("u", U_VOWEL, MARK_F75, "U", "u", "U", C_F02, None),
        ("i", I_VOWEL, MARK_F80, "I", "i", "i-rev", C_F3F, None),
        ("o", O_VOWEL, MARK_F7D, "O", "o", "au", C_F3E, None),
        ("p", PA, PHA, "P", "pa", "pha", C_F06, None),
        ("[", MARK_F37, "\u0f82", "[", "mark", "mark", C_F07, None),  # ྂ
        ("]", HALANTA, MARK_F35, "]", "stack", "mark", C_F13, None),
    ],
    [
        ("a", HALANTA, A, "A", "stack", "a", C_FC9, None),
        ("s", SA, SHA, "S", "sa", "sha", C_FCA, None),
        ("d", DA, DZA, "D", "da", "dza", C_FCB, None),
        ("f", NGA, DHA, "F", "nga", "dha", C_FCC, None),
        ("g", GA, GHA, "G", "ga", "gha", C_F0A, None),
        ("h", HA, HA_SUB, "H", "ha", "h-sub", C_F0F, None),
        ("j", JA, JA_SUB, "J", "ja", "j-sub", C_F10, None),
        ("k", KA, KHA, "K", "ka", "kha", C_F88, None),
        ("l", LA, LA_PLUS, "L", "la", "l+", C_F12, None),
        (";", DDHA, MARK_F7F, ";", "ddha", "H", C_F13, ":"),
        ("'", ACHUNG, "\u0f71", "'", "'a", "A", ACHUNG, C_F15),  # ཱ
    ],
    [
        ("z", ZA, ZHA, "Z", "za", "zha", C_F17, None),
        ("x", TSA, TSHA, "X", "tsa", "tsha", C_F19, None),
        ("c", CA, CHA, "C", "ca", "cha", C_F1A, None),
        ("v", DDA, NNA, "V", "Da", "Na", C_F1B, None),
        ("b", BA, BHA, "B", "ba", "bha", C_F1C, None),
        ("n", NA, NYA, "N", "na", "nya", C_F1D, None),
        ("m", MA, SSA, "M", "ma", "Sha", C_F1E, None),
        (",", YA_SUB, "\u0f71", ",", "y-sub", "A", C_F1F, None),
        (".", RA_SUB, RA_FIXED, ".", "r-sub", "r-fixed", C_F89, None),
        ("/", SHAD, SA_PLUS, "/", "shad", "s+", SHAD, None),
        (" ", TSHEG, " ", "SPACE", "tsheg", "space", None, None),
    ],
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def fmt_key(t: tuple) -> str:
    key, char, shift, label, wylie, swylie, caps, caps_shift = t
    parts = [
        f"key: '{esc(key)}'",
        f"char: '{esc(char)}'",
        f"shiftChar: '{esc(shift)}'",
        f"label: '{esc(label)}'",
        f"wylie: '{esc(wylie)}'",
        f"shiftWylie: '{esc(swylie)}'",
    ]
    if caps is not None:
        parts.append(f"capsChar: '{esc(caps)}'")
    if caps_shift is not None:
        parts.append(f"capsShiftChar: '{esc(caps_shift)}'")
    return "{ " + ", ".join(parts) + " }"


def main() -> None:
    text = TS_PATH.read_text(encoding="utf-8")
    marker = "/**\n * Official Monlam Bodyig 2025 layout."
    idx = text.find(marker)
    if idx < 0:
        raise SystemExit("Bodyig 2025 layout marker not found")
    head = text[:idx]

    lines: list[str] = [
        "/**",
        " * Official Monlam Bodyig 2025 layout.",
        ' * Corrections + Caps Lock layer from "Monlam Keyboard To be fixed.xlsx".',
        " * Space → \u0f0b (tsheg); Shift+Space → regular space.",
        " */",
        "export const TIBETAN_KEYBOARD_LAYOUT: KeyMap[][] = [",
    ]
    for row in ROWS:
        lines.append("  [")
        for key in row:
            lines.append("    " + fmt_key(key) + ",")
        lines.append("  ],")
    lines += [
        "];",
        "",
        "/** Windows US QWERTY adds the OEM backslash key on the second row. */",
        "export function toWindowsKeyboardLayout(macLayout: KeyMap[][]): KeyMap[][] {",
        "  const rows = macLayout.map((row) => row.map((k) => ({ ...k })));",
        "  if (rows[1] && !rows[1].some((k) => k.key === '\\\\')) {",
        "    rows[1].push({",
        "      key: '\\\\',",
        "      char: '\u0f14',",
        "      shiftChar: '\u0f08',",
        "      label: '\\\\',",
        "      wylie: 'gter',",
        "      shiftWylie: 'nyis',",
        "      capsChar: '\u0f03'",
        "    });",
        "  }",
        "  return rows;",
        "}",
        "",
        "export const TIBETAN_KEYBOARD_LAYOUT_WINDOWS: KeyMap[][] =",
        "  toWindowsKeyboardLayout(TIBETAN_KEYBOARD_LAYOUT);",
        "",
        "/** Resolve the character a key produces for the current shift/caps state. */",
        "export function keyMapOutput(key: KeyMap, shift: boolean, caps: boolean): string {",
        "  if (caps) {",
        "    if (shift) return key.capsShiftChar ?? key.capsChar ?? key.shiftChar;",
        "    return key.capsChar ?? key.char;",
        "  }",
        "  return shift ? key.shiftChar : key.char;",
        "}",
        "",
    ]

    TS_PATH.write_text(head + "\n".join(lines), encoding="utf-8")
    content = TS_PATH.read_text(encoding="utf-8")
    if "\ufffd" in content:
        raise SystemExit("Replacement character found — data corrupted")

    checks = {
        "Shift+~": "shiftChar: '\u0f38'",
        "Shift+y": "shiftChar: '\u0fb1'",
        "Shift+I": "key: 'i'" in content and "shiftChar: '\u0f80'" in content,
        "Shift+6": "shiftChar: '\u0f08'",
        "[": "char: '\u0f37'",
        "]": "char: '\u0f84'",
    }
    print("Updated", TS_PATH)
    for name, needle in checks.items():
        ok = needle if isinstance(needle, bool) else needle in content
        # special for Shift+I: find i key line
        if name == "Shift+I":
            for line in content.splitlines():
                if "key: 'i'" in line:
                    ok = "shiftChar: '\u0f80'" in line
                    print(f"  {name}: {'OK' if ok else 'FAIL'} -> {line.strip()[:80]}")
                    break
            continue
        print(f"  {name}: {'OK' if ok else 'FAIL'}")


if __name__ == "__main__":
    main()
