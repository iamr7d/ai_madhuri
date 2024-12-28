export interface Track {
  id: string;
  title: string;
  duration: string;
  type: 'audio' | 'tts' | 'weather' | 'news';
  content?: string;
  status: 'ready' | 'playing' | 'paused' | 'error';
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrackId: string | null;
}

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export interface NewsItem {
  title: string;
  timestamp: string;
  source: string;
}
