# Submission checklist (Sun Nov 15, IST)

Deadline 11:59 PM IST; aim to submit by **9:00 PM**. Tick each line.

## Before 6:00 PM (feature freeze)

- [ ] `pnpm run check:data` passes (honesty check and its tests).
- [ ] `pnpm build` passes.
- [ ] Both of you read every answer against its quotes (the script cannot
      check that a quote supports its sentence). Use the "Possible errors"
      list from the review as the starting point.

## Link test

Run from a laptop, not the cloud (nasa.gov blocks the cloud sandbox):

```bash
node data/check/links.mjs                                   # every NASA source URL in the data
node data/check/links.mjs --site https://YOUR-SITE.vercel.app  # plus every page of the live site
```

Every line must say `ok`. The one expected failure is handled for you: the
original ScienceCasts page on science.nasa.gov answers 404 and is listed as
expected, so the UI must not link to `video.nasaUrl`. A made-up id such as
`/investigations/PSI-0` must answer 404.

Then by hand, **in a private browser window** (no logins, no cache):

- [ ] Live site opens with no login.
- [ ] Landing: flame loads; gravity switch works; page still readable if
      WebGL fails (try another browser or turn off hardware acceleration).
- [ ] Every board question opens its answer.
- [ ] A citation chip opens or shows its NASA quote.
- [ ] `/investigations`, one investigation page, `/compare` with two picks.
- [ ] On a phone: no sideways scrolling.
- [ ] Demo video link opens with no login and is 30 seconds or less.

## Making the repo public

The repo belongs to Roansh's account, so **Roansh** does this:

1. Check nothing secret is committed: no `.env*` files, no API keys
   (`git log -p | grep -i -E "api[_-]?key|sk-[a-z0-9]{20}"` should print
   nothing). The OpenAI key, if used, must only be in Vercel's environment
   variables.
2. GitHub, repo **Settings**, **General**, **Danger Zone**, **Change
   repository visibility**, **Make public**.
3. Open the repo URL in a private window to confirm it loads.

## Submit

- [ ] Project page text from `docs/submission/project-page.md`, with every
      **[bracket]** filled in.
- [ ] SI disclosure section included and accurate.
- [ ] NASA data named (PSI at minimum).
- [ ] Project link = live site. Demo link = video (or slides).
- [ ] Submitted, and the confirmation screen saved.
