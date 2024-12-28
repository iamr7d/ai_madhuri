import React, { useEffect, useRef, useState } from 'react';
import { NodeProps } from 'reactflow';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LoopIcon from '@mui/icons-material/Loop';
import BaseNode, { BaseNodeData } from './BaseNode';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/audio';

interface MusicNodeData extends BaseNodeData {
  file?: File;
  isPlaying?: boolean;
  volume?: number;
}

const MusicNode: React.FC<NodeProps<MusicNodeData>> = (props) => {
  const { data, id } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data.file) {
      const formData = new FormData();
      formData.append('file', data.file);

      axios.post(`${API_BASE_URL}/waveform`, formData)
        .then(response => {
          setWaveformData(response.data);
          drawWaveform();
        })
        .catch(error => console.error('Error getting waveform:', error));
    }
  }, [data.file]);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const step = Math.ceil(waveformData.length / width);

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = '#6F7EAE';
    ctx.lineWidth = 2;

    for (let i = 0; i < width; i++) {
      const dataIndex = i * step;
      const x = i;
      const y = (waveformData[dataIndex] + 1) * height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  };

  const handlePlay = async () => {
    if (!data.file) return;

    const formData = new FormData();
    formData.append('file', data.file);

    try {
      await axios.post(`${API_BASE_URL}/play/${id}`, formData);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleStop = async () => {
    try {
      await axios.post(`${API_BASE_URL}/stop/${id}`);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const handleVolumeChange = async (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setVolume(value);
    try {
      await axios.post(`${API_BASE_URL}/volume/${id}?volume=${value}`);
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const handleLoopToggle = async () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);
    try {
      await axios.post(`${API_BASE_URL}/loop/${id}?loop=${newLoopState}`);
    } catch (error) {
      console.error('Error setting loop:', error);
    }
  };

  return (
    <BaseNode {...props}>
      <Box sx={{ width: '100%', height: '60px', mb: 1 }}>
        <canvas 
          ref={canvasRef}
          width={200}
          height={60}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        mt: 1 
      }}>
        {!isPlaying ? (
          <IconButton 
            size="small" 
            onClick={handlePlay}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'success.main',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <PlayArrowIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton 
            size="small" 
            onClick={handleStop}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: 'error.main',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <StopIcon fontSize="small" />
          </IconButton>
        )}

        <IconButton
          size="small"
          onClick={handleLoopToggle}
          color={isLooping ? "primary" : "default"}
          sx={{ 
            color: isLooping ? 'primary.main' : 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <LoopIcon fontSize="small" />
        </IconButton>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          flex: 1
        }}>
          <VolumeUpIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }} />
          <Slider
            size="small"
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              }
            }}
          />
        </Box>
      </Box>
    </BaseNode>
  );
};

export default MusicNode;
