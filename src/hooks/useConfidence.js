// useConfidence.js
import { useState, useCallback } from 'react';
import {
  loadConfidenceState,
  recordAnswer,
  resetAllConfidence,
} from '../store/confidenceStore';
import { detectTopicFromQuestion } from '../data/topicMap';

export function useConfidence() {
  const [state, setState] = useState(() => loadConfidenceState());

  const recordResult = useCallback((questionText, result) => {
    // Auto-detect the topic from question text
    const topic = detectTopicFromQuestion(questionText);
    if (!topic) return;

    setState(prev => recordAnswer(prev, topic.id, result));
  }, []);

  const recordResultByTopicId = useCallback((topicId, result) => {
    setState(prev => recordAnswer(prev, topicId, result));
  }, []);

  const reset = useCallback(() => {
    const fresh = resetAllConfidence();
    setState(fresh);
  }, []);

  return { confidenceState: state, recordResult, recordResultByTopicId, reset };
}