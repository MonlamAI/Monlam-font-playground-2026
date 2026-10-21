# Localization files

## Completed EN ↔ BO translations (Excel)

**[Monlam-Playground-Translations-EN-BO.xlsx](./Monlam-Playground-Translations-EN-BO.xlsx)**

| Column | Content |
|--------|---------|
| **Serial Number** | 1…n |
| **Tibetan Keywords** | Merged `bo` locale string (`bo.json` + fallbacks) |
| **English Keywords** | `en.ts` source string |

Regenerate after i18n changes:

```bash
npx tsx scripts/export-translations-excel.mts
docs/localization/.venv/bin/python scripts/polish-translations-excel.py
```

## App keywords (English)

**[Monlam-Playground-App-Keywords-English.xlsx](./Monlam-Playground-App-Keywords-English.xlsx)**

Auto-extracted user-facing English from `src/` (~570+ strings). Primary column: **english**.

| Column | Purpose |
|--------|---------|
| **english** | UI copy / keyword from the web app |
| **source_file** | Where it was found |
| **area** | `components`, `admin`, `data`, etc. |
| **tibetan** | Empty — for your translations (also merge into `src/i18n/messages/bo.json`) |
| **notes** | Optional reviewer notes |

Regenerate after code changes:

```bash
docs/localization/.venv/bin/python scripts/extract-app-keywords.py
```

(Create the venv once: `python3 -m venv docs/localization/.venv && docs/localization/.venv/bin/pip install openpyxl`)

## Curated EN→BO glossary (optional)

If present, **Monlam-Playground-EN-BO-Glossary.xlsx** is a smaller hand-curated workbook with workflow columns (`key_id`, `status`, style guide). Generate with `scripts/generate-localization-workbook.py` when that script is in the repo.
