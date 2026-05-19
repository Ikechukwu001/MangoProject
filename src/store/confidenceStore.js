// confidenceStore.js
import { ALL_TOPICS } from '../data/topicMap';

const STORAGE_KEY = 'pharmtech_confidence_v1';

function defaultState() {
  const state = {};
  ALL_TOPICS.forEach(topic => {
    state[topic.id] = { correct: 0, wrong: 0, skipped: 0, attempts: 0 };
  });
  return state;
}

export function loadConfidenceState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so new topics are always present
      return { ...defaultState(), ...parsed };
    }
  } catch (e) {
    console.error('Failed to load confidence state', e);
  }
  return defaultState();
}

export function saveConfidenceState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save confidence state', e);
  }
}

export function recordAnswer(state, topicId, result) {
  // result: 'correct' | 'wrong' | 'skipped'
  const existing = state[topicId] || { correct: 0, wrong: 0, skipped: 0, attempts: 0 };
  const updated = {
    ...existing,
    attempts: existing.attempts + 1,
    [result]: (existing[result] || 0) + 1,
  };
  const newState = { ...state, [topicId]: updated };
  saveConfidenceState(newState);
  return newState;
}

export function getConfidenceLevel(topicState) {
  // Returns: 'new' | 'weak' | 'learning' | 'good' | 'master'
  if (!topicState || topicState.attempts === 0) return 'new';
  const pct = Math.round((topicState.correct / topicState.attempts) * 100);
  if (pct >= 85 && topicState.attempts >= 5) return 'master';
  if (pct >= 70) return 'good';
  if (pct >= 50) return 'learning';
  return 'weak';
}

export function getAccuracyPercent(topicState) {
  if (!topicState || topicState.attempts === 0) return null;
  return Math.round((topicState.correct / topicState.attempts) * 100);
}

export function resetAllConfidence() {
  const fresh = defaultState();
  saveConfidenceState(fresh);
  return fresh;
}