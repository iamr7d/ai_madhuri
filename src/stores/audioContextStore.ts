import { create } from 'zustand';
import * as Tone from 'tone';

interface AudioContextStore {
  context: Tone.Context | null;
  isStarted: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAudioContext: () => Promise<void>;
  startAudioContext: () => Promise<void>;
  stopAudioContext: () => Promise<void>;
  resetError: () => void;
}

export const useAudioContextStore = create<AudioContextStore>((set) => ({
  context: null,
  isStarted: false,
  isLoading: false,
  error: null,

  initializeAudioContext: async () => {
    try {
      const context = new Tone.Context();
      await Tone.start();
      Tone.setContext(context);
      set({ context });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize audio context';
      set({ error: errorMessage });
    }
  },

  startAudioContext: async () => {
    set({ isLoading: true, error: null });
    try {
      await Tone.start();
      set({ isStarted: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start audio context';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  stopAudioContext: async () => {
    set({ isLoading: true, error: null });
    try {
      const { context } = useAudioContextStore.getState();
      if (context) {
        await context.close();
      }
      set({ isStarted: false, context: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop audio context';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  resetError: () => set({ error: null }),
}));
