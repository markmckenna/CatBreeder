import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './index.tsx';

describe('App', () => {
  it('renders the game UI', () => {
    render(<App />);
    expect(screen.getByText(/Cat Breeder/)).toBeInTheDocument();
  });

  it('provides game context to children', () => {
    render(<App />);
    // If GameProvider wasn't working, these wouldn't render
    expect(screen.getByText(/Day \d+/)).toBeInTheDocument();
    expect(screen.getByText('Money')).toBeInTheDocument();
  });

  it('renders initial cats', () => {
    render(<App />);
    const catSprites = screen.getAllByTestId(/^cat-sprite-/);
    expect(catSprites.length).toBe(2);
  });
});
