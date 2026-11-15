/**
 * frontend/js/data-loader.js
 * Centralized data management and lazy-loading cache for SupeRR Selector Dashboard
 */

class DataLoader {
  constructor() {
    this.baseDataUrl = './public/data';
    this.masterIndex = null;
    this.matchesSummary = null;
    this.constellationGraph = null;
    this.validationGates = null;
    this.playerShardCache = new Map();
  }

  async loadMasterIndex() {
    if (this.masterIndex) return this.masterIndex;
    try {
      const resp = await fetch(`${this.baseDataUrl}/players_master_index.json`);
      this.masterIndex = await resp.json();
      return this.masterIndex;
    } catch (err) {
      console.error('Failed to load players_master_index.json:', err);
      return null;
    }
  }

  async loadMatchesSummary() {
    if (this.matchesSummary) return this.matchesSummary;
    try {
      const resp = await fetch(`${this.baseDataUrl}/matches_summary.json`);
      this.matchesSummary = await resp.json();
      return this.matchesSummary;
    } catch (err) {
      console.error('Failed to load matches_summary.json:', err);
      return null;
    }
  }

  async loadConstellationGraph() {
    if (this.constellationGraph) return this.constellationGraph;
    try {
      const resp = await fetch(`${this.baseDataUrl}/competitions_teams_graph.json`);
      this.constellationGraph = await resp.json();
      return this.constellationGraph;
    } catch (err) {
      console.error('Failed to load competitions_teams_graph.json:', err);
      return null;
    }
  }

  async loadValidationGates() {
    if (this.validationGates) return this.validationGates;
    try {
      const resp = await fetch(`${this.baseDataUrl}/validation_gates.json`);
      this.validationGates = await resp.json();
      return this.validationGates;
    } catch (err) {
      console.error('Failed to load validation_gates.json:', err);
      return null;
    }
  }

  async loadPlayerShard(playerId) {
    if (this.playerShardCache.has(playerId)) {
      return this.playerShardCache.get(playerId);
    }
    try {
      const resp = await fetch(`${this.baseDataUrl}/players/${playerId}.json`);
      if (resp.ok) {
        const data = await resp.json();
        this.playerShardCache.set(playerId, data);
        return data;
      }
    } catch (err) {
      console.warn(`Player shard ${playerId}.json not found; falling back to master summary.`);
    }

    // Fallback: build synthetic shard from master index summary
    if (this.masterIndex) {
      const player = this.masterIndex.players.find(p => p.player_id === Number(playerId));
      if (player) {
        const synthetic = {
          summary: player,
          match_log: [],
          head_to_head: []
        };
        this.playerShardCache.set(playerId, synthetic);
        return synthetic;
      }
    }
    return null;
  }
}

window.dataLoader = new DataLoader();
