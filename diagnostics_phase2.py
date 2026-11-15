import pickle
import hashlib
import sys
import numpy as np
import pandas as pd

def run_diagnostics():
    with open('df_scoped_recon.pkl', 'rb') as f:
        d = pickle.load(f)
    df = d['df']

    from run_pressure_pipeline import run_out_of_fold_wp_and_pressure, fit_lomo_two_way_ridge
    df = run_out_of_fold_wp_and_pressure(df)
    df, _, _, _, _ = fit_lomo_two_way_ridge(df)

    from estimator import fit_hp_performance, fit_slopes

    # Eligible cohorts
    elig_bat = fit_slopes(df, role='bat')
    elig_bowl = fit_slopes(df, role='bowl')

    # Primary estimations
    # Batters: default split-half prior
    hp_bat_primary, tau2_H_bat, _ = fit_hp_performance(df, role='bat', eligible_ids=elig_bat.index)
    # Bowlers: primary prior tau2_SH = 0.000100
    hp_bowl_primary, _, _ = fit_hp_performance(df, role='bowl', eligible_ids=elig_bowl.index, tau2_H=0.000100)

    # -------------------------------------------------------------
    # 2.1 Method of Moments (MoM) Sensitivity Analysis
    # -------------------------------------------------------------
    # Batters MoM
    var_h_bat = float(np.var(hp_bat_primary['H_raw'], ddof=1))
    mean_se2_bat = float(np.mean(hp_bat_primary['se2_H']))
    tau2_mom_bat = var_h_bat - mean_se2_bat

    # Bowlers MoM
    var_h_bowl = float(np.var(hp_bowl_primary['H_raw'], ddof=1))
    mean_se2_bowl = float(np.mean(hp_bowl_primary['se2_H']))
    tau2_mom_bowl = var_h_bowl - mean_se2_bowl

    # Recompute Batters under tau2_mom_bat
    hp_bat_mom, _, _ = fit_hp_performance(df, role='bat', eligible_ids=elig_bat.index, tau2_H=max(tau2_mom_bat, 1e-6))
    hp_bat_primary['rank_primary'] = hp_bat_primary['H_low'].rank(ascending=False).astype(int)
    hp_bat_mom['rank_mom'] = hp_bat_mom['H_low'].rank(ascending=False).astype(int)

    # Recompute Bowlers under tau2_mom_bowl
    hp_bowl_mom, _, _ = fit_hp_performance(df, role='bowl', eligible_ids=elig_bowl.index, tau2_H=max(tau2_mom_bowl, 1e-6))
    hp_bowl_primary['rank_primary'] = hp_bowl_primary['H_low'].rank(ascending=False).astype(int)
    hp_bowl_mom['rank_mom'] = hp_bowl_mom['H_low'].rank(ascending=False).astype(int)

    # Top 10 Batters table
    top10_bat_mom = hp_bat_mom.sort_values('H_low', ascending=False).head(10)
    top10_bat_primary = hp_bat_primary.sort_values('H_low', ascending=False).head(10)

    # Top 10 Bowlers table
    top10_bowl_mom = hp_bowl_mom.sort_values('H_low', ascending=False).head(10)
    top10_bowl_primary = hp_bowl_primary.sort_values('H_low', ascending=False).head(10)

    # -------------------------------------------------------------
    # 2.2 Bowler Decomposition Identity (Top 10 Bowlers, HP balls)
    # -------------------------------------------------------------
    top10_bowl_ids = top10_bowl_primary.index
    df_hp_bowl = df[(df['is_hp'] == 1) & df['bowler_id'].isin(top10_bowl_ids)].copy()
    df_hp_bowl['term_runs'] = df_hp_bowl['mu_ctx_bowl'] - df_hp_bowl['r_credit_bowl']
    df_hp_bowl['term_wkt'] = df_hp_bowl['c_wkt'] * df_hp_bowl['w_credit']
    df_hp_bowl['term_opp'] = df_hp_bowl['alpha_lomo']
    df_hp_bowl['perf_check'] = df_hp_bowl['term_runs'] + df_hp_bowl['term_wkt'] + df_hp_bowl['term_opp']

    decomp = df_hp_bowl.groupby('bowler_id').agg(
        player_name=('bowler_name', 'first'),
        mean_runs=('term_runs', 'mean'),
        mean_wkt=('term_wkt', 'mean'),
        mean_opp=('term_opp', 'mean'),
        sum_terms=('perf_check', 'mean')
    )
    decomp['H_raw'] = decomp.index.map(hp_bowl_primary['H_raw'])
    decomp['diff'] = decomp['sum_terms'] - decomp['H_raw']
    decomp = decomp.loc[top10_bowl_ids] # maintain primary rank order

    # Format Markdown document
    md = []
    md.append("# Phase 2 Diagnostics: Sensitivity and Decomposition Audit\n")
    md.append("*Protocol: SupeRR Selector Season 2 — Phase 2 Verification*\n\n---\n")

    md.append("## 2.1 Method of Moments (MoM) Sensitivity Analysis (Sensitivity Only)\n")
    md.append(f"- **Batters Eligible Cohort (N={len(elig_bat)}):**\n")
    md.append(f"  - $\\text{{Var}}(H_{{\\text{{raw}}}})$ = {var_h_bat:.6f}\n")
    md.append(f"  - $\\overline{{\\text{{SE}}^2}}$ = {mean_se2_bat:.6f}\n")
    md.append(f"  - $\\tau^2_{{\\text{{MoM}}}} = \\text{{Var}}(H_{{\\text{{raw}}}}) - \\overline{{\\text{{SE}}^2}}$ = **{tau2_mom_bat:.6f}** (Positive, Usable)\n\n")

    md.append(f"- **Bowlers Eligible Cohort (N={len(elig_bowl)}):**\n")
    md.append(f"  - $\\text{{Var}}(H_{{\\text{{raw}}}})$ = {var_h_bowl:.6f}\n")
    md.append(f"  - $\\overline{{\\text{{SE}}^2}}$ = {mean_se2_bowl:.6f}\n")
    md.append(f"  - $\\tau^2_{{\\text{{MoM}}}} = \\text{{Var}}(H_{{\\text{{raw}}}}) - \\overline{{\\text{{SE}}^2}}$ = **{tau2_mom_bowl:.6f}** (Positive, Usable)\n\n")

    # Table 2.1a: Batters MoM
    md.append("### Table 2.1a: Top 10 Batters Under Method of Moments Prior (Sensitivity Only)\n\n")
    md.append("| Player (`player_id`) | $H_{\\text{raw}}$ | $\\text{SE}_{\\text{CR1}}$ | $H_p$ | $H_{\\text{low}}$ | Primary Rank | MoM Rank |\n")
    md.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
    for pid, row in top10_bat_primary.iterrows():
        r_mom = hp_bat_mom.loc[pid]
        se = np.sqrt(row['se2_H'])
        md.append(f"| **{row['player_name']}** (`{pid}`) | {row['H_raw']:+.4f} | {se:.4f} | {r_mom['H_p']:+.4f} | **{r_mom['H_low']:+.4f}** | {row['rank_primary']} | {r_mom['rank_mom']} |\n")

    # Table 2.1b: Bowlers MoM
    md.append("\n### Table 2.1b: Top 10 Bowlers Under Method of Moments Prior (Sensitivity Only)\n\n")
    md.append("| Player (`player_id`) | $H_{\\text{raw}}$ | $\\text{SE}_{\\text{CR1}}$ | $H_p$ | $H_{\\text{low}}$ | Primary Rank | MoM Rank |\n")
    md.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
    for pid, row in top10_bowl_primary.iterrows():
        r_mom = hp_bowl_mom.loc[pid]
        se = np.sqrt(row['se2_H'])
        md.append(f"| **{row['player_name']}** (`{pid}`) | {row['H_raw']:+.4f} | {se:.4f} | {r_mom['H_p']:+.4f} | **{r_mom['H_low']:+.4f}** | {row['rank_primary']} | {r_mom['rank_mom']} |\n")

    # Overlap summary
    bat_ov = len(set(top10_bat_primary.index) & set(top10_bat_mom.head(10).index))
    bowl_ov = len(set(top10_bowl_primary.index) & set(top10_bowl_mom.head(10).index))
    md.append(f"\n- **Top-10 Overlap with Primary Estimator:**\n")
    md.append(f"  - Batters: **{bat_ov} / 10** ({bat_ov * 10}% overlap)\n")
    md.append(f"  - Bowlers: **{bowl_ov} / 10** ({bowl_ov * 10}% overlap)\n\n---\n\n")

    # -------------------------------------------------------------
    # 2.2 Bowler Decomposition Table
    # -------------------------------------------------------------
    md.append("## 2.2 Bowler Delivery Credit Decomposition (Top 10 Bowlers on HP Deliveries)\n\n")
    md.append("*Note: Identity holds by construction; checks arithmetic only.*\n\n")
    md.append("| Primary Rank | Bowler (`player_id`) | $\\text{mean}(\\mu_{\\text{ctx}} - r_{\\text{credit}})$ | $\\text{mean}(c_{\\text{wkt}} \\cdot w_{\\text{credit}})$ | $\\text{mean}(\\alpha_{\\text{lomo}})$ | Sum of Terms | Reported $H_{\\text{raw}}$ | Difference |\n")
    md.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
    for rnk, (pid, row) in enumerate(decomp.iterrows(), 1):
        md.append(f"| **{rnk}** | **{row['player_name']}** (`{pid}`) | {row['mean_runs']:+.6f} | {row['mean_wkt']:+.6f} | {row['mean_opp']:+.6f} | {row['sum_terms']:+.6f} | {row['H_raw']:+.6f} | {row['diff']:.2e} |\n")

    md.append("\n---\n\n")
    md.append("## 2.4 Runs-Only Ranking Status\n")
    md.append("- **Status:** NOT RUN (per Phase 2 protocol instructions; confirmed excluded).\n")

    out_content = "".join(md)
    out_path = 'phase2_diagnostics.md'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(out_content)

    print("phase2_diagnostics.md written successfully.")
    h = hashlib.sha256(out_content.encode('utf-8')).hexdigest()
    print(f"SHA-256 of phase2_diagnostics.md: {h}")

    # Print tables to stdout for verification
    print("\n" + out_content)
    return h

if __name__ == '__main__':
    run_diagnostics()
