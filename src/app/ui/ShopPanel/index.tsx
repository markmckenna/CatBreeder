/**
 * ShopPanel - UI for purchasing furniture items.
 * Shows available items with prices and allows purchase.
 */

import { SHOP_ITEMS, FurnitureItemType, OwnedFurniture, calculateCapacity } from '../../environment/furniture.ts';
import { formatMoney } from '../../economy/market.ts';

interface ShopPanelProps {
  furniture: OwnedFurniture;
  money: number;
  catCount: number;
  onBuy: (itemType: FurnitureItemType) => void;
  onClose: () => void;
}

function ShopPanel({ furniture, money, catCount, onBuy, onClose }: ShopPanelProps) {
  const capacity = calculateCapacity(furniture);

  return (
    <div 
      className="shop-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#5D4E37' }}>Furniture Shop</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ 
          backgroundColor: '#F5E6D3', 
          padding: '12px', 
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          <div style={{ fontWeight: 'bold', color: '#5D4E37' }}>Current Capacity</div>
          <div style={{ fontSize: '24px', color: '#8B7355' }}>
            {catCount} / {capacity} cats
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {furniture.toys} toys, {furniture.beds} beds
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(Object.keys(SHOP_ITEMS) as FurnitureItemType[]).map((itemType) => {
            const item = SHOP_ITEMS[itemType];
            const canAfford = money >= item.price;

            return (
              <div 
                key={itemType}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: canAfford ? '#E8F5E9' : '#F5F5F5',
                  borderRadius: '8px',
                  border: `1px solid ${canAfford ? '#A5D6A7' : '#E0E0E0'}`,
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    +{item.capacityBonus} capacity
                  </div>
                </div>
                <button
                  onClick={() => onBuy(itemType)}
                  disabled={!canAfford}
                  style={{
                    backgroundColor: canAfford ? '#4CAF50' : '#BDBDBD',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                  }}
                >
                  {formatMoney(item.price)}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ 
          marginTop: '16px', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '14px',
        }}>
          Your balance: <strong>{formatMoney(money)}</strong>
        </div>
      </div>
    </div>
  );
}

export default ShopPanel;
