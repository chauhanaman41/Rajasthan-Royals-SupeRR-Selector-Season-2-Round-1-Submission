# Final Submission Status Report

**Project:** Rajasthan Royals SupeRR Selector Season 2 — Round 1 Submission  
**Repository Remote URL:** `https://github.com/chauhanaman41/Rajasthan-Royals-SupeRR-Selector-Season-2-Round-1-Submission.git`  
**Target Branch:** `main`  
**Final Commit Hash:** `676d91fde24b4a21aaf8c211c59562df0e693a9f`  
**Execution Timestamp:** 2026-11-15T15:16:30+05:30  
**Overall Methodology Classification:** **EXPLORATORY** (Neither list is validated by pre-declared gates G1–G7)  

---

## 1. Executive Summary & Git Release Verification

All deliverables, reproducibility scripts, empirical data backings, and dataset files have been committed and successfully pushed to the official GitHub repository.

- **Remote Verification:** `git ls-remote` confirms commit `676d91fde24b4a21aaf8c211c59562df0e693a9f` is published at `refs/heads/main` and `HEAD`.
- **Clean Repository Tree:** `git ls-tree -r --name-only HEAD` confirms exactly 39 files tracked, with 0 ignored or transient scratch files present.
- **Data Pack Assessment:** Included in repository (`Data Pack/` total 42.9 MB < 90 MB limit; `ball_by_ball.csv` 41.1 MB < 50 MB GitHub per-file limit).
- **Manifest Integrity:** `python verify_manifest.py` passed with 451 out of 451 numbers matching code outputs (0 mismatches).

---

## 2. Published Files Manifest (39 Tracked Assets in Git HEAD)

| # | File Path | Size (Bytes) | SHA-256 Checksum | One-Line Role / Purpose |
| :-: | :--- | :---: | :--- | :--- |
| 1 | `.gitignore` | 819 | `f8d280016bcf0da321a4bb31af3435469444c3546d20074b7a3f4a788cd4a41f` | Git exclusion rules preventing repository bloat and scratch tracking. |
| 2 | `Data Pack/Round 1 Problem Statement _ SupeRR Selector Season 2.docx.pdf` | 254,082 | `8f7965c616d4a64b779e770a6b2c17dde6a2d6ccbf7de12a58b04db792162489` | Official competition challenge specification and evaluation brief. |
| 3 | `Data Pack/audit_log.csv` | 245 | `0273cada102d8697ac4b8c8d86d74b0dbc868691259a401cb3b54e87a5c3c273` | Dataset revision and audit history from Rajasthan Royals data pack. |
| 4 | `Data Pack/ball_by_ball.csv` | 41,071,837 | `01e2b4379edfbab6a6e456d304cb3c70f554cb312ef93d9588f3f32a82cb396e` | Ball-by-ball delivery-level records (200,999 raw rows). |
| 5 | `Data Pack/competition_team_player_mapping.csv` | 462,969 | `1ded4e42a933618572d6e2c3a521c3257eb1844fab4456d567d77cbb2d3bbb12` | Official player, team, and tournament registration rosters. |
| 6 | `Data Pack/competitions.csv` | 7,624 | `507ceb7189f972d4e4f299ddcfc97f3c3247af1913f6291106f161fa8353fd9b` | Tournament classification, tier, and format metadata. |
| 7 | `Data Pack/matches.csv` | 123,864 | `bb100ab84b8b9a15160c1f2315cf675210131a30e779ec5079fd5403dcf56eef` | Match-level fixture dates, venues, innings outcomes, and results. |
| 8 | `Data Pack/playing_eleven.csv` | 966,287 | `7517c73722a28d5d61c808ccf0cbed315a8780586d02e946eb9a7f5daf011c27` | Match-level playing eleven rosters and substitute records. |
| 9 | `Data Pack/teams.csv` | 6,922 | `a65e5922a9b3bf49247b24fc9471782e700efb31f8dcc5042923238b87c50a5d` | Official team identifiers and franchise/national name mappings. |
| 10 | `FINAL_SUMMARY.md` | 9,177 | `afca353ac2a8dbed9ed4c94b55bd2a8331ed9537a5a3c18ab1f75b7667974dc3` | High-level executive methodology overview. |
| 11 | `JOURNEY.md` | 5,242 | `d822a1043dc03a66d3cdca7b43c504a8d48fb34e7d46feb7a1619c489b18abb0` | Single-paragraph research trajectory documenting all analytical phases. |
| 12 | `README.md` | 27,733 | `67171b85156ed4d50133d2e48b783884075070569797cb9e1faa9247dee0a4f1` | Primary repository documentation, mathematical formulas, and diagrams. |
| 13 | `RESULTS.md` | 47,416 | `106cdc198ed774b6def2a68d81b948ac68b28ebc3d7bd1a83c6ecfb19a61c8f0` | Empirical task execution log and benchmark reproduction outputs. |
| 14 | `TASKS.md` | 14,397 | `7e05763d1efcca241f4e1ccd7c297abf78efa267768b20981896cc11f8984a43` | Formal engineering task specifications and pre-declared rules. |
| 15 | `build_complete_manifest.py` | 22,297 | `666ec460117e5adc03bdf65c50feed9bde7e5dc42fa68c8070f83952657ffd82` | Automated manifest compiler extracting and checking all 451 numbers. |
| 16 | `compare_runs.py` | 2,277 | `ce2e5e9978da58193c12a5c76075032d21d511460a8ba997be1b7d89765c3369` | Gate 0 normalisation verification script confirming byte-level match. |
| 17 | `contradictions.md` | 718 | `e471866dac35c3ca9132b993837ac59994d77f4adb2dd65fc3bd4762f4a8c7f0` | Resolved methodological contradictions log with rationale and dates. |
| 18 | `diagnostics_phase2.py` | 8,109 | `c60b6a317fe8c96eaa0d462bcdfa57e61771fdbe95a379130f4a9bf6eb14c2ad` | Method of Moments prior sensitivity and bowler decomposition script. |
| 19 | `estimator.py` | 16,646 | `115ea363238be95d1092d53783a40675fd459f9cb9ab795a488e48ebc6539a40` | Shared regularised empirical Bayes estimator and shrinkage functions. |
| 20 | `file_hashes.md` | 4,229 | `7de5a7a9aaba3759dbeafbf95af2288510af76baf25c7802fa85d6c0128438f1` | SHA-256 cryptographic hash registry for published assets. |
| 21 | `final_manifest_of_files.md` | 7,263 | `be067902ea5038bbbcfaf6335447766b68b3933fd3db0965a86a9c22696f9426` | Formal file disposition matrix classifying PUBLISH vs IGNORE assets. |
| 22 | `final_status.md` | 9,973 | `7cc94b98d70363214d90f201799435f320d4efef34fa6bc91e653193013d6410` | Comprehensive engineering audit log and milestone verification proofs. |
| 23 | `hp_matches.csv` | 5,386 | `d9682764e432228759800f863c7482cf917e017f85964cf27d899d7c711e822c` | Verified distinct high-pressure match counts for 78 batters and 82 bowlers. |
| 24 | `journey.pdf` | 40,642 | `394d88bf5b5752fa8ccb3d63abd00e262e12068c5ac2a812f19d91fc9811cd45` | Formatted 2-page publication PDF of project journey narrative. |
| 25 | `numbers_manifest.csv` | 45,857 | `a7b3bbf47cb89ab0df852e091181c8d6678a411e0ce78f0e132601714acf97c6` | 451 tracked empirical figures linking reports to raw pipeline tables. |
| 26 | `opponent_offset.csv` | 216 | `085d224700b4784f7f19354059a9986a753a316c94241ce53b7a14a9a30b3654` | Opponent quality adjustments and situational offset drift metrics. |
| 27 | `phase2_diagnostics.md` | 4,719 | `da13cbb2578674f853ad2b902eeeaef77cfe995ae27a9f83e47aa1556be9a0b1` | Empirical findings on Method of Moments sensitivity and bowler credit. |
| 28 | `pipeline_output_tables.md` | 40,984 | `6762a403ceb9abee075e17c0c0ba682564ac993675905c274d7ebcb0a49f3800` | Canonical generated output tables from `--final` pipeline execution. |
| 29 | `report.md` | 33,597 | `892b843942889f3684d9f2fcac97ae9ee0607755de0ecc28bb4a74d1aaa47961` | Primary methodology report in Markdown format (4,984 words). |
| 30 | `report.pdf` | 545,304 | `98ac6506c023610beec8964dc3c7bd4e592a0264c61ff39d517b59aeb80b9827` | Formatted 14-page publication PDF deliverable. |
| 31 | `requirements.txt` | 109 | `bde5165f89abb5d6a97b2f793aa1d8e3b44c76218dca2b107ac7da6028db3087` | Python library requirements (`numpy`, `pandas`, `scipy`). |
| 32 | `run_pressure_pipeline.py` | 103,237 | `fb9f3cc6c02685b2ac399fd5f2fe0755838cfe4e32ce5dbf34fd2e22f336b7f2` | Primary data reconstruction, feature engineering, and estimation pipeline. |
| 33 | `simulate_validation.py` | 14,153 | `fdf4f963989c8b450d861b6043e58992026a2e59ce89eeff09ffc154c4aa008b` | Monte Carlo validation simulation runner (100 replications). |
| 34 | `simulation_results.json` | 4,928 | `74ce76aeef8402b9975cc6e7cc32fe513968380df728eafa02df57905e73ee12` | Validation simulation parameter recovery, coverage, and FPR results. |
| 35 | `submission_checklist.md` | 9,339 | `97962d85d103396f5d682b469dcac7d234462981ff9756026e8ec7d0f6b512b3` | Dropdown lists verification checklist, SHA-256 hashes, and summaries. |
| 36 | `submission_lists.csv` | 632 | `12886ebfe68fc4b3d81f9d57fe451ef4f0bde2d1298f5455bc18dd13eb349f18` | Machine-readable top-10 ranked lists for batters and bowlers. |
| 37 | `tests/test_calibration.py` | 2,384 | `df89e893b9ce9c49fa1f101f5ce52d71940d0ca84c2bf5141312d025865a8012` | Unit tests for win probability calibration and monotonicity constraints. |
| 38 | `tests/test_identity.py` | 5,651 | `e850b4597b64fa87a032de06c9230e08c8a3f753deacd4da2441774e8bb065bb` | Unit tests for bowler credit component decomposition identity (G1). |
| 39 | `verify_manifest.py` | 2,200 | `7a391866035eb8b0bf8ec70f12bb25faedd3892bd1f5d7e369d636a5356e6a89` | Automated manifest audit script confirming 451/451 number matches. |

---

## 3. Ignored & Excluded Workspace Files (Governed by `.gitignore`)

The following files and patterns reside locally on disk in `D:\RR` but are strictly excluded from git tracking:

| File / Pattern | Disposition | Reason for Exclusion |
| :--- | :---: | :--- |
| `__pycache__/`, `*.pyc` | **IGNORE** | Transient Python bytecode compilation cache. |
| `archive/` | **ARCHIVE-LOCAL** | Historical legacy scripts from earlier iterations kept locally for reference. |
| `*.pkl` (`df_scoped_recon.pkl`) | **IGNORE** | 84.7 MB binary cache; fully regenerable from raw CSVs. |
| `scratch*.py` | **IGNORE** | Throwaway scratch scripts used during development (`scratch.py`, `scratch_phase1.py`). |
| `scratch_prompt.txt`, `task_prompt.txt`, `prompt10.txt` | **IGNORE** | Local prompt buffer and working scratch files. |
| `debug_mismatch.py`, `list_missing.py` | **IGNORE** | One-off debugging helpers superseded by `verify_manifest.py`. |
| `check_report_manifest.py`, `build_manifest.py` | **IGNORE** | Interim auditing tools superseded by `build_complete_manifest.py`. |
| `get_all_hashes.py`, `update_hashes.py` | **IGNORE** | Local hash calculation utilities. |
| `audit_report_phase4_5.py` | **IGNORE** | Intermediate verification tool used during authoring. |
| `create_submission_lists.py` | **IGNORE** | Generator script that produced `submission_lists.csv`. |
| `export_pdf.py`, `export_journey_pdf.py` | **IGNORE** | Local Pandoc and Headless Chrome build scripts. |
| `report.html`, `journey.html` | **IGNORE** | Intermediate HTML compilation outputs. |
| `run_phase6_checks.py`, `run_phase6_audit.py` | **IGNORE** | Phase 6 audit diagnostic scripts. |
| `run1_tables.md`, `run2_tables.md`, `run1_tables_no_ts.txt` | **IGNORE** | Verification run snapshots; canonical copy is `pipeline_output_tables.md`. |
| `pipeline_output_tables_run1.md` | **IGNORE** | Historical table snapshot from prior execution. |
| `superr_selector_season_2_unified_methodology_report (2).md` | **IGNORE** | Legacy report draft superseded by `report.md`. |
| `.DS_Store`, `Thumbs.db`, `.vscode/`, `.idea/`, `*.patch`, `*.log` | **IGNORE** | Operating system metadata and IDE configurations. |

---

## 4. Raw Data Pack Evaluation (Phase 1.3)

Evaluation against challenge guidelines:
- **Total Directory Size:** 42,893,981 bytes (~42.9 MB), well within the 90 MB limit.
- **Maximum Single File Size:** `Data Pack/ball_by_ball.csv` is 41,071,837 bytes (~41.1 MB), within GitHub's 50 MB single-file limit.
- **Decision:** **PUBLISH**. All six raw dataset CSV files plus metadata files are committed to git HEAD, guaranteeing complete out-of-the-box reproducibility without external downloads.

---

## 5. Verification Output Summaries

### 5.1 Gate 0 Normalisation Check
- `compare_runs.py` strips exactly line 5 (`- **Run Timestamp:**`) from `run1_tables.md` and `run2_tables.md`.
- Normalised SHA-256 hash: `7ba634fa688bf0a0c6a85bd886c8a58a7e0f295b9275cb714f3b149b51fa1548`.
- Result: **PASS** (all 320 content lines are byte-identical across pipeline runs).

### 5.2 Empirical Numbers Manifest Verification
- `verify_manifest.py` verifies 451 extracted numerical claims across `report.md`, `submission_checklist.md`, `README.md`, `phase2_diagnostics.md`, `pipeline_output_tables.md`, and `RESULTS.md`.
- Result: **451 / 451 MATCH (0 MISMATCHES)**. Gate 3 status: **PASS**.

### 5.3 Validation Gate Evaluation Matrix

| Gate | Description | Batters Metric | Batters Verdict | Bowlers Metric | Bowlers Verdict | Pre-declared Standard |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **G1** | Decomposition Identity | $\max |\text{diff}| = 0.00\times 10^0$ | **PASS** | $\max |\text{diff}| = 0.00\times 10^0$ | **PASS** | Exact identity ($\le 10^{-10}$) |
| **G2** | Out-of-Fold Calibration | Slope = 1.357, CI Width = 3.846 | **NOT INFORMATIVE** | Slope = 0.638, CI Width = 6.840 | **NOT INFORMATIVE** | CI Width must be $< 1.0$ |
| **G3** | Permutation Test | $p = 0.0020$ | **FAIL** | $p = 1.0000$ | **FAIL** | $p < 0.001$ required |
| **G4** | Simulation Parameter Recovery | Null FPR = 8.0%, Power = 43.0% | **FAIL** | Null FPR = 0.0%, Power = 0.0% | **FAIL** | Power $\ge 80.0\%$ required |
| **G5** | Split-Half Stability | $r = 0.702$ (Spearman) | **PASS** | $r = -0.034$ (Spearman) | **FAIL** | Correlation $r \ge 0.60$ |
| **G6** | Threshold Stability | 6 / 10 Overlap at $M_{\text{HP}}=10$ | **FAIL** | 10 / 10 Overlap | **PASS** | $\ge 7 / 10$ overlap across all checks |
| **G7** | Out-of-Time Stability | $r = 0.091$ (2024 holdout) | **FAIL** | $r = 0.222$ (2024 holdout) | **FAIL** | OOT correlation $r \ge 0.40$ |

**Overall Gate Status:**
- Gates G3, G4, G6, G7 FAIL for batters. G2 is NOT INFORMATIVE. G5 passes for batters only.
- Gates G3, G4, G5, G7 FAIL for bowlers. G2 is NOT INFORMATIVE. G6 passes for bowlers.
- **Classification:** Both rankings are strictly designated **EXPLORATORY**.

### 5.4 Rule R3 Forbidden Terms Audit
Screening of core authored deliverables (`README.md`, `JOURNEY.md`, `report.md`, `submission_checklist.md`, `final_status.md`, `final_manifest_of_files.md`):
- **Violations Found:** 0 affirmative violations.
- All occurrences of terms like `validated` appear strictly in explicit negation/disclaimer contexts (e.g., *"Neither list is validated by pre-declared gates"*, *"Both lists are EXPLORATORY"*).
- Historical occurrences in `TASKS.md`, `RESULTS.md`, and code tables are documented and preserved without modifying prompt integrity.

### 5.5 Relative Link & PDF Check
- All relative markdown links in `README.md` and `JOURNEY.md` point to existing, published files.
- `report.pdf` SHA-256 matches `submission_checklist.md` (`98ac6506c023610beec8964dc3c7bd4e592a0264c61ff39d517b59aeb80b9827`).
- `journey.pdf` SHA-256 is `394d88bf5b5752fa8ccb3d63abd00e262e12068c5ac2a812f19d91fc9811cd45` (2 pages, clean typography, 0 clipping).

---

## 6. Official Dropdown Submission Lists

### 6.1 Top 10 Batters (Ranked by Reliable High-Pressure Output $H_{\text{low}}$)

| Rank | Player Name | Player ID | Reliable Output $H_p$ [90% EB CI] | Conservative Bound $H_{\text{low}}$ | HP Balls | Total Balls | HP Matches | Mean Rank | Top-10 Inclusion Prob | Inn 2 HP Share |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | Heinrich Klaasen | `4260` | +0.239 [+0.157, +0.321] | **+0.1571** | 285 | 1,401 | 26 | 4.4 | 89.0% | 53.3% |
| **2** | Virat Kohli | `47` | +0.206 [+0.128, +0.284] | **+0.1283** | 378 | 2,442 | 25 | 9.0 | 75.5% | 97.1% (Chase-Dep) |
| **3** | Pathum Nissanka | `6931` | +0.204 [+0.121, +0.286] | **+0.1211** | 317 | 1,381 | 24 | 8.4 | 74.0% | 93.1% (Chase-Dep) |
| **4** | Tim David | `6396` | +0.202 [+0.117, +0.287] | **+0.1173** | 300 | 1,154 | 31 | 9.9 | 66.5% | 70.0% |
| **5** | Namboori Tilak Varma | `7897` | +0.180 [+0.108, +0.253] | **+0.1077** | 774 | 2,310 | 48 | 15.0 | 53.5% | 69.6% |
| **6** | Suryakumar Yadav | `1699` | +0.185 [+0.104, +0.266] | **+0.1036** | 514 | 2,614 | 45 | 16.6 | 47.0% | 74.7% |
| **7** | Prabhsimran Singh | `7216` | +0.185 [+0.101, +0.270] | **+0.1007** | 366 | 1,033 | 24 | 16.7 | 38.5% | 90.4% (Chase-Dep) |
| **8** | Rovman Powell | `4986` | +0.182 [+0.099, +0.265] | **+0.0993** | 315 | 1,524 | 37 | 16.5 | 38.5% | 63.2% |
| **9** | Kusal Mendis | `3672` | +0.184 [+0.098, +0.270] | **+0.0980** | 236 | 1,220 | 20 | 15.8 | 40.5% | 95.3% (Chase-Dep) |
| **10** | Yashasvi Jaiswal | `6819` | +0.178 [+0.093, +0.264] | **+0.0929** | 375 | 1,739 | 27 | 19.1 | 33.5% | 99.7% (Chase-Dep) |

*Note on Batters:* Ranks 5 to 10 are within one posterior standard error ($\approx 0.050$) of each other and represent a statistical tie.

---

### 6.2 Top 10 Bowlers (Ranked by Reliable High-Pressure Output $H_{\text{low}}$)

| Rank | Player Name | Player ID | Reliable Output $H_p$ [90% EB CI] | Conservative Bound $H_{\text{low}}$ | HP Balls | Total Balls | HP Matches | Mean Rank | Top-10 Inclusion Prob | Inn 2 HP Share |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | Mitchell Santner | `4101` | +0.119 [+0.103, +0.136] | **+0.1028** | 340 | 1,725 | 32 | 4.4 | 91.5% | 73.2% |
| **2** | Kuldeep Yadav | `3644` | +0.119 [+0.102, +0.135] | **+0.1025** | 403 | 1,866 | 35 | 5.1 | 88.5% | 61.5% |
| **3** | Sunil Narine | `781` | +0.118 [+0.102, +0.135] | **+0.1020** | 410 | 1,479 | 31 | 9.5 | 68.0% | 56.6% |
| **4** | Axar Patel | `2876` | +0.118 [+0.102, +0.135] | **+0.1018** | 548 | 2,609 | 54 | 10.8 | 63.0% | 64.2% |
| **5** | Trent Boult | `2320` | +0.118 [+0.102, +0.135] | **+0.1017** | 376 | 1,562 | 35 | 11.5 | 58.0% | 79.3% |
| **6** | Krunal Pandya | `4219` | +0.118 [+0.102, +0.134] | **+0.1016** | 287 | 1,255 | 25 | 13.1 | 54.0% | 88.5% |
| **7** | Harshal Patel | `2261` | +0.118 [+0.102, +0.134] | **+0.1015** | 439 | 1,688 | 38 | 15.6 | 57.0% | 80.0% |
| **8** | Varun Chakravarthy | `6256` | +0.118 [+0.102, +0.134] | **+0.1015** | 502 | 2,083 | 41 | 14.5 | 55.5% | 57.4% |
| **9** | Mohammed Shami | `1566` | +0.118 [+0.101, +0.134] | **+0.1014** | 249 | 1,259 | 27 | 15.0 | 32.5% | 73.5% |
| **10** | Patrick Cummins | `1758` | +0.118 [+0.101, +0.134] | **+0.1013** | 158 | 1,161 | 15 | 14.4 | 38.0% | 83.5% |

*Note on Bowlers:* All 10 bowlers lie within one posterior SE ($0.0100$) of each other (spread in $H_{\text{low}} = 0.0015$) due to severe shrinkage under the floored prior ($\tau^2_{\text{SH}} = 0.000100$). The internal ordering is statistically indistinguishable. Under an unfloored Method of Moments prior, Cummins rises to #7 and Harshal falls to #10.

---

## 7. Methodological Contradictions & Decisions Log

1. **Gate 0 Timestamp Comparison:** Resolved by excluding line 5 (`- **Run Timestamp:**`) from the comparison. The normalised SHA-256 hash matches across runs, verifying full reproducibility.
2. **HP Matches Metric:** In generated tables, `HP Matches` counted distinct matches with eligible volume rather than HP balls. In `hp_matches.csv`, distinct matches with $\ge 1$ HP ball were computed and verified ($\ge 15$ for all 78 batters and 82 bowlers).
3. **Bowler Prior Variance Floor:** Unfloored split-half bowler between-player variance $\tau^2_{\text{SH}} = -0.001719$, floored to $\tau^2_{\min} = 0.000100$. This shrinks bowler estimates heavily toward zero (mean shrinkage factor $B = 0.006$), placing all bowlers within $0.0015$ of each other.
4. **Validation Gate Failures & Exploratory Mandate:** Simulation power for batters is 43% and bowler power is 0%. Permutation test for bowlers fails ($p = 1.0000$). Out-of-time correlation is weak ($r = 0.091$ for batters, $r = 0.222$ for bowlers). Consequently, both rankings remain strictly exploratory, with all limitations prominently documented.

---

**Audit Sign-off:** Complete, verified, reproducible, and published to GitHub.
