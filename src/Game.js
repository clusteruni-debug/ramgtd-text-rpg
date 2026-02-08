/**
 * Game - 메인 게임 클래스
 * 모든 모듈을 조율하고 게임 흐름을 제어
 */
import StateManager from './engine/StateManager.js';
import SceneManager from './engine/SceneManager.js';
import DialogueRenderer from './engine/DialogueRenderer.js';
import CombatSystem from './engine/CombatSystem.js';
import SaveLoadSystem from './engine/SaveLoadSystem.js';

import DialogueBox from './ui/DialogueBox.js';
import ChoiceButtons from './ui/ChoiceButtons.js';
import StatsPanel from './ui/StatsPanel.js';
import CombatUI from './ui/CombatUI.js';
import InventoryPanel from './ui/InventoryPanel.js';
import TitleScreen from './ui/TitleScreen.js';
import MenuBar from './ui/MenuBar.js';

import { createElement, deepClone, delay } from './utils/helpers.js';

// 데이터 import
import demoScenes from './data/scenes/demo.json';
import characters from './data/characters.json';
import items from './data/items.json';
import enemies from './data/enemies.json';
import gameConfig from './data/gameConfig.json';

export default class Game {
  constructor(appElement) {
    this.app = appElement;

    // 엔진 모듈
    this.stateManager = new StateManager();
    this.sceneManager = new SceneManager(this.stateManager);
    this.dialogueRenderer = new DialogueRenderer();
    this.combatSystem = new CombatSystem(this.stateManager);
    this.saveLoadSystem = new SaveLoadSystem(this.stateManager);

    // 데이터 로드
    this.sceneManager.loadScenes(demoScenes);
    this.sceneManager.loadCharacters(characters);
    this.sceneManager.loadItems(items);
    this.sceneManager.loadEnemies(enemies);
    this.sceneManager.loadConfig(gameConfig);

    // 타이핑 속도 설정
    this.dialogueRenderer.setSpeed(gameConfig.typingSpeed || 30);

    // UI 빌드
    this._buildUI();
    this._bindEvents();

    // 타이틀 화면 표시
    this.showTitle();
  }

  _buildUI() {
    // 배경
    this.bgEl = createElement('div', 'game-background');
    this.app.appendChild(this.bgEl);

    // 게임 컨테이너 (대화창/선택지/전투 등)
    this.gameContainer = createElement('div', 'game-container');
    this.app.appendChild(this.gameContainer);

    // UI 모듈 초기화
    this.titleScreen = new TitleScreen(this.app, this.saveLoadSystem);
    this.statsPanel = new StatsPanel(this.app, this.stateManager);
    this.menuBar = new MenuBar(this.app, this.saveLoadSystem);
    this.dialogueBox = new DialogueBox(this.app, this.dialogueRenderer);
    this.choiceButtons = new ChoiceButtons(this.app);
    this.combatUI = new CombatUI(this.app);
    this.inventoryPanel = new InventoryPanel(this.app, this.stateManager);
  }

  _bindEvents() {
    // 타이틀 → 새 게임
    this.titleScreen.onNewGame(() => this.startNewGame());
    this.titleScreen.onLoadGame(() => this.resumeGame());

    // 메뉴바 이벤트
    this.menuBar.on('inventory', () => this.inventoryPanel.toggle());
    this.menuBar.on('title', () => this.showTitle());
    this.menuBar.on('onSave', (slot) => this.showToast(`슬롯 ${slot + 1}에 세이브 완료!`, 'success'));

    // 인벤토리 아이템 사용 (전투 밖에서)
    this.inventoryPanel.onUseItem((itemId) => {
      const item = this.stateManager.getItem(itemId);
      if (!item || item.type !== 'consumable') return;

      // 효과 적용
      if (item.effect) {
        this.sceneManager.applyEffect(item.effect);
      }
      this.stateManager.removeItem(itemId, 1);
      this.showToast(`${item.name} 사용!`, 'success');
    });

    // 전투 UI 액션
    this.combatUI.onAction((action, data) => {
      switch (action) {
        case 'attack': this.combatSystem.playerAttack(); break;
        case 'skill': this.combatSystem.playerSkill(); break;
        case 'flee': this.combatSystem.playerFlee(); break;
        case 'showItems':
          this.combatUI.showItems(this.combatSystem.getUsableItems());
          break;
        case 'useItem':
          this.combatSystem.playerUseItem(data);
          break;
      }
    });

    // 레벨업 이벤트 → 토스트
    this.stateManager.on('levelUp', ({ level }) => {
      this.showToast(`레벨 업! Lv.${level}`, 'success');
      this.app.classList.add('level-up-flash');
      setTimeout(() => this.app.classList.remove('level-up-flash'), 800);
    });
  }

  // --- 게임 흐름 ---
  showTitle() {
    this.combatUI.hide();
    this.dialogueBox.hide();
    this.choiceButtons.hide();
    this.statsPanel.el.classList.add('hidden');
    this.menuBar.hide();
    this.inventoryPanel.hide();
    this.bgEl.className = 'game-background';
    this.titleScreen.show();
  }

  startNewGame() {
    this.stateManager.reset();

    // 초기 스탯 적용
    const config = gameConfig;
    if (config.initialStats) {
      const player = this.stateManager.state.player;
      Object.assign(player, config.initialStats);
    }

    this.titleScreen.hide();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    // 첫 씬 시작
    this.playScene(config.startScene);
  }

  resumeGame() {
    this.titleScreen.hide();
    this.statsPanel.el.classList.remove('hidden');
    this.statsPanel.update();
    this.menuBar.show();

    // 저장된 씬부터 재개
    const currentScene = this.stateManager.state.currentScene;
    if (currentScene) {
      this.playScene(currentScene);
    } else {
      this.playScene(gameConfig.startScene);
    }
  }

  // --- 씬 재생 ---
  async playScene(sceneId) {
    // 타이틀로 돌아가기 특수 씬
    if (sceneId === '__title__') {
      this.showTitle();
      return;
    }

    const scene = this.sceneManager.getScene(sceneId);
    if (!scene) {
      console.error(`씬을 찾을 수 없음: ${sceneId}`);
      return;
    }

    // 상태 저장
    this.stateManager.setCurrentScene(sceneId);

    // 오토세이브
    this.saveLoadSystem.autoSave();

    // 배경 전환
    this._setBackground(scene.background);

    // 씬 진입 시 효과 적용
    if (scene.effects) {
      this.sceneManager.applyEffects(scene.effects);
    }

    // 씬 타입별 처리
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

    // 화자 이름 가져오기
    let speakerName = scene.speaker;
    if (speakerName && this.sceneManager.getCharacter(speakerName)) {
      speakerName = this.sceneManager.getCharacter(speakerName).name;
    }

    // 대사 타이핑
    await this.dialogueBox.showDialogue(speakerName, scene.text);

    // 선택지
    const choices = this.sceneManager.getAvailableChoices(scene);

    if (choices.length === 0) return;

    // 선택지가 1개이고 "계속..."이면 다음 버튼으로 자동 진행
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

    // 여러 선택지 표시
    this.dialogueBox.onNext(null);
    const selected = await this.choiceButtons.showChoices(choices);

    // 선택 효과 적용
    if (selected.effects) {
      this.sceneManager.applyEffects(selected.effects);
    }

    // 다음 씬으로
    if (selected.nextScene) {
      this.playScene(selected.nextScene);
    }
  }

  async _playCombatScene(scene) {
    this.dialogueBox.hide();
    this.choiceButtons.hide();

    // 적 데이터 복제
    const enemyData = deepClone(this.sceneManager.getEnemy(scene.enemy));
    if (!enemyData) {
      console.error(`적을 찾을 수 없음: ${scene.enemy}`);
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
        // onUpdate
        (data) => {
          this.combatUI.updateCombat(data);
        },
        // onEnd
        async (result) => {
          // 전투 종료 연출
          await delay(1000);
          this.combatUI.hide();

          // 드롭 아이템
          if (result.victory && enemyData.dropItem) {
            this.stateManager.addItem({ ...enemyData.dropItem, quantity: 1 });
          }

          // 다음 씬
          if (result.victory && scene.victoryScene) {
            this.playScene(scene.victoryScene);
          } else if (result.fled && scene.fleeScene) {
            this.playScene(scene.fleeScene);
          } else if (!result.victory && scene.defeatScene) {
            this.playScene(scene.defeatScene);
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
