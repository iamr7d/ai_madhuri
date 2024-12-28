import React from 'react';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { NodeType } from '../types/flowTypes';

interface NodeOptionsBarProps {
}

const NodeOptionsBar: React.FC<NodeOptionsBarProps> = () => {
  const theme = useTheme();

  const nodeTypes = [
    { 
      type: 'music' as NodeType, 
      icon: MusicNoteIcon, 
      label: 'Music Node', 
      color: theme.palette.primary.main,
      description: 'Music playback node'
    },
    { 
      type: 'tts' as NodeType, 
      icon: TextFieldsIcon, 
      label: 'TTS Node', 
      color: theme.palette.secondary.main,
      description: 'Text-to-Speech node'
    },
    { 
      type: 'weather' as NodeType, 
      icon: WbSunnyIcon, 
      label: 'Weather Node', 
      color: theme.palette.info.main,
      description: 'Weather information node'
    },
    { 
      type: 'news' as NodeType, 
      icon: NewspaperIcon, 
      label: 'News Node', 
      color: theme.palette.error.main,
      description: 'News updates node'
    }
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '1rem',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 5,
      }}
    >
      {nodeTypes.map((nodeType) => {
        const Icon = nodeType.icon;
        return (
          <Paper
            elevation={4}
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(nodeType.color, 0.2)}`,
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'default',
              transition: 'all 0.2s',
            }}
          >
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon sx={{ 
                color: alpha(nodeType.color, 0.8),
              }} />
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {nodeType.label}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default NodeOptionsBar;
