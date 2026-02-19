/**
 * AudioManager - HTMLAudioElement 기반 BGM/SFX
 * 파일 없어도 에러 없이 무시 (graceful degradation)
 * 오디오 파일: public/audio/bgm/, public/audio/sfx/
 */
const STORAGE_KEY = 'text_rpg_audio_settings';

export default class AudioManager {
  constructor() {
    this._bgm = null;
    this._currentBGM = null;
    this._bgmVolume = 0.5;
    this._sfxVolume = 0.7;
    this._muted = false;
    this._resumed = false;

    this.loadSettings();
  }

  /** 브라우저 자동재생 정책 대응 — 첫 인터랙션 시 호출 */
  resume() {
    if (this._resumed) return;
    this._resumed = true;
    if (this._bgm && this._bgm.paused) {
      this._bgm.play().catch(() => {});
    }
  }

  /** BGM 재생 (loop) */
  playBGM(trackName) {
    if (!trackName) return;
    if (this._currentBGM === trackName) return;

    this.stopBGM();
    this._currentBGM = trackName;

    const basePath = (import.meta.env.BASE_URL || '/');
    const src = `${basePath}audio/bgm/${trackName}`;

    this._bgm = new Audio(src);
    this._bgm.loop = true;
    this._bgm.volume = this._muted ? 0 : this._bgmVolume;

    this._bgm.play().catch(() => {
      // 파일 없거나 자동재생 차단 → 조용히 무시
    });
  }

  /** BGM 정지 */
  stopBGM() {
    if (this._bgm) {
      this._bgm.pause();
      this._bgm.src = '';
      this._bgm = null;
    }
    this._currentBGM = null;
  }

  /** SFX 원샷 재생 */
  playSFX(sfxName) {
    if (!sfxName || this._muted) return;

    const basePath = (import.meta.env.BASE_URL || '/');
    const src = `${basePath}audio/sfx/${sfxName}`;

    const audio = new Audio(src);
    audio.volume = this._sfxVolume;
    audio.play().catch(() => {
      // 파일 없으면 조용히 무시
    });
  }

  /** BGM 볼륨 (0-1) */
  setBGMVolume(vol) {
    this._bgmVolume = Math.max(0, Math.min(1, vol));
    if (this._bgm && !this._muted) {
      this._bgm.volume = this._bgmVolume;
    }
    this.saveSettings();
  }

  /** SFX 볼륨 (0-1) */
  setSFXVolume(vol) {
    this._sfxVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
  }

  /** 전체 음소거 */
  setMasterMute(muted) {
    this._muted = muted;
    if (this._bgm) {
      this._bgm.volume = muted ? 0 : this._bgmVolume;
    }
    this.saveSettings();
  }

  toggleMute() {
    this.setMasterMute(!this._muted);
  }

  /** 설정 저장 */
  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        bgmVolume: this._bgmVolume,
        sfxVolume: this._sfxVolume,
        muted: this._muted,
      }));
    } catch { /* ignore */ }
  }

  /** 설정 로드 */
  loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.bgmVolume !== undefined) this._bgmVolume = data.bgmVolume;
      if (data.sfxVolume !== undefined) this._sfxVolume = data.sfxVolume;
      if (data.muted !== undefined) this._muted = data.muted;
    } catch { /* ignore */ }
  }

  // --- Getters ---
  get bgmVolume() { return this._bgmVolume; }
  get sfxVolume() { return this._sfxVolume; }
  get isMuted() { return this._muted; }
  get currentBGM() { return this._currentBGM; }
}
