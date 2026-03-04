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
      <button class="menu-btn" data-action="inventory" title="인벤토리" aria-label="인벤토리">🎒</button>
      <button class="menu-btn" data-action="companion" title="동료" aria-label="동료">👥</button>
      <button class="menu-btn" data-action="log" title="대화 기록" aria-label="대화 기록">📜</button>
      <button class="menu-btn" data-action="save" title="세이브" aria-label="세이브">💾</button>
      <button class="menu-btn" data-action="settings" title="설정" aria-label="설정">⚙️</button>
      <button class="menu-btn" data-action="title" title="타이틀로" aria-label="타이틀로">🏠</button>
      <span class="save-indicator" aria-hidden="true">💾 저장됨</span>
    `;

    this.saveIndicator = this.el.querySelector('.save-indicator');

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

  /** 오토세이브 시 💾 pulse 애니메이션 */
  flashSaveIndicator() {
    if (!this.saveIndicator) return;
    this.saveIndicator.classList.remove('active');
    // force reflow
    void this.saveIndicator.offsetWidth;
    this.saveIndicator.classList.add('active');
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
          <span class="slot-info">${info.playerName} 🧠${info.memories || '?'} - ${info.date}</span>
        `;
      } else {
        btn.innerHTML = `
          <span class="slot-label">슬롯 ${i + 1}</span>
          <span class="slot-info">— 비어 있음 —</span>
        `;
      }

      const slot = i;
      btn.addEventListener('click', () => {
        const ok = this.saveSystem.save(slot);
        if (!ok) {
          if (this._callbacks.onSaveError) this._callbacks.onSaveError(slot);
          return;
        }
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
