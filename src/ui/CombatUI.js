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
        <div class="combat-hp-combat">
          <span class="combat-hp-label">HP</span>
          <div class="combat-hp-bar">
            <div class="combat-hp-bar-fill"></div>
            <span class="combat-hp-bar-text"></span>
          </div>
        </div>
      </div>
      <div class="combat-enemy">
        <div class="enemy-sprite-wrapper">
          <img class="enemy-sprite-img" src="" alt="" />
          <div class="enemy-sprite-fallback enemy-default"></div>
        </div>
        <div class="enemy-name"></div>
        <div class="round-progress" aria-label="전투 진행도">
          <div class="round-progress-bar">
            <div class="round-progress-fill"></div>
          </div>
          <span class="round-progress-text"></span>
        </div>
      </div>
      <div class="combat-body">
        <div class="combat-round-text"></div>
        <div class="combat-choices"></div>
        <div class="combat-result hidden" aria-live="polite"></div>
      </div>
      <div class="combat-log" aria-live="polite"></div>
    `;

    this.roundIndicatorEl = this.el.querySelector('.combat-round-indicator');
    this.hpBarFillEl = this.el.querySelector('.combat-hp-bar-fill');
    this.hpBarTextEl = this.el.querySelector('.combat-hp-bar-text');
    this.enemySpriteImg = this.el.querySelector('.enemy-sprite-img');
    this.enemySpriteFallback = this.el.querySelector('.enemy-sprite-fallback');
    this.enemySpriteWrapper = this.el.querySelector('.enemy-sprite-wrapper');
    this.enemyNameEl = this.el.querySelector('.enemy-name');
    this.roundProgressFill = this.el.querySelector('.round-progress-fill');
    this.roundProgressText = this.el.querySelector('.round-progress-text');
    this.roundProgressEl = this.el.querySelector('.round-progress');
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
      this._updateEnemySprite(data.enemy);
    }

    // Boss entrance cinematic (first round only)
    if (data.enemy && data.enemy.tier === 'boss' && data.phase === 'choose' && data.roundIndex === 0 && !this._bossEntranceShown) {
      this._bossEntranceShown = true;
      const overlay = document.createElement('div');
      overlay.className = 'boss-entrance-overlay';
      overlay.innerHTML = `
        <div class="boss-name">${data.enemy.name}</div>
        <div class="boss-title">${(data.enemy.description || '').slice(0, 30)}</div>
      `;
      document.body.appendChild(overlay);
      const safetyTimer = setTimeout(() => overlay.remove(), 3500);
      overlay.addEventListener('animationend', () => { clearTimeout(safetyTimer); overlay.remove(); });
    }

    // Round progress bar (shows combat progress as rounds complete)
    this._updateRoundProgress(data);

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
    this.hpBarFillEl.style.width = `${pct}%`;
    this.hpBarTextEl.textContent = `${hp} / ${maxHp}`;

    this.hpBarFillEl.classList.remove('hp-critical', 'hp-low');
    if (pct <= 25) {
      this.hpBarFillEl.classList.add('hp-critical');
    } else if (pct <= 50) {
      this.hpBarFillEl.classList.add('hp-low');
    }

    // HP critical screen effect
    const existing = document.querySelector('.hp-critical-screen');
    if (pct <= 25 && !existing) {
      const critical = document.createElement('div');
      critical.className = 'hp-critical-screen';
      document.body.appendChild(critical);
    } else if (pct > 25 && existing) {
      existing.remove();
    }

    // HP 변동 플래시
    if (this._lastHp !== undefined && this._lastHp !== hp) {
      const delta = hp - this._lastHp;
      this._showDamagePopup(delta);
      const hpBar = this.el.querySelector('.combat-hp-bar');
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
    const hpBar = this.el.querySelector('.combat-hp-bar');
    if (hpBar) {
      hpBar.style.position = 'relative';
      hpBar.appendChild(popup);
      setTimeout(() => popup.remove(), 1200);
    }
  }

  /** 적 스프라이트: 이미지 시도 → 실패 시 CSS 폴백 */
  _updateEnemySprite(enemy) {
    const imgPath = `/images/enemies/enemy_${enemy.id}.png`;
    this.enemySpriteImg.src = imgPath;
    this.enemySpriteImg.alt = enemy.name;

    // Add enemy ID class to wrapper for per-enemy CSS targeting
    this.enemySpriteWrapper.className = `enemy-sprite-wrapper enemy-${enemy.id}`;

    // Show image, hide fallback by default
    this.enemySpriteImg.classList.remove('hidden');
    this.enemySpriteFallback.classList.add('hidden');

    // On error: hide image, show CSS fallback shape
    this.enemySpriteImg.onerror = () => {
      this.enemySpriteImg.classList.add('hidden');
      this.enemySpriteFallback.classList.remove('hidden');
      this.enemySpriteFallback.className = `enemy-sprite-fallback enemy-sprite-inner enemy-${enemy.sprite || 'default'}`;
    };
  }

  /** 라운드 진행 바 업데이트 */
  _updateRoundProgress(data) {
    if (data.totalRounds && data.totalRounds > 0) {
      this.roundProgressEl.classList.remove('hidden');
      // completedRounds = roundIndex for current round (0-based), +1 if phase is result/victory
      let completed = data.roundIndex || 0;
      if (data.phase === 'victory') {
        completed = data.totalRounds;
      }
      const pct = (completed / data.totalRounds) * 100;
      this.roundProgressFill.style.width = `${pct}%`;
      this.roundProgressText.textContent = `${completed} / ${data.totalRounds}`;
    } else {
      this.roundProgressEl.classList.add('hidden');
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

    // Damage vignette on failure
    if (!data.success) {
      const vignette = document.createElement('div');
      vignette.className = 'damage-vignette';
      document.body.appendChild(vignette);
      const vTimer = setTimeout(() => vignette.remove(), 800);
      vignette.addEventListener('animationend', () => { clearTimeout(vTimer); vignette.remove(); });
    }

    // 성공 시 적 피격 플래시
    if (data.success) {
      this.enemySpriteWrapper.classList.add('enemy-hit');
      setTimeout(() => this.enemySpriteWrapper.classList.remove('enemy-hit'), 400);
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
    this._bossEntranceShown = false;
    // Clean up all full-screen overlays
    document.querySelectorAll('.hp-critical-screen, .boss-entrance-overlay, .damage-vignette').forEach(el => el.remove());
    this.el.classList.add('hidden');
  }
}
