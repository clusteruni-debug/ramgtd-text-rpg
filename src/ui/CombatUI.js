/**
 * CombatUI - 스탯 체크 기반 전투 UI
 * GDD v2: 상황 텍스트 + 선택지(스탯체크) + 주사위 판정 결과
 */
import { createElement } from '../utils/helpers.js';

const ALIGNMENT_LABELS = {
  light: '명',
  dark: '암',
  neutral: '',
};

export default class CombatUI {
  constructor(container) {
    this.container = container;
    this._onChoice = null;
    this._onProceed = null;
    this._keyHandler = null;
    this._continueKeyHandler = null;

    this._build();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'combat-ui');
    this.el.innerHTML = `
      <div class="combat-enemy">
        <div class="enemy-sprite"></div>
        <div class="enemy-name"></div>
      </div>
      <div class="combat-body">
        <div class="combat-round-text"></div>
        <div class="combat-choices"></div>
        <div class="combat-result hidden"></div>
      </div>
      <div class="combat-log"></div>
    `;

    this.enemySprite = this.el.querySelector('.enemy-sprite');
    this.enemyNameEl = this.el.querySelector('.enemy-name');
    this.roundTextEl = this.el.querySelector('.combat-round-text');
    this.choicesEl = this.el.querySelector('.combat-choices');
    this.resultEl = this.el.querySelector('.combat-result');
    this.logEl = this.el.querySelector('.combat-log');

    this.container.appendChild(this.el);
  }

  // CombatSystem onUpdate 콜백에서 호출
  updateCombat(data) {
    // 적 정보
    if (data.enemy) {
      this.enemyNameEl.textContent = data.enemy.name;
      this.enemySprite.className = `enemy-sprite enemy-${data.enemy.sprite || 'default'}`;
    }

    // 로그
    this._updateLog(data.log || []);

    switch (data.phase) {
      case 'choose': this._showChoosePhase(data); break;
      case 'result': this._showResultPhase(data); break;
      case 'victory': this._showEndPhase(data, true); break;
      case 'defeat': this._showEndPhase(data, false); break;
    }
  }

  _showChoosePhase(data) {
    this.roundTextEl.textContent = data.roundText;
    this.roundTextEl.classList.remove('hidden');
    this.resultEl.classList.add('hidden');

    // 선택지 생성
    this.choicesEl.innerHTML = '';
    this.choicesEl.classList.remove('hidden');

    data.choices.forEach((choice, index) => {
      const alignClass = choice.alignment !== 'neutral' ? `choice-${choice.alignment}` : '';
      const btn = createElement('button', `combat-choice-btn ${alignClass}`);

      const labelParts = [];
      if (ALIGNMENT_LABELS[choice.alignment]) {
        labelParts.push(ALIGNMENT_LABELS[choice.alignment]);
      }
      labelParts.push(`${choice.statName} DC${choice.dc}`);

      btn.innerHTML = `
        <span class="choice-key">${index + 1}</span>
        <span class="choice-label">[${labelParts.join(' ')}]</span>
        <span class="choice-text">${choice.text}</span>
      `;

      btn.addEventListener('click', () => {
        this._removeKeyHandler();
        if (this._onChoice) this._onChoice(index);
      });

      this.choicesEl.appendChild(btn);
    });

    // 키보드 단축키 (1~N)
    this._removeKeyHandler();
    this._keyHandler = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= data.choices.length) {
        this._removeKeyHandler();
        if (this._onChoice) this._onChoice(num - 1);
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  _showResultPhase(data) {
    this._removeKeyHandler();
    this.choicesEl.classList.add('hidden');
    this.roundTextEl.classList.add('hidden');
    this.resultEl.classList.remove('hidden');

    const successClass = data.success ? 'result-success' : 'result-failure';
    const icon = data.success ? '✅' : '❌';

    // HP 변동 표시
    let hpChangeHtml = '';
    if (data.effects) {
      data.effects.forEach(effect => {
        if (effect.type === 'modifyStat' && effect.stat === 'hp' && effect.value !== 0) {
          const sign = effect.value > 0 ? '+' : '';
          const cls = effect.value < 0 ? 'hp-loss' : 'hp-gain';
          hpChangeHtml += `<div class="result-hp-change ${cls}">HP ${sign}${effect.value}</div>`;
        }
      });
    }

    this.resultEl.innerHTML = `
      <div class="result-dice ${successClass}">
        <div class="dice-roll">
          <span class="dice-icon">🎲</span>
          <span class="dice-formula">d6(<strong>${data.roll}</strong>) + ${data.statName}(<strong>${data.statValue}</strong>) = <strong>${data.total}</strong></span>
          <span class="dice-vs">vs DC <strong>${data.dc}</strong></span>
        </div>
        <div class="dice-verdict">${icon} ${data.success ? '성공!' : '실패...'}</div>
      </div>
      <div class="result-narrative">${data.resultText}</div>
      ${hpChangeHtml}
      <button class="result-continue-btn">계속 ▶</button>
    `;

    // 계속 버튼
    this.resultEl.querySelector('.result-continue-btn').addEventListener('click', () => {
      this._removeContinueKeyHandler();
      if (this._onProceed) this._onProceed();
    });

    // Enter/Space로 계속
    this._removeContinueKeyHandler();
    this._continueKeyHandler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._removeContinueKeyHandler();
        if (this._onProceed) this._onProceed();
      }
    };
    document.addEventListener('keydown', this._continueKeyHandler);
  }

  _showEndPhase(data, isVictory) {
    this._removeKeyHandler();
    this._removeContinueKeyHandler();

    this.choicesEl.classList.add('hidden');
    this.roundTextEl.classList.add('hidden');
    this.resultEl.classList.remove('hidden');

    if (isVictory) {
      let rewardsHtml = '';
      if (data.rewards && data.rewards.engrams) {
        rewardsHtml = `<div class="result-reward">엔그램 +${data.rewards.engrams}</div>`;
      }
      this.resultEl.innerHTML = `
        <div class="combat-end-banner victory">
          <div class="end-text">승리!</div>
          ${rewardsHtml}
        </div>
      `;
    } else {
      this.resultEl.innerHTML = `
        <div class="combat-end-banner defeat">
          <div class="end-text">쓰러졌다...</div>
        </div>
      `;
    }
  }

  _updateLog(log) {
    this.logEl.innerHTML = '';
    const recentLog = log.slice(-5);
    recentLog.forEach(msg => {
      const line = createElement('div', 'combat-log-line', msg);
      this.logEl.appendChild(line);
    });
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  _removeKeyHandler() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }

  _removeContinueKeyHandler() {
    if (this._continueKeyHandler) {
      document.removeEventListener('keydown', this._continueKeyHandler);
      this._continueKeyHandler = null;
    }
  }

  onChoice(callback) { this._onChoice = callback; }
  onProceed(callback) { this._onProceed = callback; }

  show() { this.el.classList.remove('hidden'); }

  hide() {
    this._removeKeyHandler();
    this._removeContinueKeyHandler();
    this.el.classList.add('hidden');
  }
}
