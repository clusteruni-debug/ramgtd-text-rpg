/**
 * 공통 유틸리티
 */

// DOM 요소 생성 헬퍼
export function createElement(tag, className, textContent) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent) el.textContent = textContent;
  return el;
}

// 랜덤 정수 (min ~ max 포함)
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// d6 주사위 (1~6)
export function rollD6() {
  return randomInt(1, 6);
}

// 딜레이 유틸
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 깊은 복사
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 값 범위 제한
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
