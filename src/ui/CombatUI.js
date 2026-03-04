/**
 * CombatUI - 스탯 체크 기반 전투 UI
 * GDD v2: 상황 텍스트 + 선택지(스탯체크) + 주사위 판정 결과
 * v0.5: 주사위 애니메이션, 라운드 표시, HP 표시, 난이도/확률 표시
 */
import { createElement } from '../utils/helpers.js';
import { TIER_LABELS, DIFFICULTY_LABELS } from './combatConstants.js';
import {
  renderDiceAnimation,
  renderFullResult,
  renderEndBanner,
  buildChoiceLabelParts,
} from './combatRenderers.js';

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
        <div class="combat-result hidden" aria-live="polite"></div>
      </div>
      <div class="combat-log" aria-live="polite"></div>
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

    // HP 변동 플래시
    if (this._lastHp !== undefined && this._lastHp !== hp) {
      const delta = hp - this._lastHp;
      this._showDamagePopup(delta);
      const hpBar = this.el.querySelector('.combat-hp-mini');
      if (hpBar) {
        hpBar.classList.add('hp-changed');
        setTimeout(() => hpBar.classList.remove('hp-changed'), 500);
      }
    }
    this._lastHp = hp;
  }

  /** 데미지/회복 팝업 */
  _showDamagePopup(value) {
    if (value === 0) return;
    const popup = createElement('div', `damage-popup ${value < 0 ? 'damage-loss' : 'damage-heal'}`);
    popup.textContent = `${value > 0 ? '+' : ''}${value}`;
    const hpMini = this.el.querySelector('.combat-hp-mini');
    if (hpMini) {
      hpMini.style.position = 'relative';
      hpMini.appendChild(popup);
      setTimeout(() => popup.remove(), 1200);
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
    this.choicesEl.setAttribute('role', 'group');
    this.choicesEl.setAttribute('aria-label', '전투 선택지');

    // 동료 스킬 바
    if (data.availableCompanionSkills && data.availableCompanionSkills.length > 0) {
      const skillBar = createElement('div', 'companion-skill-bar');
      data.availableCompanionSkills.forEach(skill => {
        const isActive = data.activeCompanionSkill && data.activeCompanionSkill.id === skill.id;
        const btn = createElement('button', `companion-skill-btn ${isActive ? 'active' : ''}`);
        btn.innerHTML = `${skill.companionName}: ${skill.name} [${skill.currentCharges}] DC${skill.dcModifier > 0 ? '+' : ''}${skill.dcModifier}`;
        btn.addEventListener('click', () => {
          if (this._onCompanionSkill) this._onCompanionSkill(skill);
        });
        skillBar.appendChild(btn);
      });
      this.choicesEl.appendChild(skillBar);
    }

    data.choices.forEach((choice, index) => {
      const alignClass = choice.alignment !== 'neutral' ? `choice-${choice.alignment}` : '';
      const diffClass = `difficulty-${choice.difficulty}`;
      const btn = createElement('button', `combat-choice-btn ${alignClass}`);

      const labelParts = buildChoiceLabelParts(choice);

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
      if (this.el.classList.contains('hidden') || e.repeat) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= data.choices.length) {
        e.preventDefault();
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
    this.resultEl.innerHTML = renderDiceAnimation(data);

    const numEl = this.resultEl.querySelector('.dice-rolling-number');

    // 가속 타임아웃 체인
    const delays = [50, 55, 60, 70, 80, 100, 120, 150, 200, 250];
    let step = 0;
    const rollStep = () => {
      if (step < delays.length) {
        numEl.textContent = Math.floor(Math.random() * 6) + 1;
        step++;
        this._diceTimeout = setTimeout(rollStep, delays[step - 1]);
      } else {
        numEl.textContent = data.roll;
        numEl.classList.add('dice-settled');
        numEl.classList.add(data.success ? 'dice-glow-success' : 'dice-glow-failure');
        setTimeout(() => this._showFullResult(data), 500);
      }
    };
    rollStep();
  }

  _showFullResult(data) {
    const { html, tookDamage } = renderFullResult(data);

    // 피해 시 화면 흔들림
    if (tookDamage) {
      this.el.classList.add('combat-shake');
      setTimeout(() => this.el.classList.remove('combat-shake'), 400);
    }

    // 성공 시 적 피격 플래시
    if (data.success) {
      this.enemySprite.classList.add('enemy-hit');
      setTimeout(() => this.enemySprite.classList.remove('enemy-hit'), 400);
    }

    this.resultEl.innerHTML = html;

    // 계속 버튼
    this.resultEl.querySelector('.result-continue-btn').addEventListener('click', () => {
      this._removeContinueKeyHandler();
      if (this._onProceed) this._onProceed();
    });

    // Enter/Space로 계속
    this._removeContinueKeyHandler();
    this._continueKeyHandler = (e) => {
      if (this.el.classList.contains('hidden') || e.repeat) return;
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

    this.resultEl.innerHTML = renderEndBanner(data, isVictory);
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
    if (this._diceTimeout) {
      clearTimeout(this._diceTimeout);
      this._diceTimeout = null;
    }
  }

  onChoice(callback) { this._onChoice = callback; }
  onProceed(callback) { this._onProceed = callback; }
  onCompanionSkill(callback) { this._onCompanionSkill = callback; }

  show() { this.el.classList.remove('hidden'); }

  hide() {
    this._removeKeyHandler();
    this._removeContinueKeyHandler();
    this._clearDiceInterval();
    this.el.classList.add('hidden');
  }
}
