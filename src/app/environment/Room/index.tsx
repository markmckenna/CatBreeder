/**
 * Room component - displays a cozy background for cats.
 */

import { ReactNode, CSSProperties } from 'react';

export type RoomStyle = 'cozy' | 'modern' | 'rustic' | 'luxury';

export type FurnitureType = 'bed' | 'scratcher' | 'window' | 'plant' | 'toy';

export interface RoomData {
  id: string;
  name: string;
  capacity: number; // Max cats
  comfort: number; // 0-100, affects cat happiness
  style: RoomStyle;
}

export interface Furniture {
  id: string;
  name: string;
  type: FurnitureType;
  comfortBonus: number;
}

interface RoomProps {
  style?: RoomStyle;
  children?: ReactNode;
}

const ROOM_COLORS: Record<RoomStyle, { wall: string; floor: string; accent: string }> = {
  cozy: {
    wall: '#FFF5E6',
    floor: '#D4A574',
    accent: '#8B4513',
  },
  modern: {
    wall: '#F5F5F5',
    floor: '#808080',
    accent: '#333333',
  },
  rustic: {
    wall: '#F0E6D3',
    floor: '#8B7355',
    accent: '#5C4033',
  },
  luxury: {
    wall: '#FDF5E6',
    floor: '#C4A35A',
    accent: '#8B008B',
  },
};

const roomContainerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '400px',
  overflow: 'hidden',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

function Room({ style = 'cozy', children }: RoomProps) {
  const colors = ROOM_COLORS[style];

  const wallStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    background: `linear-gradient(180deg, ${colors.wall} 0%, ${colors.wall}dd 100%)`,
  };

  const floorStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    background: `linear-gradient(180deg, ${colors.floor}cc 0%, ${colors.floor} 100%)`,
  };

  const windowStyle: CSSProperties = {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '100px',
    backgroundColor: '#87CEEB',
    border: `8px solid ${colors.accent}`,
    borderRadius: '8px 8px 0 0',
    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.5)',
  };

  const windowCrossVertical: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '8px',
    height: '100%',
    backgroundColor: colors.accent,
  };

  const windowCrossHorizontal: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '8px',
    backgroundColor: colors.accent,
  };

  const curtainLeftStyle: CSSProperties = {
    position: 'absolute',
    top: '8%',
    left: 'calc(50% - 100px)',
    width: '40px',
    height: '130px',
    background: `linear-gradient(90deg, ${colors.accent}aa, ${colors.accent}66)`,
    borderRadius: '0 0 20px 0',
  };

  const curtainRightStyle: CSSProperties = {
    position: 'absolute',
    top: '8%',
    right: 'calc(50% - 100px)',
    width: '40px',
    height: '130px',
    background: `linear-gradient(90deg, ${colors.accent}66, ${colors.accent}aa)`,
    borderRadius: '0 0 0 20px',
  };

  const catBedStyle: CSSProperties = {
    position: 'absolute',
    bottom: '15%',
    left: '10%',
    width: '100px',
    height: '40px',
    backgroundColor: '#FF6B6B',
    borderRadius: '50% 50% 40% 40%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const scratcherStyle: CSSProperties = {
    position: 'absolute',
    bottom: '15%',
    right: '15%',
    width: '30px',
    height: '80px',
    background: `linear-gradient(90deg, #D2691E, #CD853F, #D2691E)`,
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const scratcherTopStyle: CSSProperties = {
    position: 'absolute',
    top: '-15px',
    left: '-10px',
    width: '50px',
    height: '15px',
    backgroundColor: '#228B22',
    borderRadius: '4px',
  };

  const plantStyle: CSSProperties = {
    position: 'absolute',
    bottom: '15%',
    right: '35%',
    width: '50px',
    height: '50px',
  };

  const potStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '10px',
    width: '30px',
    height: '25px',
    backgroundColor: '#B87333',
    borderRadius: '0 0 8px 8px',
  };

  const leafStyle: (rotation: number, offset: number) => CSSProperties = (rotation, offset) => ({
    position: 'absolute',
    bottom: '20px',
    left: `${15 + offset}px`,
    width: '20px',
    height: '30px',
    backgroundColor: '#228B22',
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'bottom center',
  });

  const contentStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '20px',
    gap: '10px',
  };

  return (
    <div style={roomContainerStyle} data-testid="room">
      {/* Background layers */}
      <div style={wallStyle} />
      <div style={floorStyle} />
      
      {/* Window */}
      <div style={windowStyle}>
        <div style={windowCrossVertical} />
        <div style={windowCrossHorizontal} />
      </div>
      
      {/* Curtains */}
      <div style={curtainLeftStyle} />
      <div style={curtainRightStyle} />
      
      {/* Furniture */}
      <div style={catBedStyle} data-testid="cat-bed" />
      <div style={scratcherStyle}>
        <div style={scratcherTopStyle} />
      </div>
      
      {/* Plant */}
      <div style={plantStyle}>
        <div style={potStyle} />
        <div style={leafStyle(-30, -5)} />
        <div style={leafStyle(0, 5)} />
        <div style={leafStyle(30, 15)} />
      </div>
      
      {/* Cat content area */}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}

export default Room;
