/**
 * Room component - displays a cozy background for cats.
 * Composed from individual SVG objects that can be positioned via CSS.
 */

import { ReactNode } from 'react';
import type { OwnedFurniture } from '../furniture.ts';
import { getToyColor, getBedColor, type FurniturePosition } from '../positions.ts';
import styles from './styles.css';

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
  furniturePositions?: FurniturePosition[];
  children?: ReactNode;
}

// ============= Individual SVG Components =============

/** Wall and floor background */
function WallFloor() {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="none" className={styles.backgroundLayer}>
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
    </svg>
  );
}

/** Fireplace with animated flames */
function Fireplace() {
  return (
    <svg viewBox="0 0 240 210" preserveAspectRatio="xMidYMid meet" className={styles.fireplace}>
      {/* Stone surround */}
      <rect x="0" y="15" width="240" height="195" fill="#696969" rx="8" />
      <rect x="10" y="25" width="220" height="175" fill="#2F2F2F" rx="4" />
      
      {/* Fire glow */}
      <defs>
        <radialGradient id="fireGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FF4500" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="200" rx="100" ry="60" fill="url(#fireGlow)" />
      
      {/* Logs */}
      <ellipse cx="90" cy="185" rx="35" ry="12" fill="#4A3728" />
      <ellipse cx="150" cy="185" rx="35" ry="12" fill="#3D2E22" />
      <ellipse cx="120" cy="175" rx="30" ry="10" fill="#5C4033" />
      
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
      
      <path d="M100 180 Q90 140 105 110 Q115 130 110 160 Q120 140 115 180 Z" fill="url(#flame1)" opacity="0.9">
        <animate attributeName="d" dur="0.8s" repeatCount="indefinite"
          values="M100 180 Q90 140 105 110 Q115 130 110 160 Q120 140 115 180 Z;
                  M100 180 Q95 145 108 115 Q112 135 108 158 Q118 142 115 180 Z;
                  M100 180 Q90 140 105 110 Q115 130 110 160 Q120 140 115 180 Z" />
      </path>
      <path d="M120 180 Q110 130 125 90 Q135 120 130 150 Q140 120 135 180 Z" fill="url(#flame2)" opacity="0.95">
        <animate attributeName="d" dur="1s" repeatCount="indefinite"
          values="M120 180 Q110 130 125 90 Q135 120 130 150 Q140 120 135 180 Z;
                  M120 180 Q115 135 128 95 Q132 125 128 155 Q138 125 135 180 Z;
                  M120 180 Q110 130 125 90 Q135 120 130 150 Q140 120 135 180 Z" />
      </path>
      <path d="M140 180 Q130 145 145 120 Q152 140 148 160 Q158 145 152 180 Z" fill="url(#flame1)" opacity="0.85">
        <animate attributeName="d" dur="0.7s" repeatCount="indefinite"
          values="M140 180 Q130 145 145 120 Q152 140 148 160 Q158 145 152 180 Z;
                  M140 180 Q135 148 147 125 Q150 142 146 158 Q156 148 152 180 Z;
                  M140 180 Q130 145 145 120 Q152 140 148 160 Q158 145 152 180 Z" />
      </path>
      
      {/* Mantle */}
      <rect x="-20" y="0" width="280" height="25" fill="#5C4033" rx="4" />
    </svg>
  );
}

/** Window with curtains */
function Window({ side }: { side: 'left' | 'right' }) {
  const className = side === 'left' ? styles.windowLeft : styles.windowRight;
  return (
    <svg viewBox="-20 -15 160 180" preserveAspectRatio="xMidYMid meet" className={className}>
      {/* Curtains - behind window */}
      <path d={side === 'left' 
        ? "M-15 -10 Q-10 75 -15 165 L10 165 Q5 75 15 -10 Z"
        : "M145 -10 Q140 75 145 165 L120 165 Q125 75 115 -10 Z"
      } fill="#8B4513" opacity="0.85" />
      
      {/* Window glass */}
      <rect x="0" y="0" width="120" height="150" fill="#87CEEB" rx="4" />
      {/* Frame */}
      <rect x="0" y="0" width="120" height="150" fill="none" stroke="#5C4033" strokeWidth="12" rx="4" />
      {/* Cross bars */}
      <line x1="60" y1="0" x2="60" y2="150" stroke="#5C4033" strokeWidth="6" />
      <line x1="0" y1="75" x2="120" y2="75" stroke="#5C4033" strokeWidth="6" />
    </svg>
  );
}

/** Bookshelf with books */
function Bookshelf() {
  return (
    <svg viewBox="0 0 80 110" preserveAspectRatio="xMidYMid meet" className={styles.bookshelf}>
      {/* Shelf frame */}
      <rect x="0" y="0" width="80" height="110" fill="#5C4033" />
      <rect x="5" y="5" width="70" height="25" fill="#3D2E22" />
      <rect x="5" y="35" width="70" height="25" fill="#3D2E22" />
      <rect x="5" y="65" width="70" height="25" fill="#3D2E22" />
      <rect x="5" y="95" width="70" height="10" fill="#3D2E22" />
      
      {/* Books - top shelf */}
      <rect x="10" y="7" width="8" height="20" fill="#C41E3A" />
      <rect x="20" y="9" width="6" height="18" fill="#228B22" />
      <rect x="28" y="6" width="10" height="21" fill="#4169E1" />
      <rect x="40" y="8" width="7" height="19" fill="#DAA520" />
      
      {/* Books - middle shelf */}
      <rect x="8" y="37" width="12" height="20" fill="#8B4513" />
      <rect x="22" y="39" width="8" height="18" fill="#800080" />
      <rect x="32" y="36" width="10" height="21" fill="#2F4F4F" />
    </svg>
  );
}

/** Potted plant */
function Plant() {
  return (
    <svg viewBox="-15 0 70 60" preserveAspectRatio="xMidYMid meet" className={styles.plant}>
      {/* Pot */}
      <rect x="0" y="30" width="40" height="30" fill="#B87333" rx="4" />
      {/* Leaves */}
      <ellipse cx="20" cy="30" rx="30" ry="18" fill="#228B22" />
      <ellipse cx="12" cy="22" rx="20" ry="12" fill="#32CD32" />
      <ellipse cx="28" cy="18" rx="16" ry="10" fill="#228B22" />
    </svg>
  );
}

/** Cozy rug */
function Rug() {
  return (
    <svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMid meet" className={styles.rug}>
      <ellipse cx="180" cy="60" rx="180" ry="60" fill="#A0522D" />
      <ellipse cx="180" cy="60" rx="160" ry="50" fill="#CD853F" />
      <ellipse cx="180" cy="60" rx="140" ry="40" fill="#DEB887" />
    </svg>
  );
}

/** Cat bed */
function CatBed({ side, color }: { side: 'left' | 'right'; color: string }) {
  const className = side === 'left' ? styles.catBedLeft : styles.catBedRight;
  const lightColor = color === '#FF6B6B' ? '#FF8E8E' : '#8EB8FF';
  return (
    <svg viewBox="0 0 120 50" preserveAspectRatio="xMidYMid meet" className={className}>
      <ellipse cx="60" cy="30" rx="60" ry="25" fill={color} />
      <ellipse cx="60" cy="25" rx="50" ry="18" fill={lightColor} />
    </svg>
  );
}

// ============= Furniture Layer =============

function ToyItem({ x, y, index }: { x: number; y: number; index: number }) {
  const colors = getToyColor(index);
  return (
    <div
      className={styles.furnitureToy}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.accent} 100%)`,
      }}
      data-testid="furniture-toy"
    />
  );
}

function BedItem({ x, y, index }: { x: number; y: number; index: number }) {
  const colors = getBedColor(index);
  return (
    <svg 
      viewBox="0 0 80 35"
      className={styles.furnitureBed}
      style={{ left: `${x}%`, top: `${y}%` }}
      data-testid="furniture-bed"
    >
      {/* Bed frame */}
      <ellipse cx="40" cy="22" rx="40" ry="15" fill={colors.main} />
      <ellipse cx="40" cy="20" rx="36" ry="12" fill={colors.accent} />
      {/* Cushion */}
      <ellipse cx="40" cy="17" rx="30" ry="9" fill={colors.cushion} />
    </svg>
  );
}

function FurnitureLayer({ positions }: { positions: FurniturePosition[] }) {
  // Sort so beds render first (under cats)
  const sorted = [...positions].sort((a, b) => {
    if (a.type === 'bed' && b.type !== 'bed') return -1;
    if (a.type !== 'bed' && b.type === 'bed') return 1;
    return 0;
  });
  
  return (
    <>
      {sorted.map((pos) => (
        pos.type === 'toy' 
          ? <ToyItem key={`toy-${pos.index}`} x={pos.x} y={pos.y} index={pos.index} />
          : <BedItem key={`bed-${pos.index}`} x={pos.x} y={pos.y} index={pos.index} />
      ))}
    </>
  );
}

// ============= Main Room Component =============

function Room({ furniturePositions, children }: RoomProps) {
  return (
    <div className={styles.roomContainer} data-testid="room">
      {/* Background layer */}
      <WallFloor />
      
      {/* Room objects - positioned via CSS */}
      <Window side="left" />
      <Window side="right" />
      <Fireplace />
      <Bookshelf />
      <Plant />
      <Rug />
      <CatBed side="left" color="#FF6B6B" />
      <CatBed side="right" color="#6B9FFF" />
      
      {/* Player-owned furniture - positioned from cat positions */}
      {furniturePositions && furniturePositions.length > 0 && (
        <FurnitureLayer positions={furniturePositions} />
      )}
      
      {/* Content (cats, UI overlays) */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Room;
