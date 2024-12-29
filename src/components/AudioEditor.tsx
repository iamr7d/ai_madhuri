import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  Connection, 
  Edge, 
  Node,
  useNodesState,
  useEdgesState,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import AudioNode from './AudioNode';
import TTSNode from './TTSNode';
import WeatherNode from './WeatherNode';
import NewsNode from './NewsNode';
import InfoNode from './InfoNode';
import TrafficNode from './TrafficNode';
import OtherNode from './OtherNode';
import MusicNode from './MusicNode';
import NodeGenerator from './NodeGenerator';
import { Button, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteIcon from '@mui/icons-material/Delete';

interface CustomNode extends Node {
  type: 'audioSource' | 'tts' | 'weather' | 'info' | 'news' | 'traffic' | 'other' | 'music';
  data: {
    label: string;
    audioFile?: File;
    text?: string;
    color: string;
    onDelete: () => void;
  };
}

const nodeTypes: NodeTypes = {
  audioSource: AudioNode,
  tts: TTSNode,
  weather: WeatherNode,
  info: InfoNode,
  news: NewsNode,
  traffic: TrafficNode,
  other: OtherNode,
  music: MusicNode,
};

const nodeColors = {
  A: '#4f46e5', // Audio - Primary theme blue
  S: '#9333ea', // Speech - Purple
  W: '#06b6d4', // Weather - Cyan
  I: '#10b981', // Info - Emerald
  N: '#f59e0b', // News - Amber
  T: '#ef4444', // Traffic - Red
  O: '#8b5cf6', // Other - Violet
  M: '#ec4899'  // Music - Pink
};

const getNodeStyle = (type: string) => ({
  background: `linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)`,
  border: `1px solid rgba(255, 255, 255, 0.1)`,
  borderRadius: '16px',
  padding: '20px',
  color: '#fff',
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
  backdropFilter: 'blur(10px)',
  width: 360,
  height: 180,
  fontSize: '14px',
  fontWeight: 500,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.1) 38%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 48%)',
    backgroundSize: '200% 100%',
    animation: 'shine 3s linear infinite',
  },
  '& .react-flow__handle': {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    background: '#4F46E5',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#6366F1',
      transform: 'scale(1.2)',
    }
  },
  '& .node-header': {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 600,
    '& .icon': {
      color: '#4F46E5',
      fontSize: '24px',
    },
    '& .label': {
      opacity: 0.9,
    }
  },
  '& .node-subheader': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginTop: '4px',
    '& .icon': {
      fontSize: '16px',
      opacity: 0.7,
    }
  },
  '& .node-content': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  '& .node-controls': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: 'auto',
    '& .MuiIconButton-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(5px)',
      transition: 'all 0.2s ease',
      padding: '8px',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateY(-1px)',
      },
      '&.delete': {
        color: '#EF4444',
        '&:hover': {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
        }
      }
    }
  }
});

const globalStyles = `
  @keyframes shine {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const styleTag = document.createElement('style');
styleTag.textContent = globalStyles;
document.head.appendChild(styleTag);

const getEdgeStyle = (color: string) => ({
  stroke: color,
  strokeWidth: 2,
  opacity: 0.8,
  filter: `drop-shadow(0 0 8px ${color}66)`,
  animation: 'flowAnimation 30s linear infinite',
  strokeDasharray: '10 5',
});

const getNodeLabel = (char: string) => {
  const labels = {
    A: 'Audio',
    S: 'Speech',
    W: 'Weather',
    I: 'Info',
    N: 'News',
    T: 'Traffic',
    O: 'Other',
    M: 'Music'
  };
  return labels[char] || char;
};

const getNodeType = (char: string) => {
  const types = {
    A: 'audioSource',
    S: 'tts',
    W: 'weather',
    I: 'info',
    N: 'news',
    T: 'traffic',
    O: 'other',
    M: 'music'
  };
  return types[char] || 'default';
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const onConnect: OnConnect = useCallback(
    (params: Connection | Edge) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) {
        setError("Invalid connection: nodes not found");
        return;
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, nodes]
  );

  const addNode = (type: CustomNode['type']) => {
    const nodeChar = Object.entries(getNodeType).find(([_, t]) => t === type)?.[0] || 'A';
    const newNode: CustomNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: 250 },
      data: { 
        label: `${getNodeLabel(nodeChar)} Node`,
        onDelete: () => handleDeleteNode(newNode.id),
        color: nodeColors[nodeChar]
      },
      style: getNodeStyle(nodeChar)
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  const handlePlay = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      setIsPlaying(true);
      const sortedNodes = topologicalSort(nodes, edges);
      
      for (const node of sortedNodes) {
        switch (node.type) {
          case 'audioSource':
            await playAudioNode(node);
            break;
          case 'tts':
            await playTTSNode(node);
            break;
          case 'weather':
            await playWeatherNode(node);
            break;
          case 'info':
            await playInfoNode(node);
            break;
          case 'news':
            await playNewsNode(node);
            break;
          case 'traffic':
            await playTrafficNode(node);
            break;
          case 'other':
            await playOtherNode(node);
            break;
          case 'music':
            await playMusicNode(node);
            break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during playback");
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioContextRef.current) {
      audioContextRef.current.suspend();
    }
    setIsPlaying(false);
  };

  const handleSave = () => {
    const projectData = {
      nodes,
      edges,
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `radio-project-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target?.result as string);
          setNodes(projectData.nodes);
          setEdges(projectData.edges);
        } catch (error) {
          setError("Error loading project: invalid JSON");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
  };

  const createNode = (char: string, id: string, position: { x: number; y: number }) => {
    const baseNodeProps = {
      id,
      position,
      style: getNodeStyle(char),
      data: { 
        label: `${getNodeLabel(char)} Node`, 
        onDelete: () => handleDeleteNode(id),
        color: nodeColors[char]
      }
    };

    return {
      ...baseNodeProps,
      type: getNodeType(char)
    };
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    }}>
      <div style={{ 
        padding: '16px', 
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Node Type Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexGrow: 1 }}>
          {Object.entries(nodeColors).map(([type, color]) => (
            <Tooltip key={type} title={`Add ${getNodeLabel(type)} Node`}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: `${color}22`,
                  border: `1px solid ${color}44`,
                  color: color,
                  textTransform: 'none',
                  minWidth: 'auto',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: `${color}33`,
                  }
                }}
                startIcon={<AddIcon />}
                onClick={() => addNode(getNodeType(type))}
              >
                {getNodeLabel(type)}
              </Button>
            </Tooltip>
          ))}
        </div>

        {/* Control Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <Tooltip title={isPlaying ? "Stop" : "Play"}>
            <IconButton 
              size="small"
              style={{
                color: nodeColors.A,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              onClick={isPlaying ? handleStop : handlePlay}
            >
              {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Save Project">
            <IconButton 
              size="small"
              style={{
                color: nodeColors.S,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }} 
              onClick={handleSave}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Load Project">
            <IconButton 
              size="small"
              style={{
                color: nodeColors.W,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }} 
              component="label"
            >
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleLoad}
              />
              <FolderOpenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear All">
            <IconButton 
              size="small"
              style={{
                color: nodeColors.T,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              onClick={handleClear}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.2}
          maxZoom={4}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          style={{
            backgroundColor: 'transparent'
          }}
        >
          <Background
            color="rgba(255, 255, 255, 0.05)"
            gap={24}
            size={2}
            style={{ opacity: 0.4 }}
          />
          <Controls
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          />
          <MiniMap
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
            nodeColor={(node) => nodeColors[node.type.charAt(0).toUpperCase()] + '44'} 
          />
        </ReactFlow>
        <NodeGenerator onGenerate={async (sequence) => {
          // Calculate optimal layout
          const nodeCount = sequence.length;
          const maxNodesPerRow = 4; // Set to 4 nodes per row for horizontal flow
          const horizontalSpacing = 400; // Adjusted for better spacing
          const verticalSpacing = 250;
          
          // Create nodes array
          const newNodes = sequence.split('').map((char, index) => {
            // Calculate row and column position
            const row = Math.floor(index / maxNodesPerRow);
            const col = index % maxNodesPerRow;
            
            // Calculate actual x,y coordinates with better spacing
            const rowWidth = Math.min(nodeCount - (row * maxNodesPerRow), maxNodesPerRow) * horizontalSpacing;
            const startX = -(rowWidth / 2) + (horizontalSpacing / 2);
            const position = {
              x: startX + (col * horizontalSpacing),
              y: (row * verticalSpacing) - (Math.floor((nodeCount - 1) / maxNodesPerRow) * verticalSpacing / 2)
            };

            // Create node with type and position
            const id = `${char}-${index}`;
            const newNode = createNode(char, id, position);
            
            // Add handles for connections
            if (index > 0) {
              // Create edge from previous node to this node
              const sourceId = `${sequence[index - 1]}-${index - 1}`;
              const targetId = id;
              const edgeId = `e${sourceId}-${targetId}`;
              
              // Add edge with proper source and target handles
              setEdges((eds) => addEdge({
                id: edgeId,
                source: sourceId,
                target: targetId,
                sourceHandle: 'right',  // Connect from right handle
                targetHandle: 'left',   // Connect to left handle
                type: 'smoothstep',     // Use smooth step for better visual
                animated: true,         // Add animation
                style: getEdgeStyle(nodeColors[char])
              }, eds));
            }

            return newNode;
          });

          // Add nodes immediately
          setNodes(nds => [...nds, ...newNodes]);
        }} />
      </div>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

// Wrap the Flow component with ReactFlowProvider
export default function AudioEditor() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

// Helper function to perform topological sort of nodes
function topologicalSort(nodes: CustomNode[], edges: Edge[]): CustomNode[] {
  const graph = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();
  
  // Initialize graphs
  nodes.forEach(node => {
    graph.set(node.id, new Set());
    inDegree.set(node.id, 0);
  });
  
  // Build adjacency list and calculate in-degrees
  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;
    graph.get(source)?.add(target);
    inDegree.set(target, (inDegree.get(target) || 0) + 1);
  });
  
  // Find nodes with no dependencies
  const queue = nodes.filter(node => (inDegree.get(node.id) || 0) === 0);
  const result: CustomNode[] = [];
  
  // Process queue
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    
    // Update neighbors
    graph.get(node.id)?.forEach(neighborId => {
      inDegree.set(neighborId, (inDegree.get(neighborId) || 0) - 1);
      if (inDegree.get(neighborId) === 0) {
        queue.push(nodes.find(n => n.id === neighborId)!);
      }
    });
  }
  
  return result;
}

// Audio playback functions
async function playAudioNode(node: CustomNode) {
  if (!node.data.audioFile) {
    throw new Error('No audio file selected');
  }

  const audioContext = new AudioContext();
  const arrayBuffer = await node.data.audioFile.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
  
  return new Promise<void>((resolve) => {
    source.onended = () => {
      audioContext.close();
      resolve();
    };
  });
}

async function playTTSNode(node: CustomNode) {
  if (!node.data.text) {
    throw new Error('No text to speak');
  }

  const response = await fetch('http://localhost:8000/api/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: node.data.text,
      voice_id: 'shruthi',
      emotion: 'cheerful'
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate speech');
  }

  const data = await response.json();
  const audio = new Audio(`data:audio/wav;base64,${data.audio_data}`);
  audio.play();

  return new Promise<void>((resolve) => {
    audio.onended = () => resolve();
  });
}

async function playWeatherNode(node: CustomNode) {
  const response = await fetch('http://localhost:8000/api/weather');
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  const weatherText = `The current weather is ${data.weather.temperature}°C with ${data.weather.description}. 
                      Humidity is at ${data.weather.humidity}% and wind speed is ${data.weather.windSpeed} meters per second.`;

  const ttsResponse = await fetch('http://localhost:8000/api/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: weatherText,
      voice_id: 'shruthi',
      emotion: 'informative'
    }),
  });

  if (!ttsResponse.ok) {
    throw new Error('Failed to generate weather report speech');
  }

  const ttsData = await ttsResponse.json();
  const audio = new Audio(`data:audio/wav;base64,${ttsData.audio_data}`);
  audio.play();

  return new Promise<void>((resolve) => {
    audio.onended = () => resolve();
  });
}

async function playInfoNode(node: CustomNode) {
  // Add implementation for Info Node playback
}

async function playNewsNode(node: CustomNode) {
  const response = await fetch('http://localhost:8000/api/news');
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();
  const newsText = data.news.map((item: any) => item.title).join('. ');

  const ttsResponse = await fetch('http://localhost:8000/api/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: `Here are today's top stories. ${newsText}`,
      voice_id: 'shruthi',
      emotion: 'professional'
    }),
  });

  if (!ttsResponse.ok) {
    throw new Error('Failed to generate news report speech');
  }

  const ttsData = await ttsResponse.json();
  const audio = new Audio(`data:audio/wav;base64,${ttsData.audio_data}`);
  audio.play();

  return new Promise<void>((resolve) => {
    audio.onended = () => resolve();
  });
}

async function playTrafficNode(node: CustomNode) {
  // Add implementation for Traffic Node playback
}

async function playOtherNode(node: CustomNode) {
  // Add implementation for Other Node playback
}

async function playMusicNode(node: CustomNode) {
  // Add implementation for Music Node playback
}
