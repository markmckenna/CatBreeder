/**
 * CatSprite - Visual representation of a cat.
 */

import { CSSProperties } from 'react';
import type { Cat } from '../genetics.ts';

interface CatSpriteProps {
  cat: Cat;
  selected?: boolean;
  onClick?: () => void;
}

function CatSprite({ cat, selected = false, onClick }: CatSpriteProps) {
  const { phenotype } = cat;
  
  // Size affects overall scale
  const scale = phenotype.size === 'small' ? 0.8 : 1;
  
  // Tail color
  const tailColor = phenotype.tailColor === 'white' ? '#FFFFFF' : '#FF8C00';
  
  // Body color (derived from tail for simplicity - could expand)
  const bodyColor = phenotype.tailColor === 'white' ? '#F5F5DC' : '#FFB347';
  
  const containerStyle: CSSProperties = {
    position: 'relative',
    width: `${60 * scale}px`,
    height: `${50 * scale}px`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s',
    transform: selected ? 'scale(1.1)' : 'scale(1)',
    filter: selected ? 'drop-shadow(0 0 8px #FFD700)' : 'none',
  };

  const bodyStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    width: '70%',
    height: '60%',
    backgroundColor: bodyColor,
    borderRadius: '50% 50% 40% 40%',
    border: '2px solid #00000022',
  };

  const headStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '50%',
    height: '50%',
    backgroundColor: bodyColor,
    borderRadius: '50%',
    border: '2px solid #00000022',
  };

  // Ear styles depend on ear shape
  const earBaseStyle: CSSProperties = {
    position: 'absolute',
    top: phenotype.earShape === 'folded' ? '5%' : '-10%',
    width: '20%',
    height: '30%',
    backgroundColor: bodyColor,
    border: '2px solid #00000022',
  };

  const leftEarStyle: CSSProperties = {
    ...earBaseStyle,
    left: '30%',
    borderRadius: phenotype.earShape === 'folded' 
      ? '50% 50% 50% 50%' 
      : '50% 50% 0 0',
    transform: phenotype.earShape === 'folded' 
      ? 'rotate(-30deg)' 
      : 'rotate(-15deg)',
  };

  const rightEarStyle: CSSProperties = {
    ...earBaseStyle,
    right: '30%',
    borderRadius: phenotype.earShape === 'folded' 
      ? '50% 50% 50% 50%' 
      : '50% 50% 0 0',
    transform: phenotype.earShape === 'folded' 
      ? 'rotate(30deg)' 
      : 'rotate(15deg)',
  };

  // Tail style depends on tail length
  const tailLength = phenotype.tailLength === 'short' ? '30%' : '50%';
  const tailStyle: CSSProperties = {
    position: 'absolute',
    bottom: '30%',
    right: '-5%',
    width: tailLength,
    height: '15%',
    backgroundColor: tailColor,
    borderRadius: '50%',
    border: '2px solid #00000022',
    transform: 'rotate(-20deg)',
  };

  // Eyes
  const eyeStyle: (left: string) => CSSProperties = (left) => ({
    position: 'absolute',
    top: '35%',
    left,
    width: '15%',
    height: '20%',
    backgroundColor: '#228B22',
    borderRadius: '50%',
    border: '1px solid #000',
  });

  // Nose
  const noseStyle: CSSProperties = {
    position: 'absolute',
    top: '55%',
    left: '42%',
    width: '16%',
    height: '12%',
    backgroundColor: '#FFB6C1',
    borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
  };

  // Name tag
  const nameStyle: CSSProperties = {
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: `${10 * scale}px`,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textShadow: '1px 1px 2px white',
  };

  return (
    <div 
      style={containerStyle} 
      onClick={onClick}
      data-testid={`cat-sprite-${cat.id}`}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Select ${cat.name}` : cat.name}
    >
      {/* Tail (behind body) */}
      <div style={tailStyle} />
      
      {/* Body */}
      <div style={bodyStyle} />
      
      {/* Head */}
      <div style={headStyle}>
        {/* Ears */}
        <div style={leftEarStyle} />
        <div style={rightEarStyle} />
        
        {/* Eyes */}
        <div style={eyeStyle('25%')} />
        <div style={eyeStyle('60%')} />
        
        {/* Nose */}
        <div style={noseStyle} />
      </div>
      
      {/* Name */}
      <div style={nameStyle}>{cat.name}</div>
    </div>
  );
}

export default CatSprite;
