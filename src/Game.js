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
import AudioManager from './engine/AudioManager.js';

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
import SettingsPanel from './ui/SettingsPanel.js';
import DialogueLog from './ui/DialogueLog.js';

import { createElement, deepClone, delay } from './utils/helpers.js';
import { processDeath } from './engine/DeathHandler.js';
import { testEnemy, testRounds, testRewards } from './data/testCombat.js';
import {
  trackGameStart, trackGameResume, trackSceneEnter,
  trackChoice, trackCombatStart, trackCombatResult,
  trackDeath, trackCompanionRecruit, trackEnding,
} from './analytics.js';

// 데이터 import
import prologueScenes from './data/scenes/prologue.json';
import chapter1Scenes from './data/scenes/chapter1.json';
import hubScenes from './data/scenes/hub.json';
import districtBScenes from './data/scenes/district_b.json';
import districtAScenes from './data/scenes/district_a.json';
import districtCScenes from './data/scenes/district_c.json';
import districtDScenes from './data/scenes/district_d.json';
import terminalScenes from './data/scenes/terminal.json';
import coreScenes from './data/scenes/core.json';
import endingScenes from './data/scenes/ending.json';
import memoryLossScenes from './data/scenes/memory_loss.json';
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
    this.audioManager = new AudioManager();

    // 데이터 로드
    this.sceneManager.loadScenes(prologueScenes);
    this.sceneManager.loadScenes(chapter1Scenes);
    this.sceneManager.loadScenes(hubScenes);
    this.sceneManager.loadScenes(districtBScenes);
    this.sceneManager.loadScenes(districtAScenes);
    this.sceneManager.loadScenes(districtCScenes);
    this.sceneManager.loadScenes(districtDScenes);
    this.sceneManager.loadScenes(terminalScenes);
    this.sceneManager.loadScenes(coreScenes);
    this.sceneManager.loadScenes(endingScenes);
    this.sceneManager.loadScenes(memoryLossScenes);
    this.sceneManager.loadCharacters(characters);
    this.sceneManager.loadItems(items);
    this.sceneManager.loadEnemies(enemies);
    this.sceneManager.loadConfig(gameConfig);

    // UI 빌드
    this._buildUI();
    this._bindEvents();

    // 타이핑 속도: 설정 패널 값 우선, 없으면 config 값
    this.dialogueRenderer.setSpeed(this.settingsPanel.typingSpeed || gameConfig.typingSpeed || 30);

    // 씬 전환 상태
    this._sceneTransitioning = false;
    this._queuedSceneId = null;

    // 타이틀 화면
    this.showTitle();
  }

  _buildUI() {
    this.bgEl = createElement('div', 'game-background');
    this.app.appendChild(this.bgEl);

    // 씬 전환 오버레이
    this.transitionOverlay = createElement('div', 'transition-overlay');
    this.app.appendChild(this.transitionOverlay);

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
    this.settingsPanel = new SettingsPanel(this.app, this.dialogueRenderer, this.audioManager, this.saveLoadSystem);
    this.dialogueLog = new DialogueLog(this.app);
    this.dialogueBox.setLog(this.dialogueLog);
  }

  _bindEvents() {
    // 오디오 자동재생 정책 대응: 첫 인터랙션 시 resume
    const resumeAudio = () => this.audioManager.resume();
    document.addEventListener('click', resumeAudio, { once: true });
    document.addEventListener('keydown', resumeAudio, { once: true });

    // 타이틀 → 새 게임 / 이어하기
    this.titleScreen.onNewGame(() => this.startNewGame());
    this.titleScreen.onLoadGame((payload) => {
      if (!payload || payload.success !== true) {
        this.showToast('저장 데이터를 불러오지 못했습니다.', 'error');
        return;
      }
      this.resumeGame();
    });

    // 전투 테스트
    this.titleScreen.onTestCombat(() => this._startTestCombat());

    // 사망 화면 → 재부팅 (그 자리에서 부활)
    this.deathScreen.onRestart(() => this._handleReboot());

    // 메뉴바
    this.menuBar.on('inventory', () => this.inventoryPanel.toggle());
    this.menuBar.on('companion', () => this.companionPanel.toggle());
    this.menuBar.on('log', () => this.dialogueLog.toggle());
    this.menuBar.on('settings', () => this.settingsPanel.toggle());
    this.menuBar.on('title', () => this.showTitle());
    this.menuBar.on('onSave', (slot) => this.showToast(`슬롯 ${slot + 1}에 세이브 완료!`, 'success'));
    this.menuBar.on('onSaveError', () => this.showToast('세이브 실패: 브라우저 저장소를 확인하세요.', 'error'));

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
    this.upgradeUI.onUpgrade(({ stat, cost, nextValue }) => {
      this.showToast(`${stat} 강화 완료 (-💎${cost}) → Lv.${nextValue}`, 'success');
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

    // 전투 UI: 동료 스킬 토글
    this.combatUI.onCompanionSkill((skill) => {
      this.combatSystem.setCompanionSkill(skill);
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
    this.settingsPanel.hide();
    this.dialogueLog.hide();
    this.statsPanel.el.classList.add('hidden');
    this.menuBar.hide();
    this.inventoryPanel.hide();
    this.audioManager.stopBGM();
    this.bgEl.className = 'game-background';

    // Clear district theme + particles on title
    const toRemove = [];
    document.body.classList.forEach(cls => {
      if (cls.startsWith('district-') || cls.startsWith('particles-') || cls.startsWith('transition-')) {
        toRemove.push(cls);
      }
    });
    toRemove.forEach(cls => document.body.classList.remove(cls));
    const particleEl = document.querySelector('.particle-container');
    if (particleEl) particleEl.remove();
    // 전환 오버레이 잔여물 정리
    document.querySelectorAll('.scene-transition-overlay, .boss-entrance-overlay, .damage-vignette, .hp-critical-screen').forEach(el => el.remove());

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
    this.dialogueLog.clear();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    // 첫 씬 시작
    this._queuedSceneId = null;
    trackGameStart(this.metaProgression.data.runCount);
    this.playScene(gameConfig.startScene);
  }

  resumeGame() {
    this.titleScreen.hide();
    this.deathScreen.hide();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    const currentScene = this.stateManager.state.currentScene;
    this._queuedSceneId = null;
    trackGameResume(currentScene, 'save');
    if (currentScene) {
      this.playScene(currentScene);
    } else {
      this.playScene(gameConfig.startScene);
    }
  }

  // --- 사망 처리 ---
  // GDD v2: 그 자리에서 부활, 현실 기억 1개 소멸
  async _handleDeath() {
    const { lostMemory, remaining, isGameOver } = processDeath(
      this.stateManager,
      this.metaProgression
    );
    trackDeath(this.stateManager.state.currentScene, remaining, isGameOver);

    // 기억 상실 씬이 있으면 먼저 재생
    if (lostMemory && lostMemory.lossScene) {
      const lossScene = this.sceneManager.getScene(lostMemory.lossScene);
      if (lossScene) {
        // 기억 상실 씬을 재생 — 씬의 마지막 선택지가 __death__로 연결됨
        // __death__ 도달 시 다시 이 함수가 호출되지 않도록 플래그 설정
        this._memoryLossPlayed = true;
        this._pendingDeathData = { lostMemory, remaining, isGameOver };
        this.combatUI.hide();
        await this.playScene(lostMemory.lossScene);
        return;
      }
    }

    // 기억 상실 씬이 없거나 이미 재생된 경우 → 사망 화면
    this._memoryLossPlayed = false;
    this._pendingDeathData = null;

    // UI 전환
    this.combatUI.hide();
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.statsPanel.el.classList.add('hidden');
    this.menuBar.hide();
    await this._setBackground('glitch', 'glitch');

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

    // 재부팅 플래그 — 전환 효과 스킵용
    this._isRebooting = true;

    // 전투 씬에서 죽은 경우 → 전투 직전의 대화 씬으로 복귀
    // (같은 전투 씬으로 돌아가면 즉시 전투 재개 → 반복 사망 루프)
    let rebootScene = this.stateManager.state.currentScene;
    const scene = rebootScene ? this.sceneManager.getScene(rebootScene) : null;
    if (scene && scene.type === 'combat') {
      // 전투 씬의 상위 허브/탐험 씬으로 복귀
      // 허브가 가장 안전한 복귀 지점
      rebootScene = 'hub_platform0';
    }

    // UI 복원
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    // 전환 오버레이 정리
    document.querySelectorAll('.scene-transition-overlay, .boss-entrance-overlay, .damage-vignette, .hp-critical-screen').forEach(el => el.remove());

    // 씬 전환 큐 초기화 (중복 방지)
    this._sceneTransitioning = false;
    this._queuedSceneId = null;

    if (rebootScene) {
      this.playScene(rebootScene);
    }

    this._isRebooting = false;
  }

  // --- 씬 재생 ---
  async playScene(sceneId) {
    if (!sceneId) return;
    if (this._sceneTransitioning) {
      this._queuedSceneId = sceneId;
      return;
    }

    this._sceneTransitioning = true;

    try {
      // 이전 타이핑 즉시 종료
      if (this.dialogueRenderer.isTyping) {
        this.dialogueRenderer.skip();
      }

      // Determine transition type based on previous and next scene
      const fromSceneId = this.stateManager.state.currentScene;
      const transitionType = this._getTransitionType(fromSceneId, sceneId);

      // Play transition for significant scene changes (not simple fades within same district)
      const fromDistrict = this._getDistrictFromScene(fromSceneId);
      const toDistrict = this._getDistrictFromScene(sceneId);
      const needsTransition = transitionType !== 'fade' || fromDistrict !== toDistrict;

      if (needsTransition && fromSceneId && !this._isRebooting) {
        await new Promise(resolve => {
          this._playTransition(transitionType, resolve);
        });
      }

      await this._playSceneInner(sceneId);
    } finally {
      this._sceneTransitioning = false;

      const queued = this._queuedSceneId;
      this._queuedSceneId = null;
      if (queued && queued !== sceneId) {
        queueMicrotask(() => this.playScene(queued));
      }
    }
  }

  async _playSceneInner(sceneId) {
    if (sceneId === '__title__') {
      this.showTitle();
      return;
    }

    if (sceneId === '__death__') {
      if (this._memoryLossPlayed && this._pendingDeathData) {
        // 기억 상실 씬 재생 완료 후 → 사망 화면 표시
        const { lostMemory, remaining, isGameOver } = this._pendingDeathData;
        this._memoryLossPlayed = false;
        this._pendingDeathData = null;
        this.combatUI.hide();
        this.dialogueBox.hide();
        this.choiceButtons.hide();
        this.statsPanel.el.classList.add('hidden');
        this.menuBar.hide();
        await this._setBackground('glitch', 'glitch');
        this.deathScreen.show(lostMemory, remaining, isGameOver, this.metaProgression.serialize());
        return;
      }
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

    // Apply district theme + particles based on scene ID
    this._applyDistrictTheme(sceneId);

    this.stateManager.setCurrentScene(sceneId);
    trackSceneEnter(sceneId, scene.type);
    if (this.settingsPanel.autoSaveEnabled) {
      const autoSaved = this.saveLoadSystem.autoSave();
      if (autoSaved) {
        this.menuBar.flashSaveIndicator();
      } else {
        this.showToast('오토세이브 실패: 저장공간을 확인하세요.', 'error');
      }
    }
    await this._setBackground(scene.background);

    // 씬 BGM
    if (scene.bgm) {
      this.audioManager.playBGM(scene.bgm);
    }

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
      trackEnding(scene.endingType);
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
    const availableChoices = choices.filter(choice => choice.available !== false);

    if (choices.length === 0) return;
    if (availableChoices.length === 0) {
      console.warn(`[SceneGuard] 선택지 조건 불충족으로 진행 중단: ${scene.id}`);
      this.showToast('조건 충족 선택지가 없어 허브로 이동합니다.', 'error');
      await delay(350);
      const fallbackScene = gameConfig.hubScene || gameConfig.startScene;
      if (fallbackScene) {
        this.playScene(fallbackScene);
      }
      return;
    }

    // 단일 선택지 (자동 진행)
    if (availableChoices.length === 1 && !availableChoices[0].conditions) {
      return new Promise(resolve => {
        this.dialogueBox.onNext(() => {
          this.dialogueBox.onNext(null);
          const choice = availableChoices[0];
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
    const selected = await this.choiceButtons.showChoices(availableChoices);
    if (!selected) return;

    trackChoice(scene.id, availableChoices.indexOf(selected), selected.text, selected.nextScene);

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
    trackCombatStart(scene.enemy, scene.rounds.length);

    // scene-level maxFails override → enemyData로 전달
    if (typeof scene.maxFails === 'number') {
      enemyData.maxFails = scene.maxFails;
    }

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

          trackCombatResult(scene.enemy, result.victory);
          if (result.victory) {
            this.audioManager.playSFX('victory.mp3');
            if (scene.victoryScene) {
              this.playScene(scene.victoryScene);
            }
          } else {
            this.audioManager.playSFX('defeat.mp3');
            this._handleDeath();
          }

          resolve();
        }
      );
    });
  }

  // --- 전투 테스트 ---
  async _startTestCombat() {
    this.metaProgression.startNewRun();
    const bonuses = this.metaProgression.getRunBonuses();
    this.stateManager.reset(gameConfig, bonuses);

    this.titleScreen.hide();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();
    await this._setBackground('boss', 'combat');

    this.combatUI.show();

    this.combatSystem.start(
      testEnemy,
      testRounds,
      testRewards,
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
    this.mapUI.render(gameConfig.districts || [], gameConfig);
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
    this.settingsPanel.hide();
    this.dialogueLog.hide();
  }

  // --- 지구 테마 / 파티클 / 전환 ---

  _getDistrictFromScene(sceneId) {
    if (!sceneId) return 'hub';
    if (sceneId.startsWith('district_a') || sceneId.includes('archive') || sceneId.includes('soyeon') || sceneId.includes('junseo')) return 'a';
    if (sceneId.startsWith('district_b') || sceneId.includes('minjun') || sceneId.includes('jeongsu')) return 'b';
    if (sceneId.startsWith('district_c') || sceneId.includes('hayoung') || sceneId.includes('yuri')) return 'c';
    if (sceneId.startsWith('district_d') || sceneId.includes('narae') || sceneId.includes('taehyun')) return 'd';
    if (sceneId.startsWith('terminal')) return 'terminal';
    if (sceneId.startsWith('core')) return 'core';
    return 'hub';
  }

  _applyDistrictTheme(sceneId) {
    const district = this._getDistrictFromScene(sceneId);
    const body = document.body;

    // Remove old district/particle classes
    const toRemove = [];
    body.classList.forEach(cls => {
      if (cls.startsWith('district-') || cls.startsWith('particles-')) {
        toRemove.push(cls);
      }
    });
    toRemove.forEach(cls => body.classList.remove(cls));

    // Apply new district class
    const districtMap = {
      'a': 'district-a',
      'b': 'district-b',
      'c': 'district-c',
      'd': 'district-d',
      'terminal': 'district-terminal',
      'core': 'district-core',
      'hub': 'district-hub',
    };

    const districtClass = districtMap[district];
    if (districtClass) {
      body.classList.add(districtClass);
      body.classList.add(`particles-${districtClass}`);
    }

    // Manage particle container element
    let particleEl = document.querySelector('.particle-container');
    if (!particleEl && district !== 'hub') {
      particleEl = document.createElement('div');
      particleEl.className = 'particle-container';
      document.body.appendChild(particleEl);
    } else if (particleEl && district === 'hub') {
      particleEl.remove();
    }
  }

  _getTransitionType(fromSceneId, toSceneId) {
    const toScene = toSceneId ? this.sceneManager.getScene(toSceneId) : null;

    // Combat entry
    if (toScene && toScene.type === 'combat') {
      const enemyData = toScene.enemy ? this.sceneManager.getEnemy(toScene.enemy) : null;
      const isBoss = enemyData && enemyData.tier === 'boss';
      return isBoss ? 'boss' : 'combat';
    }
    // Subway travel (map destinations or entrance scenes)
    if (fromSceneId === '__map__' || (toSceneId && toSceneId.includes('entrance')) || toSceneId === 'hub_platform0') {
      return 'subway';
    }
    // Death
    if (toSceneId === '__death__') return 'death';
    // Chapter complete
    if (toSceneId && (toSceneId.includes('complete') || toSceneId.includes('clear'))) return 'chapter';
    // Default
    return 'fade';
  }

  _playTransition(type, callback) {
    // 기존 오버레이 정리 (중첩 방지)
    document.querySelectorAll('.scene-transition-overlay').forEach(el => el.remove());
    const overlay = document.createElement('div');
    overlay.className = 'scene-transition-overlay';
    document.body.appendChild(overlay);
    document.body.classList.add(`transition-${type}`);

    const durations = { fade: 600, combat: 800, boss: 2000, subway: 1200, death: 1500, chapter: 3000 };
    const duration = durations[type] || 600;

    // Force reflow so animation starts
    overlay.offsetHeight; // eslint-disable-line no-unused-expressions

    // Execute callback at midpoint
    setTimeout(() => {
      if (callback) callback();
    }, duration * 0.4);

    // Clean up
    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove(`transition-${type}`);
    }, duration);
  }

  // --- 유틸 ---
  async _setBackground(bg, type = 'fade') {
    if (!bg) return;

    const isSameBg = this.bgEl.classList.contains(`bg-${bg}`);
    if (isSameBg) return;

    const durationMap = { fade: 300, combat: 150, glitch: 150 };
    const duration = durationMap[type] || 300;

    // Phase 1: 오버레이 fade in
    this.transitionOverlay.className = `transition-overlay transition-${type}`;
    this.transitionOverlay.classList.add('transition-active');

    await delay(duration);

    // 배경 교체
    this.bgEl.className = `game-background bg-${bg}`;

    // Phase 2: 오버레이 fade out
    this.transitionOverlay.classList.remove('transition-active');

    await delay(duration);
  }

  showToast(message, type = '') {
    const toast = createElement('div', `toast ${type}`, message);
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    this.app.appendChild(toast);
    setTimeout(() => toast.remove(), 2100);
  }
}
