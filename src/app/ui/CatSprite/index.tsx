/**
 * CatSprite - Visual representation of a cat.
 * 
 * Composed of individual body part components for readability.
 * All styling is inline since every property depends on phenotype/age.
 */

import { CSSProperties, useState } from 'react';
import type { Cat, CatPhenotype } from '../../cats/genetics.ts';

interface CatSpriteProps {
  cat: Cat;
  selected?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// ============= Color Derivation =============

/** Derive all cat colors from the body color phenotype */
function deriveColors(phenotype: CatPhenotype) {
  // Body color is the base - tail accent derives from it
  const bodyColor = phenotype.tailColor === 'white' ? '#F5F5DC' : '#FFB347';
  const tailColor = phenotype.tailColor === 'white' ? '#FFFFFF' : '#FF8C00';
  
  return { bodyColor, tailColor };
}

// ============= Body Part Components =============

interface BodyPartProps {
  phenotype: CatPhenotype;
  isKitten: boolean;
  bodyColor: string;
  tailColor: string;
}

function Tail({ phenotype, tailColor }: Pick<BodyPartProps, 'phenotype' | 'tailColor'>) {
  const isLong = phenotype.tailLength === 'long';
  
  const style: CSSProperties = {
    position: 'absolute',
    bottom: isLong ? '25%' : '30%',
    right: isLong ? '-15%' : '-3%',
    width: isLong ? '55%' : '18%',
    height: isLong ? '12%' : '15%',
    backgroundColor: tailColor,
    borderRadius: isLong ? '40% 80% 80% 40%' : '50%',
    border: '2px solid #00000022',
    transform: isLong ? 'rotate(-25deg)' : 'rotate(-10deg)',
  };
  
  return <div style={style} />;
}

function Body({ bodyColor }: Pick<BodyPartProps, 'bodyColor'>) {
  const style: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    width: '70%',
    height: '60%',
    backgroundColor: bodyColor,
    borderRadius: '50% 50% 40% 40%',
    border: '2px solid #00000022',
  };
  
  return <div style={style} />;
}

function Ear({ 
  side, 
  phenotype, 
  bodyColor 
}: { side: 'left' | 'right' } & Pick<BodyPartProps, 'phenotype' | 'bodyColor'>) {
  const isPointed = phenotype.earShape === 'pointed';
  const rotation = side === 'left' ? -1 : 1;
  
  // Position ears on outer corners of head - lower % = more outward
  const outerPosition = isPointed ? '8%' : '12%';
  
  // Pointed ears use clip-path for true triangle shape
  // Folded ears stay rounded
  const borderRadius = isPointed 
    ? '0'  // Using clip-path instead
    : '60% 60% 40% 40%';  // Rounded all around (Scottish Fold)
  
  // Triangular clip-path: point at top-center, wide at bottom
  const clipPath = isPointed
    ? (side === 'left' 
        ? 'polygon(50% 0%, 0% 100%, 100% 100%)'  // Triangle shape
        : 'polygon(50% 0%, 0% 100%, 100% 100%)')
    : undefined;
  
  const style: CSSProperties = {
    position: 'absolute',
    [side]: outerPosition,
    top: isPointed ? '-20%' : '5%',
    width: isPointed ? '24%' : '18%',
    height: isPointed ? '40%' : '22%',
    backgroundColor: bodyColor,
    border: isPointed ? 'none' : '2px solid #00000022',
    borderRadius,
    clipPath,
    transform: isPointed 
      ? `rotate(${rotation * 20}deg)` 
      : `rotate(${rotation * 40}deg) scaleY(0.8)`,
    // Add subtle outline for pointed ears
    ...(isPointed && {
      boxShadow: '0 0 0 1.5px rgba(0,0,0,0.15)',
    }),
  };
  
  return <div style={style} />;
}

function Eye({ left, isKitten }: { left: string; isKitten: boolean }) {
  const scale = isKitten ? 1.4 : 1;
  
  const style: CSSProperties = {
    position: 'absolute',
    top: isKitten ? '30%' : '35%',
    left,
    width: `${15 * scale}%`,
    height: `${20 * scale}%`,
    backgroundColor: '#228B22',
    borderRadius: '50%',
    border: '1px solid #000',
  };
  
  return <div style={style} />;
}

function Nose() {
  const style: CSSProperties = {
    position: 'absolute',
    top: '55%',
    left: '42%',
    width: '16%',
    height: '12%',
    backgroundColor: '#FFB6C1',
    borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
  };
  
  return <div style={style} />;
}

function Head({ phenotype, isKitten, bodyColor }: Omit<BodyPartProps, 'tailColor'>) {
  const style: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '50%',
    height: '50%',
    backgroundColor: bodyColor,
    borderRadius: '50%',
    border: '2px solid #00000022',
  };
  
  const eyeLeftPos = isKitten ? '20%' : '25%';
  const eyeRightPos = isKitten ? '55%' : '60%';
  
  return (
    <div style={style}>
      <Ear side="left" phenotype={phenotype} bodyColor={bodyColor} />
      <Ear side="right" phenotype={phenotype} bodyColor={bodyColor} />
      <Eye left={eyeLeftPos} isKitten={isKitten} />
      <Eye left={eyeRightPos} isKitten={isKitten} />
      <Nose />
    </div>
  );
}

function NameTag({ name }: { name: string }) {
  const style: CSSProperties = {
    position: 'absolute',
    bottom: '-22px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '11px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textShadow: '1px 1px 2px white, -1px -1px 2px white',
    color: '#333',
  };
  
  return <div style={style}>{name}</div>;
}

// ============= Main Component =============

function CatSprite({ cat, selected = false, onClick, onMouseEnter, onMouseLeave }: CatSpriteProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { phenotype } = cat;
  
  // Kittens (under 4 weeks) are smaller with bigger eyes
  const isKitten = cat.age < 4;
  const kittenScale = isKitten ? 0.7 : 1;
  
  // Size phenotype affects overall scale
  const scale = (phenotype.size === 'small' ? 0.8 : 1) * kittenScale;
  
  // Derive colors from body color phenotype
  const { bodyColor, tailColor } = deriveColors(phenotype);

  // Determine visual state
  const isHighlighted = selected || isHovered;
  const glowColor = selected ? '#FFD700' : '#87CEEB';
  
  // Base size is larger (80x66) for better visibility in room
  const containerStyle: CSSProperties = {
    position: 'relative',
    width: `${80 * scale}px`,
    height: `${66 * scale}px`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.15s ease, filter 0.15s ease',
    transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
    filter: isHighlighted ? `drop-shadow(0 0 8px ${glowColor})` : 'none',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <div 
      style={containerStyle} 
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`cat-sprite-${cat.id}`}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Select ${cat.name}` : cat.name}
    >
      <Tail phenotype={phenotype} tailColor={tailColor} />
      <Body bodyColor={bodyColor} />
      <Head phenotype={phenotype} isKitten={isKitten} bodyColor={bodyColor} />
      <NameTag name={cat.name} />
    </div>
  );
}

export default CatSprite;
