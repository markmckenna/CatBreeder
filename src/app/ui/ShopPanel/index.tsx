/**
 * ShopPanel - UI for purchasing and selling furniture items.
 * Shows available items with prices and allows purchase/sale.
 */

import { SHOP_ITEMS, FurnitureItemType, OwnedFurniture, calculateCapacity } from '../../logic/environment';
import { formatMoney } from '../format.ts';
import styles from './styles.css';

interface ShopPanelProps {
  furniture: OwnedFurniture;
  money: number;
  catCount: number;
  onBuy: (itemType: FurnitureItemType) => void;
  onSell: (itemType: FurnitureItemType) => void;
  onClose: () => void;
}

function getOwnedCount(furniture: OwnedFurniture, itemType: FurnitureItemType): number {
  if (itemType === 'toy') return furniture.toys;
  if (itemType === 'bed') return furniture.beds;
  if (itemType === 'catTree') return furniture.catTrees;
  return 0;
}

function ShopPanel({ furniture, money, catCount, onBuy, onSell, onClose }: ShopPanelProps) {
  const capacity = calculateCapacity(furniture);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Furniture Shop</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.capacityCard}>
          <div className={styles.capacityLabel}>Current Capacity</div>
          <div className={styles.capacityValue}>
            {catCount} / {capacity} cats
          </div>
          <div className={styles.capacityDetails}>
            {furniture.toys} toys, {furniture.beds} beds
          </div>
        </div>

        <div className={styles.itemList}>
          {(Object.keys(SHOP_ITEMS) as FurnitureItemType[]).map((itemType) => {
            const item = SHOP_ITEMS[itemType];
            const canAfford = money >= item.price;
            const owned = getOwnedCount(furniture, itemType);
            const sellPrice = Math.floor(item.price * 0.5);

            return (
              <div 
                key={itemType}
                className={canAfford ? styles.itemAffordable : styles.itemUnaffordable}
              >
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDetails}>
                    +{item.capacityBonus} capacity • Owned: {owned}
                  </div>
                </div>
                <div className={styles.itemActions}>
                  {owned > 0 && (
                    <button onClick={() => onSell(itemType)} className={styles.sellButton}>
                      Sell {formatMoney(sellPrice)}
                    </button>
                  )}
                  <button
                    onClick={() => onBuy(itemType)}
                    disabled={!canAfford}
                    className={canAfford ? styles.buyButtonAffordable : styles.buyButtonDisabled}
                  >
                    Buy {formatMoney(item.price)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ShopPanel;
