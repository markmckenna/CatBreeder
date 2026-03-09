import React from 'react';
import type { Cat } from '../logic/cats';
import { phenotypeFor } from '../logic/cats';

// Example renderer for a Cat model
export interface CatViewProps {
  cat: Cat;
}

export const CatView: React.FC<CatViewProps> = ({ cat }) => {
  // Display logic only: how the cat appears
  const phenotype = phenotypeFor(cat.genotype);
  return (
    <div className="cat-view">
      <h3>{cat.name}</h3>
      <div>Color: {phenotype.color}</div>
      <div>Size: {phenotype.size}</div>
      <div>Tail: {phenotype.tailLength}</div>
      <div>Ears: {phenotype.earShape}</div>
      <div>Happiness: {cat.happiness}</div>
      {/* Add more display logic as needed */}
    </div>
  );
};
