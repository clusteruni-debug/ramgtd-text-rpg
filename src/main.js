/**
 * Text RPG - 엔트리 포인트
 */
import './styles/main.css';
import './styles/dialogue.css';
import './styles/combat.css';
import './styles/animations.css';
import './styles/systems.css';
// district-themes, particles: systems.css barrel에서 임포트
// transitions, enemy-sprites: combat.css barrel에서 임포트

import Game from './Game.js';
import { initAnalytics, trackSessionEnd } from './analytics.js';

// Firebase Analytics 초기화 (미설정 시 자동 no-op)
initAnalytics();

// 게임 시작
const app = document.querySelector('#app');
if (!app) {
  throw new Error('App mount element not found: #app');
}
const game = new Game(app);

// 세션 종료 추적
window.addEventListener('beforeunload', () => trackSessionEnd());

// 디버그용 (개발 중에만)
if (import.meta.env.DEV) {
  window.__game = game;
}
