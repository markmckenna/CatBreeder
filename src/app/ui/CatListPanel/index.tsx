/**
 * CatListPanel - View all owned cats in a scrollable list.
 */

import type { Cat } from '../../cats/genetics.ts';
import CatSprite from '../CatSprite';
import styles from './styles.css';

interface CatListPanelProps {
  cats: Cat[];
  onSelectCat: (cat: Cat) => void;
  onToggleFavourite?: (catId: string) => void;
  onClose: () => void;
}

function CatListPanel({ cats, onSelectCat, onToggleFavourite, onClose }: CatListPanelProps) {
  const handleCatClick = (cat: Cat) => {
    onSelectCat(cat);
    onClose();
  };

  const handleStarClick = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    onToggleFavourite?.(catId);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Cats</h2>
          <span className={styles.catCount}>{cats.length} cats</span>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        {cats.length === 0 ? (
          <div className={styles.emptyMessage}>
            You don&apos;t have any cats yet. Visit the market to buy some!
          </div>
        ) : (
          <div className={styles.catGrid}>
            {cats.map(cat => (
              <div 
                key={cat.id} 
                className={styles.catCard}
                onClick={() => handleCatClick(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCatClick(cat)}
                aria-label={`Select ${cat.name}`}
              >
                {onToggleFavourite && (
                  <button
                    className={`${styles.starButton} ${cat.favourite ? styles.starActive : ''}`}
                    onClick={(e) => handleStarClick(e, cat.id)}
                    title={cat.favourite ? 'Remove from favourites' : 'Add to favourites'}
                    aria-label={cat.favourite ? `Remove ${cat.name} from favourites` : `Add ${cat.name} to favourites`}
                  >
                    {cat.favourite ? '⭐' : '☆'}
                  </button>
                )}
                <div className={styles.catPreview}>
                  <CatSprite cat={cat} />
                </div>
                <div className={styles.catInfo}>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catTraits}>
                    {cat.phenotype.size}, {cat.phenotype.tailLength} tail
                  </span>
                  <span className={styles.catTraits}>
                    {cat.phenotype.earShape} ears, {cat.phenotype.tailColor} fur
                  </span>
                  <span className={styles.catAge}>Age: {cat.age} weeks</span>
                  <span className={styles.catHappiness}>
                    Happiness: {cat.happiness}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatListPanel;
