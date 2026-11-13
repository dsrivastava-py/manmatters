# Kab Tak? (How long?)

An independent concept, not an official Man Matters product. An offline-first, no-login PWA that helps hair-loss users judge whether what they see is commonly reported for their week.

## Run

- `npm ci`
- `npm run dev` to develop, `npm test` to run unit tests, `npm run build` to produce `dist/`, `npm run preview` to serve it.
- `dist/` is static (relative base) and can be deployed to any static host.

## Content review status

`CLINICAL_REVIEW_PENDING` in `src/content/types.ts` is `true`. All clinical wording (phases, shed check, red flags, checkpoints, lapse guidance) is pending medical review and the app shows a "Content pending medical review" note. Set it to `false` only after a qualified clinician signs off.

## Brand sources and unverified items

- Colours (#143461, #225396, #F2F7FC, #FDDC69, neutrals) were inferred from colour frequency in manmatters.com CSS. The token-to-role mapping is an inference, not a style guide.
- Font: the site uses MiSansLatin, which is a third-party font whose licence for self-hosting was not confirmed. This project self-hosts Inter (via `@fontsource/inter`) instead. The font stack lists MiSansLatin first, so it is used only if installed.
- Logo: `public/brand/logo.png` is the Man Matters wordmark, a trademark asset. Usage rights are unverified. Use only in a clearly labelled concept header.
- Links live only in `src/config.ts`. manmatters.com has no dedicated consent page, so the terms and conditions page is used as the consent link. This is an open question.

## Structure

- `src/engine/*` pure logic (phases, shed check, checkpoint, lapse), unit tested.
- `src/content/*` typed bilingual content (English and Roman-script Hinglish), kept in sync by tests.
- `src/lib/storage.ts` the only localStorage wrapper, with memory fallback. No personal info is stored.
