import React from 'react';
import { Box, IconButton, Tooltip, Typography, useTheme, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TuneIcon from '@mui/icons-material/Tune';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { NodeType } from '../types/flowTypes';

interface NodeOptionsBarProps {
  onAddNode: (type: NodeType) => void;
}

const NodeOptionsBar: React.FC<NodeOptionsBarProps> = ({ onAddNode }) => {
  const theme = useTheme();

  const nodeTypes = [
    { 
      type: 'audio' as NodeType, 
      icon: MusicNoteIcon, 
      label: 'Audio', 
      color: theme.palette.primary.main,
      description: 'Add an audio node for music playback'
    },
    { 
      type: 'tts' as NodeType, 
      icon: TextFieldsIcon, 
      label: 'TTS', 
      color: theme.palette.secondary.main,
      description: 'Add a Text-to-Speech node'
    },
    { 
      type: 'effect' as NodeType, 
      icon: TuneIcon, 
      label: 'Effect', 
      color: theme.palette.info.main,
      description: 'Add audio effects and filters'
    },
    { 
      type: 'recording' as NodeType, 
      icon: MicIcon, 
      label: 'Record', 
      color: theme.palette.error.main,
      description: 'Add a recording node for voice input'
    },
    { 
      type: 'sequencer' as NodeType, 
      icon: QueueMusicIcon, 
      label: 'Sequence', 
      color: theme.palette.success.main,
      description: 'Add a sequencer for timing control'
    },
    { 
      type: 'output' as NodeType, 
      icon: PlayArrowIcon, 
      label: 'Output', 
      color: theme.palette.warning.main,
      description: 'Add an output node for final audio'
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        left: '50%',
        bottom: 32,
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.85)}, ${alpha(theme.palette.background.paper, 0.95)})`,
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '12px 24px',
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translate(-50%, -2px)',
          boxShadow: `0 12px 48px ${alpha(theme.palette.common.black, 0.3)}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          padding: '4px',
        }}
      >
        {nodeTypes.map(({ type, icon: Icon, label, color, description }) => (
          <Tooltip
            key={type}
            title={
              <Box sx={{ p: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {label}
                </Typography>
                <Typography variant="caption">
                  {description}
                </Typography>
              </Box>
            }
            placement="top"
            arrow
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <IconButton
                onClick={() => onAddNode(type)}
                sx={{
                  color: color,
                  backgroundColor: alpha(color, 0.1),
                  borderRadius: '16px',
                  padding: '12px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: alpha(color, 0.2),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                <Icon />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.palette.common.white, 0.9),
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                {label}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default NodeOptionsBar;
