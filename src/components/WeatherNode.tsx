import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Paper, 
  Typography, 
  IconButton, 
  CircularProgress,
  Box,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/BeachAccess';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherNodeData {
  label: string;
  type: string;
  id: string;
  onDelete?: () => void;
}

interface WeatherNodeProps {
  data: WeatherNodeData;
  isConnectable?: boolean;
}

const WeatherNode: React.FC<WeatherNodeProps> = ({ data, isConnectable }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchWeather = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('http://localhost:8000/api/weather');
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const data = await response.json();
      setWeatherData(data.weather);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handlePlay = async () => {
    if (!weatherData) {
      setError('No weather data available');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `The current weather at our campus is ${weatherData.temperature}°C with ${weatherData.description}. 
                Humidity is at ${weatherData.humidity}% and wind speed is ${weatherData.windSpeed} meters per second.`,
          voice_id: 'shruthi',
          emotion: 'informative'
        }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');
      
      const audioData = await response.json();
      if (audioRef.current) {
        audioRef.current.src = `data:audio/wav;base64,${audioData.audio_data}`;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play weather report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const getWeatherIcon = () => {
    if (!weatherData) return <CloudIcon />;
    const desc = weatherData.description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return <UmbrellaIcon />;
    if (desc.includes('cloud')) return <CloudIcon />;
    return <WbSunnyIcon />;
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        minWidth: 300,
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' ? '#1E1E1E' : '#ffffff'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <Typography variant="h6" gutterBottom>
        {data.label}
      </Typography>

      {weatherData ? (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getWeatherIcon()}
              <Typography variant="h4">
                {weatherData.temperature}°C
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {weatherData.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Humidity: {weatherData.humidity}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Wind: {weatherData.windSpeed} m/s
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          height: 100, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {isRefreshing ? (
            <CircularProgress />
          ) : (
            <Typography color="text.secondary">
              No weather data available
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isPlaying ? "Stop" : "Play"}>
            <IconButton 
              onClick={isPlaying ? handleStop : handlePlay}
              disabled={isLoading || !weatherData}
              color="primary"
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : isPlaying ? (
                <StopIcon />
              ) : (
                <PlayArrowIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh Weather">
            <IconButton 
              onClick={fetchWeather}
              disabled={isRefreshing}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Delete Node">
          <IconButton 
            onClick={data.onDelete}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />

      <audio 
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default WeatherNode;
