import { Node, Edge } from '@reactflow/core';
import * as Tone from 'tone';

export type NodeType = 'weather' | 'news' | 'tts' | 'audioSource';

export interface NodeData {
  label: string;
  audioFile?: File;
  text?: string;
  title?: string;
  icon?: React.ReactNode;
  selected?: boolean;
}

export type CustomNode = Node<NodeData>;

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

export interface AudioContextStore {
  context: Tone.Context | null;
  initializeAudioContext: () => void;
  closeAudioContext: () => void;
}

export interface GraphState {
  nodes: CustomNode[];
  edges: Edge[];
}
