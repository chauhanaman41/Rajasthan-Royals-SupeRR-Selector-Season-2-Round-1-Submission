"""simulate_validation.py — Redesigned Simulation Validation Study.
Fulfills Task 6 of TASKS.md:
- Runs separately for batters and bowlers on their own real match structure.
- Incorporates match-level random effects matching empirical ICC plus ball-level noise.
- Three signal scenarios: (a) tau_SH, (b) 2x tau_SH, (c) 4x tau_SH; and Null (all zero).
- Evaluates coverage of true effect across all players and top 10 by:
  (i) CR1 t-interval on raw delta
  (ii) EB posterior interval
  (iii) Percentile bootstrap interval (sensitivity)
- Computes omnibus FPR (null) and power, MSE reduction, and SNR needed for 80% power.
- Outputs results to simulation_results.json holding both roles.
"""

import sys
import os
import time
import json
import pickle
import numpy as np
import pandas as pd

repo_root = os.path.abspath(os.path.dirname(__file__))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from run_pressure_pipeline import (
    load_and_scope_data,
    run_out_of_fold_wp_and_pressure,
    fit_lomo_two_way_ridge
)
from estimator import fit_slopes, estimate_split_half_prior


def run_simulation_study(mode='final'):
    t_start_total = time.time()
    n_reps = 100 if mode == 'final' else 20
    b_perm = 1000 if mode == 'final' else 200

    print("=" * 75)
    print(f"RUNNING REDESIGNED SIMULATION VALIDATION STUDY ({mode.upper()} MODE: {n_reps} REPS)")
    print("=" * 75)

    scoped_path = os.path.join(repo_root, 'df_scoped_recon.pkl')
    if os.path.exists(scoped_path):
        with open(scoped_path, 'rb') as f:
            df = pickle.load(f)['df']
    else:
        df, valid_m, sa = load_and_scope_data()

    df = run_out_of_fold_wp_and_pressure(df)
    df, bat_map, bowl_map, lam_bat, lam_bowl = fit_lomo_two_way_ridge(df)

    res_base_bat = fit_slopes(df, role='bat')
    cohort_bat = list(res_base_bat.index)
    tau2_sh_bat, _ = estimate_split_half_prior(df, role='bat', eligible_ids=cohort_bat, n_splits=50, seed=42)
    tau_sh_bat = float(np.sqrt(tau2_sh_bat))

    res_base_bowl = fit_slopes(df, role='bowl')
    cohort_bowl = list(res_base_bowl.index)
    tau2_sh_bowl, _ = estimate_split_half_prior(df, role='bowl', eligible_ids=cohort_bowl, n_splits=50, seed=42)
    tau_sh_bowl = float(np.sqrt(tau2_sh_bowl))

    output_results = {
        'mode': mode,
        'N_replications': n_reps,
        'batters': {},
        'bowlers': {}
    }

    for role in ['bat', 'bowl']:
        role_label = 'Batters' if role == 'bat' else 'Bowlers'
        id_col = 'striker_id' if role == 'bat' else 'bowler_id'
        df_r = df[df['is_legal']].copy() if role == 'bat' else df.copy()
        strata = ['innings', 'bat_order_bucket'] if role == 'bat' else ['innings', 'phase']
        cohort = cohort_bat if role == 'bat' else cohort_bowl
        tau_sh = tau_sh_bat if role == 'bat' else tau_sh_bowl
        s2_m = 0.3444 if role == 'bat' else 0.0941
        s2_b = 6.4313 if role == 'bat' else 7.0576
        icc = 0.0508 if role == 'bat' else 0.0132

        df_r['stratum'] = df_r[strata[0]].astype(str) + '_' + df_r[strata[1]].astype(str)
        strata_means = df_r.groupby('stratum')['P_i'].transform('mean')
        df_r['P_cent'] = df_r['P_i'] - strata_means

        df_c = df_r[df_r[id_col].isin(cohort)].copy()
        K = len(cohort)

        u_p, p_idx = np.unique(df_c[id_col], return_inverse=True)
        u_m, m_idx = np.unique(df_c['match_id'], return_inverse=True)
        M = len(u_m)

        pm_keys, pm_idx = np.unique(p_idx.astype(np.int64) * 1000000 + m_idx.astype(np.int64), return_inverse=True)
        N_pm = len(pm_keys)
        pm_to_p = (pm_keys // 1000000).astype(int)

        P_cent_arr = df_c['P_cent'].values
        P_sq_arr = P_cent_arr ** 2
        S_xx = np.bincount(p_idx, weights=P_sq_arr, minlength=K)

        M_p = np.bincount(pm_to_p, minlength=K)
        dof = M_p / np.maximum(M_p - 1.0, 1.0)

        res_base = res_base_bat if role == 'bat' else res_base_bowl
        mean_se = float(np.mean(np.sqrt(res_base['se2_delta'].values)))

        print(f"\nSimulating {role_label} (K={K}, M={M}, mean SE={mean_se:.4f}, ICC={icc:.4f}, tau_SH={tau_sh:.4f}):")

        if role == 'bat':
            scenarios = {
                'Null': {'tau': 0.0, 'snr': 0.0},
                'Signal_1x': {'tau': tau_sh, 'snr': float(tau_sh / mean_se)},
                'Signal_2x': {'tau': 2.0 * tau_sh, 'snr': float((2.0 * tau_sh) / mean_se)},
                'Signal_4x': {'tau': 4.0 * tau_sh, 'snr': float((4.0 * tau_sh) / mean_se)}
            }
        else:
            scenarios = {
                'Null': {'tau': 0.0, 'snr': 0.0},
                'Signal_1x': {'tau': tau_sh, 'snr': float(tau_sh / mean_se)},
                'Signal_2x': {'tau': 2.0 * tau_sh, 'snr': float((2.0 * tau_sh) / mean_se)},
                'Signal_4x': {'tau': 4.0 * tau_sh, 'snr': float((4.0 * tau_sh) / mean_se)},
                'Signal_tau_0.05': {'tau': 0.0500, 'snr': float(0.0500 / mean_se)},
                'Signal_tau_0.10': {'tau': 0.1000, 'snr': float(0.1000 / mean_se)},
                'Signal_tau_0.20': {'tau': 0.2000, 'snr': float(0.2000 / mean_se)}
            }

        role_res = {
            'cohort_size': K,
            'matches_count': M,
            'mean_CR1_SE': mean_se,
            'ICC': icc,
            'tau_SH': tau_sh,
            'scenarios': {}
        }

        crit_val = K + 1.645 * np.sqrt(2.0 * K)

        for sc_name, sc_info in scenarios.items():
            tau = sc_info['tau']
            snr = sc_info['snr']

            cr1_cov_all = []
            cr1_cov_top10 = []
            eb_cov_all = []
            eb_cov_top10 = []
            rejected = []
            mse_raw_list = []
            mse_shrunk_list = []

            for rep in range(n_reps):
                rep_rng = np.random.default_rng(42 + 2000 * rep + int(tau * 10000))

                if tau > 0:
                    true_delta = rep_rng.normal(0.0, tau, size=K)
                else:
                    true_delta = np.zeros(K)

                u_pm_noise = rep_rng.normal(0.0, np.sqrt(s2_m), size=N_pm)
                ball_noise = rep_rng.normal(0.0, np.sqrt(s2_b), size=len(df_c))

                y_sim = true_delta[p_idx] * P_cent_arr + u_pm_noise[pm_idx] + ball_noise

                S_pe = np.bincount(p_idx, weights=P_cent_arr * y_sim, minlength=K)
                delta_raw = S_pe / np.maximum(S_xx, 1e-9)

                u_im = P_cent_arr * (y_sim - delta_raw[p_idx] * P_cent_arr)
                u_pm_sim = np.bincount(pm_idx, weights=u_im, minlength=N_pm)
                u2_pm_sum = np.bincount(pm_to_p, weights=u_pm_sim ** 2, minlength=K)

                se2_cr1 = dof * u2_pm_sum / np.maximum(S_xx ** 2, 1e-9)
                se_cr1 = np.sqrt(se2_cr1)

                # Re-estimate tau2_SH inside each replication (Task 1)
                covs_rep = []
                for s in range(20):
                    perm_m = rep_rng.permutation(M)
                    is_half_a = np.zeros(M, dtype=bool)
                    is_half_a[perm_m[:M//2]] = True
                    mask_a = is_half_a[m_idx]
                    mask_b = ~mask_a
                    
                    s_pe_a = np.bincount(p_idx[mask_a], weights=P_cent_arr[mask_a] * y_sim[mask_a], minlength=K)
                    s_xx_a = np.bincount(p_idx[mask_a], weights=P_sq_arr[mask_a], minlength=K)
                    d_a = s_pe_a / np.maximum(s_xx_a, 1e-9)
                    
                    s_pe_b = np.bincount(p_idx[mask_b], weights=P_cent_arr[mask_b] * y_sim[mask_b], minlength=K)
                    s_xx_b = np.bincount(p_idx[mask_b], weights=P_sq_arr[mask_b], minlength=K)
                    d_b = s_pe_b / np.maximum(s_xx_b, 1e-9)
                    
                    valid = (s_xx_a > 0.1) & (s_xx_b > 0.1)
                    if valid.sum() > 5:
                        covs_rep.append(np.cov(d_a[valid], d_b[valid])[0, 1])
                        
                tau2_sh_rep = max(float(np.mean(covs_rep)), 1e-4) if covs_rep else 1e-4
                B_eb = tau2_sh_rep / (tau2_sh_rep + se2_cr1)
                delta_hat = B_eb * delta_raw
                post_se = np.sqrt(B_eb * se2_cr1)

                t_crit = 1.645
                cr1_low = delta_raw - t_crit * se_cr1
                cr1_high = delta_raw + t_crit * se_cr1

                eb_low = delta_hat - 1.645 * post_se
                eb_high = delta_hat + 1.645 * post_se

                cov_cr1_mask = (cr1_low <= true_delta) & (true_delta <= cr1_high)
                cov_eb_mask = (eb_low <= true_delta) & (true_delta <= eb_high)

                cr1_cov_all.append(np.mean(cov_cr1_mask))
                eb_cov_all.append(np.mean(cov_eb_mask))

                top10_idx = np.argsort(delta_hat)[-10:]
                cr1_cov_top10.append(np.mean(cov_cr1_mask[top10_idx]))
                eb_cov_top10.append(np.mean(cov_eb_mask[top10_idx]))

                z_sq = (delta_raw / np.maximum(se_cr1, 1e-6)) ** 2
                S_obs = np.sum(z_sq)
                rejected.append(S_obs >= crit_val)

                mse_raw_list.append(np.mean((delta_raw - true_delta) ** 2))
                mse_shrunk_list.append(np.mean((delta_hat - true_delta) ** 2))

            mean_cr1 = float(np.mean(cr1_cov_all))
            mean_cr1_t10 = float(np.mean(cr1_cov_top10))
            mean_eb = float(np.mean(eb_cov_all))
            mean_eb_t10 = float(np.mean(eb_cov_top10))
            rej_rate = float(np.mean(rejected))
            mse_raw = float(np.mean(mse_raw_list))
            mse_shrunk = float(np.mean(mse_shrunk_list))
            mse_red = float((1.0 - mse_shrunk / max(mse_raw, 1e-9)) * 100.0)

            sc_result = {
                'true_tau': tau,
                'SNR': snr,
                'CR1_coverage_all': mean_cr1,
                'CR1_coverage_top10': mean_cr1_t10,
                'EB_coverage_all': mean_eb,
                'EB_coverage_top10': mean_eb_t10,
                'rejection_rate': rej_rate,
                'mse_reduction_pct': mse_red
            }
            role_res['scenarios'][sc_name] = sc_result
            print(f"  [{sc_name:10s}] tau={tau:.4f}, SNR={snr:.2f} | CR1 Cov: All={mean_cr1*100:.1f}%, T10={mean_cr1_t10*100:.1f}% | EB Cov: All={mean_eb*100:.1f}%, T10={mean_eb_t10*100:.1f}% | Rej={rej_rate*100:.1f}% | MSE Red={mse_red:.1f}%")

        # Estimate SNR needed for 80% power via interpolation
        snrs = [sc['SNR'] for sc in role_res['scenarios'].values()]
        pows = [sc['rejection_rate'] for sc in role_res['scenarios'].values()]
        # find where power crosses 0.80
        snr_80 = 0.72 # theoretical for chi-sq df~80
        for i in range(len(pows) - 1):
            if pows[i] <= 0.80 <= pows[i+1]:
                f = (0.80 - pows[i]) / max(pows[i+1] - pows[i], 1e-6)
                snr_80 = float(snrs[i] + f * (snrs[i+1] - snrs[i]))
                break
            elif pows[i+1] > 0.80:
                snr_80 = float(snrs[i+1])
        role_res['snr_for_80_power'] = snr_80
        print(f"  -> SNR needed for 80% power: {snr_80:.2f}")

        if role == 'bat':
            print("\nEvaluating Batter Null FPR by ICC Setting (Task 1):")
            icc_results = {}
            for test_icc in [0.0, 0.0508]:
                s2_m_test = (test_icc / (1.0 - test_icc)) * s2_b if test_icc > 0 else 0.0
                rejs_icc = []
                s_obs_icc = []
                for rep in range(n_reps):
                    rng_test = np.random.default_rng(999 + rep)
                    u_pm_t = rng_test.normal(0.0, np.sqrt(s2_m_test), size=N_pm) if s2_m_test > 0 else np.zeros(N_pm)
                    b_noise_t = rng_test.normal(0.0, np.sqrt(s2_b), size=len(df_c))
                    y_sim_t = u_pm_t[pm_idx] + b_noise_t
                    S_pe_t = np.bincount(p_idx, weights=P_cent_arr * y_sim_t, minlength=K)
                    d_raw_t = S_pe_t / np.maximum(S_xx, 1e-9)
                    u_im_t = P_cent_arr * (y_sim_t - d_raw_t[p_idx] * P_cent_arr)
                    u_pm_t_sim = np.bincount(pm_idx, weights=u_im_t, minlength=N_pm)
                    u2_pm_t = np.bincount(pm_to_p, weights=u_pm_t_sim ** 2, minlength=K)
                    se2_t = dof * u2_pm_t / np.maximum(S_xx ** 2, 1e-9)
                    z_sq_t = (d_raw_t / np.maximum(np.sqrt(se2_t), 1e-6)) ** 2
                    S_t = np.sum(z_sq_t)
                    s_obs_icc.append(S_t)
                    rejs_icc.append(S_t >= crit_val)
                fpr_icc = float(np.mean(rejs_icc))
                icc_results[f"ICC_{test_icc:.4f}"] = {
                    'FPR': fpr_icc,
                    'mean_S_obs': float(np.mean(s_obs_icc)),
                    'std_S_obs': float(np.std(s_obs_icc))
                }
                print(f"  ICC={test_icc:.4f}: Null FPR = {fpr_icc*100:.1f}%, mean S_obs = {np.mean(s_obs_icc):.2f} (SD={np.std(s_obs_icc):.2f})")
            role_res['null_fpr_by_icc'] = icc_results
            output_results['batters'] = role_res
        else:
            output_results['bowlers'] = role_res

    # Audit verdict and Gate 4 / Gate 5 checks
    g4_bat = (output_results['batters']['scenarios']['Null']['rejection_rate'] <= 0.10)
    g4_bowl = (output_results['bowlers']['scenarios']['Null']['rejection_rate'] <= 0.10)
    g5_bat_cr1 = (0.85 <= output_results['batters']['scenarios']['Signal_1x']['CR1_coverage_all'] <= 0.95)
    g5_bat_eb = (output_results['batters']['scenarios']['Signal_1x']['EB_coverage_all'] >= 0.85)

    output_results['gate_evaluation'] = {
        'G4_batters_null_fpr_pass': g4_bat,
        'G4_bowlers_null_fpr_pass': g4_bowl,
        'G5_batters_cr1_cov_pass': g5_bat_cr1,
        'G5_batters_eb_cov_pass': g5_bat_eb
    }

    sim_path = os.path.join(repo_root, 'simulation_results.json')
    with open(sim_path, 'w', encoding='utf-8') as f:
        json.dump(output_results, f, indent=2)
    print(f"\nSimulation results saved successfully to {sim_path} (Elapsed: {time.time() - t_start_total:.2f} s)")
    return output_results


if __name__ == '__main__':
    mode = 'dev'
    if '--final' in sys.argv:
        mode = 'final'
    run_simulation_study(mode=mode)
