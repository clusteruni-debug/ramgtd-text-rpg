/**
 * SettingsPanel - 설정 메뉴 (모달)
 * 텍스트 속도, BGM/SFX 볼륨, 음소거, 오토세이브, 슬롯 삭제
 */
import { createElement } from '../utils/helpers.js';

const STORAGE_KEY = 'text_rpg_settings';

export default class SettingsPanel {
  constructor(container, dialogueRenderer, audioManager, saveLoadSystem) {
    this.container = container;
    this.renderer = dialogueRenderer;
    this.audio = audioManager;
    this.saveSystem = saveLoadSystem;

    this._autoSaveEnabled = true;
    this._typingSpeed = 35;

    this._loadSettings();
    this._build();
    this.hide();
  }

  _build() {
    this.el = createElement('div', 'settings-panel');
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-label', '설정');
    this._render();
    this.container.appendChild(this.el);
  }

  _render() {
    const speed = this._typingSpeed;
    const bgmVol = Math.round(this.audio.bgmVolume * 100);
    const sfxVol = Math.round(this.audio.sfxVolume * 100);
    const muted = this.audio.isMuted;

    this.el.innerHTML = `
      <div class="settings-header">
        <span class="settings-title">⚙️ 설정</span>
        <button class="settings-close" aria-label="닫기">✕</button>
      </div>
      <div class="settings-body">
        <div class="settings-group">
          <div class="settings-group-title">텍스트</div>
          <div class="settings-row">
            <span class="settings-label">텍스트 속도</span>
            <input type="range" class="settings-slider" data-key="typingSpeed" min="10" max="80" value="${speed}">
            <span class="settings-value" data-display="typingSpeed">${speed}ms</span>
          </div>
        </div>

        <div class="settings-divider"></div>

        <div class="settings-group">
          <div class="settings-group-title">오디오</div>
          <div class="settings-row">
            <span class="settings-label">BGM 볼륨</span>
            <input type="range" class="settings-slider" data-key="bgmVolume" min="0" max="100" value="${bgmVol}">
            <span class="settings-value" data-display="bgmVolume">${bgmVol}%</span>
          </div>
          <div class="settings-row">
            <span class="settings-label">SFX 볼륨</span>
            <input type="range" class="settings-slider" data-key="sfxVolume" min="0" max="100" value="${sfxVol}">
            <span class="settings-value" data-display="sfxVolume">${sfxVol}%</span>
          </div>
          <div class="settings-row">
            <span class="settings-label">전체 음소거</span>
            <input type="checkbox" class="settings-checkbox" data-key="mute" ${muted ? 'checked' : ''}>
          </div>
        </div>

        <div class="settings-divider"></div>

        <div class="settings-group">
          <div class="settings-group-title">게임</div>
          <div class="settings-row">
            <span class="settings-label">자동 저장</span>
            <input type="checkbox" class="settings-checkbox" data-key="autoSave" ${this._autoSaveEnabled ? 'checked' : ''}>
          </div>
        </div>

        <div class="settings-divider"></div>

        <div class="settings-group">
          <div class="settings-group-title">세이브 관리</div>
          <div class="settings-row">
            <button class="settings-delete-btn" data-slot="0">슬롯 1 삭제</button>
            <button class="settings-delete-btn" data-slot="1">슬롯 2 삭제</button>
            <button class="settings-delete-btn" data-slot="2">슬롯 3 삭제</button>
          </div>
        </div>
      </div>
    `;

    this._bindSettingsEvents();
  }

  _bindSettingsEvents() {
    // 닫기
    this.el.querySelector('.settings-close').addEventListener('click', () => this.hide());

    // 슬라이더
    this.el.querySelectorAll('.settings-slider').forEach(slider => {
      slider.addEventListener('input', () => {
        const key = slider.dataset.key;
        const val = parseInt(slider.value);
        const display = this.el.querySelector(`[data-display="${key}"]`);

        switch (key) {
          case 'typingSpeed':
            this._typingSpeed = val;
            this.renderer.setSpeed(val);
            if (display) display.textContent = `${val}ms`;
            break;
          case 'bgmVolume':
            this.audio.setBGMVolume(val / 100);
            if (display) display.textContent = `${val}%`;
            break;
          case 'sfxVolume':
            this.audio.setSFXVolume(val / 100);
            if (display) display.textContent = `${val}%`;
            break;
        }
        this._saveSettings();
      });
    });

    // 체크박스
    this.el.querySelectorAll('.settings-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const key = cb.dataset.key;
        switch (key) {
          case 'mute':
            this.audio.setMasterMute(cb.checked);
            break;
          case 'autoSave':
            this._autoSaveEnabled = cb.checked;
            break;
        }
        this._saveSettings();
      });
    });

    // 슬롯 삭제
    this.el.querySelectorAll('.settings-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt(btn.dataset.slot);
        if (confirm(`슬롯 ${slot + 1}의 세이브를 삭제합니까?`)) {
          this.saveSystem.deleteSlot(slot);
          btn.textContent = `슬롯 ${slot + 1} ✓ 삭제됨`;
          btn.disabled = true;
        }
      });
    });
  }

  get autoSaveEnabled() {
    return this._autoSaveEnabled;
  }

  get typingSpeed() {
    return this._typingSpeed;
  }

  _saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        typingSpeed: this._typingSpeed,
        autoSaveEnabled: this._autoSaveEnabled,
      }));
    } catch { /* ignore */ }
  }

  _loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.typingSpeed !== undefined) this._typingSpeed = data.typingSpeed;
      if (data.autoSaveEnabled !== undefined) this._autoSaveEnabled = data.autoSaveEnabled;
    } catch { /* ignore */ }
  }

  toggle() {
    if (this.el.classList.contains('hidden')) {
      this._render(); // 최신 값 반영
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }
}
