# FINAL_SUMMARY.md — SupeRR Selector Season 2 Pipeline Submission

## 1. Top 10 Batters (Submission Order)
Ranked strictly by Reliable High-Pressure Performance Lower Bound ($H_{\text{low}} = H_p - 1.645 \cdot \text{SE}_{\text{post}}$), with severe chokers filtered ($E_{\text{high}} \ge 0$):

1. **Heinrich Klaasen** (`4260`) — $H_p = +0.239$ [+0.157, +0.321] | $E_p = +0.001$ | Top-10 Inc = 89.0% | Mean Rank = 4.4 | Inn 2 HP Share = 53.3%
2. **Virat Kohli** (`47`) — $H_p = +0.206$ [+0.128, +0.284] | $E_p = +0.002$ | Top-10 Inc = 75.5% | Mean Rank = 9.0 | Inn 2 HP Share = 97.1% (Chase-Dependent)
3. **Pathum Nissanka** (`6931`) — $H_p = +0.204$ [+0.121, +0.286] | $E_p = +0.002$ | Top-10 Inc = 74.0% | Mean Rank = 8.4 | Inn 2 HP Share = 93.1% (Chase-Dependent)
4. **Tim David** (`6396`) — $H_p = +0.202$ [+0.117, +0.287] | $E_p = +0.000$ | Top-10 Inc = 66.5% | Mean Rank = 9.9 | Inn 2 HP Share = 70.0%
5. **Namboori Tilak Varma** (`7897`) — $H_p = +0.180$ [+0.108, +0.253] | $E_p = -0.001$ | Top-10 Inc = 53.5% | Mean Rank = 15.0 | Inn 2 HP Share = 69.6%
6. **Suryakumar Yadav** (`1699`) — $H_p = +0.185$ [+0.104, +0.266] | $E_p = -0.001$ | Top-10 Inc = 47.0% | Mean Rank = 16.6 | Inn 2 HP Share = 74.7%
7. **Prabhsimran Singh** (`7216`) — $H_p = +0.185$ [+0.101, +0.270] | $E_p = +0.001$ | Top-10 Inc = 38.5% | Mean Rank = 16.7 | Inn 2 HP Share = 90.4% (Chase-Dependent)
8. **Rovman Powell** (`4986`) — $H_p = +0.182$ [+0.099, +0.265] | $E_p = +0.000$ | Top-10 Inc = 38.5% | Mean Rank = 16.5 | Inn 2 HP Share = 63.2%
9. **Kusal Mendis** (`3672`) — $H_p = +0.184$ [+0.098, +0.270] | $E_p = +0.001$ | Top-10 Inc = 40.5% | Mean Rank = 15.8 | Inn 2 HP Share = 95.3% (Chase-Dependent)
10. **Yashasvi Jaiswal** (`6819`) — $H_p = +0.178$ [+0.093, +0.264] | $E_p = +0.001$ | Top-10 Inc = 33.5% | Mean Rank = 19.1 | Inn 2 HP Share = 99.7% (Chase-Dependent)

- **Scientific Label Decision:** **EXPLORATORY**
- **Failing Pre-Declared Gates:** G2 (Not Informative, width $3.85 \ge 1.0$), G3 (Split-Half Reliability $r = 0.1447 < 0.35$), G4 (Simulation EB Cov = 60.1% $< 85\%$, FPR = 29.0% $> 10\%$), G6 (Rolling-Origin Out-of-Time Spearman max $\rho = 0.2522 < 0.30$), G7 (Overlap with baseline alone is 30%, old theta is 40%).
- **Statistical Tie Note:** Positions 5 through 10 are a statistical tie: their $H_{\text{low}}$ values span $+0.0929$ to $+0.1077$ (a minuscule spread of $0.0148$, well within posterior estimation standard error $\text{SE}_{\text{post}} \approx 0.05$) and bootstrap inclusion probabilities range from 33.5% to 53.5%.

---

## 2. Top 10 Bowlers (Submission Order)
Ranked strictly by Reliable High-Pressure Performance Lower Bound ($H_{\text{low}} = H_p - 1.645 \cdot \text{SE}_{\text{post}}$), with severe chokers filtered ($E_{\text{high}} \ge 0$):

1. **Mitchell Santner** (`4101`) — $H_p = +0.119$ [+0.103, +0.136] | $E_p = +0.002$ | Top-10 Inc = 91.5% | Mean Rank = 4.4 | Inn 2 HP Share = 73.2%
2. **Kuldeep Yadav** (`3644`) — $H_p = +0.119$ [+0.102, +0.135] | $E_p = +0.001$ | Top-10 Inc = 88.5% | Mean Rank = 5.1 | Inn 2 HP Share = 61.5%
3. **Sunil Narine** (`781`) — $H_p = +0.118$ [+0.102, +0.135] | $E_p = +0.001$ | Top-10 Inc = 68.0% | Mean Rank = 9.5 | Inn 2 HP Share = 56.6%
4. **Axar Patel** (`2876`) — $H_p = +0.118$ [+0.102, +0.135] | $E_p = +0.002$ | Top-10 Inc = 63.0% | Mean Rank = 10.8 | Inn 2 HP Share = 64.2%
5. **Trent Boult** (`2320`) — $H_p = +0.118$ [+0.102, +0.135] | $E_p = +0.001$ | Top-10 Inc = 58.0% | Mean Rank = 11.5 | Inn 2 HP Share = 79.3%
6. **Krunal Pandya** (`4219`) — $H_p = +0.118$ [+0.102, +0.134] | $E_p = +0.001$ | Top-10 Inc = 54.0% | Mean Rank = 13.1 | Inn 2 HP Share = 88.5%
7. **Harshal Patel** (`2261`) — $H_p = +0.118$ [+0.102, +0.134] | $E_p = +0.001$ | Top-10 Inc = 57.0% | Mean Rank = 15.6 | Inn 2 HP Share = 80.0%
8. **Varun Chakravarthy** (`6256`) — $H_p = +0.118$ [+0.102, +0.134] | $E_p = -0.000$ | Top-10 Inc = 55.5% | Mean Rank = 14.5 | Inn 2 HP Share = 57.4%
9. **Mohammed Shami** (`1566`) — $H_p = +0.118$ [+0.101, +0.134] | $E_p = +0.001$ | Top-10 Inc = 32.5% | Mean Rank = 15.0 | Inn 2 HP Share = 73.5%
10. **Patrick Cummins** (`1758`) — $H_p = +0.118$ [+0.101, +0.134] | $E_p = +0.001$ | Top-10 Inc = 38.0% | Mean Rank = 14.4 | Inn 2 HP Share = 83.5%

- **Scientific Label Decision:** **EXPLORATORY**
- **Failing Pre-Declared Gates:** G2 (Not Informative, width $1062.4 \ge 1.0$), G3 (Split-Half Reliability $r = 0.2537 < 0.35$), G4 (Simulation Null FPR = 19.0% $> 10\%$), G5 (Omnibus Permutation $p = 0.0639 \ge 0.05$), G6 (Rolling-Origin Out-of-Time Spearman max $\rho = 0.1315 < 0.30$), G7 (Overlap with baseline alone is 40%, old theta is 40%).
- **Statistical Tie Note:** Positions 5 through 10 are a statistical tie: under primary prior $\tau^2_{\text{SH}} = 0.000100$, $H_{\text{low}}$ spans $+0.1013$ to $+0.1017$ (a spread of $0.0004$, well within $\text{SE}_{\text{post}} = 0.0100$). Under the sensitivity floor $\tau^2 = 0.006400$, all 10 bowlers remain identical in the exact same rank order.
- **Over-Level Economy Decision:** Ball-level bowler confrontation slope is indistinguishable from noise ($p = 0.0639$). An over-level economy metric controlling for `(phase x overid x pressure_bin)` is statistically usable ($S_{\text{obs}} = 247.47, p = 0.0010 < 0.05$, split-half $r = 0.2104 \ge 0.20$), showing that bowling pressure skill manifests at the tactical over-level through run suppression.

---

## 3. Four Core Methodological Findings
1. **Elevation is Not Reliably Estimable at Current Sample Sizes:**
   - Split-half covariance prior $\tau^2_{\text{SH}}$ is $0.0431$ (batters) and $0.000100$ (bowlers, floored at $10^{-4}$).
   - Split-half reliability fails ($r = 0.1447$ and $r = 0.2537$).
   - Rolling-origin predictive check fails across all seasonal origins (max $\rho = 0.2522$ and $0.1315$).
   - Simulation shows real-data SNR is $0.38$ (batters) and $0.02$ (bowlers), whereas an SNR of $0.67\text{--}0.72$ is required for $80\%$ statistical power.
2. **Rankings Are Skill-Dominated $H_{\text{low}}$ Metrics:**
   - Reliable High-Pressure Performance $H_p$ exhibits moderate to high correlation with underlying baseline skill ($r = 0.4919, \rho = 0.4740$ for batters; $r = 0.5676, \rho = 0.6990$ for bowlers).
   - This reflects cricket reality: performance in high-pressure moments is dominated by baseline skill executed under pressure rather than large situational slope shifts.
3. **Positions 5–10 Are a Statistical Tie:**
   - In both roles, differences in $H_{\text{low}}$ across positions 5 through 10 are smaller than the posterior standard error of measurement ($\Delta H_{\text{low}} = 0.0148$ vs $\text{SE} \approx 0.05$ for batters; $\Delta H_{\text{low}} = 0.0004$ vs $\text{SE} = 0.0100$ for bowlers).
4. **Bowler Alternative Over-Level Economy Decision:**
   - Ball-level confrontation elevation fails significance ($p = 0.0639$). However, over-level economy suppression under pressure is highly significant ($p = 0.0010$) and reproducible ($r = 0.2104$), validating over-level bowling management under high pressure.

---

## 4. Pre-Declared Validation Gate Evaluation Table (G1–G7)

| Gate | Description | Threshold | Batters Result (N=78) | Batters Status | Bowlers Result (N=82) | Bowlers Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **G1** | Identity tests pass (Task 1) | Max diff = 0.0 | Max diff = 0.00e+00 | **PASS** | Max diff = 0.00e+00 | **PASS** |
| **G2** | Calibration slope contains 1 & Width < 1.0 | 1 in [low, high] & Width < 1.0 | $\gamma_1 = 1.357$ [-0.513, 3.333] (Width=3.85) | **NOT INFORMATIVE** | $\gamma_1 = -56.747$ [-588.4, 474.0] (Width=1062.4) | **NOT INFORMATIVE** |
| **G3** | Split-half r of primary metric (20 splits) | r >= 0.35 | r = 0.1447 | **FAIL** | r = 0.2537 | **FAIL** |
| **G4** | Simulation study coverage & FPR (Task 1) | CR1 in [85, 95]%, EB >= 85%, FPR <= 10% | CR1=87.7%, EB=60.1%, Null FPR=29.0% | **FAIL** | CR1=88.5%, EB=94.1%, Null FPR=19.0% | **FAIL** |
| **G5** | Omnibus permutation test | p < 0.05 | S_obs=123.93, p=0.0020 | **PASS** | S_obs=98.79, p=0.0639 | **FAIL** |
| **G6** | Rolling-origin Spearman in >=2 origins | rho >= 0.30 (N >= 30) | Max rho = 0.2522 (0/4 >= 0.30) | **FAIL** | Max rho = 0.1315 (0/4 >= 0.30) | **FAIL** |
| **G7** | Top-10 overlap across stability variations | Overlap >= 7/10 | Min overlap = 3/10 (Benchmark) / 9/10 (Methodology) | **FAIL** | Min overlap = 4/10 (Benchmark) / 9/10 (Methodology) | **FAIL** |

- **Overall Label Decision:** **EXPLORATORY** for both roles.

---

## 5. Technical Specifications & Reproducibility
- **Pressure Definition & Weights:** Composite Pressure Intensity $P_i \in (0, 1)$ with sample mean $\bar{P} = 0.474$:
  $$P_i = 0.40 \cdot \text{PI}_i + 0.30 \cdot T_i + 0.20 \cdot W_i + 0.10 \cdot M_i$$
  Top quintile ($P_i \ge 0.601$) designates High-Pressure deliveries ($N = 37,114$, 20.0% of all deliveries).
- **Stratified Centering:** Batters centered within `(innings x batting_order_bucket)`; Bowlers centered within `(innings x phase)`.
- **Reproducibility:** Seed 42, deterministic execution, verified byte-identical output across consecutive `--final` runs.
