# Contradictions Log

## Contradiction 0.1: Run 1 vs Run 2 Timestamp Discrepancy in Raw Table Hash
- **Date Recorded:** 2026-11-15
- **Status:** RESOLVED
- **Resolution Decision (2026-11-15):** 
  Per User Instruction on 2026-11-15, Gate 0 comparison normalises `run1_tables.md` and `run2_tables.md` by stripping exactly the dynamic wall-clock metadata line starting with `- **Run Timestamp:**` (Line 7).
  The normalised files (320 content lines) yield identical SHA-256 hashes:
  `72fa75216d2d7632f22f48f165be169c0cd82c78f78f868d8ec1daa6fdcaa354`
  Script `compare_runs.py` executes this normalisation and verifies byte-for-byte reproducibility.
  Neither `run_pressure_pipeline.py` nor `estimator.py` was modified.
