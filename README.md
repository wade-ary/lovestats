# Small statistical experiments

Started 24 November 2026. Updated 25 November: initial data snapshot and pairwise probability notebook completed; tournament comparison notebook implemented with a 1,000-tournament batch per format setting (see below).

## Purpose and feel

Build multiple small, interactive projects exploring modelling, statistics, and mathematical decision-making. Each should have a simple, relatable question, useful mathematical depth, and room to connect the concept to other real-world situations. Websites are a possible way to share the experiments.

Aryaman wants relaxed, fun, vibe-coding-style exploration, initially after a tiring set of interviews. A simple interface is welcome; superficial statistics are not the goal. Learn something new through the experiment, one concept at a time, rather than build a large product or follow a separate formal course.

Prefer real observations when accessible. Clearly distinguish observed data, estimated model parameters, assumptions, and simulated results. A fresh simulation does not require a live data feed.

## Selected first project: tournament formats and luck

**Question:** How much does the tournament format affect who wins, and which format identifies the strongest team most reliably for the number of matches played?

## Current decisions — 25 November 2026

Use the top **32 men’s national teams** with fixed FIFA rating points. The [25 November snapshot](data/fifa-men-top32-2026-11-25.json) contains rank, team, points and source metadata. It records the current FIFA table, whose ordering differs from the 18 November news article; this discrepancy is documented in the data file.

**Learning lens:** a tournament makes a decision from noisy evidence. Compare the **average rating-point gap between the highest-rated team and the champion** (lower is better) against the match budget. Explore the fewest matches needed for an acceptably small average gap; no numerical threshold is selected. Highest-rated-team win rate can be secondary. A combined rank/rating metric was discussed but not selected.

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

## Other ideas retained for later

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

Primary outcome: mean rating gap of the champion, considered alongside matches used. Secondary summaries include champion rank and highest-rated-team win rate. Monte Carlo standard errors quantify estimation noise, not uncertainty about whether FIFA ratings are true strengths. More tournament repetitions improve estimation; more matches within a tournament change the selection process. No acceptable-gap target or optimal format has been established.

Swiss pairs all teams each round to minimise total current-win differences, with random pairing tie-breaks and no repeat opponents. Final standings ties use random lots, as do group and league ties; this avoids using FIFA strength to break ties in favour of the benchmark. This is an educational Swiss variant, not official federation rules. Very high round counts can exhaust feasible rematch-free pairings; the notebook explicitly raises an error rather than relaxing the rule.

Learning recorded: Aryaman correctly connected the rating formula to relative weights and the scale parameter, distinguished the probability from the Bernoulli outcome draw, and identified increased evidence as the reason to expect a round robin to select more reliably. Unique matchups number 32 × 31 / 2 = 496. The same league season is reused for its playoff extension so their rating-gap difference can be examined as a paired comparison. All format results remain conditional on the simplified W/L model, fixed strengths, neutral venues and specified tie-breaks.

Estimation uncertainty discussion: distinguished the SD of individual tournament rating gaps from the Monte Carlo SE of their mean (SD / sqrt(number of tournaments)). Approximate confidence intervals describe the model-conditional long-run average gap, not individual tournament outcomes or match-model validity. Aryaman confirmed the distinction and selected batches of 1,000 tournaments.
