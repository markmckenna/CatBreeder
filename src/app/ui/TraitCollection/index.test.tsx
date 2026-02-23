import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TraitCollection from './index.tsx';
import { createTraitCollection, registerBredCat } from '../../logic/cats/collection.ts';
import type { Cat, CatPhenotype } from '../../logic/cats/Cat.ts';
// Minimal test helper for Cat creation (inlined)
function createMockCatFromPhenotype(
  phenotype: CatPhenotype,
  name = 'TestCat',
  id = 'test-cat-1'
): Cat {
  return {
    id,
    name,
    genotype: {
      size: ['S', 'S'],
      tailLength: ['T', 'T'],
      earShape: ['E', 'E'],
      tailColor: ['O', 'O'],
    },
    phenotype,
    age: 100,
    happiness: 100,
  };
}

describe('TraitCollection', () => {
  it('renders the collection grid', () => {
    const collection = createTraitCollection();
    render(<TraitCollection collection={collection} />);
    
    expect(screen.getByText('🎨 Trait Collection')).toBeInTheDocument();
    expect(screen.getByText('0/16 (0%)')).toBeInTheDocument();
  });

  it('shows collected traits', () => {
    let collection = createTraitCollection();
    const phenotype: CatPhenotype = { size: 'small', tailLength: 'short', earShape: 'folded', tailColor: 'white' };
    const cat = createMockCatFromPhenotype(phenotype, 'Snowball', 'cat_1');
    
    const result = registerBredCat(collection, cat, 5);
    collection = result.collection;
    
    render(<TraitCollection collection={collection} />);
    
    expect(screen.getByText('1/16 (6%)')).toBeInTheDocument();
    expect(screen.getByText('Snowball')).toBeInTheDocument();
    expect(screen.getByText('Week 5')).toBeInTheDocument();
  });

  it('shows ??? for uncollected traits', () => {
    const collection = createTraitCollection();
    render(<TraitCollection collection={collection} />);
    
    // All 16 slots should show ???
    const uncollectedLabels = screen.getAllByText('???');
    expect(uncollectedLabels).toHaveLength(16);
  });

  it('calls onClose when close button clicked', () => {
    const collection = createTraitCollection();
    const onClose = vi.fn();
    
    render(<TraitCollection collection={collection} onClose={onClose} />);
    
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('highlights rare traits', () => {
    const collection = createTraitCollection();
    render(<TraitCollection collection={collection} />);
    
    // Rare traits should be present in the list (small, short, folded, white)
    expect(screen.getAllByText('small').length).toBeGreaterThan(0);
    expect(screen.getAllByText('folded').length).toBeGreaterThan(0);
  });

  it('tracks hover state on uncollected traits', () => {
    const collection = createTraitCollection();
    render(<TraitCollection collection={collection} />);
    
    // Find an uncollected slot by its label and hover via its parent
    const questionMarks = screen.getAllByText('???');
    expect(questionMarks.length).toBe(16);
    
    // Get the parent element that has onMouseEnter/onMouseLeave
    const slotParent = questionMarks[0].parentElement?.parentElement;
    if (slotParent) {
      fireEvent.mouseEnter(slotParent);
      fireEvent.mouseLeave(slotParent);
    }
    
    // Component should handle hover state without errors
    expect(screen.getAllByText('???').length).toBeGreaterThan(0);
  });
});
