import React, { useState } from 'react';
import { 
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CategoryIcon from '@mui/icons-material/Category';
import { useTheme } from '@mui/material/styles';
import BaseNode from './BaseNode';
import { useAudioStore } from '../../stores/audioStore';

interface NewsNodeProps {
  id: string;
  data: {
    label: string;
    category?: string;
  };
  selected: boolean;
}

const NEWS_CATEGORIES = [
  { value: 'breaking', label: 'Breaking News', color: '#f44336' },
  { value: 'business', label: 'Business', color: '#2196f3' },
  { value: 'technology', label: 'Technology', color: '#9c27b0' },
  { value: 'sports', label: 'Sports', color: '#4caf50' },
  { value: 'entertainment', label: 'Entertainment', color: '#ff9800' },
  { value: 'science', label: 'Science', color: '#00bcd4' },
];

const NewsNode: React.FC<NewsNodeProps> = ({ id, data, selected }) => {
  const theme = useTheme();
  const [category, setCategory] = useState(data.category || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playNode, stopNode } = useAudioStore();

  const handlePlayPause = () => {
    if (isPlaying) {
      stopNode(id);
    } else {
      playNode(id);
    }
    setIsPlaying(!isPlaying);
  };

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  const selectedCategory = NEWS_CATEGORIES.find(cat => cat.value === category);

  return (
    <BaseNode
      title={data.label}
      icon={<NewspaperIcon />}
      type="news"
      selected={selected}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth size="small">
          <Select
            value={category}
            onChange={handleCategoryChange}
            displayEmpty
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.9)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '& .MuiSelect-icon': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            <MenuItem value="">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                Select Category
              </Box>
            </MenuItem>
            {NEWS_CATEGORIES.map(cat => (
              <MenuItem key={cat.value} value={cat.value}>
                <Chip
                  label={cat.label}
                  size="small"
                  sx={{
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                    border: `1px solid ${cat.color}30`,
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handlePlayPause}
            size="small"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          {selectedCategory && (
            <Chip
              label={selectedCategory.label}
              size="small"
              sx={{
                backgroundColor: `${selectedCategory.color}15`,
                color: selectedCategory.color,
                border: `1px solid ${selectedCategory.color}30`,
              }}
            />
          )}
        </Box>
      </Box>
    </BaseNode>
  );
};

export default NewsNode;
