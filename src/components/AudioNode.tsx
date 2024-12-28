import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Paper, 
  Typography, 
  IconButton, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Tooltip,
  Box,
  LinearProgress,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { motion } from 'framer-motion';

interface AudioNodeData {
  label: string;
  type: string;
  color?: string;
  id: string;
  audioFile?: File;
  onAddTrack?: (type: string, nodeId: string, file: File) => void;
  onDelete?: () => void;
}

interface AudioNodeProps {
  data: AudioNodeData;
  isConnectable?: boolean;
}

const AudioNode: React.FC<AudioNodeProps> = ({ data, isConnectable }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(data.audioFile || null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Please select an audio file');
        return;
      }
      
      setAudioFile(file);
      if (audioRef.current) {
        const objectUrl = URL.createObjectURL(file);
        audioRef.current.src = objectUrl;
        return () => URL.revokeObjectURL(objectUrl);
      }
      
      data.onAddTrack?.(data.type, data.id, file);
    }
  };

  const handlePlay = async () => {
    if (!audioRef.current || !audioFile) {
      setError('No audio file selected');
      return;
    }

    try {
      setIsLoading(true);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error playing audio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Paper 
      elevation={3} 
      component={motion.div}
      whileHover={{ y: -4 }}
      sx={{ 
        p: 2.5,
        minWidth: 320,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          background: theme.palette.primary.main,
          width: 12,
          height: 12,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <MusicNoteIcon sx={{ color: theme.palette.primary.main }} />
        <Typography 
          variant="h6"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {data.label}
        </Typography>
      </Box>
      
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      {audioFile ? (
        <Card 
          variant="outlined" 
          sx={{ 
            mb: 2,
            background: alpha(theme.palette.background.paper, 0.5),
            backdropFilter: 'blur(4px)',
            borderRadius: '16px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <MusicNoteIcon sx={{ color: theme.palette.primary.main }} />
              <Typography 
                variant="body2" 
                noWrap 
                sx={{ 
                  flex: 1,
                  color: alpha(theme.palette.common.white, 0.9),
                }}
              >
                {audioFile.name}
              </Typography>
            </Box>
            
            <Box sx={{ width: '100%', mb: 1.5 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={isPlaying ? 'Stop' : 'Play'} arrow>
                  <IconButton
                    onClick={isPlaying ? handleStop : handlePlay}
                    disabled={isLoading}
                    sx={{
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : isPlaying ? (
                      <StopIcon />
                    ) : (
                      <PlayArrowIcon />
                    )}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Delete" arrow>
                  <IconButton
                    onClick={data.onDelete}
                    sx={{
                      color: theme.palette.error.main,
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: alpha(theme.palette.common.white, 0.7),
                    fontFamily: 'monospace',
                    fontWeight: 500,
                  }}
                >
                  {formatTime(currentTime)}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: alpha(theme.palette.common.white, 0.4),
                    fontFamily: 'monospace',
                    fontWeight: 500,
                  }}
                >
                  / {formatTime(duration)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box 
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          sx={{ 
            height: 120, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            border: '2px dashed',
            borderColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '16px',
            mb: 2,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUploadIcon 
            sx={{ 
              fontSize: 40,
              color: theme.palette.primary.main,
            }} 
          />
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.7),
              textAlign: 'center',
            }}
          >
            Click to upload audio
          </Typography>
        </Box>
      )}

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          background: theme.palette.secondary.main,
          width: 12,
          height: 12,
          border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
        }}
      />

      <audio ref={audioRef} />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: '12px',
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AudioNode;
