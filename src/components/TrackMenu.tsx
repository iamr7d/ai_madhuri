import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackMenuProps {
  position: { x: number; y: number };
  onSelect: (trackType: string) => void;
  onClose: () => void;
}

const tracks = [
  { 
    id: 'music', 
    label: 'Music Track', 
    icon: '🎵', 
    color: '#B026FF',
    description: 'Add background music or jingles'
  },
  { 
    id: 'tts', 
    label: 'Text to Speech', 
    icon: '🗣️', 
    color: '#00FF00',
    description: 'Convert text to natural-sounding speech'
  },
  { 
    id: 'weather', 
    label: 'Weather Update', 
    icon: '🌤️', 
    color: '#FFB800',
    description: 'Add current weather or forecast updates'
  },
  { 
    id: 'news', 
    label: 'News Update', 
    icon: '📰', 
    color: '#FF4A4A',
    description: 'Include latest news from selected categories'
  },
  { 
    id: 'announcement', 
    label: 'Announcement', 
    icon: '📢', 
    color: '#4A9FFF',
    description: 'Add important announcements or alerts'
  },
];

const TrackMenu: React.FC<TrackMenuProps> = ({ position, onSelect, onClose }) => {
  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <motion.div 
        className="absolute z-50 bg-[#1e2538] rounded-lg shadow-xl border border-[#2a3042]/50 p-2 min-w-[240px]"
        style={{ 
          left: position.x,
          top: position.y,
          translateX: '-50%',
          translateY: '-50%'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-col gap-1">
          {tracks.map((track) => (
            <motion.button
              key={track.id}
              className="group relative flex items-center gap-2 px-3 py-2 text-sm text-white rounded hover:bg-[#2a3042] transition-colors duration-200"
              onClick={() => onSelect(track.id)}
              whileHover={{ x: 4 }}
            >
              <span className="text-base">{track.icon}</span>
              <span>{track.label}</span>
              <div 
                className="w-2 h-2 rounded-full ml-auto"
                style={{ backgroundColor: track.color }}
              />
              
              {/* Tooltip */}
              <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 px-3 py-2 bg-[#2a3042] rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {track.description}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrackMenu;
