/**
 * combatRenderers - 전투 UI HTML 렌더링 헬퍼
 * CombatUI.js에서 분리됨
 */
import { ALIGNMENT_LABELS, DIFFICULTY_LABELS } from './combatConstants.js';

/**
 * Inline SVG dice face renderer
 */
function renderDiceSVG(value, isSuccess) {
  const color = isSuccess ? '#50fa7b' : '#e94560';
  const dots = {
    1: [[50,50]],
    2: [[30,30],[70,70]],
    3: [[30,30],[50,50],[70,70]],
    4: [[30,30],[70,30],[30,70],[70,70]],
    5: [[30,30],[70,30],[50,50],[30,70],[70,70]],
    6: [[30,25],[70,25],[30,50],[70,50],[30,75],[70,75]],
  };
  const d = dots[value] || dots[1];
  const dotsSVG = d.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${color}"/>`).join('');
  return `<svg viewBox="0 0 100 100" width="56" height="56" style="filter: drop-shadow(0 0 8px ${color}44);">
    <rect x="5" y="5" width="90" height="90" rx="12" fill="#1a1a2e" stroke="${color}" stroke-width="2"/>
    ${dotsSVG}
  </svg>`;
}

/**
 * 주사위 애니메이션 HTML 생성
 */
export function renderDiceAnimation(data) {
  return `
    <div class="dice-animation">
      <div class="dice-rolling-container">
        <span class="dice-face-large">🎲</span>
        <span class="dice-rolling-number">?</span>
      </div>
      <div class="dice-check-info">
        ${data.statName} <strong>${data.statValue}</strong>
        <span class="dice-vs-preview">vs DC ${data.dc}</span>
      </div>
    </div>
  `;
}

/**
 * 판정 결과 HTML 생성
 */
export function renderFullResult(data) {
  const successClass = data.success ? 'result-success' : 'result-failure';
  const resultIcon = data.success
    ? '<span style="color:#50fa7b;font-size:24px;text-shadow:0 0 10px #50fa7b88">✓</span>'
    : '<span style="color:#e94560;font-size:24px;text-shadow:0 0 10px #e9456088">✗</span>';

  // HP 변동 표시
  let hpChangeHtml = '';
  if (data.effects) {
    data.effects.forEach(effect => {
      if (effect.type === 'modifyStat' && effect.stat === 'hp' && effect.value !== 0) {
        const sign = effect.value > 0 ? '+' : '';
        const cls = effect.value < 0 ? 'hp-loss' : 'hp-gain';
        hpChangeHtml += `<div class="result-hp-change ${cls}">HP ${sign}${effect.value}</div>`;
      }
    });
  }

  return {
    html: `
      <div class="result-dice ${successClass}">
        <div class="dice-roll">
          <span class="dice-icon">${renderDiceSVG(data.roll, data.success)}</span>
          <span class="dice-formula">d6(<strong>${data.roll}</strong>) + ${data.statName}(<strong>${data.statValue}</strong>) = <strong>${data.total}</strong></span>
          <span class="dice-vs">vs DC <strong>${data.dc}</strong></span>
        </div>
        <div class="dice-verdict">${resultIcon} ${data.success ? '성공!' : '실패...'}</div>
      </div>
      <div class="result-narrative">${data.resultText}</div>
      ${hpChangeHtml}
      <button class="result-continue-btn">계속 ▶</button>
    `,
    tookDamage: data.effects && data.effects.some(
      e => e.type === 'modifyStat' && e.stat === 'hp' && e.value < 0
    ),
  };
}

/**
 * 승리/패배 배너 HTML 생성
 */
export function renderEndBanner(data, isVictory) {
  if (isVictory) {
    let rewardsHtml = '';
    if (data.rewards && data.rewards.engrams) {
      rewardsHtml = `<div class="result-reward">💎 엔그램 +${data.rewards.engrams}</div>`;
    }
    return `
      <div class="combat-end-banner victory">
        <div class="end-icon">⚔️</div>
        <div class="end-text">승리!</div>
        ${rewardsHtml}
      </div>
    `;
  }

  return `
    <div class="combat-end-banner defeat">
      <div class="end-icon">💀</div>
      <div class="end-text">쓰러졌다...</div>
    </div>
  `;
}

/**
 * 선택지 라벨 파츠 생성
 */
export function buildChoiceLabelParts(choice) {
  const parts = [];
  if (ALIGNMENT_LABELS[choice.alignment]) {
    parts.push(ALIGNMENT_LABELS[choice.alignment]);
  }
  if (choice.dcModified) {
    parts.push(`${choice.statName} DC${choice.dc} (${choice.baseDc})`);
  } else {
    parts.push(`${choice.statName} DC${choice.dc}`);
  }
  return parts;
}
