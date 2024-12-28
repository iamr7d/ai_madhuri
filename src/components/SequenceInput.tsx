import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Tooltip, Paper } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { alpha, useTheme } from '@mui/material/styles';

interface SequenceInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const SequenceInput: React.FC<SequenceInputProps> = ({ value, onChange, onClear }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '500px',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.15),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }}
      >
        <TextField
          fullWidth
          value={value}
          onChange={onChange}
          placeholder="Type sequence here (A,S,W,N,T,M,I,O)"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '56px',
              color: theme.palette.text.primary,
              fontSize: '1.1rem',
              letterSpacing: '1px',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              pl: 2,
              '&::placeholder': {
                color: alpha(theme.palette.text.primary, 0.5),
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MusicNoteIcon 
                  sx={{ 
                    color: theme.palette.primary.main,
                    ml: 1,
                    opacity: 0.8 
                  }} 
                />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <Tooltip title="Clear sequence">
                  <IconButton
                    onClick={onClear}
                    edge="end"
                    sx={{
                      mr: 1,
                      color: alpha(theme.palette.text.primary, 0.5),
                      '&:hover': {
                        color: theme.palette.text.primary,
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      {value && (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            mt: 1,
            px: 2,
          }}
        >
          {value.split('').map((char, index) => (
            <Paper
              key={index}
              sx={{
                px: 2,
                py: 0.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <MusicNoteIcon sx={{ fontSize: '0.9rem', opacity: 0.7 }} />
              {char}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SequenceInput;
