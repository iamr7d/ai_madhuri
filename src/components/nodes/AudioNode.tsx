import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { Box, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { styled } from '@mui/material/styles';
import BaseNode from './BaseNode';

const StyledSlider = styled(Slider)({
  color: '#4f46e5',
  height: 4,
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    boxShadow: '0 0 4px rgba(79, 70, 229, 0.5)',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(79, 70, 229, 0.16)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.2,
    backgroundColor: '#fff',
  },
  '& .MuiSlider-track': {
    background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.8), rgba(79, 70, 229, 1))',
    boxShadow: '0 0 4px rgba(79, 70, 229, 0.3)',
  },
});

const ControlButton = styled('button')({
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(79, 70, 229, 0.2)',
  borderRadius: '8px',
  padding: '4px 8px',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    background: 'rgba(79, 70, 229, 0.1)',
    borderColor: 'rgba(79, 70, 229, 0.3)',
    transform: 'translateY(-1px)',
    '& svg': {
      filter: 'drop-shadow(0 0 4px rgba(79, 70, 229, 0.5))',
    }
  },
  
  '& svg': {
    width: '18px',
    height: '18px',
    transition: 'filter 0.2s ease',
  }
});

const ParameterLabel = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '12px',
  marginBottom: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  
  '& span': {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '11px',
  }
});

const Controls = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginTop: '12px',
});

interface AudioNodeData {
  label: string;
  type: 'source' | 'effect' | 'output';
  parameters?: {
    [key: string]: {
      value: number;
      min: number;
      max: number;
      step: number;
      label: string;
    };
  };
}

const AudioNode = memo(({ data, isConnectable, id, selected }: NodeProps<AudioNodeData>) => {
  const handleParameterChange = (paramKey: string) => (_: Event, value: number | number[]) => {
    console.log(`Parameter ${paramKey} changed to:`, value);
  };

  return (
    <BaseNode
      id={id}
      type="audio"
      data={{
        icon: <VolumeUpIcon />,
        title: data.label,
        selected
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.parameters && Object.entries(data.parameters).map(([key, param]) => (
          <Box key={key}>
            <ParameterLabel>
              {param.label}
              <span>{param.value}</span>
            </ParameterLabel>
            <StyledSlider
              value={param.value}
              onChange={handleParameterChange(key)}
              min={param.min}
              max={param.max}
              step={param.step}
              size="small"
            />
          </Box>
        ))}
        
        <Controls>
          <ControlButton>
            <PlayArrowIcon />
            Play
          </ControlButton>
          <ControlButton>
            <StopIcon />
            Stop
          </ControlButton>
        </Controls>
      </Box>
    </BaseNode>
  );
});

export default AudioNode;
