# Persian is the default language; the chosen language lives in a cookie

The interface is offered in Persian and English, and Persian (right to left) is the default, because the Organizations that use it work in Persian. Messages live in `apps/web/src/i18n/messages/{fa,en}.json` and are read through `next-intl`, which also formats dates (Persian dates in the Solar Hijri calendar), numbers (Persian digits) and plurals per language. The chosen language is stored in a `NEXT_LOCALE` cookie by a Server Action and read by `src/i18n/request.ts`; `<html lang dir>` follows it, and Radix components receive the direction through `Direction.Provider`. Layout uses logical properties (`ms-*`, `text-start`, `start-*`) so one set of classes serves both directions. Dana is the typeface for both languages.

## Considered Options

- **Language in the URL (`/fa/…`, `/en/…`)**: the usual choice for public sites, because each language gets its own indexable address. Every page here is behind sign-in and nothing is indexed, while a locale segment would touch every route, every link, `proxy.ts`'s matcher and the sign-in `next` parameter.
- **Detect from `Accept-Language` only**: no way for a User to choose, and most browsers in Iran still send English first.

## Consequences

- A URL does not carry its language; a shared link opens in the reader's own language.
- The API's error and validation messages stay English: the UI shows its own message per status instead, and only an API field-validation message, which client-side validation makes rare, can appear untranslated.
- Fabricated data (Project and Finding titles, names) is English in both languages; it is data, not interface.
