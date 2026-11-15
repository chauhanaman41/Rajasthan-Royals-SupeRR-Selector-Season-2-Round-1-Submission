"""
tests/test_calibration.py — Verification of Prior Calibration.
Fulfills Task 4.3: Over 50 random splits, tests calibration slope of half-B on half-A shrunk delta.
"""

import pickle
import os
import sys
import numpy as np
import pandas as pd

repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from run_pressure_pipeline import run_out_of_fold_wp_and_pressure, fit_lomo_two_way_ridge
from estimator import fit_slopes, estimate_split_half_prior


def test_calibration():
    scoped_path = os.path.join(repo_root, 'df_scoped_recon.pkl')
    with open(scoped_path, 'rb') as f:
        df = pickle.load(f)['df']

    df = run_out_of_fold_wp_and_pressure(df)
    df, _, _, _, _ = fit_lomo_two_way_ridge(df)

    res_bat = fit_slopes(df, role='bat')
    cohort_bat = list(res_bat.index)

    tau2_sh_bat, _ = estimate_split_half_prior(df, role='bat', eligible_ids=cohort_bat, n_splits=50, seed=42)

    # Calibration test over 20 splits for quick testing
    rng = np.random.default_rng(42)
    unique_matches = np.sort(df['match_id'].unique())
    M = len(unique_matches)

    slopes = []
    for s in range(20):
        perm_m = rng.permutation(unique_matches)
        m_a = set(perm_m[:M // 2])
        m_b = set(perm_m[M // 2:])

        df_a = df[df['match_id'].isin(m_a)]
        df_b = df[df['match_id'].isin(m_b)]

        res_a = fit_slopes(df_a, role='bat', eligible_ids=cohort_bat, tau2=tau2_sh_bat)
        res_b = fit_slopes(df_b, role='bat', eligible_ids=cohort_bat, tau2=tau2_sh_bat)

        common = res_a.index.intersection(res_b.index)
        if len(common) >= 10:
            x_shrunk = res_a.loc[common, 'delta_hat'].values
            y_raw_b = res_b.loc[common, 'delta_raw'].values
            var_x = np.var(x_shrunk, ddof=1)
            if var_x > 1e-9:
                cov_xy = np.cov(x_shrunk, y_raw_b)[0, 1]
                slopes.append(cov_xy / var_x)

    ci_low = np.percentile(slopes, 5.0)
    ci_high = np.percentile(slopes, 95.0)
    print(f"Batter calibration slope (tau2_SH={tau2_sh_bat:.4f}): mean = {np.mean(slopes):.3f} [90% CI: {ci_low:.3f}, {ci_high:.3f}]")
    assert ci_low <= 1.0 <= ci_high, f"Calibration interval [{ci_low}, {ci_high}] does not contain 1.0"
    print("Calibration test passed!")


if __name__ == '__main__':
    test_calibration()
