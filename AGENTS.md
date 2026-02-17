# Text RPG Engine (심연) — AGENTS.md

> 글로벌 규칙: `~/.codex/instructions.md` 참조

## 개요
- **스택**: Vite + Vanilla JS (외부 의존성 없음)
- **배포**: 로컬 전용
- **DB**: localStorage (세이브/로드)

## 디렉토리 구조
- `src/engine/` — 게임 엔진 코어
- `src/ui/` — UI 렌더링
- `src/data/scenes/` — JSON 기반 씬 데이터

## 주의사항
- JSON 데이터 기반 설계 — 씬/이벤트 추가 시 JSON만 수정
- 메타 프로그레션 시스템 (로그라이크 영구 진행도)
- localStorage 단독 사용 허용 (오프라인 전용 프로젝트)
