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
│   │   ├── CombatSystem.js  # 턴제 전투
│   │   ├── SaveLoadSystem.js    # localStorage 세이브/로드
│   │   └── MetaProgression.js   # 영구 진행도 (로그라이크 메타)
│   ├── ui/
│   │   ├── DialogueBox.js   # 대화창
│   │   ├── ChoiceButtons.js # 선택지
│   │   ├── StatsPanel.js    # HP/MP/레벨
│   │   ├── CombatUI.js      # 전투 화면
│   │   ├── InventoryPanel.js # 인벤토리
│   │   ├── TitleScreen.js   # 타이틀 (회차 정보/특전 포함)
│   │   ├── DeathScreen.js   # 사망 화면 (로그라이크)
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

### 조건 타입
- `hasFlag`, `hasItem`, `statGreaterThan`, `statLessThan`, `goldGreaterThan`
- (메타) `runGreaterThan`, `hasUnlock`, `hasPerk`, `deathCountGreaterThan`

### 효과 타입
- `setFlag`, `addItem`, `removeItem`, `modifyStat`, `setStat`, `addExp`, `addGold`, `heal`
- (메타) `unlock`, `addPerk`, `addPermanentBonus`

## 🔧 개발

```bash
npm run dev    # 개발 서버
npm run build  # 빌드
```

## 📌 규칙
- 새 스토리는 `src/data/scenes/` 폴더에 JSON 추가
- 엔진 코드와 데이터(JSON) 분리 유지
- CSS 변수 활용 (커스텀 테마 가능)

---

## 🔄 현재 세션 상태
- **마지막 작업**: v0.3.0 세계관 교체 — "심연 (The Abyss)"
  - 기존 데모 스토리(회사원) 전체 교체
  - 프롤로그 8씬 + B1 고통의 층 28씬 구현
  - 캐릭터 6종, 적 2종, 아이템 5종, 배경 CSS 7종
  - 3갈래 루트 + 보스 3가지 해결법 (전투/대화/굴복)
  - 회차별 분기, 메타 효과, 숨겨진 루트 포함
- **다음 작업**: B2 변화의 층 스토리 설계
