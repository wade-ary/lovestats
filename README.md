# Small statistical experiments

Started 24 November 2026. Updated 25 November: initial data snapshot and pairwise probability notebook completed; tournament comparison notebook implemented with a 1,000-tournament batch per format setting (see below).

## Experiment 3 · Is the change real? — 25 November 2026

[Project and series plan](experiment3-is-the-change-real/README.md) · [First notebook: Student’s vs Welch’s](experiment3-is-the-change-real/01_student_vs_welch.ipynb). Compact test reviews with fair comparisons, starting with simulated equal and unequal variability. The first comparison uses 20,000 repetitions per scenario to measure false positives; multiple-testing corrections are planned as a later layer. The [second notebook](experiment3-is-the-change-real/02_paired_before_after.ipynb) now demonstrates how preserving before/after pairs retains power when starting levels vary, with a null false-alarm check and website presentation brief.

[Third notebook: skew, means and ranks](experiment3-is-the-change-real/03_skew_means_and_ranks.ipynb) compares a broad spending shift with rare large purchases at the same 40% mean lift, highlighting their different rank effects.

[Fourth notebook: ANOVA and multiple comparisons](experiment3-is-the-change-real/04_anova_and_multiple_comparisons.ipynb) demonstrates family-wise false alarms and within-versus-between variation; includes saved curves and a website slider brief.

[Fifth notebook: chi-square and Fisher’s exact](experiment3-is-the-change-real/05_chi_square_and_fisher.ipynb) introduces independent 2×2 tables, expected counts, sparse-count calibration and the exact-test distinction. Paired categorical work remains deferred.

## Purpose and feel

Build multiple small, interactive projects exploring modelling, statistics, and mathematical decision-making. Each should have a simple, relatable question, useful mathematical depth, and room to connect the concept to other real-world situations. Websites are a possible way to share the experiments.

Aryaman wants relaxed, fun, vibe-coding-style exploration, initially after a tiring set of interviews. A simple interface is welcome; superficial statistics are not the goal. Learn something new through the experiment, one concept at a time, rather than build a large product or follow a separate formal course.

Prefer real observations when accessible. Clearly distinguish observed data, estimated model parameters, assumptions, and simulated results. A fresh simulation does not require a live data feed.

## Selected first project: tournament formats and luck

**Question:** How much does the tournament format affect who wins, and which format identifies the strongest team most reliably for the number of matches played?

## Current decisions — 25 November 2026

Use the top **32 men’s national teams** with fixed FIFA rating points. The [25 November snapshot](data/fifa-men-top32-2026-11-25.json) contains rank, team, points and source metadata. It records the current FIFA table, whose ordering differs from the 18 November news article; this discrepancy is documented in the data file.

**Learning lens:** a tournament makes a decision from noisy evidence. **Later 25 November correction:** the primary objective is now matching all teams’ championship shares to normalised rating-based strengths; see the fairness section below. The following average-gap framing records the original objective. Compare the **average rating-point gap between the highest-rated team and the champion** (lower is better) against the match budget. Explore the fewest matches needed for an acceptably small average gap; no numerical threshold is selected. Highest-rated-team win rate can be secondary. A combined rank/rating metric was discussed but not selected.

Planned progression: repeat one format to explore randomness and Monte Carlo estimation; compare knockout, groups plus knockout and league-style formats; explore match budgets and diminishing returns. More simulated tournaments improve estimation precision; more matches within each tournament change the decision itself. Uncertain hidden strength is a later layer. The initial model now uses W/L only with the FIFA expected-result curve interpreted as a win probability (scale 600). Ratings stay fixed. Group and knockout seeding are defined in notebook 02; standings ties use random lots. Tournament simulation is implemented as described below.

For 32 teams, single elimination uses 31 matches, single round robin 496, and double round robin 992. The eight-team outline below preserves the initial 24 November sketch, superseded by these decisions where they differ.

### Small first version

1. Give the same eight teams fixed strengths.
2. Use an explicit model to translate strength differences into match probabilities.
3. Simulate matches, standings, and a champion under each format.
4. Repeat thousands of times (10,000 was an illustrative starting count).
5. Compare title probabilities, strongest-team win rate, and matches required.

Begin with two formats, provisionally single-elimination knockout and a single round-robin league. Groups followed by knockouts can follow. For eight teams, knockout requires seven matches; a single round-robin requires 28. Make that evidence-budget difference visible rather than attributing every improvement to format alone.

Possible interface: choose teams and format, run simulations, watch a bracket or table, and compare championship-probability charts. Later controls could change seeding, strength gaps, or uncertainty. Keep the first build small.

### Data and modelling progression

- **Initial ratings:** a dated snapshot of the current FIFA men’s top-32 rating points was acquired on 25 November 2026 (linked above). Use points rather than ranking positions to preserve strength-gap information. Aryaman mentioned “FIFA World Cup ratings”; the discussion proceeded with official national-team ratings, but the precise source still needs confirming. Do not confuse these with EA/FIFA game ratings.
- **Prototype:** known illustrative strengths can help isolate the format and check the simulator before fitting real data. Label them as illustrative.
- **Historical matches:** estimate and validate how strength differences relate to wins, draws, losses, or goals. [StatsBomb open data](https://github.com/hudl/open-data) is a checked candidate containing selected competitions, not universal national-team coverage. Check relevant seasons, licensing, and sufficient prior history before committing.
- **Odds-implied probabilities:** a later possible input or benchmark, adjusting for bookmaker margin. Aryaman mentioned “implied match data”; this interpretation was proposed, not confirmed as the required source. Odds are estimates, not ground truth.
- **Later models:** uncertain strengths, changing form, home advantage, fatigue, and matchup effects. These are optional extensions, not first-version requirements.

National teams play infrequently and squads change. Rating date and historical evaluation windows matter. A retrospective prediction should not use later results to estimate earlier strengths.

### Monte Carlo is the engine

For each format, sample match outcomes from the model, determine the champion, and repeat. A team's estimated title probability is its share of simulated championships.

For an estimated probability p-hat from N independent tournament simulations, the approximate Monte Carlo standard error is sqrt[p-hat(1 − p-hat)/N]. Increasing N reduces simulation noise; it does not validate the match model or repair poor data.

Start with fixed strengths and random match outcomes. Later, draw plausible strengths first and simulate tournaments conditional on them, separating uncertainty about ability from sporting randomness.

### Mathematical ideas to explore progressively

| Concept | Tournament question | Transfer beyond sport |
| --- | --- | --- |
| Latent-variable models and calibration | How do hidden strengths generate results, and do predicted probabilities match observed frequencies? | Ability from exams; quality from reviews; demand prediction. |
| Hierarchical Bayesian modelling | How should teams with little evidence borrow information from other teams? | Small stores, new products, campaign segments. |
| Uncertainty decomposition | Is an upset ordinary randomness or evidence our strength estimates were wrong? | Forecasting and deciding whether more data will help. |
| Experimental design | Which matchups reveal the most about strengths? | A/B tests, interview questions, costly experiments. |
| Best-arm identification | How can a limited match budget identify the best team? | Choosing suppliers, treatments, designs, or models. |
| Information theory | How much uncertainty does a particular matchup resolve? | Active learning and deciding what to measure next. |
| Decision theory and regret | Is selecting the second-best team as bad as selecting a much weaker team? | Decisions where the size of a mistake matters. |
| Non-transitivity and social choice | What if A tends to beat B, B beats C, and C beats A? | Group preferences, rankings, recommendations. |
| Robust optimisation | Does a preferred format still work under different plausible models? | Planning under model uncertainty. |
| Monte Carlo variance reduction | Can paired simulations estimate differences between formats more precisely? | Comparing simulated operational policies. |
| Multi-objective optimisation | How do reliability, excitement, match count, and workload trade off? | Decisions without one universally best objective. |
| Dynamic programming and optimal control | When should a trailing team switch to a riskier strategy? | Sequential decisions, inventory, effort allocation. |

These are a menu of future experiments, not a syllabus to implement all at once. The initial focus is Monte Carlo and format reliability per match budget.

### Important definitions and open choices

- “Strongest” initially means highest strength under the chosen model, not an independently established truth. With uncertain strengths, distinguish the highest estimated team from the strongest team in each simulated world.
- Decide how draws, extra time, penalties, points, and tied league standings work. A two-outcome logistic model alone does not model regulation-time football draws.
- Separate seeding/draw effects from format effects.
- Compare results across match budgets; consider expected champion strength or regret alongside strongest-team win rate.
- Initial top-32 data snapshot selected. Selected formats and match model are implemented in notebook 02. No billing or deployment has been set up.

## Ideas bank

### Selected second project: Music Lab v1

**Current scope:** the original first Music Lab experiment only, as a standalone causal-design story. The four original source experiments remain preserved, but v2–v4 are excluded from the page.

[Experiment README and notebook sequence](experiment2-woulld%20song%20be%20a%20hit%20in%208%20worlds/README.md) · [Website build handoff](experiment2-woulld%20song%20be%20a%20hit%20in%208%20worlds/WEBSITE_HANDOFF.md) · [Inspection record](experiment2-woulld%20song%20be%20a%20hit%20in%208%20worlds/inspection.md).

Four executed notebooks cover design/data checks, main outcomes, song-level comparisons and robustness, observed download history and validated web exports. Ready-to-copy aggregate JSON/CSV and PNG/SVG figures live in the experiment's `web-assets/`. Main inequality/unpredictability directions reproduce; the reported < .01 inequality comparison threshold does not reproduce in our longer run (0.012225), while unpredictability does (0.003721). These are the authors' split-comparison fractions, not conventional null-randomization p-values. Original trajectory reconstruction is explicitly limited. The handoff includes the full interpretation and acceptance criteria; no second website page is built or published yet.

### Causal inference brainstorm — 25 November 2026

After the relaxed first experiment, “Does the best team win?”, Aryaman wants a fun causal-inference project with a catchy, reel-style question. Real data would be welcome; this is brainstorming only, with no second project selected.

**Requested idea: do hotels just above a cutoff get a boost?** Aryaman recalls an example where treatment is assigned by a threshold, perhaps hotels above a score receiving a platform boost. The likely method is **regression discontinuity**: compare observations narrowly below and above the assignment cutoff. The exact example, platform, cutoff, and meaning of “boost” are unknown. Do not treat a hypothetical platform rule as established. Need the assignment score, actual treatment rule, and an outcome such as visibility or bookings; ratings alone are insufficient. A causal interpretation requires other determinants of the outcome to vary smoothly across the cutoff and no precise sorting that undermines comparability. The effect is local to the cutoff.

Assistant-proposed options, not selected:

**Follow-up direction:** Find an existing study with real data, cite it, and present it in a fun way to learn the causal design, assumptions, and outcomes the researchers cared about. Study selection and brainstorming come before building; a public paper alone is insufficient without usable data.

**Promising new candidate — Music Lab:** “Would the same song become a hit in eight parallel worlds?” Salganik, Dodds and Watts (2006), *Experimental Study of Inequality and Unpredictability in an Artificial Cultural Market*, [paper record](https://pubmed.ncbi.nlm.nih.gov/16469928/), [author project page](https://www.princeton.edu/~mjs3/musiclab.shtml). Random assignment to independent choice versus seeing previous downloads, with eight separate social-influence worlds; the 2006 paper reports 14,341 participants. Researchers studied concentration of success and its unpredictability, not merely whether an individual likes a song. The [author's data page](https://www.princeton.edu/~mjs3/data.shtml) describes a public anonymized release of 167 CSVs across four experiments (27,267 participants total; do not confuse this with the 2006 sample). Current [Princeton archive record](https://datacommons.princeton.edu/discovery/catalog/doi-10-34770-y56c-ym90) was located, but browser access hit a connection-verification page; no files downloaded or inspected yet. Proposed display: follow the same song across observed worlds and compare markets with/without popularity information. Learning questions: random assignment, dependence within worlds, isolation between worlds, exclusions/attrition, operational meaning of quality, and generalization beyond this experimental market. This is a randomized experiment, not a cutoff design. Initially a candidate; subsequently selected as the second project, with data supplied locally and v1 reproduced as linked above. Yelp and early-upvote study data remain unverified.

- **Can half a star fill a restaurant?** Displayed rating thresholds and reservation demand; closely related to the hotel idea. [Anderson–Magruder study](https://www.ocf.berkeley.edu/~jmagruder/Anderson%20and%20Magruder.pdf). Public replication-data availability not yet verified.
- **Do fans help their team win—or influence the referee?** Crowdless football as a natural-experiment setting. [Benz–Lopez data and code](https://github.com/lbenz730/soccer_ha_covid). Pandemic-era changes complicate attributing a before/after difference to fans alone; referee-outcome coverage needs checking.
- **Can one early like make a comment popular?** Randomized initial votes and social influence. [Original experiment](https://snap.stanford.edu/class/cs224w-readings/muchnik13bias.pdf). Public raw data not verified; a small consenting-participant experiment is another possible route.
- **Does turning 21 change drinking overnight?** Age-cutoff regression discontinuity, with drinking and harm outcomes kept distinct. [Mixtape chapter](https://mixtape.scunning.com/06-regression_discontinuity); [CausalPy real-study mortality-data example](https://causalpy.readthedocs.io/en/latest/notebooks/rd_pymc_drinking.html). Accessible teaching data, but a less lighthearted topic.

### Other ideas retained for later

These are parked interests, not active assignments:

- **Favourite dish versus trying something new:** exploration versus exploitation; information has more value when there will be future visits.
- **Buy event tickets now or wait:** price uncertainty, sell-out risk, and personal disappointment costs. Historical price access remains unresolved.
- **Where to stand in a crowd:** tradeoffs among sound, view, space, friends, and movement; no data source selected.
- **Taxi travel-time allowance:** choose a route/time and acceptable lateness risk; use empirical travel-time distributions and quantiles. [NYC TLC trip data](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) is a candidate source.
- **Bus waiting and the inspection paradox:** random arrivals encounter long gaps more often; average wait depends on both mean and variance of headways. Requires actual arrival observations to study bunching, not just timetables.
- **Job-search decisions:** use personal application/interview/outcome dates for Bayesian conversion estimates, pending-response censoring, and simulated timelines. Strategy effects such as preparation versus application volume cannot be inferred causally from sparse personal history alone. Do not revive the archived application tracker automatically.
- **Voting and group happiness:** collect real preferences, compare voting rules, and explore majority cycles, strategic voting, and competing definitions of fairness. [PrefLib](https://preflib.org/) provides candidate demo preference datasets. Rankings do not establish interpersonal satisfaction scores.

## Ideas explored but not selected

- **Restaurant comparisons:** personally compelling, but standard Google Places and Yelp access did not provide complete per-star counts. Average and review count alone do not determine a rating distribution. Backed off rather than disguise assumptions as observed uncertainty. Revisit only if a suitable distribution-data source becomes available.
- **Birthday collisions:** simple implementation and a connection to concentration, but Aryaman wanted more depth than the proposed unequal-birthday-distribution extension.

## How to record future experiments

For each small experiment, retain the question, data provenance, assumptions, mathematical concept, implementation, observations, limitations, and the connection to another real-world decision. Distinguish planned ideas from completed learning. Add separate experiment notes here as needed and link them from this page.

[Back to practice](../README.md) · [Statistics learning record](../statistics.md)

## Pairwise probability notebook

[Notebook](notebooks/01_pairwise_win_loss.ipynb) · [Saved table (496 matchups)](data/pairwise-win-loss-2026-11-25.csv)

Uses a draw-free logistic model with scale 600 and the fixed FIFA snapshot. Each row gives both teams, ranks, ratings, their rating difference, P(A wins), P(A loses) = P(B wins), scale and snapshot date. Probabilities are model assumptions derived from ratings, not observed frequencies. The notebook explains the relative-weight formula and Bernoulli connection and saves the table when run. Python code cells were executed sequentially and the exported table checked. Tournament simulations are now handled separately in notebook 02.

## Tournament format experiments — 25 November 2026

[Notebook 02](notebooks/02_tournament_formats.ipynb) defines the experiments, explains the rules and saves [per-tournament results](outputs/tournament-comparison/tournament_results.csv), a [format summary](outputs/tournament-comparison/format_summary.csv), and [run settings/source metadata](outputs/tournament-comparison/settings.json). Outputs are replaced on rerun unless the output directory is changed.

Selected formats: random and fully seeded knockout cup; traditional 32-team World Cup with FIFA-seeded pots; 32-team double round-robin league; that league followed by best-of-seven playoffs; and standalone Swiss-style standings. The notebook uses the top 16 league teams for playoffs as an explicit implementation choice. Swiss round counts are editable in the first settings cell (initially 5, 7 and 9). The current batch uses 1,000 tournaments per setting, replacing the initial 200-tournament outputs at Aryaman’s request.

Original outcome (now secondary): mean rating gap of the champion, considered alongside matches used. Secondary summaries include champion rank and highest-rated-team win rate. Monte Carlo standard errors quantify estimation noise, not uncertainty about whether FIFA ratings are true strengths. More tournament repetitions improve estimation; more matches within a tournament change the selection process. No acceptable-gap target or optimal format has been established.

Swiss pairs all teams each round to minimise total current-win differences, with random pairing tie-breaks and no repeat opponents. Final standings ties use random lots, as do group and league ties; this avoids using FIFA strength to break ties in favour of the benchmark. This is an educational Swiss variant, not official federation rules. Very high round counts can exhaust feasible rematch-free pairings; the notebook explicitly raises an error rather than relaxing the rule.

Learning recorded: Aryaman correctly connected the rating formula to relative weights and the scale parameter, distinguished the probability from the Bernoulli outcome draw, and identified increased evidence as the reason to expect a round robin to select more reliably. Unique matchups number 32 × 31 / 2 = 496. The same league season is reused for its playoff extension so their rating-gap difference can be examined as a paired comparison. All format results remain conditional on the simplified W/L model, fixed strengths, neutral venues and specified tie-breaks.

Estimation uncertainty discussion: distinguished the SD of individual tournament rating gaps from the Monte Carlo SE of their mean (SD / sqrt(number of tournaments)). Approximate confidence intervals describe the model-conditional long-run average gap, not individual tournament outcomes or match-model validity. Aryaman confirmed the distinction and selected batches of 1,000 tournaments.

## lovestats local website — 25 November 2026

The [website](website/index.html) presents an experiments gallery and interactive tournament exploration. It includes fresh random/seeded knockout demos and a selectable chart of all eight saved configurations. [Run and refresh instructions](website/README.md). Source notebooks and original data remain unchanged; website copies are prepared with `python3 website/prepare_data.py`. This first pass is local-only; no publication or push.

## Revised objective: championship fairness — 25 November 2026

Aryaman wants weaker teams to retain championship chances relative to their rating-based strengths, not a format that always crowns Spain. The accepted benchmark is q_i = w_i / sum(w), with w_i = 10 ** ((R_i - max(R)) / 600). This is a chosen fairness preference, not an official FIFA championship forecast or a consequence forced by the match model. Rankings alone and a top-four title share were discussed but not selected as the primary score.

[Notebook 02](notebooks/02_tournament_formats.ipynb) now compares simulated championship probabilities for all 32 teams against this target. Primary metric: total variation distance, 0.5 × sum(abs(observed share − target share)). Lower means closer to the chosen target. Multiplying TV by 100 gives the percentage points of probability that would need reallocating, not percentage accuracy or relative error. The original average champion rating gap stays secondary. Match budget remains a constraint; use maximum possible matches for a hard limit.

New outputs: [all-team championship shares](outputs/tournament-comparison/championship_shares.csv), with target/observed shares, signed differences and individual Wilson intervals; and [fairness comparison](outputs/tournament-comparison/fairness_summary.csv), with TV and theoretical maximum match budgets. These reuse the existing 1,000 tournaments per setting. Zero titles do not establish zero probability. Finite samples create a positive TV noise floor; the notebook includes a reference simulation from the exact target, explicitly not a confidence interval for each format’s TV.

Website direction agreed: five demo format families (knockout with seeded/random choice; World Cup; league; league plus best-of-seven playoffs; Swiss with adjustable rounds). Visitors can run one demo separately from saved batch results. For analysis, show all teams’ target and simulated championship shares side by side, using the revised fairness objective. Website implementation is being handled separately; this notebook update does not alter website files.
