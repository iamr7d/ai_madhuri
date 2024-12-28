import React, { useState, useCallback, useRef } from 'react';
import { Box, TextField, IconButton, Tooltip, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AudioNodeEditor from './AudioNodeEditor';
import PlayerBar from './PlayerBar';
import LoadingAnimation from './LoadingAnimation';

const apiKeys = [
  {
    key: 'KEY 01',
    userId: 'XtCowrtbeUd45CR6CCzTbOOn40x1',
    secretKey: '88c8697e425d4420b4d7e65cba2b51ba',
    tokens: 12500
  },
  {
    key: 'KEY 02',
    userId: 'VWiXMjsdbYeIg80L6gHLbyLtSPb2',
    secretKey: '27e5f12a5d2544fc85af3c5623b4f6ce',
    tokens: 25000
  },
  {
    key: 'KEY 03',
    userId: 'V37qjOCMj9RmPDz0aQUc4EYU2UB3',
    secretKey: '022ea262c46c4f22bb47fa7428254ca4',
    tokens: 37500
  },
  {
    key: 'KEY 04',
    userId: 'BPZbTxkPj5b7Uk9gT0IOHZlCYwf1',
    secretKey: '9867b73c29784edb95289202f5136cec',
    tokens: 50000
  },
  {
    key: 'KEY 05',
    userId: 'MNC7VP0IIees3PxC70NddpazsEt1',
    secretKey: '9e0d034f3058481986ccc09344e45d61',
    tokens: 62500
  },
  {
    key: 'KEY 06',
    userId: 'p8PyssvCgpO3LzhpV2VUPAEu6Xq2',
    secretKey: '6068eedb25be4eabbc6743df7057aa90',
    tokens: 75000
  },
  {
    key: 'KEY 07',
    userId: '6KE6ICewBjeaJl5WnQHS0pIxemz2',
    secretKey: 'bb7db00a0bcd4b6d9649cad90975c29e',
    tokens: 87500
  }
];

const Dashboard: React.FC = () => {
  const [sequence, setSequence] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300);
  const [volume, setVolume] = useState(1);
  const [currentTrack, setCurrentTrack] = useState<string | undefined>('Current Sequence');
  const [isGenerating, setIsGenerating] = useState(false);
  const audioNodeEditorRef = useRef<any>(null);

  const handleSequenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    if (/^[ASWNTMIO]*$/.test(value)) {
      setSequence(value);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const generatedSequence = 'ASMWNTO';
    setSequence(generatedSequence);
    setIsGenerating(false);
  };

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (audioNodeEditorRef.current?.handleSequencePlay) {
      audioNodeEditorRef.current.handleSequencePlay(sequence);
    }
  }, [sequence]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume / 100);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
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
    </Box>
  );
};

export default Dashboard;
