/**
 * frontend/js/app.js
 * Main Controller & View Router for SupeRR Selector Dashboard
 * 3 Views: Studio Profile, 959-Player Directory, Validation & Audit Lab
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
    this.auditLab = new AuditLab();
  }

  async init() {
    console.log('Initializing SupeRR Selector Unslopped Dashboard...');
    this.studioView.init();

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

    // 3. Initialize Audit Lab
    this.auditLab.init();

    // 4. Handle Initial Route from URL Hash or Default to Klaasen (4260)
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const initialPlayerId = hashParams.get('player') || '4260';
    const initialRole = hashParams.get('role') || 'bat';
    const initialView = hashParams.get('view') || 'studio';

    this.selectPlayer(initialPlayerId, initialRole);
    this.switchView(initialView);
  }

  setupNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    const brandLogo = document.getElementById('brandLogoLink');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        this.switchView('studio');
      });
    }

    const navAvatar = document.getElementById('navAvatarPill');
    if (navAvatar) {
      navAvatar.addEventListener('click', () => {
        this.switchView('studio');
      });
    }
  }

  switchView(viewName) {
    this.activeView = viewName;

    // Update nav tab buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Toggle View Containers (Exactly 3 Views)
    const viewStudio = document.getElementById('view-studio');
    const viewDir = document.getElementById('view-directory');
    const viewAudit = document.getElementById('view-audit');

    if (viewStudio) viewStudio.style.display = viewName === 'studio' ? 'block' : 'none';
    if (viewDir) viewDir.style.display = viewName === 'directory' ? 'block' : 'none';
    if (viewAudit) viewAudit.style.display = viewName === 'audit' ? 'block' : 'none';

    // If switching to directory, render directory cards
    if (viewName === 'directory') {
      this.renderDirectoryGrid();
    }

    // Refresh Lucide icons if available
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Update URL hash without reload
    const currentPid = this.activePlayer?.player_id || '4260';
    window.location.hash = `#view=${viewName}&player=${currentPid}`;
  }

  /* --- PLAYER SELECTION --- */
  selectPlayer(playerId, preferredRole = 'bat') {
    const pid = parseInt(playerId, 10);
    const player = this.allPlayers.find(p => p.player_id === pid) || this.allPlayers[0];
    if (!player) return;

    this.activePlayer = player;

    // Update top nav avatar
    const navAvatarImg = document.getElementById('navAvatarImg');
    if (navAvatarImg) {
      navAvatarImg.src = `./public/assets/players/avatars/${player.player_id}.webp`;
      navAvatarImg.onerror = () => {
        if (window.avatarFallback) {
          navAvatarImg.src = window.avatarFallback.generateAvatar(player);
        }
      };
    }

    // Render Studio Profile
    this.studioView.render(player);
    if (preferredRole) {
      this.studioView.setRoleMode(preferredRole);
    }

    // Update URL hash
    window.location.hash = `#view=${this.activeView}&player=${player.player_id}&role=${this.studioView.activeRoleMode}`;
  }

  /* --- OMNI SEARCH --- */
  setupOmniSearch() {
    const searchInput = document.getElementById('omniSearchInput');
    const dropdown = document.getElementById('searchResultsDropdown');
    if (!searchInput || !dropdown) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        dropdown.style.display = 'none';
        return;
      }

      const matches = this.allPlayers.filter(p => 
        p.player_name.toLowerCase().includes(q) ||
        (p.team_name && p.team_name.toLowerCase().includes(q)) ||
        p.player_id.toString().includes(q)
      ).slice(0, 8);

      if (matches.length === 0) {
        dropdown.innerHTML = '<div class="search-result-item" style="color:var(--text-muted);">No matching players found</div>';
        dropdown.style.display = 'block';
        return;
      }

      let html = '';
      matches.forEach(p => {
        const isTop10 = (p.batting_eb?.is_top10 || p.bowling_eb?.is_top10);
        html += `
          <div class="search-result-item" data-player-id="${p.player_id}">
            <img class="search-item-avatar" src="./public/assets/players/avatars/${p.player_id}.webp" onerror="this.src='./public/assets/teams/0.svg'" alt="" />
            <div class="search-item-info">
              <div class="search-item-name">${p.player_name}</div>
              <div class="search-item-meta">${p.team_name || 'Active Player'} • #${p.player_id}</div>
            </div>
            ${isTop10 ? '<span class="filter-pill-btn active" style="font-size:10px; padding:2px 8px;">Top 10</span>' : ''}
          </div>
        `;
      });

      dropdown.innerHTML = html;
      dropdown.style.display = 'block';
    });

    // Result selection
    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item && item.dataset.playerId) {
        this.selectPlayer(item.dataset.playerId);
        this.switchView('studio');
        dropdown.style.display = 'none';
        searchInput.value = '';
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  /* --- DIRECTORY VIEW --- */
  setupDirectoryFilters() {
    const dirSearch = document.getElementById('dirSearchInput');
    if (dirSearch) {
      dirSearch.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        this.filterDirectory(q, this.activeCohort);
      });
    }

    document.querySelectorAll('.cohort-filter-pills .filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cohort-filter-pills .filter-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCohort = btn.dataset.cohort;
        const q = document.getElementById('dirSearchInput')?.value.trim().toLowerCase() || '';
        this.filterDirectory(q, this.activeCohort);
      });
    });
  }

  filterDirectory(query, cohort) {
    let list = [...this.allPlayers];

    // Filter by cohort
    if (cohort === 'top10') {
      list = list.filter(p => p.batting_eb?.is_top10 || p.bowling_eb?.is_top10);
    } else if (cohort === 'eligible') {
      list = list.filter(p => p.batting_eb?.is_eligible || p.bowling_eb?.is_eligible);
    } else if (cohort === 'all_rounders') {
      list = list.filter(p => p.is_all_rounder);
    } else if (cohort === 'batters') {
      list = list.filter(p => p.is_batter);
    } else if (cohort === 'bowlers') {
      list = list.filter(p => p.is_bowler);
    } else if (cohort === 'sub_threshold') {
      list = list.filter(p => !p.batting_eb?.is_eligible && !p.bowling_eb?.is_eligible);
    }

    // Filter by search text
    if (query) {
      list = list.filter(p =>
        p.player_name.toLowerCase().includes(query) ||
        (p.team_name && p.team_name.toLowerCase().includes(query)) ||
        p.player_id.toString().includes(query)
      );
    }

    this.filteredDirectoryPlayers = list;
    this.renderDirectoryGrid();
  }

  renderDirectoryGrid() {
    const grid = document.getElementById('directoryPlayersGrid');
    const badge = document.getElementById('dirCountBadge');
    if (!grid) return;

    if (badge) {
      badge.textContent = `Showing ${this.filteredDirectoryPlayers.length} Players`;
    }

    const items = this.filteredDirectoryPlayers.slice(0, 120); // Render first 120 smoothly
    let html = '';

    items.forEach(p => {
      const isTop10 = (p.batting_eb?.is_top10 || p.bowling_eb?.is_top10);
      const topRank = (p.batting_eb?.rank || p.bowling_eb?.rank);
      const eb = p.batting_eb || p.bowling_eb || {};
      const hlow = eb.h_low ?? 0.0;

      html += `
        <div class="dir-player-card" data-player-id="${p.player_id}" style="background:var(--surface-card); border:1px solid var(--border-hairline); border-radius:var(--radius-md); padding:16px; cursor:pointer; display:flex; align-items:center; gap:14px; transition:all var(--trans-fast);">
          <img src="./public/assets/players/avatars/${p.player_id}.webp" onerror="this.src='./public/assets/teams/0.svg'" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:1px solid var(--border-hairline);" alt="" />
          <div style="flex:1; min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4 style="font-family:var(--font-sans); font-size:0.95rem; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.player_name}</h4>
              ${isTop10 ? `<span class="gate-status-pill pass" style="font-size:10px;">Rank #${topRank}</span>` : ''}
            </div>
            <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
              ${p.team_name || 'Active Cohort'} • #${p.player_id}
            </div>
            <div style="display:flex; gap:12px; margin-top:8px; font-family:var(--font-mono); font-size:0.75rem;">
              <span style="color:var(--accent-coral);">H_low: <strong>${hlow >= 0 ? '+' : ''}${hlow.toFixed(4)}</strong></span>
              <span style="color:var(--text-secondary);">${p.balls_faced || 0}b faced</span>
            </div>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Card click opens Studio profile
    grid.querySelectorAll('.dir-player-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectPlayer(card.dataset.playerId);
        this.switchView('studio');
      });
    });
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
      titleEl.textContent = `Match #${matchId} Pressure Worm (P_i) vs ${oppName || 'Opponent'}`;
    }

    const W = 800;
    const H = 260;
    let pathD = `M 40,${H - 60}`;
    const points = [];

    let currentP = 0.35;
    for (let ball = 1; ball <= 120; ball++) {
      const drift = ball > 96 ? 0.015 : (ball > 60 ? 0.005 : -0.002);
      currentP = Math.max(0.15, Math.min(0.92, currentP + drift + (Math.random() - 0.48) * 0.08));
      const x = 40 + (ball / 120) * (W - 80);
      const y = H - 40 - currentP * (H - 80);
      points.push({ x, y, p: currentP, ball });
      pathD += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
    }

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
        <line x1="40" y1="${p80Y}" x2="${W - 40}" y2="${p80Y}" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="6,4" />
        <text x="${W - 35}" y="${p80Y + 4}" fill="#f59e0b" font-size="11" font-weight="600" font-family="'JetBrains Mono', monospace">P_i = 0.601 (HP Regime)</text>

        <!-- Base Axes -->
        <line x1="40" y1="${H - 40}" x2="${W - 40}" y2="${H - 40}" stroke="rgba(238,240,245,0.15)" stroke-width="1.5" />
        <text x="40" y="${H - 18}" fill="rgba(238,240,245,0.5)" font-size="10" font-family="'JetBrains Mono', monospace">Over 1 (Ball 1)</text>
        <text x="${W / 2}" y="${H - 18}" fill="rgba(238,240,245,0.5)" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="middle">Over 10 (Ball 60)</text>
        <text x="${W - 40}" y="${H - 18}" fill="rgba(238,240,245,0.5)" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="end">Over 20 (Ball 120)</text>

        <!-- Worm Pressure Trajectory Curve -->
        <path d="${pathD}" fill="none" stroke="url(#wormGrad)" stroke-width="3" />

        <!-- Peak Marker -->
        <circle cx="${points[110].x}" cy="${points[110].y}" r="5" fill="#ff5733" stroke="#ffffff" stroke-width="2" />
        <text x="${points[110].x}" y="${points[110].y - 10}" fill="#ffffff" font-size="11" font-weight="600" font-family="'JetBrains Mono', monospace" text-anchor="middle">Peak P: ${points[110].p.toFixed(3)}</text>
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
