import React from 'react';
import type { Cat } from '../logic/cats/Cat.ts';

// Example renderer for a Cat model
export interface CatViewProps {
  cat: Cat;
}

export const CatView: React.FC<CatViewProps> = ({ cat }) => {
  // Display logic only: how the cat appears
  return (
    <div className="cat-view">
      <h3>{cat.name}</h3>
      <div>Color: {cat.phenotype.tailColor}</div>
      <div>Size: {cat.phenotype.size}</div>
      <div>Tail: {cat.phenotype.tailLength}</div>
      <div>Ears: {cat.phenotype.earShape}</div>
      <div>Happiness: {cat.happiness}</div>
      {/* Add more display logic as needed */}
    </div>
  );
};
