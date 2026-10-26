# Context: gpt-6-astro

Shared notes for Roansh and Rehaan. This is a **draft while we're still brainstorming**, not a final plan.
Last updated: 2026-10-26.

## The event

- **NASA Space Apps Challenge 2026**, in person, **Nov 14–15**.
- Challenge: [Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/)
- Brief, in short: NASA has decades of experiments on how fire behaves in microgravity. There's so much that it's hard to find, compare and understand. Build an **interactive, AI-powered dashboard that summarizes, ranks and interprets** those findings into **fire safety insights for Moon and Mars missions**.
- Difficulty: Intermediate / Advanced.
- NASA's Resources tab for this challenge still says "coming soon" (checked Oct 26). Check it again before the event.

## The team

- **Roansh** ([@roanshdesai](https://github.com/roanshdesai)): builds full products such as web apps, dashboards and 3D (Blender). Owns the UI and the demo.
- **Rehaan** ([@RDragon-123](https://github.com/RDragon-123)): strong in Java, math, CS and chess, and getting into AI. Not frontend. Owns the data and the AI side.
- We're both building with AI coding tools.
- The repo name has no meaning; it's just a name.

## The idea: Mission Fire Check

You describe a spacecraft situation (mission, oxygen %, cabin pressure, airflow, materials on board) and the dashboard shows:

1. **Ranked fire risks** for that situation, explained in plain English and **cited back to real NASA experiments** (Saffire, FLEX, BASS, ACME, SoFIE…).
2. **Flammability map**: oxygen vs airflow, showing where real experiments saw flames survive or go out, with a dot for "you are here."
3. **What saves you**: evidence-backed fixes for each risk (cut airflow, lower O₂, swap material, extinguisher use).
4. **Confidence meter**: how many experiments back each insight and whether they agree.
5. **Mission presets**: ISS, Gateway, Orion, Mars habitat, so the demo is fast and repeatable.
6. **3D crew cabin** (Roansh's idea): a 3D spacecraft model with hotspots marking where the fire risks are. Suggestion: a cut-open crew cabin (Orion / ISS module) rather than a full rocket, since fire risk is where the crew lives.
7. **Bonus: Gaps Finder**: what NASA *hasn't* tested yet, ranked by how much it matters for upcoming missions.

Pitch opener: **Earth vs space**, the same fire side by side. In microgravity flames are round, slower and sometimes invisible.

**Demo moment:** drag the oxygen slider, the dot crosses into the danger zone, the 3D hotspots light up and the ranked risks reshuffle live, each one with a citation.

Not doing: a plain "chat with the PDFs" bot, or a full fire physics simulation.

## Tech (draft)

- **Rehaan:** Python for the data pipeline and AI (extraction, ranking, flammability boundary).
- **Roansh:** TypeScript web app for the dashboard, plus three.js for the 3D cabin.
- The two halves talk through a **shared data format / small API** that we agree on first, so we can both build at the same time.

## Where the data might come from (to verify this week)

- NASA Physical Sciences Informatics (PSI) system: combustion experiment data
- NASA Technical Reports Server (NTRS): papers on the experiments above
- The challenge's own Resources tab, once it's posted

## Work split (draft, to be finalized)

| | Roansh | Rehaan |
|---|---|---|
| Owns | Dashboard, 3D cabin, design, demo and pitch | Data collection, cleaning, AI summaries and ranking, flammability map math |
| This week | Pick a UI direction, scaffold the app with fake data | Find real datasets and papers, check there's enough data for the map |
| Together | Agree on the shared data format first | Same |

## Still open

- Dashboard look and feel (Roansh's UI references: `~/Developer/UI-LINKS.md`, e.g. Magic UI, 21st.dev, SmoothUI)
- Final work split and day-by-day timeline up to Nov 14
- How we hand work back and forth (branches, PRs, check-ins)
