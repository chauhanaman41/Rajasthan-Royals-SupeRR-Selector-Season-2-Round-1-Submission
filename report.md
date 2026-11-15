# EXPLORATORY. Neither list is validated.

# Unified Methodology Report: Identifying Reliable High-Pressure Performers in T20 Cricket

**Competition:** Rajasthan Royals SupeRR Selector Season 2 — Round 1 Submission  
**Analytical Scope:** Indian Premier League (IPL) and ICC Men's T20 Internationals (T20I)  
**Time Horizon:** 2022 to April 2026 Data Cutoff  
**Evaluation Status:** EXPLORATORY (Neither list is certified or confirmed as stable across seasons)  
**Governing Code Hashes:**  
- Pipeline Script (`run_pressure_pipeline.py`): `fb9f3cc6c02685b2ac399fd5f2fe0755838cfe4e32ce5dbf34fd2e22f336b7f2`  
- Shared Estimator (`estimator.py`): `115ea363238be95d1092d53783a40675fd459f9cb9ab795a488e48ebc6539a40`  
- Normalised Table Output SHA-256: `72fa75216d2d7632f22f48f165be169c0cd82c78f78f868d8ec1daa6fdcaa354`  

---

## 1. Summary

This methodology report presents the findings, empirical evaluations, and final ranked player lists for the Rajasthan Royals SupeRR Selector Season 2 challenge. The objective is to identify and rank the top 10 batters and top 10 bowlers who deliver most reliably under acute match pressure across elite T20 cricket (IPL and T20 Internationals) between 2022 and the April 2026 data cutoff.

The central empirical finding of this investigation is that **there is no statistically detectable per-player situational elevation at current sample sizes**. In rigorous statistical testing across 777 scoped matches and 185,567 deliveries, individual slope elevation above baseline—frequently conceptualized as special situational execution—fails split-half stability tests, fails out-of-time rolling seasonal predictions, and exhibits empirical signal-to-noise ratios far below the threshold necessary for reliable identification. Consequently, the rankings presented herein reflect **shrunk reliable high-pressure output ($H_{\text{low}}$)**—the lower bound of Empirical Bayes opponent- and context-adjusted output delivered during high-pressure deliveries—rather than isolated situational elevation slopes.

In strict adherence to scientific integrity and pre-declared evaluation rules, **both ranked lists are designated as EXPLORATORY**. Neither list has passed all pre-declared validation gates, and ranks 5 through 10 among batters as well as all ranks among bowlers lie within one posterior standard error of measurement of each other.

### Table 1.1: Top 10 Batters Ranked by Reliable High-Pressure Output (EXPLORATORY)
*Note: The HP Matches column below reflects distinct match participation with $\ge 1$ high-pressure delivery faced, superseding the unseparated match column in legacy pipeline printouts.*

| Rank | Player (`player_id`) | Total Balls | HP Balls | Total Matches | HP Matches | Reliable HP Output $H_p$ [90% EB CI] | Shrunk Elevation $E_p$ | Top-10 Inc Prob | Mean Rank | Inn 2 HP Share (%) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Heinrich Klaasen** (`4260`) | 1,401 | 285 | 70 | 26 | **+0.239** [+0.157, +0.321] | +0.001 | 89.0% | 4.4 | 53.3% |
| **2** | **Virat Kohli** (`47`) | 2,442 | 378 | 88 | 25 | **+0.206** [+0.128, +0.284] | +0.002 | 75.5% | 9.0 | 97.1% (Chase-Dep) |
| **3** | **Pathum Nissanka** (`6931`) | 1,381 | 317 | 67 | 24 | **+0.204** [+0.121, +0.286] | +0.002 | 74.0% | 8.4 | 93.1% (Chase-Dep) |
| **4** | **Tim David** (`6396`) | 1,154 | 300 | 93 | 31 | **+0.202** [+0.117, +0.287] | +0.000 | 66.5% | 9.9 | 70.0% |
| **5** | **Namboori Tilak Varma** (`7897`) | 2,310 | 774 | 115 | 48 | **+0.180** [+0.108, +0.253] | -0.001 | 53.5% | 15.0 | 69.6% |
| **6** | **Suryakumar Yadav** (`1699`) | 2,614 | 514 | 130 | 45 | **+0.185** [+0.104, +0.266] | -0.001 | 47.0% | 16.6 | 74.7% |
| **7** | **Prabhsimran Singh** (`7216`) | 1,033 | 366 | 56 | 24 | **+0.185** [+0.101, +0.270] | +0.001 | 38.5% | 16.7 | 90.4% (Chase-Dep) |
| **8** | **Rovman Powell** (`4986`) | 1,524 | 315 | 97 | 37 | **+0.182** [+0.099, +0.265] | +0.000 | 38.5% | 16.5 | 63.2% |
| **9** | **Kusal Mendis** (`3672`) | 1,220 | 236 | 61 | 20 | **+0.184** [+0.098, +0.270] | +0.001 | 40.5% | 15.8 | 95.3% (Chase-Dep) |
| **10** | **Yashasvi Jaiswal** (`6819`) | 1,739 | 375 | 82 | 27 | **+0.178** [+0.093, +0.264] | +0.001 | 33.5% | 19.1 | 99.7% (Chase-Dep) |

### Table 1.2: Top 10 Bowlers Ranked by Reliable High-Pressure Output (EXPLORATORY)
*Note: The HP Matches column below reflects distinct match participation with $\ge 1$ high-pressure delivery bowled, superseding legacy pipeline printouts.*

| Rank | Player (`player_id`) | Total Balls | HP Balls | Total Matches | HP Matches | Reliable HP Output $H_p$ [90% EB CI] | Shrunk Elevation $E_p$ | Top-10 Inc Prob | Mean Rank | Inn 2 HP Share (%) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Mitchell Santner** (`4101`) | 1,725 | 340 | 79 | 32 | **+0.119** [+0.103, +0.136] | +0.002 | 91.5% | 4.4 | 73.2% |
| **2** | **Kuldeep Yadav** (`3644`) | 1,866 | 403 | 84 | 35 | **+0.119** [+0.102, +0.135] | +0.001 | 88.5% | 5.1 | 61.5% |
| **3** | **Sunil Narine** (`781`) | 1,479 | 410 | 64 | 31 | **+0.118** [+0.102, +0.135] | +0.001 | 68.0% | 9.5 | 56.6% |
| **4** | **Axar Patel** (`2876`) | 2,609 | 548 | 130 | 54 | **+0.118** [+0.102, +0.135] | +0.002 | 63.0% | 10.8 | 64.2% |
| **5** | **Trent Boult** (`2320`) | 1,562 | 376 | 67 | 35 | **+0.118** [+0.102, +0.135] | +0.001 | 58.0% | 11.5 | 79.3% |
| **6** | **Krunal Pandya** (`4219`) | 1,255 | 287 | 64 | 25 | **+0.118** [+0.102, +0.134] | +0.001 | 54.0% | 13.1 | 88.5% |
| **7** | **Harshal Patel** (`2261`) | 1,688 | 439 | 76 | 38 | **+0.118** [+0.102, +0.134] | +0.001 | 57.0% | 15.6 | 80.0% |
| **8** | **Varun Chakravarthy** (`6256`) | 2,083 | 502 | 91 | 41 | **+0.118** [+0.102, +0.134] | -0.000 | 55.5% | 14.5 | 57.4% |
| **9** | **Mohammed Shami** (`1566`) | 1,259 | 249 | 54 | 27 | **+0.118** [+0.101, +0.134] | +0.001 | 32.5% | 15.0 | 73.5% |
| **10** | **Patrick Cummins** (`1758`) | 1,161 | 158 | 49 | 15 | **+0.118** [+0.101, +0.134] | +0.001 | 38.0% | 14.4 | 83.5% |

---

## 2. Pressure Definition & Mathematical Foundation

### 2.1 The Nature of Situational Pressure
In high-stakes sports analytics, situational pressure must be modeled as an **ex-ante state condition** that exists prior to the delivery of the ball. Conflating ex-ante pressure with ex-post leverage swing or outcome drama introduces profound selection bias: a bowler bowling in a tense 19th over is under intense pressure before releasing the ball; whether the ball results in a dot, a six, or a boundary changes the ex-post win probability, but the situational tension was already present.

To capture this ex-ante tension, we construct a continuous **Composite Pressure Intensity index**, denoted $P_i \in (0, 1)$, for every delivery $i$. The metric synthesizes four orthogonal pillars with explicit, judgment-based weights:

$$P_i = 0.40 \cdot \text{PI}_i + 0.30 \cdot T_i + 0.20 \cdot W_i + 0.10 \cdot M_i$$

These weights represent explicit modeling decisions: 40% weight to dynamic transition leverage, 30% to chase or par resource deficit, 20% to recent batting order collapse stress, and 10% to stage stakes.

### 2.2 Pillar Formulation
1. **Pre-Ball Win Probability Leverage ($\text{PI}_i$, Weight = 0.40):**  
   Leverage is computed as the transition-probability-weighted expected absolute swing in Win Probability (WP) across all seven possible delivery outcome categories $\mathcal{O} = \{0, 1, 2, 3, 4, 6, \text{W}\}$:
   $$\text{PI}_i = \sum_{o \in \mathcal{O}} \hat{p}_c^{(-k)}(o \mid s_i) \left| \text{WP}(s_i \to o) - \text{WP}(s_i) \right|$$
   where $\hat{p}_c^{(-k)}(o \mid s_i)$ represents Dirichlet-smoothed transition probabilities estimated on training folds. The base Win Probability model is evaluated across ten match-grouped folds ($K=10$), structured via the exact assignment:
   ```python
   m_list['fold'] = np.arange(len(m_list)) % n_folds
   ```
   with $n_{\text{folds}} = 10$, ensuring completely leak-free out-of-fold scoring. Calibrated probabilities are produced via 10-decile Pool-Adjacent-Violators (PAVA) isotonic regression, achieving out-of-fold Brier scores of **0.2228** in Innings 1, **0.1308** in Innings 2, and **0.1787** pooled across all deliveries.
2. **Chase / Par Resource Tension ($T_i$, Weight = 0.30):**  
   *Innings 2:* Measures the excess of required run rate over expected resource run rate:
   $$T_{i, \text{inn2}} = \max\left(0, \frac{R_{\text{req}, i}}{\max(E_c^{(-k)}(b_i, w_i), 6.0)} - 0.85\right)$$
   *Innings 1:* Measures par deficit relative to historical venue expectations:
   $$T_{i, \text{inn1}} = \max\left(0, \frac{\mu_{\text{venue}, c}^{(-k)} - S_{\text{proj}, i}}{24.0}\right) + 0.45\left(1 - \frac{b_i}{120}\right)\exp\left(-\frac{(S_{\text{proj}, i} - \mu_{\text{venue}, c}^{(-k)})^2}{2 \cdot 18^2}\right)$$
   where canonical first-innings par is **178.19** (standard deviation 36.92) overall (**186.27** IPL, **171.42** T20I), and second-innings par is **160.56** overall (**171.93** IPL, **151.05** T20I).
3. **Wicket Collapse Stress ($W_i$, Weight = 0.20):**  
   Evaluates collapse pressure based on resource exhaustion and recent cluster wickets:
   $$W_i = \left(\frac{w_i}{9}\right) \cdot \left(\frac{120 - b_i}{120}\right) \cdot \frac{1}{0.35}$$
4. **Stage Stakes Pillar ($M_i$, Weight = 0.10):**  
   Differentiates match context by tournament stage:
   ```python
   is_ko = (df['knock_out'] == 1) | (df['stage'].astype(str).str.contains('Final|Semi|Qualifier|Eliminator', case=False, na=False))
   df['p_stage'] = np.where(is_ko, 1.0, np.where(df['comp_type'] == 'IPL', 0.85, 0.75))
   ```
   Assigning weight **1.00** to playoff fixtures (Final, Semi-Final, Qualifier, Eliminator), **0.85** to regular IPL league matches, and **0.75** to bilateral T20I matches.

### 2.3 High-Pressure Regime Identification
Across the 185,567 scoped deliveries, Composite Pressure Intensity exhibits a sample mean of **0.474**. High-Pressure (HP) deliveries are formally identified as deliveries in the top quintile:

$$P_i \ge 0.601 \quad (\text{80th percentile cutoff})$$

This isolates exactly **37,114 deliveries (20.0%)** with a mean pressure intensity of **0.700** and an average pressure shift above stratum expectation of $\Delta P = \mathbf{0.227}$. 

Crucially, **75.0% of all high-pressure deliveries occur in Innings 2 run chases**, while only **25.0% occur in Innings 1**. This severe structural asymmetry necessitates stratified pressure centering: batters are centered within `(innings x batting_order_bucket)` strata, and bowlers within `(innings x phase)` strata, preventing the chase imbalance from confounding player baselines.

---

## 3. Performance Measurement & Expected-Value Index

### 3.1 Expected-Value Credit Formulation
A central methodological requirement is recognizing that a single delivery's performance credit is an **expected-value index, not physical runs**. Raw outcome runs alone fail to capture the true context of modern T20 cricket: conceding a single off a yorker with 4 runs needed off 2 balls is a match-winning ball, whereas conceding 10 runs in a dead rubber is harmless.

Every delivery $i$ generates a raw confrontation credit:
- **Batters:** $y_{\text{raw, bat}} = r_{\text{credit, bat}} - c_{\text{wkt}} \cdot w_{\text{credit}}$
- **Bowlers:** $y_{\text{raw, bowl}} = r_{\text{credit, bowl}} - c_{\text{wkt}} \cdot w_{\text{credit}}$

where $r_{\text{credit}}$ represents runs off the bat (for batters) or total runs conceded including extras (for bowlers), $w_{\text{credit}}$ is a binary dismissal indicator, and $c_{\text{wkt}}$ represents the dynamic run-value of a wicket derived from win-probability equivalence:

$$c_{\text{wkt}} = \frac{|\text{WP}(s \to \text{wicket}) - \text{WP}(s)|}{\max(|\text{WP}(s \to 1\text{ run}) - \text{WP}(s)|, 0.005)}$$

Because $c_{\text{wkt}}$ scales with state leverage, high-pressure deliveries automatically assign greater run-equivalent credit to dismissals by mathematical construction.

### 3.2 Two Expectations: Context Baseline vs Gross Runs
To evaluate whether an outcome represents positive or negative performance, the credit must be benchmarked against two distinct expectations:
1. **Gross Expected Runs:** Across all scoped deliveries, the average scoring rate is approximately **1.33 to 1.35 runs per ball** (corresponding to team totals between 160 and 162 in Innings 2, and 178 in Innings 1).
2. **Context Expectation ($\mu_{\text{ctx}}$):** The baseline expected credit $\mu_{\text{ctx}}$, estimated via Leave-One-Match-Out empirical Bayes shrinkage over `(comp_type, phase, wicket_band, bowling_style, venue)`, is approximately **0.95 runs per ball net of expected wicket credit**.

When a batter scores a single without losing a wicket, their raw credit is $+1.00$. Benchmarked against $\mu_{\text{ctx}} \approx 0.95$, this produces a residual near zero (+0.05). Conversely, a dismissal deducts $c_{\text{wkt}} \approx 4.0\text{--}8.0$ runs, generating a large negative residual.

### 3.3 Opponent Adjustments and Two-Way Ridge Regularization
Deliveries are contested between specific batters and bowlers. To separate individual player skill from the strength of the opposing player, we fit a two-way ridge regression on out-of-match residuals:

$$y_{\text{adj}} = y_{\text{raw}} - \mu_{\text{ctx}} \approx \alpha_p - \beta_q + \varepsilon_{pq}$$

The optimal ridge penalties are estimated via empirical variance components as $\lambda_{\text{bat}} = \mathbf{367.5}$ and $\lambda_{\text{bowl}} = \mathbf{359.2}$. To prevent within-match target leakage, each player's opponent adjustment uses Leave-One-Match-Out (LOMO) ratings ($\alpha_{\text{lomo}}$ for opposing batters, $\beta_{\text{lomo}}$ for opposing bowlers).

Across the eligible cohort's deliveries, opponent skill does not center perfectly at zero due to quality filtering:
- Batters face opposing bowlers with an average $\beta_{\text{lomo}}$ of **+0.052375** across all balls, **+0.056785** on HP balls, and **+0.051238** on non-HP balls (an upward drift of **+0.005547** under pressure).
- Bowlers face opposing batters with an average $\alpha_{\text{lomo}}$ of **+0.069356** across all balls, **+0.066761** on HP balls, and **+0.070082** on non-HP balls (a slight negative drift of **-0.003321** under pressure).

This offset acts as a mild positive baseline drift in player confrontation indices rather than physical runs above zero.

### 3.4 The Primary Ranking Metric: Reliable High-Pressure Output ($H_{\text{low}}$)
Because the challenge tasks us with finding players who perform most reliably under pressure, we define the primary ranking metric as the **90% empirical Bayes lower bound of high-pressure output**:

$$H_{\text{low}} = H_p - 1.645 \cdot \text{SE}_{\text{post}}$$

where:
- $H_{\text{raw}} = \frac{1}{n_{\text{HP}}} \sum_{i \in \text{HP}} \left( y_{\text{adj}, i} + \text{Opponent}_{\text{LOMO}, i} \right)$ represents un-shrunk output on high-pressure balls, without subtracting the player's own baseline skill.
- Shrinkage factor $B_p = \frac{\tau^2_H}{\tau^2_H + \text{SE}_{\text{CR1}, p}^2}$, with cluster-robust CR1 standard error clustered by match.
- Shrunk point estimate: $H_p = B_p \cdot H_{\text{raw}, p}$.
- Posterior standard error: $\text{SE}_{\text{post}} = \sqrt{B_p \cdot \text{SE}_{\text{CR1}, p}^2}$.

Ranking on $H_{\text{low}}$ enforces sample-size penalization: an elite player with high variance or limited high-pressure sample size receives a wide confidence band and a reduced lower bound, whereas a player with consistent execution across dozens of high-pressure fixtures achieves a high lower bound.

---

## 4. Fair Comparisons & Funnel Analysis

### 4.1 Match Scoping Funnel
To ensure data integrity, matches were scoped through five sequential exclusions:
1. **Raw Database:** 883 raw matches in `matches.csv`, of which 867 appear in ball-by-ball records (16 abandoned fixtures without balls bowled).
2. **Competition Scope:** Excludes 30 non-IPL/T20I fixtures (comp_id 2670 and 3289, comprising 6,985 balls), leaving 837 matches and 194,014 deliveries.
3. **Innings Count:** Excludes 22 single-innings washouts or super-over deliveries (1,549 balls), leaving 815 matches and 192,465 deliveries.
4. **Rain-Interrupted DLS:** Excludes 29 DLS-revised matches (4,826 balls), leaving 786 matches and 187,639 deliveries.
5. **Ties and Incomplete Results:** Excludes 9 tied/eliminator fixtures (2,072 balls), yielding the final scoped dataset of **777 matches and 185,567 deliveries**.

The scoped dataset comprises **354 IPL matches (85,486 deliveries)** and **423 T20I matches (100,081 deliveries)**. Among T20Is, **373 matches** involve two ICC Full Member nations, while **50 matches** involve Associate members.

### 4.2 Eligibility Funnel
Players were filtered through four pre-declared qualification criteria:
1. **Total Volume:** $\ge 300$ legal balls faced (batters) or $\ge 300$ deliveries bowled (bowlers).
2. **High-Pressure Volume:** $\ge 60$ deliveries under high pressure ($P_i \ge 0.601$).
3. **Match Breadth:** $\ge 15$ distinct matches with $\ge 1$ high-pressure delivery.
4. **Opposition Quality:** $\ge 60\%$ of deliveries in matches involving Full Member teams.

### Table 4.1: Sequential Eligibility Exclusion Funnel
| Funnel Step | Batters Filtered | Batters Remaining | Bowlers Filtered | Bowlers Remaining |
| :--- | :--- | :--- | :--- | :--- |
| **0. Total Players Appearing** | — | **815** | — | **586** |
| **1. Volume Cutoff (< 300 balls)** | 650 | 165 | 411 | 175 |
| **2. High-Pressure Volume (< 60 HP balls)** | 9 | 156 | 16 | 159 |
| **3. High-Pressure Breadth (< 15 HP matches)** | 78 | **78** | 77 | **82** |
| **4. Full Member Quality Share (< 60%)** | 0 | **78** | 0 | **82** |
| **Final Eligible Cohort** | — | **78** | — | **82** |

Every eligible batter and bowler comfortably exceeds the 15 HP-match breadth threshold, with the lowest player in each cohort having exactly 15 HP matches.

---

## 5. Evidence for the Top 10

### 5.1 Analysis of Batter Rankings
Heinrich Klaasen captures the top position ($H_{\text{low}} = \mathbf{+0.1571}$, $H_p = \mathbf{+0.2390}$), supported by an inclusion probability of **89.0%** across 200 match-level bootstrap draws and a mean rank of **4.4**. Klaasen faces 285 high-pressure deliveries across 26 distinct HP matches (70 total matches). Uniquely among elite batters, Klaasen exhibits a balanced innings distribution, facing **53.3%** of his high-pressure balls in Innings 2 and 46.7% in Innings 1.

In contrast, top-order batters exhibit extreme chase dependence:
- **Virat Kohli (Rank 2):** $H_{\text{low}} = +0.1283$, 378 HP balls across 25 HP matches (88 total matches), **97.1%** Innings 2 HP share.
- **Pathum Nissanka (Rank 3):** $H_{\text{low}} = +0.1211$, 317 HP balls across 24 HP matches (67 total matches), **93.1%** Innings 2 HP share.
- **Prabhsimran Singh (Rank 7):** $H_{\text{low}} = +0.1007$, 366 HP balls across 24 HP matches (56 total matches), **90.4%** Innings 2 HP share.
- **Kusal Mendis (Rank 9):** $H_{\text{low}} = +0.0980$, 236 HP balls across 20 HP matches (61 total matches), **95.3%** Innings 2 HP share.
- **Yashasvi Jaiswal (Rank 10):** $H_{\text{low}} = +0.0929$, 375 HP balls across 27 HP matches (82 total matches), **99.7%** Innings 2 HP share.

Crucially, **ranks 5 to 10 (batters) and all bowler ranks lie within one posterior SE of each other**. For batters, the spread in $H_{\text{low}}$ from Tilak Varma (+0.1077) to Yashasvi Jaiswal (+0.0929) is only **0.0148**, whereas the posterior standard error for these players is approximately **0.050**. Their bootstrap inclusion probabilities range from 33.5% to 53.5%. Therefore, ranks 5 to 10 are statistically tied, and their exact internal ordering is not stable.

### 5.2 Analysis of Bowler Rankings
The bowler leaderboard is led by Mitchell Santner ($H_{\text{low}} = \mathbf{+0.1028}$, $H_p = \mathbf{+0.1192}$, 340 HP balls across 32 HP matches), closely followed by Kuldeep Yadav ($H_{\text{low}} = \mathbf{+0.1025}$, $H_p = \mathbf{+0.1188}$, 403 HP balls across 35 HP matches) and Sunil Narine ($H_{\text{low}} = \mathbf{+0.1020}$, $H_p = \mathbf{+0.1184}$, 410 HP balls across 31 HP matches).

Because true bowler slope variance under split-half estimation is floored at $\tau^2_{\text{SH}} = 0.000100$, shrinkage is extensive. Consequently, all bowler ranks lie within one posterior SE of each other. Across the entire top 10, $H_{\text{low}}$ spans from **+0.1028 to +0.1013**—a minuscule spread of **0.0015**, compared to a posterior standard error of **0.0100**. The order inside this group is statistically indistinguishable.

*Note on protocol checks:* The runs-only check was not run for this submission.

### Table 5.1: Method of Moments (MoM) Sensitivity Analysis (Sensitivity Only)
To test sensitivity to the prior variance, we re-estimate between-player variance using the Method of Moments: $\tau^2_{\text{MoM}} = \text{Var}(H_{\text{raw}}) - \overline{\text{SE}^2}$. 
- Batters: $\text{Var}(H_{\text{raw}}) = \mathbf{0.048482}$, $\overline{\text{SE}^2} = \mathbf{0.044109} \implies \tau^2_{\text{MoM}} = \mathbf{0.004373}$ (positive and usable).
- Bowlers: $\text{Var}(H_{\text{raw}}) = \mathbf{0.056589}$, $\overline{\text{SE}^2} = \mathbf{0.038118} \implies \tau^2_{\text{MoM}} = \mathbf{0.018471}$ (positive and usable).

| Role | Player (`player_id`) | $H_{\text{raw}}$ | $\text{SE}_{\text{CR1}}$ | $H_p$ (MoM) | $H_{\text{low}}$ (MoM) | Primary Rank | MoM Rank |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Batter** | Heinrich Klaasen (`4260`) | +0.6059 | 0.1173 | +0.2662 | **+0.1715** | 1 | 1 |
| **Batter** | Virat Kohli (`47`) | +0.3397 | 0.0921 | +0.2200 | **+0.1316** | 2 | 2 |
| **Batter** | Pathum Nissanka (`6931`) | +0.4262 | 0.1219 | +0.2192 | **+0.1235** | 3 | 3 |
| **Batter** | Tim David (`6396`) | +0.5304 | 0.1503 | +0.2186 | **+0.1190** | 4 | 4 |
| **Batter** | Namboori Tilak Varma (`7897`) | +0.2207 | 0.0742 | +0.1859 | **+0.1047** | 5 | 5 |
| **Batter** | Suryakumar Yadav (`1699`) | +0.2975 | 0.1130 | +0.1938 | **+0.0999** | 6 | 6 |
| **Batter** | Prabhsimran Singh (`7216`) | +0.3753 | 0.1457 | +0.1954 | **+0.0963** | 7 | 7 |
| **Batter** | Rovman Powell (`4986`) | +0.3075 | 0.1259 | +0.1906 | **+0.0942** | 8 | 8 |
| **Batter** | Kusal Mendis (`3672`) | +0.4106 | 0.1639 | +0.1936 | **+0.0927** | 9 | 9 |
| **Batter** | Yashasvi Jaiswal (`6819`) | +0.3390 | 0.1560 | +0.1858 | **+0.0857** | 10 | 10 |
| **Bowler** | Mitchell Santner (`4101`) | +0.4543 | 0.1146 | +0.3141 | **+0.1700** | 1 | 1 |
| **Bowler** | Kuldeep Yadav (`3644`) | +0.4578 | 0.1249 | +0.3016 | **+0.1502** | 2 | 2 |
| **Bowler** | Sunil Narine (`781`) | +0.3572 | 0.1191 | +0.2527 | **+0.1053** | 3 | 3 |
| **Bowler** | Axar Patel (`2876`) | +0.3821 | 0.1307 | +0.2546 | **+0.0996** | 4 | 4 |
| **Bowler** | Trent Boult (`2320`) | +0.3931 | 0.1389 | +0.2519 | **+0.0921** | 5 | 5 |
| **Bowler** | Krunal Pandya (`4219`) | +0.4102 | 0.1476 | +0.2513 | **+0.0868** | 6 | 6 |
| **Bowler** | Harshal Patel (`2261`) | +0.2344 | 0.0982 | +0.1940 | **+0.0630** | 7 | 10 |
| **Bowler** | Varun Chakravarthy (`6256`) | +0.2460 | 0.1032 | +0.1987 | **+0.0635** | 8 | 9 |
| **Bowler** | Mohammed Shami (`1566`) | +0.5396 | 0.1953 | +0.2547 | **+0.0711** | 9 | 8 |
| **Bowler** | Patrick Cummins (`1758`) | +0.6722 | 0.2271 | +0.2632 | **+0.0713** | 10 | 7 |

Overlap between the primary rankings and Method of Moments rankings is **10 out of 10 (100%)** for batters and **10 out of 10 (100%)** for bowlers.

### Table 5.2: Bowler Credit Decomposition Identity (Top 10 Bowlers on HP Deliveries)
*Note: This identity holds by construction and checks arithmetic only.*

Every delivery credit decomposes exactly into run-suppression credit, wicket credit, and opponent offset:
$$\text{Credit} = (\mu_{\text{ctx}} - r_{\text{credit}}) + c_{\text{wkt}} \cdot w_{\text{credit}} + \alpha_{\text{lomo}}$$

| Primary Rank | Bowler (`player_id`) | $\text{mean}(\mu_{\text{ctx}} - r_{\text{credit}})$ | $\text{mean}(c_{\text{wkt}} \cdot w_{\text{credit}})$ | $\text{mean}(\alpha_{\text{lomo}})$ | Sum of Terms | Reported $H_{\text{raw}}$ | Difference |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Mitchell Santner (`4101`) | -0.118193 | +0.498175 | +0.074303 | +0.454285 | +0.454285 | 0.00e+00 |
| **2** | Kuldeep Yadav (`3644`) | -0.054807 | +0.445651 | +0.066938 | +0.457782 | +0.457782 | 0.00e+00 |
| **3** | Sunil Narine (`781`) | -0.090716 | +0.359908 | +0.087987 | +0.357180 | +0.357180 | 0.00e+00 |
| **4** | Axar Patel (`2876`) | -0.160490 | +0.486454 | +0.056139 | +0.382103 | +0.382103 | 0.00e+00 |
| **5** | Trent Boult (`2320`) | -0.173386 | +0.477481 | +0.089036 | +0.393131 | +0.393131 | 0.00e+00 |
| **6** | Krunal Pandya (`4219`) | -0.020237 | +0.349703 | +0.080758 | +0.410223 | +0.410223 | 0.00e+00 |
| **7** | Harshal Patel (`2261`) | -0.165183 | +0.326539 | +0.073054 | +0.234410 | +0.234410 | -2.78e-17 |
| **8** | Varun Chakravarthy (`6256`) | -0.246485 | +0.413581 | +0.078857 | +0.245953 | +0.245953 | -2.78e-17 |
| **9** | Mohammed Shami (`1566`) | -0.164064 | +0.644890 | +0.058793 | +0.539619 | +0.539619 | 0.00e+00 |
| **10** | Patrick Cummins (`1758`) | -0.108475 | +0.683713 | +0.096980 | +0.672218 | +0.672218 | 0.00e+00 |

Arithmetic differences are zero to machine precision, confirming exact mathematical accounting.

---

## 6. Reliability and Gates

### Table 6.1: Pre-Declared Validation Gate Evaluation
The evaluation protocol enforced seven pre-declared validation gates (G1 through G7). No gate thresholds were adjusted post-hoc.

| Gate | Description | Threshold | Batters Result ($N=78$) | Batters Status | Bowlers Result ($N=82$) | Bowlers Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **G1** | Identity tests pass (Task 1) | Max diff = 0.0 | Max diff = 0.00e+00 | **PASS** | Max diff = 0.00e+00 | **PASS** |
| **G2** | Calibration slope contains 1 & Width < 1.0 | 1 in [low, high] & Width < 1.0 | $\gamma_1 = 1.357$ [-0.513, 3.333] (Width=3.85) | **NOT INFORMATIVE** | $\gamma_1 = -56.747$ [-588.4, 474.0] (Width=1062.4) | **NOT INFORMATIVE** |
| **G3** | Split-half $r$ of primary metric (20 splits) | $r \ge 0.35$ | $r = 0.1447$ | **FAIL** | $r = 0.2537$ | **FAIL** |
| **G4** | Simulation study (Task 1) | CR1 $\in [85, 95]\%$, EB $\ge 85\%$, FPR $\le 10\%$ | CR1=87.7%, EB=60.1%, Null FPR=29.0% | **FAIL** | CR1=88.5%, EB=94.1%, Null FPR=19.0% | **FAIL** |
| **G5** | Omnibus permutation test | $p < 0.05$ | $S_{\text{obs}} = 123.93, p = 0.0020$ | **PASS** | $S_{\text{obs}} = 98.79, p = 0.0639$ | **FAIL** |
| **G6** | Rolling-origin Spearman ($\ge 2$ origins) | $\rho \ge 0.30$ ($N \ge 30$) | Max $\rho = 0.2522$ (0/4 $\ge 0.30$) | **FAIL** | Max $\rho = 0.1315$ (0/4 $\ge 0.30$) | **FAIL** |
| **G7** | Stability overlap across variations | Overlap $\ge 7/10$ | Min Overlap = 3/10 (Benchmark) / 9/10 (Methodology) | **FAIL** | Min Overlap = 4/10 (Benchmark) / 9/10 (Methodology) | **FAIL** |
| **Label** | Overall Gate Decision | All G1–G7 Passing | Failing / Not Informative: G2, G3, G4, G6, G7 | **EXPLORATORY** | Failing / Not Informative: G2, G3, G4, G5, G6, G7 | **EXPLORATORY** |

### 6.2 Detailed Failure Diagnostics
- **Gate G2 (Calibration Slope):** In held-out half evaluations, the 90% confidence interval for the calibration slope $\gamma_1$ contains 1.0 but exhibits immense widths (**3.85** for batters, **1062.4** for bowlers). Because the interval width exceeds 1.0, G2 is formally designated as **NOT INFORMATIVE**.
- **Gate G3 (Split-Half Reliability):** Across 20 random match splits, split-half correlation is $r = \mathbf{0.1447}$ for batters and $r = \mathbf{0.2537}$ for bowlers, failing the $r \ge 0.35$ threshold.
- **Gate G4 (Simulation Study):** G4 evaluates to **FAIL**. In simulation (100 replications), asymptotic chi-squared null rejection reaches **29.0%** for batters and **19.0%** for bowlers (exceeding the 10% threshold), and batter empirical Bayes coverage under Signal 1x drops to **60.1%** (below 85%). The permutation test was not evaluated inside the simulation loop due to compute bounds.
- **Gate G5 (Omnibus Permutation Test):** While batters achieve omnibus significance ($p = \mathbf{0.0020}$), bowlers fail ($S_{\text{obs}} = \mathbf{98.79}, p = \mathbf{0.0639}$). Furthermore, Gate G5 is a test of "all slopes zero", not individual skill. Because population-wide T20 run rates and dot-ball percentages shift substantially under pressure (Table 3), an omnibus rejection reflects cohort-level adaptation to match leverage rather than individual situational skill.
- **Gate G6 (Rolling-Origin Out-of-Time Prediction):** Across four consecutive seasonal transitions ($\le 2022 \to 2023$, $\le 2023 \to 2024$, $\le 2024 \to 2025$, $\le 2025 \to 2026$), out-of-time rank persistence fails to meet the $\rho \ge 0.30$ standard in any origin (batters max $\rho = \mathbf{0.2522}$, bowlers max $\rho = \mathbf{0.1315}$).
- **Gate G7 (Stability and Benchmark Overlap):** While methodology variations (volume cutoffs, match breadth, stratified centering, pressure weights) show high stability with overlaps $\ge 9/10$, overlap with naive benchmarks drops to **3/10** for batters (against baseline skill alone) and **4/10** for bowlers (against old theta and baseline alone). Because G7 requires $\ge 7/10$ across all variations including benchmarks, G7 evaluates to **FAIL**.

Importantly, prior variations (Split-Half vs DerSimonian-Laird vs Floor 0.0064) do not move bowler $H_{\text{low}}$ because the bowler split-half prior is floored at $10^{-4}$. The Method of Moments sensitivity check (Table 5.1) is the genuine empirical test of prior sensitivity, confirming 10 out of 10 overlap.

---

## 7. Limitations & Empirical Evidence

A complete assessment of pressure performance requires acknowledging structural limitations:

1. **Opponent Offset Positive Drift:**  
   Elite batters face opposing bowlers with an average LOMO rating $\beta_{\text{lomo}} = \mathbf{+0.056785}$ under high pressure versus $\mathbf{+0.051238}$ in ordinary situations—a positive drift of **+0.005547**. Bowlers face batters with $\alpha_{\text{lomo}} = \mathbf{+0.066761}$ under high pressure versus $\mathbf{+0.070082}$ in ordinary play (drift of **-0.003321**). This baseline drift elevates confrontation scores independently of execution.
2. **Dot-Ball Credit Imbalance:**  
   Under pressure, dot balls are heavily rewarded while boundary concession is penalised. Bowlers who concede occasional boundaries but bowl a high volume of dots in low-par environments receive inflated marks.
3. **Two Expectations Discrepancy:**  
   Net context baseline $\mu_{\text{ctx}} \approx \mathbf{0.95}$ differs fundamentally from gross scoring rates of **1.33 to 1.35 runs per ball**. Conflating these two baselines leads to misinterpretation of expected output.
4. **$c_{\text{wkt}}$-$P$ Overlap (Structural Collinearity):**  
   The dynamic wicket value $c_{\text{wkt}}$ is derived from win-probability swing, which correlates directly with Pressure Intensity $P_i$. High-pressure deliveries inherently assign higher credit to dismissals by mathematical construction, creating structural c_wkt-P overlap between pressure and wicket valuation. In extreme situations, $c_{\text{wkt}}$ can exceed +3.5 to +4.0 runs.
5. **Floored Bowler Prior:**  
   Bowler true slope heterogeneity under split-half estimation is zero/negative, forcing the prior to the lower floor $\tau^2_{\text{SH}} = \mathbf{0.000100}$. This drives heavy shrinkage toward zero, compressing bowler differentials into statistical ties.
6. **Pacer Wicket Dependence:**  
   Decomposition shows that fast bowlers in the top 10 rely overwhelmingly on wicket credit rather than run suppression. Mohammed Shami derives $\mathbf{+0.644890}$ of his $+0.539619$ $H_{\text{raw}}$ from wickets, while his run term is negative ($\mathbf{-0.164064}$). Similarly, Patrick Cummins derives $\mathbf{+0.683713}$ from wickets, with run term $\mathbf{-0.108475}$.
7. **Batter Sample Composition and Linked Baselines:**  
   Several top batters (e.g., Pathum Nissanka, Kusal Mendis) accumulate their volume primarily in T20 Internationals. Their baselines are linked through 61 shared players who compete in both IPL and T20Is.
8. **Extreme Chase Dependence:**  
   Exactly **75.0%** of all high-pressure deliveries occur in Innings 2 run chases. Top-order batters face almost their entire high-pressure sample while chasing: Yashasvi Jaiswal (**99.7%**), Virat Kohli (**97.1%**), Kusal Mendis (**95.3%**), and Pathum Nissanka (**93.1%**).
9. **Static vs Dynamic Wicket Value:**  
   While $c_{\text{wkt}}$ updates by ball, batting orders adapt strategically: when top batters fall early, teams reduce intent, altering the true subsequent value of a wicket.
10. **Data Horizon Cutoff:**  
    All conclusions are bounded by the **April 2026** historical data cutoff.

---

## 8. Reproducibility & Technical Specifications

All empirical results, tables, and diagnostics reported in this document are completely reproducible from code:
- **Random Seed:** 42 (`np.random.default_rng(42)`)
- **Execution Command:** `python run_pressure_pipeline.py --final`
- **Script SHA-256:** `fb9f3cc6c02685b2ac399fd5f2fe0755838cfe4e32ce5dbf34fd2e22f336b7f2`
- **Estimator SHA-256:** `115ea363238be95d1092d53783a40675fd459f9cb9ab795a488e48ebc6539a40`
- **Output Tables SHA-256 (Normalised):** `72fa75216d2d7632f22f48f165be169c0cd82c78f78f868d8ec1daa6fdcaa354`
- **Environment:** Python 3.14.0 | NumPy 2.5.4 | Pandas 3.1.1
