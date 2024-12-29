import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Paper, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const borderTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const GenerateButton = styled('button')({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(4px)',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  color: 'white',
  fontSize: '14px',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '8px',
    padding: '1px',
    background: 'linear-gradient(90deg, transparent, transparent, rgba(0, 157, 255, 0.8), transparent, transparent)',
    backgroundSize: '200% 100%',
    animation: `${borderTravel} 3s linear infinite`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none'
  },

  boxShadow: '0 0 2px rgba(0, 157, 255, 0.2), inset 0 0 2px rgba(0, 157, 255, 0.1)',
  
  '&:hover': {
    transform: 'translateY(-1px)',
    background: 'rgba(255, 255, 255, 0.05)',
    
    '&::before': {
      background: 'linear-gradient(90deg, transparent, transparent, rgba(0, 157, 255, 1), transparent, transparent)',
      animation: `${borderTravel} 2s linear infinite`
    }
  }
});

const GeneratorWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '32px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: '800px',
  padding: '16px',
  background: 'rgba(14, 26, 45, 0.4)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
}));

interface NodeGeneratorProps {
  onGenerate: (sequence: string) => void;
}

const NodeGenerator: React.FC<NodeGeneratorProps> = ({ onGenerate }) => {
  const [sequence, setSequence] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = document.querySelector('.react-flow__viewport');
    if (!container) return;

    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = container.scrollTop;
          setIsVisible(currentScrollY <= lastScrollY);
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sequence.trim()) {
      onGenerate(sequence.trim().toUpperCase());
      // Clear the sequence after successful generation
      setTimeout(() => {
        setSequence('');
      }, 500); // Small delay to ensure user sees their input
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow valid characters
    const value = e.target.value.toUpperCase();
    setSequence(value.replace(/[^ASWINTOM\s,]/gi, ''));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSequence('');
    }
  };

  return (
    <GeneratorWrapper>
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        Enter sequence (A for Audio, S for Speech, W for Weather, I for Info, N for News, T for Traffic, O for Other, M for Music)
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={sequence}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter node sequence (A,S,W,I,N,T,O,M)"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              background: 'rgba(255, 255, 255, 0.03)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 157, 255, 0.4)'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(0, 157, 255, 0.6)'
              }
            },
            '& .MuiOutlinedInput-input': {
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1
              }
            }
          }}
        />
        <GenerateButton type="submit">
          <AutoFixHighIcon />
          Generate
        </GenerateButton>
      </Box>
    </GeneratorWrapper>
  );
};

export default NodeGenerator;
