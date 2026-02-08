# Changelog

## [0.2.0] - 2026-02-08

### 추가
- **로그라이크 메타 프로그레션**
  - `MetaProgression`: 영구 진행도 관리 (회차 수, 사망 수, 해금, 특전, 영구 스탯 보너스)
  - 사망 시 영구 보상 자동 부여 (HP +5, 3회 사망 시 공격+2, 5회 사망 시 방어+2)
  - `DeathScreen`: 사망 화면 UI (성과 표시 + 영구 보상 + 다시 시작)
  - 전투 패배 → DeathScreen → 새 회차 자동 흐름

- **메타 조건/효과 (SceneManager)**
  - 조건: `runGreaterThan`, `hasUnlock`, `hasPerk`, `deathCountGreaterThan`
  - 효과: `unlock`, `addPerk`, `addPermanentBonus`

- **타이틀 화면 확장**
  - 회차 정보 표시 (Run #N, 사망 수, 승리 수)
  - 특전 목록 확인 버튼 + 영구 보너스 요약

- **데모 씬 확장**
  - 2회차부터 열리는 "데자뷰 루트" (숨겨진 선택지)
  - 3회차부터 열리는 "협상 루트" (전투 없이 해결)
  - 5회 사망 시 특별 선택지 (공격력 부스트)
  - `__death__` 특수 씬 지원

### 변경
- `StateManager.reset()` → `reset(metaBonuses)` 확장 (영구 보너스 적용)
- `SceneManager` 생성자에 metaProgression 참조 추가
- `SaveLoadSystem` 세이브 데이터에 회차 번호 포함
- 전투 패배 시 defeatScene 대신 DeathScreen 경유

## [0.1.0] - 2026-02-08

### 추가
- **엔진 코어**
  - `StateManager`: 플레이어 스탯/인벤토리/플래그 관리 + 이벤트 구독 시스템
  - `SceneManager`: JSON 씬 로드, 조건 평가 (hasFlag/hasItem/statGreaterThan), 효과 적용
  - `DialogueRenderer`: 글자 단위 타이핑 효과 + 스킵 기능
  - `CombatSystem`: 턴제 전투 (공격/강타/아이템/도망), 데미지 계산, 적 AI, 보상 시스템
  - `SaveLoadSystem`: localStorage 3슬롯 세이브/로드 + 오토세이브

- **UI 모듈**
  - `TitleScreen`: 새 게임 / 이어하기 / 세이브 슬롯 선택
  - `DialogueBox`: 화자 이름 + 타이핑 텍스트 + 클릭/키보드 진행
  - `ChoiceButtons`: 선택지 (조건 미충족 시 비활성화, 키보드 단축키 1~9)
  - `StatsPanel`: HP/MP/EXP 바 + 레벨/골드 실시간 표시
  - `CombatUI`: 적 스프라이트 + HP바 + 액션 버튼 + 전투 로그
  - `InventoryPanel`: 아이템 목록/사용 (소비 아이템만)
  - `MenuBar`: 인벤토리/세이브/타이틀 버튼

- **데모 콘텐츠** (엔진 검증용)
  - 12개 씬: 인트로 → 앱 선택 분기 → 사무실 → 전투 → 엔딩 3종
  - 캐릭터 5명, 아이템 5종, 적 1종

- **CSS 픽셀아트 스타일**
  - 레트로 색상 팔레트, DotGothic16 폰트
  - 배경 8종 (거리/지하철/사무실/전투/엔딩 등)
  - 애니메이션: 타이핑, 페이드, 흔들림, 팝, 레벨업 플래시

- **프로젝트 설정**
  - Vite + Vanilla JS 구성
  - CLAUDE.md, CHANGELOG.md
