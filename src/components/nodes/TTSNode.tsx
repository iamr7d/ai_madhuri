import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Paper, TextField, IconButton, Slider, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import * as Tone from 'tone';

interface TTSNodeProps {
  data: {
    label: string;
  };
  selected: boolean;
}

const TTSNode: React.FC<TTSNodeProps> = ({ data, selected }) => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.5);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const bgmPlayerRef = useRef<Tone.Player | null>(null);
  const nodeColor = '#9c27b0';

  useEffect(() => {
    // Initialize BGM player with a default ambient track
    bgmPlayerRef.current = new Tone.Player({
      url: '/assets/audio/ambient-bgm.mp3', // Add your default BGM file
      loop: true,
      volume: bgmVolume,
    }).toDestination();

    return () => {
      if (bgmPlayerRef.current) {
        bgmPlayerRef.current.dispose();
      }
    };
  }, []);

  const handlePlay = async () => {
    if (!text) return;

    try {
      await Tone.start();
      setIsPlaying(true);

      // Start BGM with fade in
      if (bgmPlayerRef.current) {
        bgmPlayerRef.current.volume.value = -60;
        bgmPlayerRef.current.start();
        bgmPlayerRef.current.volume.rampTo(bgmVolume * 20 - 20, 1); // Convert to dB
      }

      // Simulate TTS playback (replace with actual TTS implementation)
      setTimeout(() => {
        handleStop();
      }, 5000);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    // Fade out BGM
    if (bgmPlayerRef.current) {
      bgmPlayerRef.current.volume.rampTo(-60, 1);
      setTimeout(() => {
        bgmPlayerRef.current?.stop();
      }, 1000);
    }
  };

  return (
    <Paper
      elevation={selected ? 8 : 3}
      sx={{
        minWidth: 280,
        maxWidth: 320,
        backgroundColor: 'rgba(26, 32, 53, 0.95)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${selected ? nodeColor : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(nodeColor, 0.2)}`,
        },
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: nodeColor,
          width: 8,
          height: 8,
          border: 'none',
          boxShadow: `0 0 8px ${alpha(nodeColor, 0.5)}`,
        }}
      />
      
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              color: nodeColor,
              display: 'flex',
              alignItems: 'center',
              p: 0.5,
              borderRadius: '8px',
              backgroundColor: alpha(nodeColor, 0.1),
            }}
          >
            <RecordVoiceOverIcon />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
            }}
          >
            {data.label}
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to speak..."
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: nodeColor,
              },
            },
          }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            BGM Volume
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={bgmVolume}
              onChange={(_, value) => setBgmVolume(value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{
                color: nodeColor,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                },
              }}
            />
            <VolumeUpIcon sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Voice Volume
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={voiceVolume}
              onChange={(_, value) => setVoiceVolume(value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{
                color: nodeColor,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                },
              }}
            />
            <VolumeUpIcon sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={isPlaying ? handleStop : handlePlay}
            disabled={!text}
            sx={{
              backgroundColor: alpha(nodeColor, 0.1),
              color: nodeColor,
              '&:hover': {
                backgroundColor: alpha(nodeColor, 0.2),
              },
              '&.Mui-disabled': {
                backgroundColor: alpha(nodeColor, 0.05),
                color: alpha(nodeColor, 0.3),
              },
            }}
          >
            {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Box>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 8,
          height: 8,
          border: 'none',
          boxShadow: `0 0 8px ${alpha(nodeColor, 0.5)}`,
        }}
      />
    </Paper>
  );
};

export default TTSNode;
