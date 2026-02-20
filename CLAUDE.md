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
├── Game.js              # 메인 게임 클래스 (모듈 조율)
├── engine/              # StateManager, SceneManager, CombatSystem, SaveLoad, MetaProgression
├── ui/                  # DialogueBox, ChoiceButtons, StatsPanel, CombatUI, MapUI, etc.
├── data/scenes/         # 씬 JSON 파일들
├── utils/helpers.js
└── styles/
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
