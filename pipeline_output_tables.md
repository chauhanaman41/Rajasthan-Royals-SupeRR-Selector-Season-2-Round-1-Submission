# SupeRR Selector Season 2 — Pipeline Computed Tables

- **Script SHA-256:** `fb9f3cc6c02685b2ac399fd5f2fe0755838cfe4e32ce5dbf34fd2e22f336b7f2`
- **Environment:** Python 3.14.0 | NumPy 2.5.4 | Pandas 3.1.1
- **Random Seed:** 42
- **Execution Mode:** `final` (Bootstrap B=200, Permutation B=1000, Simulation 100 reps)
- **Run Timestamp:** 2026-11-15 14:13:45

**Overall Validation Gate Status:** `EXPLORATORY`

---

### Table 1: Dataset Scoping & Validation Audit Summary

| Scoping Stage                                     | Matches Excluded | Deliveries Excluded | Remaining Matches    | Remaining Deliveries      | Verification Notes                                                              |
| ------------------------------------------------- | ---------------- | ------------------- | -------------------- | ------------------------- | ------------------------------------------------------------------------------- |
| 0. Raw `matches.csv` & `ball_by_ball.csv`         | —                | —                   | 867 in BBB (883 raw) | 200,999                   | 16 abandoned matches have no BBB delivery records                               |
| 1. Exclude Non-IPL/T20I (`comp_id` 2670, 3289)    | 30               | 6,985               | 837                  | 194,014                   | Removes Emerging Teams Asia Cup & Rising Stars                                  |
| 2. Exclude <2 Innings & Super-Over Rows           | 22               | 1,549               | 815                  | 192,465                   | Removes single-innings washouts and super-over innings (inn 3–4)                |
| 3. Exclude DLS Revised Matches (`revised_target`) | 29               | 4,826               | 786                  | 187,639                   | Removes matches with revised overs or targets                                   |
| 4. Exclude Ties / Eliminators / No Result         | 9                | 2,072               | **777**              | **185,567**               | Includes match_id=13613 (164-164 tie decided by One-Over Eliminator)            |
| 5. In-Place Anomaly Repairs (`audit_log.csv`)     | 0                | 0                   | **777**              | **185,567**               | Repairs 2 anomalies (match_id=37086 striker dup & match_id=40709 Retire Out ID) |
| 6. Full-Member vs. Associate Tagging              | —                | —                   | 354 IPL / 423 T20I   | 85,486 IPL / 100,081 T20I | 373 T20Is Full-Member vs. Full-Member; 50 involve Associates                    |

---

### Table 2: Out-of-Fold Win Probability Calibration

*Brier Scores: Inn 1 = 0.2228, Inn 2 = 0.1308, Pooled = 0.1787*

| Decile Bin       | Inn 1 Pred WP | Inn 1 Obs Win% | Inn 1 Balls | Inn 2 Pred WP | Inn 2 Obs Win% | Inn 2 Balls | Pooled Abs Err |
| ---------------- | ------------- | -------------- | ----------- | ------------- | -------------- | ----------- | -------------- |
| **1 (0.0–0.1)**  | 0.058         | 0.172          | 1,032       | 0.022         | 0.065          | 25,886      | 0.046          |
| **2 (0.1–0.2)**  | 0.165         | 0.149          | 5,002       | 0.147         | 0.213          | 4,974       | 0.025          |
| **3 (0.2–0.3)**  | 0.252         | 0.258          | 6,815       | 0.249         | 0.301          | 3,771       | 0.023          |
| **4 (0.3–0.4)**  | 0.356         | 0.347          | 12,606      | 0.351         | 0.337          | 7,133       | 0.011          |
| **5 (0.4–0.5)**  | 0.451         | 0.452          | 17,701      | 0.447         | 0.466          | 5,953       | 0.005          |
| **6 (0.5–0.6)**  | 0.550         | 0.552          | 22,566      | 0.549         | 0.535          | 4,853       | 0.001          |
| **7 (0.6–0.7)**  | 0.647         | 0.654          | 22,789      | 0.652         | 0.671          | 4,793       | 0.010          |
| **8 (0.7–0.8)**  | 0.739         | 0.723          | 5,755       | 0.752         | 0.755          | 8,155       | 0.005          |
| **9 (0.8–0.9)**  | 0.835         | 0.797          | 1,722       | 0.846         | 0.836          | 7,417       | 0.015          |
| **10 (0.9–1.0)** | 0.951         | 0.895          | 695         | 0.977         | 0.963          | 15,949      | 0.016          |

---

### Table 3: High-Pressure vs Ordinary Regime Separation

| Regime / Situation Bucket                       | Share Flagged HP (%) | Mean Pressure Intensity | Run Rate (rpo) | Dot Ball % | Boundary % | Wicket % | Mean Leverage Swing |
| ----------------------------------------------- | -------------------- | ----------------------- | -------------- | ---------- | ---------- | -------- | ------------------- |
| **Ordinary Deliveries ($P_i < P_{80}$)**        | 0.0% (by def)        | 0.417                   | 9.07           | 33.1%      | 18.5%      | 5.49%    | 0.0482              |
| **High-Pressure Deliveries ($P_i \ge P_{80}$)** | 100.0% (by def)      | 0.700                   | 8.17           | 36.4%      | 16.2%      | 4.88%    | 0.1311              |
| **Steep Chases (RRR > 12, $\ge$ 4 Overs Left)** | 7.1%                 | 0.512                   | 9.22           | 32.6%      | 18.5%      | 6.70%    | 0.0182              |
| **Early Collapses ($\ge$ 3 Wkts in Powerplay)** | 54.2%                | 0.614                   | 7.00           | 47.5%      | 15.4%      | 3.28%    | 0.0593              |
| **Innings 1 Share of High-Pressure Pool**       | 25.0% of HP          | 0.700                   | 8.17           | 36.4%      | 16.2%      | 4.88%    | 0.1311              |
| **Innings 2 Share of High-Pressure Pool**       | 75.0% of HP          | 0.700                   | 8.17           | 36.4%      | 16.2%      | 4.88%    | 0.1311              |

---

### Table 4: Pre-Ranking Validation Gate Diagnostics

| Validation Test / Metric                                                  | Eligible Batters ($N=78$) | Eligible Bowlers ($N=82$) | Gate Threshold            | Gate Outcome & Status           |
| ------------------------------------------------------------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------------- |
| **G1: Split-Half Reliability of Ranking Metric ($\hat{\delta}\Delta P$)** | $r = 0.268$ ($N=11$)      | $r = -0.118$ ($N=16$)     | $r \ge 0.35$              | **FAIL** / **FAIL**             |
| **Split-Half Reliability of Baseline ($\alpha, \beta$)**                  | $r = 0.697$ ($N=11$)      | $r = 0.072$ ($N=16$)      | $r \ge 0.35$              | **PASS** / **FAIL**             |
| **Split-Half Reliability of Raw Slope ($\tilde{\delta}$)**                | $r = 0.339$ ($N=11$)      | $r = -0.013$ ($N=16$)     | $r \ge 0.20$              | **PASS** / **FAIL**             |
| **G2: Omnibus Permutation Test on $S = \sum z_p^2$ (Wild-Cluster)**       | $S = 106.2, p = 0.0160$   | $S = 90.1, p = 0.1958$    | $p < 0.05$                | **PASS** / **FAIL**             |
| **G3: Rolling-Origin Predictive Check (Seasons $t \to t+1$)**             | FAIL ($r=0.168, N=78$)    | FAIL ($r=-0.028, N=91$)   | $r \ge 0.30$ ($N \ge 30$) | **FAIL** / **FAIL**             |
| **Empirical Heterogeneity (DerSimonian–Laird $\hat{\tau}_\delta^2$)**     | $\hat{\tau}^2 = 0.0519$   | $\hat{\tau}^2 = 0.0020$   | Informative               | Elevations shrunken toward zero |

---

### Table 4b: Simulation Validation Study & Stop Rule Audit (Task 3.4)

| Role    | Scenario        | SNR  | CR1 Cov (All / Top 10) | EB Cov (All / Top 10) | Omnibus Rejection | MSE Reduction |
| ------- | --------------- | ---- | ---------------------- | --------------------- | ----------------- | ------------- |
| Batters | Null            | 0.00 | 87.5% / 54.4%          | 99.7% / 98.7%         | 29.0% (FPR)       | +98.0%        |
| Batters | Signal 1x       | 0.38 | 87.7% / 56.0%          | 60.1% / 57.1%         | 43.0% (Power)     | +90.2%        |
| Batters | Signal 2x       | 0.76 | 87.8% / 60.7%          | 77.1% / 75.4%         | 91.0% (Power)     | +72.4%        |
| Batters | Signal 4x       | 1.52 | 87.8% / 71.2%          | 88.2% / 85.3%         | 100.0% (Power)    | +42.5%        |
| Bowlers | Null            | 0.00 | 88.4% / 55.4%          | 99.8% / 99.2%         | 19.0% (FPR)       | +98.7%        |
| Bowlers | Signal 1x       | 0.02 | 88.5% / 54.8%          | 94.1% / 92.3%         | 16.0% (Power)     | +98.6%        |
| Bowlers | Signal 2x       | 0.04 | 88.5% / 55.2%          | 79.0% / 79.5%         | 19.0% (Power)     | +98.5%        |
| Bowlers | Signal 4x       | 0.08 | 88.6% / 58.2%          | 64.3% / 63.1%         | 17.0% (Power)     | +98.3%        |
| Bowlers | Signal tau 0.05 | 0.09 | 88.8% / 54.5%          | 57.1% / 56.1%         | 21.0% (Power)     | +97.5%        |
| Bowlers | Signal tau 0.10 | 0.19 | 88.6% / 57.0%          | 54.5% / 53.0%         | 17.0% (Power)     | +95.5%        |
| Bowlers | Signal tau 0.20 | 0.38 | 88.4% / 56.7%          | 62.5% / 60.5%         | 45.0% (Power)     | +87.3%        |

---

### Table 4c: Bowler Alternative Pressure Measures Evaluation (Task 5)

| Bowling Pressure Measure                                | Observed $S_{	ext{obs}}$ | Permuted Mean $S_{	ext{perm}}$ | Permutation $p$-value | Significance Threshold                     | Outcome                       |
| ------------------------------------------------------- | ------------------------ | ------------------------------ | --------------------- | ------------------------------------------ | ----------------------------- |
| **Net Credit Slope (Ball-Level Confrontation)**         | $S = 90.07$              | $79.60$                        | **0.1948**            | $p < 0.05$                                 | **FAIL**                      |
| **Economy vs Expectation in HP Overs (Over-Level)**     | $S = 247.47$             | $80.11$                        | **0.0010**            | $p < 0.05$                                 | **PASS**                      |
| **Wicket Rate vs Expectation on HP Balls (Ball-Level)** | $S = 65.08$              | $80.58$                        | **0.9211**            | $p < 0.05$                                 | **FAIL**                      |
| **Decision Rule Verdict**                               | —                        | —                              | —                     | Omnibus $p < 0.05$ on at least one measure | **POTENTIAL_SIGNAL_DETECTED** |

---

### Table 4d: Rolling-Origin Out-of-Time Predictive Check (Task 6)

| Role               | Seasonal Window | Eligible Overlap N | Pearson Correlation $r$ | Spearman Correlation $\rho$ |
| ------------------ | --------------- | ------------------ | ----------------------- | --------------------------- |
| Batters            | <=2022 -> 2023  | 0                  | N/A                     | N/A                         |
| Batters            | <=2023 -> 2024  | 10                 | 0.201                   | 0.091                       |
| Batters            | <=2024 -> 2025  | 29                 | 0.139                   | 0.206                       |
| Batters            | <=2025 -> 2026  | 39                 | 0.250                   | 0.341                       |
| **Batters Pooled** | All Origins     | **78**             | **0.168**               | **0.223**                   |
| Bowlers            | <=2022 -> 2023  | 3                  | N/A                     | N/A                         |
| Bowlers            | <=2023 -> 2024  | 14                 | -0.218                  | -0.178                      |
| Bowlers            | <=2024 -> 2025  | 31                 | 0.171                   | 0.158                       |
| Bowlers            | <=2025 -> 2026  | 43                 | -0.068                  | -0.038                      |
| **Bowlers Pooled** | All Origins     | **91**             | **-0.028**              | **-0.016**                  |

---

### Table 5a: Top 10 Batters Ranked by Reliable High-Pressure Performance (EXPLORATORY)

| Rank   | Player (`player_id`)              | Total Balls | HP Balls | Total Matches | HP Matches | Reliable HP Performance $H_p$ [90% EB CI] | Shrunk Elevation $E_p$ | Consistency Gap [90% Wilson CI] | Top-10 Inc Prob | Mean Rank | Inn 2 HP Share (%) |
| ------ | --------------------------------- | ----------- | -------- | ------------- | ---------- | ----------------------------------------- | ---------------------- | ------------------------------- | --------------- | --------- | ------------------ |
| **1**  | **Heinrich Klaasen** (`4260`)     | 1,401       | 285      | 70            | 70         | **+0.239** [+0.157, +0.321]               | +0.001                 | +0.158 [-0.038, +0.291]         | 89.0%           | 4.4       | 53.3%              |
| **2**  | **Virat Kohli** (`47`)            | 2,442       | 378      | 88            | 88         | **+0.206** [+0.128, +0.284]               | +0.002                 | +0.014 [-0.198, +0.192]         | 75.5%           | 9.0       | 97.1% (Chase-Dep)  |
| **3**  | **Pathum Nissanka** (`6931`)      | 1,381       | 317      | 67            | 67         | **+0.204** [+0.121, +0.286]               | +0.002                 | +0.395 [+0.172, +0.534]         | 74.0%           | 8.4       | 93.1% (Chase-Dep)  |
| **4**  | **Tim David** (`6396`)            | 1,154       | 300      | 93            | 93         | **+0.202** [+0.117, +0.287]               | +0.000                 | +0.030 [-0.156, +0.167]         | 66.5%           | 9.9       | 70.0%              |
| **5**  | **Namboori Tilak Varma** (`7897`) | 2,310       | 774      | 115           | 115        | **+0.180** [+0.108, +0.253]               | -0.001                 | -0.014 [-0.172, +0.135]         | 53.5%           | 15.0      | 69.6%              |
| **6**  | **Suryakumar Yadav** (`1699`)     | 2,614       | 514      | 130           | 130        | **+0.185** [+0.104, +0.266]               | -0.001                 | -0.096 [-0.256, +0.049]         | 47.0%           | 16.6      | 74.7%              |
| **7**  | **Prabhsimran Singh** (`7216`)    | 1,033       | 366      | 56            | 56         | **+0.185** [+0.101, +0.270]               | +0.001                 | +0.141 [-0.084, +0.336]         | 38.5%           | 16.7      | 90.4% (Chase-Dep)  |
| **8**  | **Rovman Powell** (`4986`)        | 1,524       | 315      | 97            | 97         | **+0.182** [+0.099, +0.265]               | +0.000                 | +0.150 [-0.054, +0.307]         | 38.5%           | 16.5      | 63.2%              |
| **9**  | **Kusal Mendis** (`3672`)         | 1,220       | 236      | 61            | 61         | **+0.184** [+0.098, +0.270]               | +0.001                 | +0.073 [-0.181, +0.278]         | 40.5%           | 15.8      | 95.3% (Chase-Dep)  |
| **10** | **Yashasvi Jaiswal** (`6819`)     | 1,739       | 375      | 82            | 82         | **+0.178** [+0.093, +0.264]               | +0.001                 | +0.059 [-0.145, +0.223]         | 33.5%           | 19.1      | 99.7% (Chase-Dep)  |

---

### Table 5b: Top 10 Batters Ranked by Shrunk Situational Elevation (EXPLORATORY)

| Rank   | Player (`player_id`)           | Total Balls | HP Balls | Total Matches | HP Matches | Shrunk Elevation $\hat{\delta}_p\Delta P$ | Shrunk Slope $\hat{\delta}_p$ | $\Delta P_{\text{stratum}}$ | Consistency Gap [90% Wilson CI] |
| ------ | ------------------------------ | ----------- | -------- | ------------- | ---------- | ----------------------------------------- | ----------------------------- | --------------------------- | ------------------------------- |
| **1**  | **Prabhsimran Singh** (`7216`) | 1,033       | 366      | 56            | 56         | **+0.052**                                | +0.230                        | 0.226                       | +0.141 [-0.084, +0.336]         |
| **2**  | **Ajinkya Rahane** (`167`)     | 991         | 172      | 53            | 53         | **+0.047**                                | +0.205                        | 0.231                       | n/a                             |
| **3**  | **Kusal Mendis** (`3672`)      | 1,220       | 236      | 61            | 61         | **+0.043**                                | +0.219                        | 0.196                       | +0.073 [-0.181, +0.278]         |
| **4**  | **Heinrich Klaasen** (`4260`)  | 1,401       | 285      | 70            | 70         | **+0.041**                                | +0.194                        | 0.209                       | +0.158 [-0.038, +0.291]         |
| **5**  | **Cameron Green** (`5939`)     | 1,038       | 251      | 60            | 60         | **+0.028**                                | +0.139                        | 0.205                       | +0.098 [-0.128, +0.279]         |
| **6**  | **Rovman Powell** (`4986`)     | 1,524       | 315      | 97            | 97         | **+0.026**                                | +0.133                        | 0.196                       | +0.150 [-0.054, +0.307]         |
| **7**  | **Mohammad Nabi** (`1107`)     | 615         | 155      | 46            | 46         | **+0.024**                                | +0.139                        | 0.176                       | n/a                             |
| **8**  | **Rohit Sharma** (`126`)       | 1,509       | 399      | 87            | 87         | **+0.023**                                | +0.104                        | 0.219                       | -0.148 [-0.340, +0.051]         |
| **9**  | **Harry Tector** (`4812`)      | 768         | 176      | 40            | 40         | **+0.022**                                | +0.108                        | 0.208                       | n/a                             |
| **10** | **Riyan Parag** (`6423`)       | 1,040       | 217      | 66            | 66         | **+0.022**                                | +0.095                        | 0.227                       | +0.020 [-0.202, +0.224]         |

---

### Table 5c: Top 10 Batters Ranked by Total Rating (Old Theta — Comparison Only)

| Rank   | Player (`player_id`)               | Old Total Rating $\hat{\theta}_p$ | Baseline $\hat{\alpha}_p$ | Shrunk Elevation $\hat{\delta}_p\Delta P$ | Baseline % of Total |
| ------ | ---------------------------------- | --------------------------------- | ------------------------- | ----------------------------------------- | ------------------- |
| **1**  | **Vaibhav Sooryavanshi** (`50284`) | **+0.420**                        | +0.420                    | -0.000                                    | 100.1%              |
| **2**  | **Tim David** (`6396`)             | **+0.335**                        | +0.329                    | +0.006                                    | 98.2%               |
| **3**  | **Heinrich Klaasen** (`4260`)      | **+0.299**                        | +0.259                    | +0.041                                    | 86.5%               |
| **4**  | **Suryakumar Yadav** (`1699`)      | **+0.268**                        | +0.321                    | -0.053                                    | 119.7%              |
| **5**  | **Abhishek Sharma** (`6281`)       | **+0.267**                        | +0.316                    | -0.049                                    | 118.3%              |
| **6**  | **Andre Russell** (`1318`)         | **+0.233**                        | +0.228                    | +0.005                                    | 98.0%               |
| **7**  | **Phil Salt** (`5553`)             | **+0.197**                        | +0.261                    | -0.064                                    | 132.7%              |
| **8**  | **Sai Sudharsan** (`23450`)        | **+0.184**                        | +0.169                    | +0.015                                    | 91.9%               |
| **9**  | **Josh Inglis** (`4736`)           | **+0.178**                        | +0.186                    | -0.009                                    | 105.0%              |
| **10** | **Namboori Tilak Varma** (`7897`)  | **+0.177**                        | +0.183                    | -0.005                                    | 103.1%              |

---

### Table 5 Overlap Matrix: Batters Ranking Agreement

| Ranking Pair                                 | Shared Top-10 Count | Overlap % | Shared Player Names                                                 |
| -------------------------------------------- | ------------------- | --------- | ------------------------------------------------------------------- |
| (a) Primary Rank vs (b) Shrunk Elevation     | 4 / 10              | 40%       | Prabhsimran Singh, Rovman Powell, Kusal Mendis, Heinrich Klaasen    |
| (a) Primary Rank vs (c) Old Total Rating     | 4 / 10              | 40%       | Tim David, Namboori Tilak Varma, Suryakumar Yadav, Heinrich Klaasen |
| (b) Shrunk Elevation vs (c) Old Total Rating | 1 / 10              | 10%       | Heinrich Klaasen                                                    |
| All Three Rankings (a & b & c)               | 1 / 10              | 10%       | Heinrich Klaasen                                                    |

---

### Table 6a: Top 10 Bowlers Ranked by Reliable High-Pressure Performance (EXPLORATORY)

| Rank   | Player (`player_id`)            | Total Balls | HP Balls | Total Matches | HP Matches | Reliable HP Performance $H_p$ [90% EB CI] | Shrunk Elevation $E_p$ | Consistency Gap [90% Wilson CI] | Top-10 Inc Prob | Mean Rank | Inn 2 HP Share (%) |
| ------ | ------------------------------- | ----------- | -------- | ------------- | ---------- | ----------------------------------------- | ---------------------- | ------------------------------- | --------------- | --------- | ------------------ |
| **1**  | **Mitchell Santner** (`4101`)   | 1,725       | 340      | 79            | 79         | **+0.119** [+0.103, +0.136]               | +0.002                 | +0.131 [-0.058, +0.292]         | 91.5%           | 4.4       | 73.2%              |
| **2**  | **Kuldeep Yadav** (`3644`)      | 1,866       | 403      | 84            | 84         | **+0.119** [+0.102, +0.135]               | +0.001                 | +0.234 [+0.054, +0.382]         | 88.5%           | 5.1       | 61.5%              |
| **3**  | **Sunil Narine** (`781`)        | 1,479       | 410      | 64            | 64         | **+0.118** [+0.102, +0.135]               | +0.001                 | +0.080 [-0.098, +0.235]         | 68.0%           | 9.5       | 56.6%              |
| **4**  | **Axar Patel** (`2876`)         | 2,609       | 548      | 130           | 130        | **+0.118** [+0.102, +0.135]               | +0.002                 | +0.171 [+0.021, +0.302]         | 63.0%           | 10.8      | 64.2%              |
| **5**  | **Trent Boult** (`2320`)        | 1,562       | 376      | 67            | 67         | **+0.118** [+0.102, +0.135]               | +0.001                 | +0.107 [-0.085, +0.281]         | 58.0%           | 11.5      | 79.3%              |
| **6**  | **Krunal Pandya** (`4219`)      | 1,255       | 287      | 64            | 64         | **+0.118** [+0.102, +0.134]               | +0.001                 | +0.091 [-0.113, +0.273]         | 54.0%           | 13.1      | 88.5%              |
| **7**  | **Harshal Patel** (`2261`)      | 1,688       | 439      | 76            | 76         | **+0.118** [+0.102, +0.134]               | +0.001                 | +0.174 [-0.004, +0.329]         | 57.0%           | 15.6      | 80.0%              |
| **8**  | **Varun Chakravarthy** (`6256`) | 2,083       | 502      | 91            | 91         | **+0.118** [+0.102, +0.134]               | -0.000                 | +0.079 [-0.085, +0.225]         | 55.5%           | 14.5      | 57.4%              |
| **9**  | **Mohammed Shami** (`1566`)     | 1,259       | 249      | 54            | 54         | **+0.118** [+0.101, +0.134]               | +0.001                 | +0.137 [-0.086, +0.325]         | 32.5%           | 15.0      | 73.5%              |
| **10** | **Patrick Cummins** (`1758`)    | 1,161       | 158      | 49            | 49         | **+0.118** [+0.101, +0.134]               | +0.001                 | +0.311 [+0.055, +0.487]         | 38.0%           | 14.4      | 83.5%              |

---

### Table 6b: Top 10 Bowlers Ranked by Shrunk Situational Elevation (EXPLORATORY)

| Rank   | Player (`player_id`)          | Total Balls | HP Balls | Total Matches | HP Matches | Shrunk Elevation $\hat{\delta}_q\Delta P$ | Shrunk Slope $\hat{\delta}_q$ | $\Delta P_{\text{stratum}}$ | Consistency Gap [90% Wilson CI] |
| ------ | ----------------------------- | ----------- | -------- | ------------- | ---------- | ----------------------------------------- | ----------------------------- | --------------------------- | ------------------------------- |
| **1**  | **Kuldeep Yadav** (`3644`)    | 1,866       | 403      | 84            | 84         | **+0.012**                                | +0.056                        | 0.219                       | +0.234 [+0.054, +0.382]         |
| **2**  | **Harshit Rana** (`29888`)    | 904         | 273      | 42            | 42         | **+0.008**                                | +0.035                        | 0.218                       | +0.172 [-0.053, +0.363]         |
| **3**  | **Jason Holder** (`2633`)     | 2,020       | 359      | 87            | 87         | **+0.007**                                | +0.031                        | 0.219                       | -0.068 [-0.233, +0.103]         |
| **4**  | **Krunal Pandya** (`4219`)    | 1,255       | 287      | 64            | 64         | **+0.007**                                | +0.029                        | 0.230                       | +0.091 [-0.113, +0.273]         |
| **5**  | **Sunil Narine** (`781`)      | 1,479       | 410      | 64            | 64         | **+0.006**                                | +0.030                        | 0.214                       | +0.080 [-0.098, +0.235]         |
| **6**  | **Axar Patel** (`2876`)       | 2,609       | 548      | 130           | 130        | **+0.006**                                | +0.030                        | 0.210                       | +0.171 [+0.021, +0.302]         |
| **7**  | **Harshal Patel** (`2261`)    | 1,688       | 439      | 76            | 76         | **+0.006**                                | +0.025                        | 0.236                       | +0.174 [-0.004, +0.329]         |
| **8**  | **Trent Boult** (`2320`)      | 1,562       | 376      | 67            | 67         | **+0.005**                                | +0.027                        | 0.205                       | +0.107 [-0.085, +0.281]         |
| **9**  | **Ravindra Jadeja** (`152`)   | 1,363       | 378      | 71            | 71         | **+0.005**                                | +0.024                        | 0.224                       | +0.125 [-0.073, +0.302]         |
| **10** | **Mitchell Santner** (`4101`) | 1,725       | 340      | 79            | 79         | **+0.005**                                | +0.022                        | 0.220                       | +0.131 [-0.058, +0.292]         |

---

### Table 6c: Top 10 Bowlers Ranked by Total Rating (Old Beta — Comparison Only)

| Rank   | Player (`player_id`)            | Old Total Rating $\hat{\theta}_q$ | Baseline $\hat{\beta}_q$ | Shrunk Elevation $\hat{\delta}_q\Delta P$ | Baseline % of Total |
| ------ | ------------------------------- | --------------------------------- | ------------------------ | ----------------------------------------- | ------------------- |
| **1**  | **Jasprit Bumrah** (`2933`)     | **+0.270**                        | +0.270                   | -0.001                                    | 100.3%              |
| **2**  | **Bhuvneshwar Kumar** (`360`)   | **+0.260**                        | +0.258                   | +0.002                                    | 99.3%               |
| **3**  | **Sunil Narine** (`781`)        | **+0.239**                        | +0.233                   | +0.006                                    | 97.3%               |
| **4**  | **Varun Chakravarthy** (`6256`) | **+0.215**                        | +0.212                   | +0.002                                    | 98.9%               |
| **5**  | **Kuldeep Yadav** (`3644`)      | **+0.214**                        | +0.202                   | +0.012                                    | 94.3%               |
| **6**  | **Josh Hazlewood** (`830`)      | **+0.209**                        | +0.206                   | +0.003                                    | 98.5%               |
| **7**  | **Jacob Duffy** (`22920`)       | **+0.199**                        | +0.198                   | +0.002                                    | 99.0%               |
| **8**  | **Shaheen Afridi** (`6355`)     | **+0.182**                        | +0.181                   | +0.002                                    | 99.1%               |
| **9**  | **Mohammad Nawaz** (`2490`)     | **+0.177**                        | +0.177                   | -0.000                                    | 100.1%              |
| **10** | **Mohammed Shami** (`1566`)     | **+0.176**                        | +0.173                   | +0.003                                    | 98.6%               |

---

### Table 6 Overlap Matrix: Bowlers Ranking Agreement

| Ranking Pair                                 | Shared Top-10 Count | Overlap % | Shared Player Names                                                                                  |
| -------------------------------------------- | ------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| (a) Primary Rank vs (b) Shrunk Elevation     | 7 / 10              | 70%       | Mitchell Santner, Sunil Narine, Trent Boult, Harshal Patel, Krunal Pandya, Axar Patel, Kuldeep Yadav |
| (a) Primary Rank vs (c) Old Total Rating     | 4 / 10              | 40%       | Varun Chakravarthy, Kuldeep Yadav, Sunil Narine, Mohammed Shami                                      |
| (b) Shrunk Elevation vs (c) Old Total Rating | 2 / 10              | 20%       | Kuldeep Yadav, Sunil Narine                                                                          |
| All Three Rankings (a & b & c)               | 2 / 10              | 20%       | Kuldeep Yadav, Sunil Narine                                                                          |

---

### Exposure Diagnostic: High-Pressure Exposure by Batting Position

| Batting Position Bucket | Total Deliveries | HP Deliveries | HP Exposure Rate (%) | Mean Pressure Intensity |
| ----------------------- | ---------------- | ------------- | -------------------- | ----------------------- |
| Order 1-2               | 63,462           | 11,093        | **17.5%**            | 0.436                   |
| Order 3-4               | 56,309           | 11,770        | **20.9%**            | 0.474                   |
| Order 5-7               | 51,125           | 12,133        | **23.7%**            | 0.510                   |
| Order 8-11              | 14,671           | 2,118         | **14.4%**            | 0.508                   |

---

### Table 7: Robustness, Sensitivity, and Naive-Metric Comparison

| Stability / Sensitivity Test                  | Batters Top-10 Overlap | Bowlers Top-10 Overlap | Empirical Implication                                       |
| --------------------------------------------- | ---------------------- | ---------------------- | ----------------------------------------------------------- |
| Volume +25% (Balls & HP)                      | 10 / 10                | 10 / 10                | **PASS** (Strict volume preserves top 10 identically)       |
| Volume -25% (Balls & HP)                      | 10 / 10                | 10 / 10                | **PASS** (Relaxed cutoff invariant)                         |
| HP Match Breadth = 10                         | 9 / 10                 | 10 / 10                | **PASS** (High stability)                                   |
| HP Match Breadth = 15 (Baseline)              | 10 / 10                | 10 / 10                | **PASS** (Baseline)                                         |
| HP Match Breadth = 19                         | 10 / 10                | 9 / 10                 | **PASS** (Stricter breadth preserves 9/10+)                 |
| Prior Choice = Split-Half (SH)                | 10 / 10                | 10 / 10                | **PASS** (Baseline)                                         |
| Prior Choice = DerSimonian-Laird (DL)         | 10 / 10                | 10 / 10                | **PASS** (Invariant)                                        |
| Prior Choice = Floor (0.0064) Sensitivity     | 10 / 10                | 10 / 10                | **PASS** (Invariant across priors)                          |
| Centering (Strata vs Global)                  | 10 / 10                | 10 / 10                | **PASS** (Within-state mean preserves top 10)               |
| Pressure Pillar Weights (+/-0.10)             | 9 / 10                 | 9 / 10                 | **PASS** (Weights perturbation robust)                      |
| Benchmark: Overlap with Old Theta Top 10      | 4 / 10                 | 4 / 10                 | **DISCRIMINATES** (40% Bat / 40% Bowl Overlap)              |
| Benchmark: Overlap with Baseline Alone Top 10 | 3 / 10                 | 4 / 10                 | **DISCRIMINATES** (30% Bat / 40% Bowl Overlap)              |
| Naive Benchmark (Raw HP SR / Eco)             | 5 / 10                 | 3 / 10                 | **DISCRIMINATES** (Low overlap confirms context adjustment) |

---

### Table 8: Comprehensive Validation Gate Evaluation (Tasks 7.1 - 7.3)

| Pre-Declared Validation Gate                                          | Batters Result (N=78)                               | Batters Status      | Bowlers Result (N=82)                               | Bowlers Status      |
| --------------------------------------------------------------------- | --------------------------------------------------- | ------------------- | --------------------------------------------------- | ------------------- |
| G1: Identity Tests Pass (Task 1)                                      | Max diff = 0.00e+00                                 | **PASS**            | Max diff = 0.00e+00                                 | **PASS**            |
| G2: Calibration Slope Contains 1 & Width < 1.0                        | gamma_1 = 1.357 [-0.513, 3.333] (Width=3.85)        | **NOT INFORMATIVE** | gamma_1 = -56.747 [-588.4, 474.0] (Width=1062.4)    | **NOT INFORMATIVE** |
| G3: Split-Half Reliability r >= 0.35 (20 Splits)                      | r = 0.1447                                          | **FAIL**            | r = 0.2537                                          | **FAIL**            |
| G4: Simulation Study (Task 1: CR1 in [85,95]%, EB >= 85%, FPR <= 10%) | CR1=87.7%, EB=60.1%, Null FPR=29.0%                 | **FAIL**            | CR1=88.5%, EB=94.1%, Null FPR=19.0%                 | **FAIL**            |
| G5: Omnibus Permutation p < 0.05 (Task 7.1)                           | S_obs=123.93, p = 0.0020                            | **PASS**            | S_obs=98.79, p = 0.0639                             | **FAIL**            |
| G6: Rolling-Origin Spearman >= 0.30 (>=2 Origins)                     | Max rho = 0.2522 (0/4 >= 0.30)                      | **FAIL**            | Max rho = 0.1315 (0/4 >= 0.30)                      | **FAIL**            |
| G7: Stability Overlap >= 7/10 Across Variations                       | Min Overlap = 3/10 (Benchmark) / 9/10 (Methodology) | **FAIL**            | Min Overlap = 4/10 (Benchmark) / 9/10 (Methodology) | **FAIL**            |
| Overall Gate Status                                                   | Failing / Not Informative: G2, G3, G4, G6, G7       | **EXPLORATORY**     | Failing / Not Informative: G2, G3, G4, G5, G6, G7   | **EXPLORATORY**     |

---

### Table 9a: Skill Correlation & Benchmark Overlap Diagnostics (Task 5)

| Diagnostic Test                                               | Batters Metric (N=78)                     | Bowlers Metric (N=82)                     | Empirical Implication                         |
| ------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| Diagnostic (a): Correlation of H_p with Baseline Skill        | Pearson r = 0.4919, Spearman rho = 0.4740 | Pearson r = 0.5676, Spearman rho = 0.6990 | Moderate correlation confirms skill component |
| Diagnostic (b): H_low Top 10 vs Old Theta Top 10 Overlap      | 4 / 10 (40%)                              | 4 / 10 (40%)                              | Diverges from old skill-dominated rating      |
| Diagnostic (b): H_low Top 10 vs Baseline Alone Top 10 Overlap | 3 / 10 (30%)                              | 4 / 10 (40%)                              | Diverges from pure baseline skill selection   |

---

### Table 9b: High-Pressure Ball Exposure & Standard Errors of Top 10 (Task 5)

| Role   | Rank   | Player (`player_id`)          | HP Balls | $\text{SE}_{\text{CR1}}$ | $\text{SE}_{\text{post}}$ | $H_p$   | $H_{\text{low}}$ |
| ------ | ------ | ----------------------------- | -------- | ------------------------ | ------------------------- | ------- | ---------------- |
| Batter | **1**  | Heinrich Klaasen (`4260`)     | 285      | 0.1173                   | 0.0498                    | +0.2390 | +0.1571          |
| Batter | **2**  | Virat Kohli (`47`)            | 378      | 0.0921                   | 0.0472                    | +0.2060 | +0.1283          |
| Batter | **3**  | Pathum Nissanka (`6931`)      | 317      | 0.1219                   | 0.0501                    | +0.2036 | +0.1211          |
| Batter | **4**  | Tim David (`6396`)            | 300      | 0.1503                   | 0.0517                    | +0.2022 | +0.1173          |
| Batter | **5**  | Namboori Tilak Varma (`7897`) | 774      | 0.0742                   | 0.0442                    | +0.1804 | +0.1077          |
| Batter | **6**  | Suryakumar Yadav (`1699`)     | 514      | 0.1130                   | 0.0495                    | +0.1850 | +0.1036          |
| Batter | **7**  | Prabhsimran Singh (`7216`)    | 366      | 0.1457                   | 0.0515                    | +0.1854 | +0.1007          |
| Batter | **8**  | Rovman Powell (`4986`)        | 315      | 0.1259                   | 0.0504                    | +0.1822 | +0.0993          |
| Batter | **9**  | Kusal Mendis (`3672`)         | 236      | 0.1639                   | 0.0522                    | +0.1838 | +0.0980          |
| Batter | **10** | Yashasvi Jaiswal (`6819`)     | 375      | 0.1560                   | 0.0519                    | +0.1783 | +0.0929          |
| Bowler | **1**  | Mitchell Santner (`4101`)     | 340      | 0.1146                   | 0.0100                    | +0.1192 | +0.1028          |
| Bowler | **2**  | Kuldeep Yadav (`3644`)        | 403      | 0.1249                   | 0.0100                    | +0.1188 | +0.1025          |
| Bowler | **3**  | Sunil Narine (`781`)          | 410      | 0.1191                   | 0.0100                    | +0.1184 | +0.1020          |
| Bowler | **4**  | Axar Patel (`2876`)           | 548      | 0.1307                   | 0.0100                    | +0.1182 | +0.1018          |
| Bowler | **5**  | Trent Boult (`2320`)          | 376      | 0.1389                   | 0.0100                    | +0.1181 | +0.1017          |
| Bowler | **6**  | Krunal Pandya (`4219`)        | 287      | 0.1476                   | 0.0100                    | +0.1180 | +0.1016          |
| Bowler | **7**  | Harshal Patel (`2261`)        | 439      | 0.0982                   | 0.0099                    | +0.1179 | +0.1015          |
| Bowler | **8**  | Varun Chakravarthy (`6256`)   | 502      | 0.1032                   | 0.0100                    | +0.1179 | +0.1015          |
| Bowler | **9**  | Mohammed Shami (`1566`)       | 249      | 0.1953                   | 0.0100                    | +0.1178 | +0.1014          |
| Bowler | **10** | Patrick Cummins (`1758`)      | 158      | 0.2271                   | 0.0100                    | +0.1178 | +0.1013          |
