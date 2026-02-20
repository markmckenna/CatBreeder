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

  it('displays week counter starting at 1', () => {
    renderGameUI();
    expect(screen.getByText('Week 1')).toBeInTheDocument();
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

  it('advances week when end turn is clicked', () => {
    renderGameUI();
    
    // Week starts at 1
    expect(screen.getByText('Week 1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/End Turn/));
    
    // Week should now be 2
    expect(screen.getByText('Week 2')).toBeInTheDocument();
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

  it('does not show cat info panel when nothing selected', () => {
    renderGameUI();
    // Cat info panel should not be visible initially
    expect(screen.queryByText(/Est. Market Value/)).not.toBeInTheDocument();
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

  it('lists cat for sale when sell button clicked', () => {
    renderGameUI();
    
    // Click the first cat
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    fireEvent.click(catSprites[0]);
    
    // Click sell button - cat should be deselected after listing
    fireEvent.click(screen.getByRole('button', { name: /Sell/ }));
    
    // The cat should now appear in the pending actions shown in sidebar
    // The "Listed for Sale" section should appear with at least one cat
    expect(screen.getByText('🏷️ Listed for Sale')).toBeInTheDocument();
  });

  it('opens cat list panel when clicking cat stat tile', () => {
    renderGameUI();
    
    // Find the cats stat tile and click it
    const catsTile = screen.getByText('Cats').closest('[role="button"]');
    expect(catsTile).toBeInTheDocument();
    fireEvent.click(catsTile!);
    
    // Cat list panel should be visible
    expect(screen.getByText('Your Cats')).toBeInTheDocument();
  });

  it('opens trait collection when clicking collection tile', () => {
    renderGameUI();
    
    // Find the collection stat tile and click it
    const collectionTile = screen.getByText('Collection').closest('[role="button"]');
    expect(collectionTile).toBeInTheDocument();
    fireEvent.click(collectionTile!);
    
    // Collection panel should be visible
    expect(screen.getByText('🎨 Trait Collection')).toBeInTheDocument();
  });

  it('opens market panel when clicking Market tile', () => {
    renderGameUI();
    
    // Find the market stat tile and click it
    const marketTile = screen.getByText('Market').closest('[role="button"]');
    expect(marketTile).toBeInTheDocument();
    fireEvent.click(marketTile!);
    
    // Market panel should be visible
    expect(screen.getByText('Cat Market')).toBeInTheDocument();
  });

  it('opens shop panel when clicking Capacity tile', () => {
    renderGameUI();
    
    // Find the capacity stat tile and click it - this opens the shop
    const capacityTile = screen.getByText('Capacity').closest('[role="button"]');
    expect(capacityTile).toBeInTheDocument();
    fireEvent.click(capacityTile!);
    
    // Shop panel should be visible
    expect(screen.getByText('Furniture Shop')).toBeInTheDocument();
  });

  it('can breed two cats and see pending pair count', () => {
    renderGameUI();
    
    // Click the first cat
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    fireEvent.click(catSprites[0]);
    
    // Click breed button to enter breed select mode
    fireEvent.click(screen.getByRole('button', { name: /Breed/ }));
    
    // Click the second cat to complete breeding pair
    fireEvent.click(catSprites[1]);
    
    // Should show 1 breeding pair in stats
    expect(screen.getByText('Breeding')).toBeInTheDocument();
    const breedingValue = screen.getByText('1');
    expect(breedingValue).toBeInTheDocument();
  });

  it('handles hover on cats', () => {
    renderGameUI();
    
    // Hover over the first cat
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    fireEvent.mouseEnter(catSprites[0]);
    fireEvent.mouseLeave(catSprites[0]);
    
    // No crash should occur
    expect(catSprites[0]).toBeInTheDocument();
  });
});
