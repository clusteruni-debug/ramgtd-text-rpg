/**
 * 전투 UI 상수 — CombatUI.js에서 분리됨
 */

export const TIER_LABELS = {
  minion: '하급',
  elite: '정예',
  boss: '보스',
};

export const ALIGNMENT_LABELS = {
  light: '명',
  dark: '암',
  neutral: '',
};

export const DIFFICULTY_LABELS = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
  extreme: '극한',
  impossible: '불가능',
};

/** Per-enemy visual configuration */
export const ENEMY_VISUALS = {
  ticket_inspector_enemy: { color: '#ff4444', icon: '📡', label: '검표원' },
  necktie_zombie:         { color: '#444455', icon: '👔', label: '넥타이 좀비' },
  censor_drone:           { color: '#8888aa', icon: '🔇', label: '검열 드론' },
  frost_drone:            { color: '#4488cc', icon: '❄️', label: '냉각 드론' },
  rage_fighter:           { color: '#ff6600', icon: '🔥', label: '분노의 투사' },
  classification_examiner:{ color: '#ff4444', icon: '📋', label: '분류 심사관' },
  shadow_self:            { color: '#555566', icon: '🪞', label: '그림자 자아' },
  pain_collector:         { color: '#cc2244', icon: '👁', label: '고통의 수집가' },
  librarian:              { color: '#6b5b95', icon: '📖', label: '사서' },
  foreman:                { color: '#5a6741', icon: '⚙️', label: '현장 소장' },
  curator:                { color: '#4e9af5', icon: '🧊', label: '동면 관리자' },
  chef:                   { color: '#ff6600', icon: '🔥', label: '주방장' },
  station_master:         { color: '#ffd700', icon: '🕐', label: '역장' },
  mayor:                  { color: '#9b59b6', icon: '💻', label: '시장' },
};
