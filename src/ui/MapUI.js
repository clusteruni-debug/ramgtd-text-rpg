/**
 * MapUI - 지하철 노선도 / 지구 이동 화면
 * Platform 0 허브에서 4개 행정구로 이동
 * v0.9: CSS 원형 마커 + 구역 문자(A/B/C/D), 정화 완료/잠김 상태 표시
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
        <div class="map-header-left">
          <span class="map-title">지하철 노선도</span>
          <span class="map-location">현재: 플랫폼 0</span>
        </div>
        <span class="map-progress" aria-live="polite"></span>
      </div>
      <div class="map-body">
        <div class="map-hub">
          <div class="map-hub-icon">⬡</div>
          <div class="map-hub-label">플랫폼 0<br><span class="map-hub-sub">중앙 환승 센터</span></div>
        </div>
        <div class="map-districts"></div>
      </div>
      <div class="map-footer">
        <button class="map-back-btn">← 돌아가기</button>
      </div>
    `;

    this.districtsEl = this.el.querySelector('.map-districts');
    this.progressEl = this.el.querySelector('.map-progress');

    this.el.querySelector('.map-back-btn').addEventListener('click', () => {
      if (this._onBack) this._onBack();
    });

    this.container.appendChild(this.el);
  }

  /**
   * 구역 목록 렌더링 — 지하철 노선도 스타일
   * @param {Array} districts - gameConfig.districts
   */
  render(districts, config = null) {
    this.districtsEl.innerHTML = '';

    if (!districts || districts.length === 0) return;
    const total = districts.length;
    let unlockedCount = 0;
    let clearedCount = 0;

    districts.forEach((district) => {
      const isUnlocked = district.defaultUnlocked || this.state.hasFlag(district.unlockFlag);
      const isCleared = this.state.hasFlag(district.bossFlag);
      if (isUnlocked) unlockedCount++;
      if (isCleared) clearedCount++;
    });

    if (this.progressEl) {
      this.progressEl.textContent = `해금 ${unlockedCount}/${total} · 정화 ${clearedCount}/${total}`;
    }

    districts.forEach((district) => {
      const isUnlocked = district.defaultUnlocked || this.state.hasFlag(district.unlockFlag);
      const isCleared = this.state.hasFlag(district.bossFlag);
      const color = district.color || '#a7a7c4';
      const icon = district.icon || district.id.slice(-1).toUpperCase();

      // 노선 연결선
      const lineEl = createElement('div', 'map-line-connector');
      lineEl.style.borderColor = color;
      this.districtsEl.appendChild(lineEl);

      // 구역 카드
      const card = createElement('div', 'map-district-card');
      if (!isUnlocked) card.classList.add('locked');
      if (isCleared) card.classList.add('cleared');

      // 원형 마커
      const markerClass = isCleared ? 'district-marker district-marker-cleared' : 'district-marker';
      const lockBadge = !isUnlocked ? '<span class="district-lock-badge">🔒</span>' : '';
      const checkOverlay = isCleared ? '<span class="district-marker-check">✓</span>' : '';

      card.innerHTML = `
        <div class="${markerClass}" style="border-color: ${color}; color: ${color}">
          ${icon}
          ${checkOverlay}
          ${lockBadge}
        </div>
        <div class="district-info">
          <div class="district-name">${district.name}</div>
          <div class="district-desc">${district.description}</div>
          ${isCleared ? '<div class="district-status cleared-badge">정화 완료</div>' : ''}
          ${!isUnlocked ? `<div class="district-status locked-badge">잠김 · ${this._formatUnlockHint(district, config)}</div>` : ''}
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

  _formatUnlockHint(district, config) {
    if (district.defaultUnlocked) return '초기 해금';
    const mappedHint = config?.districtUnlockHints?.[district.id];
    if (mappedHint) return mappedHint;
    if (!district.unlockFlag) return '조건 미확인';
    return `${district.unlockFlag} 달성 필요`;
  }

  onTravel(callback) { this._onTravel = callback; }
  onBack(callback) { this._onBack = callback; }

  show() { this.el.classList.remove('hidden'); }
  hide() { this.el.classList.add('hidden'); }
}
