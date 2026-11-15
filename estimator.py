"""
estimator.py — Unified Estimator for SupeRR Selector Season 2.
Implements the shared estimator fit_slopes and related empirical-Bayes methods
per Task 1 of TASKS.md. All estimation (point, bootstrap, simulation, split-half,
rolling-origin) calls this module.
"""

import numpy as np
import pandas as pd


def fit_slopes(
    df,
    role='bat',
    match_weights=None,
    resid=None,
    tau2=None,
    tau_min=0.08,
    eligible_ids=None,
    delta_P_hp=None,
    strata_cols=None,
    min_balls=300,
    min_hp=None,
    min_m_hp=15,
    min_fm_share=0.60
):
    """
    Fits high-pressure slopes with cluster-robust CR1 standard errors and empirical-Bayes shrinkage.
    
    Parameters
    ----------
    df : pd.DataFrame
        Deliveries dataframe containing P_i, is_hp, match_id, innings, bat_order_bucket, phase.
    role : str
        'bat' (legal deliveries only) or 'bowl' (all deliveries including extras).
    match_weights : dict, array-like, or None
        Multiplicity or weights w_m per match_id. If None, w_m = 1.0.
    resid : array-like, str, or None
        Residuals e to regress on P_cent. If None, uses 'e_bat' or 'e_bowl'.
    tau2 : float or None
        Between-player variance prior. If None, estimated via DerSimonian-Laird.
    tau_min : float
        Lower bound floor for tau (default 0.08).
    eligible_ids : list, set, or None
        Fixed cohort of eligible player IDs. If None, filters by min_balls, min_hp, min_m_hp.
    delta_P_hp : float, dict, or None
        Pressure offset factor. If None, computes player's own HP-strata weighted mean.
    strata_cols : list or None
        Strata for P_cent. Default: ['innings', 'bat_order_bucket'] for bat, ['innings', 'phase'] for bowl.
    min_balls, min_hp, min_m_hp, min_fm_share : int/float
        Eligibility thresholds if eligible_ids is None.
        
    Returns
    -------
    pd.DataFrame
        Indexed by player_id with columns:
        n_balls, n_hp, M_p, S_xx, S_pe, delta_raw, se2_delta, tau2, B_shrink, delta_hat, delta_P, elev, player_name.
    """
    if role == 'bat':
        id_col = 'striker_id'
        name_col = 'striker_name'
        e_col = 'e_bat'
        df_r = df[df['is_legal']].copy()
        default_strata = ['innings', 'bat_order_bucket']
        min_hp = 60 if min_hp is None else min_hp
    else:
        id_col = 'bowler_id'
        name_col = 'bowler_name'
        e_col = 'e_bowl'
        df_r = df.copy()
        default_strata = ['innings', 'phase']
        min_hp = 90 if min_hp is None else min_hp

    strata_cols = default_strata if strata_cols is None else strata_cols

    # Task 3.1: Stratified centering of P
    df_r['stratum'] = df_r[strata_cols[0]].astype(str) + '_' + df_r[strata_cols[1]].astype(str)
    strata_means = df_r.groupby('stratum')['P_i'].transform('mean')
    df_r['P_cent'] = df_r['P_i'] - strata_means

    # Residual e
    if resid is not None:
        if isinstance(resid, str):
            df_r['e_use'] = df_r[resid].values
        else:
            df_r['e_use'] = resid
    else:
        df_r['e_use'] = df_r[e_col].values

    # Match weights w_m
    if match_weights is not None:
        if isinstance(match_weights, dict):
            df_r['w_m'] = df_r['match_id'].map(match_weights).fillna(0.0).values
        elif isinstance(match_weights, pd.Series):
            df_r['w_m'] = df_r['match_id'].map(match_weights.to_dict()).fillna(0.0).values
        else:
            df_r['w_m'] = np.asarray(match_weights)
    else:
        df_r['w_m'] = 1.0

    # Cohort eligibility
    if eligible_ids is not None:
        eligible_set = set(eligible_ids)
        df_eval = df_r[df_r[id_col].isin(eligible_set)].copy()
    else:
        # Determine eligibility from data
        p_stats = df_r.groupby(id_col).agg(
            n_balls=('P_i', 'count'),
            n_hp=('is_hp', 'sum'),
            fm_share=('is_full_member_match', 'mean') if 'is_full_member_match' in df_r.columns else ('P_i', lambda x: 1.0)
        )
        hp_df = df_r[df_r['is_hp'] == 1]
        m_hp = hp_df.groupby(id_col)['match_id'].nunique()
        p_stats['m_hp'] = p_stats.index.map(m_hp).fillna(0).astype(int)

        elig_mask = (
            (p_stats['n_balls'] >= min_balls) &
            (p_stats['n_hp'] >= min_hp) &
            (p_stats['m_hp'] >= min_m_hp) &
            (p_stats['fm_share'] >= min_fm_share)
        )
        eligible_set = set(p_stats[elig_mask].index)
        df_eval = df_r[df_r[id_col].isin(eligible_set)].copy()

    if len(df_eval) == 0:
        cols = ['player_name', 'n_balls', 'n_hp', 'M_p', 'S_xx', 'S_pe', 'delta_raw', 'se2_delta', 'tau2', 'B_shrink', 'delta_hat', 'delta_P', 'elev']
        return pd.DataFrame(columns=cols)

    # Deliveries weighted terms
    df_eval['w_P_sq'] = df_eval['w_m'] * (df_eval['P_cent'] ** 2)
    df_eval['w_P_e'] = df_eval['w_m'] * df_eval['P_cent'] * df_eval['e_use']
    df_eval['w_balls'] = df_eval['w_m']
    df_eval['w_hp'] = df_eval['w_m'] * df_eval['is_hp']

    p_agg = df_eval.groupby(id_col).agg(
        n_balls=('w_balls', 'sum'),
        n_hp=('w_hp', 'sum'),
        S_xx=('w_P_sq', 'sum'),
        S_pe=('w_P_e', 'sum')
    )
    p_agg['delta_raw'] = p_agg['S_pe'] / np.maximum(p_agg['S_xx'], 1e-9)

    # CR1 score contribution u_pm per (player, match)
    # u_pm = sum_{i in pm} P_cent * (e_use - delta_raw_p * P_cent)
    df_eval['d_raw_p'] = df_eval[id_col].map(p_agg['delta_raw'])
    df_eval['u_im'] = df_eval['P_cent'] * (df_eval['e_use'] - df_eval['d_raw_p'] * df_eval['P_cent'])

    pm_grp = df_eval.groupby([id_col, 'match_id']).agg(
        u_pm=('u_im', 'sum'),
        w_m=('w_m', 'first')
    ).reset_index()

    pm_active = pm_grp[pm_grp['w_m'] > 0].copy()
    pm_active['u2_weighted'] = (pm_active['w_m'] ** 2) * (pm_active['u_pm'] ** 2)

    cr1_stats = pm_active.groupby(id_col).agg(
        M_p=('match_id', 'count'),
        u2_sum=('u2_weighted', 'sum')
    )
    p_agg['M_p'] = p_agg.index.map(cr1_stats['M_p']).fillna(0).astype(int)
    p_agg['u2_sum'] = p_agg.index.map(cr1_stats['u2_sum']).fillna(0.0)

    dof = p_agg['M_p'] / np.maximum(p_agg['M_p'] - 1.0, 1.0)
    p_agg['se2_delta'] = dof * p_agg['u2_sum'] / np.maximum(p_agg['S_xx'] ** 2, 1e-9)

    # Task 3.2: DeltaP_stratum per player
    hp_eval = df_eval[df_eval['is_hp'] == 1]
    if delta_P_hp is not None:
        if isinstance(delta_P_hp, dict):
            p_agg['delta_P'] = p_agg.index.map(delta_P_hp).fillna(0.2267)
        else:
            p_agg['delta_P'] = float(delta_P_hp)
    else:
        # Player's own HP ball weighted stratum mean of P_cent
        p_dp = hp_eval.groupby(id_col)['P_cent'].mean()
        p_agg['delta_P'] = p_agg.index.map(p_dp).fillna(0.2267)

    # Tau2 estimation
    K = len(p_agg)
    if tau2 is not None:
        tau2_use = float(tau2)
    else:
        w_i = 1.0 / np.maximum(p_agg['se2_delta'], 1e-9)
        w_sum = w_i.sum()
        d_bar = (w_i * p_agg['delta_raw']).sum() / max(w_sum, 1e-9)
        q_val = (w_i * ((p_agg['delta_raw'] - d_bar) ** 2)).sum()
        c_val = w_sum - (w_i ** 2).sum() / max(w_sum, 1e-9)
        tau2_dl = max(0.0, (q_val - (K - 1)) / max(c_val, 1e-9))
        tau2_use = max(tau2_dl, tau_min ** 2)

    p_agg['tau2'] = tau2_use
    p_agg['B_shrink'] = tau2_use / (tau2_use + p_agg['se2_delta'])
    p_agg['delta_hat'] = p_agg['B_shrink'] * p_agg['delta_raw']
    p_agg['elev'] = p_agg['delta_hat'] * p_agg['delta_P']

    # Attach player name if available
    if name_col in df.columns:
        name_map = df[[id_col, name_col]].drop_duplicates().set_index(id_col)[name_col].to_dict()
        p_agg['player_name'] = p_agg.index.map(name_map)
    else:
        p_agg['player_name'] = [str(i) for i in p_agg.index]

    return p_agg


def estimate_split_half_prior(df, role='bat', eligible_ids=None, n_splits=50, seed=42):
    """
    Task 4.1: Estimates true slope variance tau2_SH via split-half across-player covariance.
    Cohort is fixed at the full-sample eligible set.
    """
    rng = np.random.default_rng(seed)
    unique_matches = np.sort(df['match_id'].unique())
    M = len(unique_matches)

    cov_list = []
    for _ in range(n_splits):
        perm_m = rng.permutation(unique_matches)
        m_half_a = set(perm_m[:M // 2])
        m_half_b = set(perm_m[M // 2:])

        df_a = df[df['match_id'].isin(m_half_a)]
        df_b = df[df['match_id'].isin(m_half_b)]

        res_a = fit_slopes(df_a, role=role, eligible_ids=eligible_ids)
        res_b = fit_slopes(df_b, role=role, eligible_ids=eligible_ids)

        common = res_a.index.intersection(res_b.index)
        if len(common) >= 5:
            d_a = res_a.loc[common, 'delta_raw'].values
            d_b = res_b.loc[common, 'delta_raw'].values
            cov_val = np.cov(d_a, d_b)[0, 1]
            cov_list.append(cov_val)

    mean_cov = float(np.mean(cov_list)) if cov_list else 0.0
    tau2_sh = max(mean_cov, 1e-4)
    return tau2_sh, cov_list


def fit_hp_performance(df, role='bat', eligible_ids=None, match_weights=None, tau2_H=None, tau2_E=None, n_splits=50, seed=42):
    """
    Task 5.1 & 5.2: Fits HP Performance H_p and Elevation E_p.
    
    H_p is the player's mean on HP balls of opponent- and context-adjusted residual:
      - Batters: y_adj_bat + beta_opp (opposing bowler LOMO skill)
      - Bowlers: -y_adj_bowl + alpha_opp (opposing batter LOMO skill)
    WITHOUT subtracting player's own baseline.
    
    Cluster SE is match-level CR1. Shrinkage uses split-half covariance prior.
    E_p = H_p - non_HP performance.
    """
    rng = np.random.default_rng(seed)
    if role == 'bat':
        id_col = 'striker_id'
        name_col = 'striker_name'
        opp_col = 'beta_opp'
        raw_y = 'y_adj_bat'
        df_r = df[df['is_legal']].copy()
    else:
        id_col = 'bowler_id'
        name_col = 'bowler_name'
        opp_col = 'alpha_opp'
        raw_y = 'y_adj_bowl'
        df_r = df.copy()

    # Net credit relative to context and opponent (without subtracting own skill)
    if role == 'bat':
        if 'net_credit_bat' in df_r.columns:
            df_r['perf_ball'] = df_r['net_credit_bat'].values
        elif 'beta_lomo' in df_r.columns and raw_y in df_r.columns:
            df_r['perf_ball'] = df_r[raw_y].values + df_r['beta_lomo'].values
        elif 'beta_opp' in df_r.columns and raw_y in df_r.columns:
            df_r['perf_ball'] = df_r[raw_y].values + df_r['beta_opp'].values
        else:
            df_r['perf_ball'] = df_r[e_col].values
    else:
        if 'net_credit_bowl' in df_r.columns:
            df_r['perf_ball'] = df_r['net_credit_bowl'].values
        elif 'alpha_lomo' in df_r.columns and raw_y in df_r.columns:
            df_r['perf_ball'] = -df_r[raw_y].values + df_r['alpha_lomo'].values
        elif 'alpha_opp' in df_r.columns and raw_y in df_r.columns:
            df_r['perf_ball'] = -df_r[raw_y].values + df_r['alpha_opp'].values
        else:
            df_r['perf_ball'] = df_r[e_col].values

    # Match weights
    if match_weights is not None:
        if isinstance(match_weights, dict):
            df_r['w_m'] = df_r['match_id'].map(match_weights).fillna(0.0).values
        elif isinstance(match_weights, pd.Series):
            df_r['w_m'] = df_r['match_id'].map(match_weights.to_dict()).fillna(0.0).values
        else:
            df_r['w_m'] = np.asarray(match_weights)
    else:
        df_r['w_m'] = 1.0

    if eligible_ids is not None:
        eligible_set = set(eligible_ids)
        df_eval = df_r[df_r[id_col].isin(eligible_set)].copy()
    else:
        slopes_res = fit_slopes(df, role=role)
        eligible_set = set(slopes_res.index)
        df_eval = df_r[df_r[id_col].isin(eligible_set)].copy()

    # Split into HP and non-HP
    hp_df = df_eval[df_eval['is_hp'] == 1].copy()
    nhp_df = df_eval[df_eval['is_hp'] == 0].copy()

    def calc_state_stats(state_df):
        state_df['w_y'] = state_df['w_m'] * state_df['perf_ball']
        p_agg = state_df.groupby(id_col).agg(
            n_balls=('w_m', 'sum'),
            sum_y=('w_y', 'sum')
        )
        p_agg['mean_perf'] = p_agg['sum_y'] / np.maximum(p_agg['n_balls'], 1e-6)

        state_df['p_mean'] = state_df[id_col].map(p_agg['mean_perf'])
        state_df['u_im'] = state_df['perf_ball'] - state_df['p_mean']

        pm_grp = state_df.groupby([id_col, 'match_id']).agg(
            u_im=('u_im', 'sum'),
            w_m=('w_m', 'first')
        ).reset_index()
        pm_active = pm_grp[pm_grp['w_m'] > 0].copy()
        pm_active['u2_weighted'] = (pm_active['w_m'] ** 2) * (pm_active['u_im'] ** 2)

        cr1 = pm_active.groupby(id_col).agg(
            M_p=('match_id', 'count'),
            u2_sum=('u2_weighted', 'sum')
        )
        p_agg['M_p'] = p_agg.index.map(cr1['M_p']).fillna(0).astype(int)
        p_agg['u2_sum'] = p_agg.index.map(cr1['u2_sum']).fillna(0.0)

        dof = p_agg['M_p'] / np.maximum(p_agg['M_p'] - 1.0, 1.0)
        p_agg['se2'] = dof * p_agg['u2_sum'] / np.maximum(p_agg['n_balls'] ** 2, 1)
        return p_agg

    hp_stats = calc_state_stats(hp_df)
    nhp_stats = calc_state_stats(nhp_df)

    # Estimate prior tau2 for H_p and E_p via split-half covariance if not provided
    if tau2_H is None or tau2_E is None:
        unique_matches = np.sort(df_eval['match_id'].unique())
        M = len(unique_matches)
        cov_hp_list = []
        cov_elev_list = []

        for _ in range(n_splits):
            perm_m = rng.permutation(unique_matches)
            m_a = set(perm_m[:M // 2])
            m_b = set(perm_m[M // 2:])

            hp_a = calc_state_stats(hp_df[hp_df['match_id'].isin(m_a)].copy())
            hp_b = calc_state_stats(hp_df[hp_df['match_id'].isin(m_b)].copy())
            c_hp = hp_a.index.intersection(hp_b.index)
            if len(c_hp) >= 5:
                cov_hp_list.append(np.cov(hp_a.loc[c_hp, 'mean_perf'], hp_b.loc[c_hp, 'mean_perf'])[0, 1])

            nhp_a = calc_state_stats(nhp_df[nhp_df['match_id'].isin(m_a)].copy())
            nhp_b = calc_state_stats(nhp_df[nhp_df['match_id'].isin(m_b)].copy())
            c_all = c_hp.intersection(nhp_a.index).intersection(nhp_b.index)
            if len(c_all) >= 5:
                e_a = hp_a.loc[c_all, 'mean_perf'] - nhp_a.loc[c_all, 'mean_perf']
                e_b = hp_b.loc[c_all, 'mean_perf'] - nhp_b.loc[c_all, 'mean_perf']
                cov_elev_list.append(np.cov(e_a, e_b)[0, 1])

        tau2_H_est = max(float(np.mean(cov_hp_list)) if cov_hp_list else 1e-4, 1e-4)
        tau2_E_est = max(float(np.mean(cov_elev_list)) if cov_elev_list else 1e-4, 1e-4)
        tau2_H_use = tau2_H_est if tau2_H is None else float(tau2_H)
        tau2_E_use = tau2_E_est if tau2_E is None else float(tau2_E)
    else:
        tau2_H_use = float(tau2_H)
        tau2_E_use = float(tau2_E)

    tau2_H = tau2_H_use
    tau2_E = tau2_E_use

    res = pd.DataFrame(index=hp_stats.index)
    res['H_raw'] = hp_stats['mean_perf']
    res['se2_H'] = hp_stats['se2']
    res['B_H'] = tau2_H / (tau2_H + res['se2_H'])
    
    # Grand mean of H
    w_H = 1.0 / np.maximum(res['se2_H'], 1e-6)
    H_bar = float((w_H * res['H_raw']).sum() / w_H.sum())
    res['H_p'] = H_bar + res['B_H'] * (res['H_raw'] - H_bar)
    res['post_se_H'] = np.sqrt(res['B_H'] * res['se2_H'])
    res['H_low'] = res['H_p'] - 1.645 * res['post_se_H']
    res['H_high'] = res['H_p'] + 1.645 * res['post_se_H']

    # Elevation E_p = H_p - non_HP
    res['nhp_mean'] = res.index.map(nhp_stats['mean_perf']).fillna(0.0)
    res['nhp_se2'] = res.index.map(nhp_stats['se2']).fillna(0.01)
    res['E_raw'] = res['H_raw'] - res['nhp_mean']
    res['se2_E'] = res['se2_H'] + res['nhp_se2']
    res['B_E'] = tau2_E / (tau2_E + res['se2_E'])
    
    # Shrink E toward 0 (null of no elevation / difference from non-HP baseline)
    res['B_E'] = tau2_E / (tau2_E + res['se2_E'])
    res['E_p'] = res['B_E'] * res['E_raw']
    res['post_se_E'] = np.sqrt(res['B_E'] * res['se2_E'])
    res['E_low'] = res['E_p'] - 1.645 * res['post_se_E']
    res['E_high'] = res['E_p'] + 1.645 * res['post_se_E']

    # Innings 2 HP share (Task 3.3)
    inn2_hp = hp_df[hp_df['innings'] == 2].groupby(id_col).size()
    tot_hp = hp_df.groupby(id_col).size()
    res['hp_inn2_share'] = (res.index.map(inn2_hp).fillna(0) / res.index.map(tot_hp).fillna(1)) * 100.0
    res['is_chase_dep'] = res['hp_inn2_share'] >= 90.0

    # Attach player name
    if name_col in df.columns:
        name_map = df[[id_col, name_col]].drop_duplicates().set_index(id_col)[name_col].to_dict()
        res['player_name'] = res.index.map(name_map)
    else:
        res['player_name'] = [str(i) for i in res.index]

    return res, tau2_H, tau2_E
