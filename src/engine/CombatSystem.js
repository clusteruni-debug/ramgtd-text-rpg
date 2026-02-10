/**
 * CombatSystem - 스탯 체크 기반 전투
 * GDD v2: d6 + 스탯 ≥ DC 판정, 선택지 기반, 별도 적 턴 없음
 *
 * 전투 흐름:
 *   start() → presentRound → [플레이어 선택] → resolveChoice()
 *   → 결과 표시 → proceedToNextRound() → 다음 라운드 or 승리/패배
 */
import { rollD6 } from '../utils/helpers.js';

const STAT_NAMES = {
  body: '체력',
  sense: '감각',
  reason: '이성',
  bond: '교감',
};

export default class CombatSystem {
  constructor(stateManager, effectApplier) {
    this.state = stateManager;
    this.applyEffects = effectApplier; // (effects) => void
    this.enemy = null;
    this.rounds = [];
    this.rewards = {};
    this.currentRound = 0;
    this.isActive = false;
    this.log = [];
    this._onUpdate = null;
    this._onEnd = null;
    this._lastResult = null;
  }

  // --- 정적 유틸 ---

  /** DC → 난이도 키 */
  static getDifficultyLabel(dc) {
    if (dc <= 4) return 'easy';
    if (dc <= 6) return 'normal';
    if (dc <= 8) return 'hard';
    if (dc <= 10) return 'extreme';
    return 'impossible';
  }

  /** 성공 확률 (%) 계산 */
  static getSuccessRate(statValue, dc) {
    const needed = dc - statValue;
    if (needed <= 1) return 100;
    if (needed >= 7) return 0;
    return Math.round(((7 - needed) / 6) * 100);
  }

  /**
   * 전투 시작
   * @param {object} enemyData - { name, sprite }
   * @param {Array} rounds - [{ text, choices }]
   * @param {object} rewards - { engrams, effects }
   * @param {function} onUpdate - UI 업데이트 콜백
   * @param {function} onEnd - 전투 종료 콜백
   */
  start(enemyData, rounds, rewards, onUpdate, onEnd) {
    this.enemy = { ...enemyData };
    this.rounds = rounds;
    this.rewards = rewards || {};
    this.currentRound = 0;
    this.isActive = true;
    this.log = [];
    this._onUpdate = onUpdate;
    this._onEnd = onEnd;
    this._lastResult = null;

    this._addLog(`${this.enemy.name}이(가) 나타났다!`);
    this._presentRound();
  }

  // 현재 라운드의 선택지 표시
  _presentRound() {
    if (this.currentRound >= this.rounds.length) {
      this._victory();
      return;
    }

    const round = this.rounds[this.currentRound];
    this._update({
      phase: 'choose',
      enemy: this.enemy,
      roundText: round.text,
      choices: round.choices.map(c => {
        const statValue = this.state.getStat(c.check.stat);
        const dc = c.check.dc;
        return {
          text: c.text,
          stat: c.check.stat,
          statName: STAT_NAMES[c.check.stat] || c.check.stat,
          statValue,
          dc,
          difficulty: CombatSystem.getDifficultyLabel(dc),
          successRate: CombatSystem.getSuccessRate(statValue, dc),
          alignment: c.alignment || 'neutral',
        };
      }),
      log: [...this.log],
      isActive: true,
      roundIndex: this.currentRound,
      totalRounds: this.rounds.length,
    });
  }

  /**
   * 플레이어가 선택지를 선택했을 때
   * @param {number} choiceIndex
   */
  resolveChoice(choiceIndex) {
    if (!this.isActive) return;

    const round = this.rounds[this.currentRound];
    const choice = round.choices[choiceIndex];
    if (!choice) return;

    // d6 판정
    const roll = rollD6();
    const statValue = this.state.getStat(choice.check.stat);
    const total = roll + statValue;
    const dc = choice.check.dc;
    const success = total >= dc;
    const statName = STAT_NAMES[choice.check.stat] || choice.check.stat;

    // 판정 로그
    this._addLog(`🎲 ${statName} 판정: d6(${roll}) + ${statValue} = ${total} vs DC ${dc}`);
    this._addLog(success ? '✅ 성공!' : '❌ 실패...');

    // 카르마 변동
    if (choice.karmaShift && choice.karmaShift !== 0) {
      this.state.modifyKarma(choice.karmaShift);
      const direction = choice.karmaShift > 0 ? '명(Light)' : '암(Dark)';
      this._addLog(`카르마 ${direction} ${choice.karmaShift > 0 ? '+' : ''}${choice.karmaShift}`);
    }

    // 결과
    const result = success ? choice.success : choice.failure;
    this._addLog(result.text);

    // 효과 적용 (SceneManager.applyEffects 위임)
    if (result.effects && result.effects.length > 0) {
      this.applyEffects(result.effects);
    }

    this._lastResult = {
      roll, statValue, statName, total, dc, success,
      resultText: result.text,
      effects: result.effects || [],
      endCombat: result.endCombat || false,
      alignment: choice.alignment || 'neutral',
      choiceText: choice.text,
    };

    // UI 업데이트
    this._update({
      phase: 'result',
      enemy: this.enemy,
      ...this._lastResult,
      log: [...this.log],
      isActive: true,
      roundIndex: this.currentRound,
      totalRounds: this.rounds.length,
    });
  }

  /**
   * 결과 확인 후 다음으로 진행
   * "계속" 버튼 클릭 시 호출
   */
  proceedToNextRound() {
    if (!this._lastResult) return;

    // endCombat 플래그 → 승리 처리
    if (this._lastResult.endCombat) {
      this._victory();
      return;
    }

    // HP 체크 (효과 적용 후)
    if (this.state.getStat('hp') <= 0) {
      this._defeat();
      return;
    }

    this.currentRound++;
    this._lastResult = null;
    this._presentRound();
  }

  _victory() {
    this._addLog(`전투에서 승리했다!`);

    // 보상 지급
    if (this.rewards.engrams) {
      this.state.addEngrams(this.rewards.engrams);
      this._addLog(`엔그램 +${this.rewards.engrams}`);
    }
    if (this.rewards.effects) {
      this.applyEffects(this.rewards.effects);
    }

    this.isActive = false;
    this._update({
      phase: 'victory',
      enemy: this.enemy,
      rewards: this.rewards,
      log: [...this.log],
      isActive: false,
    });
    if (this._onEnd) this._onEnd({ victory: true, enemy: this.enemy });
  }

  _defeat() {
    this._addLog('쓰러졌다...');
    this.isActive = false;
    this._update({
      phase: 'defeat',
      enemy: this.enemy,
      log: [...this.log],
      isActive: false,
    });
    if (this._onEnd) this._onEnd({ victory: false });
  }

  _addLog(message) {
    this.log.push(message);
  }

  _update(data) {
    // 플레이어 HP 정보 포함
    data.playerHp = this.state.getStat('hp');
    data.playerMaxHp = this.state.getStat('maxHp');
    if (this._onUpdate) this._onUpdate(data);
  }
}
