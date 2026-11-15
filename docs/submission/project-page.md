# Project page draft

Text for the Space Apps project submission form. Copy each section into the
matching field. Lines in **[brackets]** need filling or deciding before you
paste. Every number below was checked against the repo's data files on
Nov 15, 2026; if the data changes, re-run `pnpm run check:data` and update the
numbers here.

---

## Project name

**[The Question Board]** (working title; the team has not picked a final name)

## Challenge

Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data

## Links

- Project (live site): **[https://YOUR-SITE.vercel.app]**
- Demo video (30 seconds or less): **[link]**
- Code: https://github.com/roanshdesai/gpt-6-astro **[must be public before submitting]**

## High-level summary

Fire behaves differently in space: with no "up", flames turn into dim blue
spheres, smoke does not rise, and switching off the fans may not put a fire
out. NASA has run 24 combustion investigations on this, and their results are
spread across records that are hard to find, compare and interpret.

The Question Board turns those 24 investigations into answers to the
fire-safety questions a crew or habitat designer would ask, grouped the way
NASA frames fire safety: prevent, detect, suppress. Click a question and you
see a short answer, the investigations that support it ranked by how much
evidence they give, NASA's exact words behind each one, and what is still
unknown. Every quote is checked word for word against its NASA source before
the site is built, and every quote is labelled as what NASA **tested**,
**expected** or **found**, so a hypothesis is never presented as a result.

## Project details

**What it does**

The site has four tabs.

- **Home:** a 3D flame with an Earth / Freefall switch (a tall teardrop on
  Earth, a dim blue sphere in freefall), two real fires (Apollo 1 and Mir)
  and a link to NASA's video "The Power of Studying Combustion on the ISS".
- **Dashboard:** what NASA's open combustion data holds, counted from the
  site's data files. 24 experiments: 19 flew in space (16 on the space
  station, 3 on Cygnus cargo ships) and 5 are ground studies, with 293
  distinct paper titles across their records. 9 of the 11 questions have a
  stated result from at least one experiment; the 2 that do not are both
  about detecting a fire. 5 of the 24 experiments have a result quoted on the
  site. It also charts experiments per year and papers per experiment.
- **Questions:** 11 fire-safety questions grouped as Prevent, Detect,
  Suppress, plus two across all three (Moon and Mars gravity, and what this
  research has done for Earth). Each answer page has:
  - a short answer whose sentences carry citation chips; a chip jumps to
    that investigation's evidence row;
  - the investigations that speak to the question, ranked, with NASA's exact
    sentences tagged **tested**, **expected** or **found**. An answer only
    says "NASA found" when a quoted NASA source states a result;
  - evidence strength in words, for example "4 of 24 investigations speak to
    this · 4 with a stated result";
  - **Not yet known**. None of the 24 burned anything at Moon or Mars
    gravity, so those answers say they are bounded by microgravity and Earth
    results instead of claiming measured values;
  - where it applies (spacecraft, station, Moon base, Mars base, pressurized
    rover) and, for 3 questions, an "On Earth" line from a NASA Spinoff page.
- **Investigations:** all 24 as pages with the attributes the brief asks
  for: objective, fuel, oxygen, airflow and pressure, what varied between
  tests, what was measured, and the hardware. Where NASA's record does not
  state a value, the page says "Not stated in the NASA record". They are
  grouped by the hardware they ran on, and **Compare** puts any two side by
  side.

**Benefits**

Mission planners, habitat designers and students get a single place to see
what NASA's fire experiments actually showed, how strong the evidence is,
and where the gaps are, with a link back to every source.

**How it works and what we used**

- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui components,
  Motion for animation, three.js with React Three Fiber for the flame, Lenis
  for smooth scrolling. Hosted on Vercel.
- The data lives in JSON files in the repo (`data/`). The site reads them at
  build time; there is no server database and no live model call.
- A Node script (`data/check/honesty.mjs`) runs before every build. It fails
  the build if any quote is not word for word in its saved NASA source, if
  an answer cites an investigation with no evidence, if an answer says
  "found" without a Found quote, or if an evidence-strength count is wrong.

## Space agency data and resources used

- **NASA Physical Sciences Informatics (PSI)**, combustion science: all 24
  investigation records, saved from the PSI open search feed on Nov 14, 2026.
  https://psi.nasa.gov/physci/repo/search?q=combustion
- **NASA, *Combustion in Reduced Gravity: A Researcher's Guide to ISS
  Combustion Science*** (NP-2015-10-034-JSC): stated results ("found" quotes).
  https://www.nasa.gov/sites/default/files/atoms/files/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf
- **NASA Glenn, Combustion Science page.**
  https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/
- **Incident cards:** NASA Safety and Mission Assurance, Apollo 1,
  https://sma.nasa.gov/sma-disciplines/accllp/apollo-1, and NASA History,
  "25 Years Ago: Fire Aboard Space Station Mir",
  https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/
- **NASA Spinoff** for the "On Earth" lines:
  https://spinoff.nasa.gov/node/9407 (Fire Detector, smoke or dust),
  https://spinoff.nasa.gov/node/9918 (Fire Attire),
  https://spinoff.nasa.gov/node/9582 (Fireman's Air Tanks)
- **NASA Space Apps Challenge, "Flame in Freefall" challenge page**, for
  the Home line on Moon Base oxygen.
  https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/
  Saved Nov 15 as `data/raw/sources/pdf/space-apps-flame-in-freefall.pdf`.
- **NASA video, "The Power of Studying Combustion on the ISS"**:
  https://www.youtube.com/watch?v=W1oXykoz9zg, described in the NASA Image
  and Video Library: https://images.nasa.gov/details/264_StudyingCombustionOnTheISS

## Use of SI tools

[Keep this section word for word or edit it, but keep it accurate.]

- **Data files.** The team used Claude (Anthropic) to read the saved NASA
  PSI records and the NASA resources listed above, and to write the data
  files: the 24 investigation cards, the 11 questions with their answers,
  ranking and "not yet known" lines, and the incident cards and "On Earth"
  lines. Claude used only that saved NASA text. **[Rehaan: Claude
  subscription for the data files; Roansh: confirm what you used for the
  Home incident cards and video line.]**
- **Checks on that output.** Every quote Claude chose is checked by a script
  to appear word for word in its NASA source, and the build fails otherwise.
  The script cannot tell whether a quote supports the sentence above it, so
  both team members read every answer against its quotes before submitting.
  Written summaries (card summaries, "why it matters" lines, answer
  sentences) are model-written from the quotes and were read by the team.
- **Code.** Both team members built the site with SI coding assistants
  **[name the tools each of you used]**.
- **No live SI.** The site never calls a model. Everything a visitor sees was
  generated ahead of time and is saved in the repository.
- **Images and video.** **[If any image or video in the site or demo was made
  with an SI tool, say which, and make sure it carries a visible watermark.
  The 3D flame and the Dashboard's 3D chamber are drawn by code and labelled
  "simulation" on the site; Home's sky is labelled a NASA photograph.]**

## Team

Roansh (UI, 3D, motion, demo video) and Rehaan (data, checks, investigation
and compare pages, submission).
