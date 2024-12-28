import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';

export interface BaseNodeProps {
  id: string;
  type: string;
  data: {
    label: string;
    title?: string;
    icon?: React.ReactNode;
    selected?: boolean;
  };
  children: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ children, data = {}, id }) => {
  const { icon, title, selected } = data;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        minWidth: 200,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: (theme) =>
          `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
      }}
    >
      <Handle type="target" position={Position.Top} id={`${id}-target`} />
      <Box>
        {icon && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {icon}
            {title && (
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {title}
              </Typography>
            )}
          </Box>
        )}
        {children}
      </Box>
      <Handle type="source" position={Position.Bottom} id={`${id}-source`} />
    </Paper>
  );
};

export default BaseNode;
