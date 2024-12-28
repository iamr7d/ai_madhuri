export interface AudioNodeEditorRef {
  handleSequencePlay: (sequence: string) => void;
  handleStop: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleSeek: (time: number) => void;
  handleVolumeChange: (volume: number) => void;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  sequence: string;
  error: string | null;
}

export interface AudioNode {
  id: string;
  type: 'music' | 'weather' | 'effect';
  data: {
    label: string;
    file?: File;
    volume?: number;
    isPlaying?: boolean;
    location?: string;
  };
}
