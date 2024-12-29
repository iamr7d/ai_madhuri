import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box } from '@mui/material';
import { NodeCard, NodeHeader, NodeContent } from './styles/SharedStyles';

interface BaseNodeProps {
  id: string;
  type: string;
  data: {
    icon: React.ReactNode;
    title: string;
    selected?: boolean;
  };
  children: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, type, data, children }) => {
  return (
    <NodeCard>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'rgba(0, 157, 255, 0.5)',
          width: 8,
          height: 8,
          border: 'none'
        }}
      />
      
      <NodeHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {data.icon}
          <span>{data.title}</span>
        </Box>
      </NodeHeader>

      <NodeContent>
        {children}
      </NodeContent>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'rgba(0, 157, 255, 0.5)',
          width: 8,
          height: 8,
          border: 'none'
        }}
      />
    </NodeCard>
  );
};

export default BaseNode;
