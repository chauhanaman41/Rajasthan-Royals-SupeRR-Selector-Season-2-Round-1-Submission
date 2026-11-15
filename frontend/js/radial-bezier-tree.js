/**
 * frontend/js/radial-bezier-tree.js
 * Radial Cubic Bézier Confrontation Tree & Right Glass Inspector Drawer (matching design.mp4)
 */

class RadialBezierTree {
  constructor(containerId, drawerId) {
    this.container = document.getElementById(containerId);
    this.drawer = document.getElementById(drawerId);
    this.activePlayerId = null;
  }

  init() {
    const closeBtn = document.getElementById('drawerCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    const switchStudioBtn = document.getElementById('drawerSwitchStudioBtn');
    if (switchStudioBtn) {
      switchStudioBtn.addEventListener('click', () => {
        if (this.activePlayerId && window.app) {
          window.app.switchView('studio');
          window.app.selectPlayer(this.activePlayerId);
        }
      });
    }
  }

  async render(playerId) {
    this.activePlayerId = playerId;
    const shard = await window.dataLoader.loadPlayerShard(playerId);
    if (!shard) return;

    const p = shard.summary;
    const h2h = shard.head_to_head || [];

    // Open Drawer & Populate Header
    if (this.drawer) {
      this.drawer.classList.add('open');
      const avatar = document.getElementById('drawerPlayerAvatar');
      const name = document.getElementById('drawerPlayerName');
      const team = document.getElementById('drawerPlayerTeam');
      const hlow = document.getElementById('drawerHlow');
      const vol = document.getElementById('drawerVolume');
      const oppTable = document.getElementById('drawerOpponentsList');

      if (avatar) avatar.src = `./public/assets/players/avatars/${p.player_id}.webp`;
      if (name) name.textContent = p.player_name;
      if (team) team.textContent = p.primary_team_name;

      const eb = p.role === 'Bowler' ? p.bowling_eb : p.batting_eb;
      const hl = eb?.h_low ?? 0.100;
      if (hlow) hlow.textContent = `${hl > 0 ? '+' : ''}${hl.toFixed(4)}`;
      if (vol) vol.textContent = `${(p.balls_faced + p.balls_bowled).toLocaleString()} Balls`;

      if (oppTable) {
        let rows = '';
        h2h.slice(0, 8).forEach(o => {
          rows += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.82rem;">
              <span style="font-weight:600; color:#fff;">${o.opp_name}</span>
              <span style="font-family:var(--font-mono); color:var(--cyan-accent);">${o.balls}B • ${o.runs}R • ${o.wickets}W</span>
            </div>
          `;
        });
        oppTable.innerHTML = rows || '<div style="color:rgba(255,255,255,0.4); padding:10px 0;">No head-to-head records.</div>';
      }
    }

    // Render Radial SVG Cubic Bézier Lines
    if (this.container) {
      this.container.classList.add('active');
      const W = this.container.clientWidth || 1000;
      const H = this.container.clientHeight || 700;

      const originX = W * 0.28;
      const originY = H * 0.5;

      let svg = `<svg viewBox="0 0 ${W} ${H}" class="radial-svg-stage" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#a855f7" flood-opacity="0.75" />
          </filter>
          <linearGradient id="bezierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#00e5ff" />
          </linearGradient>
        </defs>

        <!-- Circular Waveform Rings around Player Center -->
        <circle cx="${originX}" cy="${originY}" r="45" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" stroke-width="2.5" filter="url(#purpleGlow)" />
        <circle cx="${originX}" cy="${originY}" r="65" fill="none" stroke="rgba(168, 85, 247, 0.4)" stroke-width="1.5" stroke-dasharray="4,4" />
        <circle cx="${originX}" cy="${originY}" r="85" fill="none" stroke="rgba(0, 229, 255, 0.25)" stroke-width="1" />

        <!-- Center Player Label -->
        <text x="${originX}" y="${originY + 5}" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">${p.player_name.split(' ')[0]}</text>
      `;

      // Draw fanning-out cubic Bézier branches to opponents
      const count = Math.min(6, h2h.length);
      const targetX = W * 0.60;
      const startY = H * 0.22;
      const stepY = (H * 0.56) / Math.max(1, count - 1);

      for (let i = 0; i < count; i++) {
        const destY = startY + i * stepY;
        const opp = h2h[i];

        // Cubic Bézier control points
        const cp1x = originX + (targetX - originX) * 0.5;
        const cp1y = originY;
        const cp2x = originX + (targetX - originX) * 0.5;
        const cp2y = destY;

        svg += `
          <!-- Cubic Bézier Curve -->
          <path d="M ${originX},${originY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${targetX},${destY}"
                fill="none" stroke="url(#bezierGrad)" stroke-width="2.2" opacity="0.85" />
          <!-- Opponent Node Point -->
          <circle cx="${targetX}" cy="${destY}" r="6" fill="#00e5ff" stroke="#ffffff" stroke-width="2" />
          <!-- Opponent Label Pill -->
          <g transform="translate(${targetX + 14}, ${destY + 4})">
            <text x="0" y="0" fill="#ffffff" font-size="12" font-weight="700">${opp.opp_name}</text>
            <text x="0" y="14" fill="rgba(255,255,255,0.5)" font-size="10" font-family="var(--font-mono)">${opp.balls}B • ${opp.runs}R</text>
          </g>
        `;
      }

      svg += `</svg>`;
      this.container.innerHTML = svg;
    }
  }

  closeDrawer() {
    if (this.drawer) this.drawer.classList.remove('open');
    if (this.container) this.container.classList.remove('active');
  }
}

window.RadialBezierTree = RadialBezierTree;
