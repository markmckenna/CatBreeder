/**
 * Main Game UI - ties together all game systems.
 * Layout: 16:9 window with 4:3 room + sidebar
 */

import { useState, useMemo } from 'react';
import { useGame } from '../../game/GameContext.tsx';
import { ActionType } from '../../game/state.ts';
import Room from '../../environment/Room';
import CatSprite from '../CatSprite';
import TraitCollection from '../TraitCollection';
import MarketPanel from '../MarketPanel';
import ShopPanel from '../ShopPanel';
import CatListPanel from '../CatListPanel';
import { calculateCatValue, createMarketState, getValueBreakdown } from '../../economy/market.ts';
import type { MarketCat } from '../../economy/market.ts';
import { getCollectionProgress } from '../../cats/collection.ts';
import { calculateCapacity, FurnitureItemType } from '../../environment/furniture.ts';
import { assignCatPositions, getFurniturePositions } from '../../environment/positions.ts';
import type { Cat } from '../../cats/genetics.ts';
import type { Selectable, CatSelection } from '../selection.ts';
import { isCatSelection, isFurnitureSelection, isSameSelectable } from '../selection.ts';
import styles from './styles.css';

/**
 * Get breeding prediction for an allele pair
 * Returns: 'pure' (homozygous recessive - breeds true)
 *          'carrier' (heterozygous - may pass dominant)
 *          'dominant' (homozygous dominant)
 */
function getBreedingStatus(alleles: [string, string]): 'pure' | 'carrier' | 'dominant' {
  const [a, b] = alleles;
  const isLower = (s: string) => s === s.toLowerCase();
  
  if (isLower(a) && isLower(b)) return 'pure';      // e.g., 'ss' - both recessive
  if (isLower(a) || isLower(b)) return 'carrier';   // e.g., 'Ss' - one of each
  return 'dominant';                                 // e.g., 'SS' - both dominant
}

function GameUI() {
  const { state, dispatch, endTurn, lastTurnResult } = useGame();
  
  // Unified selection: hovered is transient, selected is sticky
  const [hovered, setHovered] = useState<Selectable | null>(null);
  const [selected, setSelected] = useState<Selectable | null>(null);
  
  const [breedingFirstCat, setBreedingFirstCat] = useState<Cat | null>(null);
  const [mode, setMode] = useState<'view' | 'breed-select'>('view');
  const [showCollection, setShowCollection] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showCatList, setShowCatList] = useState(false);

  const market = useMemo(() => createMarketState(), []);
  const catPositions = useMemo(
    () => assignCatPositions(state.cats.map(c => c.id), state.furniture),
    [state.cats, state.furniture]
  );
  const furniturePositions = useMemo(
    () => getFurniturePositions(catPositions, state.furniture),
    [catPositions, state.furniture]
  );
  const collectionProgress = getCollectionProgress(state.traitCollection);

  // Helper to get the selected cat (if selection is a cat)
  const selectedCat = isCatSelection(selected) ? selected.cat : null;
  const selectedFurniture = isFurnitureSelection(selected) ? selected : null;

  // Unified click handler for any selectable
  const handleSelect = (item: Selectable) => {
    if (mode === 'breed-select' && isCatSelection(item)) {
      // Selecting second cat for breeding
      if (breedingFirstCat && item.cat.id !== breedingFirstCat.id) {
        dispatch({
          type: ActionType.ADD_BREEDING_PAIR,
          parent1Id: breedingFirstCat.id,
          parent2Id: item.cat.id,
        });
        setBreedingFirstCat(null);
        setSelected(null);
        setMode('view');
      }
    } else {
      // Toggle selection: click same item to deselect, different to select
      setSelected(isSameSelectable(selected, item) ? null : item);
    }
  };

  const handleCatClick = (cat: Cat) => {
    handleSelect({ type: 'cat', cat });
  };

  const handleBreedClick = () => {
    if (selectedCat) {
      setBreedingFirstCat(selectedCat);
      setMode('breed-select');
    }
  };

  const handleSellCatClick = () => {
    if (selectedCat) {
      dispatch({
        type: ActionType.LIST_FOR_SALE,
        catId: selectedCat.id,
      });
      setSelected(null);
    }
  };

  const handleToggleFavourite = () => {
    if (selectedCat) {
      dispatch({
        type: ActionType.TOGGLE_FAVOURITE,
        catId: selectedCat.id,
      });
    }
  };

  const handleSellFurnitureClick = () => {
    if (selectedFurniture) {
      dispatch({
        type: ActionType.SELL_FURNITURE,
        itemType: selectedFurniture.furnitureType,
      });
      setSelected(null);
    }
  };

  const handleBuyCat = (marketCat: MarketCat) => {
    dispatch({
      type: ActionType.BUY_CAT,
      cat: marketCat.cat,
      price: marketCat.price,
    });
  };

  const handleBuyFurniture = (itemType: FurnitureItemType) => {
    dispatch({
      type: ActionType.BUY_FURNITURE,
      itemType,
    });
  };

  const handleSellFurniture = (itemType: FurnitureItemType) => {
    dispatch({
      type: ActionType.SELL_FURNITURE,
      itemType,
    });
  };

  const handleEndTurn = () => {
    endTurn();
    setSelected(null);
    setBreedingFirstCat(null);
    setMode('view');
  };

  const cancelBreedSelect = () => {
    setBreedingFirstCat(null);
    setMode('view');
  };

  // Calculate money earned from last turn
  const moneyEarned = lastTurnResult?.sales.reduce((sum, s) => sum + s.price, 0) ?? 0;

  // Get selected cat's market value
  const selectedCatValue = selectedCat ? calculateCatValue(selectedCat, market) : 0;
  const selectedCatBreakdown = selectedCat ? getValueBreakdown(selectedCat, market) : [];

  // Check if selected cat can be used for breeding (not already in a pair)
  const isInBreedingPair = selectedCat && state.breedingPairs.some(
    pair => pair.parent1Id === selectedCat.id || pair.parent2Id === selectedCat.id
  );
  const isForSale = selectedCat && state.catsForSale.includes(selectedCat.id);
  const isFavourite = selectedCat?.favourite ?? false;

  return (
    <div className={styles.gameWindow}>
      {/* 4:3 Room Viewport */}
      <div className={styles.roomViewport}>
        <div className={styles.roomContainer}>
          <div className={styles.roomInner}>
            <Room 
              furniture={state.furniture} 
              furniturePositions={furniturePositions}
              selectedFurniture={selectedFurniture}
              onFurnitureClick={handleSelect}
              onFurnitureHover={setHovered}
            >
              {mode === 'breed-select' && (
                <div className={styles.modeHint}>
                  💕 Select a mate for {breedingFirstCat?.name}
                </div>
              )}
              {/* Cats positioned on the floor */}
              <div className={styles.catArea}>
                {state.cats.map((cat) => {
                  const pos = catPositions.find(p => p.catId === cat.id);
                  const isBreedingFirst = breedingFirstCat?.id === cat.id;
                  const isSelected = selectedCat?.id === cat.id;
                  const catSelection: CatSelection = { type: 'cat', cat };
                  return (
                    <div
                      key={cat.id}
                      className={styles.catPosition}
                      style={{
                        left: `${pos?.x ?? 50}%`,
                        top: `${pos?.y ?? 70}%`,
                      }}
                    >
                      <CatSprite
                        cat={cat}
                        onClick={() => handleCatClick(cat)}
                        selected={isSelected || isBreedingFirst}
                        onMouseEnter={() => setHovered(catSelection)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    </div>
                  );
                })}
              </div>
            </Room>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>🐱 Cat Breeder</h1>
          <div className={styles.dayLabel}>Week {state.day}</div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statTile}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statValue}>${state.money}</div>
            <div className={styles.statLabel}>Money</div>
          </div>
          <div 
            className={`${styles.statTile} ${styles.clickable}`}
            onClick={() => setShowCatList(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowCatList(true)}
          >
            <div className={styles.statIcon}>🐱</div>
            <div className={styles.statValue}>{state.cats.length}</div>
            <div className={styles.statLabel}>Cats</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statIcon}>💕</div>
            <div className={styles.statValue}>{state.breedingPairs.length}</div>
            <div className={styles.statLabel}>Breeding</div>
          </div>
          <div 
            className={`${styles.statTile} ${styles.clickable}`}
            onClick={() => setShowCollection(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowCollection(true)}
          >
            <div className={styles.statIcon}>🎨</div>
            <div className={styles.statValue}>{collectionProgress.collected}/16</div>
            <div className={styles.statLabel}>Collection</div>
          </div>
          <div 
            className={`${styles.statTile} ${styles.clickable}`}
            onClick={() => setShowMarket(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowMarket(true)}
          >
            <div className={styles.statIcon}>🏪</div>
            <div className={styles.statValue}>{state.marketInventory.length}</div>
            <div className={styles.statLabel}>Market</div>
          </div>
          <div 
            className={`${styles.statTile} ${styles.clickable}`}
            onClick={() => setShowShop(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowShop(true)}
          >
            <div className={styles.statIcon}>🛋️</div>
            <div className={styles.statValue}>{state.cats.length}/{calculateCapacity(state.furniture)}</div>
            <div className={styles.statLabel}>Capacity</div>
          </div>
        </div>

        {/* Info Panels */}
        <div className={styles.infoPanel}>
          {/* Hover Info Panel - shows transient info when hovering (but not if something is selected) */}
          {hovered && !selected && (
            <div className={`${styles.panelSection} ${styles.hoverInfoPanel}`}>
              {isCatSelection(hovered) && (
                <>
                  <div className={styles.panelTitle}>🐱 {hovered.cat.name}</div>
                  <div className={styles.hoverDetails}>
                    <div>{hovered.cat.age} weeks old</div>
                    <div>Size: {hovered.cat.phenotype.size}</div>
                    <div>Tail: {hovered.cat.phenotype.tailLength} {hovered.cat.phenotype.tailColor}</div>
                    <div>Ears: {hovered.cat.phenotype.earShape}</div>
                  </div>
                  <div className={styles.hoverHint}>Click to select</div>
                </>
              )}
              {isFurnitureSelection(hovered) && (
                <>
                  <div className={styles.panelTitle}>🛋️ {hovered.item.name}</div>
                  <div className={styles.hoverDetails}>
                    <div>+{hovered.item.capacityBonus} capacity</div>
                    <div>Sell value: ${Math.floor(hovered.item.price * 0.5)}</div>
                  </div>
                  <div className={styles.hoverHint}>Click to select</div>
                </>
              )}
            </div>
          )}

          {/* Turn Results - shown first when available to reduce sidebar flicker */}
          {lastTurnResult && (lastTurnResult.births.length > 0 || lastTurnResult.sales.length > 0 || lastTurnResult.foodCost > 0) && (
            <div className={`${styles.panelSection} ${styles.turnResult}`}>
              <div className={`${styles.panelTitle} ${styles.turnResultTitle}`}>
                📋 Last Week
              </div>
              <div className={styles.panelContent}>
                {lastTurnResult.births.length > 0 && (
                  <div>🐣 Born: {lastTurnResult.births.map(c => c.name).join(', ')}</div>
                )}
                {lastTurnResult.sales.length > 0 && (
                  <div>💰 Sold: {lastTurnResult.sales.map(s => `${s.cat.name} ($${s.price})`).join(', ')}</div>
                )}
                {moneyEarned > 0 && (
                  <div>📈 Earned: ${moneyEarned}</div>
                )}
                {lastTurnResult.foodCost > 0 && (
                  <div>🍽️ Expenses: ${lastTurnResult.foodCost}</div>
                )}
              </div>
            </div>
          )}

          {/* Selected Cat Info Panel */}
          {selectedCat && mode === 'view' && (
            <div className={`${styles.panelSection} ${styles.catInfoPanel}`}>
              <div className={styles.panelTitle}>
                🐱 {selectedCat.name}
              </div>
              <div className={styles.catDetails}>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Age</span>
                  <span className={styles.traitValue}>{selectedCat.age} weeks</span>
                </div>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Size</span>
                  <span className={styles.traitValue}>{selectedCat.phenotype.size}</span>
                </div>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Tail</span>
                  <span className={styles.traitValue}>{selectedCat.phenotype.tailLength}</span>
                </div>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Ears</span>
                  <span className={styles.traitValue}>{selectedCat.phenotype.earShape}</span>
                </div>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Fur</span>
                  <span className={styles.traitValue}>{selectedCat.phenotype.tailColor}</span>
                </div>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Happiness</span>
                  <span className={styles.traitValue}>{selectedCat.happiness}%</span>
                </div>
                
                <div className={styles.geneticsSection}>
                  <div className={styles.geneticsTitle}>Genetics</div>
                  <div className={styles.genotypeGrid}>
                    {[
                      { label: 'Size', alleles: selectedCat.genotype.size, recessive: 'small' },
                      { label: 'Tail', alleles: selectedCat.genotype.tailLength, recessive: 'short' },
                      { label: 'Ears', alleles: selectedCat.genotype.earShape, recessive: 'folded' },
                      { label: 'Fur', alleles: selectedCat.genotype.tailColor, recessive: 'white' },
                    ].map(({ label, alleles, recessive }) => {
                      const status = getBreedingStatus(alleles as [string, string]);
                      return (
                        <span
                          key={label}
                          className={`${styles.genotypeItem} ${styles[`genotype${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}
                          title={
                            status === 'pure'
                              ? `✓ Will always breed ${recessive}`
                              : status === 'carrier'
                              ? `⚠ May pass dominant gene`
                              : `✗ Cannot breed ${recessive}`
                          }
                        >
                          {status === 'pure' && '✓ '}
                          {status === 'carrier' && '⚠ '}
                          {label}: {alleles.join('')}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.valueSection}>
                  <div className={styles.valueTitle}>Est. Market Value</div>
                  <div className={styles.valueAmount}>${selectedCatValue}</div>
                  {selectedCatBreakdown.length > 0 && (
                    <div className={styles.valueBreakdown}>
                      {selectedCatBreakdown.map((item, i) => (
                        <span key={i} className={styles.valueTrait}>
                          +{item.trait} ({item.multiplier}x)
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Per-cat actions */}
                <div className={styles.catActions}>
                  <button
                    className={isFavourite ? styles.buttonPrimary : styles.buttonSecondary}
                    onClick={handleToggleFavourite}
                    title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    {isFavourite ? '⭐' : '☆'}
                  </button>
                  <button
                    className={styles.buttonPrimary}
                    onClick={handleBreedClick}
                    disabled={!!isInBreedingPair || state.cats.length < 2}
                  >
                    💕 Breed
                  </button>
                  <button
                    className={styles.buttonSecondary}
                    onClick={handleSellCatClick}
                    disabled={!!isForSale || isFavourite}
                    title={isFavourite ? 'Remove from favourites to sell' : ''}
                  >
                    🏷️ {isForSale ? 'Listed' : 'Sell'}
                  </button>
                </div>
                {isInBreedingPair && (
                  <div className={styles.catStatus}>Already in breeding queue</div>
                )}
                {isForSale && (
                  <div className={styles.catStatus}>Listed for sale</div>
                )}
              </div>
            </div>
          )}

          {/* Selected Furniture Info Panel */}
          {selectedFurniture && mode === 'view' && (
            <div className={`${styles.panelSection} ${styles.furnitureInfoPanel}`}>
              <div className={styles.panelTitle}>
                🛋️ {selectedFurniture.item.name}
              </div>
              <div className={styles.catDetails}>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Type</span>
                  <span className={styles.traitValue}>{selectedFurniture.furnitureType}</span>
                </div>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Capacity</span>
                  <span className={styles.traitValue}>+{selectedFurniture.item.capacityBonus}</span>
                </div>
                <div className={styles.traitRow}>
                  <span className={styles.traitLabel}>Original Price</span>
                  <span className={styles.traitValue}>${selectedFurniture.item.price}</span>
                </div>

                <div className={styles.valueSection}>
                  <div className={styles.valueTitle}>Sell Value</div>
                  <div className={styles.valueAmount}>${Math.floor(selectedFurniture.item.price * 0.5)}</div>
                  <div className={styles.valueBreakdown}>
                    <span className={styles.valueTrait}>50% of original price</span>
                  </div>
                </div>

                {/* Furniture actions */}
                <div className={styles.catActions}>
                  <button
                    className={styles.buttonSecondary}
                    onClick={handleSellFurnitureClick}
                  >
                    💰 Sell for ${Math.floor(selectedFurniture.item.price * 0.5)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Breed Select Mode Panel */}
          {mode === 'breed-select' && breedingFirstCat && (
            <div className={`${styles.panelSection} ${styles.breedingPanel}`}>
              <div className={styles.panelTitle}>
                💕 Select Mate
              </div>
              <div className={styles.breedingInfo}>
                <div>Breeding: <strong>{breedingFirstCat.name}</strong></div>
                <div className={styles.breedingHint}>Click another cat to pair</div>
              </div>
              <button className={styles.buttonSecondary} onClick={cancelBreedSelect}>
                ✕ Cancel
              </button>
            </div>
          )}

          {/* Breeding Queue */}
          {state.breedingPairs.length > 0 && (
            <div className={styles.panelSection}>
              <div className={styles.panelTitle}>
                💕 Breeding Queue
              </div>
              <div className={styles.panelContent}>
                {state.breedingPairs.map((pair, i) => {
                  const cat1 = state.cats.find(c => c.id === pair.parent1Id);
                  const cat2 = state.cats.find(c => c.id === pair.parent2Id);
                  return (
                    <div key={i}>
                      {cat1?.name} ❤️ {cat2?.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* For Sale List */}
          {state.catsForSale.length > 0 && (
            <div className={styles.panelSection}>
              <div className={styles.panelTitle}>
                🏷️ Listed for Sale
              </div>
              <div className={styles.panelContent}>
                {state.catsForSale.map((catId) => {
                  const cat = state.cats.find(c => c.id === catId);
                  return <div key={catId}>{cat?.name}</div>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* End Turn Button - always visible */}
        <div className={styles.actions}>
          <button className={styles.buttonDanger} onClick={handleEndTurn}>
            ⏭️ End Turn
          </button>
        </div>
      </div>

      {/* Trait Collection Modal */}
      {showCollection && (
        <TraitCollection
          collection={state.traitCollection}
          onClose={() => setShowCollection(false)}
        />
      )}

      {/* Market Panel Modal */}
      {showMarket && (
        <MarketPanel
          inventory={state.marketInventory}
          playerMoney={state.money}
          onBuy={handleBuyCat}
          onClose={() => setShowMarket(false)}
        />
      )}

      {/* Shop Panel Modal */}
      {showShop && (
        <ShopPanel
          furniture={state.furniture}
          money={state.money}
          catCount={state.cats.length}
          onBuy={handleBuyFurniture}
          onSell={handleSellFurniture}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* Cat List Panel Modal */}
      {showCatList && (
        <CatListPanel
          cats={state.cats}
          onSelectCat={(cat) => {
            setSelected({ type: 'cat', cat });
            setShowCatList(false);
          }}
          onToggleFavourite={(catId) => {
            dispatch({ type: ActionType.TOGGLE_FAVOURITE, catId });
          }}
          onClose={() => setShowCatList(false)}
        />
      )}
    </div>
  );
}

export default GameUI;
