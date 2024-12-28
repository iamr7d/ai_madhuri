import React from 'react';
import { Box, Typography, IconButton, Tooltip, useTheme, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RadioIcon from '@mui/icons-material/Radio';
import { useReactFlow } from 'reactflow';

interface FlowHeaderProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
}

const FlowHeader: React.FC<FlowHeaderProps> = ({
  isPlaying,
  onPlay,
  onStop,
  onSave,
  onLoad,
  onExport,
}) => {
  const theme = useTheme();
  const { fitView } = useReactFlow();

  const buttonStyle = {
    color: 'white',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '12px',
    padding: '10px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    margin: '0 4px',
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.85)}, ${alpha(theme.palette.background.paper, 0.95)})`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 4px 30px ${alpha(theme.palette.common.black, 0.15)}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              padding: '10px 20px',
              borderRadius: '16px',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
            }}
          >
            <RadioIcon 
              sx={{ 
                color: theme.palette.primary.main,
                fontSize: '28px',
              }} 
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              AI Radio Studio
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: '16px',
              padding: '6px',
              gap: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Tooltip title={isPlaying ? "Stop" : "Play"} arrow>
              <IconButton
                onClick={isPlaying ? onStop : onPlay}
                sx={{
                  ...buttonStyle,
                  backgroundColor: isPlaying 
                    ? alpha(theme.palette.error.main, 0.1)
                    : alpha(theme.palette.success.main, 0.1),
                  color: isPlaying 
                    ? theme.palette.error.main
                    : theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: isPlaying
                      ? alpha(theme.palette.error.main, 0.2)
                      : alpha(theme.palette.success.main, 0.2),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(
                      isPlaying ? theme.palette.error.main : theme.palette.success.main,
                      0.3
                    )}`,
                  },
                }}
              >
                {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Save Project" arrow>
              <IconButton 
                onClick={onSave} 
                sx={{
                  ...buttonStyle,
                  color: theme.palette.info.main,
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.info.main, 0.2),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
                  },
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Load Project" arrow>
              <IconButton 
                onClick={onLoad} 
                sx={{
                  ...buttonStyle,
                  color: theme.palette.warning.main,
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.warning.main, 0.2),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                  },
                }}
              >
                <FileUploadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export Audio" arrow>
              <IconButton 
                onClick={onExport} 
                sx={{
                  ...buttonStyle,
                  color: theme.palette.secondary.main,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  },
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        </Box>
      </Box>
    </Paper>
  );
};

export default FlowHeader;
