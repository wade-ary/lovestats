# Music Lab v1 — replication and website preparation

**Current scope, 25 November 2026:** use only the original Music Lab experiment **v1** as a standalone lovestats page. The learning focus is experimental design and causal reasoning. This reproduces the first experiment's main analyses, not every result across the entire paper. No page has been built or published here.

Start with the [website handoff](WEBSITE_HANDOFF.md) if building the page. Read the [inspection record](inspection.md) for data provenance and the history of decisions. The supplied [README.txt](README.txt) and [data_release.pdf](data_release.pdf) are original reference material and remain unchanged.

## Notebook sequence

| Notebook | Purpose and outputs |
| --- | --- |
| [01 · Design and data audit](notebooks/01_design_and_data_audit.ipynb) | Causal question, assignment, participant counts, all matrix/event checks, data anomalies and descriptive totals. |
| [02 · Main outcomes](notebooks/02_main_outcomes.ipynb) | Gini, unpredictability, 1,000 random control splits, comparison distributions and a 10,000-split sensitivity check. |
| [03 · Songs and history](notebooks/03_song_outcomes_and_history.ipynb) | Independent demand versus social success, rank/share scatterplots, HHI/CV robustness, rating associations, recorded download replay and explicitly reconstructed prefix curves. |
| [04 · Website export](notebooks/04_website_export.ipynb) | Validated aggregate JSON/CSV, static PNG/SVG figures, representative control partitions and checksummed asset manifest. |

All four have been executed, with text, tables and plots saved in their cells. Each starts with its own imports and reads saved inputs; run in numbered order. Notebook 02 can run independently, but 03 and 04 expect the earlier saved outputs. Code cells contain assertions and stop on a mismatch.

The root-level [first-run notebook](01_v1_inequality_and_unpredictability.ipynb) is retained for history. Use the numbered `notebooks/` sequence for current work; do not maintain two implementations.

## Rerun

Use Python 3.11 with [requirements.txt](requirements.txt). From this experiment folder:

```sh
python -m pip install -r requirements.txt
python run_notebooks.py
```

The runner executes each notebook in a fresh IPython process and captures rich outputs without requiring Jupyter kernel sockets. It runs every code cell, validates the resulting notebooks and stops at the first error. Alternatively, use a Jupyter Python kernel with these dependencies and run each notebook from top to bottom in order.

Rerunning overwrites derived files in `outputs/v1-reproduction/`, `web-assets/`, and notebook cell outputs. It does not edit either input ZIP, the supplied README/PDF or the current website. Statistical seeds are fixed. Preserve the documented settings if checking this reproduction; changing seeds or split counts requires reviewing hard-coded result commentary and the handoff, not just replacing the charts.

## Results ready for the page

| Quantity | Independent baseline | Social worlds |
| --- | ---: | ---: |
| Mean Gini | 0.257781 | 0.340224 |
| Mean absolute song-share difference across histories | 0.004917 share units | 0.008210 share units |
| Same difference in percentage points | 0.491701 | 0.821033 |

Social unpredictability is about **1.67×** the baseline. All eight social Ginis exceed the independent split mean. HHI and CV support the same concentration direction. The full independent group's Gini differs from the split mean; use the correct baseline for each chart.

**Numerical discrepancy:** the initial Gini comparison fraction is 0.01075. The longer 10,000-split run gives 0.012225 (720-person half) or 0.012675 (721-person half), so our implementation does **not** reproduce the paper's reported `< .01` inequality threshold. The unpredictability fraction is 0.003721 in the longer run, consistent with `< .01`. These fractions implement the authors' described split comparison, not a conventional t-test or null-randomization p-value. The cause of the discrepancy is unresolved; no seed searching was used to cross a threshold.

## Reproduction coverage

| Original analysis | Status |
| --- | --- |
| Main Figure 1A: v1 inequality | Reproduced from released records; direction agrees, reported threshold discrepancy retained. |
| Main Figure 2A: v1 unpredictability | Reproduced from released records; direction and reported threshold agree. |
| Main Figure 3A/B: independent demand versus social shares/ranks | Recomputed with descriptive cubic curves. Competition ranks are an explicit convention because original tie handling is unspecified. |
| Alternative concentration measures | HHI and population CV reproduced; same directional conclusion. |
| Supplement Table S2 / data-release descriptives | Counts recomputed, with the printed 6,626 versus released 6,625 social-download discrepancy documented. |
| Supplement S8 ratings/downloads | Descriptive relationship reconstructed; missing-listen discrepancies and conditioning are explicit. |
| Supplement S9/S10 trajectories | Comparable participant-prefix stability checks, **not exact replication**: user-ID order is a proxy and original trajectory code is unavailable. |
| Calendar-day recorded replay | Additional visualization of retained downloads, not an original figure or original screen-counter reconstruction. |
| Other experiment versions, unobserved exclusions, original random seeds | Outside scope or unavailable. |

## Files to hand to the website builder

- [WEBSITE_HANDOFF.md](WEBSITE_HANDOFF.md): narrative, interactions, exact data contract and acceptance checks.
- [web-assets/v1.json](web-assets/v1.json): results, worlds, songs, control splits and provenance.
- [web-assets/history.json](web-assets/history.json): validated daily cumulative counts, all nine worlds.
- [web-assets/split_examples.json](web-assets/split_examples.json): twelve saved control partitions for an optional resampling explanation.
- [web-assets/song_worlds.csv](web-assets/song_worlds.csv): readable downloadable aggregate data.
- [web-assets/manifest.json](web-assets/manifest.json): sizes and SHA-256 checksums; `figures/` holds static fallbacks.

The core three JSON datasets total about 149 KB uncompressed. Load the main file first and histories only when needed. Raw participant records and the 128 MB audio archive are not needed for the initial page.

## Sources

Salganik, M. J., Dodds, P. S., & Watts, D. J. (2006). *Experimental Study of Inequality and Unpredictability in an Artificial Cultural Market*. Science, 311, 854–856. [DOI](https://doi.org/10.1126/science.1121066) · [Paper and supplement](https://www.princeton.edu/~mjs3/salganik_dodds_watts06_full.pdf).

Data: *Success and Failure in Cultural Markets*, supplied Music Lab release; [archive DOI](https://doi.org/10.34770/y56c-ym90) · [author project page](https://www.princeton.edu/~mjs3/musiclab.shtml). Song metadata was transcribed from the supplied data-release PDF, Table 7, page 22, and checked against all 48 song IDs and MP3 filenames.

## Repository packaging

The optional `musiclab_songs.zip` audio archive (122 MiB) is retained locally and excluded from Git because it exceeds GitHub’s normal per-file limit. The analysis data ZIP, executed notebooks, outputs and website assets are included. The analysis does not require the audio archive.
