#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const scenesDir = path.join(projectRoot, 'src', 'data', 'scenes');
const gameConfigPath = path.join(projectRoot, 'src', 'data', 'gameConfig.json');

const SPECIAL_SCENES = new Set([
  '__title__',
  '__death__',
  '__map__',
  '__upgrade__',
  '__rest__',
  '__hub__',
]);

function collectNextSceneIds(scene) {
  const nextIds = new Set();
  for (const choice of scene.choices || []) {
    if (choice?.nextScene) nextIds.add(choice.nextScene);
  }
  if (scene.victoryScene) nextIds.add(scene.victoryScene);
  return [...nextIds];
}

function print(type, message) {
  const tag = type === 'error' ? 'ERROR' : 'WARN';
  console.log(`[${tag}] ${message}`);
}

async function main() {
  const errors = [];
  const warns = [];

  const fileNames = (await fs.readdir(scenesDir))
    .filter((name) => name.endsWith('.json'))
    .sort();

  const sceneMap = new Map();
  const sceneFileMap = new Map();

  for (const name of fileNames) {
    const fullPath = path.join(scenesDir, name);
    let parsed;
    try {
      parsed = JSON.parse(await fs.readFile(fullPath, 'utf8'));
    } catch (error) {
      errors.push(`JSON 파싱 실패: ${name} (${error.message})`);
      continue;
    }

    if (!Array.isArray(parsed)) {
      errors.push(`씬 파일은 배열이어야 합니다: ${name}`);
      continue;
    }

    for (const scene of parsed) {
      if (!scene || typeof scene !== 'object') {
        errors.push(`${name}: 유효하지 않은 scene 객체`);
        continue;
      }
      if (!scene.id || typeof scene.id !== 'string') {
        errors.push(`${name}: scene.id 누락`);
        continue;
      }
      if (sceneMap.has(scene.id)) {
        errors.push(`${name}: 중복 scene.id "${scene.id}" (기존: ${sceneFileMap.get(scene.id)})`);
        continue;
      }
      sceneMap.set(scene.id, scene);
      sceneFileMap.set(scene.id, name);
    }
  }

  for (const [sceneId, scene] of sceneMap.entries()) {
    const source = sceneFileMap.get(sceneId);

    if (!scene.type || typeof scene.type !== 'string') {
      errors.push(`${source}#${sceneId}: scene.type 누락`);
      continue;
    }

    if (scene.choices && !Array.isArray(scene.choices)) {
      errors.push(`${source}#${sceneId}: choices는 배열이어야 함`);
    }

    if ((scene.type === 'dialogue' || scene.type === 'ending') && (!scene.choices || scene.choices.length === 0)) {
      errors.push(`${source}#${sceneId}: ${scene.type} 씬에는 최소 1개 choices 필요`);
    }

    if (scene.type === 'combat' && (!scene.rounds || scene.rounds.length === 0)) {
      errors.push(`${source}#${sceneId}: combat 씬에 rounds 없음`);
    }

    if (scene.choices && scene.choices.length > 0) {
      const allConditional = scene.choices.every((choice) => Array.isArray(choice.conditions) && choice.conditions.length > 0);
      if (allConditional) {
        warns.push(`${source}#${sceneId}: 모든 선택지가 조건부라 상태에 따라 소프트락 위험`);
      }
    }

    for (const nextSceneId of collectNextSceneIds(scene)) {
      if (!sceneMap.has(nextSceneId) && !SPECIAL_SCENES.has(nextSceneId)) {
        errors.push(`${source}#${sceneId}: 참조 대상 누락 "${nextSceneId}"`);
      }
    }
  }

  let gameConfig = null;
  try {
    gameConfig = JSON.parse(await fs.readFile(gameConfigPath, 'utf8'));
  } catch (error) {
    warns.push(`gameConfig.json 파싱 실패: ${error.message}`);
  }

  if (gameConfig) {
    const seedIds = new Set();
    if (gameConfig.startScene) seedIds.add(gameConfig.startScene);
    if (gameConfig.hubScene) seedIds.add(gameConfig.hubScene);
    for (const district of gameConfig.districts || []) {
      if (district.startScene) seedIds.add(district.startScene);
    }

    const queue = [...seedIds].filter((id) => sceneMap.has(id));
    const visited = new Set(queue);

    while (queue.length > 0) {
      const current = queue.shift();
      const scene = sceneMap.get(current);
      if (!scene) continue;

      for (const next of collectNextSceneIds(scene)) {
        let resolved = next;
        if (next === '__hub__' && gameConfig.hubScene) {
          resolved = gameConfig.hubScene;
        }
        if (!sceneMap.has(resolved) || visited.has(resolved)) continue;
        visited.add(resolved);
        queue.push(resolved);
      }
    }

    const unreachable = [...sceneMap.keys()].filter((id) => !visited.has(id));
    if (unreachable.length > 0) {
      warns.push(`시작 노드에서 도달 불가 씬 ${unreachable.length}개 (예: ${unreachable.slice(0, 8).join(', ')})`);
    }
  }

  for (const message of warns) print('warn', message);
  for (const message of errors) print('error', message);

  console.log(
    `\n[SUMMARY] files=${fileNames.length} scenes=${sceneMap.size} warnings=${warns.length} errors=${errors.length}`
  );

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[ERROR] validate-scenes crashed:', error);
  process.exit(1);
});
