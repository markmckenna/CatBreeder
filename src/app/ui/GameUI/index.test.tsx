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
    expect(screen.getByText('Day 1')).toBeInTheDocument();
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

  it('renders end turn button', () => {
    renderGameUI();
    expect(screen.getByText(/End Turn/)).toBeInTheDocument();
  });

  it('advances day when end turn is clicked', () => {
    renderGameUI();
    
    // Day starts at 1
    expect(screen.getByText('Day 1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/End Turn/));
    
    // Day should now be 2
    expect(screen.getByText('Day 2')).toBeInTheDocument();
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

  it('shows hint to click a cat when nothing selected', () => {
    renderGameUI();
    expect(screen.getByText(/Click a cat to view info/)).toBeInTheDocument();
  });

  it('shows cat info panel when cat is clicked', () => {
    renderGameUI();
    
    // Click the first cat
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    fireEvent.click(catSprites[0]);
    
    // Should show info panel with breed and sell buttons
    expect(screen.getByRole('button', { name: /Breed/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sell/ })).toBeInTheDocument();
    // Should show market value section
    expect(screen.getByText(/Est. Market Value/)).toBeInTheDocument();
  });

  it('shows genetics info for selected cat', () => {
    renderGameUI();
    
    // Click the first cat
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    fireEvent.click(catSprites[0]);
    
    // Should show genetics section
    expect(screen.getByText('Genetics')).toBeInTheDocument();
  });

  it('enters breed select mode when clicking Breed on a cat', () => {
    renderGameUI();
    
    // Click the first cat
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    fireEvent.click(catSprites[0]);
    
    // Click breed button
    fireEvent.click(screen.getByRole('button', { name: /Breed/ }));
    
    // Should show breed select hint
    expect(screen.getByText(/Select a mate/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
  });

  it('can cancel breed select mode', () => {
    renderGameUI();
    
    // Click the first cat
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    fireEvent.click(catSprites[0]);
    
    // Click breed button
    fireEvent.click(screen.getByRole('button', { name: /Breed/ }));
    expect(screen.getByText(/Select a mate/)).toBeInTheDocument();
    
    // Cancel
    fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    expect(screen.queryByText(/Select a mate/)).not.toBeInTheDocument();
  });
});
