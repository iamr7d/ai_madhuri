import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, IconButton, CircularProgress, Typography, InputBase, Paper } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SourceIcon from '@mui/icons-material/Source';
import SearchIcon from '@mui/icons-material/Search';
import { styled, keyframes } from '@mui/material/styles';
import { fetchNews, searchNews, NewsArticle } from '../../services/newsService';

interface NodeData {
  id: string;
  onNodeClick: () => void;
  isFirstNode: boolean;
  isLastNode: boolean;
}

const borderTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const MainContainer = styled(Box)(({ theme }) => ({
  minWidth: '450px',
  maxWidth: '450px',
  padding: '16px',
  backgroundColor: 'rgba(13, 17, 23, 0.15)',
  backdropFilter: 'blur(12px)',
  borderRadius: '12px',
  position: 'relative',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '12px',
    padding: '1px',
    background: 'linear-gradient(90deg, transparent, transparent, rgba(66, 220, 255, 0.8), transparent, transparent)',
    backgroundSize: '200% 100%',
    animation: `${borderTravel} 3s linear infinite`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none'
  },

  boxShadow: '0 0 2px rgba(66, 220, 255, 0.2), inset 0 0 2px rgba(66, 220, 255, 0.1)',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: 'rgba(13, 17, 23, 0.2)',
    
    '&::before': {
      background: 'linear-gradient(90deg, transparent, transparent, rgba(66, 220, 255, 1), transparent, transparent)',
      animation: `${borderTravel} 2s linear infinite`
    }
  }
}));

const NewsItemContainer = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
  padding: '16px',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: selected ? 'rgba(66, 220, 255, 0.1)' : 'rgba(13, 17, 23, 0.2)',
  backdropFilter: 'blur(8px)',
  border: '1px solid',
  borderColor: selected ? 'rgba(66, 220, 255, 0.4)' : 'rgba(66, 220, 255, 0.1)',
  transition: 'all 0.2s ease',
  display: 'flex',
  gap: '16px',
  position: 'relative',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '8px',
    padding: '1px',
    background: selected 
      ? 'linear-gradient(90deg, transparent, rgba(66, 220, 255, 0.8), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(66, 220, 255, 0.2), transparent)',
    backgroundSize: '200% 100%',
    animation: `${borderTravel} 3s linear infinite`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none'
  },

  '&:hover': {
    backgroundColor: 'rgba(66, 220, 255, 0.1)',
    transform: 'translateY(-1px)',
    '&::before': {
      background: 'linear-gradient(90deg, transparent, rgba(66, 220, 255, 0.8), transparent)',
    }
  }
}));

const NodeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px'
}));

const handleStyle = {
  background: '#42DCFF',
  width: '12px',
  height: '12px',
  border: '2px solid #1a1a1a'
};

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
  padding: '4px 8px',
  marginBottom: '16px',
  border: '1px solid rgba(66, 220, 255, 0.2)',
  color: '#fff',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(66, 220, 255, 0.2)',
  }
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  color: '#fff',
  '& input': {
    padding: '8px',
    fontSize: '0.875rem',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
      opacity: 1,
    }
  }
}));

const NewsNode: React.FC<{ data: NodeData }> = ({ data }) => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await fetchNews({
          limit: 5,
          categories: 'tech,science',
          language: 'en',
          locale: 'us'
        });
        setNewsData(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError('Failed to load news. Please try again later.');
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      const response = await searchNews(searchTerm);
      setNewsData(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to search news. Please try again later.');
      console.error('Error searching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <NodeContainer>
      {!data.isFirstNode && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: '#42DCFF',
            width: '12px',
            height: '12px',
            border: '2px solid #1a1a1a',
            left: '-6px'
          }}
        />
      )}
      
      <MainContainer onClick={data.onNodeClick}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NewspaperIcon sx={{ color: '#42DCFF' }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
              Tech News
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Paper
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 200,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '4px 8px',
                marginBottom: '16px',
                border: '1px solid rgba(66, 220, 255, 0.2)',
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, color: '#fff' }}
                placeholder="Search News..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <IconButton 
                onClick={handleSearch}
                sx={{ 
                  p: '10px',
                  color: '#42DCFF',
                  '&:hover': {
                    color: '#fff'
                  }
                }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            <IconButton
              onClick={() => window.location.reload()}
              sx={{
                color: '#42DCFF',
                '&:hover': {
                  color: '#fff'
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress sx={{ color: '#42DCFF' }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {newsData.map((article) => (
              <NewsItemContainer
                key={article.uuid}
                onClick={() => setSelectedArticle(article.uuid)}
                selected={selectedArticle === article.uuid}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: '#fff',
                      fontWeight: 500,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {article.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#42DCFF' }} />
                      <Typography variant="caption" sx={{ color: '#42DCFF' }}>
                        {new Date(article.published_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SourceIcon sx={{ fontSize: 16, color: '#42DCFF' }} />
                      <Typography variant="caption" sx={{ color: '#42DCFF' }}>
                        {article.source}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {article.image_url && (
                  <Box
                    component="img"
                    src={article.image_url}
                    alt={article.title}
                    sx={{
                      width: 120,
                      height: 80,
                      borderRadius: 1,
                      objectFit: 'cover'
                    }}
                  />
                )}
              </NewsItemContainer>
            ))}
          </Box>
        )}
      </MainContainer>

      {!data.isLastNode && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#42DCFF',
            width: '12px',
            height: '12px',
            border: '2px solid #1a1a1a',
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
      )}
    </NodeContainer>
  );
};

export default NewsNode;