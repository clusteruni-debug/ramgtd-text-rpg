# Text RPG Engine

## 스택
Vite + Vanilla JS (외부 의존성 없음)

## 실행
```bash
npm run dev      # 개발 서버
npm run build    # 빌드
```

## 구조
```
src/
├── Game.js              # 메인 게임 클래스 (모듈 조율, ~675줄)
├── engine/
│   ├── StateManager.js
│   ├── SceneManager.js
│   ├── CombatSystem.js
│   ├── DialogueRenderer.js
│   ├── SaveLoadSystem.js
│   ├── MetaProgression.js
│   ├── AudioManager.js
│   └── DeathHandler.js      # 사망 처리 로직 (Game.js에서 분리)
├── ui/
│   ├── CombatUI.js          # 전투 UI 메인
│   ├── combatConstants.js   # 전투 UI 상수 (CombatUI에서 분리)
│   ├── combatRenderers.js   # 전투 UI 렌더링 헬퍼 (CombatUI에서 분리)
│   ├── DialogueBox.js, ChoiceButtons.js, StatsPanel.js
│   ├── MapUI.js, UpgradeUI.js, CompanionPanel.js
│   ├── TitleScreen.js, DeathScreen.js, MenuBar.js
│   ├── InventoryPanel.js, SettingsPanel.js, DialogueLog.js
│   └── ...
├── data/
│   ├── scenes/              # 씬 JSON 파일들
│   ├── testCombat.js        # 전투 테스트 데이터 (Game.js에서 분리)
│   ├── characters.json, items.json, enemies.json, gameConfig.json
│   └── ...
├── utils/helpers.js
└── styles/
    ├── main.css             # :root 변수, 리셋, 공통 스타일
    ├── backgrounds.css      # 배경 그라데이션/이미지 (main.css에서 분리)
    ├── stats-panel.css      # 스탯 바 + 스탯 패널 (main.css에서 분리)
    ├── dialogue.css         # 대화창 + 선택지
    ├── title.css            # 타이틀 화면 (dialogue.css에서 분리)
    ├── save.css             # 세이브 슬롯/다이얼로그 (dialogue.css에서 분리)
    ├── menu-bar.css         # 메뉴 바 (dialogue.css에서 분리)
    ├── perks.css            # 특전 패널 (dialogue.css에서 분리)
    ├── combat.css           # 배럴: combat-layout + combat-animations + death
    ├── combat-layout.css    # 전투 레이아웃/선택지/결과 (combat.css에서 분리)
    ├── combat-animations.css # 주사위/데미지 애니메이션 (combat.css에서 분리)
    ├── death.css            # 사망 화면 (combat.css에서 분리)
    ├── animations.css       # 공통 애니메이션 + 인벤토리 + 토스트 + 씬전환
    ├── systems.css          # 배럴: map + upgrade + companion + hub + rest + dialogue-log + settings
    ├── map.css              # 지도 UI (systems.css에서 분리)
    ├── upgrade.css          # 업그레이드 UI (systems.css에서 분리)
    ├── companion.css        # 동료 패널 (systems.css에서 분리)
    ├── hub.css              # 허브 메뉴 (systems.css에서 분리)
    ├── rest.css             # 휴식 화면 (systems.css에서 분리)
    ├── dialogue-log.css     # 대화 로그 (systems.css에서 분리)
    └── settings.css         # 설정 패널 (systems.css에서 분리)
```

## 씬 JSON 스키마 (핵심)
```json
{
  "id": "scene_id",
  "type": "dialogue | combat | ending",
  "speaker": "character_id",
  "text": "대사",
  "choices": [{
    "text": "선택지",
    "conditions": [{ "type": "hasFlag", "flag": "key" }],
    "effects": [{ "type": "modifyStat", "stat": "hp", "value": -10 }],
    "nextScene": "next_id"
  }]
}
```

## 특수 씬 ID
`__title__`, `__death__`, `__map__`, `__upgrade__`, `__rest__`, `__hub__`

## 고유 규칙
- 게임 기획: docs/DESIGN.md가 기준 (전투/스탯/카르마 수치)
- 엔진 코드와 데이터(JSON) 분리 유지
- 새 스토리: src/data/scenes/에 JSON 추가

## 현재 상태
- 마지막: v0.9.0 완성도 강화 (모바일/오디오/설정/대화로그/접근성/씬전환)
- 다음: 동료 10명 확장, 이미지/오디오 파일 추가, 밸런싱

## 참조
- CC/CX 파일 담당: agent_docs/domain-map.md
