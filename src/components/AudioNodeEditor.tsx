import React, { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  Panel,
  useReactFlow,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  useKeyPress,
  useOnSelectionChange
} from 'reactflow';
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Paper, Typography, TextField, InputAdornment, IconButton, Button, Menu, MenuItem, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import 'reactflow/dist/style.css';
import useHistory from '../hooks/useHistory';
import MusicNode from './nodes/MusicNode';
import TTSNode from './nodes/TTSNode';
import WeatherNode from './nodes/WeatherNode';
import NewsNode from './nodes/NewsNode';
import EffectNode from './nodes/EffectNode';
import SequenceInput from './SequenceInput';
import NodeOptionsBar from './NodeOptionsBar';
import FlowHeader from './FlowHeader';

const AudioNodeEditorContent: React.FC<{ onSequencePlay?: (handleSequencePlay: (sequence: string) => void) => void }> = ({ onSequencePlay }) => {
  const {
    state: { nodes, edges },
    setState: setGraphState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory
  } = useHistory<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

  const [sequence, setSequence] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const theme = useTheme();
  const { getNode, fitView, onNodesChange: onNodesChangeBase, onEdgesChange: onEdgesChangeBase, onConnect: onConnectBase } = useReactFlow();

  // Memoize nodeTypes to prevent recreation
  const nodeTypes = useMemo(() => ({
    musicNode: MusicNode,
    ttsNode: TTSNode,
    weatherNode: WeatherNode,
    newsNode: NewsNode,
    effectNode: EffectNode
  }), []);

  // Track selected nodes
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodes(nodes);
    },
  });

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      // Undo/Redo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        if (event.shiftKey) {
          event.preventDefault();
          redo();
        } else {
          event.preventDefault();
          undo();
        }
        return;
      }

      // Delete nodes
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodes.length > 0) {
          event.preventDefault();
          onNodesDelete(selectedNodes);
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [nodes, edges, selectedNodes, undo, redo, setGraphState]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const nextNodes = applyNodeChanges(changes, nodes);
      // Only update if there are actual changes
      if (JSON.stringify(nextNodes) !== JSON.stringify(nodes)) {
        setGraphState({
          nodes: nextNodes,
          edges
        });
      }
    },
    [nodes, edges, setGraphState]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const nextEdges = applyEdgeChanges(changes, edges);
      // Only update if there are actual changes
      if (JSON.stringify(nextEdges) !== JSON.stringify(edges)) {
        setGraphState({
          nodes,
          edges: nextEdges
        });
      }
    },
    [nodes, edges, setGraphState]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setGraphState({
        nodes,
        edges: addEdge(connection, edges)
      });
    },
    [nodes, edges, setGraphState]
  );

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
      event.preventDefault();
      return;
    }

    const key = event.key.toLowerCase();
    const validKeys = ['a', 's', 'w', 'n', 't', 'm', 'i', 'o'];
    
    if (validKeys.includes(key)) {
      setSequence(prev => prev + key.toUpperCase());
    } else if (key === 'backspace' || key === 'delete') {
      setSequence(prev => prev.slice(0, -1));
    } else if (key === 'escape') {
      setSequence('');
    }
  }, [undo, redo]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    const validChars = value.split('').filter(char => 
      ['A', 'S', 'W', 'N', 'T', 'M', 'I', 'O'].includes(char)
    ).join('');
    setSequence(validChars);
  };

  const clearSequence = () => {
    setSequence('');
  };

  const handleDeleteNode = useCallback((nodeId: string) => {
    setGraphState((prevState) => {
      const newNodes = prevState.nodes.filter((node) => node.id !== nodeId);
      const newEdges = prevState.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      return {
        nodes: newNodes,
        edges: newEdges,
      };
    });
  }, []);

  const createNode = useCallback((type: string, position: { x: number; y: number }) => {
    const id = `${type}-${Date.now()}`;
    const newNode = {
      id,
      type,
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        onDelete: () => handleDeleteNode(id),
        onDuplicate: () => handleDuplicateNode(id)
      }
    };

    setGraphState((prevState) => ({
      nodes: [...prevState.nodes, newNode],
      edges: prevState.edges
    }));

    return newNode;
  }, [handleDeleteNode]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = getNode(nodeId);
    if (!nodeToDuplicate) return;

    const newNode = createNode(nodeToDuplicate.type, {
      x: nodeToDuplicate.position.x + 50,
      y: nodeToDuplicate.position.y + 50
    });
    newNode.data.label = `${nodeToDuplicate.data.label} (Copy)`;
  }, [getNode, createNode]);

  const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
    nodesToDelete.forEach((node) => {
      handleDeleteNode(node.id);
    });
  }, [handleDeleteNode]);

  const getNodeDescription = (type: string) => {
    switch (type) {
      case 'musicNode':
        return 'A node for playing music tracks. Supports various audio formats and playback controls.';
      case 'ttsNode':
        return 'Text-to-Speech node for converting text into spoken audio.';
      case 'weatherNode':
        return 'Weather information node that provides current weather updates.';
      case 'newsNode':
        return 'News feed node for broadcasting latest news updates.';
      default:
        return 'No description available';
    }
  };

  const handleAddNode = useCallback((type: string) => {
    createNode(type, { x: 100, y: window.innerHeight / 2 });
  }, [createNode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const generateGraph = useCallback((inputSequence: string) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let lastNodeId = '';

    // Calculate positions
    const xSpacing = 300;  // Fixed spacing between nodes
    const yBase = window.innerHeight / 2;
    const positions = inputSequence.split('').reduce((acc, _, index) => {
      acc[index + 1] = {
        x: 100 + (index * xSpacing),  // Start with offset and maintain fixed spacing
        y: yBase
      };
      return acc;
    }, { 0: { x: 100, y: yBase } });

    // Process sequence
    if (inputSequence) {
      inputSequence.split('').forEach((char, index) => {
        const nodeConfig = {
          I: { type: 'musicNode', label: 'Intro', color: theme.palette.primary.main },
          T: { type: 'ttsNode', label: 'TTS', color: theme.palette.secondary.main },
          W: { type: 'weatherNode', label: 'Weather', color: theme.palette.info.main },
          S: { type: 'musicNode', label: 'Song', color: theme.palette.success.main },
          N: { type: 'newsNode', label: 'News', color: theme.palette.warning.main },
          A: { type: 'musicNode', label: 'Announcement', color: theme.palette.error.main },
          M: { type: 'musicNode', label: 'Music', color: theme.palette.primary.main },
          O: { type: 'musicNode', label: 'Outro', color: theme.palette.info.main }
        }[char] || { type: 'musicNode', label: 'Unknown', color: theme.palette.grey[500] };

        const nodeId = `${nodeConfig.label.toLowerCase()}-${index}`;

        // Add node
        newNodes.push({
          id: nodeId,
          type: nodeConfig.type,
          position: positions[index + 1],
          data: { 
            label: nodeConfig.label,
            style: {
              background: alpha(nodeConfig.color, 0.1),
              border: `1px solid ${nodeConfig.color}`,
            },
            onDuplicate: () => handleDuplicateNode(nodeId),
            description: getNodeDescription(nodeConfig.type),
            status: 'inactive'
          }
        });

        // Add edge from previous node
        if (lastNodeId) {
          newEdges.push({
            id: `${lastNodeId}-${nodeId}`,
            source: lastNodeId,
            target: nodeId,
            type: 'smoothstep',
          });
        }

        lastNodeId = nodeId;
      });
    }

    setGraphState({
      nodes: newNodes,
      edges: newEdges
    });
    setTimeout(() => fitView(), 50);
  }, [theme.palette, fitView]);

  useEffect(() => {
    generateGraph(sequence);
    // Maintain consistent zoom level
    setTimeout(() => {
      fitView({ 
        padding: 0.5,
        duration: 800,
        minZoom: 1,
        maxZoom: 1
      });
    }, 50);
  }, [sequence, generateGraph, fitView]);

  const handleSequencePlay = useCallback((sequence: string) => {
    const nodeTypes = {
      'A': 'audio',
      'S': 'synth',
      'W': 'weather',
      'N': 'news',
      'T': 'text',
      'M': 'music',
      'I': 'image',
      'O': 'output'
    };

    let x = 100;
    let y = window.innerHeight / 3;
    const spacing = 200;

    // Create nodes based on sequence
    const sequenceNodes = sequence.split('').map((char, index) => {
      const type = nodeTypes[char as keyof typeof nodeTypes] || 'default';
      return createNode(type, { 
        x: x + (index * spacing), 
        y: y + (index % 2 === 0 ? 0 : 50) 
      });
    });

    // Create edges connecting the nodes in sequence
    const sequenceEdges = sequenceNodes.slice(0, -1).map((node, index) => ({
      id: `e${node.id}-${sequenceNodes[index + 1].id}`,
      source: node.id,
      target: sequenceNodes[index + 1].id,
      type: 'smoothstep',
      animated: true,
    }));

    setGraphState({
      nodes: sequenceNodes,
      edges: sequenceEdges,
    });
  }, [createNode, setGraphState]);

  useEffect(() => {
    if (onSequencePlay) {
      onSequencePlay(handleSequencePlay);
    }
  }, [onSequencePlay, handleSequencePlay]);

  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Top sequence input */}
      <SequenceInput
        value={sequence}
        onChange={handleInputChange}
        onClear={clearSequence}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Control', 'Meta']}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: {
            stroke: '#6F7EAE',
            strokeWidth: 2,
          },
          animated: true
        }}
        connectionMode="loose"
        fitView
        style={{
          backgroundColor: 'rgba(26, 32, 53, 0.95)',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(50, 60, 100, 0.1) 0%, rgba(26, 32, 53, 0) 100%)',
        }}
      >
        <Background
          gap={24}
          size={2}
          color="rgba(255, 255, 255, 0.05)"
        />
        <Controls 
          showZoom={false}
          style={{
            backgroundColor: 'rgba(26, 32, 53, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '8px',
          }}
        />
        
        {/* Top-right panel with undo/redo and add node buttons */}
        <Panel position="top-right">
          <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <IconButton
                  size="small"
                  onClick={undo}
                  disabled={!canUndo}
                  sx={{
                    backgroundColor: 'rgba(26, 32, 53, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'rgba(26, 32, 53, 0.9)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(26, 32, 53, 0.4)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title="Redo (Ctrl+Shift+Z)">
              <span>
                <IconButton
                  size="small"
                  onClick={redo}
                  disabled={!canRedo}
                  sx={{
                    backgroundColor: 'rgba(26, 32, 53, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'rgba(26, 32, 53, 0.9)',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(26, 32, 53, 0.4)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  <RedoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{
                backgroundColor: 'rgba(26, 32, 53, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': { 
                  backgroundColor: 'rgba(26, 32, 53, 0.9)',
                },
                textTransform: 'none',
                px: 2,
              }}
            >
              Add Node
            </Button>
          </Box>
        </Panel>

        {/* Add node menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(26, 32, 53, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              mt: 1,
            }
          }}
        >
          <MenuItem onClick={() => handleAddNode('musicNode')}>
            <MusicNoteIcon sx={{ mr: 1 }} /> Music Node
          </MenuItem>
          <MenuItem onClick={() => handleAddNode('ttsNode')}>
            <RecordVoiceOverIcon sx={{ mr: 1 }} /> TTS Node
          </MenuItem>
          <MenuItem onClick={() => handleAddNode('weatherNode')}>
            <WbSunnyIcon sx={{ mr: 1 }} /> Weather Node
          </MenuItem>
          <MenuItem onClick={() => handleAddNode('newsNode')}>
            <NewspaperIcon sx={{ mr: 1 }} /> News Node
          </MenuItem>
        </Menu>
      </ReactFlow>
    </Box>
  );
};

const AudioNodeEditor = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    handleSequencePlay: (sequence: string) => {
      const nodeTypes = {
        'A': 'audio',
        'S': 'synth',
        'W': 'weather',
        'N': 'news',
        'T': 'text',
        'M': 'music',
        'I': 'image',
        'O': 'output'
      };

      let x = 100;
      let y = window.innerHeight / 3;
      const spacing = 200;

      // Create nodes based on sequence
      const sequenceNodes = sequence.split('').map((char, index) => {
        const type = nodeTypes[char as keyof typeof nodeTypes] || 'default';
        return createNode(type, { 
          x: x + (index * spacing), 
          y: y + (index % 2 === 0 ? 0 : 50) 
        });
      });

      // Create edges connecting the nodes in sequence
      const sequenceEdges = sequenceNodes.slice(0, -1).map((node, index) => ({
        id: `e${node.id}-${sequenceNodes[index + 1].id}`,
        source: node.id,
        target: sequenceNodes[index + 1].id,
        type: 'smoothstep',
        animated: true,
      }));

      setGraphState({
        nodes: sequenceNodes,
        edges: sequenceEdges,
      });
    }
  }));

  return (
    <ReactFlowProvider>
      <AudioNodeEditorContent />
    </ReactFlowProvider>
  );
});

export default AudioNodeEditor;
