/**
 * MarketPanel - Browse and purchase cats from the daily market.
 */

import type { MarketCat } from '../../economy/market.ts';
import { formatMoney } from '../../economy/market.ts';
import CatSprite from '../../cats/CatSprite';
import styles from './styles.css';

interface MarketPanelProps {
  inventory: MarketCat[];
  playerMoney: number;
  onBuy: (cat: MarketCat) => void;
  onClose: () => void;
}

function MarketPanel({ inventory, playerMoney, onBuy, onClose }: MarketPanelProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Cat Market</h2>
          <span className={styles.balance}>Your balance: {formatMoney(playerMoney)}</span>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <p className={styles.description}>
          3 new cats available each day. Prices include 20% market premium.
        </p>
        
        {inventory.length === 0 ? (
          <div className={styles.emptyMessage}>
            No cats available today. Come back tomorrow!
          </div>
        ) : (
          <div className={styles.catGrid}>
            {inventory.map(({ cat, price }) => {
              const canAfford = playerMoney >= price;
              return (
                <div key={cat.id} className={styles.catCard}>
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
                    <span className={styles.catAge}>Age: {cat.age} days</span>
                  </div>
                  <div className={styles.priceSection}>
                    <span className={styles.price}>{formatMoney(price)}</span>
                    <button
                      className={`${styles.buyButton} ${!canAfford ? styles.disabled : ''}`}
                      onClick={() => canAfford && onBuy({ cat, price })}
                      disabled={!canAfford}
                    >
                      {canAfford ? 'Buy' : 'Too expensive'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketPanel;
