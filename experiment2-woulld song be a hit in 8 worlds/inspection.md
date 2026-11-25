# Music Lab — inspection and reproduction record

Inspected 25 November 2026. This is our second project, but the supplied archive contains four original Music Lab experiments. Original files preserved; archives inspected without extraction. The v1-only notebook sequence and website-ready assets are complete; see [current README](README.md) and [website handoff](WEBSITE_HANDOFF.md). No website has been built in this work.

## What is present

- `musiclab_data.zip`: 167 comma-separated text files; archive integrity check passed. Some contain `%` comment headers that must be skipped.
- `musiclab_songs.zip`: 48 MP3 entries matching the study's 48-song scope.
- `README.txt`: file dictionary; legacy encoding, readable as Mac Roman.
- `data_release.pdf`: 27-page documentation, including design, recruitment, song mapping (Table 7, page 22), exclusion protocols and survey coding.

## Original experiments

| Version | Participants verified in demographics | Design |
| --- | ---: | --- |
| v1 | 7,149 | Eight social worlds plus independent world 9. Random song placement in a grid in both conditions; social worlds show download counts. |
| v2 | 7,192 | Eight social worlds plus independent world 9. Social worlds show counts and sort by popularity; independent songs appear in random order. |
| v3 | 2,930 | Two social worlds plus independent world 3; ranked-list design with a different recruitment population. |
| v4 | 9,996 | One unchanged world, two inverted-popularity worlds, independent world 4. Includes seeded initial download counts. |

Total 27,267 participants. v1 and v2 together account for the 14,341 participants in the 2006 Science paper. Version comparisons are not themselves randomized comparisons: recruitment and participant composition changed over time.

## Usable layers

Final song-by-world listen/download totals; participant-by-song listen/rating/download matrices; timestamped listens and downloads; song screen positions; demographics and daily recruitment; v4 initial counts. Song columns use lexicographic song-ID order, not numeric sorting. Rating zero means missing/unrated, not a zero-star opinion. Download matrices count whether each user downloaded each song, not unlimited repeat downloads.

Checked all 25 participant download matrices against final totals: v1–v3 agree exactly. v4 totals include initial seeded counts; subtracting `downloads_ic4_lexorder.txt` reconciles all songs/worlds exactly. Actual v4 participant downloads total 12,344, while seeded final totals sum to 15,743. Versions 1–3 totals are 8,203, 10,298 and 3,731.

## A concrete visual hook

In v2, song 131405, “Florence” by Post Break Tragedy, has download-count ranks 37, 33, 25, 34, 20, 12, 46 and 6 in social worlds 1–8. Computed as 1 plus the number of songs with strictly more downloads (ties share a rank). These are observed histories, not simulations; a selected striking example does not by itself estimate the causal effect.

## Causal learning and boundaries

Random assignment within an experiment supports comparing the information environments. The outcomes of interest include concentration of download shares and variability in a song's success across worlds. Use within-world shares for market success because world sizes and download activity differ. Independent-condition demand is a benchmark for appeal under that interface, not objective musical quality.

Within-world influence is intentional: participants are not independent observations for every market-level outcome. Cross-world information contamination threatens the design. The released data already exclude potentially contaminated behavior (including certain referral sources and post-logoff/late activity); excluded raw records are not included, so a complete exclusion audit is unavailable. Registration timestamps after 10 November 2004 are unreliable in v1, per documentation. The v2 treatment bundles visible counts with ranking; it cannot isolate a pure count-display effect. Unknown songs, free downloads, selected online participants and the 2004–05 interface limit generalization.

Current explicit scope: v1 alone is the standalone website experiment. V2–v4 are retained only as source context; do not use them on this page.

Sources: supplied README and data-release PDF; inspected archive contents. Study: Salganik, Dodds and Watts (2006), *Experimental Study of Inequality and Unpredictability in an Artificial Cultural Market*, Science 311:854–856, https://doi.org/10.1126/science.1121066. Author project page: https://www.princeton.edu/~mjs3/musiclab.shtml.

## v1 selected — causal question and statistical evidence

Aryaman selected v1 first. On 25 November, checked the [original paper with supplement](https://www.princeton.edu/~mjs3/salganik_dodds_watts06_full.pdf) and [standalone supplement](https://pdodds.w3.uvm.edu/research/papers/years/2006/salganik2006a_supp.pdf), especially supplement printed pages 9–11. This records the explanation offered, not demonstrated learner mastery.

v1 supports a causal effect of displaying past download counts on concentration and between-world variability of success in this experimental market. Success = within-world download share. Inequality = Gini across 48 song shares. Unpredictability = average absolute difference in a song's share between world pairs, then averaged across songs. Eight worlds give 28 pairs, which share worlds and are not 28 independent replications.

The control group was about twice each social-world size. Authors randomly split control participants into halves 1,000 times. For inequality they computed Gini on one half; for unpredictability they compared both halves. They compared these baseline distributions with the eight social-world Ginis and 28 social-world-pair unpredictability values. Reported comparison probabilities were below .01 for both v1 outcomes. Specifically, their supplement describes the probability that a randomly chosen social value minus a randomly chosen control replicate is negative. Do not substitute a conventional t-test interpretation or describe the 1,000 overlapping splits as new independent experiments. The reported method was checked first; the subsequent reproduction and threshold discrepancy are recorded below. Alternative inequality measures gave qualitatively similar findings.

Project highlight proposed: showing popularity can make success more concentrated while making the identity of successful songs less reproducible. Random assignment supports causal identification; repeat worlds reveal path dependence; random control splits provide a finite-sample variability benchmark. Within-world spillovers are part of the intervention, while cross-world contamination threatens it. Claims are local to this setting and do not show that quality is irrelevant, every early lead wins, or popularity changes intrinsic liking rather than attention/choice.

## v1 reproduction completed — 25 November 2026

[Main-outcome notebook](notebooks/02_main_outcomes.ipynb) · [Comparison chart](outputs/v1-reproduction/v1_comparisons.png) · [Results and provenance](outputs/v1-reproduction/results.json) · [Sensitivity check](outputs/v1-reproduction/sensitivity.json).

All code cells executed sequentially in one IPython process, with outputs captured in the notebook. All participant IDs match demographic assignments, download entries are binary, and all 48 song totals reconcile in all nine worlds. Includes zero-download participants. Seed 20261125; 1,000 splits of 1,441 control participants into 720/721. Gini uses the 720-person half. The notebook includes definitions, assumptions, source links and a discussion prompt; execution is not evidence of Aryaman's mastery.

Mean social Gini 0.340224 versus independent-half mean 0.257781 (difference 0.082443); social range 0.283766–0.417520. Mean social pair U 0.008210 versus control 0.004917 in share units (0.821 versus 0.492 percentage points; ratio 1.670).

Initial comparison fractions: Gini 0.01075 and U 0.004071. Because Gini was near but above the reported < .01, performed one longer sensitivity check with fixed seed 20261126 and 10,000 splits: Gini 0.012225 (Monte Carlo SE 0.000504), or 0.012675 using the larger half; U 0.003721 (MC SE 0.000115). These standard errors quantify simulation precision only. We reproduce the substantive direction and the U threshold, but **do not reproduce the paper's < .01 inequality threshold**. Original random draws, conventions, and release differences are possible explanations only; the cause remains unresolved. Do not choose another seed merely to cross the threshold.

Outputs include world summaries, all 28 social pairs, all initial and sensitivity splits, a chart, source/hash/settings metadata. No new website built.

## Canonical v1-only handoff completed — 25 November 2026

The user requested neat notebooks and everything needed by a website-building agent. The [four-notebook sequence](README.md#notebook-sequence) now covers design/audit, main outcomes, song comparisons and robustness, and website export. All 21 code cells executed successfully in fresh processes (one per notebook), with saved rich outputs and internal assertions. [Runner](run_notebooks.py) and [pinned dependencies](requirements.txt) support rerunning. The initial root notebook is retained and clearly marked historical.

Additional data findings: three all-zero download event rows, 29 user-song downloads without a recorded listen, and 36 recorded ratings without a listen. All are documented; no missing behavior invented. Every event's download indicator reconciles with the per-participant matrix and every final world vector. Listen event logs include repeat plays; de-duplicated user-song listens agree with matrices. The original supplement prints 6,626 social downloads while released data and the later documentation give 6,625; the main totals use the release.

Song analysis now uses v1 “gnaw” by silverfox (ID 306121) as an explicitly post-hoc illustration of the widest rank span: 7th to 45th, with all songs available for exploration. HHI/CV corroborate the inequality direction. Figure 3-style share/rank comparisons and descriptive cubic fits are supplied. Rating/download associations are descriptive, not causal effects on liking. Participant-prefix stability curves use ID order as a proxy and are explicitly not exact replications of the original S9/S10 trajectory algorithm.

The [web bundle](web-assets/manifest.json) contains aggregate JSON and CSV plus PNG/SVG figures. The daily replay spans retained download dates October 7–December 13, 2004: 68 dates plus the zero state. Recruitment officially extended to December 15. Replay is of retained download records, not participant arrivals or exact counters shown at the time. No raw participant records, demographics or MP3s are in the web assets. The audio archive remains local; public redistribution terms were not established and audio is not required by the handoff.

[Website handoff](WEBSITE_HANDOFF.md) includes narrative, interaction behavior, sources, schema, numerical claims, discrepancy disclosure and acceptance checks. The website README links to it, but no site code, deployment or publication changed.
