# Phase 2 Diagnostics: Sensitivity and Decomposition Audit
*Protocol: SupeRR Selector Season 2 — Phase 2 Verification*

---
## 2.1 Method of Moments (MoM) Sensitivity Analysis (Sensitivity Only)
- **Batters Eligible Cohort (N=78):**
  - $\text{Var}(H_{\text{raw}})$ = 0.048482
  - $\overline{\text{SE}^2}$ = 0.044109
  - $\tau^2_{\text{MoM}} = \text{Var}(H_{\text{raw}}) - \overline{\text{SE}^2}$ = **0.004373** (Positive, Usable)

- **Bowlers Eligible Cohort (N=82):**
  - $\text{Var}(H_{\text{raw}})$ = 0.056589
  - $\overline{\text{SE}^2}$ = 0.038118
  - $\tau^2_{\text{MoM}} = \text{Var}(H_{\text{raw}}) - \overline{\text{SE}^2}$ = **0.018471** (Positive, Usable)

### Table 2.1a: Top 10 Batters Under Method of Moments Prior (Sensitivity Only)

| Player (`player_id`) | $H_{\text{raw}}$ | $\text{SE}_{\text{CR1}}$ | $H_p$ | $H_{\text{low}}$ | Primary Rank | MoM Rank |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Heinrich Klaasen** (`4260`) | +0.6059 | 0.1173 | +0.2662 | **+0.1715** | 1 | 1 |
| **Virat Kohli** (`47`) | +0.3397 | 0.0921 | +0.2200 | **+0.1316** | 2 | 2 |
| **Pathum Nissanka** (`6931`) | +0.4262 | 0.1219 | +0.2192 | **+0.1235** | 3 | 3 |
| **Tim David** (`6396`) | +0.5304 | 0.1503 | +0.2186 | **+0.1190** | 4 | 4 |
| **Namboori Tilak Varma** (`7897`) | +0.2207 | 0.0742 | +0.1859 | **+0.1047** | 5 | 5 |
| **Suryakumar Yadav** (`1699`) | +0.2975 | 0.1130 | +0.1938 | **+0.0999** | 6 | 6 |
| **Prabhsimran Singh** (`7216`) | +0.3753 | 0.1457 | +0.1954 | **+0.0963** | 7 | 7 |
| **Rovman Powell** (`4986`) | +0.3075 | 0.1259 | +0.1906 | **+0.0942** | 8 | 8 |
| **Kusal Mendis** (`3672`) | +0.4106 | 0.1639 | +0.1936 | **+0.0927** | 9 | 9 |
| **Yashasvi Jaiswal** (`6819`) | +0.3390 | 0.1560 | +0.1858 | **+0.0857** | 10 | 10 |

### Table 2.1b: Top 10 Bowlers Under Method of Moments Prior (Sensitivity Only)

| Player (`player_id`) | $H_{\text{raw}}$ | $\text{SE}_{\text{CR1}}$ | $H_p$ | $H_{\text{low}}$ | Primary Rank | MoM Rank |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mitchell Santner** (`4101`) | +0.4543 | 0.1146 | +0.3141 | **+0.1700** | 1 | 1 |
| **Kuldeep Yadav** (`3644`) | +0.4578 | 0.1249 | +0.3016 | **+0.1502** | 2 | 2 |
| **Sunil Narine** (`781`) | +0.3572 | 0.1191 | +0.2527 | **+0.1053** | 3 | 3 |
| **Axar Patel** (`2876`) | +0.3821 | 0.1307 | +0.2546 | **+0.0996** | 4 | 4 |
| **Trent Boult** (`2320`) | +0.3931 | 0.1389 | +0.2519 | **+0.0921** | 5 | 5 |
| **Krunal Pandya** (`4219`) | +0.4102 | 0.1476 | +0.2513 | **+0.0868** | 6 | 6 |
| **Harshal Patel** (`2261`) | +0.2344 | 0.0982 | +0.1940 | **+0.0630** | 7 | 10 |
| **Varun Chakravarthy** (`6256`) | +0.2460 | 0.1032 | +0.1987 | **+0.0635** | 8 | 9 |
| **Mohammed Shami** (`1566`) | +0.5396 | 0.1953 | +0.2547 | **+0.0711** | 9 | 8 |
| **Patrick Cummins** (`1758`) | +0.6722 | 0.2271 | +0.2632 | **+0.0713** | 10 | 7 |

- **Top-10 Overlap with Primary Estimator:**
  - Batters: **10 / 10** (100% overlap)
  - Bowlers: **10 / 10** (100% overlap)

---

## 2.2 Bowler Delivery Credit Decomposition (Top 10 Bowlers on HP Deliveries)

*Note: Identity holds by construction; checks arithmetic only.*

| Primary Rank | Bowler (`player_id`) | $\text{mean}(\mu_{\text{ctx}} - r_{\text{credit}})$ | $\text{mean}(c_{\text{wkt}} \cdot w_{\text{credit}})$ | $\text{mean}(\alpha_{\text{lomo}})$ | Sum of Terms | Reported $H_{\text{raw}}$ | Difference |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Mitchell Santner** (`4101`) | -0.118193 | +0.498175 | +0.074303 | +0.454285 | +0.454285 | 0.00e+00 |
| **2** | **Kuldeep Yadav** (`3644`) | -0.054807 | +0.445651 | +0.066938 | +0.457782 | +0.457782 | 0.00e+00 |
| **3** | **Sunil Narine** (`781`) | -0.090716 | +0.359908 | +0.087987 | +0.357180 | +0.357180 | 0.00e+00 |
| **4** | **Axar Patel** (`2876`) | -0.160490 | +0.486454 | +0.056139 | +0.382103 | +0.382103 | 0.00e+00 |
| **5** | **Trent Boult** (`2320`) | -0.173386 | +0.477481 | +0.089036 | +0.393131 | +0.393131 | 0.00e+00 |
| **6** | **Krunal Pandya** (`4219`) | -0.020237 | +0.349703 | +0.080758 | +0.410223 | +0.410223 | 0.00e+00 |
| **7** | **Harshal Patel** (`2261`) | -0.165183 | +0.326539 | +0.073054 | +0.234410 | +0.234410 | -2.78e-17 |
| **8** | **Varun Chakravarthy** (`6256`) | -0.246485 | +0.413581 | +0.078857 | +0.245953 | +0.245953 | -2.78e-17 |
| **9** | **Mohammed Shami** (`1566`) | -0.164064 | +0.644890 | +0.058793 | +0.539619 | +0.539619 | 0.00e+00 |
| **10** | **Patrick Cummins** (`1758`) | -0.108475 | +0.683713 | +0.096980 | +0.672218 | +0.672218 | 0.00e+00 |

---

## 2.4 Runs-Only Ranking Status
- **Status:** NOT RUN (per Phase 2 protocol instructions; confirmed excluded).
