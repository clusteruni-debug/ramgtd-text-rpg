/**
 * testCombat - 전투 테스트용 데이터
 * Game.js에서 분리됨
 */

export const testEnemy = { name: '연습용 더미', sprite: 'default' };

export const testRounds = [
  {
    text: '연습용 더미가 서 있다. 공격 방법을 선택하라.',
    choices: [
      {
        text: '주먹으로 때린다',
        check: { stat: 'body', dc: 4 },
        alignment: 'neutral',
        karmaShift: 0,
        success: { text: '단단한 주먹이 더미를 강타했다!', effects: [], endCombat: false },
        failure: { text: '허공을 쳤다. 더미가 흔들린다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -3 }] },
      },
      {
        text: '약점을 분석한다',
        check: { stat: 'reason', dc: 6 },
        alignment: 'neutral',
        karmaShift: 0,
        success: { text: '균열을 발견했다! 정확히 가격한다.', effects: [], endCombat: false },
        failure: { text: '분석이 빗나갔다. 반동으로 팔이 저리다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -5 }] },
      },
      {
        text: '"그만두자"고 설득한다',
        check: { stat: 'bond', dc: 8 },
        alignment: 'light',
        karmaShift: 5,
        success: { text: '더미가... 고개를 끄덕였다? 전투 종료.', effects: [], endCombat: true },
        failure: { text: '더미는 듣지 않는다. 당연하지.', effects: [{ type: 'modifyStat', stat: 'hp', value: -3 }] },
      },
    ],
  },
  {
    text: '더미가 반격 자세를 취한다! 위협적인 기운이 느껴진다.',
    choices: [
      {
        text: '몸을 굴려 피한다',
        check: { stat: 'sense', dc: 5 },
        alignment: 'neutral',
        karmaShift: 0,
        success: { text: '민첩하게 회피했다!', effects: [] },
        failure: { text: '굴렸지만 맞았다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -7 }] },
      },
      {
        text: '정면으로 받아친다 (위험)',
        check: { stat: 'body', dc: 8 },
        alignment: 'dark',
        karmaShift: -5,
        success: { text: '강인한 체력으로 반격을 막아내고 되받아쳤다!', effects: [], endCombat: true },
        failure: { text: '무모했다. 큰 충격이 온 몸을 관통한다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -10 }] },
      },
    ],
  },
  {
    text: '더미가 마지막 힘을 모은다. 결정적 순간이다.',
    choices: [
      {
        text: '냉정하게 빈틈을 노린다',
        check: { stat: 'reason', dc: 7 },
        alignment: 'neutral',
        karmaShift: 0,
        success: { text: '완벽한 타이밍! 더미가 무너진다.', effects: [] },
        failure: { text: '계산이 빗나갔다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -5 }] },
      },
      {
        text: '온 힘을 다해 돌진한다',
        check: { stat: 'body', dc: 6 },
        alignment: 'dark',
        karmaShift: -3,
        success: { text: '거침없는 돌진! 더미가 산산조각 났다.', effects: [] },
        failure: { text: '기세는 좋았지만 빗나갔다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -7 }] },
      },
      {
        text: '더미의 핵심을 감지한다',
        check: { stat: 'sense', dc: 7 },
        alignment: 'light',
        karmaShift: 3,
        success: { text: '감각이 핵심을 포착했다! 정확히 일격.', effects: [] },
        failure: { text: '감각이 흐려졌다. 집중이 흐트러진다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -5 }] },
      },
    ],
  },
];

export const testRewards = { engrams: 15 };
