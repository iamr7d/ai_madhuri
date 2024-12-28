import { create } from 'zustand';
import * as Tone from 'tone';

interface AudioContextStore {
  isStarted: boolean;
  isLoading: boolean;
  error: string | null;
  startAudioContext: () => Promise<void>;
  stopAudioContext: () => Promise<void>;
  resetError: () => void;
}

let audioNodes: {
  limiter?: Tone.Limiter;
  compressor?: Tone.Compressor;
  gain?: Tone.Gain;
} = {};

export const useAudioContextStore = create<AudioContextStore>((set) => ({
  isStarted: false,
  isLoading: false,
  error: null,
  startAudioContext: async () => {
    set({ isLoading: true, error: null });
    try {
      // Initialize Tone with settings
      await Tone.start({
        latencyHint: 'interactive',
        lookAhead: 0.1,
        updateInterval: 0.03
      });
      
      // Set up audio chain if not already set up
      if (!audioNodes.limiter) {
        audioNodes.limiter = new Tone.Limiter(-3).toDestination();
        audioNodes.compressor = new Tone.Compressor({
          threshold: -24,
          ratio: 12,
          attack: 0.003,
          release: 0.25,
          knee: 30
        }).connect(audioNodes.limiter);
        
        audioNodes.gain = new Tone.Gain(0.8).connect(audioNodes.compressor);
      }

      set({ isStarted: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start audio context';
      console.error('Audio context error:', error);
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  stopAudioContext: async () => {
    try {
      // Clean up audio nodes
      if (audioNodes.gain) {
        audioNodes.gain.dispose();
        audioNodes.compressor?.dispose();
        audioNodes.limiter?.dispose();
        audioNodes = {};
      }

      // Stop transport if running
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
      }

      // Close context
      const context = Tone.getContext();
      if (context.state !== 'closed') {
        await context.close();
      }
      
      set({ isStarted: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop audio context';
      set({ error: errorMessage });
      throw error;
    }
  },
  resetError: () => set({ error: null }),
}));
