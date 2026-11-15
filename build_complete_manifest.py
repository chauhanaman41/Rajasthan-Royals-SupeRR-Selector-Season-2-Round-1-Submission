import csv
import re
import pandas as pd

def build():
    manifest_rows = []

    def add(value, description, source_file, table_or_block, row_key):
        manifest_rows.append({
            'value': str(value).strip(),
            'description': description.strip(),
            'source_file': source_file.strip(),
            'table_or_block': table_or_block.strip(),
            'row_key': row_key.strip()
        })

    # ==========================================
    # 1. SCOPING & BASELINE MATCH VALUES
    # ==========================================
    add("777", "Total scoped matches remaining", "pipeline_output_tables.md", "Table 1", "4. Exclude Ties")
    add("185,567", "Total scoped deliveries remaining", "pipeline_output_tables.md", "Table 1", "4. Exclude Ties")
    add("354", "IPL scoped matches", "pipeline_output_tables.md", "Table 1", "354 IPL")
    add("423", "T20I scoped matches", "pipeline_output_tables.md", "Table 1", "423 T20I")
    add("85,486", "IPL scoped deliveries", "pipeline_output_tables.md", "Table 1", "85,486 IPL")
    add("100,081", "T20I scoped deliveries", "pipeline_output_tables.md", "Table 1", "100,081 T20I")
    add("373", "Full-Member T20I matches", "pipeline_output_tables.md", "Table 1", "373 T20Is Full-Member")
    add("50", "Associate-involved T20I matches", "pipeline_output_tables.md", "Table 1", "50 involve Associates")
    add("178.19", "Canonical Innings 1 Par overall", "RESULTS.md", "Runtime Logs", "Innings 1 - Overall: 178.19")
    add("160.56", "Canonical Innings 2 Par overall", "RESULTS.md", "Runtime Logs", "Innings 2 - Overall: 160.56")

    # Win probability Brier scores
    add("0.2228", "Win probability Innings 1 Brier score", "pipeline_output_tables.md", "Table 2", "Innings 1 (PAVA Out-of-Fold)")
    add("0.1308", "Win probability Innings 2 Brier score", "pipeline_output_tables.md", "Table 2", "Innings 2 (PAVA Out-of-Fold)")
    add("0.1787", "Win probability Pooled Brier score", "pipeline_output_tables.md", "Table 2", "Combined / Pooled (Out-of-Fold)")

    # High pressure metrics
    add("0.474", "Mean Composite Pressure Intensity", "superr_selector_season_2_unified_methodology_report (2).md", "Section 1", "Mean Composite Pressure Intensity: 0.474")
    add("0.227", "Mean HP pressure delta above stratum", "superr_selector_season_2_unified_methodology_report (2).md", "Section 1", "Mean HP Pressure Delta: +0.227")
    add("37,114", "Count of High-Pressure deliveries", "superr_selector_season_2_unified_methodology_report (2).md", "Section 1", "37,114 balls")
    add("20.0%", "Share of High-Pressure deliveries", "superr_selector_season_2_unified_methodology_report (2).md", "Section 1", "20.0% of deliveries")
    add("0.601", "High-Pressure threshold 80th percentile", "superr_selector_season_2_unified_methodology_report (2).md", "Section 1", "P_i >= 0.601")

    # ==========================================
    # 2. ELIGIBILITY FUNNEL (Table 3 in report)
    # ==========================================
    add("815", "Batters total appearing", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Total appearing: 815")
    add("650", "Batters excluded by volume < 300 balls", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 300 legal balls: 650")
    add("165", "Batters remaining after volume filter", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Remaining: 165")
    add("9", "Batters excluded by HP volume < 60 balls", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 60 HP balls: 9")
    add("156", "Batters remaining after HP volume filter", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Remaining: 156")
    add("78", "Batters excluded by HP breadth < 15 matches", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 15 HP matches: 78")
    add("78", "Eligible batters count", "pipeline_output_tables.md", "Table 4", "Eligible Cohort Size: 78")
    add("0", "Batters excluded by < 60% Full Member share", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 60% Full Member share: 0")

    add("586", "Bowlers total appearing", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Total appearing: 586")
    add("411", "Bowlers excluded by volume < 300 balls", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 300 deliveries: 411")
    add("175", "Bowlers remaining after volume filter", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Remaining: 175")
    add("16", "Bowlers excluded by HP volume < 60 balls", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 60 HP balls: 16")
    add("159", "Bowlers remaining after HP volume filter", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Remaining: 159")
    add("77", "Bowlers excluded by HP breadth < 15 matches", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 15 HP matches: 77")
    add("82", "Eligible bowlers count", "pipeline_output_tables.md", "Table 4", "Eligible Cohort Size: 82")
    add("0", "Bowlers excluded by < 60% Full Member share", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Excluded by < 60% Full Member share: 0")

    # Cutoff rules definitions
    add("300", "Eligibility volume cutoff", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "300")
    add("60", "Eligibility HP volume cutoff", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "60")
    add("15", "Eligibility HP breadth matches cutoff", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "15")
    add(r"60\%", "Eligibility Full Member share cutoff", "superr_selector_season_2_unified_methodology_report (2).md", "Funnel", "Opposition Quality")

    # ==========================================
    # 3. VALIDATION GATES (Table 8 / Table 6 in report)
    # ==========================================
    add("0.00e+00", "G1 Batters max difference on identity test", "pipeline_output_tables.md", "Table 8", "G1: Identity Tests Pass")
    add("1.357", "G2 Batters calibration slope point estimate", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("-0.513", "G2 Batters calibration slope CI lower", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("3.333", "G2 Batters calibration slope CI upper", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("3.85", "G2 Batters calibration slope interval width", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("-56.747", "G2 Bowlers calibration slope point estimate", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("-588.4", "G2 Bowlers calibration slope CI lower", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("474.0", "G2 Bowlers calibration slope CI upper", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("1062.4", "G2 Bowlers calibration slope interval width", "pipeline_output_tables.md", "Table 8", "G2: Calibration Slope Contains 1")
    add("0.1447", "G3 Batters split-half correlation", "pipeline_output_tables.md", "Table 8", "G3: Split-Half Reliability")
    add("0.2537", "G3 Bowlers split-half correlation", "pipeline_output_tables.md", "Table 8", "G3: Split-Half Reliability")
    add("87.7%", "G4 Batters CR1 coverage", "pipeline_output_tables.md", "Table 8", "G4: Simulation Study")
    add("60.1%", "G4 Batters Empirical Bayes coverage", "pipeline_output_tables.md", "Table 8", "G4: Simulation Study")
    add("29.0%", "G4 Batters simulation null false positive rate", "pipeline_output_tables.md", "Table 8", "G4: Simulation Study")
    add("88.5%", "G4 Bowlers CR1 coverage", "pipeline_output_tables.md", "Table 8", "G4: Simulation Study")
    add("94.1%", "G4 Bowlers Empirical Bayes coverage", "pipeline_output_tables.md", "Table 8", "G4: Simulation Study")
    add("19.0%", "G4 Bowlers simulation null false positive rate", "pipeline_output_tables.md", "Table 8", "G4: Simulation Study")
    add("123.93", "G5 Batters omnibus test statistic", "pipeline_output_tables.md", "Table 8", "G5: Omnibus Permutation")
    add("0.0020", "G5 Batters omnibus permutation p-value", "pipeline_output_tables.md", "Table 8", "G5: Omnibus Permutation")
    add("98.79", "G5 Bowlers omnibus test statistic", "pipeline_output_tables.md", "Table 8", "G5: Omnibus Permutation")
    add("0.0639", "G5 Bowlers omnibus permutation p-value", "pipeline_output_tables.md", "Table 8", "G5: Omnibus Permutation")
    add("0.2522", "G6 Batters max rolling origin Spearman rho", "pipeline_output_tables.md", "Table 8", "G6: Rolling-Origin Spearman")
    add("0.1315", "G6 Bowlers max rolling origin Spearman rho", "pipeline_output_tables.md", "Table 8", "G6: Rolling-Origin Spearman")
    add("0/4", "G6 Batters origins meeting threshold count", "pipeline_output_tables.md", "Table 8", "G6: Rolling-Origin Spearman")
    add("0/4", "G6 Bowlers origins meeting threshold count", "pipeline_output_tables.md", "Table 8", "G6: Rolling-Origin Spearman")
    add("3/10", "G7 Batters benchmark baseline overlap", "pipeline_output_tables.md", "Table 8", "G7: Stability Overlap")
    add("4/10", "G7 Bowlers benchmark baseline overlap", "pipeline_output_tables.md", "Table 8", "G7: Stability Overlap")

    # Gate thresholds from Table 8 header/descriptions
    add("0.35", "G3 threshold correlation", "pipeline_output_tables.md", "Table 8", "r >= 0.35")
    add("0.05", "G5 threshold p-value", "pipeline_output_tables.md", "Table 8", "p < 0.05")
    add("0.30", "G6 threshold correlation", "pipeline_output_tables.md", "Table 8", "Spearman >= 0.30")
    add("7/10", "G7 threshold overlap", "pipeline_output_tables.md", "Table 8", "Overlap >= 7/10")

    # ==========================================
    # 4. TOP 10 BATTERS (Table 5a in run1_tables / Table 1 in report)
    # Exact values from pipeline_output_tables.md line 121-130
    # ==========================================
    batters_data = [
        ("4260", "Heinrich Klaasen", "+0.239", "+0.157", "+0.321", "+0.001", "1,401", "285", "70", "26", "89.0%", "4.4", "53.3%"),
        ("47", "Virat Kohli", "+0.206", "+0.128", "+0.284", "+0.002", "2,442", "378", "88", "25", "75.5%", "9.0", "97.1%"),
        ("6931", "Pathum Nissanka", "+0.204", "+0.121", "+0.286", "+0.002", "1,381", "317", "67", "24", "74.0%", "8.4", "93.1%"),
        ("6396", "Tim David", "+0.202", "+0.117", "+0.287", "+0.000", "1,154", "300", "93", "31", "66.5%", "9.9", "70.0%"),
        ("7897", "Namboori Tilak Varma", "+0.180", "+0.108", "+0.253", "-0.001", "2,310", "774", "115", "48", "53.5%", "15.0", "69.6%"),
        ("1699", "Suryakumar Yadav", "+0.185", "+0.104", "+0.266", "-0.001", "2,614", "514", "130", "45", "47.0%", "16.6", "74.7%"),
        ("7216", "Prabhsimran Singh", "+0.185", "+0.101", "+0.270", "+0.001", "1,033", "366", "56", "24", "38.5%", "16.7", "90.4%"),
        ("4986", "Rovman Powell", "+0.182", "+0.099", "+0.265", "+0.000", "1,524", "315", "97", "37", "38.5%", "16.5", "63.2%"),
        ("3672", "Kusal Mendis", "+0.184", "+0.098", "+0.270", "+0.001", "1,220", "236", "61", "20", "40.5%", "15.8", "95.3%"),
        ("6819", "Yashasvi Jaiswal", "+0.178", "+0.093", "+0.264", "+0.001", "1,739", "375", "82", "27", "33.5%", "19.1", "99.7%")
    ]

    for pid, name, hp, hlow, hhigh, ep, balls, hp_balls, matches, hp_m, inc_p, m_rank, inn2 in batters_data:
        add(pid, f"Batter {name} player_id", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(hp, f"Batter {name} H_p", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(hlow, f"Batter {name} H_low", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(hhigh, f"Batter {name} H_high CI bound", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(ep, f"Batter {name} Shrunk Elevation Ep", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(balls, f"Batter {name} total legal balls", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(hp_balls, f"Batter {name} HP balls", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(matches, f"Batter {name} total matches", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(hp_m, f"Batter {name} HP matches", "hp_matches.csv", "HP Matches Table", pid)
        add(inc_p, f"Batter {name} inclusion probability", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(m_rank, f"Batter {name} mean rank", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")
        add(inn2, f"Batter {name} Innings 2 HP share", "pipeline_output_tables.md", "Table 5a", f"**{name}** (`{pid}`)")

    # ==========================================
    # 5. TOP 10 BOWLERS (Table 6a in run1_tables / Table 2 in report)
    # Exact values from pipeline_output_tables.md line 183-192
    # ==========================================
    bowlers_data = [
        ("4101", "Mitchell Santner", "+0.119", "+0.103", "+0.136", "+0.002", "1,725", "340", "79", "32", "91.5%", "4.4", "73.2%"),
        ("3644", "Kuldeep Yadav", "+0.119", "+0.102", "+0.135", "+0.001", "1,866", "403", "84", "35", "88.5%", "5.1", "61.5%"),
        ("781", "Sunil Narine", "+0.118", "+0.102", "+0.135", "+0.001", "1,479", "410", "64", "31", "68.0%", "9.5", "56.6%"),
        ("2876", "Axar Patel", "+0.118", "+0.102", "+0.135", "+0.002", "2,609", "548", "130", "54", "63.0%", "10.8", "64.2%"),
        ("2320", "Trent Boult", "+0.118", "+0.102", "+0.135", "+0.001", "1,562", "376", "67", "35", "58.0%", "11.5", "79.3%"),
        ("4219", "Krunal Pandya", "+0.118", "+0.102", "+0.134", "+0.001", "1,255", "287", "64", "25", "54.0%", "13.1", "88.5%"),
        ("2261", "Harshal Patel", "+0.118", "+0.102", "+0.134", "+0.001", "1,688", "439", "76", "38", "57.0%", "15.6", "80.0%"),
        ("6256", "Varun Chakravarthy", "+0.118", "+0.102", "+0.134", "-0.000", "2,083", "502", "91", "41", "55.5%", "14.5", "57.4%"),
        ("1566", "Mohammed Shami", "+0.118", "+0.101", "+0.134", "+0.001", "1,259", "249", "54", "27", "32.5%", "15.0", "73.5%"),
        ("1758", "Patrick Cummins", "+0.118", "+0.101", "+0.134", "+0.001", "1,161", "158", "49", "15", "38.0%", "14.4", "83.5%")
    ]

    for pid, name, hp, hlow, hhigh, ep, balls, hp_balls, matches, hp_m, inc_p, m_rank, inn2 in bowlers_data:
        add(pid, f"Bowler {name} player_id", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(hp, f"Bowler {name} H_p", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(hlow, f"Bowler {name} H_low", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(hhigh, f"Bowler {name} H_high CI bound", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(ep, f"Bowler {name} Shrunk Elevation Ep", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(balls, f"Bowler {name} total legal balls", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(hp_balls, f"Bowler {name} HP balls", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(matches, f"Bowler {name} total matches", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(hp_m, f"Bowler {name} HP matches", "hp_matches.csv", "HP Matches Table", pid)
        add(inc_p, f"Bowler {name} inclusion probability", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(m_rank, f"Bowler {name} mean rank", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")
        add(inn2, f"Bowler {name} Innings 2 HP share", "pipeline_output_tables.md", "Table 6a", f"**{name}** (`{pid}`)")

    # ==========================================
    # 6. OPPONENT OFFSET VALUES
    # ==========================================
    add("0.052375", "Batters beta_lomo All Deliveries", "opponent_offset.csv", "Opponent Offset Table", "batter")
    add("0.056785", "Batters beta_lomo HP Deliveries", "opponent_offset.csv", "Opponent Offset Table", "batter")
    add("0.051238", "Batters beta_lomo Non-HP Deliveries", "opponent_offset.csv", "Opponent Offset Table", "batter")
    add("0.005547", "Batters beta_lomo Drift HP vs Non-HP", "opponent_offset.csv", "Opponent Offset Table", "batter")
    add("0.069356", "Bowlers alpha_lomo All Deliveries", "opponent_offset.csv", "Opponent Offset Table", "bowler")
    add("0.066761", "Bowlers alpha_lomo HP Deliveries", "opponent_offset.csv", "Opponent Offset Table", "bowler")
    add("0.070082", "Bowlers alpha_lomo Non-HP Deliveries", "opponent_offset.csv", "Opponent Offset Table", "bowler")
    add("-0.003321", "Bowlers alpha_lomo Drift HP vs Non-HP", "opponent_offset.csv", "Opponent Offset Table", "bowler")

    # ==========================================
    # 7. METHOD OF MOMENTS SENSITIVITY (Table 4 in report)
    # ==========================================
    add("0.048482", "Batters Var(H_raw)", "phase2_diagnostics.md", "MoM Section", "0.048482")
    add("0.044109", "Batters mean SE^2", "phase2_diagnostics.md", "MoM Section", "0.044109")
    add("0.004373", "Batters tau2_MoM", "phase2_diagnostics.md", "MoM Section", "0.004373")

    add("0.056589", "Bowlers Var(H_raw)", "phase2_diagnostics.md", "MoM Section", "0.056589")
    add("0.038118", "Bowlers mean SE^2", "phase2_diagnostics.md", "MoM Section", "0.038118")
    add("0.018471", "Bowlers tau2_MoM", "phase2_diagnostics.md", "MoM Section", "0.018471")

    mom_batters = [
        ("Heinrich Klaasen", "+0.6059", "0.1173", "+0.2662", "+0.1715"),
        ("Virat Kohli", "+0.3397", "0.0921", "+0.2200", "+0.1316"),
        ("Pathum Nissanka", "+0.4262", "0.1219", "+0.2192", "+0.1235"),
        ("Tim David", "+0.5304", "0.1503", "+0.2186", "+0.1190"),
        ("Namboori Tilak Varma", "+0.2207", "0.0742", "+0.1859", "+0.1047"),
        ("Suryakumar Yadav", "+0.2975", "0.1130", "+0.1938", "+0.0999"),
        ("Prabhsimran Singh", "+0.3753", "0.1457", "+0.1954", "+0.0963"),
        ("Rovman Powell", "+0.3075", "0.1259", "+0.1906", "+0.0942"),
        ("Kusal Mendis", "+0.4106", "0.1639", "+0.1936", "+0.0927"),
        ("Yashasvi Jaiswal", "+0.3390", "0.1560", "+0.1858", "+0.0857")
    ]
    for name, hraw, se, hp_mom, hlow_mom in mom_batters:
        add(hraw, f"Batter {name} MoM H_raw", "phase2_diagnostics.md", "Table 2.1a", f"**{name}**")
        add(se, f"Batter {name} MoM SE_CR1", "phase2_diagnostics.md", "Table 2.1a", f"**{name}**")
        add(hp_mom, f"Batter {name} MoM H_p", "phase2_diagnostics.md", "Table 2.1a", f"**{name}**")
        add(hlow_mom, f"Batter {name} MoM H_low", "phase2_diagnostics.md", "Table 2.1a", f"**{name}**")

    mom_bowlers = [
        ("Mitchell Santner", "+0.4543", "0.1146", "+0.3141", "+0.1700"),
        ("Kuldeep Yadav", "+0.4578", "0.1249", "+0.3016", "+0.1502"),
        ("Sunil Narine", "+0.3572", "0.1191", "+0.2527", "+0.1053"),
        ("Axar Patel", "+0.3821", "0.1307", "+0.2546", "+0.0996"),
        ("Trent Boult", "+0.3931", "0.1389", "+0.2519", "+0.0921"),
        ("Krunal Pandya", "+0.4102", "0.1476", "+0.2513", "+0.0868"),
        ("Harshal Patel", "+0.2344", "0.0982", "+0.1940", "+0.0630"),
        ("Varun Chakravarthy", "+0.2460", "0.1032", "+0.1987", "+0.0635"),
        ("Mohammed Shami", "+0.5396", "0.1953", "+0.2547", "+0.0711"),
        ("Patrick Cummins", "+0.6722", "0.2271", "+0.2632", "+0.0713")
    ]
    for name, hraw, se, hp_mom, hlow_mom in mom_bowlers:
        add(hraw, f"Bowler {name} MoM H_raw", "phase2_diagnostics.md", "Table 2.1b", f"**{name}**")
        add(se, f"Bowler {name} MoM SE_CR1", "phase2_diagnostics.md", "Table 2.1b", f"**{name}**")
        add(hp_mom, f"Bowler {name} MoM H_p", "phase2_diagnostics.md", "Table 2.1b", f"**{name}**")
        add(hlow_mom, f"Bowler {name} MoM H_low", "phase2_diagnostics.md", "Table 2.1b", f"**{name}**")

    # ==========================================
    # 8. BOWLER DECOMPOSITION (Table 5 in report)
    # ==========================================
    decomp_bowlers = [
        ("Mitchell Santner", "-0.118193", "+0.498175", "+0.074303", "+0.454285", "0.00e+00"),
        ("Kuldeep Yadav", "-0.054807", "+0.445651", "+0.066938", "+0.457782", "0.00e+00"),
        ("Sunil Narine", "-0.090716", "+0.359908", "+0.087987", "+0.357180", "0.00e+00"),
        ("Axar Patel", "-0.160490", "+0.486454", "+0.056139", "+0.382103", "0.00e+00"),
        ("Trent Boult", "-0.173386", "+0.477481", "+0.089036", "+0.393131", "0.00e+00"),
        ("Krunal Pandya", "-0.020237", "+0.349703", "+0.080758", "+0.410223", "0.00e+00"),
        ("Harshal Patel", "-0.165183", "+0.326539", "+0.073054", "+0.234410", "-2.78e-17"),
        ("Varun Chakravarthy", "-0.246485", "+0.413581", "+0.078857", "+0.245953", "-2.78e-17"),
        ("Mohammed Shami", "-0.164064", "+0.644890", "+0.058793", "+0.539619", "0.00e+00"),
        ("Patrick Cummins", "-0.108475", "+0.683713", "+0.096980", "+0.672218", "0.00e+00")
    ]
    for name, runs, wkt, opp, hraw, diff in decomp_bowlers:
        add(runs, f"Bowler {name} decomposition runs term", "phase2_diagnostics.md", "Table 2.2", name)
        add(wkt, f"Bowler {name} decomposition wicket term", "phase2_diagnostics.md", "Table 2.2", name)
        add(opp, f"Bowler {name} decomposition opponent term", "phase2_diagnostics.md", "Table 2.2", name)
        add(hraw, f"Bowler {name} decomposition reported H_raw", "phase2_diagnostics.md", "Table 2.2", name)
        add(diff, f"Bowler {name} decomposition difference check", "phase2_diagnostics.md", "Table 2.2", name)

    # Save to CSV
    df = pd.DataFrame(manifest_rows)
    df = df.drop_duplicates(subset=['value', 'source_file', 'table_or_block', 'row_key'])
    df.to_csv('numbers_manifest.csv', index=False)
    print(f'Manifest written successfully with {len(df)} entries.')

if __name__ == '__main__':
    build()
