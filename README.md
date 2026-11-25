# Small statistical experiments

Started 24 November 2026. Status: ideas and planning only; nothing built or data downloaded yet.

## Purpose and feel

Build multiple small, interactive projects exploring modelling, statistics, and mathematical decision-making. Each should have a simple, relatable question, useful mathematical depth, and room to connect the concept to other real-world situations. Websites are a possible way to share the experiments.

Aryaman wants relaxed, fun, vibe-coding-style exploration, initially after a tiring set of interviews. A simple interface is welcome; superficial statistics are not the goal. Learn something new through the experiment, one concept at a time, rather than build a large product or follow a separate formal course.

Prefer real observations when accessible. Clearly distinguish observed data, estimated model parameters, assumptions, and simulated results. A fresh simulation does not require a live data feed.

## Selected first project: tournament formats and luck

**Question:** How much does the tournament format affect who wins, and which format identifies the strongest team most reliably for the number of matches played?

Start with football national teams and a fixed field of roughly eight teams. National teams were selected as a manageable experimental setting; no particular teams, rating date, or competition have been chosen. This is a comparison of competition structures, not yet a live forecast or a full club-league project.

### Small first version

1. Give the same eight teams fixed strengths.
2. Use an explicit model to translate strength differences into match probabilities.
3. Simulate matches, standings, and a champion under each format.
4. Repeat thousands of times (10,000 was an illustrative starting count).
5. Compare title probabilities, strongest-team win rate, and matches required.

Begin with two formats, provisionally single-elimination knockout and a single round-robin league. Groups followed by knockouts can follow. For eight teams, knockout requires seven matches; a single round-robin requires 28. Make that evidence-budget difference visible rather than attributing every improvement to format alone.

Possible interface: choose teams and format, run simulations, watch a bracket or table, and compare championship-probability charts. Later controls could change seeding, strength gaps, or uncertainty. Keep the first build small.

### Data and modelling progression

- **Initial ratings:** a dated snapshot of official FIFA national-team rating points is a candidate, not a confirmed acquired source. Use points rather than ranking positions to preserve strength-gap information. Aryaman mentioned “FIFA World Cup ratings”; the discussion proceeded with official national-team ratings, but the precise source still needs confirming. Do not confuse these with EA/FIFA game ratings.
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
- Choose the rating source/date, teams, first two formats, and match model before implementation. No billing or deployment has been set up.

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
