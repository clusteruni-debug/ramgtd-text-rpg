/**
 * ChoiceButtons - 선택지 버튼 UI
 * 조건 미충족 시 비활성화, 선택 시 콜백
 */
import { createElement } from '../utils/helpers.js';

export default class ChoiceButtons {
  constructor(container) {
    this.container = container;
    this.el = createElement('div', 'choice-buttons');
    this.container.appendChild(this.el);
    this.hide();
  }

  /**
   * 선택지 표시
   * @param {Array} choices - [{ text, available, ...data }]
   * @returns {Promise<object>} 선택된 choice 객체
   */
  showChoices(choices) {
    this.el.innerHTML = '';
    this.show();

    return new Promise(resolve => {
      choices.forEach((choice, index) => {
        const btn = createElement('button', 'choice-btn');
        btn.textContent = choice.text;
        btn.dataset.index = index;

        if (!choice.available) {
          btn.classList.add('disabled');
          btn.disabled = true;
          btn.title = '조건을 충족하지 못했습니다';
        } else {
          btn.addEventListener('click', () => {
            this.hide();
            resolve(choice);
          });
        }

        this.el.appendChild(btn);
      });

      // 키보드 단축키 (1~9)
      const keyHandler = (e) => {
        const num = parseInt(e.key);
        if (num >= 1 && num <= choices.length) {
          const choice = choices[num - 1];
          if (choice.available) {
            document.removeEventListener('keydown', keyHandler);
            this.hide();
            resolve(choice);
          }
        }
      };
      document.addEventListener('keydown', keyHandler);
    });
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
    this.el.innerHTML = '';
  }
}
