/**
 * StatsPanel - HP + 능력치 + 카르마 + 기억/엔그램 표시
 * GDD v2: Body/Sense/Reason/Bond + Karma 게이지 + 현실 기억 수
 */
import { createElement } from '../utils/helpers.js';
import { icons } from './icons.js';

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
      <div class="stat-bar-container">
        <div class="stat-bar hp-bar">
          <div class="stat-bar-fill hp-fill"></div>
          <span class="stat-bar-text hp-text">20/20</span>
        </div>
      </div>
      <div class="stats-abilities">
        <div class="ability" data-stat="body">
          <span class="ability-label">체력</span>
          <span class="ability-value">2</span>
        </div>
        <div class="ability" data-stat="sense">
          <span class="ability-label">감각</span>
          <span class="ability-value">2</span>
        </div>
        <div class="ability" data-stat="reason">
          <span class="ability-label">이성</span>
          <span class="ability-value">2</span>
        </div>
        <div class="ability" data-stat="bond">
          <span class="ability-label">교감</span>
          <span class="ability-value">1</span>
        </div>
      </div>
      <div class="stats-bottom">
        <div class="karma-container">
          <span class="karma-end karma-dark">암</span>
          <div class="karma-bar">
            <div class="karma-fill"></div>
            <div class="karma-center"></div>
          </div>
          <span class="karma-end karma-light">명</span>
        </div>
        <div class="stats-resources">
          <span class="memory-display" title="현실 기억 (남은 부활 횟수)">${icons.memory(14)} <span class="memory-count">10</span></span>
          <span class="engram-display" title="엔그램 (성장 자원)">${icons.engram(14)} <span class="engram-count">0</span></span>
        </div>
      </div>
    `;
    this.container.appendChild(this.el);
  }

  _subscribe() {
    this.state.on('statChanged', () => this.update());
    this.state.on('karmaChanged', () => this.update());
    this.state.on('engramsChanged', () => this.update());
    this.state.on('memoryLost', () => this.update());
    this.state.on('stateLoaded', () => this.update());
    this.state.on('stateReset', () => this.update());
  }

  update() {
    const p = this.state.state.player;

    // HP 바
    const hpPercent = p.maxHp > 0 ? (p.hp / p.maxHp) * 100 : 0;
    this.el.querySelector('.hp-fill').style.width = `${hpPercent}%`;
    this.el.querySelector('.hp-text').textContent = `HP ${p.hp}/${p.maxHp}`;

    // 4대 능력치
    ['body', 'sense', 'reason', 'bond'].forEach(stat => {
      const el = this.el.querySelector(`.ability[data-stat="${stat}"] .ability-value`);
      if (el) el.textContent = p[stat];
    });

    // 카르마 게이지 (-100 ~ +100 → 0% ~ 100%)
    const karmaPercent = ((p.karma + 100) / 200) * 100;
    this.el.querySelector('.karma-fill').style.width = `${karmaPercent}%`;

    // 현실 기억 수
    this.el.querySelector('.memory-count').textContent = this.state.getRealMemoryCount();

    // 엔그램
    this.el.querySelector('.engram-count').textContent = p.engrams;
  }
}
