/**
 * DialogueLog - 대화 기록 오버레이
 * 최대 50개 엔트리, L키 토글, ESC 닫기
 */
import { createElement } from '../utils/helpers.js';

const MAX_ENTRIES = 50;

export default class DialogueLog {
  constructor(container) {
    this.container = container;
    this._entries = [];
    this._visible = false;

    this._build();
    this._bindKeys();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'dialogue-log');
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-label', '대화 기록');
    this.el.innerHTML = `
      <div class="dialogue-log-header">
        <span class="dialogue-log-title">📜 대화 기록</span>
        <button class="dialogue-log-close" aria-label="닫기">✕</button>
      </div>
      <div class="dialogue-log-list"></div>
    `;

    this.listEl = this.el.querySelector('.dialogue-log-list');
    this.el.querySelector('.dialogue-log-close').addEventListener('click', () => this.hide());

    this.container.appendChild(this.el);
  }

  _bindKeys() {
    this._keyHandler = (e) => {
      if (e.key === 'l' || e.key === 'L') {
        // L키: 입력 중이 아닐 때만 토글
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
        this.toggle();
      }
      if (e.key === 'Escape' && this._visible) {
        this.hide();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  /** 대화 엔트리 추가 */
  addEntry(speaker, text) {
    this._entries.push({ speaker, text, time: Date.now() });
    if (this._entries.length > MAX_ENTRIES) {
      this._entries.shift();
    }
  }

  /** 로그 UI 렌더링 */
  _render() {
    this.listEl.innerHTML = '';

    if (this._entries.length === 0) {
      this.listEl.innerHTML = '<div class="dialogue-log-empty">아직 대화가 없습니다.</div>';
      return;
    }

    this._entries.forEach(entry => {
      const el = createElement('div', `dialogue-log-entry ${entry.speaker ? '' : 'narration'}`);
      if (entry.speaker) {
        el.innerHTML = `
          <div class="log-speaker">${entry.speaker}</div>
          <div class="log-text">${entry.text}</div>
        `;
      } else {
        el.innerHTML = `<div class="log-text">${entry.text}</div>`;
      }
      this.listEl.appendChild(el);
    });

    // 스크롤 최하단
    this.listEl.scrollTop = this.listEl.scrollHeight;
  }

  toggle() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this._render();
    this.el.classList.remove('hidden');
    this._visible = true;
  }

  hide() {
    this.el.classList.add('hidden');
    this._visible = false;
  }

  /** 새 게임 시 초기화 */
  clear() {
    this._entries = [];
  }

  destroy() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    if (this.el?.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}
