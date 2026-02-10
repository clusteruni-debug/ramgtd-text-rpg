/**
 * SceneManager - 씬 로드, 조건 평가, 효과 적용
 * GDD v2: 카르마/기억/엔그램/동료 조건+효과 추가
 */
export default class SceneManager {
  constructor(stateManager, metaProgression = null) {
    this.state = stateManager;
    this.meta = metaProgression;
    this.scenes = {};
    this.characters = {};
    this.items = {};
    this.enemies = {};
    this.config = {};
  }

  setMetaProgression(meta) {
    this.meta = meta;
  }

  // --- 데이터 로드 ---
  loadScenes(sceneData) {
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
      // 스토리
      case 'hasFlag':
        return this.state.hasFlag(condition.flag) === (condition.value !== false);

      case 'hasItem':
        return this.state.hasItem(condition.item);

      // 스탯
      case 'statGreaterThan':
        return this.state.getStat(condition.stat) > condition.value;

      case 'statLessThan':
        return this.state.getStat(condition.stat) < condition.value;

      // 카르마
      case 'karmaGreaterThan':
        return this.state.getStat('karma') > condition.value;

      case 'karmaLessThan':
        return this.state.getStat('karma') < condition.value;

      // 기억
      case 'realMemoryGreaterThan':
        return this.state.getRealMemoryCount() > condition.value;

      // 엔그램
      case 'engramGreaterThan':
        return this.state.getStat('engrams') > condition.value;

      // 동료
      case 'hasCompanion':
        return this.state.isCompanionAlive(condition.companion);

      case 'companionAlive':
        return this.state.isCompanionAlive(condition.companion);

      case 'companionTrustGreaterThan':
        return this.state.getCompanionTrust(condition.companion) > condition.value;

      // 로그라이크 메타 조건
      case 'runGreaterThan':
        return this.meta && this.meta.data.totalRuns > condition.value;

      case 'hasUnlock':
        return this.meta && this.meta.hasUnlock(condition.unlock);

      case 'hasPerk':
        return this.meta && this.meta.hasPerk(condition.perk);

      case 'deathCountGreaterThan':
        return this.meta && this.meta.data.totalDeaths > condition.value;

      default:
        console.warn(`알 수 없는 조건 타입: ${condition.type}`);
        return true;
    }
  }

  evaluateConditions(conditions) {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every(c => this.evaluateCondition(c));
  }

  // --- 효과 적용 ---
  applyEffect(effect) {
    switch (effect.type) {
      // 플래그
      case 'setFlag':
        this.state.setFlag(effect.flag, effect.value ?? true);
        break;

      // 아이템
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

      // 스탯
      case 'modifyStat':
        this.state.modifyStat(effect.stat, effect.value);
        break;

      case 'setStat':
        this.state.setStat(effect.stat, effect.value);
        break;

      case 'heal':
        this.state.modifyStat('hp', effect.value);
        break;

      // 카르마
      case 'modifyKarma':
        this.state.modifyKarma(effect.value);
        break;

      // 엔그램
      case 'addEngrams':
        this.state.addEngrams(effect.value);
        break;

      // 기억
      case 'loseMemory':
        this.state.loseRealMemory();
        break;

      case 'addAbyssMemory':
        this.state.addAbyssMemory({
          id: effect.id,
          label: effect.label,
          weight: effect.weight || 1,
          source: effect.source || '',
        });
        break;

      // 동료
      case 'addCompanion':
        this.state.addCompanion({
          id: effect.companion,
          name: effect.name,
          alive: true,
          trustLevel: effect.trustLevel || 0,
          skills: effect.skills || [],
        });
        break;

      // 동료 관계
      case 'modifyCompanionTrust':
        this.state.modifyCompanionTrust(effect.companion, effect.value);
        break;

      case 'killCompanion':
        this.state.killCompanion(effect.companion);
        break;

      // HP 전량 회복
      case 'fullHeal':
        this.state.setStat('hp', this.state.getStat('maxHp'));
        break;

      // 로그라이크 메타 효과
      case 'unlock':
        if (this.meta) {
          this.meta.addUnlock(effect.unlock);
          this.meta.save();
        }
        break;

      case 'addPerk':
        if (this.meta) {
          this.meta.addPerk(effect.perk, {
            name: effect.name || effect.perk,
            description: effect.description || '',
            effect: effect.effect || null,
          });
          this.meta.save();
        }
        break;

      case 'addPermanentBonus':
        if (this.meta) {
          this.meta.addPermanentBonus(effect.stat, effect.value);
          this.meta.save();
        }
        break;

      default:
        console.warn(`알 수 없는 효과 타입: ${effect.type}`);
    }
  }

  applyEffects(effects) {
    if (!effects || effects.length === 0) return;
    effects.forEach(e => this.applyEffect(e));
  }

  // --- 선택지 필터링 ---
  getAvailableChoices(scene) {
    if (!scene.choices) return [];
    return scene.choices.map(choice => ({
      ...choice,
      available: this.evaluateConditions(choice.conditions),
    }));
  }
}
