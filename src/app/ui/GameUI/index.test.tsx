/**
 * Tests for GameUI component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from '../../game/GameContext.tsx';
import GameUI from '.';

function renderGameUI() {
  return render(
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}

describe('GameUI', () => {
  it('renders header with title', () => {
    renderGameUI();
    expect(screen.getByText(/Cat Breeder/)).toBeInTheDocument();
  });

  it('displays day counter starting at 1', () => {
    renderGameUI();
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays starting money', () => {
    renderGameUI();
    expect(screen.getByText('Money')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('displays cat count', () => {
    renderGameUI();
    expect(screen.getByText('Cats')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Initial cats
  });

  it('renders breed button', () => {
    renderGameUI();
    expect(screen.getByText(/Breed Cats/)).toBeInTheDocument();
  });

  it('renders sell button', () => {
    renderGameUI();
    expect(screen.getByText(/Sell Cat/)).toBeInTheDocument();
  });

  it('renders end turn button', () => {
    renderGameUI();
    expect(screen.getByText(/End Turn/)).toBeInTheDocument();
  });

  it('shows breeding panel when breed mode is active', () => {
    renderGameUI();
    
    fireEvent.click(screen.getByText(/Breed Cats/));
    
    expect(screen.getByText('Select Breeding Pair')).toBeInTheDocument();
    expect(screen.getByText('Confirm Breeding')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('can cancel breeding mode', () => {
    renderGameUI();
    
    fireEvent.click(screen.getByText(/Breed Cats/));
    expect(screen.getByText('Select Breeding Pair')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Select Breeding Pair')).not.toBeInTheDocument();
  });

  it('advances day when end turn is clicked', () => {
    renderGameUI();
    
    // Day starts at 1
    expect(screen.getByText('1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/End Turn/));
    
    // Day should now be 2 (look next to "Day" label)
    const dayLabel = screen.getByText('Day');
    const dayContainer = dayLabel.parentElement;
    expect(dayContainer?.textContent).toContain('2');
  });

  it('renders room component', () => {
    renderGameUI();
    expect(screen.getByTestId('room')).toBeInTheDocument();
  });

  it('renders cat sprites for initial cats', () => {
    renderGameUI();
    // Should have 2 initial cats, each with a test id starting with "cat-sprite-"
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    expect(catSprites.length).toBe(2);
  });
});
