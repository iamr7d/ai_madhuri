import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Paper, 
  Typography, 
  IconButton, 
  CircularProgress, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface TTSNodeData {
  label: string;
  type: string;
  id: string;
  onDelete?: () => void;
}

interface TTSNodeProps {
  data: TTSNodeData;
  isConnectable?: boolean;
}

const TTSNode: React.FC<TTSNodeProps> = ({ data, isConnectable }) => {
  const [text, setText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState('shruthi');
  const [emotion, setEmotion] = useState('cheerful');
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateScript = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'intro',
          prompt_override: text || undefined
        }),
      });

      if (!response.ok) throw new Error('Failed to generate script');
      
      const data = await response.json();
      setText(data.script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (!text.trim()) {
      setError('Please enter or generate text first');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: voice,
          emotion
        }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');
      
      const audioData = await response.json();
      if (audioRef.current) {
        audioRef.current.src = `data:audio/wav;base64,${audioData.audio_data}`;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play audio');
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

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        minWidth: 300,
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' ? '#1E1E1E' : '#ffffff'
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <Typography variant="h6" gutterBottom>
        {data.label}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or generate script..."
          variant="outlined"
          size="small"
          sx={{ mb: 1 }}
        />

        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Voice</InputLabel>
            <Select
              value={voice}
              label="Voice"
              onChange={(e) => setVoice(e.target.value)}
            >
              <MenuItem value="shruthi">Shruthi</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Emotion</InputLabel>
            <Select
              value={emotion}
              label="Emotion"
              onChange={(e) => setEmotion(e.target.value)}
            >
              <MenuItem value="cheerful">Cheerful</MenuItem>
              <MenuItem value="excited">Excited</MenuItem>
              <MenuItem value="relaxed">Relaxed</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isPlaying ? "Stop" : "Play"}>
            <IconButton 
              onClick={isPlaying ? handleStop : handlePlay}
              disabled={isLoading}
              color="primary"
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

          <Tooltip title="Generate Script">
            <IconButton 
              onClick={generateScript}
              disabled={isLoading}
              color="secondary"
            >
              <AutoAwesomeIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Delete Node">
          <IconButton 
            onClick={data.onDelete}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />

      <audio 
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TTSNode;
