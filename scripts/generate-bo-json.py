#!/usr/bin/env python3
"""Merge English message tree with Tibetan flat overrides → src/i18n/messages/bo.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EN_FLAT = ROOT / "scripts" / "en-flat.json"
TIB_FLAT = ROOT / "scripts" / "tibetan-flat.json"
BO_OUT = ROOT / "src" / "i18n" / "messages" / "bo.json"
EN_TS = ROOT / "src" / "i18n" / "messages" / "en.ts"


def unflatten(flat: dict[str, str]) -> dict:
    root: dict = {}
    for key, value in flat.items():
        parts = key.split(".")
        cur = root
        for part in parts[:-1]:
            cur = cur.setdefault(part, {})
        cur[parts[-1]] = value
    return root


def deep_merge(base: dict, over: dict) -> dict:
    out = json.loads(json.dumps(base))
    for k, v in over.items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = deep_merge(out[k], v)
        else:
            out[k] = v
    return out


def main() -> None:
    en_flat = json.loads(EN_FLAT.read_text(encoding="utf-8"))
    tib_flat = json.loads(TIB_FLAT.read_text(encoding="utf-8"))
    partial = json.loads(BO_OUT.read_text(encoding="utf-8")) if BO_OUT.exists() else {}

    merged_flat = {**en_flat, **tib_flat}
    en_tree = unflatten(en_flat)
    tib_tree = unflatten(merged_flat)
    final = deep_merge(en_tree, deep_merge(tib_tree, partial))

    BO_OUT.write_text(json.dumps(final, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    missing = [k for k in en_flat if k not in tib_flat]
    print(f"Wrote {BO_OUT} ({len(tib_flat)} Tibetan overrides, {len(missing)} still English)")


if __name__ == "__main__":
    main()
