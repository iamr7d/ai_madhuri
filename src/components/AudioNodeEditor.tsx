import React, { useState, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import ReactFlow, { 
  Background,
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
import MapControls from './MapControls';
import { styled } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

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
    audioNode: MusicNode,
    ttsNode: TTSNode,
    weatherNode: WeatherNode,
    newsNode: NewsNode,
    effectNode: EffectNode,
    trafficNode: MusicNode,
    otherNode: MusicNode,
    infoNode: MusicNode
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

    const key = event.key;
    const validKeys = ['A', 'S', 'W', 'N', 'T', 'M', 'I', 'O'];
    
    if (validKeys.includes(key)) {
      setSequence(prev => prev + key);
    } else if (key === 'Backspace' || key === 'Delete') {
      setSequence(prev => prev.slice(0, -1));
    } else if (key === 'Escape') {
      setSequence('');
    }
  }, [undo, redo]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
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
      case 'audioNode':
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

  const handleSequenceGenerate = useCallback((inputSequence: string) => {
    if (!inputSequence) return;
    
    // Clear all existing nodes and edges first
    setGraphState({ nodes: [], edges: [] });

    // Wait a brief moment to ensure old nodes are cleared
    setTimeout(() => {
      // Constants for layout
      const defaultWidth = 250;  
      const horizontalSpacing = 200; 
      const startX = 100;
      const baseY = 300; 

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const sequence = inputSequence.trim().split('');
      const totalWidth = sequence.length * (defaultWidth + horizontalSpacing);
      const startingX = Math.max(50, (window.innerWidth - totalWidth) / 2); 

      sequence.forEach((char, index) => {
        const nodeConfig = {
          A: { type: 'audioNode', label: 'Audio', color: theme.palette.primary.main },
          S: { type: 'ttsNode', label: 'Speech', color: theme.palette.secondary.main },
          W: { type: 'weatherNode', label: 'Weather', color: theme.palette.info.main },
          N: { type: 'newsNode', label: 'News', color: theme.palette.warning.main },
          T: { type: 'trafficNode', label: 'Traffic', color: theme.palette.error.main },
          M: { type: 'musicNode', label: 'Music', color: theme.palette.success.main },
          O: { type: 'otherNode', label: 'Other', color: theme.palette.grey[500] },
          I: { type: 'infoNode', label: 'Info', color: theme.palette.info.light }
        }[char] || { type: 'otherNode', label: 'Unknown', color: theme.palette.grey[500] };

        const nodeId = `${nodeConfig.type}-${Date.now()}-${index}`;
        
        // Create node with calculated position
        const newNode = {
          id: nodeId,
          type: nodeConfig.type,
          position: {
            x: startingX + (index * (defaultWidth + horizontalSpacing)),
            y: baseY
          },
          data: {
            label: nodeConfig.label,
            style: {
              background: alpha(nodeConfig.color, 0.1),
              border: `1px solid ${nodeConfig.color}`,
              width: defaultWidth,
              minHeight: '100px',
            },
            onDelete: () => handleDeleteNode(nodeId),
            onDuplicate: () => handleDuplicateNode(nodeId)
          }
        };

        newNodes.push(newNode);

        // Create edge to previous node if it exists
        if (index > 0) {
          newEdges.push({
            id: `e${newNodes[index - 1].id}-${nodeId}`,
            source: newNodes[index - 1].id,
            target: nodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: theme.palette.primary.main }
          });
        }
      });

      // Set new nodes and edges
      setGraphState({
        nodes: newNodes,
        edges: newEdges
      });

      // Fit view after nodes are added with proper padding
      setTimeout(() => {
        fitView({ 
          padding: 0.2,
          duration: 800,
          includeHiddenNodes: true,
          minZoom: 0.5,
          maxZoom: 1.5
        });
      }, 100);
    }, 50);
  }, [theme.palette, handleDeleteNode, handleDuplicateNode, fitView]);

  // Clear nodes when component unmounts
  useEffect(() => {
    return () => {
      setGraphState({ nodes: [], edges: [] });
    };
  }, []);

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
          color = '#4f46e5'; 
          break;
        case 'S':
          label = 'Speech';
          color = '#8b5cf6'; 
          break;
        case 'W':
          label = 'Weather';
          color = '#06b6d4'; 
          break;
        case 'I':
          label = 'Info';
          color = '#3b82f6'; 
          break;
        case 'N':
          label = 'News';
          color = '#ec4899'; 
          break;
        case 'T':
          label = 'Traffic';
          color = '#f97316'; 
          break;
        case 'O':
          label = 'Other';
          color = '#6366f1'; 
          break;
        case 'M':
          label = 'Music';
          color = '#10b981'; 
          break;
        default:
          label = 'Unknown';
          color = '#6b7280'; 
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

  const getSmartPosition = useCallback((nodes: Node[]) => {
    const CARD_WIDTH = 560; // Width of our cards
    const CARD_HEIGHT = 200; // Height of our cards
    const VERTICAL_SPACING = 20; // Space between cards
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate center X position
    const centerX = (viewportWidth - CARD_WIDTH) / 2;

    // Calculate Y position based on existing nodes
    const getNextYPosition = (existingNodes: Node[]) => {
      if (existingNodes.length === 0) {
        return 100; // Initial Y position from top
      }

      // Find the lowest Y position among existing nodes
      const maxY = Math.max(...existingNodes.map(node => node.position.y));
      return maxY + CARD_HEIGHT + VERTICAL_SPACING;
    };

    const newY = getNextYPosition(nodes);

    // Check if we need to reset positions (if cards go too far down)
    if (newY > viewportHeight - CARD_HEIGHT) {
      // Reset all nodes to start from top
      setTimeout(() => {
        const resetNodes = [...nodes].map((node, index) => ({
          ...node,
          position: {
            x: centerX,
            y: 100 + (index * (CARD_HEIGHT + VERTICAL_SPACING))
          }
        }));
        setGraphState(prev => ({
          ...prev,
          nodes: resetNodes
        }));
      }, 0);

      return { x: centerX, y: 100 };
    }

    return { x: centerX, y: newY };
  }, []);

  // Smart arrangement function
  const smartArrange = useCallback(() => {
    const CARD_WIDTH = 400; // Decreased from 560px to match NewsNode width
    const HORIZONTAL_SPACING = 150; // Adjusted spacing for smaller cards
    const VERTICAL_OFFSET = 100; // Distance from top
    const EDGE_MARGIN = 50; // Minimum margin from viewport edges
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    
    // Sort nodes by type and then by id for consistent ordering
    const sortedNodes = [...graphState.nodes].sort((a, b) => {
      if (a.type !== b.type) {
        return (a.type || '').localeCompare(b.type || '');
      }
      return (a.id || '').localeCompare(b.id || '');
    });

    // Calculate total width needed
    const totalWidth = sortedNodes.length * CARD_WIDTH + 
                      (sortedNodes.length - 1) * HORIZONTAL_SPACING;
    
    // Calculate starting X position to center the entire row
    const startX = Math.max(EDGE_MARGIN, (viewportWidth - totalWidth) / 2);

    // Position nodes in a row with proper spacing
    const newNodes = sortedNodes.map((node, index) => ({
      ...node,
      position: {
        x: startX + (index * (CARD_WIDTH + HORIZONTAL_SPACING)),
        y: VERTICAL_OFFSET
      },
      data: {
        ...node.data,
        isFirstNode: index === 0,
        isLastNode: index === sortedNodes.length - 1
      }
    }));

    // Update positions
    setGraphState(prev => ({
      ...prev,
      nodes: newNodes
    }));

    // Center view on the arranged nodes
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({
          padding: 0.2,
          includeHidden: false,
          duration: 800
        });
      }
    }, 100);
  }, [graphState.nodes, reactFlowInstance]);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      bgcolor: 'transparent'
    }}>
      <ReactFlow
        nodes={graphState.nodes}
        edges={graphState.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{
          background: 'transparent'
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.5}
        maxZoom={1.5}
        snapToGrid={true}
        snapGrid={[20, 20]}
        connectionMode="loose"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#42DCFF',
            strokeWidth: 2,
          }
        }}
      >
        <Background />
        <MapControls onSmartArrange={smartArrange} />
      </ReactFlow>
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
