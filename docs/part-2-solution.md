# Part 2: Build the Solution

**Mosaic Wellness Fellowship Builder Challenge**

**App:** Kab Tak? ("How long?"), for Man Matters hair-loss customers

**Submitted by:** Devansh Srivastava, Kirori Mal College, University of Delhi

**Email:** devanshsrivastava.reads@gmail.com · **Phone:** +91 8736956764

## Links

| What | Link |
| --- | --- |
| Working app (opens in any browser) | [dsrivastava-py.github.io/manmatters](https://dsrivastava-py.github.io/manmatters/) |
| Source code | [github.com/dsrivastava-py/manmatters](https://github.com/dsrivastava-py/manmatters) |
| Part 1 document | Submitted with this application |

## Short explanation

> Kab Tak? ("How long?") is a free web app for Man Matters hair-loss customers. It answers the question behind most early dropouts: "Is what I'm seeing normal for my week, and is it working?" The user enters one date, the day they started. The app shows their week and phase, what is commonly reported right now, and the date of their next milestone. A 3-step shed check separates normal early shedding from red flags that need a doctor. Honest checkpoints at weeks 12 and 24 give a clear verdict ("on track", "early signs", "fix the routine first" or "talk to a doctor") with the reasons. It also explains missed weeks and maintenance. No login, works offline, English and Hinglish. It works alongside the Man Matters app: the app tracks the routine, Kab Tak? explains the results.

## The problem it solves (from Part 1)

Men on a Man Matters hair-loss routine have no way to tell whether what they are seeing is normal for their exact week, how long it will take to change, or whether the routine is actually working. So they panic at the early shed, quit at the plateau, misread a missed routine as failure, or keep paying for a plan that is not working.

**Root cause:** customers are sold an outcome, but hair moves through shedding, a plateau and slow regrowth. Nothing tells them which phase they are in or what to expect in it, so normal phases look like failure and real failure looks normal.

## How the app solves it

Every screen answers one question for the user's exact week. Together they cover the five things customers actually ask.

| Customer question | What the app does | Screen |
| --- | --- | --- |
| Where am I? | Shows the week number, the phase and a journey timeline with "You are here" | Your Week |
| Is this normal for my week? | Shows what is commonly reported in this phase, what to do now and what to watch for | Your Week |
| My hair is falling more. Should I worry? | A 3-step check: week, how much, any warning signs. Red flags always say "stop and consult a doctor" | Shed check |
| Kab tak? How long until it changes? | Gives the next milestone with a real calendar date and "in N weeks" on every result | Everywhere |
| Is it actually working? | Same-light, same-angle self-check at weeks 12 and 24, with a clear verdict and the reasons | Checkpoint |
| I missed some days. Did I ruin it? | Explains lapse versus plateau and how far the timeline moves | I slipped |
| Do I have to keep using it? | Explains plainly that stopping commonly reverses gains, before it becomes a surprise | Maintenance card (month 6+) |
| Am I applying it right? | A checklist that points to the label and the doctor. The app never gives dosing numbers | How to apply |
| How do I tell my doctor? | A printable one-page summary and a shareable "My Week" image, with no personal data | Doctor summary, Share |

## How it answers the five customers from Part 1

| Customer | Their question | What Kab Tak? gives them |
| --- | --- | --- |
| C1, week-3 shed scare | "How do I tell normal shedding from the product making it worse?" | Your Week explains the shed window at his exact week. The shed check says if it is commonly reported, what to do and when it commonly eases, at midnight, with no callback needed. Red flags go to a doctor |
| C2, lapse shed at month 5 | "If I miss a week or plateau, did it stop working?" | I slipped explains that a shed weeks after a missed fortnight is commonly a lapse, not failure, and shows how far his timeline moved |
| C3, one-year responder | "How long do I have to keep paying for this?" | The maintenance card explains from the start that results need ongoing use, before it becomes a surprise |
| C4, gummies and tonic, no change | "At month 3, should I keep waiting or see a doctor?" | The week-12 checkpoint gives a clear verdict. If nothing is improving, it says "Not responding yet, talk to a doctor" and links to the consult |
| C5, low responder | "How many months before I accept it isn't working?" | Checkpoints at weeks 12 and 24 with same-light, same-angle photo steps, so the answer comes at month 3 or 6, not after month 7 |

Customers' names and numbers are not used in the app.

## Key decisions and why

### 1. An interpreter, not a tracker

The Man Matters app already has a habit tracker, reminders, reward points and photo upload for doctors. Building another tracker would duplicate it. Kab Tak? records almost nothing. It explains what the user is seeing. **The Man Matters app tracks whether you did your routine. Kab Tak? tells you what your results mean.**

### 2. Honest, even when the answer is "this may not be working"

Some people do not respond to treatment. A tool that only reassures would keep them paying for a plan that is not working. So the checkpoint can say "Not responding yet, talk to a doctor", and that result links straight to the Man Matters doctor consult. Telling the truth is what makes the "on track" result believable.

### 3. A clear verdict every time

An early version said "unclear" too often, which is not useful. The checkpoint now depends on the week, because different signs are expected at different times:

| Result | When it shows | What the user does next |
| --- | --- | --- |
| Too early to judge | Before week 12 | Sees what is normal now and the date of checkpoint 1 |
| Fix the routine first | Routine not followed on most days | Gets back on routine, recheck in 8 weeks, doctor option |
| Need a better look | 3 or more of the 4 signs answered "Not sure" | Follows same-light photo steps and retakes the check |
| On track | Week 12: less shedding plus one visible sign. Week 24: two or more visible signs | Keeps going; next check date shown |
| Early signs, keep going | Some positive signs, not yet enough for "on track" | Keeps going; next check date shown |
| Not responding yet, talk to a doctor | No positive signs, or new thinning at week 24 | Books a consult |

At week 12, less shedding is the main sign and visible fill-in is a bonus, because fill-in commonly takes longer. At week 24, visible change is what counts. Every result shows the reason in the user's own answers, one action and the next date, plus a "Why this result" table.

### 4. Safety first

- All wording says "commonly reported", never "this will happen to you".
- Red flags (swelling, dizziness, chest symptoms, severe irritation) always override and say "stop and consult a doctor".
- Chest symptoms and swelling also show a "Call 112" (India emergency) link.
- The app never gives dosing numbers. It says to follow the label or the doctor.
- The medical content is marked "pending medical review" and the thresholds are single settings in the code, so a doctor can change them in one place.

### 5. Built for the moment of doubt

Doubt often hits late at night, alone. So the app needs no login, no download and no personal details, loads fast, works offline after the first visit and can be installed on the home screen. It is available in English and Hinglish, in light and dark mode.

### 6. Private by design

The app stores only the user's start date, language, theme and check results, on their own phone. There is no server, no account and no analytics. No customer names, numbers or other personal information from Part 1 are used in the app.

## What it deliberately does not do

- **No photo upload or AI photo analysis.** Lighting and angle make automatic comparison unreliable, and a wrong answer is risky. Man Matters already offers photo review by doctors.
- **No habit tracker or reminders.** The Man Matters app already has them.
- **No price tools or competitor comparisons.** They do not solve the customer's question and would work against the brand.
- **No diagnosis.** The app gives general information and hands off to a doctor.

## Where it fits with Man Matters

| Moment | How Kab Tak? helps Man Matters |
| --- | --- |
| Weeks 2 to 4 | Explains the early shed so customers do not quit |
| Months 2 to 6 | Gives honest checkpoints so customers who are on track stay, and others reach a doctor |
| After a missed fortnight | Stops a lapse being mistaken for failure |
| Month 6 onwards | Explains maintenance before it becomes a surprise at renewal |
| Every "talk to a doctor" result | Sends the customer to the Man Matters consult |

It can be linked from the Man Matters app, order emails, WhatsApp messages or the bottle's QR code, because it is just a web link.

## How to try it

1. Open the [app link](https://dsrivastava-py.github.io/manmatters/) on a phone, or in a narrow browser window.
2. On the start screen, tap **1 month ago**, then see **Your Week**: week 5, the phase, the timeline and the next milestone date.
3. Tap **I'm shedding more**. Pick **A bit more than usual** and see the result with its "Kab tak?" line.
4. Run it again and tick **Chest symptoms** to see the emergency path.
5. Open **Checkpoint**. Before week 12 it says "Too early to judge". To see a verdict, go to **Settings**, change the start date to about 12 weeks ago and answer the questions.
6. Open **I slipped** and tap **10 days**.
7. Switch to **Hinglish**, and try dark mode in **Settings**.
8. Open **Summary for my doctor** and **Share my week**.

## How it was built

| Part | Choice |
| --- | --- |
| App | React, TypeScript and Vite, as an installable web app (PWA) that works offline |
| Design | Man Matters brand colours, the official logo and the MiSansLatin font used on manmatters.com; mobile first, with tablet and desktop layouts |
| Logic | Separate, tested rules for phases, shed check, checkpoints and lapses |
| Tests | 143 automated tests, including every possible checkpoint answer at weeks 12 and 24 |
| Hosting | GitHub Pages, deployed automatically |

## AI tools used

- **Kiro (an AI coding agent) with Claude models:** planning, writing the code and tests, code review and visual checks across screen sizes.
- **ChatGPT, Gemini and Perplexity:** secondary research on public posts and the existing Man Matters app. Every finding was marked as confirmed or unverified.
- **My own work:** the customer conversations, choosing the problem, product decisions, and reviewing and testing the app.

## Limits and next steps

- A doctor should review all medical wording and the checkpoint thresholds before real use.
- Next, test it with the five customers from Part 1, then measure: fewer "is this normal?" support questions, fewer dropouts in weeks 2 to 4 and months 4 to 7, and how many "talk to a doctor" results lead to a consult.
- This is an independent concept for this application, not an official Man Matters product.
