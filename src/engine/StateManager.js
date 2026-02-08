/**
 * StateManager - 플레이어 상태 관리 + 이벤트 시스템
 * 스탯, 인벤토리, 플래그를 관리하고 변경 시 구독자에게 알림
 */
import { clamp, deepClone } from '../utils/helpers.js';

export default class StateManager {
  constructor() {
    // 이벤트 리스너 맵
    this._listeners = {};
    // 초기 상태
    this.state = this._createInitialState();
  }

  _createInitialState() {
    return {
      player: {
        name: '플레이어',
        level: 1,
        exp: 0,
        expToNext: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        attack: 10,
        defense: 5,
        speed: 5,
      },
      inventory: [],    // { id, name, description, type, effect, quantity }
      flags: {},         // 스토리 플래그 (string → boolean/number)
      currentScene: null,
      gold: 0,
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

    // HP/MP 범위 제한
    if (stat === 'hp') player.hp = clamp(player.hp, 0, player.maxHp);
    if (stat === 'mp') player.mp = clamp(player.mp, 0, player.maxMp);

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

  // --- 경험치/레벨업 ---
  addExp(amount) {
    const player = this.state.player;
    player.exp += amount;
    this.emit('expGained', { amount, total: player.exp });

    // 레벨업 체크
    while (player.exp >= player.expToNext) {
      player.exp -= player.expToNext;
      player.level += 1;
      player.expToNext = Math.floor(player.expToNext * 1.5);
      // 레벨업 보너스
      player.maxHp += 10;
      player.maxMp += 5;
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      player.attack += 2;
      player.defense += 1;
      player.speed += 1;
      this.emit('levelUp', { level: player.level });
    }
  }

  // --- 골드 ---
  addGold(amount) {
    this.state.gold += amount;
    this.emit('goldChanged', { gold: this.state.gold, delta: amount });
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

  // metaBonuses: { attack, defense, maxHp, maxMp, speed } (영구 보너스)
  reset(metaBonuses = null) {
    this.state = this._createInitialState();

    // 영구 보너스 적용
    if (metaBonuses) {
      const player = this.state.player;
      if (metaBonuses.attack) player.attack += metaBonuses.attack;
      if (metaBonuses.defense) player.defense += metaBonuses.defense;
      if (metaBonuses.maxHp) {
        player.maxHp += metaBonuses.maxHp;
        player.hp = player.maxHp;
      }
      if (metaBonuses.maxMp) {
        player.maxMp += metaBonuses.maxMp;
        player.mp = player.maxMp;
      }
      if (metaBonuses.speed) player.speed += metaBonuses.speed;
    }

    this.emit('stateReset', null);
  }
}
