import { useState, useCallback, useRef } from 'react';

export function useSpeech() {
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleSpeech = useCallback((idx: number, text: string) => {
    // If already speaking this message, stop it
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.pitch = 1;
    utterance.rate = 1.1;

    utterance.onstart = () => {
      setSpeakingIdx(idx);
    };

    utterance.onend = () => {
      setSpeakingIdx(null);
    };

    utterance.onerror = () => {
      setSpeakingIdx(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speakingIdx]);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingIdx(null);
  }, []);

  return {
    speakingIdx,
    toggleSpeech,
    stopSpeech,
  };
}
