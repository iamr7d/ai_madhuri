import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, IconButton, TextField, Chip, Menu, MenuItem } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';

const borderTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NewsContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(2px)',
  borderRadius: '16px',
  padding: '24px',
  color: 'white',
  position: 'relative',
  width: '100%',
  maxWidth: '480px',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
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
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    background: 'rgba(255, 255, 255, 0.03)',
    
    '&::before': {
      background: 'linear-gradient(90deg, transparent, transparent, rgba(0, 157, 255, 1), transparent, transparent)',
      animation: `${borderTravel} 2s linear infinite`
    }
  }
}));

const SearchBar = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  padding: '8px 16px',
  
  '& .MuiTextField-root': {
    flex: 1,
    '& .MuiInputBase-root': {
      color: 'white',
      '&::before, &::after': {
        display: 'none',
      },
      '& input': {
        padding: '8px 0',
        fontSize: '1rem',
        '&::placeholder': {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
  },
});

const NewsItem = styled(Box)({
  display: 'flex',
  gap: '16px',
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.03)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  animation: `${fadeIn} 0.3s ease-out`,
  
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateX(4px)',
  },
});

const NewsImage = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '8px',
  overflow: 'hidden',
  flexShrink: 0,
  
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const NewsContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const NewsTitle = styled(Typography)({
  fontSize: '1rem',
  fontWeight: '500',
  color: '#fff',
  lineHeight: 1.4,
});

const NewsInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '0.85rem',
  
  '& .source': {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
});

const SourceChip = styled(Chip)({
  background: 'rgba(0, 157, 255, 0.1)',
  color: '#2196f3',
  borderRadius: '6px',
  height: '24px',
  fontSize: '0.75rem',
  
  '&:hover': {
    background: 'rgba(0, 157, 255, 0.2)',
  },
});

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  imageUrl: string;
  url: string;
  timestamp: string;
  verified: boolean;
}

const TRUSTED_SOURCES = [
  { name: 'MIT Technology Review', domain: 'technologyreview.com' },
  { name: 'Google AI Blog', domain: 'ai.googleblog.com' },
  { name: 'OpenAI Blog', domain: 'openai.com' },
  { name: 'DeepMind Blog', domain: 'deepmind.com' },
  { name: 'arXiv', domain: 'arxiv.org' },
  { name: 'Nature AI', domain: 'nature.com' },
  { name: 'IEEE Spectrum', domain: 'spectrum.ieee.org' },
  { name: 'AI Magazine', domain: 'aaai.org' },
];

const AINewsNode = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated news data - replace with actual API call
  const fetchNews = async () => {
    setIsLoading(true);
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockNews: NewsArticle[] = [
      {
        id: '1',
        title: 'The Future of AI: Breakthroughs in Large Language Models',
        description: 'Recent advances in transformer architectures have led to significant improvements in natural language processing...',
        source: 'MIT Technology Review',
        imageUrl: '/ai-news-1.jpg',
        url: 'https://technologyreview.com/article1',
        timestamp: '2 hours ago',
        verified: true,
      },
      {
        id: '2',
        title: 'DeepMind's Latest Research on AI Safety',
        description: 'New methodologies for ensuring AI systems remain aligned with human values...',
        source: 'DeepMind Blog',
        imageUrl: '/ai-news-2.jpg',
        url: 'https://deepmind.com/blog/article2',
        timestamp: '4 hours ago',
        verified: true,
      },
      {
        id: '3',
        title: 'Advances in Computer Vision: New Architecture Achieves SOTA Results',
        description: 'A novel neural network architecture has achieved state-of-the-art results on multiple computer vision benchmarks...',
        source: 'arXiv',
        imageUrl: '/ai-news-3.jpg',
        url: 'https://arxiv.org/abs/2312.12345',
        timestamp: '6 hours ago',
        verified: true,
      },
    ];
    
    setNews(mockNews);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSourceClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSourceClose = () => {
    setAnchorEl(null);
  };

  const handleSourceSelect = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSources.length === 0 || selectedSources.includes(article.source);
    return matchesSearch && matchesSource;
  });

  const handleStyle = {
    width: 6,
    height: 6,
    background: 'rgba(0, 157, 255, 0.8)',
    border: '1px solid rgba(0, 157, 255, 0.3)',
    boxShadow: '0 0 4px rgba(0, 157, 255, 0.4)',
  };

  return (
    <>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      
      <NewsContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            AI Tech News
            <IconButton
              size="small"
              onClick={() => fetchNews()}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <RefreshIcon />
            </IconButton>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedSources.map(source => (
              <SourceChip
                key={source}
                label={source}
                onDelete={() => handleSourceSelect(source)}
                size="small"
              />
            ))}
          </Box>
        </Box>

        <SearchBar>
          <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
          <TextField
            placeholder="Search AI news..."
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton
            size="small"
            onClick={handleSourceClick}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <FilterListIcon />
          </IconButton>
        </SearchBar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSourceClose}
          PaperProps={{
            sx: {
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              color: 'white',
              '& .MuiMenuItem-root': {
                fontSize: '0.9rem',
                gap: '8px',
              },
            },
          }}
        >
          {TRUSTED_SOURCES.map(source => (
            <MenuItem
              key={source.name}
              onClick={() => handleSourceSelect(source.name)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
              }}
            >
              {source.name}
              {selectedSources.includes(source.name) && (
                <VerifiedIcon sx={{ color: '#2196f3', fontSize: '1.1rem' }} />
              )}
            </MenuItem>
          ))}
        </Menu>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredNews.map(article => (
            <NewsItem key={article.id} onClick={() => window.open(article.url, '_blank')}>
              <NewsImage>
                <img src={article.imageUrl} alt={article.title} />
              </NewsImage>
              
              <NewsContent>
                <NewsTitle>{article.title}</NewsTitle>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                  {article.description}
                </Typography>
                
                <NewsInfo>
                  <span className="source">
                    {article.verified && <VerifiedIcon sx={{ fontSize: '1rem', color: '#2196f3' }} />}
                    {article.source}
                  </span>
                  <span>•</span>
                  <span>{article.timestamp}</span>
                  <OpenInNewIcon sx={{ fontSize: '0.9rem', ml: 'auto' }} />
                </NewsInfo>
              </NewsContent>
            </NewsItem>
          ))}
        </Box>
      </NewsContainer>
    </>
  );
};

export default AINewsNode;
