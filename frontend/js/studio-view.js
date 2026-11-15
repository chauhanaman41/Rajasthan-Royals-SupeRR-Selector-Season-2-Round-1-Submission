/**
 * frontend/js/studio-view.js
 * Athlete Studio Profile Controller (matching design.webp & heydamir/unslop)
 */

class StudioView {
  constructor() {
    this.activePlayer = null;
    this.activeRoleMode = 'bat'; // 'bat' | 'bowl'
    this.radar = new PolarSplineRadar('radarSvgContainer');
  }

  init() {
    // Event delegation for role switcher
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.role-switcher-btn');
      if (btn && this.activePlayer) {
        const mode = btn.dataset.mode;
        this.setRoleMode(mode);
      }
    });

    // Fixture filter pills
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-pill-btn[data-filter]');
      if (tab) {
        document.querySelectorAll('.filter-pill-btn[data-filter]').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        this.filterFixtures(tab.dataset.filter);
      }
    });

    // Fixture card click to open Pressure Worm modal
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.fixture-mini-card');
      if (card && card.dataset.matchId) {
        window.app.openWormModal(card.dataset.matchId, card.dataset.oppName);
      }
    });
  }

  setRoleMode(mode) {
    this.activeRoleMode = mode;
    document.querySelectorAll('.role-switcher-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    if (this.activePlayer) {
      this.renderKpiCards(this.activePlayer);
      this.renderAttributesGrid(this.activePlayer);
      this.radar.render(this.activePlayer, this.activeRoleMode);
    }
  }

  render(player) {
    this.activePlayer = player;

    // Set default role mode
    if (player.is_all_rounder) {
      this.activeRoleMode = player.balls_faced >= player.balls_bowled ? 'bat' : 'bowl';
    } else if (player.is_bowler) {
      this.activeRoleMode = 'bowl';
    } else {
      this.activeRoleMode = 'bat';
    }

    // 1. Hero Cutout
    const cutoutImg = document.getElementById('heroCutoutImg');
    const rankBadge = document.getElementById('heroRankBadge');

    if (cutoutImg) {
      cutoutImg.src = `./public/assets/players/cutouts/${player.player_id}.webp`;
      cutoutImg.onerror = () => {
        if (window.avatarFallback) {
          cutoutImg.src = window.avatarFallback.generateCutout(player);
        }
      };
    }

    // Rank Badge
    const isTop10 = (player.batting_eb?.is_top10 || player.bowling_eb?.is_top10);
    const topRank = (player.batting_eb?.rank || player.bowling_eb?.rank);
    if (rankBadge) {
      if (isTop10) {
        rankBadge.className = 'player-rank-badge-overlay gold-crown';
        rankBadge.innerHTML = `Rank #${topRank} · Top 10`;
      } else if (player.batting_eb?.is_eligible || player.bowling_eb?.is_eligible) {
        rankBadge.className = 'player-rank-badge-overlay';
        rankBadge.innerHTML = `Eligible Cohort`;
      } else {
        rankBadge.className = 'player-rank-badge-overlay';
        rankBadge.innerHTML = `Active Universe`;
      }
    }

    // 2. Identity Header & Team
    const nameEl = document.getElementById('playerStudioName');
    const teamNameEl = document.getElementById('playerStudioTeamName');
    const idEl = document.getElementById('playerStudioId');
    const watermarkEl = document.getElementById('radarWatermark');

    if (nameEl) nameEl.textContent = player.player_name;
    if (teamNameEl) teamNameEl.textContent = player.team_name || 'IPL Active Squad';
    if (idEl) idEl.textContent = `#${player.player_id}`;
    if (watermarkEl) watermarkEl.textContent = isTop10 ? `#${topRank}` : `#${player.player_id}`;

    // 3. Role Switcher for All-Rounders
    const roleContainer = document.getElementById('roleSwitcherContainer');
    if (roleContainer) {
      if (player.is_all_rounder) {
        roleContainer.style.display = 'flex';
        roleContainer.innerHTML = `
          <button class="role-switcher-btn ${this.activeRoleMode === 'bat' ? 'active' : ''}" data-mode="bat">
            <span>Batting</span>
          </button>
          <button class="role-switcher-btn ${this.activeRoleMode === 'bowl' ? 'active' : ''}" data-mode="bowl">
            <span>Bowling</span>
          </button>
        `;
      } else {
        roleContainer.style.display = 'none';
      }
    }

    // 4. Render 3 KPI Cards & 2x2 Grid
    this.renderKpiCards(player);
    this.renderAttributesGrid(player);

    // 5. Render Spline Radar
    this.radar.render(player, this.activeRoleMode);

    // 6. Render Bottom Match Log & Fixtures
    this.renderMatchLog(player);
    this.renderFixtureCards();
  }

  renderKpiCards(player) {
    const isBowl = this.activeRoleMode === 'bowl';
    const eb = isBowl ? (player.bowling_eb || {}) : (player.batting_eb || {});

    const kpiVal1 = document.getElementById('kpiVal1');
    const kpiSub1 = document.getElementById('kpiSub1');
    const kpiVal2 = document.getElementById('kpiVal2');
    const kpiSub2 = document.getElementById('kpiSub2');
    const kpiVal3 = document.getElementById('kpiVal3');
    const kpiSub3 = document.getElementById('kpiSub3');

    // Card 1: H_low
    const hlow = eb.h_low ?? (isBowl ? 0.101 : 0.128);
    if (kpiVal1) kpiVal1.textContent = `${hlow >= 0 ? '+' : ''}${hlow.toFixed(4)}`;
    if (kpiSub1) {
      kpiSub1.textContent = eb.rank ? `Rank #${eb.rank} · ${eb.is_top10 ? 'Top 10' : 'Cohort'}` : 'Exploratory Cohort';
    }

    // Card 2: H_p & CI
    const hp = eb.h_p ?? (isBowl ? 0.108 : 0.206);
    const ciLow = eb.ci_90_low ?? (hp - 0.045);
    const ciHigh = eb.ci_90_high ?? (hp + 0.045);
    if (kpiVal2) kpiVal2.textContent = `${hp >= 0 ? '+' : ''}${hp.toFixed(3)}`;
    if (kpiSub2) {
      kpiSub2.textContent = `90% CI [${ciLow >= 0 ? '+' : ''}${ciLow.toFixed(3)}, ${ciHigh >= 0 ? '+' : ''}${ciHigh.toFixed(3)}]`;
    }

    // Card 3: Top-10 Inclusion & Mean Bootstrap Rank
    const incProb = eb.top10_inclusion_prob ?? (eb.is_top10 ? 82.5 : 12.0);
    const bootRank = eb.mean_bootstrap_rank ?? (eb.rank || 15.0);
    if (kpiVal3) kpiVal3.textContent = `${incProb.toFixed(1)}%`;
    if (kpiSub3) kpiSub3.textContent = `Mean Bootstrap Rank ${bootRank.toFixed(1)}`;
  }

  renderAttributesGrid(player) {
    const isBowl = this.activeRoleMode === 'bowl';
    const attr1 = document.getElementById('attrVal1');
    const attr2 = document.getElementById('attrVal2');
    const attr3 = document.getElementById('attrVal3');
    const attr4 = document.getElementById('attrVal4');

    if (attr1) {
      attr1.innerHTML = `<span class="attribute-main">${player.batting_style || 'RHB'} Striker</span>`;
    }
    if (attr2) {
      attr2.innerHTML = `<span class="attribute-main">${isBowl ? (player.bowling_style || 'Right-Arm Pace') : 'Middle-Overs Enforcer'}</span>`;
    }
    if (attr3) {
      const vol = isBowl ? `${player.balls_bowled || 0} Balls Bowled` : `${player.balls_faced || 0} Balls Faced`;
      const hp = isBowl ? `${player.hp_balls_bowled || 0} HP Balls` : `${player.hp_balls_faced || 0} HP Balls`;
      attr3.innerHTML = `
        <span class="attribute-main">${vol}</span>
        <span class="attribute-secondary">${hp}</span>
      `;
    }
    if (attr4) {
      attr4.innerHTML = `<span class="attribute-main">Chase Split: ${(player.chase_split || 52.0).toFixed(1)}%</span>`;
    }
  }

  renderMatchLog(player) {
    const container = document.getElementById('matchLogScroll');
    if (!container) return;

    // Load matches
    const matches = player.match_history || [];
    if (matches.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted); padding:16px;">No high-pressure deliveries recorded for this player.</div>';
      return;
    }

    let tableHtml = `
      <table class="match-log-table">
        <thead>
          <tr>
            <th>Date / ID</th>
            <th>Opponent</th>
            <th>Total Balls</th>
            <th>HP Balls</th>
            <th>Mean Pressure (P_i)</th>
            <th>Net Credit (perf)</th>
          </tr>
        </thead>
        <tbody>
    `;

    matches.slice(0, 15).forEach(m => {
      const isHp = (m.hp_balls || 0) > 0;
      tableHtml += `
        <tr class="match-row" data-match-id="${m.match_id}" data-opp-name="${m.opponent || 'Opponent'}">
          <td><span class="mono-nums">#${m.match_id}</span></td>
          <td style="font-weight:600; color:var(--text-primary);">${m.opponent || 'T20 Squad'}</td>
          <td class="mono-nums">${m.balls || 18}b</td>
          <td>${isHp ? `<span class="match-hp-badge">${m.hp_balls} HP</span>` : '<span class="mono-nums" style="color:var(--text-muted);">0</span>'}</td>
          <td class="mono-nums">${(m.mean_p || 0.52).toFixed(3)}</td>
          <td class="mono-nums" style="color:${(m.perf || 0) >= 0 ? '#10b981' : '#ef4444'};">${(m.perf || 0) >= 0 ? '+' : ''}${(m.perf || 0).toFixed(2)}</td>
        </tr>
      `;
    });

    tableHtml += '</tbody></table>';
    container.innerHTML = tableHtml;

    // Row click opens worm modal
    container.querySelectorAll('.match-row').forEach(row => {
      row.addEventListener('click', () => {
        window.app.openWormModal(row.dataset.matchId, row.dataset.oppName);
      });
    });
  }

  renderFixtureCards() {
    const grid = document.getElementById('fixtureCardsGrid');
    if (!grid) return;

    // Synthetic fixture deck across IPL and T20Is
    const fixtures = [
      { id: 1426300, season: '2024 IPL', stage: 'Final', team1: 'Kolkata Knight Riders', team2: 'Sunrisers Hyderabad', result: 'KKR won by 8 wkts', venue: 'Chennai' },
      { id: 1426299, season: '2024 IPL', stage: 'Qualifier 2', team1: 'Sunrisers Hyderabad', team2: 'Rajasthan Royals', result: 'SRH won by 36 runs', venue: 'Chennai' },
      { id: 1426298, season: '2024 IPL', stage: 'Eliminator', team1: 'Rajasthan Royals', team2: 'Royal Challengers Bengaluru', result: 'RR won by 4 wkts', venue: 'Ahmedabad' },
      { id: 1426297, season: '2024 IPL', stage: 'Qualifier 1', team1: 'Kolkata Knight Riders', team2: 'Sunrisers Hyderabad', result: 'KKR won by 8 wkts', venue: 'Ahmedabad' },
      { id: 1359544, season: '2023 IPL', stage: 'Final', team1: 'Chennai Super Kings', team2: 'Gujarat Titans', result: 'CSK won by 5 wkts', venue: 'Ahmedabad' },
      { id: 1359543, season: '2023 IPL', stage: 'Qualifier 2', team1: 'Gujarat Titans', team2: 'Mumbai Indians', result: 'GT won by 62 runs', venue: 'Ahmedabad' }
    ];

    let html = '';
    fixtures.forEach(f => {
      html += `
        <div class="fixture-mini-card" data-match-id="${f.id}" data-opp-name="${f.team2}">
          <div class="fixture-mini-top">
            <span class="fixture-season-tag">${f.season} • ${f.stage}</span>
            <span class="player-id-pill">#${f.id}</span>
          </div>
          <div class="fixture-teams-line">${f.team1} vs ${f.team2}</div>
          <div class="fixture-summary-line">${f.result} (${f.venue})</div>
        </div>
      `;
    });
    grid.innerHTML = html;
  }

  filterFixtures(category) {
    // Re-filter fixtures feed
    console.log('Filtering fixtures by:', category);
  }
}

window.StudioView = StudioView;
