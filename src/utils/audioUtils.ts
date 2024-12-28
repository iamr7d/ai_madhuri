import { Node, Edge } from '@reactflow/core';
import * as Tone from 'tone';
import { CustomNode } from '../types/flowTypes';

// Constants for node dimensions and spacing
export const NODE_WIDTH = 280;
export const NODE_GAP = 100;

/**
 * Format time in seconds to MM:SS format
 * @param time Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (time: number): string => {
  if (isNaN(time) || !isFinite(time)) return '00:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Create an audio context
 * @returns AudioContext
 */
export const createAudioContext = (): AudioContext => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

/**
 * Load audio from a file
 * @param file Audio file
 * @returns Promise<AudioBuffer>
 */
export const loadAudio = async (file: File): Promise<AudioBuffer> => {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = createAudioContext();
  return await audioContext.decodeAudioData(arrayBuffer);
};

/**
 * Play an audio buffer
 * @param audioContext Audio context
 * @param buffer Audio buffer
 * @param gainNode Gain node
 * @returns AudioBufferSourceNode
 */
export const playAudioBuffer = (
  audioContext: AudioContext,
  buffer: AudioBuffer,
  gainNode: GainNode
): AudioBufferSourceNode => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.start();
  return source;
};

/**
 * Create a gain node
 * @param audioContext Audio context
 * @returns GainNode
 */
export const createGainNode = (audioContext: AudioContext): GainNode => {
  return audioContext.createGain();
};

/**
 * Fade audio
 * @param gainNode Gain node
 * @param startValue Start value
 * @param endValue End value
 * @param duration Duration
 */
export const fadeAudio = (gainNode: GainNode, startValue: number, endValue: number, duration: number): void => {
  const currentTime = gainNode.context.currentTime;
  gainNode.gain.setValueAtTime(startValue, currentTime);
  gainNode.gain.linearRampToValueAtTime(endValue, currentTime + duration);
};

/**
 * Create a Tone.js player
 * @param url Audio URL
 * @returns Tone.Player
 */
export const createPlayer = (url: string): Tone.Player => {
  return new Tone.Player(url).toDestination();
};

/**
 * Create a Tone.js volume
 * @returns Tone.Volume
 */
export const createVolume = (): Tone.Volume => {
  return new Tone.Volume().toDestination();
};

/**
 * Connect Tone.js nodes
 * @param source Source node
 * @param destination Destination node
 */
export const connectToneNodes = (source: Tone.ToneAudioNode, destination: Tone.ToneAudioNode): void => {
  source.connect(destination);
};

/**
 * Apply fade effect to audio data
 * @param data Audio data
 * @param fadeLength Length of fade in samples
 * @param isFadeIn Whether to fade in or out
 */
export const applyFade = (data: Float32Array, fadeLength: number, isFadeIn: boolean) => {
  for (let i = 0; i < fadeLength; i++) {
    const gain = isFadeIn ? i / fadeLength : 1 - (i / fadeLength);
    const index = isFadeIn ? i : data.length - 1 - i;
    data[index] *= gain;
  }
};

/**
 * Connect audio nodes with proper fade handling
 * @param source Source audio node
 * @param destination Destination audio node
 * @param fadeInTime Fade in time in seconds
 * @param fadeOutTime Fade out time in seconds
 */
export const connectAudioNodes = (
  source: AudioNode,
  destination: AudioNode,
  fadeInTime: number = 0,
  fadeOutTime: number = 0
) => {
  const audioContext = source.context;
  const gainNode = audioContext.createGain();

  // Connect nodes
  source.connect(gainNode);
  gainNode.connect(destination);

  // Apply fades if specified
  if (fadeInTime > 0) {
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeInTime);
  }

  if (fadeOutTime > 0) {
    const startTime = audioContext.currentTime + (source as AudioBufferSourceNode).buffer!.duration - fadeOutTime;
    gainNode.gain.setValueAtTime(1, startTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + fadeOutTime);
  }

  return gainNode;
};

/**
 * Create an audio node
 * @param type Type of node
 * @param position Position of node
 * @returns Node
 */
export const createAudioNode = (type: string, position: { x: number; y: number }): Node<CustomNode> => {
  return {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: {
      label: type.charAt(0).toUpperCase() + type.slice(1),
    },
  };
};

/**
 * Connect nodes
 * @param nodes Nodes to connect
 * @param edges Edges to connect
 */
export const connectNodes = (nodes: Node<CustomNode>[], edges: Edge[]): void => {
  edges.forEach((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    if (sourceNode && targetNode) {
      // Connect audio nodes using Tone.js
      const source = Tone.getDestination(); // Replace with actual source node
      const target = Tone.getDestination(); // Replace with actual target node
      source.connect(target);
    }
  });
};

/**
 * Disconnect nodes
 * @param edge Edge to disconnect
 */
export const disconnectNodes = (edge: Edge): void => {
  const source = Tone.getDestination(); // Replace with actual source node
  const target = Tone.getDestination(); // Replace with actual target node
  source.disconnect(target);
};
