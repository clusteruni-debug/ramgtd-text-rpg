/**
 * MetaProgression - 영구 진행도 관리 (로그라이크 메타 프로그레션)
 * GDD v2: Body/Sense/Reason/Bond 기반 영구 보너스
 */
import { deepClone } from '../utils/helpers.js';

const META_KEY = 'text_rpg_meta';

export default class MetaProgression {
  constructor() {
    this.data = this._createInitialData();
  }

  _createInitialData() {
    return {
      totalRuns: 0,
      totalDeaths: 0,
      totalVictories: 0,
      unlocks: {},       // { "unlock_id": true }
      perks: {},         // { "perk_id": { name, description, effect } }
      endingsReached: {},  // { "ending_type": true }
      permanentBonuses: {
        body: 0,
        sense: 0,
        reason: 0,
        bond: 0,
        maxHp: 0,
      },
    };
  }

  // --- 해금 관리 ---
  addUnlock(id) {
    this.data.unlocks[id] = true;
  }

  hasUnlock(id) {
    return !!this.data.unlocks[id];
  }

  // --- 특전 관리 ---
  addPerk(id, perkData) {
    this.data.perks[id] = {
      name: perkData.name || id,
      description: perkData.description || '',
      effect: perkData.effect || null,
    };
  }

  hasPerk(id) {
    return !!this.data.perks[id];
  }

  getPerk(id) {
    return this.data.perks[id] || null;
  }

  getAllPerks() {
    return Object.entries(this.data.perks).map(([id, perk]) => ({ id, ...perk }));
  }

  // --- 영구 스탯 보너스 ---
  addPermanentBonus(stat, value) {
    if (stat in this.data.permanentBonuses) {
      this.data.permanentBonuses[stat] += value;
    }
  }

  // --- 사망/승리 기록 ---
  recordDeath() {
    this.data.totalDeaths++;
  }

  recordVictory() {
    this.data.totalVictories++;
  }

  recordEnding(endingType) {
    this.data.endingsReached[endingType] = true;
  }

  getEndingsReached() {
    return Object.keys(this.data.endingsReached);
  }

  startNewRun() {
    this.data.totalRuns++;
  }

  // --- 새 회차 시작 시 적용할 보너스 계산 ---
  getRunBonuses() {
    return deepClone(this.data.permanentBonuses);
  }

  // --- 저장/로드 (localStorage 별도 키) ---
  save() {
    try {
      localStorage.setItem(META_KEY, JSON.stringify(this.data));
      return true;
    } catch (e) {
      console.error('메타 데이터 저장 실패:', e);
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(META_KEY);
      if (!raw) return false;

      const saved = JSON.parse(raw);
      // 기존 데이터와 병합 (새 필드가 추가됐을 경우 대비)
      this.data = { ...this._createInitialData(), ...saved };
      // permanentBonuses도 병합
      this.data.permanentBonuses = {
        ...this._createInitialData().permanentBonuses,
        ...saved.permanentBonuses,
      };
      return true;
    } catch (e) {
      console.error('메타 데이터 로드 실패:', e);
      return false;
    }
  }

  // --- 직렬화 (외부 참조용) ---
  serialize() {
    return deepClone(this.data);
  }
}
