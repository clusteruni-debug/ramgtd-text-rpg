/**
 * DeathScreen - 사망 + 현실 기억 소멸 화면
 * GDD v2: 사망 → 그 자리 부활 → 현실 기억 1개 영구 소멸
 * 기억 0 → 벽돌화 (게임 오버)
 */
import { createElement } from '../utils/helpers.js';

export default class DeathScreen {
  constructor(container) {
    this.container = container;
    this._onRestart = null;
    this._build();
  }

  _build() {
    this.el = createElement('div', 'death-screen hidden');
    this.el.innerHTML = `
      <div class="death-content">
        <div class="death-title">Processing Error</div>
        <div class="death-subtitle">분해 시도 실패 — 대상 데이터 부재</div>
        <div class="death-memory-loss"></div>
        <div class="death-memory-remaining"></div>
        <button class="death-restart-btn">재부팅 ▶</button>
        <div class="death-run-info"></div>
      </div>
    `;

    this.titleEl = this.el.querySelector('.death-title');
    this.subtitleEl = this.el.querySelector('.death-subtitle');
    this.memoryLossEl = this.el.querySelector('.death-memory-loss');
    this.memoryRemainingEl = this.el.querySelector('.death-memory-remaining');
    this.runInfoEl = this.el.querySelector('.death-run-info');
    this.restartBtn = this.el.querySelector('.death-restart-btn');

    this.restartBtn.addEventListener('click', () => {
      if (this._onRestart) this._onRestart();
    });

    this.container.appendChild(this.el);
  }

  /**
   * @param {object|null} lostMemory - 소멸된 기억 { id, label, weight }
   * @param {number} remainingMemories - 남은 현실 기억 수
   * @param {boolean} isGameOver - 기억 0 = 완전한 죽음
   * @param {object} metaData - 메타 데이터
   */
  show(lostMemory, remainingMemories, isGameOver, metaData = {}) {
    if (isGameOver) {
      this.titleEl.textContent = 'SYSTEM COMPLETE';
      this.subtitleEl.textContent = '대상 완전 분해 — 벽돌화 진행';
      this.memoryLossEl.innerHTML = `
        <div class="memory-lost-label">마지막 기억이 사라졌다</div>
        <div class="memory-lost-name">"${lostMemory ? lostMemory.label : '...'}"</div>
      `;
      this.memoryRemainingEl.innerHTML = `
        <div class="game-over-text">현실의 기억이 전부 사라졌다.<br>당신은 심연의 벽이 되었다.</div>
      `;
      this.restartBtn.textContent = '처음부터 ▶';
    } else {
      this.titleEl.textContent = 'Processing Error';
      this.subtitleEl.textContent = '분해 시도 실패 — 대상 데이터 부재';
      this.memoryLossEl.innerHTML = `
        <div class="memory-lost-label">현실의 기억이 희미해진다...</div>
        <div class="memory-lost-name">"${lostMemory ? lostMemory.label : '...'}"</div>
        <div class="memory-lost-gone">이 기억은 영원히 사라졌다</div>
      `;
      this.memoryRemainingEl.innerHTML = `
        <div class="memory-remaining">남은 현실 기억: <strong>${remainingMemories}</strong>개</div>
        ${remainingMemories <= 3 ? '<div class="memory-warning">기억이 얼마 남지 않았다...</div>' : ''}
      `;
      this.restartBtn.textContent = '재부팅 ▶';
    }

    this.runInfoEl.textContent = `Run #${metaData.totalRuns || 1} | 총 사망: ${metaData.totalDeaths || 0}`;
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }

  onRestart(callback) {
    this._onRestart = callback;
  }
}
