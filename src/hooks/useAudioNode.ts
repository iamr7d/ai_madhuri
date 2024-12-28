import { useState, useEffect, useCallback } from 'react';
import { createAudioContext, loadAudio, playAudioBuffer, createGainNode, fadeAudio } from '../utils/audioUtils';

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioBuffer: AudioBuffer | null;
}

export const useAudioNode = () => {
  const [audioContext] = useState(createAudioContext);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    audioBuffer: null,
  });
  const [gainNode] = useState(() => createGainNode(audioContext));
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    gainNode.connect(audioContext.destination);
    return () => {
      gainNode.disconnect();
    };
  }, [gainNode, audioContext]);

  const loadFile = useCallback(async (file: File) => {
    try {
      const buffer = await loadAudio(file, audioContext);
      setAudioState(prev => ({
        ...prev,
        audioBuffer: buffer,
        duration: buffer.duration,
      }));
      return true;
    } catch (error) {
      console.error('Error loading audio file:', error);
      return false;
    }
  }, [audioContext]);

  const play = useCallback(() => {
    if (!audioState.audioBuffer) return;

    const newSource = audioContext.createBufferSource();
    newSource.buffer = audioState.audioBuffer;
    newSource.connect(gainNode);

    newSource.start(0, audioState.currentTime);
    setSource(newSource);
    setAudioState(prev => ({ ...prev, isPlaying: true }));

    newSource.onended = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };
  }, [audioContext, audioState.audioBuffer, audioState.currentTime, gainNode]);

  const pause = useCallback(() => {
    if (source) {
      source.stop();
      setSource(null);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [source]);

  const setVolume = useCallback((value: number) => {
    gainNode.gain.value = value;
    setAudioState(prev => ({ ...prev, volume: value }));
  }, [gainNode]);

  const fadeIn = useCallback((duration: number) => {
    fadeAudio(gainNode, 0, audioState.volume, duration);
  }, [gainNode, audioState.volume]);

  const fadeOut = useCallback((duration: number) => {
    fadeAudio(gainNode, audioState.volume, 0, duration);
  }, [gainNode, audioState.volume]);

  const seek = useCallback((time: number) => {
    const wasPlaying = audioState.isPlaying;
    if (wasPlaying) {
      pause();
    }
    setAudioState(prev => ({ ...prev, currentTime: time }));
    if (wasPlaying) {
      play();
    }
  }, [audioState.isPlaying, pause, play]);

  return {
    audioState,
    loadFile,
    play,
    pause,
    setVolume,
    fadeIn,
    fadeOut,
    seek,
  };
};

export default useAudioNode;
