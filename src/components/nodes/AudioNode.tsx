import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Slider, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

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

const AudioNode = memo(({ data, isConnectable }: NodeProps<AudioNodeData>) => {
  const handleParameterChange = (paramKey: string) => (_: Event, value: number | number[]) => {
    // Handle parameter changes here
    console.log(`Parameter ${paramKey} changed to:`, value);
  };

  return (
    <Paper
      sx={{
        p: 2,
        minWidth: 200,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {data.label}
      </Typography>

      {/* Input handles */}
      {data.type !== 'source' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#4A9FFF' }}
          isConnectable={isConnectable}
        />
      )}

      {/* Parameters */}
      <Box sx={{ my: 2 }}>
        {data.parameters && Object.entries(data.parameters).map(([key, param]) => (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography variant="caption" display="block" gutterBottom>
              {param.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Slider
                size="small"
                value={param.value}
                min={param.min}
                max={param.max}
                step={param.step}
                onChange={handleParameterChange(key)}
                sx={{ 
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                  }
                }}
              />
              <Typography variant="caption" sx={{ ml: 1, minWidth: 35 }}>
                {param.value.toFixed(1)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <IconButton size="small">
          <PlayArrowIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <StopIcon fontSize="small" />
        </IconButton>
        {data.type === 'output' && (
          <IconButton size="small">
            <VolumeUpIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Output handles */}
      {data.type !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#50C878' }}
          isConnectable={isConnectable}
        />
      )}
    </Paper>
  );
});

export default AudioNode;
