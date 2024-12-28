import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { IconButton, Paper, Typography, TextField, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateTTSAudio } from '../utils/textGeneration';

const NewsNode = ({ data, isConnectable }: any) => {
  const [newsText, setNewsText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async () => {
    if (!newsText) return;

    try {
      setIsLoading(true);
      const formattedNews = `And now for the latest news: ${newsText}`;
      const audioBuffer = await generateTTSAudio(formattedNews);
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return (
    <Paper 
      elevation={3} 
      style={{ 
        background: '#1a1a1a',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '10px',
        width: '300px'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      
      <div style={{ marginBottom: '10px' }}>
        <Typography variant="subtitle1" style={{ color: '#ef4444', marginBottom: '5px' }}>
          News Update
        </Typography>
        
        <TextField
          multiline
          rows={4}
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          placeholder="Enter news content..."
          variant="outlined"
          size="small"
          fullWidth
          style={{ 
            backgroundColor: '#2d2d2d',
            borderRadius: '4px'
          }}
          InputProps={{
            style: { color: '#fff' }
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton
          onClick={isPlaying ? handleStop : handlePlay}
          disabled={!newsText || isLoading}
          color={isPlaying ? "error" : "primary"}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isPlaying ? (
            <StopIcon />
          ) : (
            <PlayArrowIcon />
          )}
        </IconButton>

        <IconButton
          onClick={() => data.onDelete && data.onDelete()}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </div>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </Paper>
  );
};

export default NewsNode;
