/**
 * frontend/js/polar-spline-radar.js
 * Renders an Organic Closed Catmull-Rom Polar Spline Radar
 * with 5 dynamic axes, generous 500x400 viewBox, center at (250, 200),
 * outer radius R = 118, and dynamic text anchoring so labels never clip.
 */

class PolarSplineRadar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = 500;
    this.height = 400;
    this.cx = 250;
    this.cy = 200;
    this.radius = 118;
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

  /**
   * Dynamic text-anchor based on axis angle so left labels grow leftward
   * and right labels grow rightward, preventing SVG boundary clipping.
   */
  getTextAnchor(angleDeg) {
    const norm = ((angleDeg % 360) + 360) % 360;
    if (norm > 15 && norm < 165) return 'start';
    if (norm > 195 && norm < 345) return 'end';
    return 'middle';
  }

  render(player, roleMode = 'bat') {
    if (!this.container) return;

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
        { label: 'H_low Bound', value: hlow_norm, raw: hlow.toFixed(3) },
        { label: 'Dot Ball %', value: dot_norm, raw: `${dot_pct.toFixed(1)}%` },
        { label: 'Wickets', value: wkts_norm, raw: `${wkts}` },
        { label: 'Run Suppression', value: econ_suppr, raw: `${econ.toFixed(2)}` },
        { label: 'Reliability (B)', value: b_norm, raw: b_shrink.toFixed(3) }
      ];
    } else {
      const eb = player.batting_eb || {};
      const hlow = eb.h_low ?? 0.128;
      const hlow_norm = Math.min(1.0, Math.max(0.2, (hlow - 0.05) / 0.25));

      const sr = player.strike_rate || 135.0;
      const sr_norm = Math.min(1.0, Math.max(0.2, (sr - 100) / 100));

      const hp_balls = player.hp_balls_faced || 0;
      const hp_norm = Math.min(1.0, Math.max(0.2, hp_balls / 120.0));

      const runs = player.runs_scored || 0;
      const runs_norm = Math.min(1.0, Math.max(0.2, runs / 800.0));

      const b_shrink = eb.shrinkage_B ?? 0.88;
      const b_norm = Math.min(1.0, Math.max(0.2, b_shrink));

      axes = [
        { label: 'H_low Bound', value: hlow_norm, raw: hlow.toFixed(3) },
        { label: 'Strike Rate', value: sr_norm, raw: sr.toFixed(1) },
        { label: 'HP Exposure', value: hp_norm, raw: `${hp_balls}b` },
        { label: 'Run Volume', value: runs_norm, raw: `${runs}` },
        { label: 'Reliability (B)', value: b_norm, raw: b_shrink.toFixed(2) }
      ];
    }

    const numAxes = axes.length;
    const angleStep = (2 * Math.PI) / numAxes;
    const startAngle = -Math.PI / 2;

    // Web background rings (4 concentric levels)
    const rings = [0.25, 0.5, 0.75, 1.0];
    let ringsSvg = '';
    rings.forEach((level) => {
      const r = this.radius * level;
      ringsSvg += `<circle cx="${this.cx}" cy="${this.cy}" r="${r}" fill="none" stroke="rgba(238, 240, 245, 0.08)" stroke-width="1" stroke-dasharray="${level < 1.0 ? '3,3' : 'none'}" />`;
    });

    // Radial spokes and unclipped labels
    let spokesSvg = '';
    let labelsSvg = '';
    const splinePoints = [];

    axes.forEach((axis, i) => {
      const angle = startAngle + i * angleStep;
      const angleDeg = (angle * 180) / Math.PI;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const xOuter = this.cx + this.radius * cos;
      const yOuter = this.cy + this.radius * sin;

      spokesSvg += `<line x1="${this.cx}" y1="${this.cy}" x2="${xOuter}" y2="${yOuter}" stroke="rgba(238, 240, 245, 0.12)" stroke-width="1" />`;

      // Spline data point
      const pRadius = this.radius * Math.max(0.15, Math.min(1.0, axis.value));
      const px = this.cx + pRadius * cos;
      const py = this.cy + pRadius * sin;
      splinePoints.push({ x: px, y: py, raw: axis.raw });

      // Labels with dynamic anchor and offset
      const labelDist = this.radius + 24;
      const lx = this.cx + labelDist * cos;
      const ly = this.cy + labelDist * sin;
      const anchor = this.getTextAnchor(angleDeg);

      labelsSvg += `
        <g class="radar-axis-label-group">
          <text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="central" fill="#a3a9b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="500">
            ${axis.label}
          </text>
          <text x="${lx}" y="${ly + 14}" text-anchor="${anchor}" dominant-baseline="central" fill="#ff5733" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600">
            ${axis.raw}
          </text>
        </g>
      `;
    });

    const splinePath = this.getCatmullRomPath(splinePoints);

    // Glowing Catmull-Rom spline path and data dots
    let dotsSvg = '';
    splinePoints.forEach((pt) => {
      dotsSvg += `
        <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#ff5733" stroke="#ffffff" stroke-width="2" />
        <circle cx="${pt.x}" cy="${pt.y}" r="9" fill="rgba(255, 87, 51, 0.25)" />
      `;
    });

    const svgHtml = `
      <svg viewBox="0 0 ${this.width} ${this.height}" style="overflow: visible; width: 100%; height: auto; max-height: 440px;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="splineGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff5733" stop-opacity="0.38" />
            <stop offset="70%" stop-color="#9333ea" stop-opacity="0.22" />
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        ${ringsSvg}
        ${spokesSvg}
        <path d="${splinePath}" fill="url(#splineGradient)" stroke="#ff5733" stroke-width="2.5" filter="url(#glow)" />
        ${dotsSvg}
        ${labelsSvg}
      </svg>
    `;

    this.container.innerHTML = svgHtml;
  }
}

window.PolarSplineRadar = PolarSplineRadar;
