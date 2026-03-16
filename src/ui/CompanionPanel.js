/**
 * CompanionPanel - 동료 목록 및 상세 정보
 * 신뢰도, 생존 상태, 스킬 + 충전 표시, 초상화
 */
import { createElement } from '../utils/helpers.js';
import { icons } from './icons.js';

export default class CompanionPanel {
  constructor(container, stateManager, getCharacterData = null) {
    this.container = container;
    this.state = stateManager;
    this._getCharacterData = getCharacterData; // (id) => charData

    this._build();
    this._subscribe();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'companion-panel');
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-label', '동료 목록');
    this.el.innerHTML = `
      <div class="companion-header">
        <span class="companion-title">동료</span>
        <button class="companion-close-btn" aria-label="닫기">✕</button>
      </div>
      <div class="companion-list"></div>
      <div class="companion-empty">아직 동료가 없습니다.</div>
    `;

    this.listEl = this.el.querySelector('.companion-list');
    this.emptyEl = this.el.querySelector('.companion-empty');

    this.el.querySelector('.companion-close-btn').addEventListener('click', () => {
      this.hide();
    });

    this.container.appendChild(this.el);
  }

  _subscribe() {
    this.state.on('companionJoined', () => this.render());
    this.state.on('companionDied', () => this.render());
    this.state.on('companionTrustChanged', () => this.render());
    this.state.on('companionSkillUsed', () => this.render());
    this.state.on('companionSkillsReset', () => this.render());
    this.state.on('stateLoaded', () => this.render());
  }

  /** 초상화 HTML — portrait 있으면 img, 없으면 이모지 폴백 */
  _getPortraitHtml(comp) {
    const charData = this._getCharacterData ? this._getCharacterData(comp.id) : null;
    if (charData && charData.portrait) {
      const src = (import.meta.env.BASE_URL || '/') + charData.portrait;
      return `<img class="comp-portrait-img" src="${src}" alt="${comp.name}" onerror="this.replaceWith(document.createTextNode('${comp.alive === false ? '💀' : '👤'}'))">`;
    }
    return comp.alive === false ? icons.defeat(16) : '👤';
  }

  render() {
    const companions = this.state.state.companions;

    if (!companions || companions.length === 0) {
      this.listEl.classList.add('hidden');
      this.emptyEl.classList.remove('hidden');
      return;
    }

    this.emptyEl.classList.add('hidden');
    this.listEl.classList.remove('hidden');
    this.listEl.innerHTML = '';

    companions.forEach(comp => {
      const card = createElement('div', `companion-card ${comp.alive === false ? 'dead' : ''}`);

      // 신뢰도 바 (0~100)
      const trust = Math.max(0, comp.trustLevel || 0);
      const trustPercent = Math.min(100, trust);

      let trustLabel = '경계';
      if (trust >= 80) trustLabel = '깊은 유대';
      else if (trust >= 50) trustLabel = '신뢰';
      else if (trust >= 20) trustLabel = '우호';

      // 스킬 HTML (충전 표시 포함)
      let skillsHtml = '';
      if (comp.alive !== false && comp.skills && comp.skills.length > 0) {
        const skillTags = comp.skills.map(s => {
          const charges = s.currentCharges ?? 0;
          const maxCharges = s.chargesPerRun ?? 0;
          const depleted = charges <= 0;
          const depletedClass = depleted ? 'skill-depleted' : '';
          return `<span class="comp-skill ${depletedClass}" title="${s.description || ''}">
            ${s.name || s.id} <span class="skill-charges">[${charges}/${maxCharges}]</span>
          </span>`;
        }).join('');
        skillsHtml = `<div class="comp-skills">${skillTags}</div>`;
      }

      card.innerHTML = `
        <div class="comp-portrait">${this._getPortraitHtml(comp)}</div>
        <div class="comp-info">
          <div class="comp-name">${comp.name} ${comp.alive === false ? '<span class="comp-dead-tag">영구 사망</span>' : ''}</div>
          ${comp.alive !== false ? `
            <div class="comp-trust">
              <span class="comp-trust-label">${trustLabel}</span>
              <div class="comp-trust-bar">
                <div class="comp-trust-fill" style="width: ${trustPercent}%"></div>
              </div>
            </div>
            ${skillsHtml}
          ` : '<div class="comp-dead-msg">이 세계에서 영원히 사라졌습니다.</div>'}
        </div>
      `;

      this.listEl.appendChild(card);
    });
  }

  toggle() {
    if (this.el.classList.contains('hidden')) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.render();
    this.el.classList.remove('hidden');
  }

  hide() { this.el.classList.add('hidden'); }
}
