/**
 * Room component - displays a cozy background for cats.
 * Uses an SVG-generated background of a warm room with fireplace.
 */

import { ReactNode, CSSProperties } from 'react';
import type { OwnedFurniture } from '../furniture.ts';

export type RoomStyle = 'cozy' | 'modern' | 'rustic' | 'luxury';

export type FurnitureType = 'bed' | 'scratcher' | 'window' | 'plant' | 'toy';

export interface RoomData {
  id: string;
  name: string;
  capacity: number;
  comfort: number;
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
  furniture?: OwnedFurniture;
  children?: ReactNode;
}

// SVG background of a cozy room with fireplace
function CozyRoomBackground() {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {/* Wall */}
      <rect x="0" y="0" width="800" height="400" fill="#F5E6D3" />
      
      {/* Wallpaper pattern */}
      <defs>
        <pattern id="wallpaper" patternUnits="userSpaceOnUse" width="40" height="40">
          <circle cx="20" cy="20" r="2" fill="#E8D5C4" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="800" height="400" fill="url(#wallpaper)" />
      
      {/* Floor */}
      <rect x="0" y="400" width="800" height="200" fill="#8B7355" />
      
      {/* Floor boards pattern */}
      <defs>
        <pattern id="floorboards" patternUnits="userSpaceOnUse" width="100" height="200">
          <rect x="0" y="0" width="100" height="200" fill="#8B7355" />
          <line x1="0" y1="0" x2="0" y2="200" stroke="#7A6548" strokeWidth="2" />
          <line x1="50" y1="100" x2="50" y2="200" stroke="#7A6548" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="400" width="800" height="200" fill="url(#floorboards)" />
      
      {/* Baseboard */}
      <rect x="0" y="395" width="800" height="15" fill="#5C4033" />
      
      {/* Fireplace - stone surround */}
      <rect x="280" y="200" width="240" height="210" fill="#696969" rx="8" />
      <rect x="290" y="210" width="220" height="190" fill="#2F2F2F" rx="4" />
      
      {/* Fire glow */}
      <defs>
        <radialGradient id="fireGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FF4500" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="400" cy="400" rx="120" ry="80" fill="url(#fireGlow)" />
      
      {/* Logs */}
      <ellipse cx="370" cy="385" rx="35" ry="12" fill="#4A3728" />
      <ellipse cx="430" cy="385" rx="35" ry="12" fill="#3D2E22" />
      <ellipse cx="400" cy="375" rx="30" ry="10" fill="#5C4033" />
      
      {/* Fire flames */}
      <defs>
        <linearGradient id="flame1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="50%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="flame2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF6347" />
          <stop offset="60%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FFFF00" />
        </linearGradient>
      </defs>
      
      {/* Animated flame shapes */}
      <path d="M380 380 Q370 340 385 310 Q395 330 390 360 Q400 340 395 380 Z" fill="url(#flame1)" opacity="0.9">
        <animate attributeName="d" dur="0.8s" repeatCount="indefinite"
          values="M380 380 Q370 340 385 310 Q395 330 390 360 Q400 340 395 380 Z;
                  M380 380 Q375 345 388 315 Q392 335 388 358 Q398 342 395 380 Z;
                  M380 380 Q370 340 385 310 Q395 330 390 360 Q400 340 395 380 Z" />
      </path>
      <path d="M400 380 Q390 330 405 290 Q415 320 410 350 Q420 320 415 380 Z" fill="url(#flame2)" opacity="0.95">
        <animate attributeName="d" dur="1s" repeatCount="indefinite"
          values="M400 380 Q390 330 405 290 Q415 320 410 350 Q420 320 415 380 Z;
                  M400 380 Q395 335 408 295 Q412 325 408 355 Q418 325 415 380 Z;
                  M400 380 Q390 330 405 290 Q415 320 410 350 Q420 320 415 380 Z" />
      </path>
      <path d="M420 380 Q410 345 425 320 Q432 340 428 360 Q438 345 432 380 Z" fill="url(#flame1)" opacity="0.85">
        <animate attributeName="d" dur="0.7s" repeatCount="indefinite"
          values="M420 380 Q410 345 425 320 Q432 340 428 360 Q438 345 432 380 Z;
                  M420 380 Q415 348 427 325 Q430 342 426 358 Q436 348 432 380 Z;
                  M420 380 Q410 345 425 320 Q432 340 428 360 Q438 345 432 380 Z" />
      </path>
      
      {/* Mantle */}
      <rect x="260" y="185" width="280" height="25" fill="#5C4033" rx="4" />
      
      {/* Window on left */}
      <rect x="60" y="100" width="120" height="150" fill="#87CEEB" rx="4" />
      <rect x="60" y="100" width="120" height="150" fill="none" stroke="#5C4033" strokeWidth="12" rx="4" />
      <line x1="120" y1="100" x2="120" y2="250" stroke="#5C4033" strokeWidth="6" />
      <line x1="60" y1="175" x2="180" y2="175" stroke="#5C4033" strokeWidth="6" />
      
      {/* Curtains */}
      <path d="M50 90 Q55 180 45 260 L65 260 Q60 180 70 90 Z" fill="#8B4513" opacity="0.7" />
      <path d="M190 90 Q185 180 195 260 L175 260 Q180 180 170 90 Z" fill="#8B4513" opacity="0.7" />
      
      {/* Window on right */}
      <rect x="620" y="100" width="120" height="150" fill="#87CEEB" rx="4" />
      <rect x="620" y="100" width="120" height="150" fill="none" stroke="#5C4033" strokeWidth="12" rx="4" />
      <line x1="680" y1="100" x2="680" y2="250" stroke="#5C4033" strokeWidth="6" />
      <line x1="620" y1="175" x2="740" y2="175" stroke="#5C4033" strokeWidth="6" />
      
      {/* Curtains right */}
      <path d="M610 90 Q615 180 605 260 L625 260 Q620 180 630 90 Z" fill="#8B4513" opacity="0.7" />
      <path d="M750 90 Q745 180 755 260 L735 260 Q740 180 730 90 Z" fill="#8B4513" opacity="0.7" />
      
      {/* Cozy rug in front of fireplace */}
      <ellipse cx="400" cy="520" rx="180" ry="60" fill="#A0522D" />
      <ellipse cx="400" cy="520" rx="160" ry="50" fill="#CD853F" />
      <ellipse cx="400" cy="520" rx="140" ry="40" fill="#DEB887" />
      
      {/* Cat bed on left */}
      <ellipse cx="150" cy="500" rx="60" ry="25" fill="#FF6B6B" />
      <ellipse cx="150" cy="495" rx="50" ry="18" fill="#FF8E8E" />
      
      {/* Cat bed on right */}
      <ellipse cx="650" cy="500" rx="60" ry="25" fill="#6B9FFF" />
      <ellipse cx="650" cy="495" rx="50" ry="18" fill="#8EB8FF" />
      
      {/* Bookshelf on wall */}
      <rect x="550" y="280" width="80" height="110" fill="#5C4033" />
      <rect x="555" y="285" width="70" height="25" fill="#3D2E22" />
      <rect x="555" y="315" width="70" height="25" fill="#3D2E22" />
      <rect x="555" y="345" width="70" height="25" fill="#3D2E22" />
      <rect x="555" y="375" width="70" height="10" fill="#3D2E22" />
      
      {/* Books */}
      <rect x="560" y="287" width="8" height="20" fill="#C41E3A" />
      <rect x="570" y="289" width="6" height="18" fill="#228B22" />
      <rect x="578" y="286" width="10" height="21" fill="#4169E1" />
      <rect x="590" y="288" width="7" height="19" fill="#DAA520" />
      
      <rect x="558" y="317" width="12" height="20" fill="#8B4513" />
      <rect x="572" y="319" width="8" height="18" fill="#800080" />
      <rect x="582" y="316" width="10" height="21" fill="#2F4F4F" />
      
      {/* Plant */}
      <rect x="170" y="330" width="40" height="60" fill="#B87333" rx="4" />
      <ellipse cx="190" cy="330" rx="35" ry="20" fill="#228B22" />
      <ellipse cx="180" cy="320" rx="25" ry="15" fill="#32CD32" />
      <ellipse cx="200" cy="315" rx="20" ry="12" fill="#228B22" />
    </svg>
  );
}

const roomContainerStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '300px',
  overflow: 'hidden',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  backgroundColor: '#2F2F2F',
};

const contentStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
};

// Fixed positions for furniture items (percentage of room size)
const TOY_POSITIONS = [
  { x: 25, y: 80 },  // Near left cat bed
  { x: 75, y: 80 },  // Near right cat bed
  { x: 50, y: 70 },  // Center on rug
  { x: 15, y: 75 },  // Far left
  { x: 85, y: 75 },  // Far right
];

const BED_POSITIONS = [
  { x: 35, y: 82 },  // Left of fireplace
  { x: 65, y: 82 },  // Right of fireplace
  { x: 20, y: 90 },  // Far left back
  { x: 80, y: 90 },  // Far right back
  { x: 50, y: 88 },  // Center back
];

// Toy item (simple ball)
function ToyItem({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #C62828 100%)',
        boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        zIndex: 2,
      }}
      data-testid="furniture-toy"
    />
  );
}

// Bed item (cushion shape)
function BedItem({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: '45px',
        height: '25px',
        borderRadius: '50%',
        background: 'linear-gradient(180deg, #9C27B0 0%, #6A1B9A 100%)',
        boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
        border: '2px solid #7B1FA2',
        zIndex: 2,
      }}
      data-testid="furniture-bed"
    />
  );
}

// Generate furniture elements based on owned counts
function FurnitureLayer({ furniture }: { furniture: OwnedFurniture }) {
  const toys = [];
  const beds = [];
  
  for (let i = 0; i < Math.min(furniture.toys, TOY_POSITIONS.length); i++) {
    const pos = TOY_POSITIONS[i];
    toys.push(<ToyItem key={`toy-${i}`} x={pos.x} y={pos.y} />);
  }
  
  for (let i = 0; i < Math.min(furniture.beds, BED_POSITIONS.length); i++) {
    const pos = BED_POSITIONS[i];
    beds.push(<BedItem key={`bed-${i}`} x={pos.x} y={pos.y} />);
  }
  
  return (
    <>
      {beds}
      {toys}
    </>
  );
}

function Room({ furniture, children }: RoomProps) {
  return (
    <div style={roomContainerStyle} data-testid="room">
      <CozyRoomBackground />
      {furniture && <FurnitureLayer furniture={furniture} />}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}

export default Room;
