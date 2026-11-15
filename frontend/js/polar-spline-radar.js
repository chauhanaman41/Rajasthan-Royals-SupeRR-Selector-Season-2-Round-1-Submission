/**
 * frontend/js/polar-spline-radar.js
 * Renders an Organic Closed Catmull-Rom Polar Spline Radar (matching design.webp)
 * with 5 dynamic axes, smooth mode transitions, and central watermark.
 */

class PolarSplineRadar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.size = 440;
    this.center = this.size / 2;
    this.radius = 160;
  }

  /**
   * Catmull-Rom to Cubic Bézier conversion for smooth closed organic loops
   */
  getCatmullRomPath(points) {
    const n = points.length;
    if (n < 3) return '';

    let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = points[(i - 1 + n) % n];
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      const p3 = points[(i + 2) % n];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    d += ' Z';
    return d;
  }

  render(player, roleMode = 'bat') {
    if (!this.container) return;

    // Determine metrics according to active role mode (Batting or Bowling)
    let axes = [];
    if (roleMode === 'bowl') {
      const eb = player.bowling_eb || {};
      const hlow = eb.h_low ?? 0.101;
      const hlow_norm = Math.min(1.0, Math.max(0.2, (hlow - 0.08) / 0.04));

      const dot_pct = player.dot_pct_bowl || 40.0;
      const dot_norm = Math.min(1.0, Math.max(0.2, dot_pct / 60.0));

      const wkts = player.wickets || 0;
      const wkts_norm = Math.min(1.0, Math.max(0.2, wkts / 50.0));

      const econ = player.economy || 8.0;
      const econ_suppr = Math.min(1.0, Math.max(0.2, (12.0 - econ) / 6.0));

      const b_shrink = eb.shrinkage_B ?? 0.006;
      const b_norm = Math.min(1.0, Math.max(0.2, 0.45));

      axes = [
        { label: 'H_low Output', val: `${hlow > 0 ? '+' : ''}${hlow.toFixed(4)}`, norm: hlow_norm },
        { label: 'Dot %', val: `${dot_pct.toFixed(1)}%`, norm: dot_norm },
        { label: 'Wickets Credit', val: `${wkts}`, norm: wkts_norm },
        { label: 'Run Suppression', val: `${econ.toFixed(1)} Econ`, norm: econ_suppr },
        { label: 'Reliability (B)', val: `${b_shrink.toFixed(3)}`, norm: b_norm }
      ];
    } else {
      // Batting mode
      const eb = player.batting_eb || {};
      const hlow = eb.h_low ?? 0.100;
      const hlow_norm = Math.min(1.0, Math.max(0.2, (hlow - 0.05) / 0.12));

      const sr = player.strike_rate || 135.0;
      const sr_norm = Math.min(1.0, Math.max(0.2, sr / 200.0));

      const bnd = player.boundary_pct || 18.0;
      const bnd_norm = Math.min(1.0, Math.max(0.2, bnd / 30.0));

      const dot_avoid = 100.0 - (player.dot_pct_bat || 35.0);
      const dot_norm = Math.min(1.0, Math.max(0.2, dot_avoid / 85.0));

      const b_shrink = eb.shrinkage_B ?? 0.75;
      const b_norm = Math.min(1.0, Math.max(0.2, b_shrink));

      axes = [
        { label: 'H_low Output', val: `${hlow > 0 ? '+' : ''}${hlow.toFixed(4)}`, norm: hlow_norm },
        { label: 'Strike Rate', val: `${sr.toFixed(1)}`, norm: sr_norm },
        { label: 'Boundary %', val: `${bnd.toFixed(1)}%`, norm: bnd_norm },
        { label: 'Dot Avoidance', val: `${dot_avoid.toFixed(1)}%`, norm: dot_norm },
        { label: 'Reliability (B)', val: `${b_shrink.toFixed(2)}`, norm: b_norm }
      ];
    }

    // Compute coordinate points for 5 axes
    const splinePoints = [];
    const axisGuides = [];
    const labelPoints = [];

    const angleStep = (2 * Math.PI) / 5;
    const startAngle = -Math.PI / 2; // Top 0 degrees

    for (let i = 0; i < 5; i++) {
      const angle = startAngle + i * angleStep;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Spline point based on normalized metric
      const r_spline = this.radius * axes[i].norm;
      splinePoints.push({
        x: this.center + r_spline * cos,
        y: this.center + r_spline * sin
      });

      // Axis guide end point
      axisGuides.push({
        x1: this.center,
        y1: this.center,
        x2: this.center + this.radius * cos,
        y2: this.center + this.radius * sin
      });

      // Outer label point
      const r_label = this.radius + 32;
      labelPoints.push({
        x: this.center + r_label * cos,
        y: this.center + r_label * sin,
        label: axes[i].label,
        val: axes[i].val,
        align: Math.abs(cos) < 0.2 ? 'middle' : (cos > 0 ? 'start' : 'end')
      });
    }

    const pathD = this.getCatmullRomPath(splinePoints);

    // Build SVG markup
    let svg = `<svg viewBox="0 0 ${this.size} ${this.size}" class="radar-svg-stage" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Spline Coral / Violet Gradient -->
        <linearGradient id="splineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff7e5f" />
          <stop offset="50%" stop-color="#ff5733" />
          <stop offset="100%" stop-color="#ea1a85" />
        </linearGradient>
        <radialGradient id="splineFillGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff5733" stop-opacity="0.35" />
          <stop offset="70%" stop-color="#ea1a85" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#254aa5" stop-opacity="0.05" />
        </radialGradient>
        <filter id="splineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ff5733" flood-opacity="0.6" />
        </filter>
      </defs>`;

    // 1. Concentric Web Rings (20%, 40%, 60%, 80%, 100%)
    for (const pct of [0.25, 0.50, 0.75, 1.0]) {
      const r = this.radius * pct;
      svg += `<circle cx="${this.center}" cy="${this.center}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.2" stroke-dasharray="${pct === 1.0 ? 'none' : '4,3'}" />`;
    }

    // 2. Radial Axis Guide Lines
    for (const g of axisGuides) {
      svg += `<line x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />`;
    }

    // 3. Catmull-Rom Closed Spline Path
    svg += `<path d="${pathD}" fill="url(#splineFillGrad)" stroke="url(#splineGrad)" stroke-width="3.5" filter="url(#splineGlow)" style="transition: all 0.4s ease-out;" />`;

    // 4. Spline Vertex Dots
    for (const pt of splinePoints) {
      svg += `<circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#ffffff" stroke="#ff5733" stroke-width="2.5" />`;
    }

    // 5. Outer Axis Labels & Values
    for (const lp of labelPoints) {
      svg += `<g transform="translate(${lp.x}, ${lp.y})">
        <text x="0" y="-4" fill="#ffffff" font-size="12" font-weight="800" font-family="var(--font-mono)" text-anchor="${lp.align}">${lp.val}</text>
        <text x="0" y="10" fill="rgba(255,255,255,0.55)" font-size="9" font-weight="700" text-transform="uppercase" letter-spacing="0.5" text-anchor="${lp.align}">${lp.label}</text>
      </g>`;
    }

    svg += `</svg>`;

    this.container.innerHTML = svg;

    // Update Watermark in center
    const watermarkEl = document.getElementById('radarWatermark');
    if (watermarkEl) {
      const activeRank = roleMode === 'bowl'
        ? (player.bowling_eb?.rank ? `#${player.bowling_eb.rank}` : `#${player.player_id}`)
        : (player.batting_eb?.rank ? `#${player.batting_eb.rank}` : `#${player.player_id}`);
      watermarkEl.textContent = activeRank;
    }
  }
}

window.PolarSplineRadar = PolarSplineRadar;
