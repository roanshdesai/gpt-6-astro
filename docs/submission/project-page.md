# Project page draft

Text for the Space Apps project submission form. Copy each section into the
matching field. Lines in **[brackets]** need filling or deciding before you
paste. Every number below was checked against the repo's data files on
Nov 14, 2026; if the data changes, re-run `pnpm run check:data` and update the
numbers here.

---

## Project name

**[The Question Board]** (working title; the team has not picked a final name)

## Challenge

Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data

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

- **11 questions** across prevention, detection and suppression, plus two
  that cut across all three: Moon and Mars gravity, and what this research
  has done for Earth.
- Each answer sentence carries citation chips to the investigations it rests
  on. An answer only says "NASA found" when a quoted NASA source states a
  result.
- **Evidence strength** for each question: how many of the 24 investigations
  speak to it, and how many of those have a stated result. For example, "Is a
  30% oxygen Moon Base safe?" draws on 5 investigations, 4 with stated
  results; the two smoke-detection questions have none with stated results,
  and the site says so.
- **"Not yet known"** on every answer. None of the 24 investigations burned
  anything at Moon or Mars gravity, so those answers say they are bounded by
  microgravity and Earth results instead of claiming measured values.
- **All 24 investigations** as pages with the attributes the brief asks for:
  objective, fuel, oxygen, airflow and pressure, what varied between tests,
  what was measured, and the hardware. Where NASA's record does not state a
  value, the page says "Not stated in the NASA record" rather than guessing.
- **Compare** any two investigations side by side, and browse them grouped by
  the hardware they ran on (ACME burners and the droplet apparatus in the
  Combustion Integrated Rack, the Microgravity Science Glovebox, Saffire in a
  Cygnus cargo ship, ground studies).
- **Landing:** a 3D flame with a gravity switch (tall orange teardrop on
  Earth, dim blue sphere in freefall), three real incidents (Apollo 1,
  Apollo 13, Mir) and NASA's "Strange Flames on the ISS" ScienceCast.

**Benefits**

Mission planners, habitat designers and students get a single place to see
what NASA's fire experiments actually showed, how strong the evidence is,
and where the gaps are, with a link back to every source.

**How it works and what we used**

- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui components,
  Motion for animation, three.js with React Three Fiber for the flame, Lenis
  for smooth scrolling. Hosted on Vercel.
- The data lives in three JSON files in the repo. The site reads them at
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
- **NASA History articles** for the incident cards:
  https://www.nasa.gov/history/55-years-ago-the-apollo-1-fire-and-its-aftermath/,
  https://www.nasa.gov/history/50-years-ago-apollo-13-review-board-report/,
  https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/
- **NASA Spinoff** for the "On Earth" lines:
  https://spinoff.nasa.gov/node/9407 (Fire Detector),
  https://spinoff.nasa.gov/node/9918 (Fire Attire),
  https://spinoff.nasa.gov/node/9582 (Fireman's Air Tanks)
- **NASA ScienceCasts, "Strange Flames on the ISS"** (video):
  https://www.youtube.com/watch?v=BxxqCLxxY3M. The original NASA page has
  been removed; its text was checked against the Internet Archive copy.

## Use of SI tools

[Keep this section word for word or edit it, but keep it accurate.]

- **Data files.** Rehaan used Claude (Anthropic), through a Claude
  subscription, to read the saved NASA PSI records and the NASA resources
  listed above, and to write the three data files: the 24 investigation
  cards, the 11 questions with their answers, ranking and "not yet known"
  lines, and the incident cards and "On Earth" lines. Claude used only that
  saved NASA text.
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
  The 3D flame is drawn by code (a shader), not generated.]**

## Team

Roansh (UI, 3D, motion, demo video) and Rehaan (data, checks, investigation
and compare pages, submission).
