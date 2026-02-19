# Changelog

## [2026-02-11] 콘텐츠 대량 확장 — 146씬 → 217씬 (+71씬)

### 목표
- 플레이타임 ~1시간 45분 → ~3시간 (꼼꼼 탐색 기준)

### 챕터 1 확장 (20→27씬)
- **ACT 1 +3씬**: 감정 파이프라인 시연(ch1_02b), 엔그램/안내자 설명(ch1_03b), 안내자의 기억(ch1_04b)
- **ACT 2 +4 탐색 포인트**: 잠든 아이 영혼(ch1_child), 낙서 벽(ch1_graffiti), 대기열(ch1_queue), 지친 영혼 후속 대화(ch1_weary_02)

### A지구 확장 (19→35씬)
- **신규 탐색 4곳**: 위스퍼넷(whisper_net), 검열 박물관(museum), 소리정원(sound_garden), 딸의 방(daughter_room)
- **소연 동료 퀘스트 6씬**: 자료실 → 편집장 대면 → 용서/선택 분기 (soyeon_quest_*)

### B지구 확장 (25→39씬)
- **신규 탐색 4곳**: 휴게실(breakroom), 서버실(server_room), 99층(floor99), 저항모임(resistance)
- **민준 동료 퀘스트 6씬**: 서버 → 기억 발견 → 파괴/코드 분기 (minjun_quest_*)

### C지구 확장 (17→33씬)
- **신규 탐색 5곳**: 수정 동굴(crystal_trail), 놀이터(playground), 707호(apt707), 우편함(mailbox), 관리사무소(management)
- **신규 전투**: 서리 드론(frost_drone) — 양초 특수 공격

### D지구 확장 (21→31씬)
- **신규 탐색 4곳**: 벽화(mural), 지지모임(support_group), 대장간(forge), 옛 식당(old_restaurant)

### 허브 확장 (8→16씬)
- **안내자 진행 대화 4단계**: 초반/A클리어 후/B클리어 후/최종 (guide_progress → guide_early/after_a/after_b/final)
- **해방된 영혼 NPC 3명**: A지구(freed_soul_a), B지구(freed_soul_b), D지구 셰프 노점(chef_stall, HP+10)

### 검증
- `npm run build` 성공
- nextScene 참조 393개 전부 유효 (특수 토큰 7개 제외)
- 총 217씬, 12전투

---

## [2026-02-11] 챕터 1: 플랫폼 0의 규칙

### 추가
- **챕터 1 스토리** (`chapter1.json`) — 20씬
  - ACT 1: 안내자의 텐트 (5씬) — 심연/지구/기억/죽음 세계관 설명
  - ACT 2: 플랫폼 0 탐색 (5씬) — 지친 영혼, 자판기 인간, 벽돌 NPC 대화
  - ACT 3: 분류 심사 (8씬) — 비전투 심사 질문 3개 + 전투 보스 2라운드
  - ACT 4: 챕터 종료 (2씬) — 게이트 개방 + 안내자 작별
- **신규 적**: 분류 심사관 (classification_examiner) — elite tier, threatLevel 2
- **지하철 해금 조건**: hub에서 subway_unlocked 플래그 필요

### 변경
- 프롤로그(prologue_12) → 허브 직행에서 → 챕터 1(ch1_01) 경유로 변경
- Game.js: b1_pain → chapter1 씬 로드로 교체

### 삭제
- B1 고통의 층 (`b1_pain.json`) — 43씬 전부 제거 (기억의 복도, 울음의 방, 침묵의 길, 수집가 보스)

---

## [2026-02-11] 세션: 완성도 강화 — 7단계 UX/UI

### 완료
- **모바일 반응형**: CSS 변수 + 3단계 미디어 쿼리 (기본/태블릿≤820px/폰≤480px), 5개 CSS 파일 전체 반응형 처리
- **오디오 시스템**: AudioManager.js — HTMLAudioElement 기반 BGM(loop)/SFX(oneshot), 파일 없으면 조용히 무시 (graceful degradation)
- **설정 메뉴**: SettingsPanel.js — 텍스트 속도(10-80ms), BGM/SFX 볼륨, 전체 음소거, 오토세이브 토글, 세이브 슬롯 삭제
- **대화 로그**: DialogueLog.js — 최대 50개 엔트리 스크롤백, 📜 메뉴 버튼 + L키 토글, ESC 닫기
- **접근성**: focus-visible 글로벌 스타일, aria-label/aria-live/role="dialog" (MenuBar, ChoiceButtons, CombatUI, TitleScreen, InventoryPanel, CompanionPanel, Toast)
- **오토세이브 인디케이터**: 💾 save-pulse 애니메이션 (저장 시 1.5초 표시)
- **씬 전환 연출**: 2단계 오버레이 (fade in → 배경 교체 → fade out), 3타입 (fade=검정300ms, combat=빨강150ms, glitch=스트라이프150ms)
- **메뉴바 확장**: 🎒 👥 📜 💾 ⚙️ 🏠 (6버튼 + 저장 인디케이터)

### 다음 세션
- 동료 10명 확장 (사용자 캐릭터 설정 후 JSON 추가)
- 이미지 연결 (초상화/배경/스프라이트)
- 오디오 파일 추가 (public/audio/bgm/, public/audio/sfx/)
- 밸런싱 (DC 조정, 엔그램 획득량)

---

## [2026-02-11] 세션: 엔진 인프라 강화

### 완료
- 동료 시스템 확장: 스킬 데이터(characters.json), 충전 관리(StateManager), 초상화 UI(CompanionPanel)
- enemies.json 전투 수치 구조: 12개 적에 tier/rewards/threatLevel + CombatUI 위협도 배지
- 아이템 멀티이펙트 지원 + 신규 아이템 3종 (엔그램 결정, 정화의 향, 심연의 샘물)
- 엔딩별 메타 보상: 4종 영구 특전 + TitleScreen 도달/미도달 표시 + hasReachedEnding 조건
- CHANGELOG 복구: v0.4.0~v0.8.0 5개 버전 엔트리 복원
- 맵 UI 개선: 지하철 노선도 스타일 (CSS 원형 마커, 호버 glow, 정화/잠금 뱃지)
- 전투 UI 연출 강화: 주사위 감속 체인, 성공/실패 glow, 데미지 팝업, HP 플래시
- 동료 스킬 전투 연동: DC 모디파이어 토글, 충전 차감, 스킬 바 UI

---

## [0.8.0] - 2026-02-10

### 보스전 + 4결말 + 엔딩 메타 + 초상화
메인 스토리 라인 완성 — 4대 구역 정화 → 터미널 → 서버실 → 4가지 결말.

### 추가
- **터미널** (`terminal.json`) — 7씬
  - 4카드 인증 게이트 → 역장 대화/협상
  - 역장 보스전: 3라운드 (유령열차/시간정지/최종열차)
- **서버실** (`core.json`) — 8씬
  - 중앙행 열차 → 서버실 진입 → 시장 대화 3단계
  - 시장 최종 보스전: 4라운드 (데이터 스트림/중력/감정삭제/포맷)
- **4가지 결말** (`ending.json`) — 5씬
  - 원점회귀(bittersweet) / 이방인(hopeful) / 헌신(tragic) / 잔류(peaceful)
- **엔딩 메타 추적**: MetaProgression에 엔딩 도달 기록, TitleScreen에 결말 수집 현황 표시
- **캐릭터 초상화 시스템**: DialogueBox 좌측에 초상화 표시 (그라데이션 오버레이)
- 캐릭터 2명 추가 (역장, 시장), 적 2종 추가 (역장, 시장)
- 타이틀: "심연 (The Abyss)"

### 변경
- 허브: 4카드 수집 시 터미널 입장 선택지 추가
- `gameConfig.json`: 버전 0.8.0
- `Game.js`: 씬 전환 디바운스 200ms로 수정 (영구 락 버그 해결)

## [0.7.0] - 2026-02-10

### 4대 구역 콘텐츠 완성

### 추가
- **A지구: 침묵의 멘션** (`district_a.json`) — ~25씬
  - 소연 영입, 검열 드론 전투, 사서 보스전
- **B지구: 철의 오피스** (`district_b.json`) — ~25씬
  - 민준 영입, 검표원 전투, 현장 소장 보스전
- **C지구: 동결 아파트** (`district_c.json`) — ~18씬
  - 203동 가족, 울음소녀, 동면 관리자 보스전
- **D지구: 적색 번화가** (`district_d.json`) — ~20씬
  - 파이트클럽, 용광로클럽, 주방장 보스전
- 캐릭터 16명, 적 10종, 아이템 17개
- 구역 해금: A/B클리어 → C해금, C클리어 → D해금

### 변경
- 허브 9개 씬 확장 (자판기 상점, NPC)
- B1 → 허브 스토리 연결

### 수정
- ChoiceButtons 키보드 핸들러 누수 수정
- 씬 전환 락 버그 수정

## [0.6.0] - 2026-02-10

### 게임 시스템 완성 — 맵/업그레이드/동료/허브
스토리 JSON만 추가하면 바로 플레이 가능한 엔진 완성.

### 추가
- **MapUI**: 지하철 노선도 (4개 행정구역 이동, 잠금/해금/정화 상태)
- **UpgradeUI**: 엔그램으로 스탯 강화 (비용 = 현재값 × 10)
- **CompanionPanel**: 동료 목록, 신뢰도 바, 스킬, 영구사망 표시
- 허브 씬: Platform 0 텐트촌 (이동/강화/휴식/탐색)
- 특수 씬 ID: `__map__`, `__upgrade__`, `__rest__`, `__hub__`
- SceneManager: companionAlive, companionTrustGreaterThan 조건
- SceneManager: fullHeal, modifyCompanionTrust, killCompanion 효과
- StateManager: 동료 신뢰도/사망 메서드
- `gameConfig.json`: 4개 구역 데이터 + hubScene 설정
- `systems.css` 신규 (맵/업그레이드/동료/허브/토스트 스타일)

## [0.5.0] - 2026-02-09

### 전투 UI 강화 + 테스트 모드

### 추가
- 주사위 굴림 애니메이션 (숫자 회전 → 정착 → 결과 공개)
- 선택지에 난이도 레이블(쉬움/보통/어려움/극한) + 성공확률(%) 표시
- 전투 중 HP 미니 바 + 라운드 표시 (1/3)
- 피해 시 화면 흔들림, 성공 시 적 피격 플래시
- 난이도별 색상 코딩 (초록/노랑/빨강/보라)
- 타이틀에 '전투 테스트' 버튼 추가 (3라운드, 4스탯, 명/암 선택지)
- `docs/the_abyss_gdd_v2.md` 기획 문서

## [0.4.0] - 2026-02-09

### 전투 시스템 전면 교체 — GDD v2
턴제 ATK/DEF 전투를 d6+스탯≥DC 판정 시스템으로 전면 교체.

### 변경
- **전투**: 턴제 ATK/DEF → d6+스탯≥DC 판정 + 선택지 기반
- **스탯**: HP/MP/ATK/DEF/SPD → HP 20 + Body/Sense/Reason/Bond (1~5)
- 카르마 게이지 (-100~+100), 엔그램 (성장 자원)
- 현실 기억 10개 (사망 시 소멸, 0개 = 벽돌화 게임오버)
- 사망 → 그 자리 부활
- 전투 rounds 추가 (그림자 1R, 수집가 3R)

### 추가
- `docs/DESIGN.md` (GDD v2 원본)

## [0.3.0] - 2026-02-09

### 세계관 교체: "심연 (The Abyss)"
기존 데모 스토리(회사원 김직장/박부장)를 전부 교체.
플레인스케이프: 토먼트에서 영감을 받은 철학적 텍스트 RPG.

**핵심 질문**: "인간이 변하려면 무엇이 필요한가?"

### 추가
- **프롤로그** (`prologue.json`) — 8씬
  - 폐역 각성 → 메모 발견 → 안내자 만남 → 심연 진입
  - 회차별 분기: 1회차 vs 2회차+ 메모 내용/안내자 대사 변경
  - 2회차+ 안내자 인식 루트 (영구 스피드 보너스)

- **B1 고통의 층** (`b1_pain.json`) — 28씬
  - 3갈래 루트 선택:
    - **기억의 복도**: 과거 기억 직면/외면 선택, 그림자 자아 전투
    - **울음의 방**: 상실자 NPC (돕기/동행/무시), 동료 획득 가능
    - **침묵의 길**: 고통 없는 세계의 공허함, 거울 속 목소리(B3 복선)
  - 2회차+ 침묵의 길 숨겨진 분기
  - **보스: 고통의 수집가** — 3가지 해결법:
    - 전투: 어려운 전투 (HP 150, ATK 18)
    - 대화: 특정 플래그 조합 필요 (공감 루트)
    - 굴복: 스탯 영구 손실 (maxHp, attack)

- **캐릭터 6종**: 안내자, 메모, 상실자, 수집가, 거울 속 목소리, 주인공
- **적 2종**: 그림자 자아 (일반), 고통의 수집가 (보스)
- **아이템 5종**: 낡은 메모, 바래진 사진, 진통제, 쓴 물, 기억의 파편
- **배경 CSS 7종**: 심연 공허, 폐역, 기억의 복도, 울음의 방, 침묵의 길, 중앙홀, 보스전

### 변경
- `gameConfig.json`: 타이틀 "심연", 스탯 하향 (HP 80, ATK 7)
- `Game.js`: demo.json → prologue.json + b1_pain.json 로드

### 삭제
- `demo.json` (기존 회사원 스토리)
- 기존 캐릭터/아이템/적 데이터 (김직장, 박부장 등)
- 기존 배경 CSS (거리, 지하철, 사무실 등)

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
