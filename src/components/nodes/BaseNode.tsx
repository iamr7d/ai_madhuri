import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Handle, Position } from 'reactflow';

export interface BaseNodeData {
  label?: string;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

interface BaseNodeProps {
  id: string;
  data: BaseNodeData;
  selected?: boolean;
  children?: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, data, selected, children }) => {
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (data?.onDelete) {
      data.onDelete();
    }
  };

  const handleDuplicate = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (data?.onDuplicate) {
      data.onDuplicate();
    }
  };

  return (
    <Box
      sx={{
        background: 'rgba(37, 41, 57, 0.95)',
        borderRadius: 2,
        padding: 2,
        minWidth: 200,
        border: selected ? '2px solid #6F7EAE' : '2px solid transparent',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        '&:hover': {
          '& .node-controls': {
            opacity: 1,
          },
        },
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: '#6F7EAE',
          width: 8,
          height: 8,
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }} 
      />
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          {data?.label || 'Node'}
        </Typography>
      </Box>

      {children}

      <Box
        className="node-controls"
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
          backgroundColor: 'rgba(37, 41, 57, 0.95)',
          padding: '4px',
          borderRadius: '4px',
          zIndex: 10,
        }}
      >
        <IconButton
          size="small"
          onClick={handleDuplicate}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            padding: '4px',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ContentCopyIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
        
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            padding: '4px',
            '&:hover': {
              color: 'error.main',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Box>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: '#6F7EAE',
          width: 8,
          height: 8,
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }} 
      />
    </Box>
  );
};

export default BaseNode;
