import React from 'react';
import { Handle, Position } from 'reactflow';
import { IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import DeleteIcon from '@mui/icons-material/Delete';

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
        style={{ background: '#fff' }}
        isConnectable={isConnectable}
      />
      
      <div style={{ padding: '15px', color: '#fff' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '18px',
          marginBottom: '8px'
        }}>
          <VolumeUpIcon style={{ fontSize: '24px' }} />
          <span>Music Player</span>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '16px',
          opacity: 0.8,
          marginBottom: '15px'
        }}>
          <HeadphonesIcon style={{ fontSize: '20px' }} />
          <span>Song</span>
        </div>

        <div style={{
          width: '100%',
          height: '40px',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '8px',
          marginBottom: '15px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
            transform: 'translateX(-70%)'
          }} />
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '12px'
        }}>
          <IconButton
            size="small"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              color: '#fff',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <PlayArrowIcon />
          </IconButton>

          <Slider
            size="small"
            value={volume}
            onChange={(_, value) => setVolume(value as number)}
            min={0}
            max={1}
            step={0.1}
            sx={{
              width: 100,
              color: '#fff',
              '& .MuiSlider-rail': {
                opacity: 0.3,
              },
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                background: '#fff',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.1)',
                },
              },
            }}
          />

          <div style={{ flex: 1 }} />

          <IconButton
            size="small"
            onClick={data.onDelete}
            style={{
              color: '#fff',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#fff' }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default MusicNode;
