# Who does what

NASA Space Apps 2026, "Flame in Freefall". Roansh and Rehaan.
Deadline: **Sun Nov 15, 11:59 PM IST**. We aim to submit by 9:00 PM.

Full design: [docs/superpowers/specs/2026-11-14-question-board-design.md](docs/superpowers/specs/2026-11-14-question-board-design.md).
This page is the short version. The old "Mission Fire Check" idea in
`CONTEXT.md` is dropped.

## What we are building

**The Question Board.** A website that turns NASA's 24 space-fire
investigations into answers. You click a fire-safety question ("What puts a
fire out without gravity?") and see a short answer, the investigations that
back it up in ranked order, the exact NASA text behind each one, and what
is still unknown.

It has to look outstanding: a 3D flame scene and animation throughout.

## The split (about 14 hours each)

| | **Roansh: what you see** | **Rehaan: what is true** |
|---|---|---|
| 1 | App shell, design rules, UI components installed (2h) | Turn the 24 saved NASA records into `data/investigations.json` (2h) |
| 2 | 3D scene: flame, particles, gravity switch, landing (4h) | Read the Researcher's Guide and NASA Combustion Science page; collect result quotes (2h) |
| 3 | Board and answer view, with scroll and card animation (4h) | Rank investigations and write cited answers into `data/questions.json` (4h) |
| 4 | Motion pass over every screen, including Rehaan's two (2h) | Script that checks every quote is word for word (1.5h) |
| 5 | Demo video: record and cut (2h) | Investigation page and compare page, plain, using Roansh's components (2h) |
| 6 | | Text for the incident cards and the "on Earth" answer (1h) |
| 7 | | Repo public, link tests, project page, SI disclosure, demo script (1.5h) |

## First hour, together

1. Agree the data shape. It is in the design doc under "The data contract".
2. Agree the list of about eleven questions. A starting list is in the
   design doc under "The board".
3. Roansh gets an empty site live at a public address, showing made-up data
   in the agreed shape.
4. Rehaan opens one investigation on the
   [PSI site](https://psi.nasa.gov/physci/repo/search?q=combustion) and
   notes two things: whether each investigation has its own page address,
   and what its download offers.

## Rules

- **Nobody waits.** Roansh builds against made-up data in the agreed shape.
  Rehaan's real files replace it when ready.
- **Three kinds of evidence, always labelled.** *Tested* (what NASA burned
  and how), *Expected* (the hypothesis), *Found* (a stated result). An answer
  only says "NASA found" when it has a Found quote.
- **Every quote is word for word.** The check script fails the build
  otherwise. If NASA does not state a value, write `"not stated"`.
- **No Moon or Mars gravity claims as fact.** NASA has no partial-gravity
  data; say the answer is bounded by microgravity and Earth results.
- **No API key for the data.** Rehaan's Claude reads the saved records and
  writes the two JSON files. We say so in the SI disclosure.
- **Branches.** Rehaan: `data/...`. Roansh: `ui/...`. Small pull requests
  into `main`, merged often. Only Rehaan's branches write to `data/`.

## Where things are

- `data/raw/psi-combustion-2026-11-14.json`: all 24 NASA records, saved
  Nov 14 from the PSI open search feed. Start here.
- The NASA records mostly say what was tested and expected. Only about half
  state a result, so the **Found** quotes come mainly from the Researcher's
  Guide and the Combustion Science page. Checking those hold enough is
  Rehaan's first task after the cards.
- Challenge page and resources:
  <https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/?tab=resources>

## Checkpoints (IST)

| When | What is true |
|---|---|
| Start + 1 hour | Data shape and questions agreed. Empty site live. |
| Sat 10:00 PM | All 24 real cards showing. 3D landing done. Three questions answered. |
| Sun 1:00 PM | Every question answered and passing the quote check. Board, answer, investigation and compare screens done. |
| Sun 6:00 PM | Feature freeze. Fixes, demo and project page only. |
| Sun 9:00 PM | Submitted. Repo public. Links tested in a private window. |

If Sunday 1:00 PM slips, cut in this order: stretch items, compare page,
questions beyond nine, incident cards.

## Submission needs

- A public link to the site and a public link to the demo, no login.
- Demo: a video of 30 seconds or less (seven slides as the fallback).
- Project page: summary, NASA data used (PSI), where SI tools were used.
- SI-made images or video need a visible watermark.
