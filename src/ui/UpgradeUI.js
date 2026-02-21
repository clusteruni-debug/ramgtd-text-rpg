/**
 * UpgradeUI - 엔그램으로 스탯 업그레이드
 * 비용: 현재 스탯 값 × 10 엔그램
 */
import { createElement } from '../utils/helpers.js';

const STAT_NAMES = {
  body: '체력',
  sense: '감각',
  reason: '이성',
  bond: '교감',
};

const STAT_DESC = {
  body: '물리적 돌파 / 지구력',
  sense: '회피 / 탐색 / 위험감지',
  reason: '분석 / 퍼즐 / 약점간파',
  bond: '설득 / 감정연결 / 동료연계',
};

const MAX_STAT = 5;

export default class UpgradeUI {
  constructor(container, stateManager) {
    this.container = container;
    this.state = stateManager;
    this._onBack = null;
    this._onUpgrade = null;

    this._build();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'upgrade-ui');
    this.el.innerHTML = `
      <div class="upgrade-header">
        <span class="upgrade-title">엔그램 주입</span>
        <span class="upgrade-engrams">💎 <span class="upgrade-engram-count">0</span></span>
      </div>
      <div class="upgrade-desc">기억 조각(엔그램)을 소모하여 능력을 강화합니다.</div>
      <div class="upgrade-summary" aria-live="polite"></div>
      <div class="upgrade-list"></div>
      <div class="upgrade-footer">
        <button class="upgrade-back-btn">← 돌아가기</button>
      </div>
    `;

    this.listEl = this.el.querySelector('.upgrade-list');
    this.engramCountEl = this.el.querySelector('.upgrade-engram-count');
    this.summaryEl = this.el.querySelector('.upgrade-summary');

    this.el.querySelector('.upgrade-back-btn').addEventListener('click', () => {
      if (this._onBack) this._onBack();
    });

    this.container.appendChild(this.el);
  }

  render() {
    const engrams = this.state.getStat('engrams');
    this.engramCountEl.textContent = engrams;
    this.listEl.innerHTML = '';
    const statEntries = Object.keys(STAT_NAMES).map(stat => {
      const current = this.state.getStat(stat);
      return {
        stat,
        current,
        cost: current * 10,
        isMax: current >= MAX_STAT,
      };
    });
    const affordable = statEntries.filter(entry => !entry.isMax && engrams >= entry.cost);
    const minCost = statEntries
      .filter(entry => !entry.isMax)
      .reduce((acc, entry) => Math.min(acc, entry.cost), Number.POSITIVE_INFINITY);
    this.summaryEl.innerHTML = `
      <span>강화 가능: <strong>${affordable.length}</strong>개</span>
      <span>최소 비용: <strong>${Number.isFinite(minCost) ? `💎${minCost}` : 'MAX 달성'}</strong></span>
    `;

    Object.keys(STAT_NAMES).forEach(stat => {
      const current = this.state.getStat(stat);
      const cost = current * 10;
      const isMax = current >= MAX_STAT;
      const canAfford = engrams >= cost;

      const row = createElement('div', 'upgrade-row');
      row.innerHTML = `
        <div class="upgrade-stat-info">
          <div class="upgrade-stat-name">${STAT_NAMES[stat]}</div>
          <div class="upgrade-stat-desc">${STAT_DESC[stat]}</div>
        </div>
        <div class="upgrade-stat-level">
          <div class="upgrade-pips">
            ${Array.from({ length: MAX_STAT }, (_, i) =>
              `<span class="pip ${i < current ? 'filled' : ''}">${i < current ? '■' : '□'}</span>`
            ).join('')}
          </div>
        </div>
        <div class="upgrade-action">
          ${isMax
            ? '<span class="upgrade-max">MAX</span>'
            : `<button class="upgrade-btn ${canAfford ? '' : 'disabled'}" ${canAfford ? '' : 'disabled'}>
                +1 (💎${cost})
              </button>
              ${canAfford ? '' : `<div class="upgrade-hint">💎${Math.max(cost - engrams, 0)} 부족</div>`}
              `
          }
        </div>
      `;

      if (!isMax && canAfford) {
        row.querySelector('.upgrade-btn').addEventListener('click', () => {
          this.state.addEngrams(-cost);
          this.state.modifyStat(stat, 1);
          if (this._onUpgrade) {
            this._onUpgrade({
              stat: STAT_NAMES[stat] || stat,
              statId: stat,
              cost,
              nextValue: this.state.getStat(stat),
            });
          }
          this.render();
        });
      }

      this.listEl.appendChild(row);
    });
  }

  onBack(callback) { this._onBack = callback; }
  onUpgrade(callback) { this._onUpgrade = callback; }

  show() {
    this.render();
    this.el.classList.remove('hidden');
  }

  hide() { this.el.classList.add('hidden'); }
}
