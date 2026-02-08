/**
 * StatsPanel - HP/MP 바 + 레벨/골드 표시
 * StateManager 이벤트 구독으로 실시간 업데이트
 */
import { createElement } from '../utils/helpers.js';

export default class StatsPanel {
  constructor(container, stateManager) {
    this.container = container;
    this.state = stateManager;

    this._build();
    this._subscribe();
    this.update();
  }

  _build() {
    this.el = createElement('div', 'stats-panel');
    this.el.innerHTML = `
      <div class="stat-row">
        <span class="stat-label">Lv.</span>
        <span class="stat-value level-value">1</span>
        <span class="stat-label gold-label">💰</span>
        <span class="stat-value gold-value">0</span>
      </div>
      <div class="stat-bar-container">
        <div class="stat-bar hp-bar">
          <div class="stat-bar-fill hp-fill"></div>
          <span class="stat-bar-text hp-text">100/100</span>
        </div>
        <div class="stat-bar mp-bar">
          <div class="stat-bar-fill mp-fill"></div>
          <span class="stat-bar-text mp-text">50/50</span>
        </div>
      </div>
      <div class="stat-row exp-row">
        <div class="stat-bar exp-bar">
          <div class="stat-bar-fill exp-fill"></div>
          <span class="stat-bar-text exp-text">EXP 0/100</span>
        </div>
      </div>
    `;
    this.container.appendChild(this.el);
  }

  _subscribe() {
    this.state.on('statChanged', () => this.update());
    this.state.on('levelUp', () => this.update());
    this.state.on('goldChanged', () => this.update());
    this.state.on('expGained', () => this.update());
    this.state.on('stateLoaded', () => this.update());
    this.state.on('stateReset', () => this.update());
  }

  update() {
    const p = this.state.state.player;

    // 레벨/골드
    this.el.querySelector('.level-value').textContent = p.level;
    this.el.querySelector('.gold-value').textContent = this.state.state.gold;

    // HP 바
    const hpPercent = (p.hp / p.maxHp) * 100;
    this.el.querySelector('.hp-fill').style.width = `${hpPercent}%`;
    this.el.querySelector('.hp-text').textContent = `HP ${p.hp}/${p.maxHp}`;

    // MP 바
    const mpPercent = (p.mp / p.maxMp) * 100;
    this.el.querySelector('.mp-fill').style.width = `${mpPercent}%`;
    this.el.querySelector('.mp-text').textContent = `MP ${p.mp}/${p.maxMp}`;

    // EXP 바
    const expPercent = (p.exp / p.expToNext) * 100;
    this.el.querySelector('.exp-fill').style.width = `${expPercent}%`;
    this.el.querySelector('.exp-text').textContent = `EXP ${p.exp}/${p.expToNext}`;
  }
}
