import { useState, useEffect, useCallback } from 'react';
import { audioProcessingService } from '../services/AudioProcessingService';

interface AudioProcessingState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  mainVolume: number;
  bgmVolume: number;
}

export const useAudioProcessing = () => {
  const [state, setState] = useState<AudioProcessingState>({
    isPlaying: false,
    progress: 0,
    duration: 0,
    mainVolume: 1,
    bgmVolume: 0.2,
  });

  useEffect(() => {
    audioProcessingService.initialize();
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (state.isPlaying) {
      progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: audioProcessingService.getProgress(),
        }));
      }, 100);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [state.isPlaying]);

  const loadTrack = useCallback(async (trackUrl: string) => {
    await audioProcessingService.loadMainTrack(trackUrl);
    setState(prev => ({
      ...prev,
      duration: audioProcessingService.getDuration(),
    }));
  }, []);

  const loadBackgroundMusic = useCallback(async (bgmUrl: string) => {
    await audioProcessingService.loadBackgroundMusic(bgmUrl);
  }, []);

  const play = useCallback(async (fadeIn = true, fadeOut = true) => {
    await audioProcessingService.playWithFade(fadeIn, fadeOut);
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const stop = useCallback(() => {
    audioProcessingService.stop();
    setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
  }, []);

  const setMainVolume = useCallback((volume: number) => {
    audioProcessingService.setMainVolume(volume);
    setState(prev => ({ ...prev, mainVolume: volume }));
  }, []);

  const setBgmVolume = useCallback((volume: number) => {
    audioProcessingService.setBgmVolume(volume);
    setState(prev => ({ ...prev, bgmVolume: volume }));
  }, []);

  const seekTo = useCallback((position: number) => {
    audioProcessingService.seekTo(position);
  }, []);

  // Audio effects
  const addReverb = useCallback((amount: number) => {
    audioProcessingService.addReverb(amount);
  }, []);

  const addDelay = useCallback((time: number, feedback: number) => {
    audioProcessingService.addDelay(time, feedback);
  }, []);

  const addFilter = useCallback((frequency: number, type: BiquadFilterType = 'lowpass') => {
    audioProcessingService.addFilter(frequency, type);
  }, []);

  const addCompressor = useCallback((threshold: number, ratio: number) => {
    audioProcessingService.addCompressor(threshold, ratio);
  }, []);

  return {
    ...state,
    loadTrack,
    loadBackgroundMusic,
    play,
    stop,
    setMainVolume,
    setBgmVolume,
    seekTo,
    addReverb,
    addDelay,
    addFilter,
    addCompressor,
  };
};
