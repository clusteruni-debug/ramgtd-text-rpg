/**
 * StateManager - 플레이어 상태 관리 + 이벤트 시스템
 * GDD v2: Body/Sense/Reason/Bond + Karma + 기억 시스템
 */
import { clamp, deepClone } from '../utils/helpers.js';

export default class StateManager {
  constructor() {
    this._listeners = {};
    this.state = this._createInitialState();
  }

  _createInitialState() {
    return {
      player: {
        name: '???',
        hp: 20,
        maxHp: 20,
        body: 2,      // 체력 — 물리적 돌파/지구력
        sense: 2,     // 감각 — 회피/탐색/위험감지
        reason: 2,    // 이성 — 분석/퍼즐/약점간파
        bond: 1,      // 교감 — 설득/감정연결/동료연계
        karma: 0,     // -100(암) ~ +100(명)
        engrams: 0,   // 기억 데이터 (성장 자원)
      },
      inventory: [],
      flags: {},
      currentScene: null,
      realMemories: [],    // 현실 기억 목록 (사망 시 소멸)
      abyssMemories: [],   // 심연의 기억 (동료 유대)
      companions: [],      // 동료 목록
    };
  }

  // --- 이벤트 시스템 ---
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(cb => cb(data));
  }

  // --- 스탯 ---
  getStat(stat) {
    return this.state.player[stat];
  }

  modifyStat(stat, value) {
    const player = this.state.player;
    if (!(stat in player)) return;

    player[stat] += value;

    // HP 범위 제한
    if (stat === 'hp') player.hp = clamp(player.hp, 0, player.maxHp);
    // 4대 능력치 범위 제한 (1~5)
    if (['body', 'sense', 'reason', 'bond'].includes(stat)) {
      player[stat] = clamp(player[stat], 1, 5);
    }

    this.emit('statChanged', { stat, value: player[stat], delta: value });

    // HP 0 이하 → 사망 이벤트
    if (stat === 'hp' && player.hp <= 0) {
      this.emit('playerDead', null);
    }
  }

  setStat(stat, value) {
    const player = this.state.player;
    if (!(stat in player)) return;
    const old = player[stat];
    player[stat] = value;
    this.emit('statChanged', { stat, value, delta: value - old });
  }

  // --- 카르마 ---
  modifyKarma(value) {
    const player = this.state.player;
    const old = player.karma;
    player.karma = clamp(player.karma + value, -100, 100);
    this.emit('karmaChanged', { karma: player.karma, delta: player.karma - old });
  }

  getKarmaAlignment() {
    const karma = this.state.player.karma;
    if (karma >= 30) return 'light';
    if (karma <= -30) return 'dark';
    return 'neutral';
  }

  // --- 엔그램 (성장 자원) ---
  addEngrams(value) {
    this.state.player.engrams += value;
    if (this.state.player.engrams < 0) this.state.player.engrams = 0;
    this.emit('engramsChanged', { engrams: this.state.player.engrams, delta: value });
  }

  // --- 현실 기억 ---
  loseRealMemory() {
    const memories = this.state.realMemories;
    if (memories.length === 0) {
      this.emit('gameOver', { reason: 'noMemories' });
      return null;
    }
    // 가장 가벼운(먼저 등록된) 기억부터 소멸
    const lost = memories.shift();
    this.emit('memoryLost', { memory: lost, remaining: memories.length });

    if (memories.length === 0) {
      this.emit('gameOver', { reason: 'noMemories' });
    }
    return lost;
  }

  getRealMemoryCount() {
    return this.state.realMemories.length;
  }

  // --- 심연의 기억 ---
  addAbyssMemory(memory) {
    this.state.abyssMemories.push(memory);
    this.emit('abyssMemoryGained', { memory });
  }

  // --- 동료 ---
  addCompanion(companion) {
    // 스킬에 currentCharges 자동 부여
    if (companion.skills && companion.skills.length > 0) {
      companion.skills = companion.skills.map(s => ({
        ...s,
        currentCharges: s.currentCharges ?? s.chargesPerRun ?? 0,
      }));
    }
    this.state.companions.push(companion);
    this.emit('companionJoined', { companion });
  }

  getCompanion(id) {
    return this.state.companions.find(c => c.id === id) || null;
  }

  isCompanionAlive(id) {
    const c = this.getCompanion(id);
    return c ? c.alive !== false : false;
  }

  getCompanionTrust(id) {
    const c = this.getCompanion(id);
    return c ? (c.trustLevel || 0) : 0;
  }

  modifyCompanionTrust(id, value) {
    const c = this.getCompanion(id);
    if (!c) return;
    c.trustLevel = clamp((c.trustLevel || 0) + value, -100, 100);
    this.emit('companionTrustChanged', { companion: c, delta: value });
  }

  killCompanion(id) {
    const c = this.getCompanion(id);
    if (!c) return;
    c.alive = false;
    this.emit('companionDied', { companion: c });
  }

  getAliveCompanions() {
    return this.state.companions.filter(c => c.alive !== false);
  }

  /** 동료 스킬 사용 — 충전 차감, 이벤트 emit */
  useCompanionSkill(companionId, skillId) {
    const comp = this.getCompanion(companionId);
    if (!comp || comp.alive === false) return false;
    const skill = (comp.skills || []).find(s => s.id === skillId);
    if (!skill || (skill.currentCharges ?? 0) <= 0) return false;
    skill.currentCharges--;
    this.emit('companionSkillUsed', { companion: comp, skill });
    return true;
  }

  /** 모든 동료 스킬 충전 리셋 (휴식 시 호출) */
  resetCompanionSkillCharges() {
    this.state.companions.forEach(comp => {
      if (comp.alive === false) return;
      (comp.skills || []).forEach(s => {
        s.currentCharges = s.chargesPerRun ?? 0;
      });
    });
    this.emit('companionSkillsReset', null);
  }

  /** 현재 사용 가능한 동료 스킬 목록 반환 */
  getAvailableCompanionSkills() {
    const skills = [];
    this.state.companions.forEach(comp => {
      if (comp.alive === false) return;
      (comp.skills || []).forEach(s => {
        if ((s.currentCharges ?? 0) > 0) {
          skills.push({
            companionId: comp.id,
            companionName: comp.name,
            ...s,
          });
        }
      });
    });
    return skills;
  }

  // --- 인벤토리 ---
  addItem(item) {
    const existing = this.state.inventory.find(i => i.id === item.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
    } else {
      this.state.inventory.push({ ...item, quantity: item.quantity || 1 });
    }
    this.emit('inventoryChanged', { action: 'add', item });
  }

  removeItem(itemId, quantity = 1) {
    const idx = this.state.inventory.findIndex(i => i.id === itemId);
    if (idx === -1) return false;

    const item = this.state.inventory[idx];
    item.quantity -= quantity;
    if (item.quantity <= 0) {
      this.state.inventory.splice(idx, 1);
    }
    this.emit('inventoryChanged', { action: 'remove', itemId, quantity });
    return true;
  }

  hasItem(itemId) {
    return this.state.inventory.some(i => i.id === itemId);
  }

  getItem(itemId) {
    return this.state.inventory.find(i => i.id === itemId) || null;
  }

  // --- 플래그 ---
  setFlag(key, value = true) {
    this.state.flags[key] = value;
    this.emit('flagChanged', { key, value });
  }

  getFlag(key) {
    return this.state.flags[key] ?? null;
  }

  hasFlag(key) {
    return !!this.state.flags[key];
  }

  // --- 씬 ---
  setCurrentScene(sceneId) {
    this.state.currentScene = sceneId;
    this.emit('sceneChanged', { sceneId });
  }

  // --- 직렬화 (세이브/로드용) ---
  serialize() {
    return deepClone(this.state);
  }

  deserialize(data) {
    this.state = deepClone(data);
    this.emit('stateLoaded', null);
  }

  // 초기화 (새 게임 시작)
  reset(config = {}, metaBonuses = null) {
    this.state = this._createInitialState();

    // config에서 초기 스탯 적용
    if (config.initialStats) {
      Object.assign(this.state.player, config.initialStats);
    }

    // 현실 기억 목록 초기화
    if (config.realMemories) {
      this.state.realMemories = deepClone(config.realMemories);
    }

    // 영구 보너스 적용
    if (metaBonuses) {
      const player = this.state.player;
      if (metaBonuses.body) player.body = clamp(player.body + metaBonuses.body, 1, 5);
      if (metaBonuses.sense) player.sense = clamp(player.sense + metaBonuses.sense, 1, 5);
      if (metaBonuses.reason) player.reason = clamp(player.reason + metaBonuses.reason, 1, 5);
      if (metaBonuses.bond) player.bond = clamp(player.bond + metaBonuses.bond, 1, 5);
      if (metaBonuses.maxHp) {
        player.maxHp += metaBonuses.maxHp;
        player.hp = player.maxHp;
      }
    }

    this.emit('stateReset', null);
  }
}
