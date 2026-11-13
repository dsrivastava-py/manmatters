# Kab Tak? (How long?)

An independent concept, not an official Man Matters product. An offline-first, no-login PWA that helps hair-loss users judge whether what they see is commonly reported for their week.

## Mosaic Wellness Fellowship Builder Challenge submission

### Builder

- **Name:** Devansh Srivastava
- **College:** Kirori Mal College, University of Delhi
- **Email:** devanshsrivastava.reads@gmail.com
- **Phone:** +91 8736956764

### Brand

Man Matters (Mosaic Wellness), hair-loss users.

### Problem statement

Hair-loss routines take months to show results. Users see more shedding in the first weeks, then doubt around weeks 8 to 12, and have no way to tell whether what they see is normal for their week or whether the routine is working. The fear leads to quitting early or to repeated "is this normal?" questions to support and doctors.

### Short explanation (about 130 words)

Kab Tak? ("How long?") is a no-login, offline web app that sits alongside the Man Matters app and doctor consult. The user enters one date, the day they started their routine. The app then answers the five questions users actually ask: where am I, is this normal for my week, when will it change (with a real calendar date for the next milestone), is it working, and what do I do now. A three-step shed check separates commonly reported shedding from red flags that need a doctor. Week-12 and week-24 checkpoints give a clear verdict (on track, early signs, fix the routine first, not responding yet, or too early) with the reasons and the next date. Clear cases go straight to the Man Matters doctor consult. Nothing leaves the phone.

### Key features mapped to the problem

| User question | Feature |
| --- | --- |
| Where am I? | Your Week: week number, phase, journey timeline with "you are here" |
| Is this normal for my week? | Commonly reported card per phase; Shed check (3 steps, red flags override) |
| Kab tak? When will it change? | Next milestone with date and "in N weeks" on Your Week; a "Kab tak?" line on every shed check, slipped and checkpoint result |
| Is it working? | Week-aware checkpoints at weeks 12 and 24 with a "why this result" breakdown |
| What do I do now? | One "Do this now" action on every result; consult link for doctor cases; 112 only for chest symptoms and swelling |
| I missed days | I slipped: lapse vs plateau, how much the timeline moves |
| Talk to my doctor | Printable doctor summary and a shareable My Week card (no personal data) |

### Main flow for reviewers

Live link: https://dsrivastava-py.github.io/manmatters/

1. Open the link on a phone (or a narrow browser window). Tap **1 month ago** on the start screen.
2. **Your Week** shows week 5, the phase, the journey timeline and the next milestone with its date.
3. Tap **I'm shedding more**, keep the week, pick **A bit more than usual**, then **See my result**. Read the "Kab tak?" line.
4. Go back and run it again, ticking **Chest symptoms** in step 3, to see the emergency path (112) and the consult link.
5. Open **Checkpoint**. Before week 12 it shows "Too early to judge" with the checkpoint 1 date. To see a verdict, open Settings, **Change start date**, pick a date about 12 weeks ago, then answer the questions (try "Yes" only for less shedding).
6. Open **I slipped** and tap **10 days**.
7. Switch to **Hinglish** in the app bar, and try Light, Dark or System under **Settings > Appearance**.
8. From Your Week, open **Summary for my doctor** and **Share my week**.

### AI tools used

- **Kiro agent (with Claude models)** for planning, writing the code and tests, reviewing and visual checks.
- **ChatGPT, Gemini and Perplexity style tools** for secondary research on the brand, the existing Man Matters app and user discussions (see Positioning & research; every finding is marked verified or not).

### Privacy

No customer names or phone numbers are in the app or in this repo. The app contains no customer data at all; the Part 1 document here has the interview findings with customers labelled C1 to C5. The app stores only the user's own start date, language, theme and check results in localStorage on their device.

### Submission documents

Each document is kept as Markdown (easy to read on GitHub) and as Word (to upload). The Word files are generated from the Markdown with `python3 scripts/build-docs.py` (needs `pip install python-docx`).

| Document | Markdown | Word |
| --- | --- | --- |
| Part 1: Customer conversations, patterns, problem statement, 44-point secondary research | [part-1-customer-research.md](docs/part-1-customer-research.md) | [Part-1-Customer-Conversations-Man-Matters.docx](docs/Part-1-Customer-Conversations-Man-Matters.docx) |
| Part 2: What I built, how it solves the problem, key decisions, AI tools | [part-2-solution.md](docs/part-2-solution.md) | [Part-2-Solution-Kab-Tak.docx](docs/Part-2-Solution-Kab-Tak.docx) |

**Consent:** all five customers gave permission to share their name, phone number and feedback with Mosaic. Their names and numbers are only in the copy submitted to Mosaic, never in the app or in this repository. The secondary research uses public posts, cited by link only, with no usernames or contact details, since consent from those people was not needed or sought.

**Research method:** secondary research first (44 public posts and reviews from Reddit, App Store, Google Play, Quash, ConsumerComplaints.in and YouTube, 2024 to 2026) to prepare the questions, then five real customer conversations to test it. The problem statement is based on the conversations; the secondary research is labelled as context.

**Top public themes (out of 44):** cannot tell if it is working 22.7%, competitor comparison 22.7%, trust doubts 20.5%, clear positive results 20.5%, price and refunds 18.2%, consult quality 18.2%, early shed panic 9.1%. Doubt clusters at weeks 2 to 4 (early shed) and months 4 to 7 (plateau or relapse).

**What the five customers said:** all five asked a version of "is this normal for where I am, and how long until I know if it's working?" Three stopped and two nearly did. One may have quit a working routine after a lapse shed, and two stayed for months on plans that were not working for them. Full write-up, without names or numbers, in the Part 1 document.

## What and why

Hair routines take months to show results, and the hardest moments are the early shed and the "is this working?" doubt around weeks 8 to 12. Most tools are loggers: they ask users to record things and give little back. Kab Tak? is an **interpreter, not a logger**. The user enters one date, and the app tells them what is commonly reported at their exact week, what to do now, what to watch for, and when to talk to a doctor. It is honest when something may not be working.

## Screens

- **Your Week**: week number, phase, a "Kab tak?" line with the next milestone date, a journey timeline (start, shed window, settling, early signs, checkpoint 12, visible change, checkpoint 24, maintenance) with "you are here", commonly reported guidance, month 6+ maintenance card. A floating "I'm shedding more" button sits above the bottom nav.
- **Shed check**: 3-step triage with a "stop and consult a doctor" exit for red flags. Every result has one "Do this now" action and a "Kab tak?" line (when it commonly eases, the date to check again).
- **Checkpoint**: same-light, same-angle self-check at weeks 12 and 24 with a clear verdict, reason, action and next date (rules below). No photo uploads.
- **I slipped**: missed-routine guidance (short gap, lapse, long gap), with how far the next milestone moves.
- **How to apply**: tickable checklist with no quantities. Follows the product label or the doctor's instructions.
- **Share my week**: a "My Week" PNG card drawn on a canvas on the device. Uses the Web Share API with files where supported, otherwise downloads the PNG. No name, phone or personal data on the card.
- **Summary for my doctor**: printable one-page checkpoint summary (print stylesheet, "Print or save as PDF"). It states it is a self-report, not a diagnosis.
- **Settings and About**: language (English / Roman Hinglish), appearance (light, dark, system), start date, offline and install status, clear all data, concept disclosure, medical review status, and "About this project" with builder contact.

### Checkpoint rules (`src/engine/checkpoint.ts`)

Applied in order. Thresholds are named constants in the engine and need clinical sign-off.

1. Before week 12: **Too early to judge** (no questions), shows what is normal now and the checkpoint 1 date.
2. Routine not followed on most days: **Fix the routine first**, recheck in `FIX_ROUTINE_RECHECK_WEEKS` (8), consult offered.
3. At least `NEED_LOOK_MIN_UNSURE` (3 of 4) signs "Not sure": **Need a better look**, photo steps and retake.
4. Week 12 rules (weeks 12 to 23). Main sign: less shedding; visible change is a bonus and a "No" there is not held against the user.
   - Less shedding plus at least `ON_TRACK_MIN_VISIBLE_W12` (1) visible sign, no new thinning: **On track**, next: week 24.
   - Less shedding or a visible sign: **Early signs, keep going**, next: week 24 (consult offered if new thinning).
5. Week 24 rules (week 24 onwards). Main signs: fill-in, thicker, photo better.
   - New thinning: **Not responding yet, talk to a doctor**.
   - At least `ON_TRACK_MIN_VISIBLE_W24` (2) visible signs: **On track**, next self-check in `MAINTENANCE_RECHECK_WEEKS` (12).
   - One visible sign or less shedding: **Early signs, keep going**, recheck in `PARTIAL_RECHECK_WEEKS_W24` (8), consult offered.
6. No "Yes" at all: **Not responding yet** when at most `NOT_RESPONDING_MAX_UNSURE` (1) answer is "Not sure", otherwise **Need a better look**.

Results saved by the old scoring ("responding", "unclear") are re-scored from their saved answers on load.

### Theme

Light, dark or system (default). The choice is stored under `kabtak.theme`; a small inline script in `index.html` applies `data-theme` on `<html>` before first paint. Colours are CSS variables in `src/styles/tokens.css`. The official logo always sits on a white plate so it stays legible on dark. The share card PNG and the printable doctor summary stay light.

## Run, test, build, preview

- `npm ci`
- `npm run dev` develop
- `npm test` unit and component tests (Vitest)
- `npm run build` type-check and produce `dist/` (includes `manifest.webmanifest`, `sw.js`)
- `npm run preview` serve `dist/` locally; the service worker precaches all assets so the app works fully offline after the first load
- `node scripts/make-icons.mjs` regenerates `public/icons/*` (the official logo on white, 192, 512, maskable 512, apple touch; needs Playwright)

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
- Rights: the author confirmed they may use the official logo and font for this Man Matters submission. The app is still labelled "Concept, not an official Man Matters product" with a "Concept" pill in the app bar, once in the footer, and in the About sheet, share card and doctor summary.
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
4. Checkpoint questions, the week-aware scoring rules and constants, recheck intervals, and the "followed on most days" routine question.
5. Slipped-routine guidance, gap thresholds (short gap, lapse, long gap) and how far the timeline moves.
6. Month 6+ maintenance statements, including what happens when a routine is stopped.
7. How-to-apply checklist wording (must stay free of quantities).
8. Doctor summary wording and disclaimers.
9. Hinglish translations of all of the above.
10. "Kab tak?" lines: shed easing window (weeks 5 to 8), 2 week recheck, and next-milestone dates.

## OPEN QUESTIONS for the Man Matters team

- Is there an official consent page or consult deep link to use instead of terms and conditions and the hair assessment page?
- Confirm the logo, name, brand colours and MiSansLatin may be used in this concept beyond the submission.
- Which clinician owns sign-off of the clinical content, and should timelines differ by product or concern (hair fall, thinning, receding, dandruff-related shedding)?
- Should checkpoint results be shareable with a doctor inside the consult flow instead of a printed summary?
- Are the checkpoint rules right (see Checkpoint rules)? "Not responding" needs zero positive signs and at most one "Not sure" after consistent use, or new thinning at week 24, and is never shown before week 12. A clinician should confirm these thresholds.
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
3. Honest week 12 and 24 checkpoints with a "not responding, talk to a doctor" exit (`NOT_RESPONDING_MAX_YES` and `NOT_RESPONDING_MAX_UNSURE` in `src/engine/checkpoint.ts`).

### Overlap risk

The co-founder's progress-tracker claim ("flags whether you're actually responding") overlaps with the checkpoint. Difference: Kab Tak? works without an account or logged data, answers a symptom question for a given week on demand, explains the biology of what you see, and sends clear red-flag and not-responding cases to the Man Matters doctor consult. It does not log adherence, upload photos or send reminders. If the in-app tracker already provides a self-serve interpreter, the pitch should be reframed as a lightweight, pre-purchase and anonymous entry point.

### Emergency handling

The 112 link appears only for chest symptoms and swelling. Dizziness and severe irritation say to stop and consult a doctor without the emergency call.
