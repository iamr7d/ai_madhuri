import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  addEdge,
  useReactFlow,
} from 'reactflow';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  Fade,
  useTheme,
  Tab,
  Tabs,
  SpeedDial,
  SpeedDialAction,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CloudIcon from '@mui/icons-material/Cloud';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TuneIcon from '@mui/icons-material/Tune';
import { useAudioStore } from '../../stores/audioStore';
import MusicNode from './MusicNode';
import TTSNode from './TTSNode';
import WeatherNode from './WeatherNode';
import NewsNode from './NewsNode';
import EffectNode from './EffectNode';
import NodeControls from '../NodeControls';
import FloatingActionMenu from '../FloatingActionMenu';
import 'reactflow/dist/style.css';

const nodeTypes: NodeTypes = {
  musicNode: MusicNode,
  ttsNode: TTSNode,
  weatherNode: WeatherNode,
  newsNode: NewsNode,
  effectNode: EffectNode,
};

interface SequenceData {
  nodes: Node[];
  edges: Edge[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AudioSequencer: React.FC = () => {
  const theme = useTheme();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [sequence, setSequence] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<SequenceData[]>([]);
  const [redoStack, setRedoStack] = useState<SequenceData[]>([]);
  const { connectNodes, disconnectNodes, playNode, stopNode } = useAudioStore();
  const { project } = useReactFlow();

  useEffect(() => {
    // Load saved sequence from localStorage
    const savedSequence = localStorage.getItem('audioSequence');
    if (savedSequence) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedSequence);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } catch (err) {
        console.error('Error loading saved sequence:', err);
      }
    }
  }, []);

  const saveToHistory = useCallback(() => {
    setUndoStack(prev => [...prev, { nodes, edges }]);
    setRedoStack([]);
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { nodes, edges }]);
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setUndoStack(prev => prev.slice(0, -1));
  }, [nodes, edges, undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setRedoStack(prev => prev.slice(0, -1));
  }, [nodes, edges, redoStack]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onConnect = useCallback((params: Connection) => {
    if (params.source && params.target) {
      connectNodes(params.source, params.target);
      setEdges((eds) => addEdge(params, eds));
      saveToHistory();
    }
  }, [connectNodes, setEdges, saveToHistory]);

  const onEdgeRemove = useCallback((edge: Edge) => {
    if (edge.source && edge.target) {
      disconnectNodes(edge.source, edge.target);
      saveToHistory();
    }
  }, [disconnectNodes, saveToHistory]);

  const handleSequenceInput = (input: string) => {
    setSequence(input);
    const parts = input.split('');
    
    // Save current state to undo stack
    saveToHistory();
    
    // Clear existing nodes
    setNodes([]);
    setEdges([]);
    
    let lastNode: Node | null = null;
    let x = 100;
    const y = 250;
    
    parts.forEach((part, index) => {
      let type: string;
      switch (part.toUpperCase()) {
        case 'W':
          type = 'weather';
          break;
        case 'N':
          type = 'news';
          break;
        case 'M':
          type = 'music';
          break;
        case 'T':
          type = 'tts';
          break;
        case 'E':
          type = 'effect';
          break;
        case 'I':
        case 'O':
          type = 'music';
          break;
        case 'S':
          type = 'music';
          break;
        case 'A':
          type = 'tts';
          break;
        default:
          return;
      }
      
      const newNode: Node = {
        id: `${type}-${Date.now()}-${index}`,
        type: `${type}Node`,
        position: { x: x, y },
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${
            part === 'I' ? '(Intro)' :
            part === 'O' ? '(Outro)' :
            part === 'S' ? '(Song)' :
            part === 'A' ? '(Announcement)' :
            ''
          }` 
        },
      };
      
      setNodes((nds) => [...nds, newNode]);
      
      if (lastNode) {
        const edge: Edge = {
          id: `e${lastNode.id}-${newNode.id}`,
          source: lastNode.id,
          target: newNode.id,
          type: 'default',
        };
        setEdges((eds) => [...eds, edge]);
        connectNodes(lastNode.id, newNode.id);
      }
      
      lastNode = newNode;
      x += 250;
    });
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: `${type}Node`,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)}` },
      };

      setNodes((nds) => [...nds, newNode]);
      saveToHistory();
    },
    [project]
  );

  const handleAddNode = useCallback((type: string) => {
    const position = {
      x: Math.random() * 500,
      y: Math.random() * 500,
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: `${type}Node`,
      position,
      data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)}` },
    };

    setNodes((nds) => [...nds, newNode]);
    saveToHistory();
  }, [saveToHistory]);

  const handleSaveSequence = () => {
    try {
      localStorage.setItem('audioSequence', JSON.stringify({ nodes, edges }));
      setError(null);
    } catch (err) {
      setError('Failed to save sequence');
    }
  };

  const handleLoadSequence = () => {
    try {
      const savedSequence = localStorage.getItem('audioSequence');
      if (savedSequence) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedSequence);
        saveToHistory();
        setNodes(savedNodes);
        setEdges(savedEdges);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load sequence');
    }
  };

  const handleClearSequence = () => {
    saveToHistory();
    setNodes([]);
    setEdges([]);
    setSequence('');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        sx={{ 
          p: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            value={sequence}
            onChange={(e) => handleSequenceInput(e.target.value)}
            placeholder="Enter sequence (e.g., ASMSNW)"
            size="small"
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          
          <Tooltip title="Save Sequence">
            <IconButton onClick={handleSaveSequence} size="small" sx={{ color: 'white' }}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Load Sequence">
            <IconButton onClick={handleLoadSequence} size="small" sx={{ color: 'white' }}>
              <FolderOpenIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Clear Sequence">
            <IconButton onClick={handleClearSequence} size="small" sx={{ color: 'white' }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1, display: 'block' }}>
          Use: I (Intro), O (Outro), T (TTS), W (Weather), S (Song Intro), SO (Song Outro), N (News), A (Announcement), S (Song), M (Music)
        </Typography>
      </Paper>

      <Box ref={reactFlowWrapper} sx={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeRemove={onEdgeRemove}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'musicNode':
                  return theme.palette.primary.main;
                case 'ttsNode':
                  return theme.palette.secondary.main;
                case 'weatherNode':
                  return theme.palette.warning.main;
                case 'newsNode':
                  return theme.palette.error.main;
                case 'effectNode':
                  return theme.palette.info.main;
                default:
                  return '#eee';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
          />
          <NodeControls
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
          />
          <FloatingActionMenu onAddNode={handleAddNode} />
        </ReactFlow>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AudioSequencer;
