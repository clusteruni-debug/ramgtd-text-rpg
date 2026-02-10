# Text RPG Engine

## 📋 프로젝트 개요
- **이름**: Text RPG Engine
- **스택**: Vite + Vanilla JS (외부 의존성 없음)
- **목적**: JSON 기반 웹 텍스트 RPG 엔진
- **세계관**: "심연 (The Abyss)" — 플레인스케이프 토먼트 영감, 철학적 RPG

---

## 📁 구조

```
text-rpg/
├── src/
│   ├── main.js              # 엔트리 포인트
│   ├── Game.js              # 메인 게임 클래스 (모듈 조율)
│   ├── engine/
│   │   ├── StateManager.js  # 플레이어 스탯/인벤토리/플래그 + 이벤트
│   │   ├── SceneManager.js  # 씬 로드, 조건 평가, 효과 적용 (메타 조건 포함)
│   │   ├── DialogueRenderer.js  # 타이핑 효과
│   │   ├── CombatSystem.js  # d6+스탯≥DC 전투
│   │   ├── SaveLoadSystem.js    # localStorage 세이브/로드
│   │   └── MetaProgression.js   # 영구 진행도 (로그라이크 메타)
│   ├── ui/
│   │   ├── DialogueBox.js   # 대화창
│   │   ├── ChoiceButtons.js # 선택지
│   │   ├── StatsPanel.js    # HP/능력치/카르마/기억/엔그램
│   │   ├── CombatUI.js      # 전투 화면
│   │   ├── InventoryPanel.js # 인벤토리
│   │   ├── TitleScreen.js   # 타이틀 (회차 정보/특전 포함)
│   │   ├── DeathScreen.js   # 사망 → 기억 소멸 → 부활/벽돌화
│   │   └── MenuBar.js       # 메뉴
│   ├── data/                # JSON 게임 데이터
│   ├── utils/helpers.js     # 공통 유틸
│   └── styles/              # CSS (main, dialogue, combat, animations)
```

## 🎮 데이터 구조

### 씬 JSON
```json
{
  "id": "scene_id",
  "type": "dialogue | combat | ending",
  "background": "bg_name",
  "speaker": "character_id 또는 직접 텍스트",
  "text": "대사",
  "choices": [{
    "text": "선택지",
    "conditions": [{ "type": "hasFlag", "flag": "key" }],
    "effects": [{ "type": "modifyStat", "stat": "hp", "value": -10 }],
    "nextScene": "next_id"
  }]
}
```

### 전투 씬 JSON (GDD v2)
```json
{
  "type": "combat",
  "enemy": "enemy_id",
  "introText": "전투 시작 텍스트",
  "victoryScene": "next_scene",
  "rewards": { "engrams": 10 },
  "rounds": [{
    "text": "라운드 상황 묘사",
    "choices": [{
      "text": "선택지",
      "check": { "stat": "body|sense|reason|bond", "dc": 5 },
      "alignment": "neutral|light|dark",
      "karmaShift": 0,
      "success": { "text": "성공 서술", "effects": [], "endCombat": false },
      "failure": { "text": "실패 서술", "effects": [{ "type": "modifyStat", "stat": "hp", "value": -5 }] }
    }]
  }]
}
```

### 조건 타입
- `hasFlag`, `hasItem`, `statGreaterThan`, `statLessThan`
- `karmaGreaterThan`, `karmaLessThan`, `realMemoryGreaterThan`, `engramGreaterThan`, `hasCompanion`
- (메타) `runGreaterThan`, `hasUnlock`, `hasPerk`, `deathCountGreaterThan`

### 효과 타입
- `setFlag`, `addItem`, `removeItem`, `modifyStat`, `setStat`, `heal`
- `modifyKarma`, `addEngrams`, `loseMemory`, `addAbyssMemory`, `addCompanion`
- (메타) `unlock`, `addPerk`, `addPermanentBonus`

## 🔧 개발

```bash
npm run dev    # 개발 서버
npm run build  # 빌드
```

## 📌 규칙
- 게임 기획 문서는 `docs/DESIGN.md`를 참조할 것. 전투/스탯/카르마 등 모든 시스템 수치는 이 문서가 기준.
- 새 스토리는 `src/data/scenes/` 폴더에 JSON 추가
- 엔진 코드와 데이터(JSON) 분리 유지
- CSS 변수 활용 (커스텀 테마 가능)

---

## 🔌 MCP 서버 & 🔒 세션 잠금

> [워크스페이스 CLAUDE.md](../CLAUDE.md) 참고 (글로벌 설정)

---

## 🔄 현재 세션 상태
- **마지막 작업**: v0.4.0 전투 시스템 전면 교체 (GDD v2 기준)
  - 전투: 턴제 ATK/DEF → d6+스탯≥DC 판정 시스템
  - 스탯: HP/MP/ATK/DEF/SPD → HP 20 + Body/Sense/Reason/Bond (1~5)
  - 카르마 게이지 (-100~+100), 엔그램 (성장 자원), 현실 기억 10개 (사망 시 소멸)
  - 사망 → 그 자리 부활 + 기억 1개 소멸, 기억 0 = 벽돌화 (게임 오버)
  - 전투 씬 rounds 추가: 그림자 자아 1라운드, 고통의 수집가 3라운드
  - 변경 파일 17개 (엔진 6 + UI 5 + CSS 2 + JSON 3 + CLAUDE.md)
- **다음 작업**:
  1. **이미지 연결** — 사용자가 이미지 만들면 CSS/JS에 연결 (IMAGE_LIST.md 참고)
  2. **B2 변화의 층** 스토리 설계 + 구현
  3. **B3 선택의 층** 스토리 설계 (거울 속 목소리 본격 등장)
  4. **사운드/효과음** 추가 검토
