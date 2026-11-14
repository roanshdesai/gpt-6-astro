# The Question Board: design and work split

NASA Space Apps 2026, challenge "Flame in Freefall". Team: Roansh and Rehaan.
Written Sat Nov 14, 2026. Replaces the Oct 26 "Mission Fire Check" draft.

Lines marked **(call)** are choices made while writing this up, not things the
team agreed. Change any of them.

## Why we are building this

NASA has run 24 combustion investigations (mostly on the space station) and
published them in the Physical Sciences Informatics (PSI) repository. The
results are hard to find, compare and interpret. The challenge asks for a
web dashboard, powered by SI, that **summarizes, ranks and interprets**
those investigations into fire-safety insight for crewed spacecraft,
stations, Moon and Mars bases and pressurized rovers.

Our answer: a board of the real fire-safety questions. Click a question and
see a short answer, the investigations that support it ranked by how much
evidence they give, the exact NASA text behind each one, and what is still
unknown.

Roansh's steer: **the UI sells more than the product.** The look, motion and
first ten seconds get as much care as the data.

## What the NASA text actually contains (checked Nov 14)

All 24 PSI records were read. Their text fields (Objectives, Approach,
Hypothesis, Research Impacts) mostly say **what was tested, how, and what
the team expected**. Few sentences state a result: a rough count found
about 23 result-like sentences across all 24 records, and 13 records had
none. Example: the BASS-II record states the *hypothesis* that ventilated
materials burn as well or better in microgravity, not that this was found.

So the board separates three kinds of evidence and labels each one:

- **Tested:** what an investigation burned and under what conditions (PSI).
- **Expected:** the hypothesis it set out to check (PSI).
- **Found:** a stated result. These come mainly from the Researcher's Guide
  and the NASA Combustion Science page, and from the few PSI sentences that
  state one. Whether those two resources hold enough findings for every
  question is **not yet checked**; it is Rehaan's first task.

An answer may only say "NASA found" when it has a **Found** quote. With only
Tested and Expected quotes it says what was studied and what remains open.

## Deadline and rules we must meet

- Submission closes **Sun Nov 15, 11:59 PM local time** (IST). Roansh says
  the venue has no earlier cutoff and no live pitch. We submit by 9:00 PM to
  leave room for problems.
- Scored 1 to 5 on Impact, Creativity, Validity, Relevance, Presentation.
  Relevance rewards NASA data being the core of the project.
- Demo is **7 slides or a 30-second video**. Over either limit is ineligible.
- Project link and demo link must open with no login. The repo is private
  today, so the deployed site is the project link and the repo goes public
  before submission.
- We must state where SI tools were used. SI-generated images or video need
  a visible watermark. English only.
- At least one NASA data source must be named. Ours is PSI.

## Goals

1. Every one of the 24 PSI combustion investigations appears as a card with
   the attributes the brief lists: objective, fuel (type, shape, size), test
   conditions (oxygen, airflow, pressure), what varied between tests,
   measurements, hardware.
2. About eleven questions, each with a cited answer, a ranked evidence list
   and a "not yet known" line.
3. A first screen that makes someone with no background understand in ten
   seconds why fire in space is different.
4. A public URL and a demo, submitted on time.

## Non-goals

- No fire physics simulation. The 3D flame is an illustration.
- No per-test data plots. We could not confirm that per-test numbers
  (oxygen, airflow per run) can be downloaded, so nothing depends on them.
- No accounts, no database, no mobile app.
- Rockets and propellants are out of scope (the brief says so).

## Anti-goals (these make it a failure even if it works)

- An answer that states something the cited NASA text does not say.
- A quote that is not word for word in the source.
- Any claim about Moon or Mars gravity presented as measured. PSI has no
  partial-gravity data; such answers must say they are bounded by
  microgravity and Earth results.
- A generic "chat with the documents" box as the main screen.
- A beautiful landing page with an empty or fake board behind it.

## Approaches considered

1. **Question Board (picked by Roansh).** Questions first; each ranks the
   investigations by evidence. Maps onto summarize / rank / interpret and
   works with the text data we confirmed.
2. **Comparison Atlas.** All investigations as side-by-side cards. Most
   literal reading of the brief, least original. Kept as a secondary view
   because the cards are needed anyway.
3. **Readiness Check.** Pick a habitat, see what has and has not been tested.
   Dropped: closest to the old idea, and it leans on condition numbers we
   could not confirm.

## What people see

**1. Landing.**
A 3D flame in the middle of a dark screen with a gravity switch. On "Earth"
it is a tall orange teardrop; on "Freefall" it relaxes into a dim blue
sphere. One line of pitch under it. Below, three short incident cards
(Apollo 1, the Mir fire, Apollo 13) that lead into the board. A link to the
NASA ScienceCasts video.

**2. The board.**

```
PREVENT              DETECT               SUPPRESS
Is a 30% oxygen      Will an alarm catch  What puts a fire out
Moon Base safe?      a fire with no       without gravity?
                     rising smoke?
Does cabin airflow   Can a detector tell  Does switching off the
feed a fire?         smoke from dust?     fans stop it?
Which materials      What does an early   Can a fire come back
burn differently     space fire look      after it looks out?
up there?            like?
──────────────────────────────────────────────────────────────
ACROSS ALL THREE:  What about Moon and Mars gravity?  |  What has this done for Earth?
```

The three columns are NASA's own framing in the brief (prevention,
detection, suppression). The exact question wording is settled by the team
in the first hour **(call: the list above is the starting proposal)**.

**3. Answer view** (opens from a question).

```
Is a 30% oxygen Moon Base safe?
Answer: two or three sentences, each ending in a citation chip.
Evidence strength: ●●●○○  4 of 24 investigations speak to this
1. SAFFIRE-II   why it matters (one line)   [TESTED] "exact NASA text"  → PSI-99
2. BASS-II      ...                         [EXPECTED] "..."            → PSI-25
                                            [FOUND] "..."  → Researcher's Guide
Not yet known:  ...
Applies to:  [Moon Base] [Rover]        On Earth: ...
```

**4. Investigation card and compare.**
One page per investigation with the attributes in Goal 1. A compare mode:
pick two, see what is the same and what differs. A hardware grouping
(ACME hardware in the CIR; droplet apparatus in the CIR; the glovebox flow
duct) since the brief calls it out.

**Stretch, only after the Sunday 1:00 PM checkpoint, in this order:** the
live "ask your own question" box; a habitat filter on the board; 3D models
made in Blender (experiment chamber or habitats).

## Look and feel **(call, Roansh decides)**

**Roansh's verdict on the first mock-up (Nov 14): rejected.** It was flat
dark cards with static text and none of the reference libraries. He called
it "very vibecoded". What he wants instead, in his words: **3D and
animations**, built from his reference doc. So:

- **No more static mock-ups.** Build the real screens and iterate on the
  running site.
- **3D is the page, not a picture on it.** A full-screen WebGL scene sits
  behind every screen: the flame, drifting soot particles, depth and glow.
  - Landing: the flame fills the view. Flipping gravity animates it between
    teardrop and sphere, and the particles change from rising to drifting
    outward.
  - Scrolling moves the camera from the flame to the board (Lenis for the
    scroll, GSAP ScrollTrigger or Motion to drive the camera).
  - Board: question cards float in depth, tilt toward the pointer, and the
    scene's glow follows the hovered column.
  - Answer view: the chosen card expands into the page; evidence rows arrive
    one by one; counts tick up.
- **Every visible component comes from the reference libraries first**
  (table below). Hand-written components only when none of them has one.
- **Motion on every state change**: page transitions, hover, reveal on
  scroll, the gravity switch. `prefers-reduced-motion` turns it down.
- **Still true:** dark ground, the blue of a microgravity flame as the
  accent, orange only where Earth is compared, few words per screen.
- **Guard:** the 3D scene must not block reading. Text stays crisp HTML over
  the canvas, and the site still works if WebGL fails to load.

**Reference doc:** Roansh's UI resources file, `~/Developer/UI-LINKS.md` on
his machine. Whoever builds the UI reads it first and takes components from
the libraries it lists before writing any by hand. It is not in the repo;
copy it in as `docs/UI-LINKS.md` if Rehaan's side needs it too.

How each entry in that file is used:

| Resource | Use |
|---|---|
| Magic UI | Main animated building blocks: bento grid for the board, number ticker for evidence counts, border beam / shine on the active card, blur-fade entrances, marquee of investigation names |
| SmoothUI | Expanding cards and animated tabs for the answer view and compare mode |
| Unlumen UI | Text and reveal effects on the landing |
| 21st.dev | Pull individual components when the three above lack one (search first, do not hand-build) |
| Design Spells | Reference for micro-interactions: hover on citation chips, the gravity switch |
| Libraries.dev | Background and cursor effects, if a free one fits |
| Unicorn Studio | Fallback for the hero if the hand-made flame is not ready by checkpoint 1 |
| Lenis | Smooth scrolling on the landing page only |
| Layers, Brik | Reference only; no time to adopt a new tool |
| awesome-design-md | Pick one DESIGN.md (a dark, dense one such as Linear) as the base rules for spacing, type and color |
| taste-skill | Loaded in the AI coding tool while building UI |
| superpowers | Already in use: this document, then the plan |
| Mobbin, Apple HIG, SwiftUI repos | Not used: this is a web app |

Exact component picks happen during the build; none of these sites were
opened while writing this document.

## How it is built **(calls)**

- **App:** Next.js (App Router), TypeScript, Tailwind, shadcn/ui as the
  base that Magic UI, SmoothUI and 21st.dev components drop into. Motion for
  animation. Deployed on Vercel at a public URL.
- **3D flame:** three.js via React Three Fiber, drawn with a shader, not a
  Blender model. A flame is a glow, not a solid shape, and a shader can
  morph between teardrop and sphere. Blender is kept for the stretch models
  and for still images in the demo.
- **Data:** two JSON files in `data/`. The app reads them at build time. No
  server, no database.
- **SI, no API key (decided by Roansh):** Rehaan has a Claude subscription,
  so his Claude reads the saved PSI records and the listed resources and
  writes the two JSON files: the investigation cards, and the ranking and
  answer for each question. It uses only that text. The results are saved
  in the repo, so the live site never calls a model. The project page says
  exactly this in the SI disclosure.
- **Honesty check:** a script confirms every quote appears word for word in
  its source and every cited investigation exists. The build fails if not.
  The script cannot tell whether a quote supports the answer, so both of you
  read every answer against its quotes in the last hour.
- **Live "ask your own question" box (first stretch item):** Roansh has an
  OpenAI key, which makes this possible. The visitor types a question; a
  small server route sends it to OpenAI together with the saved cards and
  answers, and returns a short reply that cites investigations by id.
  - It answers **only** from the saved data. If the data does not cover the
    question, it says so.
  - The key lives in a Vercel environment variable and a local `.env.local`
    that is git-ignored. It never goes in the repo, the browser or a chat.
  - Judges may open the site for weeks, so the key gets a monthly spending
    limit in the OpenAI dashboard and the route is rate-limited. If the call
    fails or the limit is hit, the box points the visitor to the closest
    saved question instead of showing an error.
  - Built only after the Sunday 1:00 PM checkpoint: Rehaan writes the route
    (about 1.5h), Roansh builds the box (about 1.5h). The board must work
    fully without it.

### The data contract (agree this first)

```jsonc
// data/investigations.json  (array, 24 items)
{
  "id": "PSI-25",
  "acronym": "BASS-II",
  "title": "Burning and Suppression of Solids - II",
  "pillars": ["prevent", "suppress"],
  "summary": "two plain sentences",
  "objective": "...",
  "fuel": { "state": "solid | liquid | gas", "detail": "..." },
  "conditions": { "oxygen": "... or 'not stated'", "airflow": "...", "pressure": "..." },
  "varied": "what changed between tests",
  "measurements": ["..."],
  "hardware": { "apparatus": "...", "facility": "CIR | MSG | other" },
  "platform": "ISS",
  "years": "2011-2013",
  "related": ["PSI-26"],
  "publications": ["..."],
  "psiUrl": "public PSI page for this investigation"
}

// data/questions.json  (array, about 11 items)
{
  "id": "moon-base-oxygen",
  "pillar": "prevent | detect | suppress | across",
  "question": "Is a 30% oxygen Moon Base safe?",
  "answer": [
    { "text": "one sentence", "cites": ["PSI-99", "PSI-25"] }
  ],
  "evidence": [
    { "investigation": "PSI-99", "rank": 1, "why": "one line",
      "quotes": [
        { "kind": "tested | expected | found",
          "text": "word-for-word source text",
          "source": "PSI field name, or the resource's URL" }
      ] }
  ],
  "strength": { "count": 4, "withFindings": 2, "of": 24 },
  "unknown": ["..."],
  "habitats": ["spacecraft", "station", "moon-base", "mars-base", "rover"],
  "earth": { "text": "one line", "quote": "word-for-word", "source": "resource URL" }
}
```

Rules for the contract **(calls)**:

- **Ranked rows are always investigations.** The brief asks to rank
  investigations, so every evidence row names one of the 24. A quote inside
  a row may come from PSI or from a listed resource, as long as it is about
  that investigation.
- **Strength** is the number of investigations with at least one quote for
  the question; `withFindings` is how many of those have a **Found** quote.
  The meter shows both ("4 investigations, 2 with stated results").
- **Each answer sentence lists the investigations it rests on** in `cites`;
  those become its citation chips. Every cited id must appear in `evidence`.
- **The Earth line and the incident cards are not ranked evidence.** They
  carry their own quote and source URL and do not count toward strength.
  `earth` is `null` when there is nothing to say.
- **Card conditions are quotes too.** `conditions.oxygen`, `.airflow` and
  `.pressure`, and `fuel.detail`, hold the source's own words (for example
  "airflow speeds up to 40 cm/s") and go through the same word-for-word
  check. When the source gives nothing, the value is the string
  `"not stated"`, never a guess.
- **Model-written card text** (`summary`, `varied`) is not machine-checked.
  Rehaan reads all 24 once; that is inside his card task.

### Sources

- **PSI open search feed** (confirmed working, no key):
  `https://psi.nasa.gov/geode-py/ws/repo/search?from=0&size=200&ffield=Research%20Area&fvalue=combustion%20science`
  returns all 24 investigations with Objectives, Approach, Hypothesis,
  Research Impacts/Earth Benefits, Experiment Hardware, Keywords,
  Publications, Related Investigations. A snapshot taken Nov 14 is saved at
  `data/raw/psi-combustion-2026-11-14.json`, so the pipeline starts from a
  file and does not depend on the feed staying up.
- NASA Combustion Science page and the Researcher's Guide to ISS Combustion
  Science: extra text for cards and answers.
- Apollo 1, Apollo 13 and Mir fire pages: the landing's incident cards.
- Three spinoff pages (air tanks, fire detector, fire attire): the "on
  Earth" answer.
- ScienceCasts video: linked from the landing.

The old draft mentioned SoFIE. It is not one of the 24 PSI investigations
(the BASS-II record only names it as a follow-on), so it gets no card.

## Work split

Two equal halves, about 14 hours each. Roansh owns everything on screen;
Rehaan owns everything that has to be true, plus getting it submitted.

What changed from the Oct 26 split, which gave Roansh the UI, 3D, design,
demo **and** pitch: all the written and submission work now sits with
Rehaan (content text, project page, SI disclosure, demo script, making the
repo public, link testing), and the demo is shared. Per the Oct 26 notes
Rehaan is not a frontend person, so the look and the motion are never his
to design.

| | **Roansh: the face** | **Rehaan: the brain** |
|---|---|---|
| 1 | App shell, design rules, components installed from the reference libraries (2h) | Turn the 24 saved PSI records into `investigations.json` (2h) |
| 2 | 3D scene: flame, particles, gravity switch, landing (4h) | Read the Researcher's Guide and Combustion Science page, collect the **Found** quotes (2h) |
| 3 | Board and answer view, with scroll and card animation (4h) | Rank investigations and write cited answers, write `questions.json` (4h) |
| 4 | Motion pass over every screen, including Rehaan's two (2h) | Honesty check script and evidence-strength count (1.5h) |
| 5 | Demo video: record and cut (2h) | Investigation page and compare page, plain, from Roansh's components (2h) |
| 6 | | Text for incident cards and the Earth answer (1h) |
| 7 | | Repo public, link tests, project page, SI disclosure, demo script (1.5h) |

Changed Nov 14 after Roansh asked for 3D and animation throughout: the UI
track grew, so the two data-heavy screens (investigation page, compare
page) moved to Rehaan. He builds them plain with the components Roansh
installs; Roansh adds the motion at the end.

**Starting point:** the repo holds only a README and the Oct 26 notes, so
everything is built new. Per those notes both of you build with AI coding
tools, so the build plan is written as steps an AI coding tool can follow,
one track each **(call: if Rehaan is writing the Python by hand, his track
needs fewer steps and more time)**.

**Together:** the first hour and the last hour.

- **First hour:** agree the data contract and the question list; get an
  empty site live; open one investigation on the PSI site to see whether it
  has its own page address (for `psiUrl`) and what its download offers.
- **Last hour:** read every answer against its quotes, then submit.

**Rule that keeps you unblocked:** Roansh builds against made-up JSON in the
agreed shape from minute one; Rehaan's real files replace it when ready.
Neither waits on the other.

**Git:** each works on their own branches (`ui/...`, `data/...`), small pull
requests into `main`, merged often. Only Rehaan's work writes to `data/`;
only Roansh's writes to the app folders.

## Checkpoints (IST)

| When | What is true |
|---|---|
| Go + 1 hour | Contract and questions agreed. Empty site live at a public URL showing made-up data. Rehaan knows whether the Guide has enough **Found** quotes. |
| Sat 10:00 PM | All 24 real investigation cards showing. Flame and landing done. First three questions answered. |
| Sun 1:00 PM | All questions answered and passing the honesty check. Board, answer view and compare done. |
| Sun 6:00 PM | Feature freeze. Only fixes, demo and project page after this. |
| Sun 9:00 PM | Submitted. Repo public. Links tested in a private browser window. |

If the Sunday 1:00 PM checkpoint slips, cut in this order: stretch items,
compare mode, questions beyond nine, incident cards.

## Open, needs the team

1. **Slides or video for the demo?** A 30-second video shows the flame and
   the motion; seven slides are safer to make. **(call: video, with slides
   as the fallback at feature freeze.)**
2. **Project name.** "The Question Board" is a working title.

Settled Nov 14: no live pitch and no earlier venue cutoff. Rehaan's Claude
subscription builds the data files, with no key. Roansh's OpenAI key is used
only for the live ask box, if the stretch is reached.

## Left to the builder

Component picks from the libraries above, folder layout inside the app,
shader details for the flame, prompt wording in the pipeline, how the
ranking is computed (as long as each rank has a one-line reason and a
quote), the PSI page URL pattern for `psiUrl`.
