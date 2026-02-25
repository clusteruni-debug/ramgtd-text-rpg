/**
 * DeathHandler - 사망 처리 로직
 * GDD v2: 그 자리에서 부활, 현실 기억 1개 소멸
 * Game.js에서 분리됨
 */

/**
 * 사망 시 기억 소멸 + 메타 보상 처리
 * @param {StateManager} stateManager
 * @param {MetaProgression} metaProgression
 * @returns {{ lostMemory, remaining, isGameOver }}
 */
export function processDeath(stateManager, metaProgression) {
  // 현실 기억 소멸
  const lostMemory = stateManager.loseRealMemory();
  const remaining = stateManager.getRealMemoryCount();
  const isGameOver = remaining === 0;

  // 메타 기록
  metaProgression.recordDeath();

  // 사망 횟수 기반 영구 보상
  const deaths = metaProgression.data.totalDeaths;
  if (deaths === 3 && !metaProgression.hasPerk('resilient')) {
    metaProgression.addPerk('resilient', {
      name: '불굴의 의지',
      description: '여러 번의 패배로 단련됨',
    });
    metaProgression.addPermanentBonus('body', 1);
  }
  if (deaths === 5 && !metaProgression.hasPerk('sharp_sense')) {
    metaProgression.addPerk('sharp_sense', {
      name: '날카로운 감각',
      description: '수많은 위기가 감각을 예리하게 만들었다',
    });
    metaProgression.addPermanentBonus('sense', 1);
  }

  metaProgression.save();

  // HP 회복 (부활 준비)
  if (!isGameOver) {
    stateManager.setStat('hp', stateManager.getStat('maxHp'));
  }

  return { lostMemory, remaining, isGameOver };
}
