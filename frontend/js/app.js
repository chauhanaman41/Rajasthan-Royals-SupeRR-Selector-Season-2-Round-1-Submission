/**
 * frontend/js/app.js
 * Main Controller & View Router for SupeRR Selector Dashboard
 */

class App {
  constructor() {
    this.activeView = 'studio';
    this.activePlayer = null;
    this.allPlayers = [];
    this.filteredDirectoryPlayers = [];
    this.activeCohort = 'all';

    // Sub-controllers
    this.studioView = new StudioView();
    this.constellationView = new ConstellationView('constellationCanvas');
    this.radialTree = new RadialBezierTree('radialDrilldownLayer', 'glassInspectorDrawer');
  }

  async init() {
    console.log('Initializing SupeRR Selector Dashboard...');
    this.studioView.init();
    this.radialTree.init();

    // 1. Load Master Dataset
    const masterData = await window.dataLoader.loadMasterIndex();
    if (!masterData) {
      console.error('Failed to load initial master dataset.');
      return;
    }
    this.allPlayers = masterData.players;
    this.filteredDirectoryPlayers = [...this.allPlayers];

    // 2. Setup Global Navigation & View Switcher
    this.setupNavigation();
    this.setupOmniSearch();
    this.setupDirectoryFilters();
    this.setupModals();

    // 3. Handle Initial Route from URL Hash or Default to Klaasen (4260)
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const initialPlayerId = hashParams.get('player') || '4260';
    const initialRole = hashParams.get('role') || 'bat';
    const initialView = hashParams.get('view') || 'studio';

    this.selectPlayer(initialPlayerId, initialRole);
    this.switchView(initialView);

    // Initialize Constellation view in background
    this.constellationView.init();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Brand logo click returns to studio view
    const brandBtn = document.getElementById('brandLogoLink');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => this.switchView('studio'));
    }

    // Top-Right Nav Avatar Click opens active player studio
    const navAvatar = document.getElementById('navAvatarPill');
    if (navAvatar) {
      navAvatar.addEventListener('click', () => this.switchView('studio'));
    }
  }

  switchView(viewName) {
    this.activeView = viewName;

    // Update nav active pill
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Hide all view containers
    document.querySelectorAll('.app-view-container').forEach(c => {
      c.style.display = 'none';
    });

    // Show target view container
    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.style.display = 'block';
    }

    // Trigger view-specific activations
    if (viewName === 'constellation') {
      this.constellationView.resizeCanvas();
    } else if (viewName === 'directory') {
      this.renderDirectoryGrid();
    } else if (viewName === 'audit') {
      this.renderAuditLab();
    }

    this.updateUrlHash();
  }

  selectPlayer(playerId, roleMode = null) {
    const player = this.allPlayers.find(p => String(p.player_id) === String(playerId)) || this.allPlayers[0];
    if (!player) return;

    this.activePlayer = player;

    // Update Top-Right Avatar in Navbar
    const navAvatarImg = document.getElementById('navAvatarImg');
    if (navAvatarImg) {
      navAvatarImg.src = `./public/assets/players/avatars/${player.player_id}.webp`;
      navAvatarImg.title = `${player.player_name} (${player.primary_team_name})`;
    }

    // Render in Studio View
    this.studioView.render(player);
    if (roleMode) {
      this.studioView.setRoleMode(roleMode);
    }

    this.updateUrlHash();
  }

  updateUrlHash() {
    if (this.activePlayer) {
      const pid = this.activePlayer.player_id;
      const role = this.studioView.activeRoleMode;
      window.location.hash = `view=${this.activeView}&player=${pid}&role=${role}`;
    }
  }

  setupOmniSearch() {
    const input = document.getElementById('omniSearchInput');
    const dropdown = document.getElementById('searchResultsDropdown');
    if (!input || !dropdown) return;

    let selectedIdx = -1;

    // Keyboard shortcut to focus search: '/' or 'Ctrl+K'
    window.addEventListener('keydown', (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== input) {
        e.preventDefault();
        input.focus();
        input.select();
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        input.blur();
      }
    });

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        return;
      }

      // Fuzzy matching across name, player_id, team, role, batting/bowling style
      const matches = this.allPlayers.filter(p => {
        return (
          p.player_name.toLowerCase().includes(query) ||
          String(p.player_id).includes(query) ||
          p.primary_team_name.toLowerCase().includes(query) ||
          p.role.toLowerCase().includes(query) ||
          p.batting_type.toLowerCase().includes(query) ||
          p.bowling_type.toLowerCase().includes(query)
        );
      }).slice(0, 10);

      if (!matches.length) {
        dropdown.innerHTML = '<div style="padding:14px; color:rgba(255,255,255,0.4); text-align:center;">No matching players found</div>';
        dropdown.classList.add('open');
        return;
      }

      let html = '';
      matches.forEach((p, idx) => {
        const isTop = p.batting_eb?.is_top10 || p.bowling_eb?.is_top10;
        const rank = p.batting_eb?.rank || p.bowling_eb?.rank;
        const rankTag = isTop ? `<span style="color:#ffd700; font-weight:800; margin-left:6px;">👑 #${rank}</span>` : '';
        html += `
          <div class="search-result-item" data-idx="${idx}" data-pid="${p.player_id}">
            <img class="search-result-avatar" src="./public/assets/players/avatars/${p.player_id}.webp" onerror="this.src='./public/assets/teams/0.svg'" />
            <div class="search-result-info">
              <div class="search-result-name">${p.player_name} ${rankTag}</div>
              <div class="search-result-meta">${p.primary_team_name} • ${p.role} • #${p.player_id}</div>
            </div>
          </div>
        `;
      });

      dropdown.innerHTML = html;
      dropdown.classList.add('open');
      selectedIdx = -1;
    });

    // Arrow navigation & enter in dropdown
    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.search-result-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % items.length;
        this.highlightSearchItem(items, selectedIdx);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = (selectedIdx - 1 + items.length) % items.length;
        this.highlightSearchItem(items, selectedIdx);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIdx >= 0 && items[selectedIdx]) {
          const pid = items[selectedIdx].dataset.pid;
          this.selectPlayer(pid);
          this.switchView('studio');
          dropdown.classList.remove('open');
          input.value = '';
        }
      }
    });

    // Click on result item
    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item) {
        const pid = item.dataset.pid;
        this.selectPlayer(pid);
        this.switchView('studio');
        dropdown.classList.remove('open');
        input.value = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  highlightSearchItem(items, idx) {
    items.forEach((item, i) => {
      item.style.background = i === idx ? 'rgba(255, 87, 51, 0.25)' : 'transparent';
    });
    if (items[idx]) {
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  }

  /* --- VIEW 2: DIRECTORY METHODS --- */
  setupDirectoryFilters() {
    document.querySelectorAll('.cohort-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cohort-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCohort = btn.dataset.cohort;
        this.filterDirectory();
      });
    });

    const dirSearch = document.getElementById('dirSearchInput');
    if (dirSearch) {
      dirSearch.addEventListener('input', () => this.filterDirectory());
    }
  }

  filterDirectory() {
    const dirSearch = document.getElementById('dirSearchInput');
    const query = dirSearch ? dirSearch.value.trim().toLowerCase() : '';

    this.filteredDirectoryPlayers = this.allPlayers.filter(p => {
      // 1. Cohort filter
      let matchCohort = true;
      if (this.activeCohort === 'batters') {
        matchCohort = p.is_batter;
      } else if (this.activeCohort === 'bowlers') {
        matchCohort = p.is_bowler;
      } else if (this.activeCohort === 'all_rounders') {
        matchCohort = p.is_all_rounder;
      } else if (this.activeCohort === 'top10') {
        matchCohort = (p.batting_eb?.is_top10 || p.bowling_eb?.is_top10);
      } else if (this.activeCohort === 'eligible') {
        matchCohort = (p.batting_eb?.is_eligible || p.bowling_eb?.is_eligible);
      } else if (this.activeCohort === 'sub_threshold') {
        matchCohort = (!p.batting_eb?.is_eligible && !p.bowling_eb?.is_eligible);
      }

      // 2. Query filter
      let matchQuery = true;
      if (query) {
        matchQuery = (
          p.player_name.toLowerCase().includes(query) ||
          String(p.player_id).includes(query) ||
          p.primary_team_name.toLowerCase().includes(query)
        );
      }

      return matchCohort && matchQuery;
    });

    this.renderDirectoryGrid();
  }

  renderDirectoryGrid() {
    const container = document.getElementById('directoryPlayersGrid');
    const countEl = document.getElementById('dirCountBadge');
    if (!container) return;

    if (countEl) {
      countEl.textContent = `Showing ${this.filteredDirectoryPlayers.length} of ${this.allPlayers.length} Players`;
    }

    if (!this.filteredDirectoryPlayers.length) {
      container.innerHTML = '<div style="padding:40px; color:rgba(255,255,255,0.4); text-align:center; grid-column:1/-1;">No players match the selected filters.</div>';
      return;
    }

    let html = '';
    this.filteredDirectoryPlayers.slice(0, 80).forEach(p => {
      const isTop = p.batting_eb?.is_top10 || p.bowling_eb?.is_top10;
      const rank = p.batting_eb?.rank || p.bowling_eb?.rank;
      const rankBadge = isTop ? `<span style="color:#ffd700; font-weight:800;">👑 Top 10 #${rank}</span>` : `<span style="color:var(--text-muted);">${p.role}</span>`;

      const eb = p.role === 'Bowler' ? p.bowling_eb : p.batting_eb;
      const hlow = eb?.h_low ?? 0.05;
      const hpBalls = eb?.hp_balls || Math.round((p.balls_faced + p.balls_bowled) * 0.2);

      html += `
        <div class="directory-player-card" data-pid="${p.player_id}">
          <div class="dir-card-top">
            <img class="dir-card-avatar" src="./public/assets/players/avatars/${p.player_id}.webp" onerror="this.src='./public/assets/teams/0.svg'" />
            <div class="dir-card-info">
              <h3>${p.player_name}</h3>
              <p>${p.primary_team_name} • ${rankBadge}</p>
            </div>
          </div>
          <div class="dir-card-stats">
            <div class="dir-stat-box">
              <div class="lbl">H_low Bound</div>
              <div class="val" style="color:var(--coral-primary);">${hlow > 0 ? '+' : ''}${hlow.toFixed(4)}</div>
            </div>
            <div class="dir-stat-box">
              <div class="lbl">HP Balls Faced/Bowled</div>
              <div class="val">${hpBalls.toLocaleString()}</div>
            </div>
          </div>
          <button style="background:rgba(255,255,255,0.08); border:none; border-radius:var(--radius-pill); color:#ffffff; font-size:0.76rem; font-weight:700; padding:6px; cursor:pointer;" onclick="window.app.selectPlayer(${p.player_id}); window.app.switchView('studio');">
            View Studio Profile →
          </button>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* --- VIEW 4: AUDIT LAB METHODS --- */
  async renderAuditLab() {
    const gatesData = await window.dataLoader.loadValidationGates();
    if (!gatesData) return;

    // Render Gates Evaluation Grid
    const grid = document.getElementById('gatesEvalGrid');
    if (grid && gatesData.gates) {
      let html = '';
      gatesData.gates.forEach(g => {
        const bStatusClass = g.batters_status === 'PASS' ? 'pass' : (g.batters_status === 'FAIL' ? 'fail' : 'not-informative');
        const wStatusClass = g.bowlers_status === 'PASS' ? 'pass' : (g.bowlers_status === 'FAIL' ? 'fail' : 'not-informative');

        html += `
          <div class="gate-card">
            <div class="gate-card-header">
              <span class="gate-id-badge">${g.gate}: ${g.name}</span>
            </div>
            <p class="gate-card-desc">${g.desc}</p>
            <div class="gate-metrics-box">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>Batters: <strong>${g.batters_val}</strong></span>
                <span class="gate-status-pill ${bStatusClass}">${g.batters_status}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>Bowlers: <strong>${g.bowlers_val}</strong></span>
                <span class="gate-status-pill ${wStatusClass}">${g.bowlers_status}</span>
              </div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
                Standard: ${g.threshold}
              </div>
            </div>
          </div>
        `;
      });
      grid.innerHTML = html;
    }
  }

  /* --- MODAL: PRESSURE WORM --- */
  setupModals() {
    const closeBtn = document.getElementById('modalCloseBtn');
    const overlay = document.getElementById('wormModalOverlay');
    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    }
  }

  openWormModal(matchId, oppName) {
    const overlay = document.getElementById('wormModalOverlay');
    const titleEl = document.getElementById('modalMatchTitle');
    const svgStage = document.getElementById('wormSvgStage');
    if (!overlay || !svgStage) return;

    if (titleEl) {
      titleEl.textContent = `Match #${matchId} Pressure Worm ($P_i$) vs ${oppName || 'Opponent'}`;
    }

    // Generate synthetic 120-ball pressure worm curve with threshold line
    const W = 800;
    const H = 260;
    let pathD = `M 40,${H - 60}`;
    const points = [];

    let currentP = 0.35;
    for (let ball = 1; ball <= 120; ball++) {
      // Random walk with rising pressure in death overs
      const drift = ball > 96 ? 0.015 : (ball > 60 ? 0.005 : -0.002);
      currentP = Math.max(0.15, Math.min(0.92, currentP + drift + (Math.random() - 0.48) * 0.08));
      const x = 40 + (ball / 120) * (W - 80);
      const y = H - 40 - currentP * (H - 80);
      points.push({ x, y, p: currentP, ball });
      pathD += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
    }

    // 80th percentile threshold line: P = 0.601
    const p80Y = H - 40 - 0.601 * (H - 80);

    let svg = `
      <svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wormGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ff5733" />
            <stop offset="100%" stop-color="#ea1a85" />
          </linearGradient>
        </defs>

        <!-- Threshold Line P = 0.601 (HP Threshold) -->
        <line x1="40" y1="${p80Y}" x2="${W - 40}" y2="${p80Y}" stroke="#ffd700" stroke-width="1.8" stroke-dasharray="6,4" />
        <text x="${W - 35}" y="${p80Y + 4}" fill="#ffd700" font-size="11" font-weight="700" font-family="var(--font-mono)">P80 = 0.601 (HP Regime)</text>

        <!-- Base Axes -->
        <line x1="40" y1="${H - 40}" x2="${W - 40}" y2="${H - 40}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
        <text x="40" y="${H - 18}" fill="rgba(255,255,255,0.5)" font-size="10">Over 1 (Ball 1)</text>
        <text x="${W / 2}" y="${H - 18}" fill="rgba(255,255,255,0.5)" font-size="10" text-anchor="middle">Over 10 (Ball 60)</text>
        <text x="${W - 40}" y="${H - 18}" fill="rgba(255,255,255,0.5)" font-size="10" text-anchor="end">Over 20 (Ball 120)</text>

        <!-- Worm Pressure Trajectory Curve -->
        <path d="${pathD}" fill="none" stroke="url(#wormGrad)" stroke-width="3.5" />

        <!-- High-Pressure Climax Peak Marker -->
        <circle cx="${points[110].x}" cy="${points[110].y}" r="6" fill="#ff5733" stroke="#ffffff" stroke-width="2" />
        <text x="${points[110].x}" y="${points[110].y - 12}" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">Peak P: ${points[110].p.toFixed(3)}</text>
      </svg>
    `;

    svgStage.innerHTML = svg;
    overlay.classList.add('open');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
