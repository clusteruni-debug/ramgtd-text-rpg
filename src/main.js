/**
 * Text RPG - 엔트리 포인트
 */
import './styles/main.css';
import './styles/dialogue.css';
import './styles/combat.css';
import './styles/animations.css';
import './styles/systems.css';

import Game from './Game.js';

// 게임 시작
const app = document.querySelector('#app');
if (!app) {
  throw new Error('App mount element not found: #app');
}
const game = new Game(app);

// 디버그용 (개발 중에만)
if (import.meta.env.DEV) {
  window.__game = game;
}
