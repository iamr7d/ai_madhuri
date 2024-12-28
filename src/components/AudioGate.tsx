import React, { useEffect } from 'react';
import { useAudioContextStore } from '../stores/audioContextStore';
import * as Tone from 'tone';

const AudioGate: React.FC = () => {
  const { startAudioContext, isStarted } = useAudioContextStore();

  useEffect(() => {
    const initAudioContext = async () => {
      if (!isStarted && Tone.getContext().state !== 'running') {
        try {
          await startAudioContext();
        } catch (error) {
          console.error('Failed to start audio context:', error);
        }
      }
    };

    initAudioContext();
  }, [startAudioContext, isStarted]);

  return null;
};

export default AudioGate;
