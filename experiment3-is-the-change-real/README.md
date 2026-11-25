# Experiment 3 · Is the change real?

Started 25 November 2026. Compact, one-comparison-at-a-time reviews of mainstream hypothesis tests: question, assumptions, fair alternative, simulation, metrics, and interpretation. Aryaman reviews each test as we go; explanations should remain short enough to support a reel.

## First comparison: Student’s versus Welch’s

[Executed notebook](01_student_vs_welch.ipynb) · [Metrics](outputs/01-student-vs-welch/metrics.csv) · [Chart](outputs/01-student-vs-welch/false_positive_rates.png)

Simulated independent normal delivery times, both population means 60 minutes:

- Baseline: n = 50/50, population SD = 5/5 minutes.
- Unequal variability: n = 20/100, population SD = 15/5 minutes.

Both tests use the same samples within each of 20,000 repetitions per scenario, two-sided alpha 0.05. Primary metric: false-positive rate with a 95% Wilson Monte Carlo interval. Supporting metrics: estimated versus true standard error and confidence-interval coverage. Fixed seeds and package versions are saved in `outputs/01-student-vs-welch/settings.json`; outputs are replaced on rerun.

**Key distinction:** Student’s assumes equal population variances; Welch’s allows unequal variances. Unequal sample sizes amplify the problem when the smaller group is noisier. These scenarios change both spread and size; they do not isolate variance alone. Normality and independence stay fixed. No power comparison or claim about actual deliveries is made.

Run the notebook from this folder with the dependencies in `requirements.txt`. All code cells have been executed sequentially and their outputs embedded using IPython; numeric consistency checks passed.

## Second comparison: paired before/after

[Executed notebook](02_paired_before_after.ipynb) · [Metrics](outputs/02-paired-before-after/metrics.csv) · [Chart](outputs/02-paired-before-after/power_and_false_positives.png)

Thirty people measured twice; baseline SD 2 versus 15 minutes, independent measurement noise SD 5 at each occasion. True change −3 minutes for power, zero for false positives; 20,000 repetitions per setting. Only baseline spread changes. Common random draws preserve identical paired differences across scenarios. Known pairs are compared with deliberately ignoring them using Welch’s independent test; the latter is not an appropriate independent-data analysis of this design.

Paired power was **61.435%** in both scenarios, versus **56.875%** and **0.060%** when ignoring pairs. Paired false positives were **4.995%**, versus **3.330%** and **0.000%** when ignoring pairs. Zero observed is not proof of zero risk; Wilson intervals are saved. Baseline offsets cancel in individual differences, so pairing preserves sensitivity as baseline spread increases. This illustrates positive within-person correlation, not universal superiority or causal evidence.

Includes matched-line and individual-change plots, metrics, saved settings and trials, concise assumptions, and a website presentation brief. All cells ran sequentially with outputs embedded; paired-test equivalence to a one-sample test of differences and common-draw consistency checks passed. Outputs overwrite on rerun.

## Third comparison: skew, means and ranks

[Executed notebook](03_skew_means_and_ranks.ipynb) · [Metrics](outputs/03-skew-means-and-ranks/metrics.csv) · [Population effects](outputs/03-skew-means-and-ranks/population_truth.csv)

**Selected insight:** ranks reduce the influence of extreme magnitudes and reveal the tendency for one random observation to outrank another; means retain the dollar impact of large purchases. Neither is the uniquely true difference. Two simulated independent spending scenarios have exactly the same 40% population mean lift: a broad ×1.4 shift, or a random 5% of purchases multiplied by 9. A is lognormal with median $30 and log-SD 1. The corresponding probabilities that B outspends A are **59.403%** and **52.199%**.

At n=100 per group over 20,000 repetitions, Welch/Mann–Whitney rejection rates are **47.015%/63.815%** for the broad shift and **15.730%/8.310%** for rare big spenders. Identical-distribution null rates are **4.310%/5.070%**; Welch is somewhat conservative here. Different alternatives produce different uncertainty as well as rank effects, so rejection rates are supporting evidence, not a universal test ranking.

The standard Mann–Whitney null is identical distributions; it is not generally a median test or a test calibrated for every unequal-shape distribution with P(B>A)=0.5. The notebook distinguishes this from interpreting U as a rank effect. Includes population distribution curves, effect comparison, simulation chart, assumptions, limitations, website presentation brief and saved settings. All code cells executed with outputs embedded; equal mean lifts and U orientation were checked. Output files overwrite on rerun.

## Fourth comparison: ANOVA and multiple comparisons

[Executed notebook](04_anova_and_multiple_comparisons.ipynb) · [False-alarm metrics](outputs/04-anova-and-multiple-comparisons/null_metrics.csv) · [Power metrics](outputs/04-anova-and-multiple-comparisons/power_metrics.csv)

Two selected insights: repeated pairwise testing increases family-wise false alarms, and ANOVA compares between-group mean separation against within-group variation. Independent normal groups, equal population variances, n=30 per group, alpha 0.05, and 20,000 repetitions per setting.

With three equal-mean groups, at least one false rejection occurred in **11.975%** of uncorrected pairwise-test experiments, **4.280%** with Bonferroni, and **4.850%** with one omnibus ANOVA. Increasing to 10 groups (45 pairs) raised uncorrected risk to **63.120%**. Tests sharing groups are dependent; the independent-tests formula is labelled only as a reference.

With population means 60/60/63, ANOVA power was **98.110%** at within-group SD 3 and **20.375%** at SD 10. Illustrative dot plots hold sample means fixed by centring residuals; actual simulation samples are not centred. ANOVA asks whether all means are equal, not which pairs differ or whether variances are equal. Follow-up comparisons require appropriate correction.

All cells executed with outputs embedded. F-test and pairwise calculations were checked against SciPy. Saved settings, Monte Carlo intervals, trial data, visuals and a website brief are included. The requested comparison-count slider is documented for future website work, with saved data for 2–10 groups (1–45 pairs); a separate 1–100 independent-test reference is also saved. No slider or website was implemented, following the instruction to create and run the notebook only.

## Fifth comparison: chi-square and Fisher’s exact

[Executed notebook](05_chi_square_and_fisher.ipynb) · [Metrics](outputs/05-chi-square-and-fisher/metrics.csv) · [Diagnostics](outputs/05-chi-square-and-fisher/diagnostics.csv)

Introductory independent 2×2 categorical comparison only. Selected insight: expected cell counts matter, not just total sample size. Explains Pearson’s observed/expected discrepancy, the chi-square approximation, and Fisher’s fixed-margin exact conditional calculation. No paired categorical work or larger-table exact testing was started.

20,000 null experiments per scenario: plentiful counts use n=500/500 and shared conversion probability 0.30; sparse counts use n=20/100 and probability 0.02. Pearson/Fisher false-positive rates were **4.945%/4.190%** for plentiful counts and **6.180%/1.245%** for sparse counts. Yates-corrected chi-square is shown transparently as an additional series (**4.185%/1.245%**); Pearson explicitly disables the software’s default continuity correction. Fisher is conservative here, not exactly calibrated to 5%. Sparse chi-square distortion need not always be upward; these two settings are illustrative, not a universal ranking.

In **9.06%** of sparse experiments neither group converted: chi-square is undefined for a zero column. These experiments remain in the denominator as no rejection, with undefined p-values preserved; Fisher returns p=1. This handling and expected-count diagnostics are documented. All cells executed with saved plots, metrics, settings and website brief. Checks reproduce Pearson’s statistic from its definition and Fisher’s two-sided p-value by hypergeometric enumeration. Output files overwrite on rerun.

## Agreed series direction (later work, not yet implemented)

Review one test and a fair comparison at a time: Wilcoxon signed-rank; Welch’s ANOVA (unequal-variance extension); Kruskal–Wallis; proportions and, only when requested later, McNemar; permutation tests. Repeated-measures ANOVA/Friedman and post-hoc tests can follow. Distinguish rank/distribution questions from mean differences; skew alone does not select Mann–Whitney.

The fourth notebook begins the multiple-comparison layer with complete-null false-alarm simulations and Bonferroni. Further planned work: probability of at least one false positive as comparisons grow, Bonferroni/Holm, Benjamini–Hochberg and false discovery rate, post-hoc comparisons, and repeated peeking. Under independent true nulls, P(at least one false positive) = 1 − (1 − alpha)^m. This is not the probability that an individual significant finding is false.

[Back to experiments](../README.md)
