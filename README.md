# SupeRR Selector: High-Pressure Player Evaluation Architecture
### Empirical Bayes Random-Effects Model for Clutch T20 Cricket Evaluation (2022–2026)
**Authors**: Research & Analytics Engineering Team | **Production Version**: 5.0 (Audited) | **Random Seed**: 42

## 1. Overview & Estimand Definition
This repository implements the production player selection model for the SupeRR Selector competition. The model evaluates **opponent-adjusted high-pressure output above par in runs per ball, including a wicket term for both roles, shrunk toward a cohort mean**.
- **Estimand ($H_p$)**: Measures expected net output on high-pressure balls ($P_i \ge 0.590213$) relative to contextual venue and match par, adjusted for opponent quality via Two-Way Ridge regression and shrunk via profile REML between-player variance $\tau^2$.
- **Units**: Runs per ball relative to context par, shrunk.
- **Core Principle**: Identifies **who is expected to deliver high output in pressure moments**, not who elevates above their own usual baseline.

## 2. Production High-Pressure Selector Lists
### Top 10 Batters
| Rank | Player Name | Unstop ID | HP Balls | Matches | Dismissals | $H_{\text{raw}}$ | Run Comp | Wkt Comp | SE | Shrink $B$ | $H_p$ (rpb) | 90% Posterior Interval | $P(\text{Top-10})$ |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 | Rashid Khan | 4722 | 137 | 19 | 6 | +0.799 | +0.875 | -0.075 | 0.145 | 0.456 | **+0.468** | [0.31, 0.63] | 89.2% |
| 2 | Heinrich Klaasen | 4260 | 286 | 31 | 9 | +0.630 | +0.780 | -0.149 | 0.140 | 0.476 | **+0.400** | [0.24, 0.56] | 70.7% |
| 3 | Suryakumar Yadav | 1699 | 547 | 49 | 22 | +0.432 | +0.682 | -0.250 | 0.096 | 0.655 | **+0.349** | [0.22, 0.48] | 51.3% |
| 4 | Tim David | 6396 | 314 | 38 | 14 | +0.509 | +0.765 | -0.256 | 0.154 | 0.426 | **+0.326** | [0.16, 0.49] | 41.7% |
| 5 | Nicholas Pooran | 3125 | 409 | 40 | 19 | +0.499 | +0.809 | -0.310 | 0.160 | 0.408 | **+0.316** | [0.15, 0.48] | 39.2% |
| 6 | Rovman Powell | 4986 | 369 | 40 | 19 | +0.406 | +0.678 | -0.273 | 0.116 | 0.568 | **+0.313** | [0.17, 0.46] | 35.2% |
| 7 | Ryan Rickelton | 4007 | 186 | 15 | 6 | +0.682 | +0.994 | -0.312 | 0.243 | 0.230 | **+0.304** | [0.11, 0.50] | 35.1% |
| 8 | Virat Kohli | 47 | 337 | 23 | 9 | +0.341 | +0.539 | -0.198 | 0.103 | 0.625 | **+0.284** | [0.15, 0.42] | 21.9% |
| 9 | Pathum Nissanka | 6931 | 227 | 20 | 11 | +0.427 | +0.673 | -0.246 | 0.164 | 0.397 | **+0.284** | [0.11, 0.45] | 27.2% |
| 10 | Rinku Singh | 4708 | 260 | 27 | 7 | +0.380 | +0.586 | -0.206 | 0.137 | 0.486 | **+0.283** | [0.13, 0.44] | 25.3% |


### Top 10 Bowlers
| Rank | Player Name | Unstop ID | HP Balls | Matches | Wickets | $H_{\text{raw}}$ | Run Comp | Wkt Comp | SE | Shrink $B$ | $H_p$ (rpb) | 90% Posterior Interval | $P(\text{Top-10})$ |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 | Mitchell Santner | 4101 | 334 | 32 | 26 | +0.512 | -0.143 | +0.656 | 0.144 | 0.562 | **+0.315** | [0.14, 0.49] | 69.9% |
| 2 | Josh Hazlewood | 830 | 392 | 36 | 33 | +0.488 | -0.112 | +0.600 | 0.180 | 0.452 | **+0.254** | [0.06, 0.45] | 47.6% |
| 3 | Patrick Cummins | 1758 | 169 | 15 | 12 | +0.518 | -0.093 | +0.611 | 0.192 | 0.419 | **+0.259** | [0.06, 0.46] | 49.5% |
| 4 | Krunal Pandya | 4219 | 293 | 30 | 19 | +0.377 | -0.001 | +0.377 | 0.155 | 0.525 | **+0.227** | [0.04, 0.41] | 38.8% |
| 5 | Lockie Ferguson | 4692 | 208 | 22 | 17 | +0.695 | -0.077 | +0.772 | 0.293 | 0.237 | **+0.211** | [-0.02, 0.45] | 36.9% |
| 6 | Sunil Narine | 781 | 373 | 31 | 18 | +0.279 | -0.044 | +0.323 | 0.112 | 0.680 | **+0.209** | [0.06, 0.36] | 28.9% |
| 7 | Axar Patel | 2876 | 587 | 58 | 31 | +0.286 | -0.170 | +0.456 | 0.119 | 0.654 | **+0.208** | [0.05, 0.37] | 30.0% |
| 8 | Kagiso Rabada | 3628 | 309 | 29 | 18 | +0.340 | -0.142 | +0.482 | 0.165 | 0.495 | **+0.199** | [0.01, 0.39] | 30.2% |
| 9 | Mohammed Shami | 1566 | 209 | 26 | 15 | +0.502 | -0.222 | +0.724 | 0.241 | 0.313 | **+0.199** | [-0.02, 0.42] | 32.8% |
| 10 | Kuldeep Yadav | 3644 | 400 | 36 | 21 | +0.284 | -0.112 | +0.395 | 0.129 | 0.613 | **+0.198** | [0.03, 0.36] | 27.0% |


> **Bowler Ranking Note**: Bowler ranks use robust match-clustered standard errors (v4), placing Josh Hazlewood at rank 2 and Patrick Cummins at rank 3. Under standard CR1 standard errors (v5), Cummins is rank 2 ($H_p = 0.2588$) and Hazlewood is rank 3 ($H_p = 0.2538$). The point estimates are identical; only the standard errors and empirical Bayes shrinkage differ slightly.

## 3. Pressure Intensity Architecture
Pressure $P_i \in [0, 1]$ is computed on every delivery $i$ via a linear combination of four normalized pillars (weights 40/30/20/10):
$$P_i = 0.40 \cdot L_i + 0.30 \cdot T_i + 0.20 \cdot S_i + 0.10 \cdot M_i$$
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

## 4. Scoping Funnel & Data Partitions
The 5-stage scoping funnel filters raw deliveries to the valid analysis cohort:
- **Stage 0 (Raw Ingest)**: 867 matches, 200,999 balls.
- **Stage 1 (In-Scope Window 2022–2026)**: 837 matches, 194,014 balls.
- **Stage 2 (Valid Match Logs)**: 815 matches, 192,465 balls.
- **Stage 3 (Two Complete Innings)**: 786 matches, 187,639 balls.
- **Stage 4 (Final Production Cohort)**: 777 matches (354 IPL, 423 T20I), 185,567 balls (85,486 IPL, 100,081 T20I).
- **HP Cohort Partition**: 37,114 High Pressure balls (20.0%) and 148,453 Ordinary balls (80.0%).
- **Innings Split**: 9,002 HP balls in Innings 1 (24.25%) and 28,112 HP balls in Innings 2 (75.75%).

- **Raw Data Pack Location**: The competition raw dataset resides in the repository at `Data Pack/` (containing `matches.csv`, `ball_by_ball.csv`, `playing_eleven.csv`, `teams.csv`, `competitions.csv`, and `competition_team_player_mapping.csv`). This directory is excluded from version control commits via `.gitignore` to maintain a lightweight repository.

## 5. Candidate Model Selection (Rule S)
Model selection was determined by pre-declared **Rule S** over 200 zero-leakage match-level splits:
- **Batter Out-of-Sample $r$**: C1 achieves median composite $r = 0.0335$ (run target $r = 0.1399$), while elevation C3 yields median $r = -0.0088$. C1 is selected by parsimony and out-of-sample performance.
- **Bowler Out-of-Sample $r$**: C3 achieves median $r = 0.1771$ vs C1 $0.1722$. The paired difference ($0.0076$) is within the pre-declared **0.02 parsimony margin**. C1 is selected by declared order C1 < C3.
- **Adopted Profile REML $\tau^2$**: Batters $\tau^2 = 0.017654$ ($K=91$, dof=90); Bowlers $\tau^2 = 0.026588$ ($K=89$, dof=88).

## 6. Reproduction Guide
To reproduce all tables, figures, and verification outputs from clean checkout:
```bash
# Run complete reproduction pipeline
python outputs/final/scripts/build_step1_lists.py
python outputs/final/scripts/build_manifest.py
python outputs/final/scripts/build_report_markdown.py
python outputs/final/scripts/build_pdf.py
python outputs/final/scripts/verify_report.py
```

## 7. Submission Directory Structure
The finalized standalone submission package is located in `submission/` containing exactly two submission deliverables:
```
submission/
├── report.pdf                 # Final publication PDF (verified)
└── submission_lists.csv       # Production Top 10 Batters & Bowlers (verified dropdown IDs)
```

Supporting audit artifacts, full rosters, high-resolution figures, and reproduction scripts reside in repository root and `outputs/final/`.
