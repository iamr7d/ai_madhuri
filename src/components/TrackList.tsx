import React from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  onPlayTrack: (id: string) => void;
  onPauseTrack: (id: string) => void;
  onDeleteTrack: (id: string) => void;
  onReorderTracks: (startIndex: number, endIndex: number) => void;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  onPlayTrack, 
  onPauseTrack,
  onDeleteTrack, 
  onReorderTracks 
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorderTracks(result.source.index, result.destination.index);
  };

  const getTrackTypeColor = (type: Track['type']) => {
    switch (type) {
      case 'audio': return 'primary';
      case 'tts': return 'secondary';
      case 'weather': return 'info';
      case 'news': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper 
      sx={{ 
        width: '300px', 
        maxHeight: 'calc(100vh - 180px)',
        overflow: 'auto',
        position: 'fixed',
        right: 20,
        top: 80,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div">
          Track List
        </Typography>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tracks">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {tracks.map((track, index) => (
                <Draggable key={track.id} draggableId={track.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <ListItem
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        <div {...provided.dragHandleProps}>
                          <DragHandleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        </div>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ mr: 1 }}>
                                {track.title}
                              </Typography>
                              <Chip 
                                label={track.type} 
                                size="small" 
                                color={getTrackTypeColor(track.type)}
                                sx={{ height: 20 }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {track.duration}
                              </Typography>
                              {track.status === 'error' && (
                                <Chip 
                                  label="Error" 
                                  size="small" 
                                  color="error" 
                                  sx={{ ml: 1, height: 20 }} 
                                />
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => track.status === 'playing' ? onPauseTrack(track.id) : onPlayTrack(track.id)} 
                            sx={{ mr: 1 }}
                          >
                            {track.status === 'playing' ? <PauseIcon /> : <PlayArrowIcon />}
                          </IconButton>
                          <IconButton edge="end" onClick={() => onDeleteTrack(track.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

export default TrackList;
