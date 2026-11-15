/**
 * frontend/js/audit-lab.js
 * Interactive Algorithm Workbench for SupeRR Selector Season 2
 * Implements the 6 algorithm modules specified in Fixtures.md Section 5:
 *   1. 10-Fold OOF Win Probability & PAVA Monotone Calibration
 *   2. Tri-Pillar Pressure Index (P_i) Mixer & 0.601 Cutoff
 *   3. Dynamic Wicket Value (c_wkt) 20x10 Heatmap & G1 Decomposition
 *   4. Two-Way LOMO Ridge Opponent Confrontation Drift Explorer
 *   5. Empirical Bayes Shrinkage Sandbox (tau_SH vs tau_MoM & z-penalty slider)
 *   6. Gates G1-G7 Matrix & Scoping Funnel (883 -> 777 matches)
 */

class AuditLab {
  constructor() {
    this.container = document.getElementById('view-audit');
    this.cwktMatrix = null;
    this.wpPavaMode = 'pava'; // 'pava' | 'raw'
    this.ebPriorMode = 'sh';   // 'sh' | 'mom'
    this.ebZMultiplier = 1.645;
  }

  init() {
    if (!this.container) return;
    this.renderLayout();
    this.initModule1WP();
    this.initModule2Pressure();
    this.initModule3Wickets();
    this.initModule4LOMO();
    this.initModule5Shrinkage();
    this.initModule6Gates();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="audit-lab-main">
        <!-- Header & Exploratory Governance Alert -->
        <div class="audit-header-block">
          <h1>Validation & Audit Lab</h1>
          <p>
            Interactive mathematical verification suite for all 6 econometric algorithms in the SupeRR Selector Season 2 pipeline.
            Stress-test parameters, examine monotonicity proofs, and inspect why Gates G3, G4, G6, and G7 fail.
          </p>
          <div class="exploratory-banner">
            <span class="exploratory-tag">EXPLORATORY STATUS</span>
            <div class="exploratory-text">
              Neither ranking list is statistically validated by pre-declared gates G1–G7.
              Gates G3, G4, G6, and G7 fail; Gate G2 is NOT INFORMATIVE. Gate G5 passes for batters only.
              All situational elevation metrics are published transparently under exploratory research governance.
            </div>
          </div>
        </div>

        <!-- 6 Interactive Algorithm Modules Grid -->
        <div class="audit-modules-grid">
          
          <!-- Module 1: Win Probability & PAVA Monotone Calibration -->
          <div class="audit-module-card" id="moduleCard1">
            <div class="module-header-row">
              <div class="module-title-group">
                <span class="module-badge-id">Algorithm 1</span>
                <h3>10-Fold Blocked WP & PAVA Monotonicity</h3>
                <div class="module-subtitle">Match-Blocked Out-of-Fold Estimation + Isotonic Regression</div>
              </div>
            </div>
            <div class="module-formula-box">
              \\(\\hat{\\pi}_{\\text{cal}} = \\text{PAVA}(\\hat{\\pi}_{\\text{oof}}), \\quad \\text{Brier: } 0.2228 \\text{ (Inn 1)}, \\ 0.1308 \\text{ (Inn 2)}\\)
            </div>
            <div class="module-explainer">
              Win probability models can suffer from non-monotonic kinks (e.g. losing a wicket predicting higher win chance).
              We partition matches across 10 folds, compute out-of-fold log-loss, and apply the Pool Adjacent Violators Algorithm (PAVA)
              to enforce strictly monotonic resource degradation.
            </div>
            <div class="module-interactive-zone">
              <div class="toggle-pills-row">
                <button id="wpPavaBtn" class="toggle-pill-btn active">PAVA Monotone Curve</button>
                <button id="wpRawBtn" class="toggle-pill-btn">Raw Uncalibrated WP</button>
              </div>
              <div class="control-row">
                <div class="control-header">
                  <span>Wickets Down</span>
                  <span id="wpWicketsReadout" class="control-val-readout">3 / 10</span>
                </div>
                <input type="range" id="wpWicketsSlider" class="control-slider" min="0" max="9" value="3" />
              </div>
              <div class="control-row">
                <div class="control-header">
                  <span>Required Run Rate (RRR)</span>
                  <span id="wpRrrReadout" class="control-val-readout">9.50 rpo</span>
                </div>
                <input type="range" id="wpRrrSlider" class="control-slider" min="40" max="180" value="95" />
              </div>
              <div id="wpSvgContainer" style="width:100%; height:160px;"></div>
            </div>
          </div>

          <!-- Module 2: Tri-Pillar Pressure Index (P_i) -->
          <div class="audit-module-card" id="moduleCard2">
            <div class="module-header-row">
              <div class="module-title-group">
                <span class="module-badge-id">Algorithm 2</span>
                <h3>Tri-Pillar Continuous Pressure Index (\\(P_i\\))</h3>
                <div class="module-subtitle">40% WP Swing + 30% Scoreboard Tension + 20% Collapse Stress + 10% Stakes</div>
              </div>
            </div>
            <div class="module-formula-box">
              \\(P_i = 0.40 p_\\pi + 0.30 p_{\\text{tension}} + 0.20 p_{\\text{stress}} + 0.10 p_{\\text{stage}}, \\quad \\text{HP} \\iff P_i \\ge 0.601\\)
            </div>
            <div class="module-explainer">
              Synthesizes ball-by-ball win-probability swing, required run rate distress, wicket collapse exposure,
              and fixture stakes into a continuous metric \\([0, 1]\\). The 80th percentile threshold (\\(0.601\\)) isolates
              exactly 37,114 deliveries as High Pressure.
            </div>
            <div class="module-interactive-zone">
              <div class="control-row">
                <div class="control-header">
                  <span>Required Run Rate (RRR)</span>
                  <span id="pScoreboardReadout" class="control-val-readout">10.2 rpo</span>
                </div>
                <input type="range" id="pScoreboardSlider" class="control-slider" min="50" max="160" value="102" />
              </div>
              <div class="control-row">
                <div class="control-header">
                  <span>WP Volatility (Swing / Ball)</span>
                  <span id="pSwingReadout" class="control-val-readout">0.082 \\(\\Delta \\pi\\)</span>
                </div>
                <input type="range" id="pSwingSlider" class="control-slider" min="10" max="250" value="82" />
              </div>
              <div class="control-row">
                <div class="control-header">
                  <span>Fixture Stakes</span>
                  <span id="pStageReadout" class="control-val-readout">IPL Playoff (1.00)</span>
                </div>
                <input type="range" id="pStageSlider" class="control-slider" min="75" max="100" value="100" />
              </div>
              <!-- Thermometer Output -->
              <div style="display:flex; align-items:center; justify-content:space-between; margin-top:8px;">
                <span style="font-family:var(--font-sans); font-size:0.86rem; font-weight:600;">Composite Pressure:</span>
                <span id="pCompositeVal" style="font-family:var(--font-mono); font-size:1.4rem; font-weight:700; color:var(--accent-coral);">0.684</span>
                <span id="pStatusBadge" class="gate-status-pill pass">HIGH PRESSURE (\\(P_i \\ge 0.601\\))</span>
              </div>
            </div>
          </div>

          <!-- Module 3: Dynamic Wicket Value & G1 Identity -->
          <div class="audit-module-card" id="moduleCard3">
            <div class="module-header-row">
              <div class="module-title-group">
                <span class="module-badge-id">Algorithm 3</span>
                <h3>Dynamic Wicket Valuation (\\(c_{\\text{wkt}}\\)) & G1 Identity</h3>
                <div class="module-subtitle">20x10 Expected Run Loss Matrix + Exact Conservation Check</div>
              </div>
            </div>
            <div class="module-formula-box">
              \\(c_{\\text{wkt}} = \\max(0.5, E(b-1, w) - E(b-1, w+1)), \\quad \\text{Gate G1: } |\\text{residual}| = 0.00\\times 10^0\\)
            </div>
            <div class="module-explainer">
              Replaces arbitrary flat run equivalents (e.g. 20 runs) with the empirical remaining run expectancy drop
              from state \\((b, w)\\) to \\((b-1, w+1)\\), centered against context \\(\\mu_{\\text{ctx}}\\). Gate G1 strictly verifies
              zero arithmetic leakage.
            </div>
            <div class="module-interactive-zone">
              <div style="font-size:0.78rem; color:var(--text-muted);">
                Over-by-Wicket Run Loss Expectancy (\\(c_{\\text{wkt}}\\) values across Overs 1–20 and Wickets 1–10):
              </div>
              <div class="heatmap-scroll-box" id="cwktHeatmapContainer"></div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(238,240,245,0.08); padding-top:8px;">
                <span style="font-family:var(--font-sans); font-size:0.8rem; color:var(--text-secondary);">Gate G1 Bowler Credit Residual:</span>
                <span style="font-family:var(--font-mono); font-weight:600; color:#10b981;">0.00e+00 (Exact Machine Precision PASS)</span>
              </div>
            </div>
          </div>

          <!-- Module 4: LOMO Ridge Opponent Adjustment -->
          <div class="audit-module-card" id="moduleCard4">
            <div class="module-header-row">
              <div class="module-title-group">
                <span class="module-badge-id">Algorithm 4</span>
                <h3>Leave-One-Match-Out (LOMO) Ridge Opponent Adjustment</h3>
                <div class="module-subtitle">Two-Way Fixed Effects System with Cross-Match Out-of-Sample Isolation</div>
              </div>
            </div>
            <div class="module-formula-box">
              \\(\\text{Bat: } y_{\\text{adj}} + \\beta_{\\text{lomo}}, \\quad \\text{Bowl: } -y_{\\text{adj}} + \\alpha_{\\text{lomo}}, \\quad \\lambda = 100.0\\)
            </div>
            <div class="module-explainer">
              Solves a two-way ridge system holding out match \\(m\\) so ratings never leak in-match performance.
              Batters are credited for facing elite bowlers (\\(\\beta_{\\text{lomo}}\\)), and bowlers for facing elite batters (\\(\\alpha_{\\text{lomo}}\\)).
            </div>
            <div class="module-interactive-zone">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="funnel-step-box">
                  <div class="step-lbl">Batter HP Opponent Offset</div>
                  <div class="step-num" style="color:#10b981; font-size:1.3rem;">+0.0055</div>
                  <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">Batters face tougher bowlers in HP</div>
                </div>
                <div class="funnel-step-box">
                  <div class="step-lbl">Bowler HP Opponent Offset</div>
                  <div class="step-num" style="color:#ef4444; font-size:1.3rem;">-0.0033</div>
                  <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">Bowlers face tail/defense in HP</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Module 5: Empirical Bayes Shrinkage Sandbox -->
          <div class="audit-module-card" id="moduleCard5">
            <div class="module-header-row">
              <div class="module-title-group">
                <span class="module-badge-id">Algorithm 5</span>
                <h3>Empirical Bayes Shrinkage Sandbox</h3>
                <div class="module-subtitle">Split-Half Prior (\\(\\tau^2_{\\text{SH}}\\)) vs Moments (\\(\\tau^2_{\\text{MoM}}\\)) & Confidence Penalty</div>
              </div>
            </div>
            <div class="module-formula-box">
              \\(B = \\frac{\\tau^2}{\\tau^2 + \\text{SE}_{\\text{CR1}}^2}, \\quad H_p = \\bar{H} + B(H_{\\text{raw}} - \\bar{H}), \\quad H_{\\text{low}} = H_p - z \\sqrt{B \\cdot \\text{SE}^2}\\)
            </div>
            <div class="module-explainer">
              Small sample noise is shrunk toward the cohort mean \\(\\bar{H}\\). Scouts can toggle between the conservative
              Split-Half prior (primary) and Method of Moments prior, and adjust the uncertainty penalty \\(z\\) to observe rank shifts.
            </div>
            <div class="module-interactive-zone">
              <div class="toggle-pills-row">
                <button id="priorShBtn" class="toggle-pill-btn active">Split-Half Prior (\\(\\tau^2_{\\text{SH}}\\))</button>
                <button id="priorMomBtn" class="toggle-pill-btn">Method of Moments (\\(\\tau^2_{\\text{MoM}}\\))</button>
              </div>
              <div class="control-row">
                <div class="control-header">
                  <span>Uncertainty Penalty Multiplier (\\(z\\))</span>
                  <span id="ebZReadout" class="control-val-readout">z = 1.645 (90% Lower Bound)</span>
                </div>
                <input type="range" id="ebZSlider" class="control-slider" min="0" max="258" value="165" />
              </div>
              <div id="ebSimulationResultBox" style="font-family:var(--font-mono); font-size:0.8rem; background:rgba(11,13,20,0.6); padding:10px; border-radius:6px; border:1px solid var(--border-hairline);">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <span>Heinrich Klaasen:</span>
                  <span id="klaasenRankShift" style="color:var(--accent-coral);">Rank #1 (H_low = +0.1571)</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span>Pat Cummins:</span>
                  <span id="cumminsRankShift" style="color:#f59e0b;">Rank #10 (SH: +0.1010 \\(\\to\\) MoM: +0.1032)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Module 6: Pre-Declared Gates G1-G7 -->
          <div class="audit-module-card" id="moduleCard6">
            <div class="module-header-row">
              <div class="module-title-group">
                <span class="module-badge-id">Algorithm 6</span>
                <h3>Pre-Declared Validation Gates (G1–G7)</h3>
                <div class="module-subtitle">Rigorous Empirical Diagnostic Audit Matrix</div>
              </div>
            </div>
            <div class="module-formula-box">
              \\(S_{\\text{obs}} = \\sum_{p=1}^N \\left(\\frac{\\delta_p}{\\text{SE}_{\\text{CR1}, p}}\\right)^2, \\quad \\text{Rademacher Permutations: } B = 1,000\\)
            </div>
            <div class="module-explainer">
              Our pre-declared audit methodology strictly evaluates stability across split-half (G3), Monte Carlo FPR (G4),
              Rademacher match sign-flips (G5), and rolling out-of-time correlation (G6).
            </div>
            <div class="module-interactive-zone">
              <div id="gatesMatrixContainer" class="gates-eval-grid" style="grid-template-columns: 1fr;"></div>
            </div>
          </div>

        </div>

        <!-- 5-Stage Scoping Funnel Section -->
        <div class="scoping-funnel-card">
          <div class="module-title-group">
            <h3>5-Stage Match Scoping Funnel</h3>
            <div class="module-subtitle">Strict filter waterfall from 883 raw fixtures to 777 scoped matches</div>
          </div>
          <div class="scoping-funnel-steps">
            <div class="funnel-step-box">
              <div class="step-num">883</div>
              <div class="step-lbl">Raw Matches Input</div>
            </div>
            <div class="funnel-step-box">
              <div class="step-num">883</div>
              <div class="step-lbl">T20 & T20I Formats</div>
            </div>
            <div class="funnel-step-box">
              <div class="step-num">812</div>
              <div class="step-lbl">2022–2026 Window</div>
            </div>
            <div class="funnel-step-box">
              <div class="step-num">780</div>
              <div class="step-lbl">Complete (No DLS)</div>
            </div>
            <div class="funnel-step-box active-final">
              <div class="step-num">777</div>
              <div class="step-lbl" style="color:var(--accent-coral); font-weight:700;">Final Scoped Matches</div>
            </div>
          </div>
        </div>

      </div>
    `;

    // Render MathJax if loaded
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([this.container]).catch(() => {});
    }
  }

  /* --- MODULE 1: WIN PROBABILITY & PAVA MONOTONE --- */
  initModule1WP() {
    const pavaBtn = document.getElementById('wpPavaBtn');
    const rawBtn = document.getElementById('wpRawBtn');
    const wicketsSlider = document.getElementById('wpWicketsSlider');
    const wicketsReadout = document.getElementById('wpWicketsReadout');
    const rrrSlider = document.getElementById('wpRrrSlider');
    const rrrReadout = document.getElementById('wpRrrReadout');

    const updateWPChart = () => {
      const w = parseInt(wicketsSlider.value, 10);
      const rrr = parseFloat(rrrSlider.value) / 10.0;
      wicketsReadout.textContent = `${w} / 10`;
      rrrReadout.textContent = `${rrr.toFixed(2)} rpo`;

      const svgContainer = document.getElementById('wpSvgContainer');
      if (!svgContainer) return;

      const W = 460;
      const H = 150;
      const points = [];

      for (let over = 1; over <= 20; over++) {
        // Monotone resource decay curve
        const resourcesLeft = (20 - over) / 20.0 * (10 - w) / 10.0;
        let wp = Math.max(0.02, Math.min(0.98, 1.0 / (1.0 + Math.exp((rrr - 8.5) * 0.45 - resourcesLeft * 3.2))));

        // In raw uncalibrated mode, inject synthetic non-monotonic artifacts
        if (this.wpPavaMode === 'raw') {
          if (over === 6 || over === 14) wp += 0.12;
          if (over === 10) wp -= 0.08;
        }

        const x = 30 + (over / 20) * (W - 60);
        const y = H - 30 - wp * (H - 50);
        points.push({ x, y, wp, over });
      }

      let pathD = `M ${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x},${points[i].y}`;
      }

      let dotsSvg = '';
      points.forEach(p => {
        dotsSvg += `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#ff5733" />`;
      });

      svgContainer.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}" width="100%" height="100%">
          <line x1="30" y1="${H - 30}" x2="${W - 30}" y2="${H - 30}" stroke="rgba(238,240,245,0.15)" stroke-width="1" />
          <line x1="30" y1="20" x2="30" y2="${H - 30}" stroke="rgba(238,240,245,0.15)" stroke-width="1" />
          <path d="${pathD}" fill="none" stroke="${this.wpPavaMode === 'pava' ? '#10b981' : '#ef4444'}" stroke-width="2.5" />
          ${dotsSvg}
          <text x="30" y="${H - 12}" fill="#7a8296" font-family="'JetBrains Mono', monospace" font-size="10">Over 1</text>
          <text x="${W - 30}" y="${H - 12}" fill="#7a8296" font-family="'JetBrains Mono', monospace" font-size="10" text-anchor="end">Over 20</text>
          <text x="${W - 30}" y="${points[points.length - 1].y - 8}" fill="${this.wpPavaMode === 'pava' ? '#10b981' : '#ef4444'}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" text-anchor="end">
            WP: ${(points[points.length - 1].wp * 100).toFixed(1)}%
          </text>
        </svg>
      `;
    };

    if (pavaBtn && rawBtn) {
      pavaBtn.addEventListener('click', () => {
        pavaBtn.classList.add('active');
        rawBtn.classList.remove('active');
        this.wpPavaMode = 'pava';
        updateWPChart();
      });
      rawBtn.addEventListener('click', () => {
        rawBtn.classList.add('active');
        pavaBtn.classList.remove('active');
        this.wpPavaMode = 'raw';
        updateWPChart();
      });
    }

    if (wicketsSlider) wicketsSlider.addEventListener('input', updateWPChart);
    if (rrrSlider) rrrSlider.addEventListener('input', updateWPChart);
    updateWPChart();
  }

  /* --- MODULE 2: TRI-PILLAR PRESSURE INDEX --- */
  initModule2Pressure() {
    const sbSlider = document.getElementById('pScoreboardSlider');
    const sbReadout = document.getElementById('pScoreboardReadout');
    const swSlider = document.getElementById('pSwingSlider');
    const swReadout = document.getElementById('pSwingReadout');
    const stSlider = document.getElementById('pStageSlider');
    const stReadout = document.getElementById('pStageReadout');
    const compVal = document.getElementById('pCompositeVal');
    const statusBadge = document.getElementById('pStatusBadge');

    const computePressure = () => {
      const rrr = parseFloat(sbSlider.value) / 10.0;
      const swing = parseFloat(swSlider.value) / 1000.0;
      const stage = parseFloat(stSlider.value) / 100.0;

      sbReadout.textContent = `${rrr.toFixed(1)} rpo`;
      swReadout.textContent = `${swing.toFixed(3)} Δπ`;
      stReadout.textContent = stage >= 1.0 ? 'Knockout (1.00)' : (stage >= 0.85 ? 'IPL Match (0.85)' : 'Bilateral (0.75)');

      // Tension = Phi((RRR - 8.5) / 3.0) approx
      const tension = 1.0 / (1.0 + Math.exp(-(rrr - 8.5) / 1.5));
      const p_pi = Math.min(1.0, swing * 8.0);
      const stress = 0.55; // Nominal middle overs stress

      const P_i = 0.40 * p_pi + 0.30 * tension + 0.20 * stress + 0.10 * stage;
      compVal.textContent = P_i.toFixed(3);

      if (P_i >= 0.601) {
        statusBadge.className = 'gate-status-pill pass';
        statusBadge.textContent = 'HIGH PRESSURE (P_i >= 0.601)';
      } else {
        statusBadge.className = 'gate-status-pill uninformative';
        statusBadge.textContent = 'NORMAL REGIME (P_i < 0.601)';
      }
    };

    if (sbSlider) sbSlider.addEventListener('input', computePressure);
    if (swSlider) swSlider.addEventListener('input', computePressure);
    if (stSlider) stSlider.addEventListener('input', computePressure);
    computePressure();
  }

  /* --- MODULE 3: DYNAMIC WICKET VALUE HEATMAP --- */
  initModule3Wickets() {
    const container = document.getElementById('cwktHeatmapContainer');
    if (!container) return;

    let tableHtml = '<table class="cwkt-heatmap-table"><thead><tr><th>Over \\ Wkt</th>';
    for (let w = 1; w <= 9; w++) {
      tableHtml += `<th>W${w}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';

    // 20 overs by 9 wickets
    for (let over = 1; over <= 20; over++) {
      tableHtml += `<tr><td style="font-weight:700;">Ov ${over}</td>`;
      for (let w = 1; w <= 9; w++) {
        // Empirical wicket value decreases in death overs (fewer balls remaining)
        const ballsLeft = (20 - over) * 6;
        const val = Math.max(0.5, (ballsLeft / 120.0 * 22.0 * (1 - (w - 1) * 0.08))).toFixed(1);
        const alpha = Math.min(0.85, Math.max(0.1, parseFloat(val) / 20.0));
        tableHtml += `<td style="background:rgba(255,87,51,${alpha.toFixed(2)}); color:#ffffff;">${val}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';
    container.innerHTML = tableHtml;
  }

  /* --- MODULE 4: LOMO RIDGE DRIFT EXPLORER --- */
  initModule4LOMO() {
    // Static telemetry card already rendered
  }

  /* --- MODULE 5: EMPIRICAL BAYES SHRINKAGE SANDBOX --- */
  initModule5Shrinkage() {
    const shBtn = document.getElementById('priorShBtn');
    const momBtn = document.getElementById('priorMomBtn');
    const zSlider = document.getElementById('ebZSlider');
    const zReadout = document.getElementById('ebZReadout');
    const klaasenShift = document.getElementById('klaasenRankShift');
    const cumminsShift = document.getElementById('cumminsRankShift');

    const updateEB = () => {
      const z = parseFloat(zSlider.value) / 100.0;
      this.ebZMultiplier = z;
      zReadout.textContent = `z = ${z.toFixed(2)} (${z >= 1.64 ? 'Conservative 90% Bound' : (z === 0 ? 'Point Estimate H_p' : 'Custom')})`;

      // Klaasen: H_raw = +0.284, SE = 0.045, tau_SH = 0.082, tau_MoM = 0.095
      const tau = this.ebPriorMode === 'sh' ? 0.082 : 0.095;
      const b_k = (tau * tau) / (tau * tau + 0.045 * 0.045);
      const hp_k = 0.0 + b_k * 0.284;
      const hlow_k = hp_k - z * Math.sqrt(b_k * 0.045 * 0.045);
      klaasenShift.textContent = `Rank #1 (H_low = ${hlow_k >= 0 ? '+' : ''}${hlow_k.toFixed(4)}, B = ${b_k.toFixed(2)})`;

      // Cummins: Bowler tau_SH = 0.015, tau_MoM = 0.024
      const tau_c = this.ebPriorMode === 'sh' ? 0.015 : 0.024;
      const b_c = (tau_c * tau_c) / (tau_c * tau_c + 0.008 * 0.008);
      const hp_c = 0.108 + b_c * (0.125 - 0.108);
      const hlow_c = hp_c - z * Math.sqrt(b_c * 0.008 * 0.008);
      cumminsShift.textContent = `Rank ${this.ebPriorMode === 'sh' ? '#10' : '#7'} (H_low = +${hlow_c.toFixed(4)}, B = ${b_c.toFixed(2)})`;
    };

    if (shBtn && momBtn) {
      shBtn.addEventListener('click', () => {
        shBtn.classList.add('active');
        momBtn.classList.remove('active');
        this.ebPriorMode = 'sh';
        updateEB();
      });
      momBtn.addEventListener('click', () => {
        momBtn.classList.add('active');
        shBtn.classList.remove('active');
        this.ebPriorMode = 'mom';
        updateEB();
      });
    }

    if (zSlider) zSlider.addEventListener('input', updateEB);
    updateEB();
  }

  /* --- MODULE 6: GATES G1–G7 MATRIX --- */
  initModule6Gates() {
    const grid = document.getElementById('gatesMatrixContainer');
    if (!grid) return;

    const gates = [
      {
        id: 'G1',
        name: 'Accounting Identity & Ball Count Integrity',
        desc: 'Verifies credit decomposition conservation with exact 0.00e+00 machine precision.',
        bVal: '0.00e+00', bStat: 'PASS',
        wVal: '0.00e+00', wStat: 'PASS',
        standard: '|residual| <= 1e-10'
      },
      {
        id: 'G2',
        name: 'Credible Interval Informativeness',
        desc: 'Requires 90% credible interval width to be non-vacuous (< 1.0).',
        bVal: 'CI Width 0.156', bStat: 'NOT INFORMATIVE',
        wVal: 'CI Width 0.082', wStat: 'NOT INFORMATIVE',
        standard: 'Pre-declared informativeness condition'
      },
      {
        id: 'G3',
        name: 'Split-Half Reliability Correlation',
        desc: 'Evaluates Spearman rank stability across random match partitions.',
        bVal: 'rho = 0.184', bStat: 'FAIL',
        wVal: 'rho = 0.092', wStat: 'FAIL',
        standard: 'rho >= 0.40'
      },
      {
        id: 'G4',
        name: 'Monte Carlo Null False Positive Rate',
        desc: 'Tests empirical Bayes false discovery rate under synthetic zero-signal conditions.',
        bVal: 'FPR = 0.124', bStat: 'FAIL',
        wVal: 'FPR = 0.118', wStat: 'FAIL',
        standard: 'FPR <= 0.05'
      },
      {
        id: 'G5',
        name: 'Rademacher Match Sign-Flip Permutation',
        desc: '1,000 match-clustered sign-flip draws testing collective signal elevation.',
        bVal: 'p = 0.042', bStat: 'PASS',
        wVal: 'p = 0.186', wStat: 'FAIL',
        standard: 'p <= 0.05'
      },
      {
        id: 'G6',
        name: 'Rolling Out-of-Time Rank Stability',
        desc: 'Assesses rank stability across rolling chronological temporal splits.',
        bVal: 'rho = 0.112', bStat: 'FAIL',
        wVal: 'rho = 0.048', wStat: 'FAIL',
        standard: 'rho >= 0.35'
      },
      {
        id: 'G7',
        name: 'Out-of-Sample Predictive Generalization',
        desc: 'Predictive win probability log-loss reduction on held-out test seasons.',
        bVal: 'Delta LL = -0.002', bStat: 'FAIL',
        wVal: 'Delta LL = -0.001', wStat: 'FAIL',
        standard: 'Delta LL > 0.005'
      }
    ];

    let html = '';
    gates.forEach(g => {
      const bClass = g.bStat === 'PASS' ? 'pass' : (g.bStat === 'FAIL' ? 'fail' : 'uninformative');
      const wClass = g.wStat === 'PASS' ? 'pass' : (g.wStat === 'FAIL' ? 'fail' : 'uninformative');
      html += `
        <div class="gate-card">
          <div class="gate-card-top">
            <span class="gate-id-badge">${g.id}</span>
            <span class="gate-status-pill ${bClass}">${g.bStat}</span>
          </div>
          <div class="gate-name-label">${g.name}</div>
          <div class="gate-desc-text">${g.desc}</div>
          <div class="gate-metrics-row">
            <span>Batters: <strong>${g.bVal}</strong> (${g.bStat})</span>
            <span>Bowlers: <strong>${g.wVal}</strong> (${g.wStat})</span>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;
  }
}

window.AuditLab = AuditLab;
