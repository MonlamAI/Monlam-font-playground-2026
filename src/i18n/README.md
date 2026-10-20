# UI internationalization

- **Default locale:** Tibetan (`bo`), stored in `localStorage` key `monlam-ui-locale`.
- **English:** secondary (`en`).
- **Messages:** `messages/en.ts` (source tree) + `messages/bo.json` (Tibetan overrides merged on top).
- **Usage:** `const { t, locale, setLocale } = useI18n()` then `t('nav.typefaces')`.

Expand Tibetan coverage by adding keys to `bo.json` (use [Monlam Grand Dictionary](https://monlamdictionary.com/) and `docs/localization/Monlam-Playground-App-Keywords-English.xlsx`).
