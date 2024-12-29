import React, { useState, useCallback, useRef } from 'react';
import { Box, TextField, IconButton, Tooltip, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AudioNodeEditor from './AudioNodeEditor';
import PlayerBar from './PlayerBar';
import LoadingAnimation from './LoadingAnimation';
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

      <Box sx={{ flex: 1, position: 'relative' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Secret Key
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiKeys.map((item, index) => (
              <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="font-mono">{item.userId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="font-mono">{item.secretKey}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {item.tokens.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Box sx={{ flex: 1, position: 'relative' }}>
        <AudioNodeEditor ref={audioNodeEditorRef} />
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
