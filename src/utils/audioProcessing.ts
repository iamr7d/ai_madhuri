import { AudioNode as FlowAudioNode } from '../types/flowTypes';

export interface AudioSegment {
  type: 'music' | 'tts' | 'weather' | 'news' | 'announcement';
  duration: number;
  fadeIn: number;
  fadeOut: number;
  volume: number;
  content: any;
}

export interface ProcessedAudio {
  buffer: AudioBuffer;
  duration: number;
  peakData: Float32Array;
}

export class AudioProcessor {
  private context: AudioContext;
  private defaultFadeTime = 1.5; // Default fade duration in seconds

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async processTrack(track: AudioSegment): Promise<ProcessedAudio> {
    // Create source buffer
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    const analyser = this.context.createAnalyser();
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(this.context.destination);

    // Apply fade in
    const startTime = this.context.currentTime;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(track.volume, startTime + track.fadeIn);

    // Apply fade out
    const endTime = startTime + track.duration;
    gainNode.gain.setValueAtTime(track.volume, endTime - track.fadeOut);
    gainNode.gain.linearRampToValueAtTime(0, endTime);

    // Process peak data
    const bufferLength = analyser.frequencyBinCount;
    const peakData = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(peakData);

    return {
      buffer: source.buffer!,
      duration: track.duration,
      peakData
    };
  }

  async crossfadeTracks(track1: ProcessedAudio, track2: ProcessedAudio, crossfadeDuration: number = 2): Promise<ProcessedAudio> {
    const fadeStartTime = track1.duration - crossfadeDuration;
    
    // Create buffer for combined audio
    const combinedLength = Math.max(track1.duration, track2.duration) * this.context.sampleRate;
    const combinedBuffer = this.context.createBuffer(2, combinedLength, this.context.sampleRate);
    
    // Mix the tracks with crossfade
    for (let channel = 0; channel < 2; channel++) {
      const channelData = combinedBuffer.getChannelData(channel);
      const track1Data = track1.buffer.getChannelData(channel);
      const track2Data = track2.buffer.getChannelData(channel);
      
      for (let i = 0; i < combinedLength; i++) {
        const time = i / this.context.sampleRate;
        if (time < fadeStartTime) {
          channelData[i] = track1Data[i];
        } else if (time > track1.duration) {
          channelData[i] = track2Data[i - Math.floor(track1.duration * this.context.sampleRate)];
        } else {
          const fadePosition = (time - fadeStartTime) / crossfadeDuration;
          channelData[i] = track1Data[i] * (1 - fadePosition) + track2Data[i - Math.floor(fadeStartTime * this.context.sampleRate)] * fadePosition;
        }
      }
    }

    // Calculate new peak data
    const analyser = this.context.createAnalyser();
    const bufferLength = analyser.frequencyBinCount;
    const peakData = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(peakData);

    return {
      buffer: combinedBuffer,
      duration: Math.max(track1.duration, track2.duration),
      peakData
    };
  }

  calculateOptimalFade(track1Type: string, track2Type: string): number {
    // Define fade durations based on track type combinations
    const fadeDurations = {
      music: {
        music: 2.0,
        tts: 1.5,
        weather: 1.5,
        news: 1.5,
        announcement: 1.0
      },
      tts: {
        music: 1.5,
        tts: 1.0,
        weather: 1.0,
        news: 1.0,
        announcement: 0.8
      }
    };

    return fadeDurations[track1Type as keyof typeof fadeDurations]?.[track2Type as keyof typeof fadeDurations[keyof typeof fadeDurations]] || this.defaultFadeTime;
  }

  async generateSilence(duration: number): Promise<AudioBuffer> {
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, duration * sampleRate, sampleRate);
    return buffer;
  }

  async normalizeVolume(buffer: AudioBuffer, targetLevel: number = -3): Promise<AudioBuffer> {
    const channels = buffer.numberOfChannels;
    const normalizedBuffer = this.context.createBuffer(channels, buffer.length, buffer.sampleRate);
    
    // Find peak amplitude
    let maxAmplitude = 0;
    for (let channel = 0; channel < channels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++) {
        maxAmplitude = Math.max(maxAmplitude, Math.abs(channelData[i]));
      }
    }
    
    // Calculate normalization factor
    const targetAmplitude = Math.pow(10, targetLevel / 20);
    const factor = targetAmplitude / maxAmplitude;
    
    // Apply normalization
    for (let channel = 0; channel < channels; channel++) {
      const channelData = buffer.getChannelData(channel);
      const normalizedData = normalizedBuffer.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++) {
        normalizedData[i] = channelData[i] * factor;
      }
    }
    
    return normalizedBuffer;
  }
}
