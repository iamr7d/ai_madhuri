import React, { useCallback, useState, useEffect } from 'react';
import { useReactFlow, Panel, useStore } from 'reactflow';
import { Box, IconButton, Tooltip, Fade, Badge, Paper } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  FitScreen as FitViewIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from '@mui/icons-material';

interface NodeControlsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const NodeControls: React.FC<NodeControlsProps> = ({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const { zoomIn, zoomOut, fitView, setCenter, getNodes } = useReactFlow();
  const [showControls, setShowControls] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoom = useStore((state) => state.transform[2]);
  const theme = useTheme();

  useEffect(() => {
    setZoomLevel(zoom);
  }, [zoom]);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 300 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 300 });
  }, [zoomOut]);

  const handleCenter = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length > 0) {
      const centerX = nodes.reduce((sum, node) => sum + node.position.x, 0) / nodes.length;
      const centerY = nodes.reduce((sum, node) => sum + node.position.y, 0) / nodes.length;
      setCenter(centerX, centerY, { zoom: 1, duration: 800 });
    }
  }, [setCenter, getNodes]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 800, padding: 0.1 });
  }, [fitView]);

  const buttonStyles = {
    color: alpha(theme.palette.common.white, 0.9),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '12px',
    padding: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&.Mui-disabled': {
      backgroundColor: alpha(theme.palette.common.white, 0.05),
      color: alpha(theme.palette.common.white, 0.3),
    },
  };

  return (
    <Panel position="top-right" style={{ margin: '16px' }}>
      <Fade in={showControls}>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.85)}, ${alpha(theme.palette.background.paper, 0.95)})`,
            backdropFilter: 'blur(12px)',
            padding: 2,
            borderRadius: '20px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.25)}`,
            },
          }}
        >
          {onUndo && (
            <Tooltip title="Undo" placement="left" arrow>
              <span>
                <IconButton
                  onClick={onUndo}
                  disabled={!canUndo}
                  sx={buttonStyles}
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {onRedo && (
            <Tooltip title="Redo" placement="left" arrow>
              <span>
                <IconButton
                  onClick={onRedo}
                  disabled={!canRedo}
                  sx={buttonStyles}
                >
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}

          <Tooltip title="Zoom In" placement="left" arrow>
            <IconButton
              onClick={handleZoomIn}
              sx={buttonStyles}
            >
              <Badge
                badgeContent={Math.round(zoomLevel * 100) + '%'}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: '40px',
                    height: '20px',
                    padding: '0 6px',
                    borderRadius: '10px',
                    backgroundColor: alpha(theme.palette.primary.main, 0.9),
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                <ZoomInIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Zoom Out" placement="left" arrow>
            <IconButton
              onClick={handleZoomOut}
              sx={buttonStyles}
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Center View" placement="left" arrow>
            <IconButton
              onClick={handleCenter}
              sx={buttonStyles}
            >
              <CenterIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Fit View" placement="left" arrow>
            <IconButton
              onClick={handleFitView}
              sx={buttonStyles}
            >
              <FitViewIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Fade>
    </Panel>
  );
};

export default NodeControls;
