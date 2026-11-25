# lovestats website

A buildless static site with an experiments gallery and two interactive experiment pages. All website paths are relative, so the contents of this folder can eventually be served at `/lovestats/` on GitHub Pages. No publishing configuration has been added. Website source is included in the repository; pushing source does not deploy the site.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory website
```

Open http://127.0.0.1:4173/. Keep that terminal running. No npm install or build needed. An HTTP server is required for browser data loading; do not open the HTML through `file://`.

## Refresh saved data

```sh
python3 website/prepare_data.py
```

Uses Python's standard library. Validates summary means and standard errors against all 8,000 saved records, generates `data/summary.json` with champion counts, and copies the original snapshot, pairwise CSV, results, summary and settings into `website/data/`. It never executes notebooks or modifies source artifacts. Currently expects the selected 1,000-run batch.

## Interaction and scope

- Gallery links to the tournament and Music Lab experiments.
- Fresh seeded/random 32-team knockout simulations use the exact recursive bracket placement and scale-600 probability model from notebook 02. Replay retains the same history; playing again generates new outcomes. Round buttons pause the animation for inspection. Reduced-motion mode reveals the champion immediately, with all rounds still inspectable.
- All eight saved configurations appear in the chart and table. Points and table buttons select details, Monte Carlo intervals and the five most frequent champions. Both log and linear match axes are available.
- Browser demos are separate from the saved Python batch; they do not reproduce NumPy's seed or create histories for champion-only records. Other formats have saved-result exploration only.
- Fonts optionally load from Google Fonts, with local sans-serif fallbacks. No other external runtime dependency, tracking or backend.
- No hard-budget recommendation or universal optimality claim.

## Check simulation rules

```sh
node website/check.mjs
```

## Website development context and handoff

Updated 25 November 2026 after the first local preview.

This chat is the **website-building chat for lovestats**. Use this README as the starting point for continuing design and implementation, including from another chat. Read the [project README](../README.md) for the experiment's broader purpose and research history; read the [workspace guide](../../../AGENTS.md) for workspace conventions. Keep website decisions here and statistical experiment decisions in the project notes/notebooks rather than maintaining competing accounts.

### Product direction and user feedback

lovestats is a personal collection of playful, interactive statistical experiments: inviting, curious and thoughtfully designed, rather than a corporate dashboard or textbook. Prioritise one coherent experience over lots of controls. The first experiment asks **“Does the best team win?”** The second experiment is Music Lab v1, “One song. Eight worlds. The same hit?” Future experiments should fit naturally into the gallery; do not fill it with invented projects or placeholder cards.

Aryaman's reaction to the first preview was strongly positive: **“the ux style is great well done.”** Treat the current visual/UX direction as the accepted starting point. This is approval of the style, not a claim that every interaction is final or that publication is authorised. Extend and refine it rather than gratuitously redesigning it.

The original delivery was a polished first pass for local review. Explicit boundary: **do not publish or push yet**. Continue local development unless a later instruction changes that. Eventual hosting target is GitHub Pages under `/lovestats/`, with remote `https://github.com/wade-ary/lovestats.git`. No backend, accounts, database, paid services or GPU.

### Design language to preserve

- Editorial, spacious layouts with big questions, short explanations and a clear progression from playing to comparing to understanding.
- Pale off-white/mint background (`#f8faf6`), deep green ink/pitch surfaces (`#122e27`, `#174d3c`), lime accents (`#d8fa76`) and purple comparison points. CSS variables in `style.css` are the source of truth.
- Space Grotesk for headings and branding, DM Sans for body copy, and italic Georgia for emphasis in hero headings. Google Fonts are optional; fallbacks keep the site usable without them.
- The `lovestats` wordmark and asterisk motif, a stylised podium on the gallery card, and a green tournament arena. Graphics are HTML/CSS or inline SVG, with no generated image dependency.
- Avoid excessive cards, decorative clutter, corporate dashboard styling and unnecessary controls. Deeper methodology belongs in expandable sections rather than overwhelming the opening experience.
- Keep mobile layouts deliberate: stacked content, readable chart labels, horizontally scrollable results table with a hint, and accessible buttons/focus states. Preserve reduced-motion behaviour.

### Page flow and implementation map

| File | Responsibility |
| --- | --- |
| `index.html` | Gallery, introduction and both available experiment cards. |
| `tournament.html` | Experiment narrative, demo shell, saved-results section, takeaways and methodology disclosures. |
| `style.css` | Shared visual system, desktop/mobile layouts, interaction states and reduced-motion rules. |
| `app.js` | Fetch website data, render chart/table/details, coordinate demo controls and timed round reveals. |
| `simulation.js` | Pure browser match probability, recursive bracket seeding and single-tournament history generation. |
| `prepare_data.py` | Reproducible validation/conversion/copying of saved artifacts into website data. |
| `data/` | Website copies of source artifacts plus derived `summary.json`; refresh through the script. |
| `check.mjs` | Checks probability, seed placement, unique entrants, advancement, match counts and champion gaps. |
| `package.json` | Declares ES modules and a test command; no installed dependencies or bundler. |

Tournament page progression:

1. Opening question and the scope: 32 teams, eight tested settings, 1,000 saved tournaments each.
2. Choose seeded or random knockout and play a fresh tournament. Rounds reveal automatically; selecting a round pauses for inspection. Replay uses the same generated history; another play draws new outcomes.
3. Compare every saved configuration in a match-count versus mean-rating-gap scatterplot. Default x-axis is logarithmic, with a linear toggle. Whiskers show approximate 95% Monte Carlo intervals. Selecting a point or table row updates the mean, SE, interval and five most frequent champions.
4. Read the main takeaways, then optionally open model assumptions, exact rules, uncertainty and source/download details.

On narrow screens, the chart uses a compact viewBox and labels only the selected point to keep text readable. The full table supplies all format names and values. Keep point selection and table selection equivalent.

### Statistical contract

These boundaries are part of the product, not optional footnotes:

- Use the saved top 32 men's national teams and fixed FIFA rating points. The model is `P(A wins) = 1 / (1 + 10 ** (-(rating_A - rating_B) / 600))`.
- Every match has a winner. Outcomes are independent conditional on ratings. No draws, home advantage, fatigue or rating updates. This borrows FIFA's expected-result curve as a simplified W/L model; it is not an official or calibrated win forecast.
- “Best” means highest input rating. Primary measure: **champion rating gap = highest input rating − champion's input rating**; lower is better. Compare the mean gap alongside the match cost, not a gap/matches ratio.
- Saved results are 1,000 tournaments per setting across random knockout, fully seeded knockout, World Cup groups plus knockout, double round-robin league, league plus top-16 best-of-seven playoffs, and Swiss at 5/7/9 rounds.
- [Notebook 02](../notebooks/02_tournament_formats.ipynb) is the exact rule reference. Preserve bracket placement, seeded group pots, group-to-knockout mapping, random standings tie-breaks, playoff stopping rules and Swiss minimum-cost no-rematch pairing. Do not silently substitute easier algorithms.
- Fresh browser demos are explicitly separate from the saved batch. Saved records contain champions and match counts, not intermediate histories; do not invent historical brackets from them. Browser randomness does not reproduce NumPy's seeded stream.
- SE describes uncertainty in the estimated average, not variability of individual champions or confidence in the model. Approximate intervals are mean ± 1.96 × SE. More repetitions improve estimation; more matches within a tournament change the selection process.
- League and league-plus-playoffs share each saved league season. Preserve that pairing if comparing their differences statistically.
- No universal optimality claim or interpolation of untested configurations. No hard-budget control exists yet. If added, recommend only tested configurations and use theoretical maximum matches: playoffs can require **1,097** total, even though this batch's observed maximum is lower.
- Preserve the source discrepancy: the current 25 November FIFA table puts Portugal fifth, Brazil sixth and Morocco seventh, while the 18 November article puts Morocco fifth. Cause unverified. The snapshot preserves the table as observed, not a reconciled historical release.

### Data sources and refresh caveats

Authoritative inputs are outside `website/`:

- [Team snapshot](../data/fifa-men-top32-2026-11-25.json)
- [Pairwise probabilities](../data/pairwise-win-loss-2026-11-25.csv) and [notebook 01](../notebooks/01_pairwise_win_loss.ipynb)
- [Per-tournament results](../outputs/tournament-comparison/tournament_results.csv)
- [Summary](../outputs/tournament-comparison/format_summary.csv)
- [Settings and provenance](../outputs/tournament-comparison/settings.json)

Do not rerun the statistical experiment merely to work on the website. Preserve notebooks and original data. The preparation script reads them and writes only website copies.

The first implementation targets the existing batch. Format labels/order, the snapshot filename and the 1,000-run expectation are currently encoded in the app or preparation script. The headline counts and numerical takeaway prose in `tournament.html` are also written for that batch. **If the source batch changes, review these alongside refreshing data**; running the preparation script alone does not update narrative copy or introduce new formats safely.

### Validation performed on the first pass

- Data preparation validated group sizes, mean rating gaps and Monte Carlo standard errors against all 8,000 saved records.
- Node checks passed for recursive seed placement, highest-seed separation, match probability, 32 unique entrants, 31 matches, round advancement and champion gaps; JavaScript syntax was checked.
- Browser checked the gallery and experiment at desktop width and a 390px phone viewport. Fixed initially undersized mobile chart labels. The phone page had no document-level horizontal overflow; the results table intentionally scrolls within its container.
- Browser checked seeded/random demo controls, round inspection, replay retaining the champion, chart-point/table selection and log/linear axis switching. No browser console errors were observed during those checks.
- Local HTML asset/download links were checked. Original experiment files were unchanged; only the project README and new website folder were changed at handoff.

Reduced-motion handling is implemented but was not separately exercised through browser media emulation. This is a first-pass check, not an exhaustive cross-browser or assistive-technology audit.

### Continuing work

Read this file before asking Aryaman to repeat website context. Inspect the current implementation before editing. Treat future feedback in this chat as steering the website; don't restart statistical research or act on parked project ideas without a relevant request.

For a change, verify the affected flow locally and check a phone width when layout changes. Keep site paths relative for `/lovestats/`. Avoid introducing a framework or build pipeline unless it materially helps. The preview server is session-dependent: the first handoff used `http://127.0.0.1:4173/`, but check whether it is still running before assuming that address is live.

Update this README's current sections when design decisions, architecture, scope, data handling or deployment status change. Keep meaningful history and unresolved limitations, but avoid appending overlapping handoffs. There is no additional feature backlog approved yet; the next scope comes from Aryaman's feedback.


### Implemented second experiment: Music Lab v1

Implemented locally on 25 November 2026 from the [website handoff](../experiment2-woulld%20song%20be%20a%20hit%20in%208%20worlds/WEBSITE_HANDOFF.md). The [research README](../experiment2-woulld%20song%20be%20a%20hit%20in%208%20worlds/README.md) and handoff describe the prepared package before website implementation; this section records the current website state. Research files remain unchanged.

Open `http://127.0.0.1:4173/musiclab.html`. The gallery now includes its record-themed card, using the accepted green/mint/lime/purple direction. The page is about the causal design of the **first** Music Lab experiment, not a new participant study or full-paper replication. No publication or push.

Files:

| File | Responsibility |
| --- | --- |
| `musiclab.html` | Study narrative, controls, accessible table alternatives, replication caveat and citations. |
| `musiclab.css` | Page-specific layouts and record artwork; also used for the gallery card. |
| `musiclab.js` | Song exploration, daily replay, saved splits and histogram rendering. |
| `musiclab-data.js` | Shared rank/share/Gini calculations and validation of aggregate schemas, vectors, histories and splits. |
| `prepare_musiclab.py` | Checks every source manifest hash/size, then copies the prepared aggregate bundle. |
| `check-musiclab.mjs` | Data-contract, tie/zero-state, replay-endpoint, split and headline-value checks. |
| `data/musiclab-v1/` | Prepared JSON/CSV, fallback figures and source manifest. No raw participant records or audio. |

Refresh and check from the repository root:

```sh
python3 website/prepare_musiclab.py
node website/check-musiclab.mjs
```

This is separate from the tournament preparation script. It does not execute the research notebooks. The page loads `v1.json` and the small split examples on opening; daily history loads on request. Both missing data and failed validation have visible error states.

Interaction flow:

- All 48 songs can be selected. Initially reveal the eight social-world outcomes; subsequent selections update the revealed outcomes directly. Default “gnaw” is explicitly a post-hoc illustration with the largest rank span. Ranks preserve ties and shares are percentages. The full independent group's demand is a separate appeal benchmark.
- Open recorded history, select any of the eight social worlds or the independent group, then play/pause, restart or scrub 69 states (empty state + 68 calendar dates). The selected song carries through. All history is deterministic. Zero downloads mean undefined rank/share/Gini, shown as em dashes. The leaderboard is our analytical view, not the original participant interface. Reduced motion makes Play advance one day rather than starting automatic playback.
- Histograms use all 1,000 independent partitions, with social-world/social-pair markers. Marker vertical staggering is only for readability; bar heights encode partition counts. Tables provide exact social values. The split control cycles the first 12 saved examples without changing social histories.
- A visible result-section button opens and scrolls to the reproduction caveat. Methods preserve sources, data anomalies, causal limits and the discrepancy. No audio is included; redistribution rights have not been established.

Statistical boundaries specific to this page:

- Exactly 7,149 participants: 1,441 independent and 5,708 across eight social worlds. The treatment shows previous in-world download counts; v1 did **not** order its original menu by popularity. All menu positions were independently randomized for each participant.
- Use mean independent-half Gini **0.257781**, not the full control Gini, against social mean **0.340224**. Unpredictability is mean absolute song-share difference: **0.492 vs 0.821 percentage points**, ratio **1.67×**. This is not a hit-prediction error probability.
- Repeated splits reuse people; 28 social pairs share worlds. Neither represents independent repeated experiments. No causal confidence interval is supplied.
- Primary comparison fractions: 0.01075 inequality and 0.004071 unpredictability. Longer run: 0.012225 and 0.003721; 721-person Gini half: 0.012675. The original inequality threshold below .01 does not exactly reproduce; direction agrees, cause unresolved. These are the authors' split-comparison fractions, not conventional null-randomization p-values.
- Daily replay ends on the last retained download date (13 December 2004), not official recruitment end (15 December). It is not exact original visible counters or within-day chronology. Appeal benchmark is not objective quality; the data cannot distinguish every mechanism behind social influence.

Validation: checksum-verified all 17 prepared assets; checked all 48 songs and nine rank/share/count vectors, all 69 history states per world (monotone, zero start, exact endpoint), all 12 split reconciliations and headline values. Browser checks cover reveal, history opening/zero state, final-state scrubbing, world selection, saved split cycling play/pause, restart, song selection, keyboard date stepping, the methods shortcut, and desktop/390px phone layouts. No document-level overflow or browser console errors were observed. The original tournament code is unchanged. Further fixes and browser checks should be recorded here when material.
