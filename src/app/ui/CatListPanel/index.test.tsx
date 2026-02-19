/**
 * Tests for CatListPanel component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CatListPanel from '.';
import type { Cat } from '../../cats/genetics.ts';

// Test helper to create mock cats
function createMockCat(overrides: Partial<Cat> = {}): Cat {
  return {
    id: 'test-cat-1',
    name: 'Whiskers',
    age: 10,
    happiness: 80,
    genotype: {
      size: 'LL',
      tailLength: 'TT',
      earShape: 'EE',
      tailColor: 'CC',
    },
    phenotype: {
      size: 'large',
      tailLength: 'long',
      earShape: 'pointed',
      tailColor: 'orange',
    },
    ...overrides,
  };
}

describe('CatListPanel', () => {
  it('renders panel with title', () => {
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText('Your Cats')).toBeInTheDocument();
  });

  it('displays cat count', () => {
    render(
      <CatListPanel 
        cats={[createMockCat(), createMockCat({ id: 'cat-2', name: 'Fluffy' })]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText('2 cats')).toBeInTheDocument();
  });

  it('shows empty message when no cats', () => {
    render(
      <CatListPanel 
        cats={[]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText(/don't have any cats/i)).toBeInTheDocument();
  });

  it('displays cat names and traits', () => {
    render(
      <CatListPanel 
        cats={[createMockCat({ name: 'Mittens' })]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getAllByText('Mittens')).toHaveLength(2); // Once in sprite, once in info
    expect(screen.getByText(/large, long tail/i)).toBeInTheDocument();
  });

  it('calls onSelectCat when cat card is clicked', () => {
    const onSelectCat = vi.fn();
    const cat = createMockCat();
    render(
      <CatListPanel 
        cats={[cat]} 
        onSelectCat={onSelectCat} 
        onClose={() => {}} 
      />
    );
    // Click on the cat card (with role="button")
    const catCard = screen.getByRole('button', { name: /Whiskers/i });
    fireEvent.click(catCard);
    expect(onSelectCat).toHaveBeenCalledWith(cat);
  });

  it('calls onClose when cat is selected', () => {
    const onClose = vi.fn();
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onClose={onClose} 
      />
    );
    const catCard = screen.getByRole('button', { name: /Whiskers/i });
    fireEvent.click(catCard);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onClose={onClose} 
      />
    );
    fireEvent.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });

  it('displays cat age and happiness', () => {
    render(
      <CatListPanel 
        cats={[createMockCat({ age: 5, happiness: 75 })]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText('Age: 5 weeks')).toBeInTheDocument();
    expect(screen.getByText('Happiness: 75%')).toBeInTheDocument();
  });
});
