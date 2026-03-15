# The Abyss — Master Scene Flow v1.0

> 이 문서는 게임의 모든 씬을 플레이 순서대로 나열합니다.
> ✅ = 기존 씬 유지  |  ✏️ = 기존 씬 수정  |  🆕 = 신규 씬
> Reference: STORY_SPINE.md (모티프/콜백), COMPANION_BIBLE.md (동료 상세)

---

## PROLOGUE (16 scenes — ✅ 전부 유지)

```
prologue_01 → prologue_02 → prologue_03 → prologue_03_land
  → prologue_04 → prologue_05 → prologue_06a/06b/06c
  → prologue_07 → prologue_08 → prologue_combat
  → prologue_09 → prologue_10 → prologue_11 → prologue_12
```

✏️ **prologue_01 수정사항:**
- 기존: "오후 6시 47분. 서울 어딘가의 지하철역."
- 추가 나레이션: "오늘도 별일 없는 하루였다." → **모티프 시작** (Ending D에서 콜백)
- 주인공 내면: "뒷주머니의 핸드폰에 읽지 않은 카톡이 3개 있었다. 내일 보려고 했다." → **"다음에" 모티프 심기**

✏️ **prologue_12 수정사항:**
- 기존: 가이드 만남 후 챕터 1로 전환
- 추가: 가이드 대사 수정 — "이름이 뭐야? ...아, 여기선 이름 같은 건 의미 없지." → **Ending D 콜백 심기**

나머지 14개 씬: ✅ 그대로 유지

---

## CHAPTER 1: PLATFORM 0 (27 scenes — 대부분 유지, 일부 수정)

```
ch1_01 ~ ch1_05 → ch1_explore → (exploration branches)
  → ch1_gate_blocked → ch1_guide_ready → ch1_gate_enter
  → ch1_exam_01~03 → ch1_exam_result → ch1_combat
  → ch1_gate_open → ch1_guide_farewell → ch1_complete
```

✏️ **ch1_05 (텐트촌 탐험) 수정:**
- 🆕 미선 등장 삽입: 텐트촌 구석에서 영혼들을 돌보는 여자 추가
- 대사 없이 배경 묘사만: "한쪽에서 연두색 앞치마를 입은 여자가 누군가의 이마를 닦아주고 있다. 수건을 들고."
- 영입은 아직 안 됨 — 존재만 인지시킴

✏️ **ch1_complete (챕터 1 완료) 수정:**
- 🆕 미선 첫 접촉 씬 추가: 검표원 전투 후 상처 입은 주인공에게 다가옴
- "검표원이랑 싸웠구나? 어디 봐." (상처 치료)
- "밥은 먹었어?" → **모티프 3 첫 등장**
- 영입 아님 — "나는 여기 있을게. 조심해, 얘야."

나머지 씬: ✅ 그대로

---

## HUB: PLATFORM 0 (17 existing + 🆕 16 new = 33 scenes)

### 기존 씬 (✅/✏️)

```
hub_platform0 (메인 허브 메뉴)
hub_look_around → hub_npc_weary/hub_vending/hub_guide_progress/...
```

✏️ **hub_platform0 수정:**
- 동료 관련 선택지 추가:
  - "🔥 동료와 이야기한다" → `hub_campfire` (동료 ≥2 이상일 때)
  - "👥 미선에게 간다" → `hub_miseon_recruit` (첫 지구 클리어 후, 미선 미영입 시)

### 🆕 미선 영입 (3 scenes)

**hub_miseon_recruit**
```json
{
  "id": "hub_miseon_recruit",
  "type": "dialogue",
  "background": "station",
  "speaker": "miseon",
  "text": "또 다쳤어?\n\n미선이 수건을 들고 다가온다. 이번에도 묻지 않고 상처를 닦기 시작한다.\n\n\"살아있는 몸으로 이런 데서 싸우면 어떡해. 위험하잖아.\"",
  "conditions": [{"type": "hasFlag", "flag": "first_district_cleared"}],
  "choices": [
    {
      "text": "같이 다니면 안 돼요?",
      "nextScene": "hub_miseon_accept"
    },
    {
      "text": "혼자 괜찮아요.",
      "nextScene": "hub_miseon_decline"
    }
  ]
}
```

**hub_miseon_accept**
```json
{
  "id": "hub_miseon_accept",
  "type": "dialogue",
  "background": "station",
  "speaker": "miseon",
  "text": "미선이 멈칫한다. 텐트촌을 돌아본다.\n\n\"...여기 아픈 사람이 너무 많은데.\"\n\n긴 침묵.\n\n\"그런데 살아있는 얘가 다치는 건 — 더 못 보겠다.\"\n\n수건을 접어 가방에 넣는다. 의료 파우치를 챙긴다.",
  "effects": [
    {"type": "setFlag", "flag": "miseon_recruited"},
    {"type": "addCompanion", "companion": "miseon"}
  ],
  "choices": [
    {"text": "고마워요.", "nextScene": "hub_platform0"}
  ]
}
```

**hub_miseon_decline**
```json
{
  "id": "hub_miseon_decline",
  "type": "dialogue",
  "background": "station",
  "speaker": "miseon",
  "text": "\"...그래. 조심해.\"\n\n미선이 수건으로 손을 닦는다. 등을 돌린다.\n\n하지만 주인공이 돌아올 때마다 — 미선은 거기 있다.\n기다리고 있다.",
  "effects": [{"type": "setFlag", "flag": "miseon_declined_once"}],
  "choices": [
    {"text": "...", "nextScene": "hub_platform0"}
  ]
}
```

### 🆕 캠프파이어 씬 (5 scenes)

캠프파이어는 동료 ≥2 이상일 때 Hub에서 접근 가능. 클리어한 지구 수에 따라 순차 해금.

**hub_campfire** (캠프파이어 메뉴)
```json
{
  "id": "hub_campfire",
  "type": "dialogue",
  "background": "station",
  "speaker": null,
  "text": "플랫폼 0 구석, 드럼통 화덕 앞.\n\n동료들이 모여 앉아있다. 불빛이 얼굴을 비춘다. 여기서만큼은 — 잠시 — 괜찮다.",
  "choices": [
    {
      "text": "\"마지막으로 뭐 먹었어?\"",
      "conditions": [{"type": "hasFlag", "flag": "first_district_cleared"}],
      "nextScene": "campfire_01_food"
    },
    {
      "text": "\"꿈 꿔?\"",
      "conditions": [{"type": "hasFlag", "flag": "second_district_cleared"}],
      "nextScene": "campfire_02_dream"
    },
    {
      "text": "\"보고 싶은 사람 있어?\"",
      "conditions": [{"type": "hasFlag", "flag": "third_district_cleared"}],
      "nextScene": "campfire_03_miss"
    },
    {
      "text": "\"왜 싸워?\"",
      "conditions": [{"type": "hasFlag", "flag": "fourth_district_cleared"}],
      "nextScene": "campfire_04_why"
    },
    {
      "text": "\"돌아갈 수 있으면?\"",
      "conditions": [{"type": "hasFlag", "flag": "terminal_cleared"}],
      "nextScene": "campfire_05_return"
    },
    {
      "text": "돌아간다",
      "nextScene": "hub_platform0"
    }
  ]
}
```

**campfire_01_food** — "마지막으로 뭐 먹었어?"
```json
{
  "id": "campfire_01_food",
  "type": "dialogue",
  "background": "station",
  "speaker": null,
  "text": "태현이 국을 저으며 묻는다. \"마지막으로 뭐 먹었어?\"\n\n침묵. 하나씩 대답한다.\n\n준서: \"편의점 삼각김밥. 참치마요. 890원.\"\n민준: \"자판기 커피. 아메리카노 핫. 바닥에 쏟아졌지만.\"\n하영: \"안 먹었어요. 야근이라. 시간이 없었어요.\"\n정수: \"...공사장 자판기 커피. 설탕 두 개.\"\n미선: \"오니기리. 참치마요. 진열하다가...\"\n\n준서와 미선의 눈이 마주친다. 같은 품목. 다른 선반.",
  "effects": [{"type": "setFlag", "flag": "campfire_01_done"}],
  "choices": [
    {
      "text": "\"나는... 기억 안 나.\"",
      "effects": [{"type": "modifyKarma", "value": 0}],
      "nextScene": "hub_campfire"
    },
    {
      "text": "(아무 말 하지 않는다)",
      "nextScene": "hub_campfire"
    }
  ]
}
```

**campfire_02_dream** — "꿈 꿔?"
```json
{
  "id": "campfire_02_dream",
  "type": "dialogue",
  "background": "station",
  "speaker": null,
  "text": "누군가 묻는다. \"너는 꿈 꿔?\"\n\n유리: \"살아있을 때, 사람이 문 두드리는 꿈을 꿨어. 매번 열어보면 아무도 없어. 죽고 나서 꿈이 멈췄어. 솔직히... 그게 더 편했어.\"\n\n준서: \"시험 꿈. 매일. 시험지 넘기면 빈 페이지야. 죽어서도 그 꿈 꿀 줄 알았는데 — 안 꾸더라.\"\n\n나래: \"꿈? 사치지. 눈 감으면 그냥 어둠이야.\"\n\n동료들이 주인공을 본다.",
  "effects": [{"type": "setFlag", "flag": "campfire_02_done"}],
  "choices": [
    {
      "text": "\"나는 아직 꿈을 꿔. 살아있으니까.\"",
      "effects": [{"type": "modifyKarma", "value": 3}],
      "nextScene": "campfire_02b_alive"
    },
    {
      "text": "\"...잘 모르겠어.\"",
      "nextScene": "hub_campfire"
    }
  ]
}
```

**campfire_02b_alive**
```json
{
  "id": "campfire_02b_alive",
  "type": "dialogue",
  "background": "station",
  "speaker": null,
  "text": "모두 조용해진다.\n\n유리: \"...부럽다. 진짜로.\"\n\n민준: \"꿈이라. 오래 안 꿨는데.\" 노트북을 만지작거린다.\n\n미선: \"좋은 꿈 꿔. 얘야. 여기서는 그게 제일 비싼 거야.\"",
  "choices": [
    {"text": "...", "nextScene": "hub_campfire"}
  ]
}
```

**campfire_03_miss** — "보고 싶은 사람?"
```json
{
  "id": "campfire_03_miss",
  "type": "dialogue",
  "background": "station",
  "speaker": "miseon",
  "text": "미선이 아무에게도 말하지 않는 것처럼 묻는다.\n\n\"...보고 싶은 사람 있어?\"\n\n정수: (오래 기다린 뒤) \"...아들.\"\n나래: \"...엄마.\" (작은 소리로) \"아무한테도 말하지 마.\"\n유리: \"택배 기사 아저씨. 웃기지? 나를 발견해준 유일한 사람이니까.\"\n태현: \"옆집 족발집 아줌마. 매일 '화이팅!' 해주셨는데. 불 나고... 한 마디도 못 했어.\"\n\n미선이 입을 연다. 닫는다. 다시 연다.\n\n\"수연이. 내 딸. 유치원 졸업식이 곧인데...\"\n\n끝까지 말하지 못한다.",
  "effects": [{"type": "setFlag", "flag": "campfire_03_done"}],
  "choices": [
    {
      "text": "(미선의 어깨에 손을 올린다)",
      "effects": [{"type": "modifyKarma", "value": 5}],
      "nextScene": "hub_campfire"
    },
    {
      "text": "...",
      "nextScene": "hub_campfire"
    }
  ]
}
```

**campfire_04_why** — "왜 싸워?"
```json
{
  "id": "campfire_04_why",
  "type": "dialogue",
  "background": "station",
  "speaker": "narae",
  "text": "나래가 도발적으로 묻는다. \"왜 싸워? 여기서 싸워봤자 뭐가 달라져?\"\n\n하영: \"...모르겠어. 살아있을 때도 몰랐어. 그냥... 멈추면 안 될 것 같아서.\"\n영재: \"처음엔 규칙을 지키려고. 지금은 규칙을 부수려고.\"\n민준: \"버그를 찾으려고. 이 시스템에 분명 빠져나갈 구멍이...\"\n\n정수가 천천히 말한다.\n\n\"젊은이들이 안 싸워도 되게.\"\n\n모두 조용해진다. 준서가 울기 시작한다.",
  "effects": [{"type": "setFlag", "flag": "campfire_04_done"}],
  "choices": [
    {
      "text": "\"나도 잘 모르겠어. 근데 여기 사람들 때문에.\"",
      "effects": [{"type": "modifyKarma", "value": 5}],
      "nextScene": "hub_campfire"
    },
    {
      "text": "\"나가려고.\"",
      "nextScene": "hub_campfire"
    }
  ]
}
```

**campfire_05_return** — "돌아갈 수 있으면?"
```json
{
  "id": "campfire_05_return",
  "type": "dialogue",
  "background": "station",
  "speaker": null,
  "text": "영재가 조용히 묻는다. \"돌아갈 수 있으면... 뭐 할 거예요?\"\n\n태현: \"가게를 안 태울 거야. 그냥 문 잠그고 나올 거야. 옆집 아줌마한테 '수고하셨습니다' 하고.\"\n민준: \"6시에 퇴근할 거야.\"\n준서: \"시험 안 볼 거야. 그냥... 뭐가 하고 싶은지 찾아볼 거야.\"\n나래: \"아빠 집에 안 갈 거야. 대신 엄마한테 전화할 거야.\"\n하영: \"간호사 안 할 거야.\" (멈춤) \"...아니. 할 거야. 대신 '나는 괜찮아'라고는 안 할 거야.\"\n유리: \"문을 열 거야. 진짜로.\"\n\n미선: \"수연이 유치원 데리러 갈 거야. 도시락 싸서. 제 시간에.\"\n\n정수: \"...아들한테 전화할 거야. '바빠서'라고 안 할 거야. '보고 싶다'고 할 거야.\"\n\n모두 불꽃을 본다. 아무도 더 말하지 않는다.\n\n돌아갈 수 없다는 걸 모두 안다.",
  "effects": [{"type": "setFlag", "flag": "campfire_05_done"}],
  "choices": [
    {"text": "...", "nextScene": "hub_campfire"}
  ]
}
```

---

## DISTRICT A: THE SILENT MANSIONS (47 existing + 🆕 8 new = 55 scenes)

### 기존 씬 현황
- ✅ 소연(Soyeon) 영입 + 퀘스트: 이미 구현 (district_a_soyeon_* 시리즈)
- ✅ 탐험 씬: 시장, 주거구역, 지하, 전시관, 정원, 검은 리본 저택
- ✅ 사서 보스 전투
- 🆕 **준서(Junseo) 영입 + 퀘스트 필요**

### ✏️ 기존 씬 수정

**district_a_boss_talk 수정:**
- 사서 대사에 모티프 추가: "침묵은 정화입니다. 소음은 오염입니다."
- 소연 파티 시 추가 대사: "아, 너. 목소리 압수당한 기자. 아직도 쪽지를 쓰고 있니?"
- 준서 파티 시 추가 대사: "시험에 떨어진 사람의 의견? 누가 듣겠어."

**district_a_boss_victory 수정:**
- 패배 대사 교체 (STORY_SPINE v2.0 반영): "소리가 이렇게 많은데 왜 아무도 안 다쳤지?...침묵만으로는 아무것도 시작하지 않더라."

### 🆕 준서 영입 (8 scenes)

준서는 A지구 기록 보관소(Archive) 뒤편의 숨겨진 시험장에서 만남.
**접근 조건:** district_a_street에서 "지하 계단"을 탐험해야 발견되는 숨겨진 교실

**district_a_exam_hall**
```json
{
  "id": "district_a_exam_hall",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "지하 계단을 내려가자 — 교실이 나타난다.\n\n수백 개의 책상. 수백 명의 영혼이 앉아 답안지를 채우고 있다. 연필 소리만 가득하다. 사각사각사각.\n\n대부분은 비어있다 — 기계적으로 연필만 움직이는, 처리된 영혼들.\n\n하지만 한 명이 다르다. 지우고, 쓰고, 지우고, 쓴다. 연필이 닳아 손가락만 한데도 멈추지 않는다. 표정이 있다 — 좌절.",
  "effects": [{"type": "setFlag", "flag": "found_exam_hall"}],
  "choices": [
    {
      "text": "그 사람에게 다가간다",
      "nextScene": "district_a_junseo_01"
    },
    {
      "text": "지나친다",
      "nextScene": "district_a_street"
    }
  ]
}
```

**district_a_junseo_01**
```json
{
  "id": "district_a_junseo_01",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "\"뭐 시험이야?\"\n\n고개를 들지 않는다.\n\n\"5급. 아니면 7급. 아니면 9급. 몇 번째인지도 모르겠어요.\"\n\n답안지 구석에 빨간 도장: ATTEMPT 47.\n\n\"...중요해요? 몇 번째인 게?\"",
  "choices": [
    {
      "text": "\"그 시험, 가짜야.\"",
      "nextScene": "district_a_junseo_02a"
    },
    {
      "text": "(연필을 뺏는다)",
      "nextScene": "district_a_junseo_02b"
    },
    {
      "text": "\"잘 되고 있어?\"",
      "nextScene": "district_a_junseo_02c"
    }
  ]
}
```

**district_a_junseo_02a** — 직접적 접근
```json
{
  "id": "district_a_junseo_02a",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "\"가짜라고요?\" 연필이 멈춘다. 처음으로.\n\n\"...알아요. 알고 있어요. 매번 같은 문제야. 매번 답이 지워져. 이게 진짜 시험이 아니라는 거.\"\n\n\"그런데 멈추면 뭐가 남아요? 시험이라도 보고 있으면 — 뭔가 하고 있는 거잖아요. 멈추면 저는 그냥...\"",
  "choices": [
    {
      "text": "\"그냥 너잖아.\"",
      "nextScene": "district_a_junseo_03"
    },
    {
      "text": "\"모르겠어. 같이 찾아보자.\"",
      "nextScene": "district_a_junseo_03"
    }
  ]
}
```

**district_a_junseo_02b** — 연필 뺏기
```json
{
  "id": "district_a_junseo_02b",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "연필을 뺏았다.\n\n그가 얼어붙는다. 아무도 이 순환을 방해한 적이 없다.\n\n\"뭐 하는 거예요? 돌려줘요. 끝내야 해요. 끝내지 않으면 떨어지고 떨어지면 다시 —\"\n\n\"시험은 없어. 넌 죽었어.\"\n\n교실이 조용해진다. 다른 영혼들은 계속 쓴다. 이 사람만 멈췄다.\n\n\"...알아요.\" 아주 작은 목소리. \"알면서도 못 멈춘 거예요. 멈추면 생각해야 하니까. 왜 여기 있는지. 왜 이렇게 된 건지.\"",
  "choices": [
    {
      "text": "\"같이 생각하면 돼.\"",
      "nextScene": "district_a_junseo_03"
    },
    {
      "text": "(연필을 부러뜨린다)",
      "effects": [{"type": "modifyKarma", "value": -3}],
      "nextScene": "district_a_junseo_03"
    }
  ]
}
```

**district_a_junseo_02c** — 부드러운 접근
```json
{
  "id": "district_a_junseo_02c",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "\"잘 되고 있냐고요?\"\n\n연필이 멈춘다. 고개를 든다. 처음으로 눈이 마주친다.\n\n\"...아무도 그렇게 물어본 적 없어요. 다들 '합격했어?' '몇 점이야?' 만 물어보지. '잘 되고 있어?'는...\"\n\n눈이 붉어진다.\n\n\"안 되고 있어요. 하나도.\"",
  "choices": [
    {
      "text": "\"괜찮아.\"",
      "nextScene": "district_a_junseo_03"
    },
    {
      "text": "(옆에 앉는다)",
      "effects": [{"type": "modifyKarma", "value": 3}],
      "nextScene": "district_a_junseo_03"
    }
  ]
}
```

**district_a_junseo_03** — 영입
```json
{
  "id": "district_a_junseo_03",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "그가 일어선다. 다리가 떨린다 — 오래 앉아있어서.\n\n답안지가 손에서 떨어진다. 바닥에 닿기 전에 녹아 사라진다.\n\n\"저 — 준서예요. 준서. 스물셋이었어요. 아니, 스물셋이에요. 여기선 나이가 의미 있나 모르겠지만.\"\n\n주위를 둘러본다. 시험장이 처음 보이는 것처럼.\n\n\"여기서 나가면... 뭐가 있어요?\"\n\n\"모르겠어. 같이 가볼래?\"\n\n\"...네.\" 작은 목소리. 하지만 처음으로 — 자기가 원해서 하는 대답.\n\n\"아, 근데 — 죄송한데 — 제가 도움이 될지 모르겠어요. 저 시험 말고는 할 줄 아는 게 —\"\n\n\"됐어. 가자.\"",
  "effects": [
    {"type": "setFlag", "flag": "junseo_recruited"},
    {"type": "addCompanion", "companion": "junseo"}
  ],
  "choices": [
    {"text": "A지구 거리로 돌아간다", "nextScene": "district_a_street"}
  ]
}
```

---

## DISTRICT B: THE IRON OFFICES (52 existing + 🆕 8 new = 60 scenes)

### 기존 씬 현황
- ✅ 민준(Minjun) 영입 + 퀘스트: 이미 구현
- ✅ 탐험 씬: 야근의 탑, 서버실, 99층, 레지스탕스, 프레스 구역
- ✅ 현장 소장 보스 전투
- 🆕 **정수(Jeongsu) 영입 + 퀘스트 필요**

### ✏️ 기존 씬 수정

**district_b_boss_talk:** 소장 대사에 모티프 추가 + 동료 반응
**district_b_boss_victory:** 패배 대사 교체 (STORY_SPINE 반영)

### 🆕 정수 영입 (8 scenes)

정수는 B지구 프레스 구역 가장자리에서 파이프를 수리하고 있음.
**접근:** district_b_press_inside 씬에서 분기.

**district_b_jeongsu_01**
```json
{
  "id": "district_b_jeongsu_01",
  "type": "dialogue",
  "background": "office",
  "speaker": null,
  "text": "프레스 라인 가장자리. 컨베이어 벨트가 영혼들을 프레스로 실어나른다.\n\n그 옆에서 — 한 남자가 무릎을 꿇고 파이프 밸브를 돌리고 있다. 작업복. 금이 간 안전모. 굵은 손.\n\n\"...살아있는 사람이네.\"\n\n고개도 안 든다. 밸브를 돌리면서.\n\n\"여기서 뭐하는 거야, 젊은이.\"",
  "choices": [
    {
      "text": "\"뭐 하고 있어요?\"",
      "nextScene": "district_b_jeongsu_02"
    },
    {
      "text": "\"도와줄까요?\"",
      "nextScene": "district_b_jeongsu_02"
    },
    {
      "text": "지나친다",
      "nextScene": "district_b_press_gate"
    }
  ]
}
```

**district_b_jeongsu_02**
```json
{
  "id": "district_b_jeongsu_02",
  "type": "dialogue",
  "background": "office",
  "speaker": null,
  "text": "\"이 밸브 잠그면 라인이 멈춰. 잠깐이지만.\"\n\n프레스 아래서 영혼이 하나 지나간다. 눈이 비어있다.\n\n\"30분이면 다시 돌아가겠지만. 30분이면 몇 명은 빠져나올 수 있어.\"\n\n밸브가 녹슬어 돌아가지 않는다. 정수의 손이 미끄러진다.\n\n\"혼자서는 안 돼. 힘이 부족해서가 아니라 — 저쪽 순찰이 문제야.\"",
  "choices": [
    {
      "text": "\"같이 하죠.\"",
      "nextScene": "district_b_jeongsu_valve"
    }
  ]
}
```

**district_b_jeongsu_valve** — 협동 챌린지 (3턴 전투 변형)
```json
{
  "id": "district_b_jeongsu_valve",
  "type": "combat",
  "background": "office",
  "enemy": "necktie_zombie",
  "introText": "정수가 밸브를 잡는다. \"내가 돌릴 테니까, 순찰 놈들 좀 막아줘.\"",
  "victoryScene": "district_b_jeongsu_03",
  "rounds": [
    {
      "text": "정수가 밸브에 매달린다. 녹이 삐걱댄다. 뒤에서 넥타이 좀비가 다가온다.",
      "choices": [
        {
          "text": "좀비의 주의를 끈다 (소리를 낸다)",
          "check": {"stat": "sense", "dc": 5},
          "alignment": "neutral", "karmaShift": 0,
          "success": {"text": "손뼉을 쳤다. 좀비가 이쪽을 본다. 정수가 한 바퀴 돌린다.", "effects": []},
          "failure": {"text": "반응이 없다. 좀비가 정수에게 다가간다.", "effects": [{"type": "modifyStat", "stat": "hp", "value": -3}]}
        },
        {
          "text": "몸으로 막는다",
          "check": {"stat": "body", "dc": 6},
          "alignment": "neutral", "karmaShift": 0,
          "success": {"text": "어깨로 좀비를 밀쳤다. 비틀거리며 물러난다.", "effects": []},
          "failure": {"text": "서류 가방에 맞았다. 아프다.", "effects": [{"type": "modifyStat", "stat": "hp", "value": -4}]}
        }
      ]
    },
    {
      "text": "밸브가 반쯤 돌아갔다. 프레스 속도가 느려진다. 순찰 두 명이 더 온다.",
      "choices": [
        {
          "text": "파이프를 뽑아 무기로 쓴다",
          "check": {"stat": "body", "dc": 6},
          "alignment": "neutral", "karmaShift": 0,
          "success": {"text": "파이프를 휘둘렀다. 순찰이 뒤로 물러난다.", "effects": []},
          "failure": {"text": "파이프가 벽에 박혔다. 빼는 동안 한 대 맞았다.", "effects": [{"type": "modifyStat", "stat": "hp", "value": -4}]}
        },
        {
          "text": "\"여기 고장 났어!\" 거짓 보고",
          "check": {"stat": "reason", "dc": 5},
          "alignment": "neutral", "karmaShift": 0,
          "success": {"text": "순찰이 멈칫한다. \"고장? 보고해야...\" 혼란 사이 정수가 한 바퀴 더.", "effects": []},
          "failure": {"text": "\"거짓 보고. 코드: NULL. 처리 대상.\" 안 통했다.", "effects": [{"type": "modifyStat", "stat": "hp", "value": -3}]}
        }
      ]
    },
    {
      "text": "마지막 한 바퀴. 정수의 이마에 땀이 — 아니, 기름이 흐른다.",
      "choices": [
        {
          "text": "같이 밸브를 잡는다",
          "check": {"stat": "body", "dc": 5},
          "alignment": "neutral", "karmaShift": 0,
          "success": {"text": "둘이서 밸브를 돌린다. 쇠가 비명을 지른다. — 잠겼다.\n\n프레스가 멈춘다. 침묵. 벨트 위의 영혼이 고개를 든다. 걸어 나온다.", "effects": [], "endCombat": true},
          "failure": {"text": "힘이 부족하다. 하지만 정수가 이를 악문다. \"한 번 더!\" 간신히 — 잠겼다.", "effects": [{"type": "modifyStat", "stat": "hp", "value": -2}], "endCombat": true}
        }
      ]
    }
  ],
  "rewards": {"engrams": 15}
}
```

**district_b_jeongsu_03** — 영입
```json
{
  "id": "district_b_jeongsu_03",
  "type": "dialogue",
  "background": "office",
  "speaker": null,
  "text": "프레스가 멈췄다.\n\n영혼 하나가 벨트에서 내려온다. 멍하니 주위를 둘러본다. 다른 하나도. 또 하나도.\n\n30분이면 다시 돌아가겠지. 하지만 30분이면 —\n\n정수가 손을 턴다. 작업복에 묻은 기름을 닦는다.\n\n\"...같이 가지.\"\n\n주인공을 보지 않는다. 밸브를 본다.\n\n\"혼자 고쳐봤자 내일 또 돌아가.\"",
  "effects": [
    {"type": "setFlag", "flag": "jeongsu_recruited"},
    {"type": "addCompanion", "companion": "jeongsu"}
  ],
  "choices": [
    {"text": "B지구 거리로 돌아간다", "nextScene": "district_b_street"}
  ]
}
```

---

## DISTRICT C: THE FROZEN APARTMENTS (43 existing + 🆕 16 new = 59 scenes)

### 기존 씬 현황
- ✅ 탐험 씬: 203동, 울음소리, 결정 동굴, 놀이터, 707동, 우편함, 관리동
- ✅ 동면 관리자 보스 전투
- ⚠️ 707동 씬(district_c_apt707)이 있지만 **유리 영입이 아닌 일반 NPC** — 수정 필요
- 🆕 **유리(Yuri) 영입 재구현**, **하영(Hayoung) 영입 신규**

### ✏️ 기존 씬 수정

**district_c_apt707 → 유리 영입 씬으로 교체** (기존 촛불 NPC를 유리로 대체)
**district_c_crying → 하영 발견의 복선으로 수정** (복도에서 맥을 재는 간호사 실루엣 추가)
**district_c_boss_talk / boss_victory:** STORY_SPINE 반영

### 🆕 유리 영입 (5 scenes)

기존 district_c_apt707 시리즈를 유리 영입으로 교체.

**district_c_yuri_door** (district_c_apt707 대체)
```json
{
  "id": "district_c_yuri_door",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "707동, 7층. 복도의 모든 문이 얼어붙어 있다. 하나만 빼고.\n\n707호. 문틈 아래로 따뜻한 빛이 새어나온다. C지구에서 유일한 불빛.\n\n노크한다.",
  "choices": [
    {
      "text": "(기다린다)",
      "nextScene": "district_c_yuri_wait"
    },
    {
      "text": "\"누구 있어요?\"",
      "nextScene": "district_c_yuri_call"
    },
    {
      "text": "돌아간다",
      "nextScene": "district_c_street"
    }
  ]
}
```

**district_c_yuri_call**
```json
{
  "id": "district_c_yuri_call",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "\"...누구세요?\"\n\n문 아래로 쪽지가 밀려 나온다. 깔끔한 글씨.\n\n'혼자 있고 싶어요. 나가주세요.'",
  "choices": [
    {
      "text": "(문 앞에 앉는다)",
      "nextScene": "district_c_yuri_wait"
    },
    {
      "text": "돌아간다",
      "nextScene": "district_c_street"
    }
  ]
}
```

**district_c_yuri_wait**
```json
{
  "id": "district_c_yuri_wait",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "문 앞에 앉는다. 등을 기대고. 아무 말 안 한다.\n\n5분. 복도의 형광등이 깜빡인다.\n\n10분. 문 너머에서 타이핑 소리가 들린다. 일을 하고 있다.\n\n20분. 타이핑이 멈춘다.\n\n30분.\n\n문이 열린다. 3센티미터. 안경 너머로 눈 하나가 보인다.\n\n\"...왜 안 갔어요?\"\n\n\"그냥.\"\n\n가장 긴 침묵.\n\n\"...들어올래요? 차 있어요. 얼은 차지만.\"",
  "effects": [{"type": "setFlag", "flag": "yuri_door_opened"}],
  "choices": [
    {
      "text": "들어간다",
      "nextScene": "district_c_yuri_inside"
    }
  ]
}
```

**district_c_yuri_inside**
```json
{
  "id": "district_c_yuri_inside",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "안. 택배 상자가 천장까지 쌓여있다. 책상, 노트북, 얼어붙은 찻잔. 담요가 여기저기.\n\n더럽지 않다. 꼼꼼하다. 모든 것이 제자리에 있다. 완벽하게 정돈된 우리.\n\n여자가 책상에 앉는다. 주인공을 보지 않는다.\n\n\"살아있지? 숨소리가 달라.\"\n\n\"어떻게 알아?\"\n\n\"죽은 사람은 숨 쉬는 걸 잊어요. 나도 가끔.\"\n\n모니터에 문장이 떠있다:\n'그녀는 마침내 문을 열었다.'\n\n\"번역하던 소설이에요. 마지막 문장. 다음 문장은 — 못 썼어요.\"\n\n\"왜?\"\n\n\"죽었으니까.\"",
  "choices": [
    {
      "text": "\"밖에 같이 나갈래요?\"",
      "nextScene": "district_c_yuri_join"
    },
    {
      "text": "\"여기 괜찮아요?\"",
      "nextScene": "district_c_yuri_stay_talk"
    }
  ]
}
```

**district_c_yuri_join**
```json
{
  "id": "district_c_yuri_join",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "\"밖에?\" 유리가 창문을 본다. 얼어붙은 C지구의 거리.\n\n\"...밖은 추운데.\"\n\n\"여기도 춥잖아요.\"\n\n\"...맞아요. 근데 여기는 익숙한 추위야.\"\n\n침묵.\n\n\"밖에 나가면 — 사람을 만나야 하잖아요. 말을 해야 하고. 대답을 기다려야 하고. 그게...\" 찻잔을 잡는다. 얼어있다. \"...오래 안 해봤어요.\"\n\n\"나도 잘 못해.\"\n\n유리가 처음으로 웃는다. 아주 작게.\n\n\"...그러면 같이 못하면 되겠네.\"\n\n일어선다. 담요를 두르고. 문을 — 연다.",
  "effects": [
    {"type": "setFlag", "flag": "yuri_recruited"},
    {"type": "addCompanion", "companion": "yuri"}
  ],
  "choices": [
    {"text": "C지구 거리로 나간다", "nextScene": "district_c_street"}
  ]
}
```

### 🆕 하영 영입 (5 scenes)

하영은 C지구 건물 사이 복도에서 얼어붙은 주민들의 맥을 재고 있음.

**district_c_hayoung_01**
```json
{
  "id": "district_c_hayoung_01",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "복도. 얼어붙은 주민이 벽에 기대 서 있다. 눈이 닫혀있다.\n\n그 앞에 — 간호사 복장의 여자가 무릎을 꿇고 손목을 잡고 있다. 맥을 재는 자세.\n\n맥이 없다. 당연히. 이 사람은 죽어있으니까.\n\n하지만 간호사는 진지하게 기록한다. 보이지 않는 클립보드에.\n\n\"혈압 정상. 체온... 안정.\"\n\n다음 환자로 이동한다. 또 맥을 잰다. 맥이 없다. 기록한다.",
  "choices": [
    {
      "text": "\"괜찮아요?\"",
      "nextScene": "district_c_hayoung_02"
    },
    {
      "text": "(지켜본다)",
      "nextScene": "district_c_hayoung_02b"
    },
    {
      "text": "지나친다",
      "nextScene": "district_c_street"
    }
  ]
}
```

**district_c_hayoung_02** — "괜찮아요?"
```json
{
  "id": "district_c_hayoung_02",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "간호사가 돌아본다. 전문적인 미소.\n\n\"다치셨어요? 제가 봐드릴게요.\"\n\n묻지도 않고 주인공의 손목을 잡는다. 맥을 잰다. 이번엔 — 맥이 뛴다.\n\n멈칫한다.\n\n\"...뛰네.\" 놀란 목소리. \"맥이 뛰어요. 진짜로.\"\n\n\"살아있으니까요.\"\n\n\"...아.\" 전문적 미소가 흔들린다. 1밀리미터.\n\n\"살아있는 사람은 오랜만이에요. 여기서는 — 맥을 재도 뛰는 사람이 없어서.\"\n\n주인공이 묻는다. \"당신은 괜찮아요?\"\n\n미소가 깨진다. 그 아래 — 아무것도 없다. 너무 오래 웃어서 웃음 없이는 어떤 표정을 지어야 할지 모르는 얼굴.\n\n\"...괜찮아요.\" '괜찮아요'가 깨진 유리를 끌고 가는 소리처럼.",
  "choices": [
    {
      "text": "\"여기서는 안 웃어도 돼요.\"",
      "nextScene": "district_c_hayoung_03"
    },
    {
      "text": "\"같이 다닐래요?\"",
      "nextScene": "district_c_hayoung_03"
    }
  ]
}
```

**district_c_hayoung_03** — 영입
```json
{
  "id": "district_c_hayoung_03",
  "type": "dialogue",
  "background": "corridor",
  "speaker": null,
  "text": "미소가 사라진다. 남은 건 — 피곤함. 순수한 피곤함.\n\n\"웃지 않아도 된다고요? 병원에서는 안 웃으면 혼나요. '환자 앞에서 왜 그런 표정이야' 하고. '간호사가 안 웃으면 환자가 불안해하잖아' 하고.\"\n\n클립보드를 내려놓는다.\n\n\"같이 다녀도 돼요? 환자를 돌보는 거 말고 — 그냥... 사람으로.\"\n\n\"사실 그것도 할 거예요. 다치면 제가 치료할 거예요. 습관이라. 그런데...\"\n\n\"여기서 맥이 안 뛰는 사람한테 맥 재는 거. 더 이상은 못하겠어요.\"",
  "effects": [
    {"type": "setFlag", "flag": "hayoung_recruited"},
    {"type": "addCompanion", "companion": "hayoung"}
  ],
  "choices": [
    {"text": "C지구 거리로 돌아간다", "nextScene": "district_c_street"}
  ]
}
```

---

## DISTRICT D: THE RED DISTRICT (39 existing + 🆕 16 new = 55 scenes)

### 기존 씬 현황
- ✅ 탐험 씬: 파이트 클럽, 퍼니스 클럽, 벽화, 지원 그룹, 대장간, 구식당
- ✅ 주방장 보스 전투
- 🆕 **나래(Narae) 영입**, **태현(Taehyun) 영입**

### 🆕 나래 영입 (8 scenes)

나래는 기존 district_d_furnace_club 씬에서 분기.

**district_d_narae_01** (furnace_club에서 분기)
```json
{
  "id": "district_d_narae_01",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "퍼니스 클럽. 붉은 네온. 무대 위에서 여자가 랩을 한다.\n\n마이크에 불이 붙어있다. 가사 한 줄마다 천장에 불꽃이 튄다. 에너지 미터가 올라간다 — 89%... 92%... 97%.\n\n군중이 열광한다. 하지만 주인공은 가사를 듣는다:\n\n\"아빠 주먹이 벽을 때릴 때 / 나는 이불 속에서 목소리를 죽였어 / 그게 내 첫 번째 곡이었어 / 살려고 부른 노래가 나를 죽이네\"\n\n공연이 끝난다. 전기가 폭발한다. 주방장이 VIP석에서 만족스럽게 고개를 끄덕인다.",
  "effects": [{"type": "setFlag", "flag": "saw_narae_perform"}],
  "choices": [
    {
      "text": "백스테이지로 간다",
      "nextScene": "district_d_narae_02"
    },
    {
      "text": "나간다",
      "nextScene": "district_d_street"
    }
  ]
}
```

**district_d_narae_02** — 백스테이지
```json
{
  "id": "district_d_narae_02",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "백스테이지. 나래가 앰프에 앉아있다. 빨간 후드티가 그을려있지만 타지 않았다.\n\n땀을 닦는다. 아니, 눈물을.\n\n주인공을 본다.\n\n\"...왜 울면서 듣고 있었어?\"",
  "choices": [
    {
      "text": "\"가사가 아름다워서.\"",
      "nextScene": "district_d_narae_03a"
    },
    {
      "text": "\"슬퍼서.\"",
      "nextScene": "district_d_narae_03b"
    },
    {
      "text": "\"안 울었어.\"",
      "nextScene": "district_d_narae_03c"
    }
  ]
}
```

**district_d_narae_03a**
```json
{
  "id": "district_d_narae_03a",
  "type": "dialogue",
  "background": "rage",
  "speaker": "narae",
  "text": "\"...아름답다고?\"\n\n멈춘다. 무대 쪽을 본다.\n\n\"아무도 그렇게 말한 적 없어. '강렬하다.' '날것이다.' '거칠다.' 아름답다고는 — 한 번도.\"\n\n발을 흔든다.\n\n\"넌 누군데.\"",
  "choices": [
    {
      "text": "\"아무도 아니야.\"",
      "nextScene": "district_d_narae_04"
    }
  ]
}
```

**district_d_narae_03b**
```json
{
  "id": "district_d_narae_03b",
  "type": "dialogue",
  "background": "rage",
  "speaker": "narae",
  "text": "\"...슬프다고?\" 얼굴이 일그러진다. \"나는 화가 난 거야. 그 노래는 분노야.\"\n\n긴 침묵.\n\n\"...내가 슬펐어?\"",
  "choices": [
    {
      "text": "\"응.\"",
      "nextScene": "district_d_narae_04"
    }
  ]
}
```

**district_d_narae_03c**
```json
{
  "id": "district_d_narae_03c",
  "type": "dialogue",
  "background": "rage",
  "speaker": "narae",
  "text": "나래가 손을 내민다. 손가락 끝에 물기.\n\n\"그럼 이건 뭐야?\"",
  "choices": [
    {
      "text": "\"...\"",
      "nextScene": "district_d_narae_04"
    }
  ]
}
```

**district_d_narae_04** — 영입 트리거
```json
{
  "id": "district_d_narae_04",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "문이 열린다. 주방장의 부하 둘이 들어온다.\n\n\"나래. 다음 공연 일정이 앞당겨졌어. 에너지 수요가 늘었거든.\"\n\n나래의 눈이 어두워진다. \"...방금 끝났잖아.\"\n\n\"알아. 근데 시장님 지시야. 더 태워.\"\n\n나래를 끌고 가려 한다.",
  "choices": [
    {
      "text": "막아선다",
      "nextScene": "district_d_narae_fight"
    },
    {
      "text": "(지켜본다)",
      "nextScene": "district_d_narae_alone"
    }
  ]
}
```

**district_d_narae_fight** — 전투 후 영입
```json
{
  "id": "district_d_narae_fight",
  "type": "combat",
  "background": "rage",
  "enemy": "rage_fighter",
  "introText": "주방장의 부하가 주먹을 올린다. \"방해하지 마, NULL.\"",
  "victoryScene": "district_d_narae_join",
  "rounds": [
    {
      "text": "부하 둘이 동시에 덤벼든다.",
      "choices": [
        {
          "text": "나래를 뒤로 밀치고 막는다",
          "check": {"stat": "body", "dc": 5},
          "alignment": "light", "karmaShift": 3,
          "success": {"text": "어깨로 받아냈다. 나래가 뒤로 물러난다.", "effects": [{"type": "modifyKarma", "value": 3}]},
          "failure": {"text": "맞았지만 버텼다.", "effects": [{"type": "modifyStat", "stat": "hp", "value": -4}]}
        },
        {
          "text": "드럼통을 발로 차 넘긴다",
          "check": {"stat": "sense", "dc": 5},
          "alignment": "neutral", "karmaShift": 0,
          "success": {"text": "드럼통이 굴러가며 부하들을 막는다.", "effects": [], "endCombat": true},
          "failure": {"text": "빗나갔다. 발등이 아프다.", "effects": [{"type": "modifyStat", "stat": "hp", "value": -3}]}
        }
      ]
    }
  ],
  "rewards": {"engrams": 10}
}
```

**district_d_narae_join**
```json
{
  "id": "district_d_narae_join",
  "type": "dialogue",
  "background": "rage",
  "speaker": "narae",
  "text": "부하들이 물러난다. \"기억해, NULL. 주방장이 가만 안 있을 거야.\"\n\n나래가 주인공을 본다. 놀란 표정.\n\n\"왜 막은 거야? 모르는 사인데.\"\n\n\"그냥.\"\n\n\"'그냥'이라. 세상에 그냥은 없어.\"\n\n빨간 후드를 여민다.\n\n\"좋아. 같이 가줄게. 근데 나 좋은 사람 아니야. 미리 말해둘게.\"",
  "effects": [
    {"type": "setFlag", "flag": "narae_recruited"},
    {"type": "addCompanion", "companion": "narae"}
  ],
  "choices": [
    {"text": "\"알았어.\"", "nextScene": "district_d_street"}
  ]
}
```

### 🆕 태현 영입 (5 scenes)

태현은 기존 hub_chef_stall 또는 D지구 뒷골목에서 만남.

**district_d_taehyun_01**
```json
{
  "id": "district_d_taehyun_01",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "뒷골목. 붉은 네온 사이, 방수포 지붕 아래 포장마차.\n\n플라스틱 의자 두 개. 카운터에 냄비 하나. 심연의 불로 끓고 있다.\n\n냄새가 — 불가능하다. 재와 쇳물 냄새만 가득한 D지구에서, 이건 — 집 냄새다.\n\n큰 남자가 앞치마를 하고 국을 젓고 있다. 한쪽 눈이 화상 흉터로 감겨있다.",
  "choices": [
    {
      "text": "\"국 먹어도 돼요?\"",
      "nextScene": "district_d_taehyun_02"
    },
    {
      "text": "지나친다",
      "nextScene": "district_d_street"
    }
  ]
}
```

**district_d_taehyun_02**
```json
{
  "id": "district_d_taehyun_02",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "\"앉아.\"\n\n묻지도 않는다. 국을 떠서 그릇에 담아 카운터에 놓는다.\n\n\"살아있는 놈이 왔는데 굶기면 안 되지.\"",
  "effects": [{"type": "modifyStat", "stat": "hp", "value": 20}],
  "choices": [
    {
      "text": "\"맛있어요.\"",
      "nextScene": "district_d_taehyun_03"
    },
    {
      "text": "\"왜 공짜로 줘요?\"",
      "nextScene": "district_d_taehyun_03"
    }
  ]
}
```

**district_d_taehyun_03**
```json
{
  "id": "district_d_taehyun_03",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "\"여기서 돈이 무슨 소용이야.\"\n\n국을 젓는다. 불길이 냄비 아래서 춤춘다.\n\n\"나는 태현이야. 15년 동안 국밥집을 했어. 지금도 하고 있고.\" 국솥을 본다. \"이것만 안 탔거든. 다 탔는데 이것만.\"\n\n국솥 바닥을 가리킨다. 포크로 긁은 자국 — 웃는 얼굴 낙서.\n\n\"아들이 다섯 살 때 그렸어. 가게에서 기다리다가.\"\n\n\"...다음에 올 때 다른 사람도 데려와. 혼자 먹는 밥은 맛이 없어.\"",
  "effects": [{"type": "setFlag", "flag": "met_taehyun"}],
  "choices": [
    {"text": "D지구 거리로 돌아간다", "nextScene": "district_d_street"}
  ]
}
```

태현 영입은 주방장 부하가 포장마차를 부수러 올 때 방어하면 확정:

**district_d_taehyun_defend** (district_d_boss_intro 전에 발생)
```json
{
  "id": "district_d_taehyun_defend",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "뒷골목으로 돌아오자 — 부하 셋이 포장마차를 부수고 있다.\n\n태현이 국솥을 안고 서 있다. 맞서지 않는다. 국솥만 지킨다.\n\n\"낭비하고 있어, 영감. 이 분노로 전기를 만들어야지, 국을 끓이고 있어.\"",
  "conditions": [{"type": "hasFlag", "flag": "met_taehyun"}],
  "choices": [
    {
      "text": "막아선다",
      "nextScene": "district_d_taehyun_fight"
    },
    {
      "text": "(지켜본다)",
      "nextScene": "district_d_taehyun_lost"
    }
  ]
}
```

**district_d_taehyun_join** (전투 승리 후)
```json
{
  "id": "district_d_taehyun_join",
  "type": "dialogue",
  "background": "rage",
  "speaker": null,
  "text": "부하들이 도망간다.\n\n태현이 부서진 방수포를 본다. 플라스틱 의자가 깨져있다. 하지만 국솥은 멀쩡하다. 언제나.\n\n\"...더 이상 가만히 있으면 안 되나보네.\"\n\n국솥을 든다. 앞치마를 여민다.\n\n\"그릇 하나 챙겨도 돼?\"",
  "effects": [
    {"type": "setFlag", "flag": "taehyun_recruited"},
    {"type": "addCompanion", "companion": "taehyun"}
  ],
  "choices": [
    {"text": "D지구 거리로 돌아간다", "nextScene": "district_d_street"}
  ]
}
```

---

## TERMINAL (8 existing + 🆕 8 new = 16 scenes)

### 🆕 영재 만남 + 영입 (8 scenes)

기존 terminal_entrance를 영재 만남으로 확장.

**terminal_youngjae_01** (terminal_entrance 후 삽입)
```json
{
  "id": "terminal_youngjae_01",
  "type": "dialogue",
  "background": "station",
  "speaker": null,
  "text": "터미널. 깨끗하다. 질서정연하다. 지구들의 혼란과 전혀 다르다.\n\n열차가 도착한다. 출발한다. 정시에.\n\n젊은 남자가 다가온다. 깨끗한 역무원 제복. 밝은 미소.\n\n\"안녕하세요! 어디로 가시나요? 안내해드릴게요.\"\n\n이름표: 영재 — INTERN.",
  "choices": [
    {
      "text": "\"코어로 가려고.\"",
      "nextScene": "terminal_youngjae_02"
    },
    {
      "text": "\"당신은 누구야?\"",
      "nextScene": "terminal_youngjae_02b"
    }
  ]
}
```

**terminal_youngjae_02**
```json
{
  "id": "terminal_youngjae_02",
  "type": "dialogue",
  "background": "station",
  "speaker": "youngjae",
  "text": "\"코어요? 그건 역장님의 허가가 필요해요. 제가 안내해드릴게요!\"\n\n밝다. 진짜 밝다. 여기서 이렇게 밝은 사람은 처음이다.\n\n\"역장님은 좋은 분이에요. 이 도시를 유지하시려면 규칙이 필요하잖아요. 저는 영혼들을 올바른 곳으로 안내하는 일을 해요.\"\n\n그가 앞장선다. 터미널 복도를 지나간다.\n\n복도 한쪽에 유리창이 있다.",
  "choices": [
    {
      "text": "(유리창을 본다)",
      "nextScene": "terminal_youngjae_truth"
    },
    {
      "text": "(따라간다)",
      "nextScene": "terminal_youngjae_truth"
    }
  ]
}
```

**terminal_youngjae_truth** — 진실의 순간
```json
{
  "id": "terminal_youngjae_truth",
  "type": "dialogue",
  "background": "station",
  "speaker": null,
  "text": "유리창 너머.\n\n처리실. 영재가 어제 안내한 영혼이 — 기계에 의해 분해되고 있다. 데이터가 압축된다. 파일링된다. 삭제된다.\n\n영재가 멈춘다. 미소가 — 깨진다. 안에서부터.\n\n\"...잠깐. 그 사람은. 어제 제가 안내한 사람인데. 괜찮을 거라고 했는데. 여기가 쉬는 곳이라고 —\"\n\n돌아본다. 미소가 완전히 사라져있다. 22살의 얼굴만 남아있다.\n\n\"제가 뭘 한 거예요?\"",
  "choices": [
    {
      "text": "\"넌 사람들을 기계에 보내고 있었어.\"",
      "effects": [{"type": "modifyKarma", "value": 5}],
      "nextScene": "terminal_youngjae_shatter"
    },
    {
      "text": "\"몰랐으니까 네 잘못이 아니야.\"",
      "effects": [{"type": "modifyKarma", "value": 3}],
      "nextScene": "terminal_youngjae_shatter"
    },
    {
      "text": "\"계속 안내해. 역장한테 데려다줘.\" (Dark)",
      "effects": [{"type": "modifyKarma", "value": -10}],
      "nextScene": "terminal_youngjae_used"
    }
  ]
}
```

**terminal_youngjae_shatter**
```json
{
  "id": "terminal_youngjae_shatter",
  "type": "dialogue",
  "background": "station",
  "speaker": "youngjae",
  "text": "영재가 벽에 등을 기댄다. 미끄러져 앉는다.\n\n\"역장님이... 규칙을 따르면 된다고 했어요. 생각할 필요 없다고. 안내하면 된다고.\"\n\n유니폼의 이름표를 뜯는다.\n\n\"플랫폼에서 그 사람을 구할 때도 — 생각 안 했어요. 그냥 뛰었어요. 그게 맞으니까.\"\n\n\"여기서도 그럴 줄 알았어요. 시키는 대로 하면 맞는 거라고.\"\n\n이름표를 본다. INTERN.\n\n\"...틀렸네.\"",
  "effects": [
    {"type": "setFlag", "flag": "youngjae_recruited"},
    {"type": "addCompanion", "companion": "youngjae"}
  ],
  "choices": [
    {
      "text": "\"역장한테 따지러 가자.\"",
      "nextScene": "terminal_stationmaster_intro"
    }
  ]
}
```

---

## MEMORY LOSS SCENES (🆕 10 scenes)

사망 시 발동. DeathHandler가 트리거. 현재 기억 순서대로 하나씩 재생.

공통 구조:
1. 화면 글리치
2. 기억 플래시백 (구체적 장면)
3. 텍스트 글자 단위 소멸
4. 시스템 메시지
5. 동료 반응 (동행 시)

**memory_loss_01** (같이 웃은 순간)
```json
{
  "id": "memory_loss_01",
  "type": "dialogue",
  "background": "void",
  "speaker": null,
  "text": "— 뭔가가 사라진다.\n\n누군가와 같이 웃었던 기억. 배가 아플 정도로. 눈이 마주치고, 또 웃고.\n\n뭐가 웃긴 건지 — 누구와였는지 — 흐려진다.\n\n배가 아팠다는 감각만 남아있다.\n그것마저 — 사라진다.\n\n「현실 기억 소거: 같이 웃은 순간」",
  "effects": [
    {"type": "setFlag", "flag": "memory_01_lost"}
  ],
  "choices": [
    {"text": "...", "nextScene": "__death__"}
  ]
}
```

**memory_loss_09** (어머니의 목소리 — 특별 씬)
```json
{
  "id": "memory_loss_09",
  "type": "dialogue",
  "background": "void",
  "speaker": null,
  "text": "— 뭔가가 —\n\n\"밥 먹었어?\"\n\n세상에서 가장 많이 들은 말이다.\n전화할 때마다. 만날 때마다.\n\n\"네, 먹었어요.\" 거짓말인 날이 더 많았다.\n\n그 목소리가\n— 높았는지 낮았는지\n— 따뜻했는지 걱정스러웠는지\n— 들리지 않는다.\n\n'밥 먹었어?'\n\n네 글자는 보이는데\n소리가 없다.\n자막만 떠있다.\n\n「현실 기억 소거: 어머니의 목소리」",
  "effects": [
    {"type": "setFlag", "flag": "memory_09_lost"}
  ],
  "choices": [
    {"text": "...", "nextScene": "memory_loss_09_reaction"}
  ]
}
```

**memory_loss_09_reaction** (동료 전원 반응)
```json
{
  "id": "memory_loss_09_reaction",
  "type": "dialogue",
  "background": "void",
  "speaker": null,
  "text": "주인공이 눈을 뜬다. 뭔가가 — 크게 — 비었다.\n\n동료들이 본다.\n\n미선: \"얘야.\"\n\n반응 없다.\n\n미선: \"...얘야?\"\n\n반응 없다.\n\n미선이 한 발 뒤로 물러난다. 손으로 입을 가린다.\n\n정수가 헬멧을 벗는다. 안의 사진을 꺼내 본다. 다시 넣는다.\n\n하영이 주인공의 손목을 잡는다. \"...살아있어요. 아직 살아있어요.\"\n\n나래가 입을 열었다 닫는다.\n\n민준이 노트북을 닫는다. 처음으로.\n\n아무도 더 말하지 않는다.",
  "choices": [
    {"text": "...", "nextScene": "__death__"}
  ]
}
```

(나머지 memory_loss_02~08, 10은 같은 구조로 생성 — 각 기억별 고유 텍스트 + 동료 반응)

---

## CORE (9 existing + ✏️ 수정)

✏️ **core_mayor_talk_01~03 수정:**
- 시장의 진실 폭로 대사 추가 (STORY_SPINE 반영)
- "이 도시는 벌이 아니야. 처리 시설이야."
- "NULL은 오류가 아니야. 가능성이야."

✏️ **core_mayor_battle 수정:**
- 4단계 전투: 사서 패턴 → 소장 패턴 → 관리자 패턴 → 주방장 패턴
- 영재 파티 시: 시간 조작 방해 특수 선택지

✏️ **core_mayor_victory 수정:**
- "시스템이 없으면 혼돈이야. ...근데 승객이 어디 가는지는 한 번도 안 물어봤네."

---

## ENDINGS (5 existing + ✏️ 대폭 수정)

✏️ **ending_gate 수정:**
- 기존 선택지 유지 + 나레이션 강화
- 모티프 2(개찰구) 최종 사용: "처음에 이곳으로 떨어질 때 지나왔던 바로 그 개찰구"

✏️ **ending_a~d 수정:**
- 각 엔딩에 동료별 farewell 대사 추가 (COMPANION_BIBLE 엔딩 섹션 참조)
- 모티프 해소 대사 삽입

---

## SCENE COUNT SUMMARY

| Section | Existing | New | Modified | Total |
|---------|----------|-----|----------|-------|
| Prologue | 16 | 0 | 2 | 16 |
| Chapter 1 | 27 | 1 | 2 | 28 |
| Hub | 17 | 16 | 2 | 33 |
| District A | 47 | 8 | 3 | 55 |
| District B | 52 | 8 | 2 | 60 |
| District C | 43 | 11 | 4 | 54 |
| District D | 39 | 14 | 2 | 53 |
| Terminal | 8 | 8 | 1 | 16 |
| Core | 9 | 0 | 4 | 9 |
| Endings | 5 | 0 | 5 | 5 |
| Memory Loss | 0 | 10 | 0 | 10 |
| **TOTAL** | **263** | **76** | **27** | **339** |

---

*Document Version: 1.0*
*Last Updated: 2026-03-15*
*Status: Draft — 주요 신규 씬은 JSON-ready 형태로 작성됨*
*Next: 나머지 memory_loss 씬 + 기존 씬 수정사항 상세화 + JSON 변환*
