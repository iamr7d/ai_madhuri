import React, { useEffect } from 'react';
import { useAudioContextStore } from '../stores/audioContextStore';

const AudioContextInitializer: React.FC = () => {
  const { initializeAudioContext, startAudioContext } = useAudioContextStore();

  useEffect(() => {
    const handleUserInteraction = async () => {
      await startAudioContext();
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    // Initialize audio context
    initializeAudioContext();

    // Cleanup
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [initializeAudioContext, startAudioContext]);

  return null;
};

export default AudioContextInitializer;
