import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface NodeGeneratorProps {
  onGenerate: (sequence: string) => void;
}

const NodeGenerator: React.FC<NodeGeneratorProps> = ({ onGenerate }) => {
  const [input, setInput] = useState('');
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input.trim().toUpperCase());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '95%',
        maxWidth: '800px',
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: 'rgba(14, 26, 45, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(14, 26, 45, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 1,
            color: alpha(theme.palette.text.primary, 0.7),
            fontStyle: 'italic'
          }}
        >
          Enter sequence (A for Audio, S for Speech, W for Weather, I for Info, N for News, T for Traffic, O for Other, M for Music)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^ASWINTOM\s,]/gi, ''))}
            onKeyPress={handleKeyPress}
            placeholder="Enter node sequence (A,S,W,I,N,T,O,M)"
            size="small"
            InputProps={{
              sx: {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              },
              '& .MuiFormLabel-root': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiFormLabel-root.Mui-focused': {
                color: alpha(theme.palette.primary.main, 0.8),
              },
            }}
          />
          <Button 
            onClick={handleSubmit}
            disabled={!input.trim()}
            startIcon={<AutoFixHighIcon sx={{ 
              filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))',
              fontSize: '20px'
            }} />}
            sx={{
              minWidth: '130px',
              height: '42px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
              borderRadius: '14px',
              color: 'white',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(168, 85, 247, 1) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 4px 12px -2px rgba(99, 102, 241, 0.2)',
              },
              '&.Mui-disabled': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                color: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'none',
              },
            }}
          >
            Generate
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NodeGenerator;
