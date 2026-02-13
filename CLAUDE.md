> ⚠️ **글로벌 규칙 적용**: 절대 규칙, 보안, Git, 능동적 작업, 구현 완결성, 영향도 분석, 디버깅, 검증, 세션 프로토콜 등 공통 규칙은 `~/.claude/CLAUDE.md` 참조. 이 파일은 **프로젝트 고유 정보만** 담습니다.

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
│   │   ├── MenuBar.js       # 메뉴
│   │   ├── MapUI.js         # 지하철 노선도 (구역 이동)
│   │   ├── UpgradeUI.js     # 엔그램 주입 (스탯 강화)
│   │   └── CompanionPanel.js # 동료 패널
│   ├── data/                # JSON 게임 데이터
│   │   └── scenes/          # 씬 JSON (prologue, b1_pain, hub, ...)
│   ├── utils/helpers.js     # 공통 유틸
│   └── styles/              # CSS (main, dialogue, combat, animations, systems)
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
- `companionAlive`, `companionTrustGreaterThan`
- (메타) `runGreaterThan`, `hasUnlock`, `hasPerk`, `deathCountGreaterThan`

### 효과 타입
- `setFlag`, `addItem`, `removeItem`, `modifyStat`, `setStat`, `heal`, `fullHeal`
- `modifyKarma`, `addEngrams`, `loseMemory`, `addAbyssMemory`, `addCompanion`
- `modifyCompanionTrust`, `killCompanion`
- (메타) `unlock`, `addPerk`, `addPermanentBonus`

### 특수 씬 ID (nextScene에서 사용)
- `__title__` — 타이틀 화면으로
- `__death__` — 사망 처리
- `__map__` — 지하철 노선도 (구역 이동)
- `__upgrade__` — 엔그램 주입 (스탯 강화)
- `__rest__` — 플랫폼 0 휴식 (HP 전량 회복)
- `__hub__` — 허브 씬으로 이동

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
- **마지막 작업**: v0.9.0 완성도 강화 — 7단계 UX/UI 개선
  - **모바일 반응형**: CSS 변수 + 3단계 미디어 쿼리 (기본/태블릿≤820px/폰≤480px)
  - **오디오 시스템**: AudioManager.js — BGM/SFX (HTMLAudioElement, graceful degradation)
  - **설정 메뉴**: SettingsPanel.js — 텍스트 속도, 볼륨, 음소거, 오토세이브, 슬롯 삭제
  - **대화 로그**: DialogueLog.js — 최대 50개 엔트리, 📜 버튼 + L키 토글
  - **접근성**: focus-visible, aria-label, aria-live, role="dialog"
  - **오토세이브 인디케이터**: 💾 pulse 애니메이션
  - **씬 전환**: 2단계 페이드 오버레이 (fade/combat/glitch 3타입)
  - **메뉴바 확장**: 🎒 👥 📜 💾 ⚙️ 🏠 (6버튼 + 저장 인디케이터)
- **다음 작업**:
  1. **동료 10명으로 확장** — 사용자가 캐릭터 설정 완료 후 JSON 추가
  2. **이미지 연결** — 사용자가 이미지 만들면 CSS/JS에 연결
  3. **오디오 파일 추가** — public/audio/bgm/, public/audio/sfx/ 에 파일 배치
  4. **밸런싱** — 각 보스 DC 조정, 엔그램 획득량 조정
