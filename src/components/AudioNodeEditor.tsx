import React, { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  useReactFlow,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  useKeyPress,
  useOnSelectionChange,
  ReactFlowInstance
} from 'reactflow';
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Paper, Typography, TextField, InputAdornment, IconButton, Button, Menu, MenuItem, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import 'reactflow/dist/style.css';
import useHistory from '../hooks/useHistory';
import MusicNode from './nodes/MusicNode';
import TTSNode from './nodes/TTSNode';
import WeatherNode from './nodes/WeatherNode';
import NewsNode from './nodes/NewsNode';
import EffectNode from './nodes/EffectNode';
import NodeGenerator from './NodeGenerator';
import FlowHeader from './FlowHeader';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import InfoIcon from '@mui/icons-material/Info';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TrafficIcon from '@mui/icons-material/Traffic';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const AudioNodeEditorContent: React.FC<{ onSequencePlay?: (handleSequencePlay: (sequence: string) => void) => void }> = ({ onSequencePlay }) => {
  const [graphState, setGraphState] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: []
  });

  const {
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory
  } = useHistory<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

  const [sequence, setSequence] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const theme = useTheme();
  const { getNode, fitView, onNodesChange: onNodesChangeBase, onEdgesChange: onEdgesChangeBase, onConnect: onConnectBase } = useReactFlow();

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

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
  }, [graphState.nodes, graphState.edges, selectedNodes, undo, redo, setGraphState]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const nextNodes = applyNodeChanges(changes, graphState.nodes);
      // Only update if there are actual changes
      if (JSON.stringify(nextNodes) !== JSON.stringify(graphState.nodes)) {
        setGraphState({
          nodes: nextNodes,
          edges: graphState.edges
        });
      }
    },
    [graphState.nodes, graphState.edges, setGraphState]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const nextEdges = applyEdgeChanges(changes, graphState.edges);
      // Only update if there are actual changes
      if (JSON.stringify(nextEdges) !== JSON.stringify(graphState.edges)) {
        setGraphState({
          nodes: graphState.nodes,
          edges: nextEdges
        });
      }
    },
    [graphState.nodes, graphState.edges, setGraphState]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setGraphState({
        nodes: graphState.nodes,
        edges: addEdge(connection, graphState.edges)
      });
    },
    [graphState.nodes, graphState.edges, setGraphState]
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
    
    // Only fit view if we have a valid instance
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [theme.palette, reactFlowInstance]);

  const handleSequenceGenerate = useCallback((sequence: string) => {
    generateGraph(sequence);
  }, [generateGraph]);

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

  const handleGenerateNodes = useCallback((sequence: string) => {
    const letters = sequence.toUpperCase().split(/[,\s]+/).filter(Boolean);
    const newNodes: Node[] = letters.map((letter, index) => {
      let label = '';
      let color = '';
      
      switch (letter) {
        case 'A':
          label = 'Audio';
          color = '#4f46e5'; // Indigo
          break;
        case 'S':
          label = 'Speech';
          color = '#8b5cf6'; // Purple
          break;
        case 'W':
          label = 'Weather';
          color = '#06b6d4'; // Cyan
          break;
        case 'I':
          label = 'Info';
          color = '#3b82f6'; // Blue
          break;
        case 'N':
          label = 'News';
          color = '#ec4899'; // Pink
          break;
        case 'T':
          label = 'Traffic';
          color = '#f97316'; // Orange
          break;
        case 'O':
          label = 'Other';
          color = '#6366f1'; // Indigo
          break;
        case 'M':
          label = 'Music';
          color = '#10b981'; // Emerald
          break;
        default:
          label = 'Unknown';
          color = '#6b7280'; // Gray
      }

      return {
        id: `${letter}-${Date.now()}-${index}`,
        type: 'audioNode',
        position: { 
          x: 100 + (index * 180), 
          y: 100 + (Math.sin(index) * 50) 
        },
        data: { 
          label,
          color,
          icon: getNodeIcon(label)
        }
      };
    });

    setGraphState((nds) => ({ nodes: [...nds.nodes, ...newNodes], edges: nds.edges }));
    
    // Fit view after nodes are added
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 100);
  }, [fitView]);

  const getNodeIcon = (label: string) => {
    switch (label) {
      case 'Audio':
        return <GraphicEqIcon />;
      case 'Speech':
        return <RecordVoiceOverIcon />;
      case 'Weather':
        return <WbSunnyIcon />;
      case 'Info':
        return <InfoIcon />;
      case 'News':
        return <NewspaperIcon />;
      case 'Traffic':
        return <TrafficIcon />;
      case 'Other':
        return <MoreHorizIcon />;
      case 'Music':
        return <MusicNoteIcon />;
      default:
        return <HelpOutlineIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={graphState.nodes}
        edges={graphState.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={onInit}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        minZoom={0.2}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: 0.4 }}
      >
        <Controls 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        />
        <Background />
      </ReactFlow>
      <style>
        {`
          .react-flow__controls {
            background: rgba(14, 26, 45, 0.4) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 16px !important;
            padding: 8px !important;
            gap: 8px !important;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
          }

          .react-flow__controls button {
            width: 32px !important;
            height: 32px !important;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 10px !important;
            color: rgba(255, 255, 255, 0.8) !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .react-flow__controls button:hover {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 16px -4px rgba(99, 102, 241, 0.25) !important;
            color: white !important;
          }

          .react-flow__controls button:active {
            transform: translateY(0);
          }

          .react-flow__controls button svg {
            width: 14px !important;
            height: 14px !important;
            fill: currentColor !important;
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
          }

          .react-flow__controls button.react-flow__controls-interactive {
            pointer-events: all !important;
          }
        `}
      </style>
      <NodeGenerator onGenerate={handleSequenceGenerate} />
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
