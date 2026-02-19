/**
 * Tests for MarketPanel component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MarketPanel from './index.tsx';
import type { MarketCat } from '../../economy/market.ts';
import type { Cat } from '../../cats/genetics.ts';

const createTestCat = (id: string, name: string): Cat => ({
  id,
  name,
  genotype: {
    size: ['S', 'S'],
    tailLength: ['T', 'T'],
    earShape: ['E', 'E'],
    tailColor: ['O', 'O'],
  },
  phenotype: {
    size: 'large',
    tailLength: 'long',
    earShape: 'pointed',
    tailColor: 'orange',
  },
  age: 100,
  happiness: 100,
});

describe('MarketPanel', () => {
  const mockOnBuy = vi.fn();
  const mockOnClose = vi.fn();

  const inventory: MarketCat[] = [
    { cat: createTestCat('cat-1', 'Luna'), price: 120 },
    { cat: createTestCat('cat-2', 'Shadow'), price: 150 },
    { cat: createTestCat('cat-3', 'Mochi'), price: 200 },
  ];

  beforeEach(() => {
    mockOnBuy.mockClear();
    mockOnClose.mockClear();
  });

  it('renders title and balance', () => {
    render(
      <MarketPanel
        inventory={inventory}
        playerMoney={500}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Cat Market')).toBeInTheDocument();
    expect(screen.getByText('Your balance: $500')).toBeInTheDocument();
  });

  it('displays all cats in inventory', () => {
    render(
      <MarketPanel
        inventory={inventory}
        playerMoney={500}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    // Use getAllByText since cat name appears in sprite and in info section
    expect(screen.getAllByText('Luna').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Shadow').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mochi').length).toBeGreaterThan(0);
  });

  it('shows prices for each cat', () => {
    render(
      <MarketPanel
        inventory={inventory}
        playerMoney={500}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('$120')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  it('calls onBuy when clicking buy button for affordable cat', () => {
    render(
      <MarketPanel
        inventory={inventory}
        playerMoney={500}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    const buyButtons = screen.getAllByText('Buy');
    fireEvent.click(buyButtons[0]);

    expect(mockOnBuy).toHaveBeenCalledWith(inventory[0]);
  });

  it('disables buy button when player cannot afford', () => {
    render(
      <MarketPanel
        inventory={inventory}
        playerMoney={100}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    // All cats cost more than $100
    const disabledButtons = screen.getAllByText('Too expensive');
    expect(disabledButtons).toHaveLength(3);
  });

  it('calls onClose when clicking close button', () => {
    render(
      <MarketPanel
        inventory={inventory}
        playerMoney={500}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking overlay', () => {
    const { container } = render(
      <MarketPanel
        inventory={inventory}
        playerMoney={500}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    // The overlay is the first div child of the rendered component
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows empty message when no cats available', () => {
    render(
      <MarketPanel
        inventory={[]}
        playerMoney={500}
        onBuy={mockOnBuy}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/No cats available today/)).toBeInTheDocument();
  });
});
