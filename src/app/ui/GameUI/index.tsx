/**
 * Main Game UI - ties together all game systems.
 */

import { useState } from 'react';
import { useGame } from '../../game/GameContext.tsx';
import Room from '../../environment/Room';
import CatSprite from '../../cats/CatSprite';
import { getAvailableForBreeding } from '../../game/state.ts';
import type { Cat } from '../../cats/genetics.ts';
import styles from './styles.css';

function GameUI() {
  const { state, dispatch, endTurn, lastTurnResult } = useGame();
  const [selectedCat1, setSelectedCat1] = useState<Cat | null>(null);
  const [selectedCat2, setSelectedCat2] = useState<Cat | null>(null);
  const [mode, setMode] = useState<'view' | 'breed' | 'sell'>('view');

  const availableCats = getAvailableForBreeding(state);

  const handleCatClick = (cat: Cat) => {
    if (mode === 'breed') {
      if (!selectedCat1) {
        setSelectedCat1(cat);
      } else if (!selectedCat2 && cat.id !== selectedCat1.id) {
        setSelectedCat2(cat);
      } else if (cat.id === selectedCat1.id) {
        setSelectedCat1(null);
      } else if (cat.id === selectedCat2?.id) {
        setSelectedCat2(null);
      }
    } else if (mode === 'sell') {
      dispatch({
        type: 'LIST_FOR_SALE',
        catId: cat.id,
      });
      setMode('view');
    }
  };

  const handleBreed = () => {
    if (selectedCat1 && selectedCat2) {
      dispatch({
        type: 'ADD_BREEDING_PAIR',
        parent1Id: selectedCat1.id,
        parent2Id: selectedCat2.id,
      });
      setSelectedCat1(null);
      setSelectedCat2(null);
      setMode('view');
    }
  };

  const handleEndTurn = () => {
    endTurn();
    setMode('view');
    setSelectedCat1(null);
    setSelectedCat2(null);
  };

  const cancelMode = () => {
    setMode('view');
    setSelectedCat1(null);
    setSelectedCat2(null);
  };

  // Calculate money earned from last turn
  const moneyEarned = lastTurnResult?.sales.reduce((sum, s) => sum + s.price, 0) ?? 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>🐱 Cat Breeder</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Day</span>
            <span className={styles.statValue}>{state.day}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Money</span>
            <span className={styles.statValue}>${state.money}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Cats</span>
            <span className={styles.statValue}>{state.cats.length}</span>
          </div>
        </div>
      </header>

      {/* Turn Results */}
      {lastTurnResult && (lastTurnResult.births.length > 0 || lastTurnResult.sales.length > 0) && (
        <div className={styles.turnResult}>
          <div className={styles.turnResultTitle}>Last Turn Results:</div>
          {lastTurnResult.births.length > 0 && (
            <div>🐣 New kittens born: {lastTurnResult.births.map(c => c.name).join(', ')}</div>
          )}
          {lastTurnResult.sales.length > 0 && (
            <div>💰 Cats sold: {lastTurnResult.sales.map(s => `${s.cat.name} for $${s.price}`).join(', ')}</div>
          )}
          {moneyEarned > 0 && (
            <div>📈 Total earned: ${moneyEarned}</div>
          )}
        </div>
      )}

      {/* Breeding Panel */}
      {mode === 'breed' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Select Breeding Pair</h2>
          <div className={styles.breedingPanel}>
            <div className={selectedCat1 ? styles.catSelectionActive : styles.catSelection}>
              {selectedCat1 ? (
                <CatSprite cat={selectedCat1} selected />
              ) : (
                <span className={styles.placeholder}>Select first cat</span>
              )}
            </div>
            <span className={styles.heartIcon}>❤️</span>
            <div className={selectedCat2 ? styles.catSelectionActive : styles.catSelection}>
              {selectedCat2 ? (
                <CatSprite cat={selectedCat2} selected />
              ) : (
                <span className={styles.placeholder}>Select second cat</span>
              )}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.buttonPrimary}
              onClick={handleBreed}
              disabled={!selectedCat1 || !selectedCat2}
            >
              Confirm Breeding
            </button>
            <button className={styles.buttonSecondary} onClick={cancelMode}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Queued Breeding Pairs */}
      {state.breedingPairs.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Breeding Queue ({state.breedingPairs.length})</h2>
          <div className={styles.infoText}>
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

      {/* Sale Listings */}
      {state.catsForSale.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>For Sale ({state.catsForSale.length})</h2>
          <div className={styles.infoText}>
            {state.catsForSale.map((catId) => {
              const cat = state.cats.find(c => c.id === catId);
              return (
                <div key={catId}>
                  {cat?.name} (listed for sale)
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cat Room */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Cats</h2>
        {mode === 'sell' && (
          <div className={styles.sellModeHint}>
            Click a cat to list it for sale
          </div>
        )}
        <Room>
          <div className={styles.catList}>
            {state.cats.map((cat) => (
              <CatSprite
                key={cat.id}
                cat={cat}
                onClick={mode !== 'view' ? () => handleCatClick(cat) : undefined}
                selected={cat.id === selectedCat1?.id || cat.id === selectedCat2?.id}
              />
            ))}
          </div>
        </Room>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {mode === 'view' && (
          <>
            <button
              className={styles.buttonPrimary}
              onClick={() => setMode('breed')}
              disabled={availableCats.length < 2}
            >
              🐱 Breed Cats
            </button>
            <button
              className={styles.buttonSecondary}
              onClick={() => setMode('sell')}
              disabled={state.cats.length === 0}
            >
              💰 Sell Cat
            </button>
            <button className={styles.buttonDanger} onClick={handleEndTurn}>
              ⏭️ End Turn
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default GameUI;
