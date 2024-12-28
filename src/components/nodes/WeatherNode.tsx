import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  TextField,
  Slider,
  Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTheme } from '@mui/material/styles';
import BaseNode from './BaseNode';
import { useAudioStore } from '../../stores/audioStore';

interface WeatherNodeProps {
  id: string;
  data: {
    label: string;
    location?: string;
    volume?: number;
  };
  selected: boolean;
}

const WeatherNode: React.FC<WeatherNodeProps> = ({ id, data, selected }) => {
  const theme = useTheme();
  const [location, setLocation] = useState(data.location || '');
  const [volume, setVolume] = useState(data.volume ?? 1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPlaying: isAudioPlaying, playNode, stopNode } = useAudioStore();

  const handlePlayPause = () => {
    if (isAudioPlaying) {
      stopNode(id);
    } else {
      playNode(id);
    }
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(value);
    if (value === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  return (
    <BaseNode
      title={data.label}
      icon={<WbSunnyIcon />}
      type="weather"
      selected={selected}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            size="small"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter location..."
            InputProps={{
              startAdornment: (
                <LocationOnIcon 
                  sx={{ 
                    mr: 1, 
                    color: theme.palette.warning.main,
                    opacity: 0.7,
                  }} 
                />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.warning.main,
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handlePlayPause}
            disabled={!location.trim()}
            size="small"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                color: theme.palette.warning.main,
              },
            }}
          >
            {isAudioPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <IconButton
              onClick={handleMuteToggle}
              size="small"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  color: theme.palette.warning.main,
                },
              }}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.01}
              disabled={isMuted}
              sx={{
                color: theme.palette.warning.main,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${theme.palette.warning.main}20`,
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </BaseNode>
  );
};

export default WeatherNode;
