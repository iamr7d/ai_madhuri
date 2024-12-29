import { Node, Edge } from 'reactflow';
import { ReactNode } from 'react';

export type NodeType = 'weather' | 'news' | 'tts' | 'audioSource' | 'music' | 'ainews';

export interface NodeData {
  label: string;
  title?: string;
  icon?: ReactNode;
  selected?: boolean;
  audioFile?: File;
  text?: string;
}

export interface CustomNode extends Node<NodeData> {
  type: NodeType;
}

export interface AudioContextStore {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initializeAudioContext: () => Promise<void>;
  closeAudioContext: () => void;
}

export interface AudioStore {
  nodes: Map<string, Tone.Player>;
  addTrackToNode: (nodeId: string, file: File) => Promise<void>;
  playNode: (nodeId: string) => Promise<void>;
  stopNode: (nodeId: string) => void;
  cleanup: () => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSequence: (sequence: string) => void;
  stopSequence: () => void;
  setVolume: (volume: number) => void;
}

export interface GraphState {
  nodes: CustomNode[];
  edges: Edge[];
}
