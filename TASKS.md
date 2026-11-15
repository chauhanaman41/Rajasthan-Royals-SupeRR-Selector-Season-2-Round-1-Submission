# TASKS.md - SupeRR Selector Season 2

## ROLE
You are fixing the SupeRR Selector Season 2 pipeline in D:\RR. Work through the
tasks IN ORDER. After each task append results (numbers only) to RESULTS.md, then
continue. Do not narrate. Save this prompt first as TASKS.md and read it from
there; never re-extract it from the transcript.

## WORKING RULES
W1. No gate threshold may be weakened after seeing results. All gates are listed
    in Task 9 and are pre-declared here. If one fails, report FAIL and continue.
W2. No number in any table or report may be typed by hand; all come from code of
    the run being reported.
W3. Create exactly one new module, estimator.py, holding the shared estimator
    (Task 1). Otherwise edit run_pressure_pipeline.py and simulate_validation.py
    in place with targeted edits. No build_/patch_/update_ scripts. Throwaway code
    goes in scratch.py; permanent checks go in tests/ and run with
    `python -m pytest tests -x -q` (or plain python if pytest is absent).
W4. Seed np.random.default_rng(42). Two --final runs must be byte-identical apart
    from the timestamp line.
W5. Run long jobs once in the background, then wait; do not poll repeatedly.
    Use --dev (B_boot=50, B_perm=200, sim 20 reps) while debugging, --final
    (B_boot=200, B_perm=1000, sim 100 reps) only at the end. Budget: if a task
    exceeds 15 minutes, stop, record the blocker, move on.
W6. Do not describe any list as "validated" or "clutch" unless all gates in
    Task 9 pass.
W7. If ambiguous, take the conservative reading, log the assumption in RESULTS.md,
    and continue.

## KNOWN FACTS (from the last diagnostics)
- Point estimate and bootstrap use different estimators: point uses cluster-robust
  SE (CR1), all deliveries, LOMO residuals, DL tau2=0.052 (no floor); bootstrap uses
  OLS variance sigma2/Sxx, legal balls only, in-sample ridge residuals, tau2 pinned
  at the 0.0064 floor in 199/200 draws. Boot(w=1) != point for every player.
- Split-half r of raw delta = 0.04 (SD 0.11); of shrunk elevation = 0.18. Nested
  held-out elevation of the selected top 10 is 0.009 vs 0.038 in the train half.
  DL tau2 is probably inflated.
- Simulation: CR1 t-interval coverage 89.3% (all players), EB posterior 82.6%
  (top 10: 66% / 71%), percentile interval 26%. Simulation ran batters only,
  with independent per-ball noise (ICC 0).
- Q47 bowler top 10 (Duffy, Taskin, ...) contradicts Table 6a (Kuldeep, Axar, ...).
- Pressure weights differ between report (0.40/0.30/0.20/0.10) and code
  (0.40/0.30/0.15/0.15).
- HP balls are now dominated by innings 2 (e.g. Mendis 95.6%), so P is
  confounded with innings.

====================================================================
TASK 1: ONE SHARED ESTIMATOR + IDENTITY TESTS (blocks everything else)
====================================================================
1.1 Create estimator.py with function
      fit_slopes(df, role, match_weights=None, resid=None, tau2=None, ...)
    returning per-player: n_balls, n_HP, M_p (distinct matches), S_xx, S_pe,
    delta_raw, cluster SE^2 (CR1: M/(M-1) * sum_m u_pm^2 / S_xx^2, with
    u_pm weighted by w_m**2 when match weights are used), tau2, B_shrink,
    delta_hat, elev. The point estimate, bootstrap, simulation, split-half and
    rolling-origin must ALL call this one function. Delete the duplicate
    implementations.
1.2 Ball set: batters = legal deliveries only; bowlers = all deliveries (wides and
    no-balls are charged to the bowler). n_balls shown in tables = the set used.
1.3 Residuals: the bootstrap uses the FIXED full-sample LOMO residuals e (a
    conditional cluster bootstrap; document this). A 20-draw full-refit run is an
    optional sensitivity check only.
1.4 tests/test_identity.py:
    (i) bootstrap with all match weights = 1 reproduces the point-estimate
        delta_raw, SE^2, tau2, B_shrink, elev for ALL eligible players to 1e-9;
    (ii) plain OLS of e on P_cent over a player's balls equals delta_raw
         (check Mendis 3672 and Kuldeep 3644).
ACCEPTANCE: both tests pass. Print the Mendis/Klaasen/Powell intermediate row
for point and boot(w=1); they must be identical.

====================================================================
TASK 2: RECONCILE CONTRADICTIONS
====================================================================
2.1 Find why the Q47 bowler list differs from Table 6a. Identify the code path,
    remove the stale one, and print the final bowler elevations once.
2.2 Pressure weights: use one set in code. Make the report read the weights from
    the code constants. Print them.
2.3 Print the pressure-index composition per innings: share of HP balls by
    innings, competition, and batting bucket (replace the old 69.4% exposure table).
ACCEPTANCE: one weight set; one bowler list; exposure table regenerated.

====================================================================
TASK 3: REMOVE THE INNINGS CONFOUND AND THE SCALE MISMATCH
====================================================================
3.1 Centre P within strata: batters = (innings x batting bucket), bowlers =
    (innings x phase). Use this P_cent for slope, permutation and ranking.
3.2 Elevation = delta_hat * DeltaP_stratum, where DeltaP_stratum is the mean of
    P_cent over HP balls, weighted by the player's own HP ball counts across
    strata (computed from his strata, not one global constant). Print the mean and
    range of DeltaP_stratum per role.
3.3 Report, per top-10 player, the share of HP balls from innings 2. Flag
    players above 90% as "chase-dependent".
ACCEPTANCE: Table of DeltaP_stratum; top-10 changes vs previous list reported.

====================================================================
TASK 4: CALIBRATE THE PRIOR (tau2) FROM DATA
====================================================================
4.1 Estimate between-player variance of true slopes by the split-half covariance
    method: over 50 random match-level splits (cohort fixed at the full-sample
    eligible set), tau2_SH = mean over splits of the across-player covariance
    between delta_raw(half A) and delta_raw(half B), floored at 1e-4. Do this on
    the same scale as the full-sample delta_raw.
4.2 Report tau2_DL, tau2_SH, and the old floor 0.0064 side by side for batters
    and bowlers. Use tau2_SH as the primary prior; keep DL and the floor as
    sensitivity runs.
4.3 Calibration test (tests/test_calibration.py): over 50 random splits, shrink
    half-A slopes with the half-A prior, then regress half-B raw delta on the
    half-A shrunk delta across all eligible players. Report the calibration slope
    with a match-cluster bootstrap 90% interval. Target: interval contains 1.
    Also report the mean held-out value of the top 10 chosen in half A.
ACCEPTANCE: three tau2 values and the calibration slope (all four combos: tau2_SH,
DL, floor; both roles).

====================================================================
TASK 5: NEW PRIMARY RANKING = RELIABLE HIGH-PRESSURE PERFORMANCE
====================================================================
The brief asks for the players who deliver most reliably when it matters.
5.1 HP performance H_p: for each eligible player, the mean over his HP balls of the
    opponent- and context-adjusted run-equivalent residual (y_adj + opposing
    LOMO skill for batters; -y_adj + opposing batter skill for bowlers), WITHOUT
    subtracting the player's own baseline. Cluster by match. Shrink with the
    empirical-Bayes prior estimated from the HP-ball means (use split-half
    covariance, same method as Task 4). Output posterior mean and 90% posterior
    interval.
5.2 Elevation E_p = H_p minus the same quantity on the player's non-HP balls
    (cluster-robust SE, shrunk the same way). Consistency gap as before (HR_HP
    minus HR_nonHP, require >= 10 qualifying matches in each state).
5.3 PRIMARY RANK = lower bound (5th percentile of the posterior) of H_p, among
    players who satisfy: eligibility on the full sample; posterior interval of E_p
    is not entirely below 0 (no clear dip); not flagged chase-dependent only
    because of innings (report, do not exclude). Tie-break: consistency gap.
5.4 Tables per role: (a) primary ranking with H_p, interval, E_p, interval,
    consistency gap, share of HP balls from innings 2, top-10 inclusion
    probability (Task 8); (b) ranking by shrunk elevation alone; (c) the old
    theta ranking. Print overlap counts and name lists for (a)(b)(c).
ACCEPTANCE: three tables per role; (a) contains no player whose lower bound <= 0
unless fewer than 10 qualify, in which case list only the qualifying ones plus a
note.

====================================================================
TASK 6: REDESIGN THE SIMULATION
====================================================================
6.1 Run separately for batters and bowlers on their own real match structure.
6.2 Noise must include a match-level random effect (ICC about equal to the real
    data's within-(player,match) ICC, printed for both) plus ball-level noise.
6.3 Signal scenarios: true slope SD set to (a) the tau_SH estimated in Task 4,
    (b) 2x tau_SH, (c) 4x tau_SH. Null: all zero. Report SNR (true SD / mean SE)
    for each.
6.4 For each scenario and role (100 reps): coverage of the true effect by
    (i) CR1 t-interval on raw delta, (ii) EB posterior interval, each on all
    eligible players AND on the top 10 by estimated value; omnibus false-positive
    rate (null) and power; MSE shrunk vs unshrunk. Percentile-bootstrap interval
    is reported as a sensitivity row only.
ACCEPTANCE: simulation_results.json holds both roles. State the SNR at which power
reaches 80%.

====================================================================
TASK 7: OMNIBUS TESTS AND BOWLING MEASURE CHECK
====================================================================
7.1 Re-run the omnibus test (sign-flip scheme) with the shared estimator and
    stratified P_cent for both roles. Report S_obs, permutation mean/SD, p.
    Include the null-uniformity check (200 null datasets; fraction below 0.05,
    0.10).
7.2 Bowler over-level economy measure: control expected economy by (phase x
    over) AND by pressure bin, then re-run. It may be used only if its omnibus
    p < 0.05 AND split-half r >= 0.2 (20 splits, fixed cohort). Otherwise report
    "heterogeneity not persistent; likely context confound" and do not use it.
ACCEPTANCE: table of p-values and split-half r.

====================================================================
TASK 8: INTERVALS, STABILITY, PREDICTION
====================================================================
8.1 Official intervals = EB posterior intervals (Task 5). The percentile bootstrap
    of shrunk estimates is NOT an interval for the truth; use it only to report
    top-10 inclusion probability and mean rank (fixed eligible set, distinct-
    match issue avoided by keeping the cohort fixed, B = 200).
8.2 Winner's-curse check: report the nested odd/even held-out mean of the top-10
    metric (primary metric and elevation), and the calibration slope (Task 4.3).
8.3 Rolling-origin test per origin season (2022-2025 -> next season), eligibility
    stated, each player counted once per origin. Report N, Pearson, Spearman per
    origin for H_p and E_p. A pooled number is allowed only with cluster-by-player
    resampling. If N < 30 for an origin, print "NOT ESTIMABLE".
8.4 Stability table: top-10 overlap under +/-25% on balls and HP balls, HP
    matches 10/15/19, tau2 choice (SH/DL/floor), centring (strata vs global),
    pressure-pillar weights +/-0.10, and the naive benchmark. All computed.

====================================================================
TASK 9: PRE-DECLARED GATES (computed in code, each with N)
====================================================================
G1 identity tests pass (Task 1).
G2 calibration slope interval contains 1 (Task 4.3) for the primary metric.
G3 split-half r of the primary ranking metric >= 0.35 (20 splits, fixed cohort).
G4 simulation, scenario (a), each role: CR1 coverage on all players in
   [0.85, 0.95]; EB coverage on all players >= 0.85; null omnibus FPR <= 0.10.
G5 omnibus p < 0.05 (Task 7.1).
G6 rolling-origin Spearman >= 0.30 with N >= 30 in at least 2 origins.
G7 top-10 overlap >= 7/10 under every single stability variation in 8.4.
Label rule: a list is VALIDATED only if G1-G7 all pass for its role; otherwise
EXPLORATORY with the failing gate names. Per-gate PASS/FAIL/NOT ESTIMABLE.

====================================================================
TASK 10: REPORT AND FREEZE
====================================================================
10.1 Regenerate the methodology report and FINAL_SUMMARY.md from the --final output
     only. Required statements: how pressure is defined (with the weights from
     code); why the primary metric is the lower bound of HP performance
     (reliability, per the brief); the evidence that elevation alone is not
     reliably estimable at this sample size (tau2 values, split-half, nested
     held-out, simulation SNR); the gate table; eligibility exclusion counts; the
     chase-dependence caveat; limitations. Remove all stale numbers (search for
     "100%", "validated", "clutch", "70-85", "310", "279", "50 stratified").
10.2 Run --final twice; confirm identical output apart from the timestamp; record
     SHA-256 of the script and of the output.

====================================================================
REPORT BACK (single message, numbers and tables only, in this order)
====================================================================
1. Identity-test result and the Mendis row (point vs boot w=1).
2. tau2_DL / tau2_SH / floor for each role; calibration slope with interval.
3. Why the Q47 bowler list differed; the pressure weights now used.
4. DeltaP_stratum summary; HP-ball innings split by bucket.
5. Simulation table: both roles, three SNR scenarios, coverage (all / top 10),
   FPR, power, SNR needed for 80% power.
6. Omnibus results and bowler over-level economy decision.
7. Gate table G1-G7 with N and label per role.
8. Final top-10 batters and bowlers (primary ranking): H_p with 90% interval, E_p,
   consistency gap, inclusion probability, innings-2 share.
9. Overlap matrix of lists (a)(b)(c).
10. Timing table; any task not completed, with the exact error.
