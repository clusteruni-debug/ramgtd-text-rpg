/**
 * TitleScreen - 타이틀 화면
 * 새 게임 / 이어하기 / 세이브 슬롯 선택
 */
import { createElement } from '../utils/helpers.js';

export default class TitleScreen {
  constructor(container, saveLoadSystem) {
    this.container = container;
    this.saveSystem = saveLoadSystem;
    this._onNewGame = null;
    this._onLoadGame = null;

    this._build();
  }

  _build() {
    this.el = createElement('div', 'title-screen');
    this.el.innerHTML = `
      <div class="title-content">
        <div class="title-logo">
          <div class="title-text">TEXT RPG</div>
          <div class="title-subtitle">이상한 앱이 뜬 날</div>
        </div>
        <div class="title-menu">
          <button class="title-btn new-game-btn">▶ 새 게임</button>
          <button class="title-btn continue-btn">▶ 이어하기</button>
        </div>
        <div class="save-slots hidden"></div>
        <div class="title-footer">
          <span>Space / Enter로 선택</span>
        </div>
      </div>
    `;

    this.menuEl = this.el.querySelector('.title-menu');
    this.slotsEl = this.el.querySelector('.save-slots');
    this.continueBtn = this.el.querySelector('.continue-btn');

    // 새 게임
    this.el.querySelector('.new-game-btn').addEventListener('click', () => {
      if (this._onNewGame) this._onNewGame();
    });

    // 이어하기
    this.continueBtn.addEventListener('click', () => {
      this._showSaveSlots();
    });

    this.container.appendChild(this.el);
  }

  _showSaveSlots() {
    this.slotsEl.innerHTML = '';
    this.slotsEl.classList.remove('hidden');

    // 오토세이브
    const autoInfo = this.saveSystem.getAutoSaveInfo();
    if (autoInfo) {
      const btn = createElement('button', 'slot-btn');
      btn.innerHTML = `
        <span class="slot-label">오토세이브</span>
        <span class="slot-info">${autoInfo.playerName} Lv.${autoInfo.level} - ${autoInfo.date}</span>
      `;
      btn.addEventListener('click', () => {
        this.saveSystem.loadAutoSave();
        if (this._onLoadGame) this._onLoadGame();
      });
      this.slotsEl.appendChild(btn);
    }

    // 슬롯 1~3
    const slots = this.saveSystem.getAllSlotInfo();
    slots.forEach((info, i) => {
      const btn = createElement('button', 'slot-btn');
      if (info) {
        btn.innerHTML = `
          <span class="slot-label">슬롯 ${i + 1}</span>
          <span class="slot-info">${info.playerName} Lv.${info.level} - ${info.date}</span>
        `;
        btn.addEventListener('click', () => {
          this.saveSystem.load(i);
          if (this._onLoadGame) this._onLoadGame();
        });
      } else {
        btn.innerHTML = `
          <span class="slot-label">슬롯 ${i + 1}</span>
          <span class="slot-info">— 비어 있음 —</span>
        `;
        btn.disabled = true;
        btn.classList.add('empty');
      }
      this.slotsEl.appendChild(btn);
    });

    // 뒤로가기
    const backBtn = createElement('button', 'slot-btn slot-back', '← 뒤로');
    backBtn.addEventListener('click', () => {
      this.slotsEl.classList.add('hidden');
    });
    this.slotsEl.appendChild(backBtn);
  }

  updateContinueButton() {
    // 세이브 데이터 없으면 이어하기 비활성화
    const hasAuto = this.saveSystem.hasAutoSave();
    const hasSlot = this.saveSystem.getAllSlotInfo().some(s => s !== null);
    this.continueBtn.disabled = !hasAuto && !hasSlot;
    if (this.continueBtn.disabled) {
      this.continueBtn.classList.add('disabled');
    }
  }

  onNewGame(callback) { this._onNewGame = callback; }
  onLoadGame(callback) { this._onLoadGame = callback; }

  show() {
    this.slotsEl.classList.add('hidden');
    this.updateContinueButton();
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }
}
