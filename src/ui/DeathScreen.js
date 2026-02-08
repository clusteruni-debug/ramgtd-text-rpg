/**
 * DeathScreen - 사망 화면
 * 이번 회차 성과 + 영구 보상 표시 + 다시 시작 버튼
 */
import { createElement } from '../utils/helpers.js';

export default class DeathScreen {
  constructor(container) {
    this.container = container;
    this._onRestart = null;
    this._build();
  }

  _build() {
    this.el = createElement('div', 'death-screen hidden');
    this.el.innerHTML = `
      <div class="death-content">
        <div class="death-title">쓰러졌다...</div>
        <div class="death-stats"></div>
        <div class="death-rewards"></div>
        <button class="death-restart-btn">&#9654; 다시 시작</button>
        <div class="death-run-info"></div>
      </div>
    `;

    this.statsEl = this.el.querySelector('.death-stats');
    this.rewardsEl = this.el.querySelector('.death-rewards');
    this.runInfoEl = this.el.querySelector('.death-run-info');

    this.el.querySelector('.death-restart-btn').addEventListener('click', () => {
      if (this._onRestart) this._onRestart();
    });

    this.container.appendChild(this.el);
  }

  /**
   * 사망 화면 표시
   * @param {object} runData - { level, gold, turnCount }
   * @param {Array} rewards - 이번 회차에서 얻은 영구 보상 목록
   * @param {object} metaData - { totalRuns, totalDeaths }
   */
  show(runData = {}, rewards = [], metaData = {}) {
    // 이번 회차 성과
    this.statsEl.innerHTML = `
      <div class="death-stat-title">이번 회차 성과</div>
      <div class="death-stat-row">
        <span>도달 레벨</span><span>Lv.${runData.level || 1}</span>
      </div>
      <div class="death-stat-row">
        <span>획득 골드</span><span>${runData.gold || 0}G</span>
      </div>
    `;

    // 영구 보상
    if (rewards.length > 0) {
      this.rewardsEl.innerHTML = `
        <div class="death-reward-title">영구 보상 획득!</div>
        ${rewards.map(r => `
          <div class="death-reward-item">${r.icon || '+'} ${r.text}</div>
        `).join('')}
      `;
      this.rewardsEl.classList.remove('hidden');
    } else {
      this.rewardsEl.innerHTML = '';
    }

    // 회차 정보
    this.runInfoEl.textContent = `Run #${metaData.totalRuns || 1} | 총 사망: ${metaData.totalDeaths || 0}`;

    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }

  onRestart(callback) {
    this._onRestart = callback;
  }
}
