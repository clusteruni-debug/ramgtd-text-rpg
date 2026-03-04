/**
 * TitleScreen - 타이틀 화면
 * 새 게임 / 이어하기 / 세이브 슬롯 선택 / 회차 정보 / 특전 확인
 */
import { createElement } from '../utils/helpers.js';
import MetaProgression from '../engine/MetaProgression.js';

export default class TitleScreen {
  constructor(container, saveLoadSystem, metaProgression = null) {
    this.container = container;
    this.saveSystem = saveLoadSystem;
    this.meta = metaProgression;
    this._onNewGame = null;
    this._onLoadGame = null;
    this._onTestCombat = null;

    this._build();
  }

  _build() {
    this.el = createElement('div', 'title-screen');
    this.el.innerHTML = `
      <div class="title-content">
        <div class="title-logo">
          <div class="title-text">심연</div>
          <div class="title-subtitle">The Abyss</div>
        </div>
        <div class="title-run-info hidden"></div>
        <div class="title-status hidden" aria-live="polite"></div>
        <div class="title-menu">
          <button class="title-btn new-game-btn" aria-label="새 게임 시작">&#9654; 새 게임</button>
          <button class="title-btn continue-btn" aria-label="이어하기">&#9654; 이어하기</button>
          <button class="title-btn perks-btn hidden" aria-label="특전 목록 보기">&#9733; 특전 목록</button>
          <button class="title-btn test-combat-btn" aria-label="전투 테스트">&#9876; 전투 테스트</button>
        </div>
        <div class="save-slots hidden"></div>
        <div class="perks-panel hidden"></div>
        <div class="title-footer">
          <span>Space / Enter로 선택</span>
        </div>
      </div>
    `;

    this.menuEl = this.el.querySelector('.title-menu');
    this.slotsEl = this.el.querySelector('.save-slots');
    this.continueBtn = this.el.querySelector('.continue-btn');
    this.runInfoEl = this.el.querySelector('.title-run-info');
    this.statusEl = this.el.querySelector('.title-status');
    this.perksBtn = this.el.querySelector('.perks-btn');
    this.perksPanel = this.el.querySelector('.perks-panel');

    // 새 게임
    this.el.querySelector('.new-game-btn').addEventListener('click', () => {
      if (this._onNewGame) this._onNewGame();
    });

    // 이어하기
    this.continueBtn.addEventListener('click', () => {
      this._showSaveSlots();
    });

    // 특전 목록
    this.perksBtn.addEventListener('click', () => {
      this._togglePerksPanel();
    });

    // 전투 테스트
    this.el.querySelector('.test-combat-btn').addEventListener('click', () => {
      if (this._onTestCombat) this._onTestCombat();
    });

    this.container.appendChild(this.el);
  }

  _showSaveSlots() {
    this.slotsEl.innerHTML = '';
    this.slotsEl.classList.remove('hidden');
    this.perksPanel.classList.add('hidden');

    // 오토세이브
    const autoInfo = this.saveSystem.getAutoSaveInfo();
    if (autoInfo) {
      const btn = createElement('button', 'slot-btn');
      btn.innerHTML = `
        <span class="slot-label">오토세이브</span>
        <span class="slot-info">${autoInfo.playerName} 🧠${autoInfo.memories} - ${autoInfo.date}</span>
      `;
      btn.addEventListener('click', () => {
        const ok = this.saveSystem.loadAutoSave();
        if (!ok) {
          this._setStatus('오토세이브를 불러오지 못했습니다. 다른 슬롯을 선택하세요.', 'error');
          return;
        }
        if (this._onLoadGame) this._onLoadGame({ success: true, source: 'auto' });
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
          <span class="slot-info">${info.playerName} 🧠${info.memories} - ${info.date}</span>
        `;
        btn.addEventListener('click', () => {
          const ok = this.saveSystem.load(i);
          if (!ok) {
            this._setStatus(`슬롯 ${i + 1} 로드 실패. 다른 슬롯을 선택하세요.`, 'error');
            return;
          }
          if (this._onLoadGame) this._onLoadGame({ success: true, source: 'slot', slot: i });
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

  _togglePerksPanel() {
    if (!this.perksPanel.classList.contains('hidden')) {
      this.perksPanel.classList.add('hidden');
      return;
    }

    this.slotsEl.classList.add('hidden');
    this.perksPanel.innerHTML = '';
    this.perksPanel.classList.remove('hidden');

    if (!this.meta) return;

    const perks = this.meta.getAllPerks();
    const bonuses = this.meta.data.permanentBonuses;

    if (perks.length === 0 && Object.values(bonuses).every(v => v === 0)) {
      this.perksPanel.innerHTML = `
        <div class="perks-title">획득한 특전</div>
        <div class="perks-empty">아직 없음 — 플레이하면서 해금하세요!</div>
      `;
    } else {
      let html = '<div class="perks-title">획득한 특전</div>';

      // 특전 목록
      perks.forEach(p => {
        html += `<div class="perk-item"><span class="perk-name">${p.name}</span><span class="perk-desc">${p.description}</span></div>`;
      });

      // 영구 보너스 요약
      const bonusEntries = Object.entries(bonuses).filter(([, v]) => v > 0);
      if (bonusEntries.length > 0) {
        html += '<div class="perks-bonus-title">영구 보너스</div>';
        const statNames = { body: '체력', sense: '감각', reason: '이성', bond: '교감', maxHp: 'HP' };
        bonusEntries.forEach(([stat, val]) => {
          html += `<div class="perk-bonus">+${val} ${statNames[stat] || stat}</div>`;
        });
      }

      this.perksPanel.innerHTML = html;
    }

    // 엔딩 보상 섹션
    const endingRewards = MetaProgression.getEndingRewardInfo();
    const endingNames = { bittersweet: '원점회귀', hopeful: '이방인', tragic: '헌신', peaceful: '잔류' };
    let endingHtml = '<div class="perks-bonus-title" style="margin-top:12px">결말 보상</div>';
    endingRewards.forEach(r => {
      const reached = this.meta && this.meta.hasReachedEnding(r.endingType);
      const name = endingNames[r.endingType] || r.endingType;
      if (reached) {
        endingHtml += `<div class="perk-item"><span class="perk-name">${name}: ${r.perkName}</span><span class="perk-desc">${r.perkDescription}</span></div>`;
      } else {
        endingHtml += `<div class="perk-item" style="opacity:0.4"><span class="perk-name">${name}: ???</span><span class="perk-desc">이 결말을 도달하면 해금</span></div>`;
      }
    });
    this.perksPanel.innerHTML += endingHtml;

    // 닫기 버튼
    const closeBtn = createElement('button', 'slot-btn slot-back', '← 닫기');
    closeBtn.addEventListener('click', () => {
      this.perksPanel.classList.add('hidden');
    });
    this.perksPanel.appendChild(closeBtn);
  }

  _updateRunInfo() {
    if (!this.meta || this.meta.data.totalRuns === 0) {
      this.runInfoEl.classList.add('hidden');
      this.perksBtn.classList.add('hidden');
      return;
    }

    const d = this.meta.data;
    const endings = Object.keys(d.endingsReached || {}).length;
    let info = `${d.totalRuns + 1}회차 | 사망: ${d.totalDeaths} | 클리어: ${d.totalVictories}`;
    if (endings > 0) {
      info += ` | 결말: ${endings}/4`;
    }
    this.runInfoEl.innerHTML = info;
    this.runInfoEl.classList.remove('hidden');

    // 특전이 있으면 버튼 표시
    const hasPerks = Object.keys(d.perks).length > 0 ||
                     Object.values(d.permanentBonuses).some(v => v > 0);
    if (hasPerks) {
      this.perksBtn.classList.remove('hidden');
    } else {
      this.perksBtn.classList.add('hidden');
    }
  }

  updateContinueButton() {
    // 세이브 데이터 없으면 이어하기 비활성화
    const hasAuto = this.saveSystem.hasAutoSave();
    const hasSlot = this.saveSystem.getAllSlotInfo().some(s => s !== null);
    this.continueBtn.disabled = !hasAuto && !hasSlot;
    if (this.continueBtn.disabled) {
      this.continueBtn.classList.add('disabled');
    } else {
      this.continueBtn.classList.remove('disabled');
    }
  }

  _setStatus(message, type = 'error') {
    if (!this.statusEl) return;
    this.statusEl.textContent = message;
    this.statusEl.classList.remove('hidden', 'success', 'error');
    this.statusEl.classList.add(type === 'success' ? 'success' : 'error');
  }

  onNewGame(callback) { this._onNewGame = callback; }
  onLoadGame(callback) { this._onLoadGame = callback; }
  onTestCombat(callback) { this._onTestCombat = callback; }

  show() {
    this.slotsEl.classList.add('hidden');
    this.perksPanel.classList.add('hidden');
    this.statusEl.classList.add('hidden');
    this.updateContinueButton();
    this._updateRunInfo();
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }
}
