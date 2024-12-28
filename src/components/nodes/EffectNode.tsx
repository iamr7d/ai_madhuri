import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Box, Paper, Slider, Typography, IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import * as Tone from 'tone';

interface EffectNodeProps {
  data: {
    label: string;
  };
  selected: boolean;
}

const EffectNode: React.FC<EffectNodeProps> = ({ data, selected }) => {
  const theme = useTheme();
  const [fadeIn, setFadeIn] = useState(0.5);
  const [fadeOut, setFadeOut] = useState(0.5);
  const effectRef = useRef<Tone.Volume | null>(null);
  const nodeColor = theme.palette.info.main;

  useEffect(() => {
    // Initialize effect
    effectRef.current = new Tone.Volume(0).toDestination();
    
    return () => {
      if (effectRef.current) {
        effectRef.current.dispose();
      }
    };
  }, []);

  const handleFadeInChange = useCallback((_, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setFadeIn(newValue);
    if (effectRef.current) {
      effectRef.current.fade.rampTo(newValue, 0.1);
    }
  }, []);

  const handleFadeOutChange = useCallback((_, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setFadeOut(newValue);
    if (effectRef.current) {
      effectRef.current.fade.rampTo(newValue, 0.1);
    }
  }, []);

  return (
    <Paper
      elevation={selected ? 6 : 2}
      sx={{
        width: 180,
        backgroundColor: 'rgba(26, 32, 53, 0.95)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${selected ? nodeColor : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${alpha(nodeColor, 0.2)}`,
        },
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: nodeColor,
          width: 6,
          height: 6,
          border: 'none',
          boxShadow: `0 0 6px ${alpha(nodeColor, 0.5)}`,
        }}
      />
      
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
          }}
        >
          <Box
            sx={{
              color: nodeColor,
              display: 'flex',
              alignItems: 'center',
              p: 0.5,
              borderRadius: '6px',
              backgroundColor: alpha(nodeColor, 0.1),
            }}
          >
            <TuneIcon sx={{ fontSize: '1rem' }} />
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
            }}
          >
            {data.label}
          </Typography>
        </Box>

        <Box sx={{ px: 1 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Fade In
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VolumeDownIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', mr: 1 }} />
              <Slider
                size="small"
                value={fadeIn}
                onChange={handleFadeInChange}
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
              <VolumeUpIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', ml: 1 }} />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Fade Out
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VolumeDownIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', mr: 1 }} />
              <Slider
                size="small"
                value={fadeOut}
                onChange={handleFadeOutChange}
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
              <VolumeUpIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', ml: 1 }} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 6,
          height: 6,
          border: 'none',
          boxShadow: `0 0 6px ${alpha(nodeColor, 0.5)}`,
        }}
      />
    </Paper>
  );
};

export default EffectNode;
