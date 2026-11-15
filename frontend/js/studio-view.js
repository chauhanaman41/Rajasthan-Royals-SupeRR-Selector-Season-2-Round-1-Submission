/**
 * frontend/js/studio-view.js
 * Mode 1: Glassmorphic Player Profile Studio Controller (matching design.webp)
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

    // Fixture filter tabs
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.fixture-tab-btn');
      if (tab) {
        document.querySelectorAll('.fixture-tab-btn').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        this.filterFixtures(tab.dataset.filter);
      }
    });

    // Fixture card click to open Pressure Worm modal
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.fixture-card');
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

    // 1. Hero Cutout & Backlight Glow
    const cutoutImg = document.getElementById('heroCutoutImg');
    const glowEl = document.getElementById('jerseyBacklightGlow');
    const rankBadge = document.getElementById('heroRankBadge');

    if (cutoutImg) {
      cutoutImg.src = `./public/assets/players/cutouts/${player.player_id}.webp`;
      cutoutImg.onerror = () => {
        // Instant Canvas fallback if image missing
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
        rankBadge.innerHTML = `👑 Top 10 Rank #${topRank}`;
      } else if (player.batting_eb?.is_eligible || player.bowling_eb?.is_eligible) {
        rankBadge.className = 'player-rank-badge-overlay';
        rankBadge.innerHTML = `🛡️ Eligible Cohort`;
      } else {
        rankBadge.className = 'player-rank-badge-overlay';
        rankBadge.innerHTML = `⚡ Active Universe`;
      }
    }

    // 2. Identity Header & Team
    const nameEl = document.getElementById('playerStudioName');
    const teamNameEl = document.getElementById('playerStudioTeamName');
    const teamCrestEl = document.getElementById('playerStudioTeamCrest');
    const idEl = document.getElementById('playerStudioId');

    if (nameEl) nameEl.textContent = player.player_name;
    if (teamNameEl) teamNameEl.textContent = player.primary_team_name;
    if (teamCrestEl) {
      teamCrestEl.src = `./public/assets/teams/${player.primary_team_id}.svg`;
      teamCrestEl.onerror = () => { teamCrestEl.src = './public/assets/teams/0.svg'; };
    }
    if (idEl) idEl.textContent = `#${player.player_id}`;

    // 3. Role Switcher Pill (for 576 All-Rounders)
    const switcherEl = document.getElementById('roleSwitcherContainer');
    if (switcherEl) {
      if (player.is_all_rounder) {
        switcherEl.style.display = 'flex';
        switcherEl.innerHTML = `
          <button class="role-switcher-btn ${this.activeRoleMode === 'bat' ? 'active' : ''}" data-mode="bat">
            🏏 Batting (${player.balls_faced}B)
          </button>
          <button class="role-switcher-btn ${this.activeRoleMode === 'bowl' ? 'active' : ''}" data-mode="bowl">
            ⚾ Bowling (${player.balls_bowled}B)
          </button>
        `;
      } else {
        switcherEl.style.display = 'none';
      }
    }

    // 4. KPI Cards & 2x2 Grid
    this.renderKpiCards(player);
    this.renderAttributesGrid(player);

    // 5. Polar Spline Radar
    this.radar.render(player, this.activeRoleMode);

    // 6. Asynchronously Load Player Shard for Match Log & Fixtures
    this.loadAndRenderLogs(player.player_id);
  }

  renderKpiCards(player) {
    const isBowl = this.activeRoleMode === 'bowl';
    const eb = isBowl ? (player.bowling_eb || {}) : (player.batting_eb || {});

    // Card 1: Coral Lower Bound H_low
    const kpiVal1 = document.getElementById('kpiVal1');
    const kpiSub1 = document.getElementById('kpiSub1');
    const hlow = eb.h_low ?? (isBowl ? 0.101 : 0.05);
    if (kpiVal1) kpiVal1.textContent = `${hlow > 0 ? '+' : ''}${hlow.toFixed(4)}`;
    if (kpiSub1) {
      kpiSub1.textContent = eb.is_top10
        ? `Official Rank #${eb.rank}`
        : (eb.is_eligible ? 'Eligible Cohort' : 'Shrunk Prior Bound');
    }

    // Card 2: Glass Posterior Mean H_p & CI
    const kpiVal2 = document.getElementById('kpiVal2');
    const kpiSub2 = document.getElementById('kpiSub2');
    const hp = eb.h_p ?? (isBowl ? 0.118 : 0.10);
    const ci_l = eb.ci_lower ?? (hp - 0.04);
    const ci_u = eb.ci_upper ?? (hp + 0.04);
    if (kpiVal2) kpiVal2.textContent = `${hp > 0 ? '+' : ''}${hp.toFixed(3)}`;
    if (kpiSub2) kpiSub2.textContent = `90% CI: [${ci_l.toFixed(3)}, ${ci_u.toFixed(3)}]`;

    // Card 3: White Card Win/Inclusion %
    const kpiVal3 = document.getElementById('kpiVal3');
    const kpiSub3 = document.getElementById('kpiSub3');
    const kpiLbl3 = document.getElementById('kpiLbl3');
    if (eb.is_top10 && eb.inc_prob !== undefined) {
      if (kpiLbl3) kpiLbl3.textContent = 'Top-10 Inc. Prob';
      if (kpiVal3) kpiVal3.textContent = `${eb.inc_prob.toFixed(1)}%`;
      if (kpiSub3) kpiSub3.textContent = `Mean Bootstrap Rank: ${eb.mean_rank ?? 5.0}`;
    } else {
      const winRate = Math.min(88, Math.max(42, 50.0 + ((eb.h_low || 0) * 120)));
      if (kpiLbl3) kpiLbl3.textContent = 'Est. Win Contribution';
      if (kpiVal3) kpiVal3.textContent = `${winRate.toFixed(1)}%`;
      if (kpiSub3) kpiSub3.textContent = `${player.appearances || 20} Starting Appearances`;
    }
  }

  renderAttributesGrid(player) {
    const isBowl = this.activeRoleMode === 'bowl';
    const eb = isBowl ? (player.bowling_eb || {}) : (player.batting_eb || {});

    // Pill 1: Handedness & Style
    const attrVal1 = document.getElementById('attrVal1');
    if (attrVal1) {
      attrVal1.textContent = isBowl
        ? `${player.bowling_type} (${player.pace_or_spin})`
        : `${player.batting_type} Striker`;
    }

    // Pill 2: Tactical Roles
    const attrVal2 = document.getElementById('attrVal2');
    if (attrVal2) {
      const parts = [];
      if (player.captain_matches > 0) parts.push(`Captain (${player.captain_matches})`);
      if (player.wk_matches > 0) parts.push(`WK (${player.wk_matches})`);
      if (player.impact_in > 0) parts.push(`Impact (${player.impact_in})`);
      if (player.modal_bat_order > 0) parts.push(`Pos #${player.modal_bat_order}`);
      attrVal2.textContent = parts.length ? parts.join(' • ') : 'Standard Specialist';
    }

    // Pill 3: Volume & HP Exposure
    const attrVal3 = document.getElementById('attrVal3');
    if (attrVal3) {
      const totB = isBowl ? player.balls_bowled : player.balls_faced;
      const hpB = eb.hp_balls || Math.round(totB * 0.20);
      const hpM = eb.hp_matches || Math.round((player.matches_batted || 10) * 0.35);
      attrVal3.textContent = `${totB.toLocaleString()} Balls (${hpB.toLocaleString()} HP) in ${hpM} M`;
    }

    // Pill 4: Situational Chase Split
    const attrVal4 = document.getElementById('attrVal4');
    if (attrVal4) {
      const inn2 = eb.inn2_hp_share ? `${eb.inn2_hp_share.toFixed(1)}%` : '50.0%';
      attrVal4.textContent = `Inn 2 Chase: ${inn2} ${eb.inn2_hp_share > 85 ? '(Chase-Dep)' : ''}`;
    }
  }

  async loadAndRenderLogs(playerId) {
    const logList = document.getElementById('matchLogScroll');
    const fixtureList = document.getElementById('fixtureCardsGrid');

    if (logList) logList.innerHTML = '<div style="padding:20px; color:rgba(255,255,255,0.4);">Loading match log...</div>';
    if (fixtureList) fixtureList.innerHTML = '<div style="padding:20px; color:rgba(255,255,255,0.4);">Loading fixtures...</div>';

    const shard = await window.dataLoader.loadPlayerShard(playerId);
    if (!shard || !shard.match_log) return;

    this.rawMatchLog = shard.match_log;
    this.renderMatchLogRows(this.rawMatchLog);
    this.renderFixtureCards(this.rawMatchLog);
  }

  renderMatchLogRows(matches) {
    const container = document.getElementById('matchLogScroll');
    if (!container) return;

    if (!matches.length) {
      container.innerHTML = '<div style="padding:20px; color:rgba(255,255,255,0.4);">No scoped matches recorded.</div>';
      return;
    }

    let html = '';
    matches.slice(0, 25).forEach(m => {
      const resClass = m.result === 'Win' ? 'win' : (m.result === 'Loss' ? 'loss' : 'other');
      
      let statStr = '';
      if (m.balls_bat) {
        statStr += `${m.runs_bat}(${m.balls_bat})`;
      }
      if (m.balls_bowl) {
        const ov = (m.balls_bowl / 6).toFixed(1);
        statStr += `${statStr ? ' & ' : ''}${m.wickets}/${m.runs_conceded} (${ov} ov)`;
      }

      html += `
        <div class="match-log-pill-row">
          <div class="match-log-date">${m.date.slice(5)}</div>
          <div class="match-log-opp">
            <img src="./public/assets/teams/${m.opponent_id}.svg" onerror="this.src='./public/assets/teams/0.svg'" alt="opp" />
            <span>vs ${m.opponent_name.split(' ').slice(0, 2).join(' ')}</span>
          </div>
          <div><span class="match-log-result-tag ${resClass}">${m.result}</span></div>
          <div class="match-log-stats">${statStr || '0 (0)'}</div>
          <div class="match-log-role">${m.stage || 'League'}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderFixtureCards(matches) {
    const container = document.getElementById('fixtureCardsGrid');
    if (!container) return;

    if (!matches.length) {
      container.innerHTML = '<div style="padding:20px; color:rgba(255,255,255,0.4);">No fixtures recorded.</div>';
      return;
    }

    let html = '';
    matches.slice(0, 15).forEach(m => {
      const isWin = m.result === 'Win';
      html += `
        <div class="fixture-card" data-match-id="${m.match_id}" data-opp-name="${m.opponent_name}">
          <div class="fixture-card-top">
            <span>${m.comp_name} • ${m.date}</span>
            <span style="font-family:var(--font-mono); font-size:0.72rem;">ID: #${m.match_id}</span>
          </div>
          <div class="fixture-teams-row">
            <div class="fixture-team-block">
              <img src="./public/assets/teams/${this.activePlayer.primary_team_id}.svg" onerror="this.src='./public/assets/teams/0.svg'" />
              <span>${this.activePlayer.primary_team_name.split(' ').slice(0, 2).join(' ')}</span>
            </div>
            <div class="wl-badge-pill ${isWin ? 'win' : 'loss'}">
              ${isWin ? 'W' : 'L'}
            </div>
            <div class="fixture-team-block">
              <span>${m.opponent_name.split(' ').slice(0, 2).join(' ')}</span>
              <img src="./public/assets/teams/${m.opponent_id}.svg" onerror="this.src='./public/assets/teams/0.svg'" />
            </div>
          </div>
          <div class="fixture-card-action">
            <span>⚡ Click to Inspect Ball Pressure Worm</span> →
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  filterFixtures(filter) {
    if (!this.rawMatchLog) return;
    let filtered = this.rawMatchLog;
    if (filter === 'ipl') {
      filtered = this.rawMatchLog.filter(m => m.comp_name.toLowerCase().includes('ipl') || m.comp_name.toLowerCase().includes('premier'));
    } else if (filter === 't20i') {
      filtered = this.rawMatchLog.filter(m => m.comp_name.toLowerCase().includes('t20i') || m.comp_name.toLowerCase().includes('world'));
    } else if (filter === 'knockout') {
      filtered = this.rawMatchLog.filter(m => ['final', 'semi', 'eliminator', 'qualifier'].some(s => m.stage.toLowerCase().includes(s)));
    }
    this.renderFixtureCards(filtered);
  }
}

window.StudioView = StudioView;
