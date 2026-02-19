/**
 * TraitCollection - Contact sheet showing all possible trait combinations.
 * 
 * Displays a 4x4 grid of all 16 phenotype combinations.
 * Collected traits show the first cat that achieved them.
 * Uncollected traits show greyed-out previews.
 */

import { useState } from 'react';
import type { CatPhenotype } from '../../cats/genetics.ts';
import type { TraitCollection as TraitCollectionType } from '../../cats/collection.ts';
import {
  getAllPhenotypeCombinations,
  getPhenotypeKey,
  getCollectedTraitInfo,
  getCollectionProgress,
} from '../../cats/collection.ts';
import CatPreview from './CatPreview.tsx';
import styles from './styles.css';

interface TraitCollectionProps {
  collection: TraitCollectionType;
  onClose?: () => void;
}

function TraitCollection({ collection, onClose }: TraitCollectionProps) {
  const [hoveredPhenotype, setHoveredPhenotype] = useState<CatPhenotype | null>(null);
  
  const combinations = getAllPhenotypeCombinations();
  const progress = getCollectionProgress(collection);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🎨 Trait Collection</h2>
          <div className={styles.progress}>
            {progress.collected}/{progress.total} ({progress.percentage}%)
          </div>
          {onClose && (
            <button className={styles.closeButton} onClick={onClose}>✕</button>
          )}
        </div>
        
        <div className={styles.grid}>
          {combinations.map((phenotype) => {
            const key = getPhenotypeKey(phenotype);
            const info = getCollectedTraitInfo(collection, phenotype);
            const isCollected = !!info;
            const isHovered = hoveredPhenotype && getPhenotypeKey(hoveredPhenotype) === key;
            
            return (
              <div
                key={key}
                className={`${styles.slot} ${isCollected ? styles.collected : styles.uncollected}`}
                onMouseEnter={() => !isCollected && setHoveredPhenotype(phenotype)}
                onMouseLeave={() => setHoveredPhenotype(null)}
              >
                <CatPreview
                  phenotype={phenotype}
                  name={info?.catName}
                  greyed={!isCollected && !isHovered}
                />
                <div className={styles.slotInfo}>
                  {isCollected ? (
                    <>
                      <span className={styles.catName}>{info.catName}</span>
                      <span className={styles.dayLabel}>Day {info.day}</span>
                    </>
                  ) : (
                    <span className={styles.uncollectedLabel}>???</span>
                  )}
                </div>
                <div className={styles.traitList}>
                  <span className={phenotype.size === 'small' ? styles.rareTrait : ''}>
                    {phenotype.size}
                  </span>
                  <span className={phenotype.earShape === 'folded' ? styles.rareTrait : ''}>
                    {phenotype.earShape}
                  </span>
                  <span className={phenotype.tailLength === 'short' ? styles.rareTrait : ''}>
                    {phenotype.tailLength} tail
                  </span>
                  <span className={phenotype.tailColor === 'white' ? styles.rareTrait : ''}>
                    {phenotype.tailColor} fur
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TraitCollection;
