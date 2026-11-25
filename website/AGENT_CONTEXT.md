# lovestats — context for website agents

Start here when changing the website. This folder is the **UI/UX and presentation layer** for lovestats: a connected collection of playful statistical experiments that people can explore and understand. The work is about how the experiments are introduced, displayed, navigated, and connected—not automatically about developing new statistical analyses.

Read the relevant section of [README.md](README.md) for implementation details, data contracts, refresh commands, and previous checks. Read only the notebook or research notes needed for the experiment you are changing. Current user instructions govern; older handoffs are context, not a backlog to execute.

## What we are trying to build

Make the experiments feel like parts of one website, with a recognizable identity and easy routes between the gallery and individual explorations. Each page should help a visitor understand the question, interact with the evidence, and interpret what happened.

- Lead with a concrete question and enough background to make it meaningful.
- Give each interaction a purpose: comparing, inspecting, revealing, or following a process. Avoid adding controls just because they are possible.
- Connect the narrative, visualization, selection controls, and exact values. They should describe the same state.
- Let the main finding be readable without opening every methodological detail. Keep deeper assumptions and provenance available nearby.
- Make connections between experiments when they help the visitor, while preserving their different questions and evidence. A shared theme does not make their metrics interchangeable.
- Treat series navigation as real content: next-letter is Part 1, with a question for Part 2. Do not create placeholder experiments or imply an unbuilt next chapter is available.

This direction guides requested work; it does not authorize a broad redesign, new analysis, or new features on every turn.

## Visual direction and recent decisions

Aryaman liked the original UI/UX. Extend its editorial, playful feel rather than replacing the design system. Use the existing mint/off-white background, deep green, lime, and purple; Space Grotesk headings, DM Sans body text, and occasional italic Georgia. Shared tokens live in [style.css](style.css).

The homepage is deliberately compact:

- One left-aligned lowercase **lovestats** wordmark and asterisk, aligned with the cards. Current size is 34px desktop / 30px mobile, not an oversized hero logo.
- Empty space to the right; one thin divider above **The experiments**.
- No hero headline or graphic, header tagline, duplicate experiments link, section subtitle, or closing slogans. Earlier “Same world. Different outcomes.” and branching artwork were explicitly removed.
- Cards retain their illustrations, small top-left artwork labels, titles, descriptions, and links. No category pills or captions along the bottom of the artwork. Do not restore “is it real?” inside the first illustration.

Prefer clear spacing and readable visuals over decorative clutter or dashboard-style density. Keep the current card artwork unless asked to change it. Homepage layout changes belong in [home.css](home.css); avoid spilling them into experiment pages.

## The four experiments

Gallery order is intentional and differs from experiment numbering.

| Gallery position | Page and purpose | Key presentation boundary |
| --- | --- | --- |
| 1 | [Is the change real?](change.html), experiment 3 | One experiment with five subsections. Each has “The situation” and “What we want to show,” followed by evidence and interpretation. Controls explore saved teaching simulations. |
| 2 | [One trophy. Whose chance?](tournament.html), football | Main question is alignment of championship chances with chosen rating-based strength shares. Show all 32 teams, target versus simulated share, uncertainty, and match costs. |
| 3 | [One song. Eight worlds. The same hit?](musiclab.html), Music Lab v1 | Explain a real randomized study and its limits. Keep the “How did the downloads add up?” replay section removed; broader changes need current direction. |
| 4 | [One letter. Where next?](next-letter.html), sequence prediction Part 1 | Fixed letters, animated paths from exported frames, convergence at E/R, then outgoing-distribution exploration. Longer-memory models and LLM interaction are deferred. |

Preserve the current card links: **Explore the five parts**, **Let’s find out**, **Meet the parallel worlds**, and **Follow the letters**.

## Presentation must preserve the analysis

Use exported data; do not invent results, smooth away awkward findings, or hardcode new numerical claims. Read the relevant notebook when interpreting a measure or changing the story. Website copies live under `data/`; originals live outside this folder. Use the relevant preparation script when refreshing them, without rerunning research notebooks merely for a UI change.

Important distinctions to retain:

- **Football:** primary score is `100 × TV`, labelled **Probability to reallocate**, in percentage points. Lower means closer to the chosen benchmark, not “accuracy” or universal sporting fairness. Champion rating gap is secondary. Fresh demos are separate from saved batches; saved Swiss results exist only for 5/7/9 rounds. Small estimated TV differences are not decisive. Hard budgets use `max_possible_matches`.
- **Change:** these are simulated teaching cases, not real-world treatment evidence. Preserve the difference between false-positive rates, power, effect measures, and Monte Carlo uncertainty.
- **Music Lab:** social influence, appeal, inequality, and unpredictability have distinct meanings. Preserve the replication caveat and the difference between split-comparison fractions and conventional p-values.
- **Letters:** greedy strongest-link choice is deterministic, not sampling from a distribution. The animation uses exported positions and counts all 26 starting paths after merging. Hover temporarily previews another letter; leaving restores the pin. Click/tap toggles the pin. Dropdown, graph, and all-26-destination table share selection. Include observed self-loops; zero-count destinations remain in the table. Node layout carries no statistical meaning.

The detailed statistical contracts and sources in [README.md](README.md) remain the reference; this file is a navigation guide, not a replacement research record.

## Where to edit

| Area | Files |
| --- | --- |
| Gallery / shared design | `index.html`, `home.css`, `style.css` |
| Football | `tournament.html`, `football.css`, `app.js`, `formats.js`, `simulation.js` |
| Change | `change.html`, `change.css`, `change.js` |
| Music Lab | `musiclab.html`, `musiclab.css`, `musiclab.js`, `musiclab-data.js` |
| Next letter | `next-letter.html`, `next-letter.css`, `next-letter.js` |
| Saved website data | `data/`; generated/copied by `prepare_data.py`, `prepare_change.py`, `prepare_musiclab.py`, `prepare_next_letter.py` |

Some page styles also supply homepage artwork. Inspect stylesheet imports and selector scope before changing shared styles. Prefer the existing static HTML/CSS/JavaScript architecture; there is no bundler, backend, account system, or installed runtime dependency to set up.

## Working and checking

1. Read the current page and relevant README section before editing. Preserve unrelated user changes and other experiments.
2. Implement the requested UI/UX change within its scope. Routine reversible choices do not need repeated approval; clarify only consequential ambiguity.
3. Reuse the local preview if running. From the project root, start it with `python3 -m http.server 4173 --bind 127.0.0.1 --directory website`. Open `http://127.0.0.1:4173/`. The server must remain running; it is not permanent hosting. Use HTTP, not `file://`.
4. Check the affected user flow, not just syntax. For layout changes, inspect desktop and phone widths. Keep graph/table overflow inside their containers, text readable, focus visible, touch controls usable, and reduced-motion behavior intact. Where hover adds information, provide a click/tap or keyboard route too.
5. Run relevant data or simulation checks when changing that behavior; commands are in the README. Do not rerun every research experiment for a styling change. Report any verification limitation honestly.
6. Update this file when shared product direction changes. Update README implementation notes when architecture, interactions, data handling, or validation changes. Revise current sections rather than accumulating conflicting handoffs.

**Deployment boundary:** work is local-only unless Aryaman changes that instruction. Do not push or publish by default. Relative links should remain compatible with eventual `/lovestats/` hosting. No publishing configuration has been added.
