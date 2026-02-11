/**
 * CombatUI - 스탯 체크 기반 전투 UI
 * GDD v2: 상황 텍스트 + 선택지(스탯체크) + 주사위 판정 결과
 * v0.5: 주사위 애니메이션, 라운드 표시, HP 표시, 난이도/확률 표시
 */
import { createElement } from '../utils/helpers.js';

const TIER_LABELS = {
  minion: '하급',
  elite: '정예',
  boss: '보스',
};

const ALIGNMENT_LABELS = {
  light: '명',
  dark: '암',
  neutral: '',
};

const DIFFICULTY_LABELS = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
  extreme: '극한',
  impossible: '불가능',
};

export default class CombatUI {
  constructor(container) {
    this.container = container;
    this._onChoice = null;
    this._onProceed = null;
    this._keyHandler = null;
    this._continueKeyHandler = null;
    this._diceInterval = null;

    this._build();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'combat-ui');
    this.el.innerHTML = `
      <div class="combat-header">
        <div class="combat-round-indicator hidden"></div>
        <div class="combat-hp-mini">
          <div class="combat-hp-mini-fill"></div>
          <span class="combat-hp-mini-text"></span>
        </div>
      </div>
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

    this.roundIndicatorEl = this.el.querySelector('.combat-round-indicator');
    this.hpMiniFillEl = this.el.querySelector('.combat-hp-mini-fill');
    this.hpMiniTextEl = this.el.querySelector('.combat-hp-mini-text');
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
    if (data.enemy) {
      // 적 이름 + tier 배지 표시
      const tierLabel = TIER_LABELS[data.enemy.tier];
      if (tierLabel) {
        this.enemyNameEl.innerHTML = `${data.enemy.name} <span class="enemy-tier threat-${data.enemy.tier}">${tierLabel}</span>`;
      } else {
        this.enemyNameEl.textContent = data.enemy.name;
      }
      this.enemySprite.className = `enemy-sprite enemy-${data.enemy.sprite || 'default'}`;
    }

    this._updatePlayerHp(data.playerHp, data.playerMaxHp);
    this._updateLog(data.log || []);

    switch (data.phase) {
      case 'choose': this._showChoosePhase(data); break;
      case 'result': this._showResultPhase(data); break;
      case 'victory': this._showEndPhase(data, true); break;
      case 'defeat': this._showEndPhase(data, false); break;
    }
  }

  _updatePlayerHp(hp, maxHp) {
    if (hp === undefined || maxHp === undefined) return;
    const pct = maxHp > 0 ? (hp / maxHp) * 100 : 0;
    this.hpMiniFillEl.style.width = `${pct}%`;
    this.hpMiniTextEl.textContent = `HP ${hp}/${maxHp}`;

    this.hpMiniFillEl.classList.remove('hp-critical', 'hp-low');
    if (pct <= 25) {
      this.hpMiniFillEl.classList.add('hp-critical');
    } else if (pct <= 50) {
      this.hpMiniFillEl.classList.add('hp-low');
    }
  }

  _showChoosePhase(data) {
    // 라운드 표시 (멀티 라운드일 때만)
    if (data.totalRounds > 1) {
      this.roundIndicatorEl.textContent = `라운드 ${data.roundIndex + 1} / ${data.totalRounds}`;
      this.roundIndicatorEl.classList.remove('hidden');
    } else {
      this.roundIndicatorEl.classList.add('hidden');
    }

    this.roundTextEl.textContent = data.roundText;
    this.roundTextEl.classList.remove('hidden');
    this.resultEl.classList.add('hidden');

    // 선택지 생성
    this.choicesEl.innerHTML = '';
    this.choicesEl.classList.remove('hidden');

    data.choices.forEach((choice, index) => {
      const alignClass = choice.alignment !== 'neutral' ? `choice-${choice.alignment}` : '';
      const diffClass = `difficulty-${choice.difficulty}`;
      const btn = createElement('button', `combat-choice-btn ${alignClass}`);

      const labelParts = [];
      if (ALIGNMENT_LABELS[choice.alignment]) {
        labelParts.push(ALIGNMENT_LABELS[choice.alignment]);
      }
      labelParts.push(`${choice.statName} DC${choice.dc}`);

      btn.innerHTML = `
        <span class="choice-key">${index + 1}</span>
        <span class="choice-info">
          <span class="choice-label">[${labelParts.join(' ')}]</span>
          <span class="choice-difficulty ${diffClass}">${DIFFICULTY_LABELS[choice.difficulty] || ''}</span>
          <span class="choice-rate ${diffClass}">${choice.successRate}%</span>
        </span>
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
    this._clearDiceInterval();
    this.choicesEl.classList.add('hidden');
    this.roundTextEl.classList.add('hidden');
    this.resultEl.classList.remove('hidden');

    // Phase 1: 주사위 굴림 애니메이션
    this.resultEl.innerHTML = `
      <div class="dice-animation">
        <div class="dice-rolling-container">
          <span class="dice-face-large">🎲</span>
          <span class="dice-rolling-number">?</span>
        </div>
        <div class="dice-check-info">
          ${data.statName} <strong>${data.statValue}</strong>
          <span class="dice-vs-preview">vs DC ${data.dc}</span>
        </div>
      </div>
    `;

    const numEl = this.resultEl.querySelector('.dice-rolling-number');
    let count = 0;

    this._diceInterval = setInterval(() => {
      numEl.textContent = Math.floor(Math.random() * 6) + 1;
      count++;
      if (count >= 10) {
        this._clearDiceInterval();
        numEl.textContent = data.roll;
        numEl.classList.add('dice-settled');

        // Phase 2: 전체 결과 표시 (0.5초 후)
        setTimeout(() => this._showFullResult(data), 500);
      }
    }, 70);
  }

  _showFullResult(data) {
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

    // 피해 시 화면 흔들림
    const tookDamage = data.effects && data.effects.some(
      e => e.type === 'modifyStat' && e.stat === 'hp' && e.value < 0
    );
    if (tookDamage) {
      this.el.classList.add('combat-shake');
      setTimeout(() => this.el.classList.remove('combat-shake'), 400);
    }

    // 성공 시 적 피격 플래시
    if (data.success) {
      this.enemySprite.classList.add('enemy-hit');
      setTimeout(() => this.enemySprite.classList.remove('enemy-hit'), 400);
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
    this._clearDiceInterval();

    this.choicesEl.classList.add('hidden');
    this.roundTextEl.classList.add('hidden');
    this.resultEl.classList.remove('hidden');

    if (isVictory) {
      let rewardsHtml = '';
      if (data.rewards && data.rewards.engrams) {
        rewardsHtml = `<div class="result-reward">💎 엔그램 +${data.rewards.engrams}</div>`;
      }
      this.resultEl.innerHTML = `
        <div class="combat-end-banner victory">
          <div class="end-icon">⚔️</div>
          <div class="end-text">승리!</div>
          ${rewardsHtml}
        </div>
      `;
    } else {
      this.resultEl.innerHTML = `
        <div class="combat-end-banner defeat">
          <div class="end-icon">💀</div>
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

  _clearDiceInterval() {
    if (this._diceInterval) {
      clearInterval(this._diceInterval);
      this._diceInterval = null;
    }
  }

  onChoice(callback) { this._onChoice = callback; }
  onProceed(callback) { this._onProceed = callback; }

  show() { this.el.classList.remove('hidden'); }

  hide() {
    this._removeKeyHandler();
    this._removeContinueKeyHandler();
    this._clearDiceInterval();
    this.el.classList.add('hidden');
  }
}
