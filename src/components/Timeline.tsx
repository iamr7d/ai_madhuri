import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, IconButton, Slider, Typography, Paper, Tooltip, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useReactFlow } from 'reactflow';
import { useAudioStore } from '../stores/audioStore';

interface Track {
  id: string;
  type: string;
  name: string;
  duration: number;
  startTime: number;
  color: string;
}

interface TimelineProps {
  height?: number;
  timeInterval?: number;
  primaryLabelInterval?: number;
  secondaryLabelInterval?: number;
  formatTimeCallback?: (seconds: number) => string;
  secondaryLabelOpacity?: number;
}

const defaultFormatTimeCallback = (seconds: number) => {
  if (seconds / 60 > 1) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    const paddedSeconds = `${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    return `${minutes}:${paddedSeconds}`;
  }
  return `${Math.round(seconds * 1000) / 1000}`;
};

const Timeline: React.FC<TimelineProps> = ({
  height = 120,
  timeInterval = 1,
  primaryLabelInterval = 10,
  secondaryLabelInterval = 5,
  formatTimeCallback = defaultFormatTimeCallback,
  secondaryLabelOpacity = 0.25,
}) => {
  const theme = useTheme();
  const { getNodes, getEdges } = useReactFlow();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number>();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { playSequence, stopSequence, setVolume: setAudioVolume } = useAudioStore();

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'musicNode': return theme.palette.primary.main;
      case 'ttsNode': return theme.palette.secondary.main;
      case 'weatherNode': return theme.palette.warning.main;
      case 'newsNode': return theme.palette.error.main;
      case 'effectNode': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  const createTimeline = useCallback(() => {
    if (!timelineRef.current) return;
    
    const timeline = timelineRef.current;
    timeline.innerHTML = '';
    
    const pxPerSec = timeline.clientWidth / totalDuration;
    
    for (let i = 0; i <= totalDuration; i += timeInterval) {
      const notch = document.createElement('div');
      const isPrimary = i % primaryLabelInterval === 0;
      const isSecondary = i % secondaryLabelInterval === 0;
      
      notch.style.position = 'absolute';
      notch.style.left = `${i * pxPerSec}px`;
      notch.style.height = isPrimary ? '12px' : isSecondary ? '8px' : '4px';
      notch.style.width = '1px';
      notch.style.bottom = '0';
      notch.style.backgroundColor = 'currentColor';
      notch.style.opacity = isPrimary ? '1' : `${secondaryLabelOpacity}`;
      
      if (isPrimary || isSecondary) {
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.bottom = '14px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.fontSize = '10px';
        label.style.opacity = isPrimary ? '1' : `${secondaryLabelOpacity}`;
        label.textContent = formatTimeCallback(i);
        notch.appendChild(label);
      }
      
      timeline.appendChild(notch);
    }
  }, [totalDuration, timeInterval, primaryLabelInterval, secondaryLabelInterval, formatTimeCallback, secondaryLabelOpacity]);

  useEffect(() => {
    const nodes = getNodes();
    const edges = getEdges();
    
    const graph = new Map();
    nodes.forEach(node => {
      graph.set(node.id, { node, next: [], prev: [] });
    });
    
    edges.forEach(edge => {
      const source = graph.get(edge.source);
      const target = graph.get(edge.target);
      if (source && target) {
        source.next.push(target);
        target.prev.push(source);
      }
    });

    const rootNodes = Array.from(graph.values())
      .filter(({ prev }) => prev.length === 0)
      .map(({ node }) => node);

    const newTracks: Track[] = [];
    let maxDuration = 0;

    const processNode = (node: any, startTime: number) => {
      const duration = node.data.duration || 30;
      const track: Track = {
        id: node.id,
        type: node.type,
        name: node.data.label || 'Untitled',
        duration,
        startTime,
        color: getNodeColor(node.type),
      };
      
      newTracks.push(track);
      maxDuration = Math.max(maxDuration, startTime + duration);
      
      const nextNodes = graph.get(node.id)?.next || [];
      nextNodes.forEach((next: any) => {
        processNode(next.node, startTime + duration);
      });
    };

    rootNodes.forEach(node => processNode(node, 0));
    setTracks(newTracks);
    setTotalDuration(maxDuration || 300); // Default to 5 minutes if no tracks
  }, [getNodes, getEdges, getNodeColor]);

  useEffect(() => {
    createTimeline();
  }, [createTimeline]);

  useEffect(() => {
    setAudioVolume(isMuted ? 0 : volume);
  }, [volume, isMuted, setAudioVolume]);

  const animate = (time: number) => {
    setCurrentTime(time);
    if (time < totalDuration) {
      animationRef.current = requestAnimationFrame(() => animate(time + 0.1));
    } else {
      setIsPlaying(false);
      stopSequence();
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      cancelAnimationFrame(animationRef.current!);
      setIsPlaying(false);
      await stopSequence();
    } else {
      setIsPlaying(true);
      await playSequence();
      animationRef.current = requestAnimationFrame(() => animate(currentTime));
    }
  };

  const handleStop = async () => {
    cancelAnimationFrame(animationRef.current!);
    setIsPlaying(false);
    setCurrentTime(0);
    await stopSequence();
  };

  const handleSeek = (_: Event, value: number | number[]) => {
    const newTime = Array.isArray(value) ? value[0] : value;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const newVolume = Array.isArray(value) ? value[0] : value;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && volume === 0) {
      setVolume(1);
    }
  };

  return (
    <Paper
      elevation={3}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: 1200,
        height: height,
        bgcolor: 'rgba(17, 25, 40, 0.95)',
        borderRadius: 2,
        p: 2,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(-50%) translateY(-2px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {/* Track Display */}
      <Box sx={{ height: height - 40, position: 'relative', mb: 1 }}>
        {tracks.map((track) => (
          <Tooltip key={track.id} title={track.name}>
            <Box
              sx={{
                position: 'absolute',
                left: `${(track.startTime / totalDuration) * 100}%`,
                width: `${(track.duration / totalDuration) * 100}%`,
                height: 24,
                bgcolor: track.color,
                opacity: 0.7,
                borderRadius: 1,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.02)',
                },
              }}
            />
          </Tooltip>
        ))}

        {/* Timeline */}
        <Box
          ref={timelineRef}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 24,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        />

        {/* Playhead */}
        <Box
          sx={{
            position: 'absolute',
            left: `${(currentTime / totalDuration) * 100}%`,
            height: '100%',
            width: 2,
            bgcolor: theme.palette.primary.main,
            zIndex: 1,
            transition: isPlaying ? 'none' : 'left 0.1s ease',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -4,
              left: -4,
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main,
            },
          }}
        />
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handlePlayPause}
            sx={{
              color: 'white',
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <IconButton
            onClick={handleStop}
            sx={{
              color: 'white',
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            <StopIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              const newTime = Math.max(0, currentTime - 5);
              setCurrentTime(newTime);
            }}
            sx={{
              color: 'white',
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            <FastRewindIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              const newTime = Math.min(totalDuration, currentTime + 5);
              setCurrentTime(newTime);
            }}
            sx={{
              color: 'white',
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            <FastForwardIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
          <IconButton
            onClick={toggleMute}
            sx={{
              color: 'white',
              '&:hover': { color: theme.palette.primary.main },
            }}
          >
            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>

          <Slider
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}20`,
                },
              },
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'monospace',
            minWidth: 100,
          }}
        >
          {formatTimeCallback(currentTime)} / {formatTimeCallback(totalDuration)}
        </Typography>

        <Slider
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={totalDuration}
          step={0.1}
          sx={{
            flexGrow: 1,
            color: theme.palette.primary.main,
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}20`,
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default Timeline;
