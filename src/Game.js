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

import { createElement, deepClone, delay } from './utils/helpers.js';

// 데이터 import
import prologueScenes from './data/scenes/prologue.json';
import b1PainScenes from './data/scenes/b1_pain.json';
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
  }

  _bindEvents() {
    // 타이틀 → 새 게임 / 이어하기
    this.titleScreen.onNewGame(() => this.startNewGame());
    this.titleScreen.onLoadGame(() => this.resumeGame());

    // 사망 화면 → 재부팅 (그 자리에서 부활)
    this.deathScreen.onRestart(() => this._handleReboot());

    // 메뉴바
    this.menuBar.on('inventory', () => this.inventoryPanel.toggle());
    this.menuBar.on('title', () => this.showTitle());
    this.menuBar.on('onSave', (slot) => this.showToast(`슬롯 ${slot + 1}에 세이브 완료!`, 'success'));

    // 인벤토리 아이템 사용
    this.inventoryPanel.onUseItem((itemId) => {
      const item = this.stateManager.getItem(itemId);
      if (!item || item.type !== 'consumable') return;
      if (item.effect) {
        this.sceneManager.applyEffect(item.effect);
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

  // --- 승리 처리 ---
  _handleVictoryEnding() {
    this.metaProgression.recordVictory();
    this.metaProgression.save();
  }

  // --- 씬 재생 ---
  async playScene(sceneId) {
    if (sceneId === '__title__') {
      this.showTitle();
      return;
    }

    if (sceneId === '__death__') {
      this._handleDeath();
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

    // 엔딩 victory 기록
    if (scene.type === 'ending' && scene.endingType === 'victory') {
      this._handleVictoryEnding();
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
    if (speakerName && this.sceneManager.getCharacter(speakerName)) {
      speakerName = this.sceneManager.getCharacter(speakerName).name;
    }

    await this.dialogueBox.showDialogue(speakerName, scene.text);

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
