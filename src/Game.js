/**
 * Game - 메인 게임 클래스
 * GDD v2: d6+스탯≥DC 전투, 카르마, 기억 시스템
 * 사망 → 그 자리 부활 → 현실 기억 소멸
 */
import StateManager from './engine/StateManager.js';
import SceneManager from './engine/SceneManager.js';
import DialogueRenderer from './engine/DialogueRenderer.js';
import CombatSystem from './engine/CombatSystem.js';
import SaveLoadSystem from './engine/SaveLoadSystem.js';
import MetaProgression from './engine/MetaProgression.js';

import DialogueBox from './ui/DialogueBox.js';
import ChoiceButtons from './ui/ChoiceButtons.js';
import StatsPanel from './ui/StatsPanel.js';
import CombatUI from './ui/CombatUI.js';
import InventoryPanel from './ui/InventoryPanel.js';
import TitleScreen from './ui/TitleScreen.js';
import MenuBar from './ui/MenuBar.js';
import DeathScreen from './ui/DeathScreen.js';
import MapUI from './ui/MapUI.js';
import UpgradeUI from './ui/UpgradeUI.js';
import CompanionPanel from './ui/CompanionPanel.js';

import { createElement, deepClone, delay } from './utils/helpers.js';

// 데이터 import
import prologueScenes from './data/scenes/prologue.json';
import b1PainScenes from './data/scenes/b1_pain.json';
import hubScenes from './data/scenes/hub.json';
import districtBScenes from './data/scenes/district_b.json';
import districtAScenes from './data/scenes/district_a.json';
import districtCScenes from './data/scenes/district_c.json';
import districtDScenes from './data/scenes/district_d.json';
import terminalScenes from './data/scenes/terminal.json';
import coreScenes from './data/scenes/core.json';
import endingScenes from './data/scenes/ending.json';
import characters from './data/characters.json';
import items from './data/items.json';
import enemies from './data/enemies.json';
import gameConfig from './data/gameConfig.json';

export default class Game {
  constructor(appElement) {
    this.app = appElement;

    // 메타 프로그레션 (영구 데이터)
    this.metaProgression = new MetaProgression();
    this.metaProgression.load();

    // 엔진 모듈
    this.stateManager = new StateManager();
    this.sceneManager = new SceneManager(this.stateManager, this.metaProgression);
    this.dialogueRenderer = new DialogueRenderer();
    // CombatSystem: effectApplier로 SceneManager.applyEffects 주입
    this.combatSystem = new CombatSystem(
      this.stateManager,
      (effects) => this.sceneManager.applyEffects(effects)
    );
    this.saveLoadSystem = new SaveLoadSystem(this.stateManager, this.metaProgression);

    // 데이터 로드
    this.sceneManager.loadScenes(prologueScenes);
    this.sceneManager.loadScenes(b1PainScenes);
    this.sceneManager.loadScenes(hubScenes);
    this.sceneManager.loadScenes(districtBScenes);
    this.sceneManager.loadScenes(districtAScenes);
    this.sceneManager.loadScenes(districtCScenes);
    this.sceneManager.loadScenes(districtDScenes);
    this.sceneManager.loadScenes(terminalScenes);
    this.sceneManager.loadScenes(coreScenes);
    this.sceneManager.loadScenes(endingScenes);
    this.sceneManager.loadCharacters(characters);
    this.sceneManager.loadItems(items);
    this.sceneManager.loadEnemies(enemies);
    this.sceneManager.loadConfig(gameConfig);

    // 타이핑 속도
    this.dialogueRenderer.setSpeed(gameConfig.typingSpeed || 30);

    // UI 빌드
    this._buildUI();
    this._bindEvents();

    // 타이틀 화면
    this.showTitle();
  }

  _buildUI() {
    this.bgEl = createElement('div', 'game-background');
    this.app.appendChild(this.bgEl);

    this.gameContainer = createElement('div', 'game-container');
    this.app.appendChild(this.gameContainer);

    this.titleScreen = new TitleScreen(this.app, this.saveLoadSystem, this.metaProgression);
    this.statsPanel = new StatsPanel(this.app, this.stateManager);
    this.menuBar = new MenuBar(this.app, this.saveLoadSystem);
    this.dialogueBox = new DialogueBox(this.app, this.dialogueRenderer);
    this.choiceButtons = new ChoiceButtons(this.app);
    this.combatUI = new CombatUI(this.app);
    this.inventoryPanel = new InventoryPanel(this.app, this.stateManager);
    this.deathScreen = new DeathScreen(this.app);
    this.mapUI = new MapUI(this.app, this.stateManager);
    this.upgradeUI = new UpgradeUI(this.app, this.stateManager);
    this.companionPanel = new CompanionPanel(this.app, this.stateManager, (id) => this.sceneManager.getCharacter(id));
  }

  _bindEvents() {
    // 타이틀 → 새 게임 / 이어하기
    this.titleScreen.onNewGame(() => this.startNewGame());
    this.titleScreen.onLoadGame(() => this.resumeGame());

    // 전투 테스트
    this.titleScreen.onTestCombat(() => this._startTestCombat());

    // 사망 화면 → 재부팅 (그 자리에서 부활)
    this.deathScreen.onRestart(() => this._handleReboot());

    // 메뉴바
    this.menuBar.on('inventory', () => this.inventoryPanel.toggle());
    this.menuBar.on('companion', () => this.companionPanel.toggle());
    this.menuBar.on('title', () => this.showTitle());
    this.menuBar.on('onSave', (slot) => this.showToast(`슬롯 ${slot + 1}에 세이브 완료!`, 'success'));

    // 맵 UI
    this.mapUI.onTravel((district) => {
      this.mapUI.hide();
      if (district.startScene) {
        this.playScene(district.startScene);
      }
    });
    this.mapUI.onBack(() => {
      this.mapUI.hide();
      // 허브 씬으로 돌아감
      const hubScene = gameConfig.hubScene;
      if (hubScene) {
        this.playScene(hubScene);
      }
    });

    // 업그레이드 UI
    this.upgradeUI.onBack(() => {
      this.upgradeUI.hide();
      const hubScene = gameConfig.hubScene;
      if (hubScene) {
        this.playScene(hubScene);
      }
    });

    // 인벤토리 아이템 사용 — 단일 또는 멀티 이펙트 지원
    this.inventoryPanel.onUseItem((itemId) => {
      const item = this.stateManager.getItem(itemId);
      if (!item || item.type !== 'consumable') return;
      if (item.effect) {
        if (Array.isArray(item.effect)) {
          this.sceneManager.applyEffects(item.effect);
        } else {
          this.sceneManager.applyEffect(item.effect);
        }
      }
      this.stateManager.removeItem(itemId, 1);
      this.showToast(`${item.name} 사용!`, 'success');
    });

    // 전투 UI: 선택지 선택
    this.combatUI.onChoice((choiceIndex) => {
      this.combatSystem.resolveChoice(choiceIndex);
    });

    // 전투 UI: 결과 확인 후 계속
    this.combatUI.onProceed(() => {
      this.combatSystem.proceedToNextRound();
    });
  }

  // --- 게임 흐름 ---
  showTitle() {
    this.combatUI.hide();
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.deathScreen.hide();
    this.mapUI.hide();
    this.upgradeUI.hide();
    this.companionPanel.hide();
    this.statsPanel.el.classList.add('hidden');
    this.menuBar.hide();
    this.inventoryPanel.hide();
    this.bgEl.className = 'game-background';
    this.titleScreen.show();
  }

  startNewGame() {
    // 메타: 새 회차
    this.metaProgression.startNewRun();
    this.metaProgression.save();

    // 영구 보너스 적용하면서 리셋
    const bonuses = this.metaProgression.getRunBonuses();
    this.stateManager.reset(gameConfig, bonuses);

    this.titleScreen.hide();
    this.deathScreen.hide();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    // 첫 씬 시작
    this.playScene(gameConfig.startScene);
  }

  resumeGame() {
    this.titleScreen.hide();
    this.deathScreen.hide();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    const currentScene = this.stateManager.state.currentScene;
    if (currentScene) {
      this.playScene(currentScene);
    } else {
      this.playScene(gameConfig.startScene);
    }
  }

  // --- 사망 처리 ---
  // GDD v2: 그 자리에서 부활, 현실 기억 1개 소멸
  _handleDeath() {
    // 현실 기억 소멸
    const lostMemory = this.stateManager.loseRealMemory();
    const remaining = this.stateManager.getRealMemoryCount();
    const isGameOver = remaining === 0;

    // 메타 기록
    this.metaProgression.recordDeath();

    // 사망 횟수 기반 영구 보상
    const deaths = this.metaProgression.data.totalDeaths;
    if (deaths === 3 && !this.metaProgression.hasPerk('resilient')) {
      this.metaProgression.addPerk('resilient', {
        name: '불굴의 의지',
        description: '여러 번의 패배로 단련됨',
      });
      this.metaProgression.addPermanentBonus('body', 1);
    }
    if (deaths === 5 && !this.metaProgression.hasPerk('sharp_sense')) {
      this.metaProgression.addPerk('sharp_sense', {
        name: '날카로운 감각',
        description: '수많은 위기가 감각을 예리하게 만들었다',
      });
      this.metaProgression.addPermanentBonus('sense', 1);
    }

    this.metaProgression.save();

    // HP 회복 (부활 준비)
    if (!isGameOver) {
      this.stateManager.setStat('hp', this.stateManager.getStat('maxHp'));
    }

    // UI 전환
    this.combatUI.hide();
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.statsPanel.el.classList.add('hidden');
    this.menuBar.hide();
    this._setBackground('glitch');

    // 사망 화면 표시
    this.deathScreen.show(lostMemory, remaining, isGameOver, this.metaProgression.serialize());
  }

  // 재부팅 (그 자리에서 다시 시작)
  _handleReboot() {
    this.deathScreen.hide();

    const remaining = this.stateManager.getRealMemoryCount();
    if (remaining === 0) {
      // 게임 오버 → 타이틀 (완전 새 게임)
      this.showTitle();
      return;
    }

    // 같은 씬에서 재시작
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    const currentScene = this.stateManager.state.currentScene;
    if (currentScene) {
      this.playScene(currentScene);
    }
  }

  // --- 씬 재생 ---
  async playScene(sceneId) {
    // 짧은 디바운스 — 중복 클릭 방지 (200ms)
    if (this._sceneTransitioning) return;
    this._sceneTransitioning = true;
    setTimeout(() => { this._sceneTransitioning = false; }, 200);

    // 이전 타이핑 즉시 종료
    if (this.dialogueRenderer.isTyping) {
      this.dialogueRenderer.skip();
    }

    await this._playSceneInner(sceneId);
  }

  async _playSceneInner(sceneId) {
    if (sceneId === '__title__') {
      this.showTitle();
      return;
    }

    if (sceneId === '__death__') {
      this._handleDeath();
      return;
    }

    if (sceneId === '__map__') {
      this._showMap();
      return;
    }

    if (sceneId === '__upgrade__') {
      this._showUpgrade();
      return;
    }

    if (sceneId === '__rest__') {
      this._showRest();
      return;
    }

    if (sceneId === '__hub__') {
      const hubScene = gameConfig.hubScene || gameConfig.startScene;
      await this._playSceneInner(hubScene);
      return;
    }

    const scene = this.sceneManager.getScene(sceneId);
    if (!scene) {
      console.error(`씬을 찾을 수 없음: ${sceneId}`);
      return;
    }

    this.stateManager.setCurrentScene(sceneId);
    this.saveLoadSystem.autoSave();
    this._setBackground(scene.background);

    // 씬 진입 효과
    if (scene.effects) {
      this.sceneManager.applyEffects(scene.effects);
    }

    // 엔딩 도달 시 메타 기록 + 보상 적용
    if (scene.type === 'ending' && scene.endingType) {
      this.metaProgression.applyEndingRewards(scene.endingType);
      this.metaProgression.recordVictory();
      this.metaProgression.recordEnding(scene.endingType);
      this.metaProgression.save();
    }

    switch (scene.type) {
      case 'dialogue':
      case 'ending':
        await this._playDialogueScene(scene);
        break;
      case 'combat':
        await this._playCombatScene(scene);
        break;
      default:
        await this._playDialogueScene(scene);
    }
  }

  async _playDialogueScene(scene) {
    this.combatUI.hide();

    let speakerName = scene.speaker;
    let portrait = null;
    const charData = speakerName ? this.sceneManager.getCharacter(speakerName) : null;
    if (charData) {
      speakerName = charData.name;
      if (charData.portrait) {
        portrait = import.meta.env.BASE_URL + charData.portrait;
      }
    }

    await this.dialogueBox.showDialogue(speakerName, scene.text, portrait);

    const choices = this.sceneManager.getAvailableChoices(scene);

    if (choices.length === 0) return;

    // 단일 선택지 (자동 진행)
    if (choices.length === 1 && !choices[0].conditions) {
      return new Promise(resolve => {
        this.dialogueBox.onNext(() => {
          this.dialogueBox.onNext(null);
          const choice = choices[0];
          if (choice.effects) {
            this.sceneManager.applyEffects(choice.effects);
          }
          resolve();
          if (choice.nextScene) {
            this.playScene(choice.nextScene);
          }
        });
      });
    }

    // 여러 선택지
    this.dialogueBox.onNext(null);
    const selected = await this.choiceButtons.showChoices(choices);

    if (selected.effects) {
      this.sceneManager.applyEffects(selected.effects);
    }

    if (selected.nextScene) {
      this.playScene(selected.nextScene);
    }
  }

  async _playCombatScene(scene) {
    this.dialogueBox.hide();
    this.choiceButtons.hide();

    // 적 데이터
    const enemyData = scene.enemy
      ? (this.sceneManager.getEnemy(scene.enemy) || { name: scene.enemy, sprite: 'default' })
      : { name: '???', sprite: 'default' };

    // rounds가 없으면 전투 불가 → 대화 씬으로 폴백
    if (!scene.rounds || scene.rounds.length === 0) {
      console.warn(`전투 씬에 rounds가 없음: ${scene.id}, 대화 씬으로 처리`);
      await this._playDialogueScene(scene);
      return;
    }

    // 인트로 텍스트
    if (scene.introText) {
      await this.dialogueBox.showDialogue(null, scene.introText);
      await delay(500);
      this.dialogueBox.hide();
    }

    // 전투 UI 표시
    this.combatUI.show();

    // 전투 시작
    return new Promise(resolve => {
      this.combatSystem.start(
        enemyData,
        scene.rounds,
        scene.rewards || {},
        // onUpdate
        (data) => {
          this.combatUI.updateCombat(data);
        },
        // onEnd
        async (result) => {
          await delay(1000);
          this.combatUI.hide();

          if (result.victory) {
            if (scene.victoryScene) {
              this.playScene(scene.victoryScene);
            }
          } else {
            this._handleDeath();
          }

          resolve();
        }
      );
    });
  }

  // --- 전투 테스트 ---
  _startTestCombat() {
    this.metaProgression.startNewRun();
    const bonuses = this.metaProgression.getRunBonuses();
    this.stateManager.reset(gameConfig, bonuses);

    this.titleScreen.hide();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();
    this._setBackground('boss');

    const testEnemy = { name: '연습용 더미', sprite: 'default' };
    const testRounds = [
      {
        text: '연습용 더미가 서 있다. 공격 방법을 선택하라.',
        choices: [
          {
            text: '주먹으로 때린다',
            check: { stat: 'body', dc: 4 },
            alignment: 'neutral',
            karmaShift: 0,
            success: { text: '단단한 주먹이 더미를 강타했다!', effects: [], endCombat: false },
            failure: { text: '허공을 쳤다. 더미가 흔들린다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -3 }] },
          },
          {
            text: '약점을 분석한다',
            check: { stat: 'reason', dc: 6 },
            alignment: 'neutral',
            karmaShift: 0,
            success: { text: '균열을 발견했다! 정확히 가격한다.', effects: [], endCombat: false },
            failure: { text: '분석이 빗나갔다. 반동으로 팔이 저리다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -5 }] },
          },
          {
            text: '"그만두자"고 설득한다',
            check: { stat: 'bond', dc: 8 },
            alignment: 'light',
            karmaShift: 5,
            success: { text: '더미가... 고개를 끄덕였다? 전투 종료.', effects: [], endCombat: true },
            failure: { text: '더미는 듣지 않는다. 당연하지.', effects: [{ type: 'modifyStat', stat: 'hp', value: -3 }] },
          },
        ],
      },
      {
        text: '더미가 반격 자세를 취한다! 위협적인 기운이 느껴진다.',
        choices: [
          {
            text: '몸을 굴려 피한다',
            check: { stat: 'sense', dc: 5 },
            alignment: 'neutral',
            karmaShift: 0,
            success: { text: '민첩하게 회피했다!', effects: [] },
            failure: { text: '굴렸지만 맞았다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -7 }] },
          },
          {
            text: '정면으로 받아친다 (위험)',
            check: { stat: 'body', dc: 8 },
            alignment: 'dark',
            karmaShift: -5,
            success: { text: '강인한 체력으로 반격을 막아내고 되받아쳤다!', effects: [], endCombat: true },
            failure: { text: '무모했다. 큰 충격이 온 몸을 관통한다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -10 }] },
          },
        ],
      },
      {
        text: '더미가 마지막 힘을 모은다. 결정적 순간이다.',
        choices: [
          {
            text: '냉정하게 빈틈을 노린다',
            check: { stat: 'reason', dc: 7 },
            alignment: 'neutral',
            karmaShift: 0,
            success: { text: '완벽한 타이밍! 더미가 무너진다.', effects: [] },
            failure: { text: '계산이 빗나갔다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -5 }] },
          },
          {
            text: '온 힘을 다해 돌진한다',
            check: { stat: 'body', dc: 6 },
            alignment: 'dark',
            karmaShift: -3,
            success: { text: '거침없는 돌진! 더미가 산산조각 났다.', effects: [] },
            failure: { text: '기세는 좋았지만 빗나갔다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -7 }] },
          },
          {
            text: '더미의 핵심을 감지한다',
            check: { stat: 'sense', dc: 7 },
            alignment: 'light',
            karmaShift: 3,
            success: { text: '감각이 핵심을 포착했다! 정확히 일격.', effects: [] },
            failure: { text: '감각이 흐려졌다. 집중이 흐트러진다.', effects: [{ type: 'modifyStat', stat: 'hp', value: -5 }] },
          },
        ],
      },
    ];

    this.combatUI.show();

    this.combatSystem.start(
      testEnemy,
      testRounds,
      { engrams: 15 },
      (data) => this.combatUI.updateCombat(data),
      async (result) => {
        await delay(1500);
        this.combatUI.hide();
        if (result.victory) {
          this.showToast('전투 테스트 승리!', 'success');
        } else {
          this.showToast('전투 테스트 패배', 'error');
        }
        setTimeout(() => this.showTitle(), 1500);
      }
    );
  }

  // --- 맵 / 업그레이드 / 휴식 ---
  _showMap() {
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.combatUI.hide();
    this._setBackground('station');
    this.mapUI.render(gameConfig.districts || []);
    this.mapUI.show();
  }

  _showUpgrade() {
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.combatUI.hide();
    this.upgradeUI.show();
  }

  async _showRest() {
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.combatUI.hide();
    this.mapUI.hide();
    this.upgradeUI.hide();

    // HP 전량 회복 + 동료 스킬 충전 리셋
    const oldHp = this.stateManager.getStat('hp');
    const maxHp = this.stateManager.getStat('maxHp');
    this.stateManager.setStat('hp', maxHp);
    this.stateManager.resetCompanionSkillCharges();
    const healed = maxHp - oldHp;

    this._setBackground('station');

    // 휴식 화면 표시
    const restEl = createElement('div', 'rest-screen');
    restEl.innerHTML = `
      <div class="rest-icon">🛏️</div>
      <div class="rest-text">플랫폼 0의 텐트촌에서 잠시 쉬었다.</div>
      ${healed > 0
        ? `<div class="rest-hp-restored">HP +${healed} 회복! (${maxHp}/${maxHp})</div>`
        : '<div class="rest-hp-restored">HP가 이미 가득 찼다.</div>'
      }
      <button class="rest-continue-btn">계속하기</button>
    `;

    this.app.appendChild(restEl);

    return new Promise(resolve => {
      restEl.querySelector('.rest-continue-btn').addEventListener('click', () => {
        restEl.remove();
        resolve();
        const hubScene = gameConfig.hubScene;
        if (hubScene) {
          this.playScene(hubScene);
        }
      });
    });
  }

  // _hideAllGameUI: 모든 게임 UI 숨기기 (씬 전환 시 사용)
  _hideAllGameUI() {
    this.combatUI.hide();
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.mapUI.hide();
    this.upgradeUI.hide();
    this.companionPanel.hide();
    this.inventoryPanel.hide();
  }

  // --- 유틸 ---
  _setBackground(bg) {
    if (!bg) return;
    this.bgEl.className = `game-background bg-${bg}`;
    this.bgEl.classList.add('scene-transition');
    setTimeout(() => this.bgEl.classList.remove('scene-transition'), 600);
  }

  showToast(message, type = '') {
    const toast = createElement('div', `toast ${type}`, message);
    this.app.appendChild(toast);
    setTimeout(() => toast.remove(), 2100);
  }
}
