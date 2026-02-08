/**
 * SceneManager - 씬 로드, 조건 평가, 효과 적용
 * JSON 데이터에서 씬을 읽고 게임 흐름을 제어
 */
export default class SceneManager {
  constructor(stateManager) {
    this.state = stateManager;
    this.scenes = {};         // id → scene 데이터
    this.characters = {};     // id → 캐릭터 데이터
    this.items = {};          // id → 아이템 데이터
    this.enemies = {};        // id → 적 데이터
    this.config = {};         // 게임 설정
  }

  // --- 데이터 로드 ---
  loadScenes(sceneData) {
    // 배열이면 id 기반 맵으로 변환
    if (Array.isArray(sceneData)) {
      sceneData.forEach(s => { this.scenes[s.id] = s; });
    } else {
      Object.assign(this.scenes, sceneData);
    }
  }

  loadCharacters(data) {
    if (Array.isArray(data)) {
      data.forEach(c => { this.characters[c.id] = c; });
    } else {
      Object.assign(this.characters, data);
    }
  }

  loadItems(data) {
    if (Array.isArray(data)) {
      data.forEach(i => { this.items[i.id] = i; });
    } else {
      Object.assign(this.items, data);
    }
  }

  loadEnemies(data) {
    if (Array.isArray(data)) {
      data.forEach(e => { this.enemies[e.id] = e; });
    } else {
      Object.assign(this.enemies, data);
    }
  }

  loadConfig(config) {
    this.config = config;
  }

  // --- 씬 가져오기 ---
  getScene(sceneId) {
    return this.scenes[sceneId] || null;
  }

  getCharacter(charId) {
    return this.characters[charId] || null;
  }

  getItemData(itemId) {
    return this.items[itemId] || null;
  }

  getEnemy(enemyId) {
    return this.enemies[enemyId] || null;
  }

  // --- 조건 평가 ---
  evaluateCondition(condition) {
    switch (condition.type) {
      case 'hasFlag':
        return this.state.hasFlag(condition.flag) === (condition.value !== false);

      case 'hasItem':
        return this.state.hasItem(condition.item);

      case 'statGreaterThan':
        return this.state.getStat(condition.stat) > condition.value;

      case 'statLessThan':
        return this.state.getStat(condition.stat) < condition.value;

      case 'goldGreaterThan':
        return this.state.state.gold > condition.value;

      default:
        console.warn(`알 수 없는 조건 타입: ${condition.type}`);
        return true;
    }
  }

  // 여러 조건을 모두 평가 (AND)
  evaluateConditions(conditions) {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every(c => this.evaluateCondition(c));
  }

  // --- 효과 적용 ---
  applyEffect(effect) {
    switch (effect.type) {
      case 'setFlag':
        this.state.setFlag(effect.flag, effect.value ?? true);
        break;

      case 'addItem': {
        const itemData = this.items[effect.item];
        if (itemData) {
          this.state.addItem({ ...itemData, quantity: effect.quantity || 1 });
        }
        break;
      }

      case 'removeItem':
        this.state.removeItem(effect.item, effect.quantity || 1);
        break;

      case 'modifyStat':
        this.state.modifyStat(effect.stat, effect.value);
        break;

      case 'setStat':
        this.state.setStat(effect.stat, effect.value);
        break;

      case 'addExp':
        this.state.addExp(effect.value);
        break;

      case 'addGold':
        this.state.addGold(effect.value);
        break;

      case 'heal':
        this.state.modifyStat('hp', effect.value);
        break;

      default:
        console.warn(`알 수 없는 효과 타입: ${effect.type}`);
    }
  }

  // 여러 효과 적용
  applyEffects(effects) {
    if (!effects || effects.length === 0) return;
    effects.forEach(e => this.applyEffect(e));
  }

  // --- 선택지 필터링 (조건 충족 여부) ---
  getAvailableChoices(scene) {
    if (!scene.choices) return [];
    return scene.choices.map(choice => ({
      ...choice,
      available: this.evaluateConditions(choice.conditions),
    }));
  }
}
