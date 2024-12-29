import React, { useState, useCallback, useRef } from 'react';
import { Box, TextField, IconButton, Tooltip, Button, Tabs, Tab, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AudioNodeEditor from './AudioNodeEditor';
import PlayerBar from './PlayerBar';
import LoadingAnimation from './LoadingAnimation';
import ApiKeyManager from './dashboard/ApiKeyManager';
import UserManagement from './dashboard/UserManagement';
import Settings from './dashboard/Settings';
import { AudioNodeEditorRef } from '../types/audio';

// Move API keys to environment variables or a secure configuration
const API_KEY = import.meta.env.VITE_API_KEY || '';
const API_BACKUP_KEY = import.meta.env.VITE_API_KEY_BACKUP || '';

const Dashboard: React.FC = () => {
  const [sequence, setSequence] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300);
  const [volume, setVolume] = useState(1);
  const [currentTrack, setCurrentTrack] = useState<string | undefined>('Current Sequence');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const audioNodeEditorRef = useRef<AudioNodeEditorRef>(null);

  const handleSequenceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    if (/^[ASWNTMIO]*$/.test(value)) {
      setSequence(value);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generatedSequence = 'ASMWNTO';
      setSequence(generatedSequence);
    } catch (err) {
      console.error('Error generating sequence:', err);
      setError('Failed to generate sequence');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    try {
      setIsPlaying(prev => !prev);
      if (audioNodeEditorRef.current?.handleSequencePlay) {
        audioNodeEditorRef.current.handleSequencePlay(sequence);
      }
    } catch (err) {
      console.error('Error toggling playback:', err);
      setError('Failed to toggle playback');
    }
  }, [sequence]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    try {
      setVolume(newVolume / 100);
    } catch (err) {
      console.error('Error changing volume:', err);
      setError('Failed to change volume');
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    try {
      setCurrentTime(time);
    } catch (err) {
      console.error('Error seeking:', err);
      setError('Failed to seek');
    }
  }, []);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#1a1b26',
      position: 'relative'
    }}>
      {isGenerating && <LoadingAnimation />}
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        p: 2,
        backgroundColor: 'rgba(15, 19, 32, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flex: 1,
          gap: 1,
          backgroundColor: 'rgba(37, 41, 57, 0.95)',
          borderRadius: 2,
          padding: '4px 12px'
        }}>
          <span role="img" aria-label="music">🎵</span>
          <TextField
            value={sequence}
            onChange={handleSequenceChange}
            placeholder="Type sequence here (A,S,W,N,T,M,I,O)"
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                color: 'rgba(255, 255, 255, 0.9)',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              },
            }}
          />
        </Box>

        <Button
          onClick={handleGenerate}
          startIcon={<SmartToyIcon />}
          variant="contained"
          sx={{
            backgroundColor: '#6F7EAE',
            '&:hover': {
              backgroundColor: '#8B9CCF',
            },
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
          }}
        >
          Generate
        </Button>

        <Tooltip title="Play Sequence">
          <IconButton 
            onClick={handlePlayPause}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reset">
          <IconButton 
            onClick={() => setSequence('')}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Node">
          <IconButton 
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            px: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#90CAF9'
              }
            }
          }}
        >
          <Tab label="Editor" />
          <Tab label="Settings" />
          <Tab label="API Keys" />
          <Tab label="Users" />
          <Tab label="About" />
        </Tabs>

        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          position: 'relative'
        }}>
          {activeTab === 0 && (
            <AudioNodeEditor ref={audioNodeEditorRef} />
          )}
          {activeTab === 1 && (
            <Settings />
          )}
          {activeTab === 2 && (
            <ApiKeyManager />
          )}
          {activeTab === 3 && (
            <UserManagement />
          )}
          {activeTab === 4 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 500, mb: 4 }}>
                About
              </Typography>
              {/* Add about content */}
            </Box>
          )}
        </Box>
      </Box>

      <PlayerBar
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onPlayPause={handlePlayPause}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
        currentTrack={currentTrack}
      />

      {isGenerating && <LoadingAnimation message="Generating Sequence..." />}
    </Box>
  );
};

export default Dashboard;
