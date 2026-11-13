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

`dist/` is fully static. The Vite base is `./` (works at the root and under GitHub Pages at `/manmatters/`) and routing is hash based (`#/week`), so no rewrites are needed.

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
- Font: **MiSansLatin**, the official Man Matters typeface (site CSS variable `--athena-font-family: MiSansLatin, Inter`). Self-hosted in `public/fonts/MiSansLatin/` from `https://s.mscwlns.co/rcl/p/365/public/static/fonts/MiSansLatin/MiSansLatin-{Medium,Semibold,Bold}.woff2`, the three files manmatters.com loads. `src/styles/tokens.css` reproduces the site's `@font-face` mapping exactly (Medium for weights 300-400, Semibold for 500-550, Bold for 600-700, `font-display: swap`). The files are precached by the service worker, so the font works offline. Fallback stack: `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`. Inter is no longer used. The share-card canvas waits for `document.fonts.load` on the three weights before drawing, and the print summary uses the same CSS font.
- Logo: the official wordmark `https://i.mscwlns.co/media/misc/others/Manmatters%20Logo_egs4fo.png` (800x217 PNG, the same file the site header and footer use), byte-identical copy in `public/brand/logo.png`. It is never recoloured, cropped or stretched: sizes are set by height with width `auto`, and it sits on white with clear space. Used in the app header, the share card (on a white plate, since its blue is not legible on navy), the printable doctor summary header, and all app/PWA icons (`public/icons/*`, generated by `scripts/make-icons.mjs`, which needs Playwright installed). The maskable icon keeps the logo inside the 80 percent safe zone. The site's own favicon (`apple-touch-icon_flwcl4.png`) is only 180px native, so it was not used.
- Rights: the author confirmed they may use the official logo and font for this Man Matters submission. The app is still labelled "Concept, not an official Man Matters product" in the header, About sheet, share card and doctor summary.
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
- Confirm the logo, name, brand colours and MiSansLatin may be used in this concept beyond the submission.
- Which clinician owns sign-off of the clinical content, and should timelines differ by product or concern (hair fall, thinning, receding, dandruff-related shedding)?
- Should checkpoint results be shareable with a doctor inside the consult flow instead of a printed summary?
- Is the checkpoint rule right? "Not responding" needs at most 1 positive sign of 4 and fewer than 2 "Not sure" answers, and is never shown before week 12. A clinician should confirm these thresholds.
- Preferred Hinglish tone and wording review.

Note: check the real Man Matters app's existing habit and photo tracker first, to avoid duplicating features. This concept deliberately does not track photos.

## Positioning & research

**Positioning:** Kab Tak? is a complementary *Interpretation Layer*. The Man Matters app tracks compliance (did you apply today?). Kab Tak? interprets outcomes (is what I am seeing normal for week N?). It needs no login or install, works instantly (for example at 11 PM when shedding panic hits) and is usable before and after purchase. It is an independent concept, not an official Man Matters product, and the app copy says it works alongside the Man Matters app and consult flow without claiming affiliation.

**Out of scope on purpose:** photo upload or analysis, habit tracking, reminders. Those are the territory of the existing app.

### Research findings

The research below came from a secondary AI tool. **Verify every link and claim yourself before submission.**

| Finding | Status |
| --- | --- |
| Man Matters app has a daily habit tracker with reminders and reward points | Reported by research (Verified Doctors, r/ThirtiesIndia AMA); verify |
| Progress tracker; co-founder says it "flags whether you're actually responding" | Reported by research; verify the exact quote and source |
| Doctor photo upload in the consult flow | Reported by research; verify |
| Blog timelines (Minoxidil Before and After advises monthly same-light, same-angle photos) | Reported by research; verify |
| Week-3 outreach (YouTube) | Reported by research; verify |
| A self-serve week-by-week "what is normal now" interpreter inside the app | **UNVERIFIED** (not confirmed to exist or not exist) |
| Men panic about shedding in weeks 2 to 4 and about reversal in months 5 to 6 (r/malehairadvice, r/IndianSkincareAddicts) | Anecdotal threads; verify |
| About 35 to 40 percent of users are low or non-responders (Gemini estimate) | **UNVERIFIED. Must NOT appear as a claim in app copy.** The app only says honestly that it may not be working for everyone. |

### Wedge

1. On-demand "is this normal for my week?" answer, self-serve, no callback wait.
2. Lapse vs plateau explainer (why a skipped stretch can show up as delayed shedding weeks later).
3. Honest week 12 and 24 checkpoints with a "not responding, talk to a doctor" exit (`NOT_RESPONDING_MAX_SCORE` in `src/engine/checkpoint.ts`: one or fewer positive signs).

### Overlap risk

The co-founder's progress-tracker claim ("flags whether you're actually responding") overlaps with the checkpoint. Difference: Kab Tak? works without an account or logged data, answers a symptom question for a given week on demand, explains the biology of what you see, and sends clear red-flag and not-responding cases to the Man Matters doctor consult. It does not log adherence, upload photos or send reminders. If the in-app tracker already provides a self-serve interpreter, the pitch should be reframed as a lightweight, pre-purchase and anonymous entry point.

### Emergency handling

The 112 link appears only for chest symptoms and swelling. Dizziness and severe irritation say to stop and consult a doctor without the emergency call.
