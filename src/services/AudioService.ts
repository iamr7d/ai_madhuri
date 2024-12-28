import * as Tone from 'tone';

class AudioService {
  private player: Tone.Player | null = null;
  private audioContext: AudioContext | null = null;

  async initialize() {
    await Tone.start();
    this.audioContext = Tone.context.rawContext;
  }

  async loadAudio(audioData: string) {
    if (this.player) {
      this.player.dispose();
    }
    
    const audioBuffer = await this.base64ToAudioBuffer(audioData);
    this.player = new Tone.Player(audioBuffer).toDestination();
  }

  async play() {
    if (this.player) {
      await this.player.start();
    }
  }

  pause() {
    if (this.player) {
      this.player.stop();
    }
  }

  seek(time: number) {
    if (this.player) {
      this.player.seek(time);
    }
  }

  getCurrentTime(): number {
    return this.player ? this.player.currentTime : 0;
  }

  getDuration(): number {
    return this.player ? this.player.buffer.duration : 0;
  }

  private async base64ToAudioBuffer(base64String: string): Promise<AudioBuffer> {
    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const audioData = await this.audioContext!.decodeAudioData(bytes.buffer);
    return audioData;
  }
}

export const audioService = new AudioService();
