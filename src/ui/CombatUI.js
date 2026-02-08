/**
 * CombatUI - 전투 화면
 * 적 정보 + HP바 + 액션 버튼 + 전투 로그
 */
import { createElement } from '../utils/helpers.js';

export default class CombatUI {
  constructor(container) {
    this.container = container;
    this._onAction = null;

    this._build();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'combat-ui');
    this.el.innerHTML = `
      <div class="combat-enemy">
        <div class="enemy-sprite"></div>
        <div class="enemy-name"></div>
        <div class="stat-bar enemy-hp-bar">
          <div class="stat-bar-fill enemy-hp-fill"></div>
          <span class="stat-bar-text enemy-hp-text"></span>
        </div>
      </div>
      <div class="combat-log"></div>
      <div class="combat-actions">
        <button class="combat-btn" data-action="attack">⚔️ 공격</button>
        <button class="combat-btn" data-action="skill">✨ 강타</button>
        <button class="combat-btn" data-action="item">🎒 아이템</button>
        <button class="combat-btn" data-action="flee">🏃 도망</button>
      </div>
      <div class="combat-items hidden"></div>
    `;

    this.enemySprite = this.el.querySelector('.enemy-sprite');
    this.enemyNameEl = this.el.querySelector('.enemy-name');
    this.enemyHpFill = this.el.querySelector('.enemy-hp-fill');
    this.enemyHpText = this.el.querySelector('.enemy-hp-text');
    this.logEl = this.el.querySelector('.combat-log');
    this.actionsEl = this.el.querySelector('.combat-actions');
    this.itemsEl = this.el.querySelector('.combat-items');

    // 액션 버튼 바인딩
    this.actionsEl.querySelectorAll('.combat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'item') {
          this._toggleItems();
        } else if (this._onAction) {
          this._onAction(action);
        }
      });
    });

    this.container.appendChild(this.el);
  }

  /**
   * 전투 상태 업데이트
   * @param {object} data - { enemy, log, isActive, turnCount }
   */
  updateCombat(data) {
    const { enemy, log, isActive } = data;

    // 적 정보
    if (enemy) {
      this.enemyNameEl.textContent = enemy.name;
      const hpPercent = (enemy.hp / enemy.maxHp) * 100;
      this.enemyHpFill.style.width = `${hpPercent}%`;
      this.enemyHpText.textContent = `${enemy.hp}/${enemy.maxHp}`;

      // 적 스프라이트 (CSS 기반)
      this.enemySprite.className = `enemy-sprite enemy-${enemy.sprite || 'default'}`;
    }

    // 로그 업데이트
    this.logEl.innerHTML = '';
    const recentLog = log.slice(-5); // 최근 5줄
    recentLog.forEach(msg => {
      const line = createElement('div', 'combat-log-line', msg);
      this.logEl.appendChild(line);
    });
    this.logEl.scrollTop = this.logEl.scrollHeight;

    // 액션 버튼 활성화/비활성화
    this.actionsEl.querySelectorAll('.combat-btn').forEach(btn => {
      btn.disabled = !isActive;
    });
  }

  // 아이템 사용 UI
  showItems(items) {
    this.itemsEl.innerHTML = '';
    this.itemsEl.classList.remove('hidden');

    if (items.length === 0) {
      this.itemsEl.innerHTML = '<div class="no-items">사용 가능한 아이템이 없다</div>';
      setTimeout(() => this.itemsEl.classList.add('hidden'), 1500);
      return;
    }

    items.forEach(item => {
      const btn = createElement('button', 'item-btn');
      btn.textContent = `${item.name} x${item.quantity}`;
      btn.addEventListener('click', () => {
        this.itemsEl.classList.add('hidden');
        if (this._onAction) this._onAction('useItem', item.id);
      });
      this.itemsEl.appendChild(btn);
    });

    // 닫기 버튼
    const closeBtn = createElement('button', 'item-btn item-close', '취소');
    closeBtn.addEventListener('click', () => this.itemsEl.classList.add('hidden'));
    this.itemsEl.appendChild(closeBtn);
  }

  _toggleItems() {
    if (this.itemsEl.classList.contains('hidden')) {
      // Game에서 아이템 목록 제공 필요 → onAction에서 처리
      if (this._onAction) this._onAction('showItems');
    } else {
      this.itemsEl.classList.add('hidden');
    }
  }

  onAction(callback) {
    this._onAction = callback;
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
    this.itemsEl.classList.add('hidden');
  }
}
