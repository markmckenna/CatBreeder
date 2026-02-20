
/**
 * Visual System Design (Agent-Oriented Reference)
 *
 * ## Room Coordinate System
 * - Uses percentage-based positioning relative to the container.
 *
 * ### Vertical Layout
 * | Element    | Top % | Description                |
 * |------------|-------|----------------------------|
 * | Ceiling    | 0%    | Top of room                |
 * | Wall       | 0-66% | Wall area (cream/wallpaper)|
 * | Baseboard  | 66%   | Dark brown trim strip      |
 * | Floor      | 67-100%| Wooden floor area (legacy) |
 *
 * **Rule:** Anything below 70% is “on the floor.” Place thick objects (cat trees, beds) further onto the floor for realism.
 *
 * ### Horizontal Layout
 * - Left edge: 0%, Center: 50%, Right edge: 100%
 * - Cat trees: x=12% (left), x=88% (right)
 *
 * ## Visual Layering
 * 1. Walls & Floor (background SVGs)
 * 2. Affixed Objects (windows, fireplace, plants, rugs)
 * 3. Placeable Furniture (cat trees, beds, toys)
 * 4. Cats (always on top)
 *
 * ## Object Positioning
 * - Floor objects: use bottom: 30% (70% from top) or greater, depending on thickness.
 *
 * ### Placement Positions and Hardpoints
 * - Every placeable object defines a placement position (anchor point for alignment).
 * - Objects that can have things placed on them (e.g., cat trees) define hardpoints (snap points).
 *   - Cat tree: placement at center of foot (y=195), hardpoints at y=22, 87, 152 (platforms).
 *   - Cat: placement at butt. Snap to hardpoint when placed on tree.
 *
 * ## Hitboxes and Pointer Events
 * - Interactive objects must use a hitbox matching their visible outline (SVG shape), not the bounding box.
 * - Use SVG hit testing or CSS pointer-events: visiblePainted.
 * - Parent: pointer-events: none; Interactive element: pointer-events: auto, cursor: pointer, correct z-index.
 *
 * ## SVG Object Sizing
 * - Use preserveAspectRatio="xMidYMid meet" for SVGs.
 * - Size SVGs with percentage width, let height auto-calculate.
 *
 * ## Position Reference Table
 * | Object     | Method         | Transform           | pointer-events | Placement Pos.   | Hardpoints      |
 * |------------|---------------|---------------------|----------------|------------------|-----------------|
 * | Cat sprite | top, left     | translate(-50%,-50%)| auto           | Butt center      | —               |
 * | Toy        | top, left     | translate(-50%,-50%)| auto           | Center           | —               |
 * | Bed        | top, left     | translate(-50%,-50%)| auto           | Center of base   | —               |
 * | Cat tree   | top, left     | translateX(-50%)    | auto           | Center of foot   | 3 (platforms)   |
 * | Plant      | bottom, left  | none                | none           | Center of base   | —               |
 * | Fireplace  | top, left     | none                | none           | Center of base   | —               |
 *
 * ## Example: Cat Tree and Cat Placement
 * - Cat tree: placement at center of foot, hardpoints at platform centers.
 * - Cat: placement at butt, snapped to hardpoint.
 *
 * ## Testing Positioning Changes
 * 1. Visual check: object sits where expected
 * 2. Hover check: cursor changes to pointer
 * 3. Click check: clicking triggers handler
 * 4. Selection check: gold glow appears when selected
 * If hover/click don’t work, check pointer-events and z-index.
 */

import { ReactNode } from 'react';
import type { OwnedFurniture, FurnitureItemType } from '../furniture.ts';
import { SHOP_ITEMS } from '../furniture.ts';
import { getToyColor, getBedColor, type FurniturePosition } from '../positions.ts';
import type { FurnitureSelection } from '../../ui/selection.ts';
import styles from './styles.css';

export type RoomStyle = 'cozy' | 'modern' | 'rustic' | 'luxury';

export type FurnitureType = 'bed' | 'scratcher' | 'window' | 'plant' | 'toy';

// Re-export for convenience
export type { FurnitureSelection } from '../../ui/selection.ts';

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
  selectedFurniture?: FurnitureSelection | null;
  onFurnitureClick?: (selection: FurnitureSelection) => void;
  onFurnitureHover?: (selection: FurnitureSelection | null) => void;
  children?: ReactNode;
}


// ============= Visual Layer Z-Index =============
// 0: Walls & Floor (background)
// 1: Affixed objects (windows, fireplace, plant, rug)
// 2: Placeable furniture (cat trees, beds, toys)
// 3: Cats (always on top)

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
      
      {/* Floor boards pattern - staggered planks */}
      <defs>
        <pattern id="floorboards" patternUnits="userSpaceOnUse" width="100" height="200">
          <rect x="0" y="0" width="100" height="200" fill="#8B7355" />
          {/* Full-height plank lines */}
          <line x1="0" y1="0" x2="0" y2="200" stroke="#7A6548" strokeWidth="2" />
          <line x1="50" y1="0" x2="50" y2="200" stroke="#7A6548" strokeWidth="1" />
          {/* Horizontal stagger lines for alternating boards */}
          <line x1="0" y1="100" x2="50" y2="100" stroke="#7A6548" strokeWidth="1" />
          <line x1="50" y1="50" x2="100" y2="50" stroke="#7A6548" strokeWidth="1" />
          <line x1="50" y1="150" x2="100" y2="150" stroke="#7A6548" strokeWidth="1" />
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
      {/* Curtains - one on each side of window */}
      <path d="M-15 -10 Q-10 75 -15 165 L10 165 Q5 75 15 -10 Z" fill="#8B4513" opacity="0.85" />
      <path d="M135 -10 Q130 75 135 165 L110 165 Q115 75 105 -10 Z" fill="#8B4513" opacity="0.85" />
      
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
    <svg viewBox="0 0 50 120" preserveAspectRatio="xMidYMid meet" className={styles.plant}>
      {/* Pot */}
      <rect x="10" y="95" width="30" height="25" fill="#B87333" rx="3" />
      {/* Trunk */}
      <rect x="21" y="40" width="8" height="58" fill="#8B4513" />
      {/* Leaves/foliage - layered for depth */}
      <ellipse cx="25" cy="35" rx="22" ry="18" fill="#228B22" />
      <ellipse cx="18" cy="28" rx="15" ry="12" fill="#32CD32" />
      <ellipse cx="32" cy="25" rx="14" ry="10" fill="#228B22" />
      <ellipse cx="25" cy="18" rx="12" ry="10" fill="#2E8B2E" />
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

// ============= Furniture Layer =============

interface FurnitureItemProps {
  x: number;
  y?: number;
  index: number;
  selected?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function ToyItem({ x, y, index, selected, onClick, onMouseEnter, onMouseLeave }: FurnitureItemProps) {
  const colors = getToyColor(index);
  return (
    <div
      className={`${styles.furnitureToy} ${selected ? styles.furnitureSelected : ''}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.accent} 100%)`,
        border: '2px solid rgba(0, 0, 0, 0.3)',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid="furniture-toy"
    />
  );
}

function BedItem({ x, y, index, selected, onClick, onMouseEnter, onMouseLeave }: FurnitureItemProps) {
  const colors = getBedColor(index);
  return (
    <svg 
      viewBox="0 0 80 35"
      className={`${styles.furnitureBed} ${selected ? styles.furnitureSelected : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid="furniture-bed"
    >
      {/* Bed frame */}
      <ellipse cx="40" cy="22" rx="40" ry="15" fill={colors.main} stroke="#4a3728" strokeWidth="1.5" />
      <ellipse cx="40" cy="20" rx="36" ry="12" fill={colors.accent} />
      {/* Cushion */}
      <ellipse cx="40" cy="17" rx="30" ry="9" fill={colors.cushion} stroke="#4a3728" strokeWidth="0.5" />
    </svg>
  );
}


function CatTreeItem({ x, index, selected, onClick, onMouseEnter, onMouseLeave }: FurnitureItemProps) {
  // Use distinct colors that don't match the floor (avoid browns)
  const mainColor = index % 2 === 0 ? '#5D4E37' : '#4A3F2F';  // Darker brown for contrast
  const platformColor = index % 2 === 0 ? '#8B7355' : '#7A6548';
  const cushionColor = index % 2 === 0 ? '#E8D5B7' : '#D4C4A8';  // Lighter cushions

  // --- Visual System Agent Notes ---
  // Placement position: The logical anchor for this object is the center of its foot, slightly above the rendered base (y=202, so use y=195).
  // Hardpoints: This object defines three hardpoints (cat platforms) at y=22, 87, 152. When placing a cat, align the cat's placement position (butt) to the chosen hardpoint.
  // Layering: This object is in the placeable furniture layer (z-index: 2), always above affixed objects and below cats.
  // Hitbox: Use pointer-events on visible SVG shapes, not the bounding box, so cats on top don't block selection.

  return (
    <svg 
      viewBox="0 0 90 210"
      className={`${styles.furnitureCatTree} ${selected ? styles.furnitureSelected : ''}`}
      style={{ 
        left: `${x}%`,
        zIndex: 2, // Placeable furniture layer
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid="furniture-cat-tree"
    >
      {/* Main post */}
      <rect x="37" y="0" width="16" height="205" fill={mainColor} stroke="#2a2520" strokeWidth="1" />
      {/* Top platform (highest cat) */}
      <ellipse cx="45" cy="25" rx="38" ry="12" fill={platformColor} stroke="#3a3530" strokeWidth="1.5" />
      <ellipse cx="45" cy="22" rx="33" ry="9" fill={cushionColor} stroke="#a09080" strokeWidth="0.5" />
      {/* Middle platform */}
      <ellipse cx="45" cy="90" rx="38" ry="12" fill={platformColor} stroke="#3a3530" strokeWidth="1.5" />
      <ellipse cx="45" cy="87" rx="33" ry="9" fill={cushionColor} stroke="#a09080" strokeWidth="0.5" />
      {/* Bottom platform (lowest cat) */}
      <ellipse cx="45" cy="155" rx="38" ry="12" fill={platformColor} stroke="#3a3530" strokeWidth="1.5" />
      <ellipse cx="45" cy="152" rx="33" ry="9" fill={cushionColor} stroke="#a09080" strokeWidth="0.5" />
      {/* Base */}
      <ellipse cx="45" cy="202" rx="40" ry="8" fill={mainColor} stroke="#2a2520" strokeWidth="1" />
    </svg>
  );
}

function FurnitureLayer({ positions, selectedFurniture, onFurnitureClick, onFurnitureHover }: { 
  positions: FurniturePosition[]; 
  selectedFurniture?: FurnitureSelection | null;
  onFurnitureClick?: (selection: FurnitureSelection) => void;
  onFurnitureHover?: (selection: FurnitureSelection | null) => void;
}) {
  // Sort: cat trees first (background), then beds (under cats), then toys (foreground)
  const sorted = [...positions].sort((a, b) => {
    const order = { catTree: 0, bed: 1, toy: 2 };
    return order[a.type] - order[b.type];
  });

  const createSelection = (type: FurnitureItemType, index: number): FurnitureSelection => ({
    type: 'furniture',
    furnitureType: type,
    item: SHOP_ITEMS[type],
    index,
  });

  const isSelected = (type: FurnitureItemType, index: number) => 
    selectedFurniture?.furnitureType === type && selectedFurniture?.index === index;
  
  return (
    <>
      {sorted.map((pos) => {
        if (pos.type === 'catTree') {
          const selection = createSelection('catTree', pos.index);
          return (
            <CatTreeItem 
              key={`catTree-${pos.index}`} 
              x={pos.x} 
              index={pos.index}
              selected={isSelected('catTree', pos.index)}
              onClick={() => onFurnitureClick?.(selection)}
              onMouseEnter={() => onFurnitureHover?.(selection)}
              onMouseLeave={() => onFurnitureHover?.(null)}
            />
          );
        }
        if (pos.type === 'toy') {
          const selection = createSelection('toy', pos.index);
          return (
            <ToyItem 
              key={`toy-${pos.index}`} 
              x={pos.x} 
              y={pos.y} 
              index={pos.index}
              selected={isSelected('toy', pos.index)}
              onClick={() => onFurnitureClick?.(selection)}
              onMouseEnter={() => onFurnitureHover?.(selection)}
              onMouseLeave={() => onFurnitureHover?.(null)}
            />
          );
        }
        const selection = createSelection('bed', pos.index);
        return (
          <BedItem 
            key={`bed-${pos.index}`} 
            x={pos.x} 
            y={pos.y} 
            index={pos.index}
            selected={isSelected('bed', pos.index)}
            onClick={() => onFurnitureClick?.(selection)}
            onMouseEnter={() => onFurnitureHover?.(selection)}
            onMouseLeave={() => onFurnitureHover?.(null)}
          />
        );
      })}
    </>
  );
}

// ============= Main Room Component =============

function Room({ furniturePositions, selectedFurniture, onFurnitureClick, onFurnitureHover, children }: RoomProps) {
  return (
    <div className={styles.roomContainer} data-testid="room">
      {/* Background layer (z-index: 0) */}
      <WallFloor />

      {/* Affixed objects (z-index: 1) */}
      <Window side="left" />
      <Window side="right" />
      <Fireplace />
      <Bookshelf />
      <Plant />
      <Rug />

      {/* Placeable furniture (z-index: 2) */}
      {furniturePositions && furniturePositions.length > 0 && (
        <FurnitureLayer 
          positions={furniturePositions} 
          selectedFurniture={selectedFurniture}
          onFurnitureClick={onFurnitureClick} 
          onFurnitureHover={onFurnitureHover} 
        />
      )}

      {/* Cats and overlays (z-index: 3) */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Room;
