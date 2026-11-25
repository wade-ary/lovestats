# Website handoff: would the same song become a hit in eight worlds?

## Decision and scope

Aryaman selected **Music Lab v1 only** as the second lovestats experiment. Build a playful, cited explanation of an existing randomized study using real released data. The central learning is how the design supports a causal interpretation: define the intervention, construct a credible comparison, allow separate histories, and distinguish ordinary sampling variability from social feedback. The statistics support that explanation rather than becoming a dashboard of unexplained numbers.

This handoff prepares a page; it does not authorize publishing or pushing. Follow the current [website README](../website/README.md) for accepted visual direction, relative-path hosting and local preview practice. Reuse the existing editorial layout, mint/green/lime/purple palette, typography, accessibility and mobile patterns. No need for a backend or framework.

The implementation should call this **a reproduction of the paper's first experiment**, not a new experiment we ran, a full-paper replication, or proof of how Spotify works. V2–v4 and stronger-signal comparisons are excluded from the page. In particular, do not reuse the earlier v2 “Florence” example.

## The story

Suggested headline: **Would the same song become a hit in eight worlds?**

Suggested opening copy:

> Same 48 songs. Separate groups of listeners. Each group can see only its own download counts. Would they agree on the hits?

Immediately identify the source: “A reproduction of Music Lab's first experiment, Salganik, Dodds & Watts (2006).” The original study used real participants in 2004; our analysis is of the released records.

Suggested takeaway:

> Showing popularity made downloads more concentrated, while the same songs had different outcomes across separate worlds.

This is a statement about the randomized comparison in this setting. Do not turn it into “talent does not matter,” “hits are random,” or “one like guarantees success.” Independent demand is positively associated with social success, with substantial variation across worlds.

## Recommended page sequence

### 1. Hook: one song, eight outcomes

Let the visitor select a song and reveal its final ranks/shares in the eight social worlds. Use all 48 songs in the selector, with a readable table equivalent to the chart.

Default illustrative song: **“gnaw” by silverfox**, song ID `306121`. Its v1 ranks in worlds 1–8 are **21, 31, 19, 7, 24, 22, 45, 10**. The default was selected because it has the largest observed rank span. Label it as an illustration chosen after seeing the data, not an independent statistical test. The conclusion later uses all songs.

Rank ties share the same competition rank: `1 + number of songs with strictly more downloads`. A stable ordering by song ID can arrange equal rows visually but must not fabricate different ranks. Lower rank is better. Display shares too: a change from rank 20 to 10 has no fixed share interpretation.

### 2. What actually changed?

Show the random allocation simply: **7,149 participants → independent group (1,441) or one of eight social worlds (5,708 total)**. Assignment probabilities were 20% independent and 10% per social world; realized group sizes need not match exactly.

Both conditions:
- The same 48 previously unfamiliar songs.
- Random song positions in a three-column grid, separately for each participant.
- Listen → rate → optionally download; people could choose how many songs to explore.

Treatment: display prior download counts from that participant's world. Control: hide those counts. **V1 did not rank the original song menu by popularity.** An analytical leaderboard is fine, but label it as our view of results, not the original interface.

A “counts shown / counts hidden” comparison can explain the conditions. It must not pretend that toggling a switch reveals the alternate causal outcome for the same world or participant. We have distinct randomized groups, not both potential outcomes for each person.

### 3. Replay observed histories, if it helps the story

Use the saved daily series to animate retained download accumulation. Controls: play/pause, scrub date, restart, choose world and song. A replay must show the same history every time; do not generate new worlds in the browser.

The data run from **2004-10-07 through 2004-12-13**, the first and last retained download dates. There are 68 calendar dates plus a zero state. The documented experimental recruitment period extended to December 15; do not label the last retained download date as the official experiment end.

Visible label: “Replay of retained downloads, grouped by day.” No within-day chronology is supplied in the bundle. Interpolation may animate a transition visually but must not imply measured events between daily snapshots. At the initial zero state, shares/Gini are undefined: display an em dash rather than zero inequality or a winning song.

Original screen counters may have included activity later excluded from the release. These are **not exact original visible counters**. Independent counts are available for our analysis, although independent participants could not see them. Do not infer participant arrival counts from download progress. World sizes differ, so comparisons of success should use shares; cumulative counts remain appropriate for showing recorded activity.

### 4. Result one: do the winners take more?

A compact explanation of Gini: “How unevenly are downloads divided among the 48 songs?” Equal shares yield 0; larger values mean more concentration. The uncorrected formula used here has maximum 47/48 for 48 songs, not exactly 1.

Plot the eight world Ginis alongside the independent **split baseline**, or show the control-split distribution with social world markers. Key numbers:

| Statistic | Value |
| --- | ---: |
| Mean independent-half Gini | 0.257781 |
| Mean social Gini | 0.340224 |
| Mean difference | 0.082443 |
| Social range | 0.283766–0.417520 |

All eight social values exceed the independent split mean; they do not all exceed every control split. Avoid “more downloads”: this is a change in how downloads are distributed, not necessarily in total demand.

### 5. Could different listeners alone explain the differences?

This is the key experimental-design lesson. Even without influence, two groups can produce different results. The independent group was twice as large as a social world, so researchers repeatedly split it into comparable halves and checked what differences appeared without shared popularity information.

Our primary run repeats this **1,000 times** with 720/721 participants. It is repeated partitioning of the same real records, not 1,000 independent experiments. Use the 12 exported example splits if showing a “try another split” explanation, cycling through saved results with their split number. The final histogram always uses all 1,000, not just the twelve examples.

For unpredictability, compare the mean absolute song-share difference for the 28 social-world pairs with the independent half-pairs:

| Statistic | Independent | Social |
| --- | ---: | ---: |
| Mean difference in share units | 0.004917 | 0.008210 |
| Same quantity in percentage points | 0.491701 | 0.821033 |

Ratio: approximately **1.67×**. It is a ratio of this specific discrepancy measure; do not label it “67% harder to predict a hit” or a probability of selecting the wrong song. The 28 pairs share worlds and are not 28 independent replications.

### 6. What about the songs themselves?

An optional scatter or highlighted-song view can show independent demand versus social shares/ranks (main paper Figure 3A/B). Label independent demand as an **appeal benchmark**, not objective musical quality. Here use the **full** independent group, not the split baseline used above.

A cubic fit is supplied in analysis outputs, but the page need not show it. If used, label it descriptive and do not extrapolate or interpret it as a causal effect of quality. Ranks/shares alone do not explain whether people followed a crowd, used counts as a quality signal, or changed intrinsic taste.

### 7. Methods and replication note

Keep this expandable but discoverable, with a short visible link near the result charts: “How we checked this—and one result that didn't exactly match.”

The original supplement reports `< .01` for both v1 comparisons. Our 1,000-split run gives **0.01075 for inequality** and **0.004071 for unpredictability**. A single documented longer run, 10,000 splits with a separate fixed seed, gives **0.012225** and **0.003721** respectively. Using 721 rather than 720 people for the Gini half gives **0.012675**. The inequality threshold does not exactly reproduce; the direction does. The cause is unresolved. Do not silently substitute the paper's value for ours.

These are the authors' particular comparison fractions: choose an observed social statistic and a control-split statistic and count how often social is lower. Do not call them t-test p-values, probabilities that the null is true, or causal-effect confidence intervals. Split histograms describe partition variability; no causal confidence band has been provided.

Other checks and limits:
- HHI and CV also show greater concentration (see JSON `robustness`).
- All nine worlds' final per-song download totals reconcile with participant records and timestamped download indicators.
- Three timestamped rows have no download indicator; they were not counted as events.
- There are 29 download pairs and 36 rating pairs without matching recorded listens. Their cause is unknown. Main results depend on reconciled downloads, not invented listens.
- Retained data already reflect exclusions for possible contamination. The unavailable excluded raw data prevent a complete exclusion audit.
- Participants interact within worlds; that is intended. Information leakage between worlds is a threat to identification.
- Randomization supports comparability in expectation, not perfectly identical realized tastes.
- Free downloads of unfamiliar songs in this particular population and interface do not establish a universal music-market law.

## Exact asset contract

Source directory: this experiment's `web-assets/`. Suggested website destination: `website/data/musiclab-v1/`. Copy the prepared bundle; do not rerun the research merely to style the page. The existing `website/prepare_data.py` is tournament-specific and does not copy these files yet. Add a separate copy step or a narrowly scoped extension when implementing. Keep URLs relative for `/lovestats/` hosting.

### `v1.json` (about 69 KB)

| Key | Meaning |
| --- | --- |
| `schema_version`, `experiment` | Must equal `1`, `musiclab-v1`. |
| `song_ids` | Canonical 48-element lexicographic ID order. IDs are strings. Every world/history vector uses this order. |
| `songs` | 48 objects: `song_id`, `artist`, `title`, full-control share/rank, social mean share, min/max rank, rank span, song unpredictability. |
| `worlds` | Nine objects: world number, condition, participants, downloads, zero-download participants, Gini, listens, plus aligned `counts`, `shares`, `ranks` arrays. World 9 is independent. |
| `metrics` | Primary 1,000-split results, seed, definitions, source hash, environment versions. |
| `sensitivity` | Separate 10,000-split check and conditional Monte Carlo standard errors. |
| `independent_splits.gini` | 1,000 Ginis from 720-person independent halves. |
| `independent_splits.unpredictability` | 1,000 differences between disjoint halves. |
| `social_pairs` | 28 objects with `world_a`, `world_b`, `unpredictability`. |
| `robustness` | Gini/HHI/CV baseline and social means, minima, comparison fractions. |
| `example` | Suggested song ID and post-hoc selection rule. |
| `sources`, `units`, `audit`, `replication_status` | Citations, units, data checks and explicit reproduction limits. |

Shares and unpredictability are fractions: multiply by 100 **once** for percentages/percentage points. `worlds[8].gini` is the full independent group's Gini and is **not** `metrics.independent_gini_mean`.

### `history.json` (about 76 KB)

`dates`: `[null, "2004-10-07", ...]`, with `null` denoting the initial empty state. `worlds`: nine `{world, counts}` objects, each `counts[step][songIndex]`. Derive daily shares only where the vector sum is positive. Counts are monotone and each final vector equals its `v1.json` world vector. Every world uses the same dates and song order. No exact event timestamps or participant identifiers are in this file.

### `split_examples.json` (about 5 KB)

The first twelve primary control partitions, selected without filtering: each has `split`, `sizes`, `counts_a`, `counts_b`, `gini_a`, `u`. Both count vectors sum song-by-song to the full independent vector. `gini_a` and `u` match the corresponding first twelve values in the main JSON arrays. Displaying another saved split resamples the explanatory view, not the social histories.

### Downloads and fallback figures

- `song_worlds.csv`: 432 rows with world, song ID, downloads, share, rank, artist and title.
- `figures/01_inequality.{png,svg}`, `02_unpredictability.{png,svg}`: main result fallbacks.
- `figures/03_song_outcomes.{png,svg}`: independent demand versus social outcomes.
- `figures/v1_comparisons.png`: baseline distributions and social markers.
- `figures/04_ratings_and_downloads.*`: optional descriptive association, not a causal effect.
- `figures/05_recorded_history.*`: calendar-day history; full independent group is intentionally unsplit.
- `figures/06_prefix_stability.*`: research-only supporting reconstruction; not exact paper trajectories. Prefer omitting this from the main page.
- `manifest.json`: schema, source hash, notebook order and checksums of every prepared asset.

Use figures as fallbacks or design references. Interactive SVG/canvas plots should render the prepared numbers, not digitize these images. Provide tables/text alternatives. Do not ship raw demographic records, anonymized participant IDs or the full ZIPs to the client.

## Audio

The local ZIP includes 48 songs and the metadata matches their filenames. Audio is not required for this page and is not in the prepared web bundle. Do not automatically upload the archive or assume public redistribution rights from its availability as research data. The page is ready to build without audio; if audio becomes a requirement, check the applicable permission terms then.

## Sources and attribution

Use a visible study credit near the introduction and a source section at the end:

Salganik, Matthew J., Peter S. Dodds, and Duncan J. Watts (2006). *Experimental Study of Inequality and Unpredictability in an Artificial Cultural Market*. Science 311:854–856. https://doi.org/10.1126/science.1121066

Paper + supplement: https://www.princeton.edu/~mjs3/salganik_dodds_watts06_full.pdf

Data: *Success and Failure in Cultural Markets*, Music Lab data release, Matthew J. Salganik; https://doi.org/10.34770/y56c-ym90

Author project page: https://www.princeton.edu/~mjs3/musiclab.shtml

State that our notebooks reproduce and visualize v1 from the released data, with the documented discrepancy. Link the analysis notebook or repository when a public URL exists; do not invent one. The supplied data-release documentation dates July 30, 2008; the observations are from 2004, not from our analysis date.

## Acceptance checks for the website agent

1. Fetch and validate schema 1 and `musiclab-v1`; useful loading/error states if assets fail.
2. Show exactly 48 songs, eight social worlds plus independent world 9, and 7,149 participants.
3. Confirm the selected-song values match all nine supplied vectors and ties share ranks.
4. Confirm charts use shares or clearly identified counts; do not mix percent and percentage-point units.
5. Main inequality baseline must be 0.257781, not the full independent Gini. Unpredictability should round to 0.492 vs 0.821 pp and 1.67×.
6. Daily replay starts with no defined winner, never decreases counts and ends at the supplied final vectors. Replay is deterministic. Pausing/scrubbing preserves the selected world/song.
7. Saved split controls match JSON values and say that people are reused across splits. They must not change historical social outcomes.
8. Preserve the numerical discrepancy near the methods explanation and keep reported values distinct from reproduced values.
9. Verify no v2–v4 claims, ranked original v1 menu, “quality causes success” claim, fabricated confidence interval, or simulated history appears.
10. Keyboard-operable controls, visible focus, reduced-motion alternative, meaningful labels and a table equivalent. Check a narrow phone viewport; no document-level overflow. Auto-play is optional and should respect reduced motion.
11. Check source/download URLs and browser console. Test with an HTTP server, not `file://`.
12. Only website copies should change during implementation. Local page construction and publication are separate steps; no push/publish is authorized by this handoff.
