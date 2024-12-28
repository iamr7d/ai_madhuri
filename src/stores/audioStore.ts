import { create } from 'zustand';
import * as Tone from 'tone';

interface AudioNode {
  player?: Tone.Player;
  effect?: Tone.ToneAudioNode;
  connections: Set<string>;
}

interface AudioStore {
  nodes: Map<string, AudioNode>;
  addTrackToNode: (nodeId: string, file: File) => Promise<void>;
  removeTrackFromNode: (nodeId: string) => void;
  addEffect: (nodeId: string, effect: Tone.ToneAudioNode) => void;
  removeEffect: (nodeId: string) => void;
  connectNodes: (sourceId: string, targetId: string) => void;
  disconnectNodes: (sourceId: string, targetId: string) => void;
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

export const useAudioStore = create<AudioStore>((set, get) => ({
  nodes: new Map(),
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,

  addTrackToNode: async (nodeId, file) => {
    const { nodes } = get();
    const existingNode = nodes.get(nodeId);
    
    if (existingNode?.player) {
      existingNode.player.dispose();
    }

    const buffer = await Tone.Buffer.fromUrl(URL.createObjectURL(file));
    const player = new Tone.Player(buffer).toDestination();
    
    nodes.set(nodeId, {
      player,
      connections: new Set(),
      ...(existingNode || {})
    });
    
    set({ nodes: new Map(nodes) });
  },

  removeTrackFromNode: (nodeId) => {
    const { nodes } = get();
    const node = nodes.get(nodeId);
    
    if (node?.player) {
      node.player.dispose();
    }
    
    nodes.delete(nodeId);
    set({ nodes: new Map(nodes) });
  },

  addEffect: (nodeId, effect) => {
    const { nodes } = get();
    nodes.set(nodeId, {
      effect,
      connections: new Set(),
      ...(nodes.get(nodeId) || {})
    });
    set({ nodes: new Map(nodes) });
  },

  removeEffect: (nodeId) => {
    const { nodes } = get();
    const node = nodes.get(nodeId);
    
    if (node?.effect) {
      node.effect.dispose();
    }
    
    nodes.delete(nodeId);
    set({ nodes: new Map(nodes) });
  },

  connectNodes: (sourceId, targetId) => {
    const { nodes } = get();
    const sourceNode = nodes.get(sourceId);
    const targetNode = nodes.get(targetId);

    if (sourceNode && targetNode) {
      // Disconnect any existing connections first
      if (sourceNode.player && targetNode.effect) {
        sourceNode.player.disconnect();
        sourceNode.player.connect(targetNode.effect);
      }

      // Update connections set
      sourceNode.connections.add(targetId);
      nodes.set(sourceId, sourceNode);
      set({ nodes: new Map(nodes) });
    }
  },

  disconnectNodes: (sourceId, targetId) => {
    const { nodes } = get();
    const sourceNode = nodes.get(sourceId);
    
    if (sourceNode) {
      sourceNode.connections.delete(targetId);
      
      if (sourceNode.player) {
        sourceNode.player.disconnect();
        // Reconnect to remaining connections
        sourceNode.connections.forEach(id => {
          const targetNode = nodes.get(id);
          if (targetNode?.effect) {
            sourceNode.player?.connect(targetNode.effect);
          }
        });
      }
      
      nodes.set(sourceId, sourceNode);
      set({ nodes: new Map(nodes) });
    }
  },

  playNode: async (nodeId) => {
    const { nodes } = get();
    const node = nodes.get(nodeId);
    
    if (node?.player) {
      try {
        await node.player.start();
      } catch (error) {
        console.error('Error playing node:', error);
      }
    }
  },

  stopNode: (nodeId) => {
    const { nodes } = get();
    const node = nodes.get(nodeId);
    
    if (node?.player) {
      try {
        node.player.stop();
      } catch (error) {
        console.error('Error stopping node:', error);
      }
    }
  },

  cleanup: () => {
    const { nodes } = get();
    nodes.forEach(node => {
      if (node.player) node.player.dispose();
      if (node.effect) node.effect.dispose();
    });
    nodes.clear();
    set({ nodes: new Map() });
  },

  playSequence: (sequence: string) => {
    set({ isPlaying: true });
    // Implement sequence playback logic here
  },
  stopSequence: () => {
    set({ isPlaying: false });
    // Implement stop logic here
  },
  setVolume: (volume: number) => {
    set({ volume });
    Tone.getDestination().volume.value = Tone.gainToDb(volume);
  },
}));
