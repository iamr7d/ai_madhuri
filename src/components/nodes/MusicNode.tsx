import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import DeleteIcon from '@mui/icons-material/Delete';
import { NodeCard, NodeHeader, NodeContent, NodeControls } from './styles/SharedStyles';

interface MusicNodeProps {
  data: {
    label: string;
    onDelete: () => void;
  };
  isConnectable: boolean;
}

const MusicNode: React.FC<MusicNodeProps> = ({ data, isConnectable }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'rgba(0, 157, 255, 0.8)',
          width: 8,
          height: 8,
          border: 'none',
          boxShadow: '0 0 4px rgba(0, 157, 255, 0.8)'
        }}
        isConnectable={isConnectable}
      />
      
      <NodeCard>
        <NodeHeader>
          <Box className="title">
            <HeadphonesIcon sx={{ fontSize: 24, color: 'rgba(0, 157, 255, 0.8)' }} />
            <Typography variant="h6">Music Player</Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={data.onDelete}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              '&:hover': { 
                color: '#ff4444',
                background: 'rgba(255, 68, 68, 0.1)' 
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </NodeHeader>

        <NodeContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2,
            color: 'rgba(255, 255, 255, 0.7)' 
          }}>
            <VolumeUpIcon fontSize="small" />
            <Typography variant="body2">Now Playing</Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 2 
          }}>
            <IconButton
              onClick={() => setIsPlaying(!isPlaying)}
              sx={{
                color: 'rgba(0, 157, 255, 0.8)',
                background: 'rgba(0, 157, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(0, 157, 255, 0.2)'
                }
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <Slider
              value={volume}
              onChange={(_, newValue) => setVolume(newValue as number)}
              sx={{
                color: 'rgba(0, 157, 255, 0.8)',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(0, 157, 255, 0.1)'
                  }
                },
                '& .MuiSlider-track': {
                  boxShadow: '0 0 4px rgba(0, 157, 255, 0.4)'
                }
              }}
            />
          </Box>
        </NodeContent>
      </NodeCard>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'rgba(0, 157, 255, 0.8)',
          width: 8,
          height: 8,
          border: 'none',
          boxShadow: '0 0 4px rgba(0, 157, 255, 0.8)'
        }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default MusicNode;
