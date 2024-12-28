import * as Tone from 'tone';

class AudioService {
  private players: Map<string, Tone.Player>;
  private context: Tone.Context | null;

  constructor() {
    this.players = new Map();
    this.context = null;
  }

  async initialize(): Promise<void> {
    if (!this.context) {
      this.context = new Tone.Context();
      await Tone.start();
      Tone.setContext(this.context);
    }
  }

  async loadAudio(id: string, file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    const player = new Tone.Player({
      url: URL.createObjectURL(new Blob([arrayBuffer])),
      loop: false,
      autostart: false,
    }).toDestination();

    await player.load();
    this.players.set(id, player);
  }

  async play(id: string): Promise<void> {
    const player = this.players.get(id);
    if (player) {
      await player.start();
    }
  }

  stop(id: string): void {
    const player = this.players.get(id);
    if (player) {
      player.stop();
    }
  }

  setVolume(id: string, volume: number): void {
    const player = this.players.get(id);
    if (player) {
      player.volume.value = Tone.gainToDb(volume);
    }
  }

  getPosition(id: string): number {
    const player = this.players.get(id);
    return player ? player.toSeconds(player.now()) : 0;
  }

  dispose(): void {
    this.players.forEach((player) => player.dispose());
    this.players.clear();
    if (this.context) {
      this.context.dispose();
      this.context = null;
    }
  }
}

export default new AudioService();
