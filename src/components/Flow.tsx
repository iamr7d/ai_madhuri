import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import NeonEdge from './edges/NeonEdge';
import AudioNode from './nodes/AudioNode';
import NewsNode from './nodes/NewsNode';
import WeatherNode from './nodes/WeatherNode';
import SpeechNode from './nodes/SpeechNode';
import InfoNode from './nodes/InfoNode';
import TrafficNode from './nodes/TrafficNode';
import OtherNode from './nodes/OtherNode';
import MusicNode from './nodes/MusicNode';

const nodeTypes = {
  audio: AudioNode,
  news: NewsNode,
  weather: WeatherNode,
  speech: SpeechNode,
  info: InfoNode,
  traffic: TrafficNode,
  other: OtherNode,
  music: MusicNode,
};

const edgeTypes = {
  neon: NeonEdge,
};

const defaultEdgeOptions = {
  type: 'neon',
  animated: true,
};

interface FlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onConnect?: (params: Connection) => void;
}

const Flow: React.FC<FlowProps> = ({ nodes: initialNodes, edges: initialEdges, onNodesChange, onEdgesChange, onConnect }) => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const handleNodesChange = useCallback((changes: any) => {
    setNodes(changes);
    onNodesChange?.(changes);
  }, [onNodesChange, setNodes]);

  const handleEdgesChange = useCallback((changes: any) => {
    setEdges(changes);
    onEdgesChange?.(changes);
  }, [onEdgesChange, setEdges]);

  const handleConnect = useCallback((params: Connection) => {
    const newEdge = { ...params, type: 'neon' };
    setEdges((eds) => addEdge(newEdge, eds));
    onConnect?.(params);
  }, [onConnect, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={handleConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      fitView
    >
      <Background color="rgba(0, 157, 255, 0.1)" />
      <Controls />
    </ReactFlow>
  );
};

export default Flow;
