# Final Manifest of Files: Decision Matrix

**Project:** Rajasthan Royals SupeRR Selector Season 2 — Round 1 Submission  
**Repository:** `https://github.com/chauhanaman41/Rajasthan-Royals-SupeRR-Selector-Season-2-Round-1-Submission.git`  
**Date:** 2026-11-15  

This document formalises the file disposition decisions for all items residing in the project workspace `D:\RR`.

---

## 1. PUBLISH Decisions (Included in Git Repository)

These files constitute the complete, audited submission deliverable, reproducibility codebase, and verification evidence.

| File / Directory | Decision | Role & Description |
| :--- | :---: | :--- |
| `report.md` | **PUBLISH** | Comprehensive methodology report in Markdown format (4,984 words). |
| `report.pdf` | **PUBLISH** | Formatted 14-page publication PDF with custom CSS styling and responsive tables. |
| `README.md` | **PUBLISH** | Repository homepage containing architecture maps, formulas, diagrams, and reproduction guides. |
| `JOURNEY.md` | **PUBLISH** | Single-paragraph narrative documenting the research and engineering trajectory. |
| `journey.pdf` | **PUBLISH** | Formatted PDF version of the project journey narrative. |
| `submission_lists.csv` | **PUBLISH** | Machine-readable top-10 ranked lists for batters and bowlers (`role, rank, player_id, player_name`). |
| `submission_checklist.md` | **PUBLISH** | Dropdown verification tables, SHA-256 hashes, and limitation summary. |
| `final_status.md` | **PUBLISH** | Comprehensive engineering audit log and milestone verification proofs. |
| `contradictions.md` | **PUBLISH** | Formal log of methodological decisions and resolutions. |
| `numbers_manifest.csv` | **PUBLISH** | 451 backed and verified empirical figures backing every table and finding. |
| `verify_manifest.py` | **PUBLISH** | Automated manifest verification script confirming 100% agreement. |
| `build_complete_manifest.py` | **PUBLISH** | Script that compiles and registers all 451 empirical numbers into the manifest. |
| `compare_runs.py` | **PUBLISH** | Gate 0 normalisation script verifying byte-identical reproducibility. |
| `hp_matches.csv` | **PUBLISH** | Verified distinct HP match counts for all 78 batters and 82 bowlers ($\ge 15$). |
| `opponent_offset.csv` | **PUBLISH** | Delivery-weighted opponent quality breakdown and situational drift. |
| `phase2_diagnostics.md` | **PUBLISH** | Method of Moments sensitivity and bowler credit decomposition diagnostics. |
| `diagnostics_phase2.py` | **PUBLISH** | Reproducible diagnostic script executing Phase 2 evaluations. |
| `estimator.py` | **PUBLISH** | Shared regularised empirical Bayes estimator and shrinkage functions. |
| `run_pressure_pipeline.py` | **PUBLISH** | End-to-end data processing, feature engineering, and modeling pipeline. |
| `simulate_validation.py` | **PUBLISH** | Monte Carlo validation simulation engine (100 replications). |
| `simulation_results.json` | **PUBLISH** | Simulation parameter recovery, coverage, and null false-positive outputs. |
| `pipeline_output_tables.md` | **PUBLISH** | Canonical generated output tables from the final pipeline execution. |
| `TASKS.md` | **PUBLISH** | Formal engineering task specifications and pre-declared rules. |
| `RESULTS.md` | **PUBLISH** | Empirical execution log and computational milestone numbers. |
| `FINAL_SUMMARY.md` | **PUBLISH** | High-level executive methodology summary. |
| `requirements.txt` | **PUBLISH** | Python dependency specification (`numpy`, `pandas`, `scipy`). |
| `tests/` | **PUBLISH** | Permanent test suite (`test_calibration.py`, `test_identity.py`). |
| `Data Pack/` | **PUBLISH** | Input raw CSV datasets (total ~42.9 MB < 90 MB, max file 41.1 MB < 50 MB; see Section 1.3). |
| `final_manifest_of_files.md`| **PUBLISH** | This decision matrix documenting file governance. |
| `file_hashes.md` | **PUBLISH** | Cryptographic SHA-256 integrity manifest for all published deliverables. |
| `final_status_submission.md`| **PUBLISH** | Final submission status and git release verification block. |

---

## 2. IGNORE Decisions (Excluded from Git, Kept on Local Disk)

These files are excluded from git tracking via `.gitignore` to prevent repository bloat, preserve confidentiality of intermediate scratch files, and avoid committing cached binary state.

| File / Pattern | Decision | Reason for Exclusion (One-Line Explanation) |
| :--- | :---: | :--- |
| `__pycache__/` | **IGNORE** | Transient Python bytecode compilation cache. |
| `archive/` | **ARCHIVE-LOCAL** | Historical legacy scripts from prior iterations kept locally for audit history. |
| `*.pkl` (`df_scoped_recon.pkl`) | **IGNORE** | 84.7 MB binary cache file; regenerable deterministically from raw CSVs. |
| `scratch*.py` (`scratch.py`, `scratch_phase1.py`) | **IGNORE** | Throwaway intermediate diagnostic scripts used during task execution. |
| `scratch_prompt.txt` | **IGNORE** | Local prompt buffer file. |
| `task_prompt.txt` | **IGNORE** | Local task specification text mirror. |
| `debug_mismatch.py` | **IGNORE** | One-off helper script used during manifest key debugging. |
| `list_missing.py` | **IGNORE** | One-off helper script used to list missing manifest tokens. |
| `check_report_manifest.py` | **IGNORE** | Interim auditing script superseded by `verify_manifest.py`. |
| `build_manifest.py` | **IGNORE** | Initial manifest compiler superseded by `build_complete_manifest.py`. |
| `get_all_hashes.py` | **IGNORE** | One-off hash printing script superseded by `file_hashes.md`. |
| `audit_report_phase4_5.py` | **IGNORE** | Intermediate verification script used for Phase 4/5 self-audit. |
| `create_submission_lists.py` | **IGNORE** | Generator script that produced `submission_lists.csv`. |
| `export_pdf.py` | **IGNORE** | Local build script used to invoke Pandoc and Headless Chrome. |
| `report.html` | **IGNORE** | Intermediate HTML file generated during PDF compilation. |
| `run1_tables.md` | **IGNORE** | Verification run 1 output table file; canonical copy is `pipeline_output_tables.md`. |
| `run2_tables.md` | **IGNORE** | Verification run 2 output table file; canonical copy is `pipeline_output_tables.md`. |
| `run1_tables_no_ts.txt` | **IGNORE** | Intermediate stripped text file from Gate 0 normalisation check. |
| `pipeline_output_tables_run1.md` | **IGNORE** | Historical table snapshot from an earlier run. |
| `superr_selector_season_2_unified_methodology_report (2).md` | **IGNORE** | Legacy report draft superseded by `report.md`. |
| `.DS_Store` | **IGNORE** | macOS system metadata file. |
| `*.patch` | **IGNORE** | Transient git patch files. |
| `*.log` | **IGNORE** | Runtime process execution logs. |

---

## 3. Data Pack Assessment (Phase 1.3)

Evaluation against criteria:
- **Total Directory Size:** 42,893,981 bytes (~42.9 MB), which is **under the 90 MB threshold**.
- **Maximum Single File Size:** `ball_by_ball.csv` is 41,071,837 bytes (~41.1 MB), which is **under the 50 MB GitHub limit**.
- **Decision:** **PUBLISH** `Data Pack/` in the repository (excluding `.DS_Store`). All six core CSV files (`ball_by_ball.csv`, `matches.csv`, `playing_eleven.csv`, `competition_team_player_mapping.csv`, `competitions.csv`, `teams.csv`) are tracked. SHA-256 hashes are recorded in `README.md` and `file_hashes.md`.
