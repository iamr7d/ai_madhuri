import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import BaseNode from './BaseNode';
import { useAudioStore } from '../../stores/audioStore';
import { NodeData } from '../../types/flowTypes';

interface WeatherNodeProps {
  id: string;
  data: NodeData;
  type: string;
}

const WeatherNode: React.FC<WeatherNodeProps> = ({ id, data, type }) => {
  const { isPlaying, playNode, stopNode } = useAudioStore();

  const handlePlayStop = () => {
    if (isPlaying) {
      stopNode(id);
    } else {
      playNode(id);
    }
  };

  return (
    <BaseNode
      id={id}
      type={type}
      data={{
        ...data,
        icon: <CloudIcon />,
        title: 'Weather Updates',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {data.label || 'Weather Updates'}
        </Typography>
        <IconButton
          size="small"
          onClick={handlePlayStop}
          sx={{ color: isPlaying ? 'error.main' : 'success.main' }}
        >
          {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
        </IconButton>
      </Box>
    </BaseNode>
  );
};

export default WeatherNode;
