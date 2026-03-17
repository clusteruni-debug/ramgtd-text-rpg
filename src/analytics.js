/**
 * Analytics — Firebase Analytics wrapper for user behavior tracking
 * Silently no-ops when Firebase is not configured (dev / itch.io builds)
 */
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserId } from 'firebase/analytics';

let analytics = null;
let sessionId = null;
let sessionStartTime = null;

function init() {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) return; // not configured — silent no-op

    try {
        const app = initializeApp({
            apiKey,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
            measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
        });
        analytics = getAnalytics(app);
        sessionId = crypto.randomUUID();
        sessionStartTime = Date.now();
        setUserId(analytics, sessionId);
    } catch (e) {
        console.warn('[Analytics] init failed:', e.message);
    }
}

function track(eventName, params = {}) {
    if (!analytics) return;
    try {
        logEvent(analytics, eventName, {
            ...params,
            session_id: sessionId,
            ts: Date.now(),
        });
    } catch { /* never break the game */ }
}

// --- Public API ---

/** Call once at app startup */
export function initAnalytics() {
    init();
}

/** New game started */
export function trackGameStart(runNumber) {
    track('game_start', { run_number: runNumber });
}

/** Game resumed from save */
export function trackGameResume(sceneId, slot) {
    track('game_resume', { scene_id: sceneId, slot });
}

/** Scene entered */
export function trackSceneEnter(sceneId, sceneType) {
    track('scene_enter', { scene_id: sceneId, scene_type: sceneType });
}

/** Player made a choice */
export function trackChoice(sceneId, choiceIndex, choiceText, nextScene) {
    track('choice_made', {
        scene_id: sceneId,
        choice_index: choiceIndex,
        choice_text: choiceText?.substring(0, 100),
        next_scene: nextScene,
    });
}

/** Combat started */
export function trackCombatStart(enemyId, roundCount) {
    track('combat_start', { enemy_id: enemyId, round_count: roundCount });
}

/** Combat ended */
export function trackCombatResult(enemyId, victory) {
    track('combat_result', { enemy_id: enemyId, victory });
}

/** Player died */
export function trackDeath(sceneId, memoriesRemaining, isGameOver) {
    track('player_death', {
        scene_id: sceneId,
        memories_remaining: memoriesRemaining,
        is_game_over: isGameOver,
    });
}

/** Companion recruited */
export function trackCompanionRecruit(companionId) {
    track('companion_recruit', { companion_id: companionId });
}

/** Ending reached */
export function trackEnding(endingType, playtimeMs) {
    track('ending_reached', {
        ending_type: endingType,
        playtime_seconds: Math.round((playtimeMs || (Date.now() - sessionStartTime)) / 1000),
    });
}

/** Session ended (beforeunload) */
export function trackSessionEnd() {
    if (!analytics) return;
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    track('session_end', { duration_seconds: duration });
}
