import { Node, Edge } from 'reactflow';

export interface CustomNode extends Node {
  id: string;
  type: string;
  data: {
    label: string;
    audioFile?: File;
    text?: string;
    volume?: number;
    isPlaying?: boolean;
    location?: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface AudioStore {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSequence: (sequence: string) => void;
  stopSequence: () => void;
  setVolume: (volume: number) => void;
}

export interface AudioContextStore {
  context: AudioContext | null;
  initializeAudioContext: () => void;
  closeAudioContext: () => void;
}

export interface BaseNodeProps {
  id: string;
  type: string;
  data: {
    label: string;
    title?: string;
    icon?: React.ReactNode;
    selected?: boolean;
  };
}

export interface GraphState {
  nodes: CustomNode[];
  edges: Edge[];
}

export enum NodeType {
  AUDIO = 'audio',
  WEATHER = 'weather',
  NEWS = 'news',
  TTS = 'tts',
  EFFECT = 'effect'
}
