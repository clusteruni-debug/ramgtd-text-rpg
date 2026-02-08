/**
 * InventoryPanel - 인벤토리 UI
 * 아이템 목록 + 사용 기능
 */
import { createElement } from '../utils/helpers.js';

export default class InventoryPanel {
  constructor(container, stateManager) {
    this.container = container;
    this.state = stateManager;
    this._onUseItem = null;

    this._build();
    this._subscribe();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'inventory-panel');
    this.el.innerHTML = `
      <div class="inventory-header">
        <span class="inventory-title">🎒 인벤토리</span>
        <button class="inventory-close">✕</button>
      </div>
      <div class="inventory-list"></div>
    `;

    this.listEl = this.el.querySelector('.inventory-list');
    this.el.querySelector('.inventory-close').addEventListener('click', () => this.hide());

    this.container.appendChild(this.el);
  }

  _subscribe() {
    this.state.on('inventoryChanged', () => this.update());
    this.state.on('stateLoaded', () => this.update());
    this.state.on('stateReset', () => this.update());
  }

  update() {
    this.listEl.innerHTML = '';
    const items = this.state.state.inventory;

    if (items.length === 0) {
      this.listEl.innerHTML = '<div class="inventory-empty">아이템이 없습니다</div>';
      return;
    }

    items.forEach(item => {
      const row = createElement('div', 'inventory-item');
      row.innerHTML = `
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-qty">x${item.quantity}</span>
        </div>
        <div class="item-desc">${item.description || ''}</div>
      `;

      // 소비 아이템만 사용 버튼
      if (item.type === 'consumable') {
        const useBtn = createElement('button', 'item-use-btn', '사용');
        useBtn.addEventListener('click', () => {
          if (this._onUseItem) this._onUseItem(item.id);
        });
        row.appendChild(useBtn);
      }

      this.listEl.appendChild(row);
    });
  }

  onUseItem(callback) {
    this._onUseItem = callback;
  }

  toggle() {
    if (this.el.classList.contains('hidden')) {
      this.update();
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.update();
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }
}
