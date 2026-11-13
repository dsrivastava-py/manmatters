# Kab Tak? (How long?)

An independent concept, not an official Man Matters product. An offline-first, no-login PWA that helps hair-loss users judge whether what they see is commonly reported for their week.

## What and why

Hair routines take months to show results, and the hardest moments are the early shed and the "is this working?" doubt around weeks 8 to 12. Most tools are loggers: they ask users to record things and give little back. Kab Tak? is an **interpreter, not a logger**. The user enters one date, and the app tells them what is commonly reported at their exact week, what to do now, what to watch for, and when to talk to a doctor. It is honest when something may not be working.

## Screens

- **Your Week**: week number, phase, timeline with the two panic spikes and checkpoints at weeks 12 and 24, commonly reported guidance, month 6+ maintenance card.
- **Shed check**: 3-step triage with a "stop and consult a doctor" exit for red flags.
- **Checkpoint**: same-light, same-angle self-check at weeks 12 and 24, scored responding / unclear / not responding. No photo uploads.
- **I slipped**: missed-routine guidance (short gap, lapse, long gap).
- **How to apply**: tickable checklist with no quantities. Follows the product label or the doctor's instructions.
- **Share my week**: a "My Week" PNG card drawn on a canvas on the device. Uses the Web Share API with files where supported, otherwise downloads the PNG. No name, phone or personal data on the card.
- **Summary for my doctor**: printable one-page checkpoint summary (print stylesheet, "Print or save as PDF"). It states it is a self-report, not a diagnosis.
- **Settings and About**: language (English / Roman Hinglish), start date, clear all data, concept disclosure.

## Run, test, build, preview

- `npm ci`
- `npm run dev` develop
- `npm test` unit and component tests (Vitest)
- `npm run build` type-check and produce `dist/` (includes `manifest.webmanifest`, `sw.js`)
- `npm run preview` serve `dist/` locally; the service worker precaches all assets so the app works fully offline after the first load
- `node scripts/make-icons.mjs` regenerates `public/icons/*` (navy #143461 with a yellow #FDDC69 "KT" monogram, 192, 512, maskable 512, apple touch)

## Deploy

`dist/` is fully static. The Vite base is `./` and routing is hash based (`#/week`), so no rewrites are needed.

- **GitHub Pages**: `.github/workflows/deploy.yml` builds and publishes on push to `main` (enable Pages with source "GitHub Actions").
- **Netlify**: `netlify.toml` (build `npm run build`, publish `dist`). `public/_redirects` is included as a harmless fallback.
- **Vercel**: `vercel.json` (build `npm run build`, output `dist`).

## Architecture

- `src/engine/*` pure logic (phases, shed check, checkpoint, lapse), unit tested.
- `src/content/*` typed bilingual content (English and Roman-script Hinglish) sharing one interface. Tests assert identical key sets, no Devanagari, no em dashes, no dosing numbers, and that every red flag says to stop and consult a doctor.
- `src/lib/storage.ts` the only localStorage wrapper (versioned key, validation, memory fallback).
- `src/lib/shareCard.ts` canvas drawing and share/download logic (tested with a mocked navigator).
- `src/config.ts` single source for brand constants and external links.
- `src/screens/*`, `src/components/*`, `src/state/AppState.tsx`, `src/styles/*`.
- PWA via `vite-plugin-pwa` (autoUpdate, precache of all built assets, relative `start_url` and `scope`). A "Works offline" badge appears once the service worker is ready, with an install button (`beforeinstallprompt`) and an iOS Add to Home Screen hint.

## Privacy

Everything stays on the device in localStorage (start date, language, checkpoint results, last shed check, checklist ticks). No login, no analytics, no network requests at runtime, fonts are self-hosted. "Clear all my data" in Settings wipes it. No photos are taken or uploaded.

## BRAND SOURCES

- Pages fetched during planning: the manmatters.com home page HTML and CSS, plus the logo and font assets it references.
- Colours: #143461 navy (most used, text and CTA), #225396 blue, #F2F7FC pale surface, #FDDC69 yellow accent, neutrals #FFFFFF #F5F5F5 #E3E3E3 #C6C6C6 #9E9E9E #666666 #212121 #101828. **Verified**: these hex values appear in the site CSS, ranked by frequency. **Inferred**: which token plays which role (button, text, surface); there is no style guide.
- Font: the site CSS variable is `MiSansLatin, Inter`. MiSans is a third-party font whose self-hosting licence was not confirmed, so this project self-hosts Inter (`@fontsource/inter`) and lists MiSansLatin first only so it is used if installed.
- Logo: `https://i.mscwlns.co/media/misc/others/Manmatters%20Logo_egs4fo.png` copied to `public/brand/logo.png`. It is a trademark asset. **Usage rights are unverified**; it appears only in a header clearly labelled as an independent concept. Get permission before any public use.
- App icons are original (a "KT" monogram in brand colours), not the Man Matters logo.
- Tone is taken from the site copy: doctor-led, realistic timelines, "outcomes vary by individual".

## LINKS

- Consult: `https://manmatters.com/pages/hair-form-assessment` (HTTP 200 when checked; the site's "Take hair test" flow)
- Consent: `https://manmatters.com/terms-and-conditions`
- Privacy: `https://manmatters.com/privacy-policy`
- All are defined once in `src/config.ts`. **No dedicated consent page was found** on manmatters.com (guessed paths redirect to the shop), so terms and conditions is used as the consent link.

## CONTENT REVIEW

`CLINICAL_REVIEW_PENDING` in `src/content/types.ts` is `true` and the app shows "Content pending medical review". These areas need medical sign-off before real use (set the flag to `false` only after sign-off):

1. Phase timelines and "commonly reported" statements per week (early shed, settling, early signs, building, maintenance).
2. Shed-check triage rules and thresholds (which week and amount lead to see a doctor soon or unusual for week).
3. Red-flag list (swelling, dizziness, chest symptoms, severe irritation) and the stop-and-consult wording.
4. Checkpoint questions, scoring rules, and the 80 percent consistency cut-off at weeks 12 and 24.
5. Slipped-routine guidance and gap thresholds (short gap, lapse, long gap).
6. Month 6+ maintenance statements, including what happens when a routine is stopped.
7. How-to-apply checklist wording (must stay free of quantities).
8. Doctor summary wording and disclaimers.
9. Hinglish translations of all of the above.

## OPEN QUESTIONS for the Man Matters team

- Is there an official consent page or consult deep link to use instead of terms and conditions and the hair assessment page?
- Is use of the logo, name and brand colours allowed for this concept, and is MiSans licensed for self-hosting?
- Which clinician owns sign-off of the clinical content, and should timelines differ by product or concern (hair fall, thinning, receding, dandruff-related shedding)?
- Should checkpoint results be shareable with a doctor inside the consult flow instead of a printed summary?
- Preferred Hinglish tone and wording review.

Note: check the real Man Matters app's existing habit and photo tracker first, to avoid duplicating features. This concept deliberately does not track photos.
