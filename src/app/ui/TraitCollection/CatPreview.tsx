/**
 * CatPreview - Simplified cat display for the trait collection grid.
 * 
 * Shows a cat based on phenotype without needing a full Cat object.
 * Can be greyed out for uncollected traits.
 */

import { CSSProperties } from 'react';
import type { CatPhenotype } from '../../cats/genetics.ts';

interface CatPreviewProps {
  phenotype: CatPhenotype;
  name?: string;
  greyed?: boolean;
}

function CatPreview({ phenotype, greyed = false }: CatPreviewProps) {
  // Size affects overall scale
  const scale = phenotype.size === 'small' ? 0.75 : 0.9;
  
  // Colors based on phenotype
  const tailColor = phenotype.tailColor === 'white' ? '#FFFFFF' : '#FF8C00';
  const bodyColor = phenotype.tailColor === 'white' ? '#F5F5DC' : '#FFB347';
  
  // Grey filter for uncollected - still shows traits clearly
  const filter = greyed ? 'grayscale(100%) brightness(0.7)' : 'none';

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: `${50 * scale}px`,
    height: `${42 * scale}px`,
    filter,
    transition: 'filter 0.2s ease',
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
    top: phenotype.earShape === 'folded' ? '5%' : '-15%',
    width: '22%',
    height: phenotype.earShape === 'folded' ? '28%' : '35%',
    backgroundColor: bodyColor,
    border: '2px solid #00000022',
  };

  const leftEarStyle: CSSProperties = {
    ...earBaseStyle,
    left: '28%',
    borderRadius: phenotype.earShape === 'folded' 
      ? '50% 50% 50% 50%' 
      : '50% 50% 10% 10%',
    transform: phenotype.earShape === 'folded' 
      ? 'rotate(-30deg)' 
      : 'rotate(-15deg)',
  };

  const rightEarStyle: CSSProperties = {
    ...earBaseStyle,
    right: '28%',
    borderRadius: phenotype.earShape === 'folded' 
      ? '50% 50% 50% 50%' 
      : '50% 50% 10% 10%',
    transform: phenotype.earShape === 'folded' 
      ? 'rotate(30deg)' 
      : 'rotate(15deg)',
  };

  // Tail style depends on tail length
  const tailLength = phenotype.tailLength === 'short' ? '25%' : '55%';
  const tailStyle: CSSProperties = {
    position: 'absolute',
    bottom: '30%',
    right: phenotype.tailLength === 'short' ? '-2%' : '-15%',
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

  return (
    <div style={containerStyle}>
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
    </div>
  );
}

export default CatPreview;
