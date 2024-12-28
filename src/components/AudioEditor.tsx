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
import { Button, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteIcon from '@mui/icons-material/Delete';

interface CustomNode extends Node {
  type: 'audioSource' | 'tts' | 'weather' | 'news';
  data: {
    label: string;
    audioFile?: File;
    text?: string;
  };
}

const nodeTypes: NodeTypes = {
  audioSource: AudioNode,
  tts: TTSNode,
  weather: WeatherNode,
  news: NewsNode,
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

  const addNode = (type: 'audioSource' | 'tts' | 'weather' | 'news') => {
    const newNode: CustomNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: 250 },
      data: { 
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        onDelete: () => handleDeleteNode(newNode.id)
      }
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
          case 'news':
            await playNewsNode(node);
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

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <Tooltip title="Add Audio Source">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => addNode('audioSource')}
            style={{ marginRight: '8px' }}
          >
            Audio
          </Button>
        </Tooltip>
        <Tooltip title="Add TTS Node">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => addNode('tts')}
            style={{ marginRight: '8px' }}
          >
            TTS
          </Button>
        </Tooltip>
        <Tooltip title="Add Weather Node">
          <Button
            variant="contained"
            color="warning"
            startIcon={<AddIcon />}
            onClick={() => addNode('weather')}
            style={{ marginRight: '8px' }}
          >
            Weather
          </Button>
        </Tooltip>
        <Tooltip title="Add News Node">
          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            onClick={() => addNode('news')}
            style={{ marginRight: '8px' }}
          >
            News
          </Button>
        </Tooltip>
        <div style={{ display: 'inline-block', marginLeft: '20px' }}>
          <Tooltip title={isPlaying ? "Stop" : "Play"}>
            <IconButton 
              color="primary"
              onClick={isPlaying ? handleStop : handlePlay}
            >
              {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Save Project">
            <IconButton color="primary" onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Load Project">
            <IconButton color="primary" component="label">
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
            <IconButton color="error" onClick={handleClear}>
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
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
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
