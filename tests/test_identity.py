"""
tests/test_identity.py — Verification of Estimator Identity and Units.
Fulfills Task 1.4:
(i) Bootstrap with match weights = 1 reproduces point estimate delta_raw, SE^2, tau2, B_shrink, elev to 1e-9.
(ii) Plain OLS of e on P_cent over a player's balls equals delta_raw (Mendis 3672 and Kuldeep 3644).
"""

import pickle
import os
import sys
import numpy as np
import pandas as pd

# Add repo root to path
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from run_pressure_pipeline import run_out_of_fold_wp_and_pressure, fit_lomo_two_way_ridge
from estimator import fit_slopes


def test_identity_and_units():
    scoped_path = os.path.join(repo_root, 'df_scoped_recon.pkl')
    with open(scoped_path, 'rb') as f:
        df = pickle.load(f)['df']

    # Pre-process WP, pressure, and LOMO residuals
    df = run_out_of_fold_wp_and_pressure(df)
    df, alpha_dict, beta_dict, lam_bat, lam_bowl = fit_lomo_two_way_ridge(df)

    # -------------------------------------------------------------
    # (i) Bootstrap with match weights = 1 vs Point Estimate
    # -------------------------------------------------------------
    for role in ['bat', 'bowl']:
        point_res = fit_slopes(df, role=role)
        all_matches = df['match_id'].unique()
        boot_w1_res = fit_slopes(df, role=role, match_weights={m: 1.0 for m in all_matches})

        assert len(point_res) == len(boot_w1_res), f"Mismatch in count of eligible {role}s"
        assert point_res.index.equals(boot_w1_res.index), f"Mismatch in index of {role}s"

        diff_raw = (point_res['delta_raw'] - boot_w1_res['delta_raw']).abs().max()
        diff_se2 = (point_res['se2_delta'] - boot_w1_res['se2_delta']).abs().max()
        diff_tau2 = abs(point_res['tau2'].iloc[0] - boot_w1_res['tau2'].iloc[0])
        diff_b = (point_res['B_shrink'] - boot_w1_res['B_shrink']).abs().max()
        diff_elev = (point_res['elev'] - boot_w1_res['elev']).abs().max()

        print(f"Role: {role.upper()} Identity Checks:")
        print(f"  Max abs diff delta_raw: {diff_raw:.2e}")
        print(f"  Max abs diff se2_delta: {diff_se2:.2e}")
        print(f"  Max abs diff tau2:      {diff_tau2:.2e}")
        print(f"  Max abs diff B_shrink:  {diff_b:.2e}")
        print(f"  Max abs diff elev:      {diff_elev:.2e}")

        assert diff_raw < 1e-9, f"{role} delta_raw diff {diff_raw} >= 1e-9"
        assert diff_se2 < 1e-9, f"{role} se2_delta diff {diff_se2} >= 1e-9"
        assert diff_tau2 < 1e-9, f"{role} tau2 diff {diff_tau2} >= 1e-9"
        assert diff_b < 1e-9, f"{role} B_shrink diff {diff_b} >= 1e-9"
        assert diff_elev < 1e-9, f"{role} elev diff {diff_elev} >= 1e-9"

    # Print intermediate row for Mendis, Klaasen, Powell
    point_bat = fit_slopes(df, role='bat')
    boot_w1_bat = fit_slopes(df, role='bat', match_weights={m: 1.0 for m in df['match_id'].unique()})

    print("\nIntermediate rows for Mendis (3672), Klaasen (4260), Powell (4986):")
    for pid, name in [(3672, 'Kusal Mendis'), (4260, 'Heinrich Klaasen'), (4986, 'Rovman Powell')]:
        row_pt = point_bat.loc[pid]
        row_bt = boot_w1_bat.loc[pid]
        print(f"\n{name} ({pid}):")
        print(f"  Point:    n_b={row_pt['n_balls']:.0f}, n_hp={row_pt['n_hp']:.0f}, Mp={row_pt['M_p']:.0f}, Sxx={row_pt['S_xx']:.4f}, Spe={row_pt['S_pe']:.4f}, draw={row_pt['delta_raw']:.4f}, SE2={row_pt['se2_delta']:.6f}, tau2={row_pt['tau2']:.6f}, B={row_pt['B_shrink']:.4f}, delta_P={row_pt['delta_P']:.4f}, elev={row_pt['elev']:.4f}")
        print(f"  Boot w=1: n_b={row_bt['n_balls']:.0f}, n_hp={row_bt['n_hp']:.0f}, Mp={row_bt['M_p']:.0f}, Sxx={row_bt['S_xx']:.4f}, Spe={row_bt['S_pe']:.4f}, draw={row_bt['delta_raw']:.4f}, SE2={row_bt['se2_delta']:.6f}, tau2={row_bt['tau2']:.6f}, B={row_bt['B_shrink']:.4f}, delta_P={row_bt['delta_P']:.4f}, elev={row_bt['elev']:.4f}")

    # -------------------------------------------------------------
    # (ii) Plain OLS of e on P_cent over player's balls
    # -------------------------------------------------------------
    leg = df[df['is_legal']].copy()
    leg['stratum'] = leg['innings'].astype(str) + '_' + leg['bat_order_bucket'].astype(str)
    leg['P_cent'] = leg['P_i'] - leg.groupby('stratum')['P_i'].transform('mean')
    mendis_balls = leg[leg['striker_id'] == 3672]
    ols_mendis = float(np.sum(mendis_balls['P_cent'] * mendis_balls['e_bat']) / np.sum(mendis_balls['P_cent']**2))
    delta_mendis = float(point_bat.loc[3672, 'delta_raw'])
    diff_mendis = abs(ols_mendis - delta_mendis)

    all_b = df.copy()
    all_b['stratum'] = all_b['innings'].astype(str) + '_' + all_b['phase'].astype(str)
    all_b['P_cent'] = all_b['P_i'] - all_b.groupby('stratum')['P_i'].transform('mean')
    point_bowl = fit_slopes(df, role='bowl')
    kuldeep_balls = all_b[all_b['bowler_id'] == 3644]
    ols_kuldeep = float(np.sum(kuldeep_balls['P_cent'] * kuldeep_balls['e_bowl']) / np.sum(kuldeep_balls['P_cent']**2))
    delta_kuldeep = float(point_bowl.loc[3644, 'delta_raw'])
    diff_kuldeep = abs(ols_kuldeep - delta_kuldeep)

    print(f"\nPlain OLS Verification:")
    print(f"  Mendis (3672): Plain OLS = {ols_mendis:.6f}, delta_raw = {delta_mendis:.6f}, diff = {diff_mendis:.2e}")
    print(f"  Kuldeep (3644): Plain OLS = {ols_kuldeep:.6f}, delta_raw = {delta_kuldeep:.6f}, diff = {diff_kuldeep:.2e}")

    assert diff_mendis < 1e-9, f"Mendis OLS diff {diff_mendis} >= 1e-9"
    assert diff_kuldeep < 1e-9, f"Kuldeep OLS diff {diff_kuldeep} >= 1e-9"
    print("\nALL IDENTITY TESTS PASSED!")


if __name__ == '__main__':
    test_identity_and_units()
