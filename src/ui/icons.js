/**
 * icons.js — Custom SVG icon system replacing emojis
 * Usage: import { icons } from './icons.js'; icons.dice(24)
 */

const svg = (content, size = 24, vb = '0 0 24 24') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">${content}</svg>`;

export const icons = {
  /** 주사위 */
  dice: (size = 24) => svg(`
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#1a1a2e" stroke="#e94560"/>
    <circle cx="8" cy="8" r="1.5" fill="#e94560"/>
    <circle cx="16" cy="8" r="1.5" fill="#e94560"/>
    <circle cx="12" cy="12" r="1.5" fill="#e94560"/>
    <circle cx="8" cy="16" r="1.5" fill="#e94560"/>
    <circle cx="16" cy="16" r="1.5" fill="#e94560"/>
  `, size),

  /** 엔그램 결정 💎 */
  engram: (size = 16) => svg(`
    <polygon points="12,2 22,9 18,22 6,22 2,9" fill="#9b59b622" stroke="#9b59b6"/>
    <line x1="12" y1="2" x2="12" y2="22" stroke="#9b59b644"/>
    <line x1="2" y1="9" x2="22" y2="9" stroke="#9b59b644"/>
  `, size),

  /** 심연 기억 🧠 */
  memory: (size = 16) => svg(`
    <path d="M12 4c-2 0-4 1-5 3s-1 4 0 6c1 1 2 2 3 2h4c1 0 2-1 3-2 1-2 1-4 0-6s-3-3-5-3z" fill="#ff6e6e22" stroke="#ff6e6e"/>
    <path d="M9 12c0 2 1 4 3 5s3-3 3-5" stroke="#ff6e6e" fill="none"/>
  `, size),

  /** 성공 ✅ */
  success: (size = 20) => svg(`
    <circle cx="12" cy="12" r="10" fill="#50fa7b22" stroke="#50fa7b"/>
    <path d="M7 12l3 3 7-7" stroke="#50fa7b" stroke-width="2" fill="none"/>
  `, size),

  /** 실패 ❌ */
  failure: (size = 20) => svg(`
    <circle cx="12" cy="12" r="10" fill="#e9456022" stroke="#e94560"/>
    <path d="M8 8l8 8M16 8l-8 8" stroke="#e94560" stroke-width="2"/>
  `, size),

  /** 승리 ⚔️ */
  victory: (size = 24) => svg(`
    <path d="M6 2l2 8-5 5 3 1 1 3 5-5 8 2-2-8 5-5-3-1-1-3-5 5z" fill="#ffd70033" stroke="#ffd700"/>
  `, size),

  /** 패배 💀 */
  defeat: (size = 24) => svg(`
    <circle cx="12" cy="10" r="8" fill="#e9456022" stroke="#e94560"/>
    <circle cx="9" cy="9" r="2" fill="#e94560"/>
    <circle cx="15" cy="9" r="2" fill="#e94560"/>
    <path d="M8 14h8M10 14v2M12 14v2M14 14v2" stroke="#e94560"/>
  `, size),

  /** HP 심장 ❤️ */
  heart: (size = 16) => svg(`
    <path d="M12 21s-8-5-8-11a4 4 0 018 0 4 4 0 018 0c0 6-8 11-8 11z" fill="#e9456066" stroke="#e94560"/>
  `, size),

  /** 경고 ⚠️ */
  warning: (size = 16) => svg(`
    <path d="M12 3L2 21h20z" fill="#ffd70022" stroke="#ffd700"/>
    <line x1="12" y1="10" x2="12" y2="15" stroke="#ffd700" stroke-width="2"/>
    <circle cx="12" cy="18" r="1" fill="#ffd700"/>
  `, size),

  /** 스탯 아이콘 */
  stat: {
    body: (size = 14) => svg(`<path d="M12 3a4 4 0 014 4v2a4 4 0 01-8 0V7a4 4 0 014-4zM4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="#e94560"/>`, size),
    sense: (size = 14) => svg(`<circle cx="12" cy="12" r="3" stroke="#4e9af5"/><circle cx="12" cy="12" r="8" stroke="#4e9af5" stroke-dasharray="2 3"/>`, size),
    reason: (size = 14) => svg(`<circle cx="12" cy="8" r="5" stroke="#ffd700"/><path d="M9 15h6M12 13v5" stroke="#ffd700"/>`, size),
    bond: (size = 14) => svg(`<path d="M12 19s-6-4-6-9a3 3 0 016 0 3 3 0 016 0c0 5-6 9-6 9z" stroke="#50fa7b"/>`, size),
  },

  /** 카르마 */
  karmaLight: (size = 14) => svg(`<circle cx="12" cy="12" r="5" fill="#ffd70033" stroke="#ffd700"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#ffd700"/>`, size),
  karmaDark: (size = 14) => svg(`<circle cx="12" cy="12" r="5" fill="#9b59b633" stroke="#9b59b6"/><circle cx="12" cy="12" r="2" fill="#9b59b6"/>`, size),
};

export default icons;
