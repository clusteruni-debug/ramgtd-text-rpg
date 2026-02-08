/**
 * MenuBar - 상단 메뉴 (세이브/인벤토리/설정)
 */
import { createElement } from '../utils/helpers.js';

export default class MenuBar {
  constructor(container, saveLoadSystem) {
    this.container = container;
    this.saveSystem = saveLoadSystem;
    this._callbacks = {};

    this._build();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'menu-bar');
    this.el.innerHTML = `
      <button class="menu-btn" data-action="inventory" title="인벤토리">🎒</button>
      <button class="menu-btn" data-action="save" title="세이브">💾</button>
      <button class="menu-btn" data-action="title" title="타이틀로">🏠</button>
    `;

    // 버튼 이벤트
    this.el.querySelectorAll('.menu-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'save') {
          this._showSaveDialog();
        } else if (this._callbacks[action]) {
          this._callbacks[action]();
        }
      });
    });

    // 세이브 다이얼로그
    this.saveDialog = createElement('div', 'save-dialog hidden');
    this.el.appendChild(this.saveDialog);

    this.container.appendChild(this.el);
  }

  _showSaveDialog() {
    this.saveDialog.innerHTML = '';
    this.saveDialog.classList.remove('hidden');

    const header = createElement('div', 'save-dialog-header', '💾 세이브');
    this.saveDialog.appendChild(header);

    // 슬롯 1~3
    for (let i = 0; i < 3; i++) {
      const info = this.saveSystem.getSlotInfo(i);
      const btn = createElement('button', 'slot-btn');

      if (info) {
        btn.innerHTML = `
          <span class="slot-label">슬롯 ${i + 1}</span>
          <span class="slot-info">${info.playerName} Lv.${info.level} - ${info.date}</span>
        `;
      } else {
        btn.innerHTML = `
          <span class="slot-label">슬롯 ${i + 1}</span>
          <span class="slot-info">— 비어 있음 —</span>
        `;
      }

      const slot = i;
      btn.addEventListener('click', () => {
        this.saveSystem.save(slot);
        this.saveDialog.classList.add('hidden');
        if (this._callbacks.onSave) this._callbacks.onSave(slot);
      });
      this.saveDialog.appendChild(btn);
    }

    // 닫기
    const closeBtn = createElement('button', 'slot-btn slot-back', '← 닫기');
    closeBtn.addEventListener('click', () => this.saveDialog.classList.add('hidden'));
    this.saveDialog.appendChild(closeBtn);
  }

  on(event, callback) {
    this._callbacks[event] = callback;
  }

  show() { this.el.classList.remove('hidden'); }
  hide() { this.el.classList.add('hidden'); }
}
