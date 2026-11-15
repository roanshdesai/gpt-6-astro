# Demo video script (30 seconds)

The rules allow a video of **30 seconds or less** (or 7 slides). Over the
limit is ineligible, so aim for 28 seconds. Roansh records and cuts; this is
the script and shot list. About 70 spoken words fit in 28 seconds.

Every shot below shows something the site does, as built on the `ui/board`
branch (Nov 15). Every number is on the site and computed from the data
files. Do not add numbers, motion or claims that are not on the site.

The site has four tabs: **Home** (`/`), **Dashboard** (`/dashboard`),
**Questions** (`/board`, answers at `/board/<question id>`) and
**Investigations** (`/investigations`, `/investigations/<id>`, `/compare`).
The 3D flame and the Earth / Freefall switch are on Home only.

| Time | On screen | Voice-over or caption |
|---|---|---|
| 0:00–0:05 | **Home.** Flip the Earth / Freefall switch: the flame changes between a tall teardrop and a dim blue sphere, and the headline letters fall or drift back. | "In space, fire has no up." |
| 0:05–0:09 | Scroll Home past the incident cards (Apollo 1, Mir). | "Fire has threatened crews before. NASA has run 24 experiments to understand it." |
| 0:09–0:14 | **Dashboard** tab. Hold on the top numbers: **24** experiments, **19** flew in space, then the panel "9 of the 11 questions have a result from at least one of the 24 experiments". | "We counted what NASA's open data actually holds." |
| 0:14–0:21 | **Questions** tab: the 11 questions in Prevent, Detect, Suppress and Across all three. Open **"Does switching off the fans stop it?"**: the answer "Not reliably", its FOUND quote, and "4 of 24 investigations speak to this · 4 with a stated result". Click a citation chip; the page jumps to that investigation's evidence row. | "Each answer is ranked by evidence, with NASA's exact words, tagged tested, expected or found." |
| 0:21–0:25 | Scroll to **Not yet known** on the same page, or open **"What about Moon and Mars gravity?"** and show the line that none of the 24 burned anything at Moon or Mars gravity. | "And it says what is still unknown." |
| 0:25–0:28 | **Investigations** tab (or Compare with two picks), then an end card with the project name and the live URL. | "**[Project name]**. NASA data, every quote checked." |

## Notes for recording

- Record the deployed site, not localhost: **[https://YOUR-SITE.vercel.app]**.
- 1920×1080. 60 fps if the flame stays smooth; otherwise 30 fps.
- Check the numbers on screen on the day; they come from the data and
  change if the data changes.
- Burn captions in. Judges may watch muted.
- An SI-generated image or video in the demo needs a visible watermark
  (challenge rule). Home credits its sky as a NASA photograph and the flame
  as a simulation; a screen recording of the site needs no watermark.
  **[Confirm nothing else in the video is SI-generated.]**
- End card: project name and live URL, on screen for at least 2 seconds.

## Fallback: 7 slides

If the video is not ready at feature freeze (Sun 6:00 PM IST):

1. Title, one line, screenshot of the flame on Earth and in freefall.
2. The problem: 24 NASA experiments, results hard to find and compare.
3. Dashboard: 24 experiments, 19 flew in space, 9 of 11 questions have a result.
4. Questions tab: the 11 questions by Prevent, Detect, Suppress.
5. One answer: fans-off, with its FOUND quote and "4 of 24 · 4 with a stated result".
6. Not yet known: the Moon and Mars answer.
7. How we keep it true: tested / expected / found tags, a word-for-word check that fails the build; links to the live site, repo and NASA PSI.
