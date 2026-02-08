# Text RPG Engine

## 📋 프로젝트 개요
- **이름**: Text RPG Engine
- **스택**: Vite + Vanilla JS (외부 의존성 없음)
- **목적**: JSON 기반 웹 텍스트 RPG 엔진
- **세계관**: 현대/일상 + 픽셀아트 감성

---

## 📁 구조

```
text-rpg/
├── src/
│   ├── main.js              # 엔트리 포인트
│   ├── Game.js              # 메인 게임 클래스 (모듈 조율)
│   ├── engine/
│   │   ├── StateManager.js  # 플레이어 스탯/인벤토리/플래그 + 이벤트
│   │   ├── SceneManager.js  # 씬 로드, 조건 평가, 효과 적용
│   │   ├── DialogueRenderer.js  # 타이핑 효과
│   │   ├── CombatSystem.js  # 턴제 전투
│   │   └── SaveLoadSystem.js    # localStorage 세이브/로드
│   ├── ui/
│   │   ├── DialogueBox.js   # 대화창
│   │   ├── ChoiceButtons.js # 선택지
│   │   ├── StatsPanel.js    # HP/MP/레벨
│   │   ├── CombatUI.js      # 전투 화면
│   │   ├── InventoryPanel.js # 인벤토리
│   │   ├── TitleScreen.js   # 타이틀
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

### 효과 타입
- `setFlag`, `addItem`, `removeItem`, `modifyStat`, `setStat`, `addExp`, `addGold`, `heal`

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
- **마지막 작업**: v0.1.0 엔진 골격 + 데모 씬 5개 완성
- **다음 작업**: 없음 (기본 엔진 완성)
