import * as Tone from 'tone';
import { CustomNode } from '../types/flowTypes';

class AudioProcessingService {
  private nodes: Map<string, Tone.ToneAudioNode>;
  private context: Tone.Context | null;

  constructor() {
    this.nodes = new Map();
    this.context = null;
  }

  async initialize(): Promise<void> {
    if (!this.context) {
      this.context = new Tone.Context();
      await Tone.start();
      Tone.setContext(this.context);
    }
  }

  createNode(type: string, options: any = {}): Tone.ToneAudioNode {
    let node: Tone.ToneAudioNode;

    switch (type) {
      case 'player':
        node = new Tone.Player(options).toDestination();
        break;
      case 'oscillator':
        node = new Tone.Oscillator(options).toDestination();
        break;
      case 'filter':
        node = new Tone.Filter(options).toDestination();
        break;
      case 'reverb':
        node = new Tone.Reverb(options).toDestination();
        break;
      case 'delay':
        node = new Tone.FeedbackDelay(options).toDestination();
        break;
      default:
        throw new Error(`Unknown node type: ${type}`);
    }

    return node;
  }

  async loadAudioNode(id: string, file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    const node = new Tone.Player({
      url: URL.createObjectURL(new Blob([arrayBuffer])),
      loop: false,
      autostart: false,
    }).toDestination();

    await node.load();
    this.nodes.set(id, node);
  }

  connectNodes(source: string, destination: string): void {
    const sourceNode = this.nodes.get(source);
    const destNode = this.nodes.get(destination);

    if (sourceNode && destNode) {
      sourceNode.connect(destNode);
    }
  }

  disconnectNodes(source: string, destination: string): void {
    const sourceNode = this.nodes.get(source);
    const destNode = this.nodes.get(destination);

    if (sourceNode && destNode) {
      sourceNode.disconnect(destNode);
    }
  }

  async playNode(id: string): Promise<void> {
    const node = this.nodes.get(id);
    if (node instanceof Tone.Player) {
      await node.start();
    }
  }

  stopNode(id: string): void {
    const node = this.nodes.get(id);
    if (node instanceof Tone.Player) {
      node.stop();
    }
  }

  getNodePosition(id: string): number {
    const node = this.nodes.get(id);
    if (node instanceof Tone.Player) {
      return node.toSeconds(node.now());
    }
    return 0;
  }

  dispose(): void {
    this.nodes.forEach((node) => node.dispose());
    this.nodes.clear();
    if (this.context) {
      this.context.dispose();
      this.context = null;
    }
  }
}

export default new AudioProcessingService();
