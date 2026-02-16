/**
 * DialogueBox - 대화창 UI
 * 화자 이름 + 타이핑 텍스트 + 다음 버튼(▼ 깜빡임)
 */
import { createElement } from '../utils/helpers.js';

export default class DialogueBox {
  constructor(container, dialogueRenderer) {
    this.container = container;
    this.renderer = dialogueRenderer;
    this._onNext = null;
    this._log = null;

    this._build();
    this._bindEvents();
  }

  /** 대화 로그 연결 */
  setLog(dialogueLog) {
    this._log = dialogueLog;
  }

  _build() {
    this.el = createElement('div', 'dialogue-box');
    this.el.innerHTML = `
      <div class="dialogue-portrait hidden">
        <img class="dialogue-portrait-img" src="" alt="" />
      </div>
      <div class="dialogue-content">
        <div class="dialogue-speaker"></div>
        <div class="dialogue-text"></div>
        <div class="dialogue-next">▼</div>
      </div>
    `;
    this.portraitEl = this.el.querySelector('.dialogue-portrait');
    this.portraitImg = this.el.querySelector('.dialogue-portrait-img');
    this.speakerEl = this.el.querySelector('.dialogue-speaker');
    this.textEl = this.el.querySelector('.dialogue-text');
    this.nextEl = this.el.querySelector('.dialogue-next');
    this.container.appendChild(this.el);
    this.hide();
  }

  _bindEvents() {
    // 클릭 또는 Space/Enter로 스킵/다음
    this._handleAdvance = () => {
      if (this.renderer.isTyping) {
        this.renderer.skip();
      } else if (this._onNext) {
        this._onNext();
      }
    };

    this._clickHandler = () => this._handleAdvance();
    this._keyHandler = (e) => {
      if (!this.el.classList.contains('hidden') && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        this._handleAdvance();
      }
    };

    this.el.addEventListener('click', this._clickHandler);
    document.addEventListener('keydown', this._keyHandler);
  }

  /**
   * 대사 표시
   * @param {string} speaker - 화자 이름 (없으면 나레이션)
   * @param {string} text - 대사 텍스트
   * @param {string|null} portrait - 초상화 이미지 경로
   * @returns {Promise<void>} 타이핑 완료 시
   */
  async showDialogue(speaker, text, portrait = null) {
    this.show();

    // 초상화
    if (portrait) {
      this.portraitImg.src = portrait;
      this.portraitEl.classList.remove('hidden');
      this.el.classList.add('has-portrait');
    } else {
      this.portraitEl.classList.add('hidden');
      this.el.classList.remove('has-portrait');
    }

    if (speaker) {
      this.speakerEl.textContent = speaker;
      this.speakerEl.classList.remove('hidden');
    } else {
      this.speakerEl.textContent = '';
      this.speakerEl.classList.add('hidden');
    }
    this.nextEl.classList.add('hidden');
    await this.renderer.type(this.textEl, text);
    this.nextEl.classList.remove('hidden');

    // 대화 로그에 기록
    if (this._log) {
      this._log.addEntry(speaker, text);
    }
  }

  // 다음 버튼 콜백
  onNext(callback) {
    this._onNext = callback;
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }

  destroy() {
    if (this._clickHandler) {
      this.el.removeEventListener('click', this._clickHandler);
      this._clickHandler = null;
    }
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    if (this.el?.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}
