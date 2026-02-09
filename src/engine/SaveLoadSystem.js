/**
 * SaveLoadSystem - localStorage 기반 세이브/로드
 * 3슬롯 + 오토세이브
 */
const SAVE_PREFIX = 'text_rpg_save_';
const AUTO_SAVE_KEY = 'text_rpg_autosave';
const MAX_SLOTS = 3;

export default class SaveLoadSystem {
  constructor(stateManager, metaProgression = null) {
    this.state = stateManager;
    this.meta = metaProgression;
  }

  // 메타 프로그레션 참조 설정 (지연 주입용)
  setMetaProgression(meta) {
    this.meta = meta;
  }

  // --- 세이브 ---
  save(slot) {
    if (slot < 0 || slot >= MAX_SLOTS) return false;

    const data = {
      state: this.state.serialize(),
      runNumber: this.meta ? this.meta.data.totalRuns : 1,
      timestamp: Date.now(),
      version: 1,
    };

    try {
      localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('세이브 실패:', e);
      return false;
    }
  }

  // --- 로드 ---
  load(slot) {
    if (slot < 0 || slot >= MAX_SLOTS) return false;

    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slot);
      if (!raw) return false;

      const data = JSON.parse(raw);
      this.state.deserialize(data.state);
      return true;
    } catch (e) {
      console.error('로드 실패:', e);
      return false;
    }
  }

  // --- 오토세이브 ---
  autoSave() {
    const data = {
      state: this.state.serialize(),
      runNumber: this.meta ? this.meta.data.totalRuns : 1,
      timestamp: Date.now(),
      version: 1,
    };

    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('오토세이브 실패:', e);
      return false;
    }
  }

  loadAutoSave() {
    try {
      const raw = localStorage.getItem(AUTO_SAVE_KEY);
      if (!raw) return false;

      const data = JSON.parse(raw);
      this.state.deserialize(data.state);
      return true;
    } catch (e) {
      console.error('오토세이브 로드 실패:', e);
      return false;
    }
  }

  // --- 슬롯 정보 ---
  getSlotInfo(slot) {
    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slot);
      if (!raw) return null;

      const data = JSON.parse(raw);
      const s = data.state.player;
      return {
        slot,
        timestamp: data.timestamp,
        date: new Date(data.timestamp).toLocaleString('ko-KR'),
        playerName: s.name,
        memories: data.state.realMemories ? data.state.realMemories.length : '?',
        scene: data.state.currentScene,
      };
    } catch {
      return null;
    }
  }

  getAllSlotInfo() {
    const slots = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      slots.push(this.getSlotInfo(i));
    }
    return slots;
  }

  hasAutoSave() {
    return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  }

  getAutoSaveInfo() {
    try {
      const raw = localStorage.getItem(AUTO_SAVE_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      return {
        timestamp: data.timestamp,
        date: new Date(data.timestamp).toLocaleString('ko-KR'),
        playerName: data.state.player.name,
        memories: data.state.realMemories ? data.state.realMemories.length : '?',
      };
    } catch {
      return null;
    }
  }

  // --- 삭제 ---
  deleteSlot(slot) {
    localStorage.removeItem(SAVE_PREFIX + slot);
  }

  deleteAutoSave() {
    localStorage.removeItem(AUTO_SAVE_KEY);
  }

  // --- 메타 데이터 세이브/로드 ---
  saveMeta() {
    if (this.meta) return this.meta.save();
    return false;
  }

  loadMeta() {
    if (this.meta) return this.meta.load();
    return false;
  }

  static get MAX_SLOTS() {
    return MAX_SLOTS;
  }
}
