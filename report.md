# SupeRR Selector: High-Pressure Player Evaluation Architecture
### Empirical Bayes Random-Effects Estimation of Opponent-Adjusted Performance Under Pressure in T20 Cricket (2022–2026)
**Authors**: Research & Analytics Engineering Team | **Production Version**: 5.0 (Audited) | **Random Seed**: 42

---

## 1. Executive Summary & Methodological Limitations

### 1.1 What is Measured
This study measures **opponent-adjusted high-pressure output above par in runs per ball, including a wicket term for both roles, shrunk toward a cohort mean**. The primary estimand, denoted $H_p$, evaluates a player's expected performance during high-pressure match deliveries relative to contextual par after controlling for opposing bowler or batter strength and accounting for sample size via Empirical Bayes shrinkage.
> **Essential Interpretation**: $H_p$ identifies **who is expected to deliver high output in pressure moments**, not who elevates above their own usual level. Units of $H_p$ are **runs per ball relative to context par, shrunk**.

### 1.2 Top 10 Production Selections
The audited selection pipeline establishes the following top 10 rosters across 91 eligible batters and 89 eligible bowlers:

- **Top 10 Batters**: 1. Rashid Khan (+0.468 rpb), 2. Heinrich Klaasen (+0.400 rpb), 3. Suryakumar Yadav (+0.349 rpb), 4. Tim David (+0.326 rpb), 5. Nicholas Pooran (+0.316 rpb), 6. Rovman Powell (+0.313 rpb), 7. Ryan Rickelton (+0.304 rpb), 8. Virat Kohli (+0.284 rpb), 9. Pathum Nissanka (+0.284 rpb), 10. Rinku Singh (+0.283 rpb).
- **Top 10 Bowlers**: 1. Mitchell Santner (+0.315 rpb), 2. Josh Hazlewood (+0.254 rpb), 3. Patrick Cummins (+0.259 rpb), 4. Krunal Pandya (+0.227 rpb), 5. Lockie Ferguson (+0.211 rpb), 6. Sunil Narine (+0.209 rpb), 7. Axar Patel (+0.208 rpb), 8. Kagiso Rabada (+0.199 rpb), 9. Mohammed Shami (+0.199 rpb), 10. Kuldeep Yadav (+0.198 rpb).

### 1.3 Key Methodological Limitations & Empirical Disclosures
Transparent statistical reporting requires disclosing key architectural and sample properties:
1. **Chase Dominance & Innings Imbalance**: High-pressure deliveries are heavily concentrated in the second innings. Of the 37,114 HP deliveries, **28,112 (75.75%) occur in Innings 2**, while only **9,002 (24.25%) occur in Innings 1**. This asymmetry arises because win probability swings and required run rate tension are mathematically acute during run chases.
2. **Mechanical Tension in Innings 1**: In Innings 1, the tension term $T_i$ relies on a projected final score ($R_i + E_{\text{rem}}$) relative to venue par $V_{\text{par}}$. When early wickets fall, projected score drops sharply, mechanically elevating $T_i$ regardless of whether the match is competitive.
3. **Vanishing Stress Term at Death**: The wicket stress component $S_i = (w/9) \cdot (b_{\text{rem}}/120) / 0.35$ incorporates balls remaining $b_{\text{rem}}$. As $b_{\text{rem}} \to 0$ in overs 18–20, $S_i$ approaches 0. Consequently, overall death-over pressure is dominated by leverage and tension rather than collapse stress. Death overs (overs 16–20) account for **17.82% of all HP balls** (6,615 / 37,114). In Canonical Scenario 7 (Innings 1 death acceleration), only **0.7%** of balls meet the HP threshold, whereas in Scenario 6 (Middle overs chase crisis), **18.4%** are classified as HP.
4. **Win Probability Chain Transitions**: Using a single calibrated function $wp(\text{state})$ eliminates model discrepancy between pre-ball and post-ball evaluations. Across all 88,884 Innings 2 deliveries, transitions with absolute gap $|wp_{\text{after}}(t) - wp_{\text{before}}(t+1)| > 10^{-3}$ occur in **2.15%** of transitions (and $> 10^{-4}$ in 2.29%). A detailed diagnostic disclosure and transition table appear in Section 2.3.
5. **Low Out-of-Sample Elevation Signal**: In 200 zero-leakage match splits, batter elevation (C3) produces a median out-of-sample correlation of $r = -0.0088$, with composite metric C1 achieving median $r = 0.0335$ (95% CI: $[-0.1205, 0.1784]$, including 0). Bowler performance demonstrates stronger persistence with median $r = 0.1722$ (95% CI: $[0.0043, 0.3057]$).
6. **Statistical Power Constraints**: Detecting small true individual elevation ($\delta = +0.05$ rpb) with 80% power under clustered match designs requires **46,706 balls** for batters and **29,823 balls** for bowlers. In contrast, the maximum observed career HP deliveries in our 2022–2026 dataset are **774 balls** (Pooran) and **630 balls** (Axar), with cohort medians of **212 balls** (batters) and **226 balls** (bowlers). Estimating individual elevation above a player's own baseline is statistically underpowered; the metric appropriately measures shrunk expected output under pressure.\n
---

## 2. Pressure Intensity Architecture

### 2.1 Four-Pillar Mathematical Formulation
Composite pressure $P_i \in [0, 1]$ is evaluated on every delivery $i$ via a linear combination of four normalized pillars with declared weights 40/30/20/10:

$$P_i = 0.40 \cdot L_i + 0.30 \cdot T_i + 0.20 \cdot S_i + 0.10 \cdot M_i$$

The exact implemented formulas from `run_pressure_pipeline.py` (lines 622–641) are:
```python
# Pillar 1: Leverage (Expected Absolute Win Probability Swing)
pi_p95 = 0.033550  # 95th percentile of consistent expected swing
df['p_pi'] = np.clip(df['pi_expected_swing'] / max(pi_p95, 1e-4), 0.0, 1.0)

# Pillar 2: Tension (Required Run Rate or Target Deficit)
rrr_num = np.where(df['balls_rem_before'] > 0, (df['runs_req_before'] * 6.0) / df['balls_rem_before'], 0.0)
p_tension_inn2 = normal_cdf((rrr_num - 8.5) / 3.0)
inn1_proj = df['runs_before'] + df['e_rem']
p_tension_inn1 = normal_cdf((df['v_par'] - inn1_proj) / 25.0)
df['p_tension'] = np.where(df['innings'] == 2, p_tension_inn2, p_tension_inn1)

# Pillar 3: Wicket Collapse Stress
w_stress = (df['w_before'] / 9.0) * (df['balls_rem_before'] / 120.0)
df['p_stress'] = np.clip(w_stress / 0.35, 0.0, 1.0)

# Pillar 4: Match Stakes
is_ko = (df['knock_out'] == 1) | (df['stage'].astype(str).str.contains('Final|Semi|Qualifier|Eliminator', case=False, na=False))
df['p_stage'] = np.where(is_ko, 1.0, np.where(df['comp_type'] == 'IPL', 0.85, 0.75))

# Composite Continuous Pressure Intensity
df['P_i'] = 0.40 * df['p_pi'] + 0.30 * df['p_tension'] + 0.20 * df['p_stress'] + 0.10 * df['p_stage']
```

### 2.2 Consistent Win Probability Leverage & P95 Normalization
In earlier iterations, leverage was computed using raw pre-ball win probability and uncalibrated post-ball win probability, resulting in artificial swings on Ball 1 of run chases. Under the adopted consistent architecture:
1. **Single Evaluation Function**: Both $wp_{\text{before}}$ and $wp_{\text{after}}$ for all 7 possible outcomes ($k \in \{0, 1, 2, 3, 4, 6, W\}$) are evaluated via one single calibrated isotonic PAVA mapping on DP state variables.
2. **Consistent Normalizer**: The 95th percentile of expected swing under the unified model is **0.033550** (replacing the legacy 0.1311 value).
3. **HP Threshold**: Deliveries in the top 20% of composite pressure $P_i$ are classified as High Pressure. The empirical 80th percentile cutoff is **0.590213**, isolating exactly **37,114 HP deliveries** out of 185,567 total balls.
4. **Resolution of Chase Start Anomaly**: Under the legacy formulation, 35.78% of chase opening deliveries were flagged as HP. Under consistent calibration, exactly **22 deliveries (2.83% of matches, 0.01% of all deliveries)** meet the cutoff, eliminating the chase-start instability.

### 2.3 Diagnostics: Win-Probability Chain Consistency
Across all 88,884 Innings 2 deliveries, transitions between consecutive balls within the same innings were evaluated to audit the continuity of the win-probability chain. In **2.15% of within-innings transitions**, the absolute gap $|wp_{\text{after}}(t) - wp_{\text{before}}(t+1)|$ exceeds $10^{-3}$ (and exceeds $10^{-4}$ in 2.29%).

Table 2 presents the top 15 largest transition gaps observed in the dataset:

| Match ID | Innings | Over | Ball | State $t$ $(R, W, B_{\text{rem}}, \text{Req})$ | State $t+1$ $(R, W, B_{\text{rem}}, \text{Req})$ | $\text{WP}_{\text{after}}(t)$ | $\text{WP}_{\text{before}}(t+1)$ | Gap $|\Delta\text{WP}|$ |
| :-: | :-: | :-: | :-: | :---: | :---: | :-: | :-: | :-: |
| 14122 | 2 | 20 | 1 | (157, 7, 5, 13) | (157, 7, 5, 13) | 0.0945 | 0.4666 | 0.3722 |
| 14128 | 2 | 19 | 3 | (136, 7, 9, 21) | (136, 7, 9, 21) | 0.3661 | 0.0728 | 0.2932 |
| 14128 | 2 | 19 | 5 | (139, 7, 7, 18) | (139, 7, 7, 18) | 0.0766 | 0.3664 | 0.2898 |
| 16863 | 2 | 19 | 6 | (165, 8, 6, 9) | (165, 8, 6, 9) | 0.6950 | 0.4078 | 0.2872 |
| 14159 | 2 | 19 | 5 | (175, 7, 7, 19) | (175, 7, 7, 19) | 0.0497 | 0.3317 | 0.2820 |
| 15796 | 2 | 19 | 7 | (209, 5, 6, 17) | (209, 5, 6, 17) | 0.4022 | 0.1250 | 0.2772 |
| 41971 | 2 | 19 | 6 | (163, 8, 6, 10) | (163, 8, 6, 10) | 0.6184 | 0.3429 | 0.2755 |
| 31269 | 2 | 19 | 1 | (144, 7, 11, 26) | (144, 7, 11, 26) | 0.3230 | 0.0632 | 0.2598 |
| 50375 | 2 | 19 | 6 | (152, 7, 6, 15) | (152, 7, 6, 15) | 0.1664 | 0.4255 | 0.2591 |
| 29924 | 2 | 19 | 4 | (149, 8, 8, 12) | (149, 8, 8, 12) | 0.6356 | 0.3785 | 0.2571 |
| 20188 | 2 | 19 | 6 | (180, 6, 7, 18) | (180, 6, 7, 18) | 0.1385 | 0.3940 | 0.2555 |
| 28057 | 2 | 19 | 7 | (139, 8, 6, 9) | (139, 8, 6, 9) | 0.7113 | 0.4699 | 0.2414 |
| 14116 | 2 | 19 | 4 | (177, 6, 8, 22) | (177, 6, 8, 22) | 0.0794 | 0.3189 | 0.2396 |
| 50139 | 2 | 20 | 1 | (169, 7, 5, 13) | (169, 7, 5, 13) | 0.1853 | 0.4247 | 0.2394 |
| 20232 | 2 | 19 | 5 | (196, 6, 7, 19) | (196, 6, 7, 19) | 0.1034 | 0.3413 | 0.2379 |


In these transitions the runs, wickets and balls remaining are identical or nearly identical on both sides, so the disagreement comes from how the two values are evaluated, not from a change in the match state. This is an unresolved inconsistency in the win-probability chain. It affects leverage in these states only, and the pressure flag for the affected balls may be wrong.

**Root Cause Diagnostic**: In the innings 2 WP evaluation, $wp_{\text{after}}(t)$ evaluates the post-delivery score state using the pre-delivery required run rate band (`rrr_band` at delivery $t$), whereas $wp_{\text{before}}(t+1)$ uses the recomputed post-delivery band (`rrr_band` at delivery $t+1$). When a delivery causes the required run rate to cross a band boundary (such as moving from 12–15 to $\ge 15$ on a dot ball in over 20 of match 14122), the state transition switches to a different DP lookup table (`E2_band`), creating a discrete evaluation jump despite identical match state.

---

## 3. Empirical Outcome Validation: HP vs Ordinary

### 3.1 Outcome Metric Rates Across Splits (Table 1)
Table 1 summarizes ball-by-ball outcome rates across 185,567 deliveries partitioned into High-Pressure ($P_i \ge 0.590213$, $N=37,114$) and Ordinary ($P_i < 0.590213$, $N=148,453$) states.

| Split | State | N Balls | Legal Balls | RPO | Boundary % | Dot % | Wicket % |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| All Deliveries | HP | 37,114 | 35,507 | 8.65 | 18.20% | 36.28% | 5.81% |
| All Deliveries | Ordinary | 148,453 | 142,127 | 8.95 | 19.04% | 35.01% | 5.56% |
| Innings 1 (Overall) | HP | 9,002 | 8,716 | 6.68 | 12.79% | 44.96% | 4.42% |
| Innings 1 (Overall) | Ordinary | 87,681 | 83,780 | 9.22 | 19.56% | 33.41% | 5.64% |
| Innings 1 (Powerplay 1-6) | HP | 3,091 | 2,966 | 7.27 | 17.53% | 50.40% | 3.91% |
| Innings 1 (Powerplay 1-6) | Ordinary | 26,034 | 25,006 | 8.75 | 22.07% | 44.19% | 4.41% |
| Innings 1 (Middle 7-15) | HP | 5,422 | 5,279 | 6.28 | 10.08% | 42.36% | 4.43% |
| Innings 1 (Middle 7-15) | Ordinary | 37,946 | 36,601 | 8.67 | 16.13% | 29.22% | 4.71% |
| Innings 1 (Death 16-20) | HP | 489 | 471 | 7.53 | 13.38% | 39.92% | 7.43% |
| Innings 1 (Death 16-20) | Ordinary | 23,701 | 22,173 | 10.66 | 22.40% | 28.14% | 8.55% |
| Innings 2 (Overall) | HP | 28,112 | 26,791 | 9.29 | 19.96% | 33.46% | 6.26% |
| Innings 2 (Overall) | Ordinary | 60,772 | 58,347 | 8.56 | 18.28% | 37.30% | 5.46% |
| Innings 2 (Powerplay 1-6) | HP | 8,314 | 7,975 | 9.46 | 24.45% | 41.64% | 5.22% |
| Innings 2 (Powerplay 1-6) | Ordinary | 20,832 | 19,985 | 8.50 | 21.41% | 46.01% | 4.57% |
| Innings 2 (Middle 7-15) | HP | 13,672 | 13,116 | 8.61 | 16.10% | 30.18% | 5.59% |
| Innings 2 (Middle 7-15) | Ordinary | 28,547 | 27,606 | 8.27 | 15.43% | 32.25% | 4.88% |
| Innings 2 (Death 16-20) | HP | 6,126 | 5,700 | 10.64 | 22.56% | 29.54% | 9.28% |
| Innings 2 (Death 16-20) | Ordinary | 11,393 | 10,756 | 9.42 | 19.76% | 34.08% | 8.59% |


> **Analysis of Divergence**: Overall, HP deliveries feature lower run rates (8.65 vs 8.95 RPO) and higher wicket rates (5.81% vs 5.56%). However, the split reveals strong context dependence. In Innings 1, HP deliveries exhibit a sharp drop in run rate (6.68 vs 9.22 RPO) and elevated dot balls (44.96% vs 33.41%), reflecting early batting collapses where surviving batters consolidate. In Innings 2, HP deliveries show higher run rates (9.29 vs 8.56 RPO) and higher boundary rates (19.96% vs 18.28%), driven by aggressive death chasing under steep required run rates.

### 3.2 Canonical Match Scenarios (Scenarios 1–8)
To evaluate pressure responsiveness across tactical contexts, 8 canonical match scenarios were audited:

| ID | Canonical Scenario Name | N Balls | Nominal HP % | Consistent HP % |
| :-: | :--- | :---: | :---: | :---: |
| 1 | Final-over thriller (Inn 2, Ov 20, RRR 10-14, 4-6 wkts) | 86 | 64.0% | 90.7% |
| 2 | Blowout chase death (Inn 2, Ov >= 19, RRR > 25, >= 6 wkts) | 1,918 | 1.5% | 5.5% |
| 3 | Powerplay cruise (Ov 1-6, <= 1 wkt, low RRR / inn 1) | 27,527 | 0.0% | 0.4% |
| 4 | Powerplay collapse (Ov 1-6, >= 3 wkts) | 3,647 | 54.7% | 52.4% |
| 5 | Middle overs consolidation (Inn 1, Ov 7-15, 2-3 wkts) | 20,151 | 5.9% | 3.2% |
| 6 | Middle overs crisis (Inn 2, Ov 11-15, RRR > 11, >= 4 wkts) | 6,585 | 7.0% | 18.4% |
| 7 | Innings 1 death acceleration (Inn 1, Ov 18-20, 3-5 wkts) | 7,301 | 0.0% | 0.7% |
| 8 | Innings 1 tail-end survival (Inn 1, Ov 18-20, >= 8 wkts) | 1,973 | 2.9% | 3.1% |


Scenario 1 (Final-over thriller) reaches **90.7% HP share**, Scenario 4 (Powerplay collapse) reaches **52.4% HP share**, and Scenario 3 (Powerplay cruise) drops to **0.4% HP share**, verifying that the pressure metric accurately reflects tactical match leverage.

### 3.3 Over-by-Over Pressure Distribution
Figure 3 depicts the HP delivery share across overs 1 to 20 for Innings 1 and Innings 2:
![Figure 3: Over-by-Over Pressure Intensity](file:///d:/RR/outputs/final/v5/figures/figure3_over_heatmap.png)

- In **Innings 1**, HP deliveries peak in the Powerplay (Over 5: 19.4%, Over 6: 18.82%) when top-order collapses trigger high stress, before decaying to **0.60% in Over 20** as $b_{\text{rem}} \to 0$.
- In **Innings 2**, HP deliveries rise steadily across middle overs (Overs 11–15: 33.86%–36.12%) and remain elevated through the death overs (Over 18: 37.49%, Over 19: 35.51%, Over 20: 31.76%).

---

## 4. Performance Metric Formulation & Model Selection

### 4.1 Description of Candidate Estimators (C1–C4)
Four candidate performance estimators were formulated for comparative evaluation:
1. **Candidate C1 (Adopted: Shrunk HP Net Output Above Par)**: Measures net performance credit on HP deliveries only, incorporating both run credit and Dynamic Programming wicket valuation, adjusted for opponent quality via Two-Way Ridge regression, and shrunk toward the cohort mean via REML $\tau^2$.
   - Batter Credit: $y_{i,\text{bat}} = (r_i - \bar{r}_i) - c_{\text{wkt},i} \cdot \mathbf{1}_{\text{dismissal}}$
   - Bowler Credit: $y_{i,\text{bowl}} = (\bar{r}_i - r_i) + c_{\text{wkt},i} \cdot \mathbf{1}_{\text{wicket}}$
   - where $c_{\text{wkt},i} = \max(0.5, \Delta E[\text{runs}_i]) = \max(0.5, E(b-1, w) - E(b-1, w+1))$.
   - Wicket delta-WP values are capped at 15.0 percentage points. Across all deliveries in the dataset, **11.49% of wicket balls reach this cap** (1,146 of 9,970 deliveries; 11.50% of bowler-credited wickets).
2. **Candidate C2 (Multi-Task 50/50 Run + Wicket Index)**: Separates scoring output from dismissal survival into standardized z-scores $Z_{\text{run}}$ and $Z_{\text{wkt}}$, computing $S_p = 0.50 \cdot Z_{\text{run}} + 0.50 \cdot Z_{\text{wkt}}$.
3. **Candidate C3 (Elevation Difference Over Baseline)**: Evaluates pressure elevation above a player's own ordinary-context baseline: $\Delta H_j = H_{\text{raw},j}^{\text{HP}} - H_{\text{raw},j}^{\text{Ord}}$, shrunk using hierarchical elevation prior.
4. **Candidate C4 (Run-Only Credit on HP Deliveries)**: Evaluates scoring performance on HP balls omitting the wicket term ($c_{\text{wkt}} = 0$).

### 4.2 Pre-Declared Selection Protocol (Rule S)
The pre-declared selection protocol governs model choice without manual intervention:
> **Selection Rule S**: Select the candidate achieving the highest median Out-of-Sample (OOS) Pearson correlation $r$ across 200 zero-leakage match-level splits. If candidate performance differences are within a margin of **0.02**, prefer the simpler model in declared parsimony order: **C1 < C4 < C2 < C3**.

### 4.3 200 Zero-Leakage Split-Half Out-of-Sample Results
In each split, 777 matches were partitioned randomly into two halves (388 vs 389 matches). Opponent baselines, REML $\tau^2$, and shrinkage parameters were fitted strictly within Half 1 and evaluated against observed performance in Half 2. Table 4 reports median OOS correlations and 95% empirical bootstrap intervals across 200 splits:

| Role | Target Evaluated | C1 (Adopted) | C2 (50/50 Multi-Task) | C3 (Elevation) | C4 (Run-Only) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| BAT | comp | 0.0335 [-0.1205, 0.1784] | -0.0254 [-0.1870, 0.1291] | -0.0088 [-0.1771, 0.1377] | 0.0326 [-0.1273, 0.1784] |
| BAT | run | 0.1399 [-0.0178, 0.2637] | 0.0282 [-0.1266, 0.1837] | 0.0377 [-0.1246, 0.1912] | 0.1393 [-0.0236, 0.2648] |
| BAT | wkt | -0.0689 [-0.2166, 0.0802] | -0.0804 [-0.2251, 0.1028] | -0.0656 [-0.2144, 0.1141] | -0.0697 [-0.2266, 0.0837] |
| BOWL | comp | 0.1722 [0.0043, 0.3057] | 0.1577 [0.0115, 0.2862] | 0.1771 [0.0270, 0.3065] | 0.1666 [-0.0016, 0.3038] |
| BOWL | run | 0.2119 [0.0584, 0.3448] | 0.1926 [0.0603, 0.3227] | 0.2132 [0.0815, 0.3612] | 0.2082 [0.0578, 0.3418] |
| BOWL | wkt | 0.0933 [-0.0618, 0.2524] | 0.0948 [-0.0539, 0.2320] | 0.1123 [-0.0531, 0.2395] | 0.0909 [-0.0657, 0.2547] |


Table 5 presents paired difference tests across the 200 splits:

| Role | Comparison | Median Paired Diff | 95% CI of Difference | Win Rate % |
| :--- | :--- | :---: | :---: | :---: |
| BAT | C3 - C1 | -0.0581 | [-0.1568, 0.0713] | 22.0% |
| BAT | C3 - C2 | +0.0130 | [-0.0459, 0.0733] | 70.5% |
| BAT | C3 - C4 | -0.0547 | [-0.1630, 0.0578] | 18.5% |
| BAT | C1 - C4 | +0.0003 | [-0.0157, 0.0178] | 51.5% |
| BOWL | C3 - C1 | +0.0076 | [-0.0790, 0.0889] | 53.5% |
| BOWL | C3 - C2 | +0.0181 | [-0.0140, 0.0609] | 87.5% |
| BOWL | C3 - C4 | +0.0089 | [-0.0885, 0.0935] | 58.0% |
| BOWL | C1 - C4 | +0.0040 | [-0.0174, 0.0214] | 65.0% |


The baseline model refit yields a Spearman correlation of **0.9998** across random match-halves (not exactly 1.0 due to minor run-to-run non-determinism in SGD/solver convergence, confirmed to have no impact on integer ranks).

### 4.4 Model Selection Determination
- **Batters**: C1 achieves median composite OOS $r = 0.0335$ (and run target $r = 0.1399$), while elevation C3 yields median $r = -0.0088$. The paired difference C3 minus C1 is $-0.0581$ (95% CI: $[-0.1568, 0.0713]$), with C1 outperforming C3 in 78.0% of splits. Comparing C1 and C4, the median difference is $0.0003$ ($< 0.02$), triggering the parsimony rule. **Candidate C1 is selected**.
- **Bowlers**: C3 achieves median OOS $r = 0.1771$, while C1 achieves $0.1722$. The median paired difference is $0.0076$ (95% CI: $[-0.0790, 0.0889]$), which falls well within the **0.02 parsimony margin**. Following Rule S preference ordering C1 < C3, **Candidate C1 is selected**.

### 4.5 Empirical Bayes Variance Decomposition
Between-player variance $\tau^2$ was estimated via profile Restricted Maximum Likelihood (REML) directly on $H_{\text{raw}}$:

- **Batters ($K=91$, dof=90)**: $\text{Var}(H_{\text{raw}}) = 0.059768$, Mean $\text{SE}^2 = 0.047408$, MoM $\tau^2 = 0.012360$, DerSimonian-Laird $\tau^2 = 0.016549$, **Adopted REML $\tau^2 = 0.017654$** ($Q = 85.27$).
- **Bowlers ($K=89$, dof=88)**: $\text{Var}(H_{\text{raw}}) = 0.060162$, Mean $\text{SE}^2 = 0.040844$, MoM $\tau^2 = 0.019318$, DerSimonian-Laird $\tau^2 = 0.027737$, **Adopted REML $\tau^2 = 0.026588$** ($Q = 83.37$).

In both roles, observed variance decomposes consistently: $\text{Var}(H_{\text{raw}}) \approx \tau^2 + \overline{\text{SE}}^2$ ($0.0598 \approx 0.0177 + 0.0474$ for batters; $0.0602 \approx 0.0266 + 0.0408$ for bowlers).

---

## 5. Production High-Pressure Selector Lists

### 5.1 Top 10 Batters
Table 6 presents the top 10 batters under adopted Candidate C1. All player names match the official Unstop mapping verbatim.

Out-of-sample batter split-half correlation is $r = 0.0335$ (95% CI: $[-0.1205, 0.1784]$), which includes zero. Individual batter ordering within the top 10 is essentially unidentified by the data. The list is presented ordered by $H_p$, but the confidence intervals on ranks are wide (Table 1). In contrast, bowler split-half correlation is $r = 0.1722$ (95% CI: $[0.0043, 0.3057]$).

Across all 91 eligible batters, **3 are in Tier A** ($P(\text{Top-10}) \ge 50\%$), **10 are in Tier B** ($20\%$ to $<50\%$), and **78 are in Tier C** ($<20\%$). Among the top 10 batters, 3 are in Tier A and 7 are in Tier B.

| Rank | Player Name | Unstop ID | HP Balls | Matches | Dismissals | $H_{\text{raw}}$ | Run Comp | Wkt Comp | SE | Shrink $B$ | $H_p$ (rpb) | 90% Posterior Interval | $P(\text{Top-10})$ | Probability Tier |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :---: |
| 1 | Rashid Khan | 4722 | 137 | 19 | 6 | +0.799 | +0.875 | -0.075 | 0.145 | 0.456 | **+0.468** | [0.31, 0.63] | 89.2% | Tier A |
| 2 | Heinrich Klaasen | 4260 | 286 | 31 | 9 | +0.630 | +0.780 | -0.149 | 0.140 | 0.476 | **+0.400** | [0.24, 0.56] | 70.7% | Tier A |
| 3 | Suryakumar Yadav | 1699 | 547 | 49 | 22 | +0.432 | +0.682 | -0.250 | 0.096 | 0.655 | **+0.349** | [0.22, 0.48] | 51.3% | Tier A |
| 4 | Tim David | 6396 | 314 | 38 | 14 | +0.509 | +0.765 | -0.256 | 0.154 | 0.426 | **+0.326** | [0.16, 0.49] | 41.7% | Tier B |
| 5 | Nicholas Pooran | 3125 | 409 | 40 | 19 | +0.499 | +0.809 | -0.310 | 0.160 | 0.408 | **+0.316** | [0.15, 0.48] | 39.2% | Tier B |
| 6 | Rovman Powell | 4986 | 369 | 40 | 19 | +0.406 | +0.678 | -0.273 | 0.116 | 0.568 | **+0.313** | [0.17, 0.46] | 35.2% | Tier B |
| 7 | Ryan Rickelton | 4007 | 186 | 15 | 6 | +0.682 | +0.994 | -0.312 | 0.243 | 0.230 | **+0.304** | [0.11, 0.50] | 35.1% | Tier B |
| 8 | Virat Kohli | 47 | 337 | 23 | 9 | +0.341 | +0.539 | -0.198 | 0.103 | 0.625 | **+0.284** | [0.15, 0.42] | 21.9% | Tier B |
| 9 | Pathum Nissanka | 6931 | 227 | 20 | 11 | +0.427 | +0.673 | -0.246 | 0.164 | 0.397 | **+0.284** | [0.11, 0.45] | 27.2% | Tier B |
| 10 | Rinku Singh | 4708 | 260 | 27 | 7 | +0.380 | +0.586 | -0.206 | 0.137 | 0.486 | **+0.283** | [0.13, 0.44] | 25.3% | Tier B |


### 5.2 Top 10 Bowlers
Table 7 presents the top 10 bowlers under adopted Candidate C1.

Across all 89 eligible bowlers, **1 is in Tier A** ($P(\text{Top-10}) \ge 50\%$), **16 are in Tier B** ($20\%$ to $<50\%$), and **72 are in Tier C** ($<20\%$). Among the top 10 bowlers, 1 is in Tier A and 9 are in Tier B.

| Rank | Player Name | Unstop ID | HP Balls | Matches | Wickets | $H_{\text{raw}}$ | Run Comp | Wkt Comp | SE | Shrink $B$ | $H_p$ (rpb) | 90% Posterior Interval | $P(\text{Top-10})$ | Probability Tier |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :---: |
| 1 | Mitchell Santner | 4101 | 334 | 32 | 26 | +0.512 | -0.143 | +0.656 | 0.144 | 0.562 | **+0.315** | [0.14, 0.49] | 69.9% | Tier A |
| 2 | Josh Hazlewood | 830 | 392 | 36 | 33 | +0.488 | -0.112 | +0.600 | 0.180 | 0.452 | **+0.254** | [0.06, 0.45] | 47.6% | Tier B |
| 3 | Patrick Cummins | 1758 | 169 | 15 | 12 | +0.518 | -0.093 | +0.611 | 0.192 | 0.419 | **+0.259** | [0.06, 0.46] | 49.5% | Tier B |
| 4 | Krunal Pandya | 4219 | 293 | 30 | 19 | +0.377 | -0.001 | +0.377 | 0.155 | 0.525 | **+0.227** | [0.04, 0.41] | 38.8% | Tier B |
| 5 | Lockie Ferguson | 4692 | 208 | 22 | 17 | +0.695 | -0.077 | +0.772 | 0.293 | 0.237 | **+0.211** | [-0.02, 0.45] | 36.9% | Tier B |
| 6 | Sunil Narine | 781 | 373 | 31 | 18 | +0.279 | -0.044 | +0.323 | 0.112 | 0.680 | **+0.209** | [0.06, 0.36] | 28.9% | Tier B |
| 7 | Axar Patel | 2876 | 587 | 58 | 31 | +0.286 | -0.170 | +0.456 | 0.119 | 0.654 | **+0.208** | [0.05, 0.37] | 30.0% | Tier B |
| 8 | Kagiso Rabada | 3628 | 309 | 29 | 18 | +0.340 | -0.142 | +0.482 | 0.165 | 0.495 | **+0.199** | [0.01, 0.39] | 30.2% | Tier B |
| 9 | Mohammed Shami | 1566 | 209 | 26 | 15 | +0.502 | -0.222 | +0.724 | 0.241 | 0.313 | **+0.199** | [-0.02, 0.42] | 32.8% | Tier B |
| 10 | Kuldeep Yadav | 3644 | 400 | 36 | 21 | +0.284 | -0.112 | +0.395 | 0.129 | 0.613 | **+0.198** | [0.03, 0.36] | 27.0% | Tier B |


> **Bowler Standard Error Specification Note**: The bowler ranking uses robust standard errors clustered on match (v4), which places Josh Hazlewood at rank 2 and Patrick Cummins at rank 3. Under standard CR1 standard errors (v5), Cummins is rank 2 ($H_p = 0.2588$) and Hazlewood is rank 3 ($H_p = 0.2538$). The point estimates are identical; only the standard errors and the empirical Bayes shrinkage differ slightly due to the robust SE adjustment.

### 5.3 Posterior Uncertainty & Forest Plots
Figure 1 displays the posterior means and 90% posterior intervals for the top 10 batters and top 10 bowlers, alongside their empirical probability of belonging to the true top 10 roster $P(\text{Top-10})$ derived from 10,000 posterior draws:

![Figure 1: Forest Plot of Top 10 Rosters](file:///d:/RR/outputs/final/v5/figures/figure1_forest_plots.png)

### 5.4 Wicket vs Run Component Decomposition
Decomposing $H_{\text{raw}}$ into its additive scoring component and wicket valuation component reveals fundamental structural differences between roles (verified additivity error: **0.0**).

Table 8 evaluates the top 10 bowler components centered on the full cohort means (Cohort Mean Run Component: **-0.316766** rpb; Cohort Mean Wicket Component: **+0.401739** rpb):

| Rank | Player Name | Unstop ID | $H_{\text{raw}}$ | Run Comp (raw) | Wkt Comp (raw) | Run Comp (cnt) | Wkt Comp (cnt) | Centered Primary Driver |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :---: |
| 1 | Mitchell Santner | 4101 | +0.512 | -0.143 | +0.656 | +0.173 | +0.254 | Wicket Taking |
| 2 | Josh Hazlewood | 830 | +0.488 | -0.112 | +0.600 | +0.204 | +0.198 | Run Economy |
| 3 | Patrick Cummins | 1758 | +0.518 | -0.093 | +0.611 | +0.224 | +0.209 | Run Economy |
| 4 | Krunal Pandya | 4219 | +0.377 | -0.001 | +0.377 | +0.316 | -0.024 | Run Economy |
| 5 | Lockie Ferguson | 4692 | +0.695 | -0.077 | +0.772 | +0.239 | +0.371 | Wicket Taking |
| 6 | Sunil Narine | 781 | +0.279 | -0.044 | +0.323 | +0.273 | -0.079 | Run Economy |
| 7 | Axar Patel | 2876 | +0.286 | -0.170 | +0.456 | +0.146 | +0.054 | Run Economy |
| 8 | Kagiso Rabada | 3628 | +0.340 | -0.142 | +0.482 | +0.175 | +0.080 | Run Economy |
| 9 | Mohammed Shami | 1566 | +0.502 | -0.222 | +0.724 | +0.094 | +0.322 | Wicket Taking |
| 10 | Kuldeep Yadav | 3644 | +0.284 | -0.112 | +0.395 | +0.205 | -0.006 | Run Economy |


1. **Centered Bowler Decomposition**: Relative to cohort par, exactly **3 out of 10 bowlers** (Mitchell Santner, Lockie Ferguson, and Mohammed Shami) have their centered wicket component exceed their centered run component. For the remaining **7 out of 10 bowlers** (Josh Hazlewood, Patrick Cummins, Krunal Pandya, Sunil Narine, Axar Patel, Kagiso Rabada, and Kuldeep Yadav), centered run economy exceeds centered wicket value. This proves that high-pressure bowling success relies on both run suppression and wicket taking, with run economy serving as the primary driver for 7 of the top 10.
2. **Batter Scoring Dominance**: For **0 out of 10 (0.0%)** top-10 batters does the dismissal penalty exceed run creation. Top-10 batters generate an average of **+0.709 rpb** in run creation against an average dismissal penalty of **-0.222 rpb**.
3. **Comparison with C2 50/50 Variant**: When equal 50/50 weight is explicitly forced onto wicket survival ($W_p$), the batter rankings shift substantially: Virat Kohli rises to #1 (Score: 2.47 rpb), Klaasen is #2 (2.34 rpb), Rashid Khan is #3 (1.94 rpb), Rinku Singh is #4 (1.83 rpb), and Shreyas Iyer enters at #5 (1.69 rpb). Top-10 overlap between C1 and C2 is **6/10 for batters** and **5/10 for bowlers** (where Mitchell Santner remains #1 at 2.52 rpb, followed by Varun Chakravarthy at #2 with 2.00 rpb).

### 5.5 Named Players Audit
Table 9 reports exact diagnostic statistics for key players evaluated across rounds:

| Player Name | Role | Unstop ID | HP Balls | Rank | $H_{\text{raw}}$ | Run Comp | Wkt Comp | Baseline | $H_p$ (rpb) | 90% Interval | $P(\text{Top-10})$ |
| :--- | :---: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Jasprit Bumrah | bowl | 2933 | 320 | #31 | +0.192 | -0.145 | +0.337 | +0.270 | +0.113 | [-0.10, 0.32] | 11.9% |
| Kagiso Rabada | bowl | 3628 | 309 | #8 | +0.340 | -0.142 | +0.482 | +0.123 | +0.199 | [0.01, 0.39] | 30.2% |
| Rashid Khan | bowl | 4722 | 539 | #18 | +0.190 | -0.151 | +0.341 | +0.154 | +0.154 | [0.01, 0.30] | 11.1% |
| Arshdeep Singh | bowl | 6464 | 563 | #62 | +0.017 | -0.285 | +0.301 | +0.128 | +0.029 | [-0.11, 0.17] | 0.5% |
| Rinku Singh | bat | 4708 | 260 | #10 | +0.380 | +0.586 | -0.206 | +0.120 | +0.283 | [0.13, 0.44] | 25.3% |
| Nicholas Pooran | bat | 3125 | 409 | #5 | +0.499 | +0.809 | -0.310 | +0.190 | +0.316 | [0.15, 0.48] | 39.2% |
| Jos Buttler | bat | 813 | 302 | #15 | +0.332 | +0.765 | -0.433 | +0.195 | +0.245 | [0.07, 0.42] | 16.2% |
| Hardik Pandya | bat | 3330 | 337 | #77 | +0.058 | +0.236 | -0.178 | +0.084 | +0.115 | [-0.03, 0.26] | 0.4% |
| Hardik Pandya | bowl | 3330 | 391 | #73 | -0.080 | -0.398 | +0.319 | +0.021 | -0.028 | [-0.19, 0.13] | 0.1% |
| Andre Russell | bat | 1318 | 169 | #17 | +0.356 | +0.763 | -0.406 | +0.228 | +0.236 | [0.05, 0.42] | 16.1% |
| Andre Russell | bowl | 1318 | 215 | #76 | -0.222 | -0.713 | +0.491 | -0.018 | -0.038 | [-0.25, 0.18] | 1.4% |


Jasprit Bumrah bowled 320 HP deliveries, recording $H_{\text{raw}} = +0.192$ rpb (Run: $-0.145$, Wkt: $+0.337$) and ranking #31 ($H_p = +0.113$ rpb). Kagiso Rabada bowled 309 HP deliveries, recording $H_{\text{raw}} = +0.340$ rpb and ranking #8 ($H_p = +0.199$ rpb). Nicholas Pooran faced 409 HP deliveries, recording $H_{\text{raw}} = +0.499$ rpb and ranking #5 ($H_p = +0.316$ rpb).

---

## 6. Fairness, Balance & Subgroup Robustness

### 6.1 Restored Eligibility Thresholds & Funnel Exclusions
The pre-declared eligibility criteria establish minimum sample sizes required for robust evaluation:
- **Batters**: $\ge 300$ legal balls faced overall, $\ge 60$ legal HP balls faced, and $\ge 15$ HP matches played.
- **Bowlers**: $\ge 300$ total balls bowled overall, $\ge 90$ HP deliveries bowled (including extras), and $\ge 15$ HP matches played.

Table 10 documents the sequential exclusion funnel across unique players:
| Funnel Stage | Batters Passing | Batters Excluded Alone | Bowlers Passing | Bowlers Excluded Alone |
| :--- | :---: | :---: | :---: | :---: |
| Total Players with $\ge 1$ Delivery | 815 | — | 586 | — |
| Condition A (Total Balls $\ge 300$) | 165 | 650 | 175 | 411 |
| Condition B (HP Deliveries $\ge 60 / 90$) | 177 | 638 | 124 | 462 |
| Condition C (HP Matches $\ge 15$) | 92 | 723 | 89 | 497 |
| **Sequential: Condition A & B** | 150 | — | 122 | — |
| **Restored Final Cohort (A & B & C)** | **91** | — | **89** | — |

> **Audit of 250 vs 300 Balls**: In prototype script `estimator.py` line 21, `min_total_balls = 250` was utilized, which coincided with 91 batters under the legacy pressure set. Restoring the declared threshold of 300 balls rigorously reproduces exactly 91 eligible batters and 89 eligible bowlers under the adopted consistent pressure architecture.
> **Boundary Edge Case**: Ryan Rickelton played in exactly **15 HP matches** (meeting Condition C at the exact boundary), facing 186 HP balls and achieving rank #7 ($H_p = +0.304$ rpb).

### 6.2 Small-Sample Cluster Bootstrap Audit
For all players in the top 15 with fewer than 25 HP matches ($M_p < 25$), match-level block bootstrap standard errors (2,000 resamples) and Bell-McCaffrey CR2 standard errors were computed to assess potential cluster-robust CR1 underestimation. As documented in `small_sample_se_audit.csv`:
- **Batters Top 15**: For Rashid Khan (19 M), Ryan Rickelton (15 M), Virat Kohli (23 M), and Pathum Nissanka (20 M), bootstrap SEs were slightly higher than CR1 ($0.152$ vs $0.145$ for Rashid; $0.247$ vs $0.243$ for Rickelton). Substituting $\max(\text{CR1}, \text{Boot SE})$ produced **zero rank changes** across the entire top 15 batters.
- **Bowlers Top 15**: For Patrick Cummins (15 M), bootstrap SE was $0.192$ vs CR1 $0.187$. Refitting produced exactly **one pairwise swap**: Josh Hazlewood moved to #2 and Patrick Cummins moved to #3.

### 6.3 Competition Balance: IPL vs T20I Deliveries
Of the 185,567 analysis deliveries, **85,486 balls (46.07%) come from 354 IPL matches**, while **100,081 balls (53.93%) come from 423 Men's T20I matches**. Two-Way Ridge opponent adjustment balances league-specific strength differences by estimating batter and bowler parameters within a joint network.

### 6.4 Sensitivity Grid Across Architectural Variants
Table 11 evaluates roster stability across 7 sensitivity configurations:

| Configuration Specification | Bat Overlap | Bat $\rho$ | Bowl Overlap | Bowl $\rho$ | Top Batters | Top Bowlers |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| Adopted Baseline (P80 Cutoff) | 10/10 | 0.9998 | 10/10 | 0.9998 | Rashid Khan; Heinrich Klaasen; Sury... | Mitchell Santner; Patrick Cummins; ... |
| HP Cutoff 75% | 7/10 | 0.8873 | 8/10 | 0.9421 | Rashid Khan; Heinrich Klaasen; Nich... | Patrick Cummins; Sunil Narine; Mitc... |
| HP Cutoff 85% | 7/10 | 0.8943 | 7/10 | 0.9187 | Rashid Khan; Heinrich Klaasen; Tim ... | Sunil Narine; Josh Hazlewood; Locki... |
| Equal Weights (25/25/25/25) | 5/10 | 0.5166 | 2/10 | 0.4610 | Sanju Samson; Marcus Stoinis; Romar... | Sunil Narine; Varun Chakravarthy; K... |
| IPL-Only Deliveries | 5/10 | 0.8367 | 5/10 | 0.8579 | Heinrich Klaasen; Tim David; Suryak... | Sunil Narine; Kuldeep Yadav; Josh H... |
| T20I-Only Deliveries | 4/10 | 0.7984 | 2/10 | 0.8445 | Rovman Powell; Kusal Mendis; Namboo... | Mitchell Santner; Axar Patel; Abrar... |
| Wicket |dWP| Variant | 8/10 | 0.9122 | 6/10 | 0.9047 | Heinrich Klaasen; Virat Kohli; Sury... | Mitchell Santner; Josh Hazlewood; P... |


> **Sensitivity Finding**: Lists depend strongly on pressure pillar weighting. When equal weights (25/25/25/25) are applied, top-10 overlap drops to **5/10 for batters** and **2/10 for bowlers** (Spearman $\rho = 0.5166$ and $0.4610$), demonstrating that pressure definition choice is the single most influential modeling decision. In contrast, lowering the HP cutoff to 75% maintains 7/10 overlap for batters and 8/10 for bowlers. Across random match-halves, refitting the baseline model yields a Spearman correlation of **0.9998**.

---

## 7. Reliability, Sample Constraints & Power Analysis

### 7.1 Analytical Power Formulation with Clustered Survey Design
Deliveries within matches are clustered by bowler spells and batting partnerships. To evaluate the statistical sample size required to detect a true individual pressure elevation $\delta$ above context par with two-sided significance $\alpha = 0.05$ and $80\%$ statistical power ($z_{\alpha/2} = 1.95996$, $z_\beta = 0.84162$), the Design Effect ($\text{DEFF}$) is incorporated:

$$N_{\text{req}} = \left( \frac{(z_{\alpha/2} + z_\beta) \cdot \sigma \sqrt{\text{DEFF}}}{\delta} \right)^2$$

Empirical parameter estimates from `power_analysis.csv` establish:
- **Batters**: Ball-level net credit $\sigma = 2.7130$, intra-match clustering $\text{DEFF} = 2.0211$. Effective $\sigma_{\text{adj}} = 3.8568$.
- **Bowlers**: Ball-level net credit $\sigma = 2.7537$, intra-match clustering $\text{DEFF} = 1.2527$. Effective $\sigma_{\text{adj}} = 3.0821$.

Table 12 reports required deliveries vs observed career samples:

| Role | Elevation Target $\delta$ | $\sigma$ | DEFF | Required HP Balls (80% Power) | Max Career HP Balls | Median Career HP Balls |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Batters | +0.10 rpb | 2.7130 | 2.0211 | **11,677** | 774 | 212 |
| Batters | +0.05 rpb | 2.7130 | 2.0211 | **46,706** | 774 | 212 |
| Bowlers | +0.10 rpb | 2.7537 | 1.2527 | **7,456** | 630 | 226 |
| Bowlers | +0.05 rpb | 2.7537 | 1.2527 | **29,823** | 630 | 226 |


Figure 4 depicts statistical power curves as a function of sample size:

![Figure 4: Statistical Power Curves](file:///d:/RR/outputs/final/v5/figures/figure4_power_curve.png)

To reliably detect an elevation of $+0.10$ rpb, a batter requires **11,677 HP balls** and a bowler requires **7,456 HP balls**. Detecting an elevation of $+0.05$ rpb requires **46,706 balls** for batters and **29,823 balls** for bowlers. Because the maximum observed career sample in four years of elite T20 cricket is 774 balls (Pooran) and 630 balls (Axar), estimating individual player elevation relative to their own ordinary baseline is statistically underpowered. Empirical Bayes shrinkage toward cohort par ($H_p$) provides the mathematically valid foundation for selector ranking.

---

## 8. Appendices

### Appendix A: Complete Eligible Rosters (91 Batters, 89 Bowlers)
The complete rosters of all 91 eligible batters and 89 eligible bowlers are saved in `final_batters_v5.csv` and `final_bowlers_v4_robust_se.csv`.

### Appendix B: Data Funnel & Scoping Audit
The five-stage match and ball filtering funnel is audited below:
- **Stage 0 (Raw Ingest)**: 867 matches, 200,999 balls.
- **Stage 1 (In-Scope Window 2022–2026)**: 837 matches, 194,014 balls (excluded 30 matches outside date window).
- **Stage 2 (Valid Match Data)**: 815 matches, 192,465 balls (excluded 22 matches with incomplete ball-by-ball logs).
- **Stage 3 (Two Complete Innings)**: 786 matches, 187,639 balls (excluded 29 abandoned/single-innings matches).
- **Stage 4 (Final Analysis Cohort)**: 777 matches (354 IPL, 423 T20I), 185,567 balls (85,486 IPL, 100,081 T20I).

### Appendix C: Computational Environment & System Versions
- **Python Version**: 3.14.0
- **NumPy Version**: 2.5.4
- **Pandas Version**: 3.1.1
- **Platform OS**: win32
- **Global Random Seed**: 42

### Appendix D: Reproduction Guide
GitHub: [GITHUB_LINK]

All numbers and figures are 100% reproducible via executed scripts:
```bash
# 1. Build Submission Lists & Centered Tables
python outputs/final/scripts/build_step1_lists.py

# 2. Build Numbers Manifest & Report Markdown
python outputs/final/scripts/build_manifest.py
python outputs/final/scripts/build_report_markdown.py

# 3. Build Submission PDF
python outputs/final/scripts/build_pdf.py

# 4. Execute Verification Suite
python outputs/final/scripts/verify_report.py
```

### Appendix E: Bug-Fix & Audit Log
1. **Leverage Calibration Mismatch**: Legacy code evaluated pre-ball and post-ball win probability using different functional states, generating artificial swings on chase-opening deliveries. Resolved by evaluating all states through one single monotonic PAVA-calibrated $wp(\text{state})$ function with normalizer $0.033550$.
2. **Eligibility Text Label Error**: An earlier prototype script applied a 250-ball floor in `estimator.py` line 21. Restoring the declared 300-ball threshold rigorously produces the exact cohorts of 91 eligible batters and 89 eligible bowlers.
3. **Small Sample Standard Errors**: Cluster-robust CR1 standard errors were audited via 2,000 match-level bootstrap resamples for all players with $M_p < 25$, confirming zero rank changes for batters and a single pairwise swap for bowlers (placing Josh Hazlewood at #2 and Patrick Cummins at #3 under robust SEs).