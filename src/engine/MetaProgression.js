/**
 * MetaProgression - 영구 진행도 관리 (로그라이크 메타 프로그레션)
 * GDD v2: Body/Sense/Reason/Bond 기반 영구 보너스
 */
import { deepClone } from '../utils/helpers.js';

const META_KEY = 'text_rpg_meta';

/** 엔딩별 영구 보상 정의 — 최초 도달 시 1회만 부여 */
const ENDING_REWARDS = {
  bittersweet: {
    perk: { id: 'memory_of_return', name: '귀환의 기억', description: '원점으로 돌아간 자의 지혜' },
    bonus: { stat: 'reason', value: 1 },
  },
  hopeful: {
    perk: { id: 'strangers_courage', name: '이방인의 용기', description: '새로운 세계에서 살아남은 용기' },
    bonus: { stat: 'bond', value: 1 },
  },
  tragic: {
    perk: { id: 'sacrifice_mark', name: '헌신의 흔적', description: '모든 것을 바친 자의 강인함' },
    bonus: { stat: 'maxHp', value: 5 },
  },
  peaceful: {
    perk: { id: 'guides_wisdom', name: '안내자의 지혜', description: '심연을 있는 그대로 받아들인 깨달음' },
    bonus: { stat: 'sense', value: 1 },
  },
};

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

  hasReachedEnding(endingType) {
    return !!this.data.endingsReached[endingType];
  }

  /** 엔딩 보상 적용 — 최초 도달 시만 부여 */
  applyEndingRewards(endingType) {
    const reward = ENDING_REWARDS[endingType];
    if (!reward) return false;
    // 이미 보상 받았으면 스킵
    if (this.hasPerk(reward.perk.id)) return false;

    this.addPerk(reward.perk.id, {
      name: reward.perk.name,
      description: reward.perk.description,
    });
    if (reward.bonus) {
      this.addPermanentBonus(reward.bonus.stat, reward.bonus.value);
    }
    return true;
  }

  /** 엔딩 보상 정보 (타이틀 표시용) */
  static getEndingRewardInfo() {
    return Object.entries(ENDING_REWARDS).map(([type, reward]) => ({
      endingType: type,
      perkId: reward.perk.id,
      perkName: reward.perk.name,
      perkDescription: reward.perk.description,
      bonus: reward.bonus,
    }));
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
