/**
 * MapUI - 지하철 노선도 / 지구 이동 화면
 * Platform 0 허브에서 4개 행정구로 이동
 */
import { createElement } from '../utils/helpers.js';

export default class MapUI {
  constructor(container, stateManager) {
    this.container = container;
    this.state = stateManager;
    this._onTravel = null;
    this._onBack = null;

    this._build();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'map-ui');
    this.el.innerHTML = `
      <div class="map-header">
        <span class="map-title">지하철 노선도</span>
        <span class="map-location">현재: 플랫폼 0</span>
      </div>
      <div class="map-body">
        <div class="map-hub">
          <div class="map-hub-icon">⬡</div>
          <div class="map-hub-label">플랫폼 0<br><span class="map-hub-sub">중앙 환승 센터</span></div>
        </div>
        <div class="map-lines"></div>
        <div class="map-districts"></div>
      </div>
      <div class="map-footer">
        <button class="map-back-btn">← 돌아가기</button>
      </div>
    `;

    this.districtsEl = this.el.querySelector('.map-districts');
    this.linesEl = this.el.querySelector('.map-lines');

    this.el.querySelector('.map-back-btn').addEventListener('click', () => {
      if (this._onBack) this._onBack();
    });

    this.container.appendChild(this.el);
  }

  /**
   * 구역 목록 렌더링
   * @param {Array} districts - gameConfig.districts
   */
  render(districts) {
    this.districtsEl.innerHTML = '';
    this.linesEl.innerHTML = '';

    if (!districts || districts.length === 0) return;

    const colors = ['#a7a7c4', '#4e9af5', '#50c8c8', '#e94560'];
    const icons = ['📚', '🏢', '🧊', '🔥'];

    districts.forEach((district, i) => {
      // 노선 연결선
      const line = createElement('div', 'map-line');
      line.style.borderColor = colors[i] || colors[0];
      this.linesEl.appendChild(line);

      // 구역 카드
      const card = createElement('div', 'map-district-card');
      const isUnlocked = district.defaultUnlocked || this.state.hasFlag(district.unlockFlag);
      const isCleared = this.state.hasFlag(district.bossFlag);

      if (!isUnlocked) {
        card.classList.add('locked');
      }
      if (isCleared) {
        card.classList.add('cleared');
      }

      card.innerHTML = `
        <div class="district-icon" style="color: ${colors[i]}">${icons[i]}</div>
        <div class="district-info">
          <div class="district-name">${district.name}</div>
          <div class="district-desc">${district.description}</div>
          ${isCleared ? '<div class="district-status cleared-badge">정화 완료</div>' : ''}
          ${!isUnlocked ? '<div class="district-status locked-badge">잠김</div>' : ''}
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          if (this._onTravel) this._onTravel(district);
        });
      }

      this.districtsEl.appendChild(card);
    });
  }

  onTravel(callback) { this._onTravel = callback; }
  onBack(callback) { this._onBack = callback; }

  show() { this.el.classList.remove('hidden'); }
  hide() { this.el.classList.add('hidden'); }
}
