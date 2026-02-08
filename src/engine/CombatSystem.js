/**
 * CombatSystem - 턴제 전투
 * 공격/스킬/아이템/도망, 데미지 계산, 적 AI
 */
import { randomInt, clamp } from '../utils/helpers.js';

export default class CombatSystem {
  constructor(stateManager) {
    this.state = stateManager;
    this.enemy = null;
    this.isActive = false;
    this.turnCount = 0;
    this.log = [];
    this._onUpdate = null;    // UI 업데이트 콜백
    this._onEnd = null;       // 전투 종료 콜백
  }

  /**
   * 전투 시작
   * @param {object} enemyData - 적 데이터 (deepClone 필요)
   * @param {function} onUpdate - 턴마다 호출
   * @param {function} onEnd - 전투 종료 시 호출 ({ victory: boolean })
   */
  start(enemyData, onUpdate, onEnd) {
    this.enemy = {
      ...enemyData,
      hp: enemyData.hp,
      maxHp: enemyData.hp,
    };
    this.isActive = true;
    this.turnCount = 0;
    this.log = [];
    this._onUpdate = onUpdate;
    this._onEnd = onEnd;

    this._addLog(`${this.enemy.name}이(가) 나타났다!`);
    this._update();
  }

  // --- 플레이어 액션 ---
  playerAttack() {
    if (!this.isActive) return;

    const player = this.state.state.player;
    const damage = this._calculateDamage(player.attack, this.enemy.defense);
    this.enemy.hp = clamp(this.enemy.hp - damage, 0, this.enemy.maxHp);

    this._addLog(`${player.name}의 공격! ${this.enemy.name}에게 ${damage} 데미지!`);

    if (this.enemy.hp <= 0) {
      this._victory();
      return;
    }

    this._enemyTurn();
  }

  playerSkill() {
    if (!this.isActive) return;

    const player = this.state.state.player;
    const mpCost = 10;

    if (player.mp < mpCost) {
      this._addLog('MP가 부족하다!');
      this._update();
      return;
    }

    this.state.modifyStat('mp', -mpCost);
    // 스킬: 공격력 1.5배
    const damage = this._calculateDamage(Math.floor(player.attack * 1.5), this.enemy.defense);
    this.enemy.hp = clamp(this.enemy.hp - damage, 0, this.enemy.maxHp);

    this._addLog(`${player.name}의 강타! ${this.enemy.name}에게 ${damage} 데미지! (MP -${mpCost})`);

    if (this.enemy.hp <= 0) {
      this._victory();
      return;
    }

    this._enemyTurn();
  }

  playerUseItem(itemId) {
    if (!this.isActive) return;

    const item = this.state.getItem(itemId);
    if (!item) {
      this._addLog('아이템이 없다!');
      this._update();
      return;
    }

    // 아이템 효과 적용
    if (item.effect) {
      if (item.effect.type === 'heal') {
        this.state.modifyStat('hp', item.effect.value);
        this._addLog(`${item.name} 사용! HP가 ${item.effect.value} 회복!`);
      } else if (item.effect.type === 'mpRestore') {
        this.state.modifyStat('mp', item.effect.value);
        this._addLog(`${item.name} 사용! MP가 ${item.effect.value} 회복!`);
      } else if (item.effect.type === 'damage') {
        const damage = item.effect.value;
        this.enemy.hp = clamp(this.enemy.hp - damage, 0, this.enemy.maxHp);
        this._addLog(`${item.name} 사용! ${this.enemy.name}에게 ${damage} 데미지!`);
      }
    }

    this.state.removeItem(itemId, 1);

    if (this.enemy.hp <= 0) {
      this._victory();
      return;
    }

    this._enemyTurn();
  }

  playerFlee() {
    if (!this.isActive) return;

    const player = this.state.state.player;
    // 도망 확률: 플레이어 속도 기반 (40~80%)
    const chance = clamp(40 + (player.speed - this.enemy.speed) * 5, 20, 90);
    const roll = randomInt(1, 100);

    if (roll <= chance) {
      this._addLog('도망에 성공했다!');
      this.isActive = false;
      this._update();
      if (this._onEnd) this._onEnd({ victory: false, fled: true });
    } else {
      this._addLog('도망에 실패했다!');
      this._enemyTurn();
    }
  }

  // --- 적 턴 ---
  _enemyTurn() {
    this.turnCount++;
    const damage = this._calculateDamage(this.enemy.attack, this.state.state.player.defense);
    this.state.modifyStat('hp', -damage);

    this._addLog(`${this.enemy.name}의 공격! ${damage} 데미지를 받았다!`);

    if (this.state.state.player.hp <= 0) {
      this._defeat();
      return;
    }

    this._update();
  }

  // --- 데미지 계산 ---
  _calculateDamage(attack, defense) {
    // 기본 공식: 공격력 - 방어력/2 + 랜덤(-2~2)
    const base = Math.max(1, attack - Math.floor(defense / 2));
    const variation = randomInt(-2, 2);
    return Math.max(1, base + variation);
  }

  // --- 전투 결과 ---
  _victory() {
    this._addLog(`${this.enemy.name}을(를) 쓰러뜨렸다!`);

    // 보상 지급
    if (this.enemy.expReward) {
      this.state.addExp(this.enemy.expReward);
      this._addLog(`경험치 ${this.enemy.expReward} 획득!`);
    }
    if (this.enemy.goldReward) {
      this.state.addGold(this.enemy.goldReward);
      this._addLog(`골드 ${this.enemy.goldReward} 획득!`);
    }
    if (this.enemy.dropItem) {
      this._addLog(`${this.enemy.dropItem.name}을(를) 얻었다!`);
    }

    this.isActive = false;
    this._update();
    if (this._onEnd) this._onEnd({ victory: true, enemy: this.enemy });
  }

  _defeat() {
    this._addLog('쓰러졌다...');
    this.isActive = false;
    this._update();
    if (this._onEnd) this._onEnd({ victory: false, fled: false });
  }

  // --- 유틸 ---
  _addLog(message) {
    this.log.push(message);
  }

  _update() {
    if (this._onUpdate) {
      this._onUpdate({
        enemy: this.enemy,
        log: [...this.log],
        isActive: this.isActive,
        turnCount: this.turnCount,
      });
    }
  }

  // 전투용 아이템 목록 (type: 'consumable')
  getUsableItems() {
    return this.state.state.inventory.filter(i => i.type === 'consumable');
  }
}
