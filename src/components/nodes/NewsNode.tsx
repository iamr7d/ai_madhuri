import React, { useState } from 'react';
import { IconButton, Select, MenuItem, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import BaseNode from './BaseNode';
import { NodeContent, NodeControls } from './styles/SharedStyles';
import { styled } from '@mui/material/styles';

const StyledSelect = styled(Select)({
  background: 'rgba(255, 255, 255, 0.03)',
  color: 'white',
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 157, 255, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 157, 255, 0.4)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 157, 255, 0.6)',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(0, 157, 255, 0.8)',
  }
});

const NewsItem = styled(Box)({
  padding: '8px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.03)',
  marginBottom: '8px',
  
  '&:hover': {
    background: 'rgba(0, 157, 255, 0.05)',
  }
});

interface NewsNodeProps {
  id: string;
  data: {
    label: string;
    onDelete?: () => void;
  };
  selected?: boolean;
}

const NewsNode: React.FC<NewsNodeProps> = ({ id, data, selected }) => {
  const [category, setCategory] = useState('general');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <BaseNode
      id={id}
      type="news"
      data={{
        icon: <NewspaperIcon />,
        title: data.label,
        selected
      }}
    >
      <NodeContent>
        <StyledSelect
          value={category}
          onChange={handleCategoryChange}
          size="small"
          fullWidth
        >
          <MenuItem value="general">General</MenuItem>
          <MenuItem value="technology">Technology</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="sports">Sports</MenuItem>
          <MenuItem value="entertainment">Entertainment</MenuItem>
        </StyledSelect>

        <Box sx={{ mt: 2 }}>
          <NewsItem>
            <Typography variant="body2" sx={{ color: 'rgba(0, 157, 255, 0.8)', mb: 0.5 }}>
              Breaking News
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Latest headlines from around the world...
            </Typography>
          </NewsItem>
          
          <NewsItem>
            <Typography variant="body2" sx={{ color: 'rgba(0, 157, 255, 0.8)', mb: 0.5 }}>
              Top Story
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Featured news of the day...
            </Typography>
          </NewsItem>
        </Box>
      </NodeContent>

      <NodeControls>
        <IconButton onClick={togglePlay} size="small">
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        {data.onDelete && (
          <IconButton onClick={data.onDelete} size="small">
            <DeleteIcon />
          </IconButton>
        )}
      </NodeControls>
    </BaseNode>
  );
};

export default NewsNode;