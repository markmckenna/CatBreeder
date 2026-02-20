/**
 * Tests for ShopPanel component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShopPanel from './index.tsx';
import type { OwnedFurniture } from '../../environment/furniture.ts';

describe('ShopPanel', () => {
  const defaultProps = {
    furniture: { toys: 0, beds: 0, catTrees: 0 } as OwnedFurniture,
    money: 500,
    catCount: 2,
    onBuy: vi.fn(),
    onSell: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the shop title', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(screen.getByText('Furniture Shop')).toBeInTheDocument();
  });

  it('displays current capacity', () => {
    render(<ShopPanel {...defaultProps} />);
    // Base capacity is 2
    expect(screen.getByText('2 / 2 cats')).toBeInTheDocument();
  });

  it('displays current furniture count', () => {
    render(<ShopPanel {...defaultProps} furniture={{ toys: 2, beds: 1, catTrees: 0 }} />);
    expect(screen.getByText('2 toys, 1 beds')).toBeInTheDocument();
  });

  it('displays available items', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(screen.getByText('Cat Toy')).toBeInTheDocument();
    expect(screen.getByText('Cat Bed')).toBeInTheDocument();
  });

  it('shows prices for items', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('shows player balance', () => {
    render(<ShopPanel {...defaultProps} money={500} />);
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('calls onBuy when clicking buy button for toy', () => {
    const onBuy = vi.fn();
    render(<ShopPanel {...defaultProps} onBuy={onBuy} />);
    
    fireEvent.click(screen.getByText('$50'));
    expect(onBuy).toHaveBeenCalledWith('toy');
  });

  it('calls onBuy when clicking buy button for bed', () => {
    const onBuy = vi.fn();
    render(<ShopPanel {...defaultProps} onBuy={onBuy} />);
    
    fireEvent.click(screen.getByText('$100'));
    expect(onBuy).toHaveBeenCalledWith('bed');
  });

  it('disables buy when not enough money', () => {
    render(<ShopPanel {...defaultProps} money={30} />);
    
    const toyButton = screen.getByText('$50');
    const bedButton = screen.getByText('$100');
    
    expect(toyButton).toBeDisabled();
    expect(bedButton).toBeDisabled();
  });

  it('calls onClose when clicking overlay', () => {
    const onClose = vi.fn();
    const { container } = render(<ShopPanel {...defaultProps} onClose={onClose} />);
    
    // Click the overlay (first child of rendered output)
    fireEvent.click(container.firstChild!);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking panel content', () => {
    const onClose = vi.fn();
    render(<ShopPanel {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('Cat Toy'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking close button', () => {
    const onClose = vi.fn();
    render(<ShopPanel {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });
});
