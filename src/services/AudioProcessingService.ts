import * as Tone from 'tone';

class AudioProcessingService {
  private mainPlayer: Tone.Player | null = null;
  private bgmPlayer: Tone.Player | null = null;
  private mainGain: Tone.Gain;
  private bgmGain: Tone.Gain;
  private fadeTime = 2; // seconds

  constructor() {
    this.mainGain = new Tone.Gain(1).toDestination();
    this.bgmGain = new Tone.Gain(0.2).toDestination();
  }

  async initialize() {
    await Tone.start();
    console.log('Audio context started');
  }

  async loadMainTrack(audioUrl: string) {
    try {
      this.mainPlayer = new Tone.Player({
        url: audioUrl,
        onload: () => {
          console.log('Main track loaded');
        },
      }).connect(this.mainGain);
    } catch (error) {
      console.error('Error loading main track:', error);
    }
  }

  async loadBackgroundMusic(bgmUrl: string) {
    try {
      this.bgmPlayer = new Tone.Player({
        url: bgmUrl,
        loop: true,
        onload: () => {
          console.log('Background music loaded');
        },
      }).connect(this.bgmGain);
    } catch (error) {
      console.error('Error loading background music:', error);
    }
  }

  setMainVolume(volume: number) {
    this.mainGain.gain.value = volume;
  }

  setBgmVolume(volume: number) {
    this.bgmGain.gain.value = volume;
  }

  async playWithFade(fadeIn = true, fadeOut = true) {
    if (!this.mainPlayer) {
      console.error('No main track loaded');
      return;
    }

    const now = Tone.now();

    if (fadeIn) {
      this.mainGain.gain.setValueAtTime(0, now);
      this.mainGain.gain.linearRampToValueAtTime(1, now + this.fadeTime);
    }

    this.mainPlayer.start();

    if (fadeOut && this.mainPlayer.buffer) {
      const duration = this.mainPlayer.buffer.duration;
      this.mainGain.gain.setValueAtTime(1, now + duration - this.fadeTime);
      this.mainGain.gain.linearRampToValueAtTime(0, now + duration);
    }
  }

  async playBackgroundMusic() {
    if (!this.bgmPlayer) {
      console.error('No background music loaded');
      return;
    }

    this.bgmPlayer.start();
  }

  stopBackgroundMusic() {
    if (this.bgmPlayer) {
      this.bgmPlayer.stop();
    }
  }

  stop() {
    if (this.mainPlayer) {
      this.mainPlayer.stop();
    }
    if (this.bgmPlayer) {
      this.bgmPlayer.stop();
    }
  }

  // Additional audio processing methods
  async addReverb(amount: number) {
    const reverb = new Tone.Reverb({
      decay: amount,
      wet: 0.5,
    }).toDestination();
    
    if (this.mainPlayer) {
      this.mainPlayer.disconnect(this.mainGain);
      this.mainPlayer.chain(reverb, this.mainGain);
    }
  }

  async addDelay(time: number, feedback: number) {
    const delay = new Tone.FeedbackDelay({
      delayTime: time,
      feedback: feedback,
    }).toDestination();
    
    if (this.mainPlayer) {
      this.mainPlayer.disconnect(this.mainGain);
      this.mainPlayer.chain(delay, this.mainGain);
    }
  }

  async addFilter(frequency: number, type: BiquadFilterType = 'lowpass') {
    const filter = new Tone.Filter({
      frequency: frequency,
      type: type,
    }).toDestination();
    
    if (this.mainPlayer) {
      this.mainPlayer.disconnect(this.mainGain);
      this.mainPlayer.chain(filter, this.mainGain);
    }
  }

  async addCompressor(threshold: number, ratio: number) {
    const compressor = new Tone.Compressor({
      threshold: threshold,
      ratio: ratio,
    }).toDestination();
    
    if (this.mainPlayer) {
      this.mainPlayer.disconnect(this.mainGain);
      this.mainPlayer.chain(compressor, this.mainGain);
    }
  }

  // Utility methods
  getProgress(): number {
    if (this.mainPlayer && this.mainPlayer.buffer) {
      return this.mainPlayer.position / this.mainPlayer.buffer.duration;
    }
    return 0;
  }

  getDuration(): number {
    if (this.mainPlayer && this.mainPlayer.buffer) {
      return this.mainPlayer.buffer.duration;
    }
    return 0;
  }

  seekTo(position: number) {
    if (this.mainPlayer) {
      this.mainPlayer.seek(position);
    }
  }
}

export const audioProcessingService = new AudioProcessingService();
