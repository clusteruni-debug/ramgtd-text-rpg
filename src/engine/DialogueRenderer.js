/**
 * DialogueRenderer - 타이핑 효과 + 스킵 기능
 * 글자를 하나씩 출력하고, 클릭/키 입력으로 스킵 가능
 */
export default class DialogueRenderer {
  constructor() {
    this._timer = null;
    this._resolve = null;
    this._isTyping = false;
    this._fullText = '';
    this._targetElement = null;
    this.speed = 30; // ms per character
  }

  get isTyping() {
    return this._isTyping;
  }

  /**
   * 타이핑 효과로 텍스트 출력
   * @param {HTMLElement} element - 텍스트를 넣을 DOM 요소
   * @param {string} text - 출력할 텍스트
   * @returns {Promise<void>} 타이핑 완료 시 resolve
   */
  type(element, text) {
    // 이전 타이핑 중이면 즉시 완료
    if (this._isTyping) {
      this.skip();
    }

    this._fullText = text;
    this._targetElement = element;
    this._isTyping = true;
    element.textContent = '';

    return new Promise(resolve => {
      this._resolve = resolve;
      let index = 0;

      this._timer = setInterval(() => {
        if (index < text.length) {
          element.textContent += text[index];
          index++;
        } else {
          this._finish();
        }
      }, this.speed);
    });
  }

  // 즉시 전체 텍스트 표시
  skip() {
    if (!this._isTyping) return;
    this._targetElement.textContent = this._fullText;
    this._finish();
  }

  _finish() {
    clearInterval(this._timer);
    this._timer = null;
    this._isTyping = false;
    if (this._resolve) {
      this._resolve();
      this._resolve = null;
    }
  }

  // 속도 설정 (1=빠름 ~ 100=느림)
  setSpeed(ms) {
    this.speed = ms;
  }

  destroy() {
    clearInterval(this._timer);
    this._timer = null;
    this._isTyping = false;
    this._resolve = null;
  }
}
