# lovestats website

For agents working on UI/UX, navigation, and presenting the experiments, start with [AGENT_CONTEXT.md](AGENT_CONTEXT.md). This README holds the detailed implementation and statistical contracts.

A buildless static site with an experiments gallery and four interactive experiment pages. All website paths are relative, so the contents of this folder can eventually be served at `/lovestats/` on GitHub Pages. No publishing configuration has been added. Website source is included in the repository; pushing source does not deploy the site.

## Repository versus deployment

The repository-root `.gitignore` excludes local environments, dependencies, caches, secrets, logs, editor settings, and disposable build/test output. Keep the website source, `website/data/`, images, vendor licenses, and any future deployment workflows or package lockfiles tracked. The site currently requires no build step; its prepared data is part of the deployable site.

For eventual hosting, publish **only the contents of `website/`**, not the repository root. Research notebooks, source datasets, archives, and agent documentation can be versioned without being part of the public site artifact. A deployment workflow can exclude Markdown handoff files, preparation scripts, and check scripts from its artifact. `.gitignore` is not a deployment filter or a privacy control for already tracked files; it does not remove files from Git history. No deployment has been configured or triggered.

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

Uses Python's standard library. Validates all 8,000 saved records and the 256 team/format championship shares, including targets, counts, intervals, TV and maximum match budgets. Generates `data/fairness.json` and the legacy `data/summary.json`, and copies source CSVs/settings into `data/`. It never executes notebooks or modifies original artifacts. Currently expects the selected 1,000-run batch.

## Interaction and scope

- Gallery order: **Is the change real?**, football, Music Lab, next-letter. The first is one experiment with five subsections.
- Football now asks which format gives championship chances closest to rating-based strength shares. All 32 teams have paired target/simulated bars, initially rating-ordered; users can change saved format and inspect counts, signed differences and individual uncertainty intervals.
- Estimated TV, displayed as **Probability to reallocate** in percentage points, is primary. Average champion rating gap is secondary. Compare both with average and theoretical maximum match cost.
- Five fresh demo families: seeded/random knockout, World Cup, league, league plus best-of-seven playoffs, and adjustable Swiss (1–15 rounds). Replay retains actual history; another play generates new outcomes. Stage selection pauses playback. Reduced motion reveals the champion immediately with all stages inspectable.
- Fresh demos never change saved analysis. Saved Swiss settings are only 5, 7 and 9 rounds. Other settings explicitly have no saved estimates.
- No budget recommender or universal optimality claim. Any future hard-budget recommender must minimize TV among tested settings fitting `max_possible_matches`.
- Fonts optionally load from Google Fonts with local fallbacks. The Swiss matching implementation is bundled locally under MIT; no runtime CDN, tracking or backend.

## Check simulation rules

```sh
node website/check.mjs
node website/check-football.mjs
```

## Website development context and handoff

Updated 25 November 2026 for the championship-share fairness objective.

This chat is the **website-building chat for lovestats**. Use this README as the starting point for continuing design and implementation, including from another chat. Read the [project README](../README.md) for the experiment's broader purpose and research history; read the [workspace guide](../../../AGENTS.md) for workspace conventions. Keep website decisions here and statistical experiment decisions in the project notes/notebooks rather than maintaining competing accounts.

### Product direction and user feedback

lovestats is a personal collection of playful, interactive statistical experiments: inviting, curious and thoughtfully designed, rather than a corporate dashboard or textbook. Prioritise one coherent experience over lots of controls. The football experiment asks **“Which format gives teams championship chances closest to their rating-based strength shares?”** Its earlier “Does the best team win?” objective is superseded; always crowning Spain is no longer the ideal. The second experiment is Music Lab v1, “One song. Eight worlds. The same hit?” Future experiments should fit naturally into the gallery; do not fill it with invented projects or placeholder cards.

Aryaman's reaction to the first preview was strongly positive: **“the ux style is great well done.”** Treat the current visual/UX direction as the accepted starting point. This is approval of the style, not a claim that every interaction is final or that publication is authorised. Extend and refine it rather than gratuitously redesigning it.

The original delivery was a polished first pass for local review. Explicit boundary: **do not publish or push yet**. Continue local development unless a later instruction changes that. Eventual hosting target is GitHub Pages under `/lovestats/`, with remote `https://github.com/wade-ary/lovestats.git`. No backend, accounts, database, paid services or GPU.

### Current homepage direction

Use a compact masthead with only the existing lowercase lovestats wordmark and asterisk, aligned to the cards: 34px desktop / 30px mobile. The right side stays empty. One thin divider sits above “The experiments”; there is no duplicate header link or section subtitle. The earlier headline and branching illustration were removed at Aryaman's request.

No header tagline, hero eyebrow/paragraph, card category pills, artwork-bottom captions, or closing slogans. Preserve the small top-left artwork labels, existing illustrations, all four card titles/descriptions and their link text. The signal illustration does not repeat “is it real?”. Homepage-specific layout lives in `home.css`; keep changes isolated from experiment pages.

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
| `index.html` | Gallery, introduction and all four experiment cards. |
| `tournament.html` | Experiment narrative, demo shell, saved-results section, takeaways and methodology disclosures. |
| `style.css` | Shared visual system, desktop/mobile layouts, interaction states and reduced-motion rules. |
| `app.js` | Fetch website data, render chart/table/details, coordinate demo controls and timed round reveals. |
| `formats.js`, `football.css` | All five fresh tournament families and football-specific presentation. |
| `vendor/` | Locally bundled weighted matching, license and attribution. |
| `check-football.mjs` | Fairness data reconciliation, all five format rules and weighted matching checks. |
| `simulation.js` | Pure browser match probability, recursive bracket seeding and single-tournament history generation. |
| `prepare_data.py` | Reproducible validation/conversion/copying of saved artifacts into website data. |
| `data/` | Website copies of source artifacts plus derived `fairness.json` and legacy `summary.json`; refresh through the script. |
| `check.mjs` | Checks probability, seed placement, unique entrants, advancement, match counts and champion gaps. |
| `package.json` | Declares ES modules and a test command; no installed dependencies or bundler. |

Tournament page progression:

1. Opening question, scope and explicit chosen definition of fairness.
2. All-team paired bars with format selection, rating/difference/share ordering, individual detail and exact table. Common 0–50% scale for the current saved batch.
3. Fairness distance and match-cost table, with secondary champion strength and a sampling-noise explanation. Estimated ordering is not a decisive ranking.
4. Five independent fresh demos with actual match histories, standings, stage inspection and replay.
5. Interpretation and expandable model, rules, uncertainty, provenance and downloads.

### Statistical contract

- Use the saved 32 men's national teams and fixed FIFA ratings. Match model: `P(A wins) = 1 / (1 + 10 ** (-(rating_A - rating_B) / 600))`.
- Target: `weight_i = 10 ** ((rating_i - max_rating) / 600)`; normalize weights to sum to one. This is a chosen fairness benchmark consistent with relative match strengths, not universal sporting fairness or an official FIFA championship forecast.
- Primary metric: `TV = 0.5 * sum(abs(observed_share - target_share))`. Display `100 * TV` as **Probability to reallocate**, in percentage points. Lower is closer to this benchmark; never call it accuracy. Champion rating gap remains a secondary strength measure.
- Stronger teams should win more often, with weaker teams retaining chances relative to their strength. Always selecting the top-rated team is not the goal.
- Matches are independent W/L outcomes conditional on ratings: no draws, home advantage, fatigue or rating updates. This is not a calibrated real-world forecast.
- Saved results: 1,000 tournaments per setting for random/seeded knockout, World Cup, double round-robin league, league plus top-16 best-of-seven playoffs and Swiss 5/7/9.
- [Notebook 02](../notebooks/02_tournament_formats.ipynb) is the exact rule reference. Preserve recursive seeding, four rating pots for eight groups, fixed group-to-knockout mapping, random standings lots, fixed playoff bracket and first-four-win stopping rules.
- Swiss uses full minimum-total-win-gap matching without rematches, plus random edge costs divided by 33 to break pairing ties. `formats.js` uses locally bundled weighted blossom matching, not a greedy substitute. Failure to find a full pairing aborts the demo; there is no backtracking.
- Browser draws do not reproduce NumPy's stream. Saved champion/count records do not supply historical brackets. Never fabricate them.
- Individual 95% Wilson intervals describe Monte Carlo uncertainty in each simulated team share, not simultaneous coverage, target uncertainty or model validity. Zero titles means **0 wins in 1,000 simulations**, not zero underlying probability.
- Small estimated TV differences are not decisive. The saved perfect-alignment noise reference uses multinomial draws from the target; its central range is not a confidence interval for a format's TV or a significance test.
- League and league-plus-playoffs share each saved league season. Preserve that pairing in any statistical comparison.
- No interpolation of untested settings. Hard budgets use theoretical maxima; playoffs can require **1,097** matches even if the observed maximum is lower. Never optimize Spearman correlation or top-four title share as the main score.
- Preserve the source discrepancy: the 25 November FIFA table puts Portugal fifth, Brazil sixth and Morocco seventh; the 18 November article puts Morocco fifth. Cause unverified. The snapshot preserves the table as observed.

### Data sources and refresh caveats

Authoritative inputs are outside `website/`:

- [Team snapshot](../data/fifa-men-top32-2026-11-25.json)
- [Pairwise probabilities](../data/pairwise-win-loss-2026-11-25.csv) and [notebook 01](../notebooks/01_pairwise_win_loss.ipynb)
- [Per-tournament results](../outputs/tournament-comparison/tournament_results.csv)
- [Championship shares](../outputs/tournament-comparison/championship_shares.csv)
- [Fairness summary](../outputs/tournament-comparison/fairness_summary.csv)
- [Legacy champion-strength summary](../outputs/tournament-comparison/format_summary.csv)
- [Settings and provenance](../outputs/tournament-comparison/settings.json)

Do not rerun the statistical experiment merely to work on the website. Preserve notebooks and original data. The preparation script reads them and writes only website copies.

The first implementation targets the existing batch. Format labels/order, the snapshot filename and the 1,000-run expectation are currently encoded in the app or preparation script. The headline counts and numerical takeaway prose in `tournament.html` are also written for that batch. **If the source batch changes, review these alongside refreshing data**; running the preparation script alone does not update narrative copy or introduce new formats safely.

### Historical validation of the original first pass

- Data preparation validated group sizes, mean rating gaps and Monte Carlo standard errors against all 8,000 saved records.
- Node checks passed for recursive seed placement, highest-seed separation, match probability, 32 unique entrants, 31 matches, round advancement and champion gaps; JavaScript syntax was checked.
- Browser checked the gallery and experiment at desktop width and a 390px phone viewport. Fixed initially undersized mobile chart labels. The phone page had no document-level horizontal overflow; the results table intentionally scrolls within its container.
- Browser checked seeded/random demo controls, round inspection, replay retaining the champion, chart-point/table selection and log/linear axis switching. No browser console errors were observed during those checks.
- Local HTML asset/download links were checked. Original experiment files were unchanged; only the project README and new website folder were changed at handoff.

Reduced-motion handling is implemented but was not separately exercised through browser media emulation. This is a first-pass check, not an exhaustive cross-browser or assistive-technology audit.

### Current fairness revision validation

Validated all 256 team/format rows against the saved counts and target formula, all TV values, intervals and theoretical budgets. `check-football.mjs` exercises all five families, league pair counts, World Cup pots, best-of-seven stopping, Swiss no-rematch/full-round constraints, and weighted matching against exhaustive solutions on small graphs. The old knockout checks remain applicable. Browser checks cover all five families, saved format switching, zero-title uncertainty and a Swiss setting outside the saved batch. Fixed an initialization-order error and made Swiss input update immediately. Original research outputs and the other two experiments remain unchanged.

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

This is separate from the tournament preparation script. It does not execute the research notebooks. The page loads `v1.json` and the small split examples on opening; daily history is retained as a downloadable source asset but is no longer loaded by the page. Both missing data and failed validation have visible error states.

Interaction flow:

- All 48 songs can be selected. Initially reveal the eight social-world outcomes; subsequent selections update the revealed outcomes directly. Default “gnaw” is explicitly a post-hoc illustration with the largest rank span. Ranks preserve ties and shares are percentages. The full independent group's demand is a separate appeal benchmark.
- The “How did the downloads add up?” replay section was removed at Aryaman’s request during review of the main findings. Its page controls and handlers are removed; saved history data and the existing methodology/download references remain. All other page sections are unchanged. Broader revisions await subsequent feedback.
- Histograms use all 1,000 independent partitions, with social-world/social-pair markers. Marker vertical staggering is only for readability; bar heights encode partition counts. Tables provide exact social values. The split control cycles the first 12 saved examples without changing social histories.
- A visible result-section button opens and scrolls to the reproduction caveat. Methods preserve sources, data anomalies, causal limits and the discrepancy. No audio is included; redistribution rights have not been established.

Statistical boundaries specific to this page:

- Exactly 7,149 participants: 1,441 independent and 5,708 across eight social worlds. The treatment shows previous in-world download counts; v1 did **not** order its original menu by popularity. All menu positions were independently randomized for each participant.
- Use mean independent-half Gini **0.257781**, not the full control Gini, against social mean **0.340224**. Unpredictability is mean absolute song-share difference: **0.492 vs 0.821 percentage points**, ratio **1.67×**. This is not a hit-prediction error probability.
- Repeated splits reuse people; 28 social pairs share worlds. Neither represents independent repeated experiments. No causal confidence interval is supplied.
- Primary comparison fractions: 0.01075 inequality and 0.004071 unpredictability. Longer run: 0.012225 and 0.003721; 721-person Gini half: 0.012675. The original inequality threshold below .01 does not exactly reproduce; direction agrees, cause unresolved. These are the authors' split-comparison fractions, not conventional null-randomization p-values.
- Daily replay ends on the last retained download date (13 December 2004), not official recruitment end (15 December). It is not exact original visible counters or within-day chronology. Appeal benchmark is not objective quality; the data cannot distinguish every mechanism behind social influence.

Validation: checksum-verified all 17 prepared assets; checked all 48 songs and nine rank/share/count vectors, all 69 history states per world (monotone, zero start, exact endpoint), all 12 split reconciliations and headline values. Browser checks cover reveal, history opening/zero state, final-state scrubbing, world selection, saved split cycling play/pause, restart, song selection, keyboard date stepping, the methods shortcut, and desktop/390px phone layouts. No document-level overflow or browser console errors were observed. The original tournament code is unchanged. Further fixes and browser checks should be recorded here when material.

### Implemented third experiment, displayed first: Is the change real?

Added 25 November 2026 at Aryaman's request. **Gallery position is first**, ahead of tournament and Music Lab. One page (`change.html`) contains five linked subsections. Each starts with **“The situation”** (background) and **“What we want to show”** (the learning purpose), then setup, visual evidence, interpretation and expandable detail. Preserve that narrative structure; this is not a bare test-results dashboard.

Source: [Experiment 3 README](../experiment3-is-the-change-real/README.md) and the website briefs inside its five executed notebooks. Only website copies are written; notebooks, raw trials and original outputs are untouched. Local-only/no-push remains in force.

| Subsection | Interaction and point |
| --- | --- |
| Student’s versus Welch’s | Toggle equal spread/sizes versus a smaller, noisier group. Saved example dots, false-positive rates and estimated/true SE. Both population means are 60; both size and spread change. |
| Paired before/after | Toggle baseline SD 2/15. Show matched lines and identical individual changes, power and null false positives. Independent Welch’s intentionally ignores known pairs and is not a valid independent-data alternative for this design. |
| Means versus ranks | Broad ×1.4 shift, rare 5% ×9 spending or identical-distribution null. Population mean and rank effects lead; analytic density curves and saved rejection rates support the explanation. |
| ANOVA and multiple comparisons | Discrete 2–10-group slider shows k(k−1)/2 pairs, network and saved family-wise error rates for uncorrected pairs, Bonferroni and ANOVA. Separate SD 3/10 toggle shows power for means 60/60/63. |
| Chi-square versus Fisher | Toggle plentiful/sparse scenarios. Constructed observed/expected count tables, one-cell Pearson calculation, and null rejection rates with explicit Yates series and degenerate-table handling. |

Implementation: `change.html`, `change.css`, `change.js`, `prepare_change.py`, `check-change.mjs`, and `data/change-real/`. `change.css` also styles the new first gallery card. All results are read from the generated aggregate, not independently hard-coded into UI copy. Controls select saved settings; no browser hypothesis-test simulations run. The spending density curves are deterministically calculated from the saved lognormal/mixture parameters during preparation, not new samples.

Refresh/check from the repository root:

```sh
python3 website/prepare_change.py
node website/check-change.mjs
```

Data preparation copies only selected settings, metric tables, saved illustrative samples and the ANOVA fixed-mean figure. It validates count/rate consistency and interval bounds. It does not copy large trial files or rerun notebooks. `experiments.json` is the website aggregate; regenerate rather than hand-edit it.

Presentation boundaries:

- All data are simulated teaching settings, not observed services, users or causal treatment evidence. Each setting has 20,000 repetitions, with two-sided alpha .05 where applicable.
- Whiskers are 95% Wilson Monte Carlo intervals for rejection rates, not treatment-effect confidence intervals or evidence about real-world validity. False-positive rate is not the probability that a particular significant result is false.
- Keep scenario chart scales consistent. Paired power (0–100%) and false positives (0–10%) use deliberately different, labelled scales. Zero observed false alarms does not mean zero risk.
- Mann–Whitney's standard null is identical distributions, not universally equal medians or P(B>A)=.5 under arbitrary unequal shapes. A rank effect is not the fraction of matched people who improved.
- All-pairs tests share groups. Do not replace saved slider rates with the independent-tests formula or interpolate uncomputed group counts. Bonferroni controls the family-wise error without requiring independence. ANOVA does not identify which pairs differ.
- Pearson disables continuity correction; Yates is explicit. Sparse experiments with undefined chi-square remain in the denominator as no rejection. Fisher is conservative in these settings, not universally superior.
- The saved ANOVA illustration centres residuals to fix sample means; actual repeated simulations do not. Original research README statements saying no website was implemented describe the earlier notebook-only stage.

Browser checks: first gallery position and all five page sections; all scenario switches; 10 groups gives 45 pairs and the saved 63.12% uncorrected family-wise rate; desktop and 390px phone layouts with no document-level horizontal overflow or console errors observed. Refresh this handoff when interactions or scope change.

### Fourth experiment: Next letter · Part 1

Added from [next_letter.ipynb](../experiment4-next-letter/next_letter.ipynb) and its adjacent `letter_transitions.json`. Homepage position is fourth. The compact masthead and previous three cards are preserved. Open `next-letter.html`.

Current question: **“Where do you end up if you always choose the most likely next letter?”** Scope is strictly one-letter memory and deterministic greedy choice. Longer-memory models and LLM interaction are deferred.

- Fixed 26-letter SVG layout. Release/replay animates exported frame positions with grouped path-count markers. Step backward/forward supports inspection; pause returns to the last completed frame. Count sequence: 2, 13, 18, 22, 26 at E or R. Reduced motion advances without tweening.
- At convergence, pause with E → R highlighted and the data-derived 19.6% / 80.4% explanation. Reveal all E connections, then explicitly return to the strongest-link overview. An explore shortcut allows skipping animation.
- Overview has exactly one strongest arrow per letter. E ↔ R uses separate curves. Every observed outgoing edge, including self-loops, appears for a selected letter; zero-count edges are omitted. Width is `.65 + 14 × probability` SVG units: linear with a visibility baseline. Coordinates never depend on selection and carry no statistical meaning.
- Pointer hover or keyboard focus previews; clicking/tapping or Enter/Space toggles the pin. Leaving restores the pin. Dropdown pins or clears. The adjacent ranked table follows the current preview, includes all 26 destinations, and uses `<0.001%` for tiny positive probabilities rather than falsely showing zero. Count and higher-precision values are available in value tooltips.
- Mobile graph scrolls horizontally within its container; table and dropdown stack below. No probability labels crowd the graph. No animation libraries or external runtime dependencies.
- End with the user's two-letter-memory question verbatim. Counts represent within-word A–Z transitions; word endings add no outgoing transition. No smoothing; not a claim about every linguistic context.

Files: `next-letter.html`, `next-letter.css`, `next-letter.js`, `prepare_next_letter.py`, `data/next-letter/letter_transitions.json`. The JSON is copied byte-for-byte after validation; never hand-edit it or rerun the notebook for a website-only change.

Refresh/check: `python3 website/prepare_next_letter.py` and `node --check website/next-letter.js`. Preparation reconciles all 676 cells, totals, ranking, strongest choices, exported paths and every frame. Browser checked convergence, E explanation, all 26 table rows, self-loop presence, Q's four zero-count rows, click-to-pin/clear, keyboard preview restoring the pin, replay/pause, step forward/back, and phone layout with no document-level overflow. Source notebook and source data are unchanged. Local-only, no push/publication.
