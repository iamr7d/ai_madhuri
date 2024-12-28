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
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  onPlayTrack: (index: number) => void;
  onPauseTrack: (index: number) => void;
  onDeleteTrack: (index: number) => void;
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
        width: '100%', 
        maxWidth: 600, 
        margin: '0 auto',
        mt: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        Track List
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tracks">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {tracks.map((track, index) => (
                <Draggable key={track.id} draggableId={track.id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Box {...provided.dragHandleProps} sx={{ mr: 2 }}>
                        <DragHandleIcon />
                      </Box>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{track.title}</Typography>
                            <Chip 
                              label={track.type}
                              size="small"
                              color={getTrackTypeColor(track.type)}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={track.duration}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label={track.status === 'playing' ? 'pause' : 'play'}
                          onClick={() => track.status === 'playing' ? onPauseTrack(index) : onPlayTrack(index)}
                          sx={{ mr: 1 }}
                        >
                          {track.status === 'playing' ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => onDeleteTrack(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
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
