import { Node, Edge } from 'react-flow-renderer';

export interface AudioNode extends Node {
  data: {
    type: 'music' | 'tts' | 'weather' | 'news' | 'announcement';
    label: string;
    color: string;
    content?: any;
    duration?: number;
    fadeIn?: number;
    fadeOut?: number;
    volume?: number;
    settings?: AudioNodeSettings;
  };
}

export interface AudioNodeSettings {
  // Music settings
  file?: File;
  loop?: boolean;
  
  // TTS settings
  text?: string;
  voice?: string;
  speed?: number;
  
  // Weather settings
  location?: string;
  forecastType?: 'current' | 'forecast';
  
  // News settings
  category?: string;
  count?: number;
  sortBy?: 'latest' | 'popular';
  
  // Announcement settings
  priority?: 'normal' | 'high' | 'urgent';
  repeat?: number;
}

export interface AudioSequence {
  nodes: AudioNode[];
  edges: Edge[];
  totalDuration: number;
  created: Date;
  modified: Date;
}
