import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CatSprite from '.';
import { createMockCat, SMALL_FOLDED_CAT } from '../../cats/test/helpers.ts';

const mockCat = createMockCat();
const smallFoldedCat = SMALL_FOLDED_CAT;

describe('CatSprite', () => {
  it('renders cat with name', () => {
    render(<CatSprite cat={mockCat} />);
    expect(screen.getByText('Whiskers')).toBeInTheDocument();
  });

  it('has correct test id', () => {
    render(<CatSprite cat={mockCat} />);
    expect(screen.getByTestId('cat-sprite-test-cat-1')).toBeInTheDocument();
  });

  it('renders small cat variant', () => {
    render(<CatSprite cat={smallFoldedCat} />);
    expect(screen.getByText('Mittens')).toBeInTheDocument();
    expect(screen.getByTestId('cat-sprite-test-cat-2')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<CatSprite cat={mockCat} onClick={handleClick} />);
    
    fireEvent.click(screen.getByTestId('cat-sprite-test-cat-1'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has button role when clickable', () => {
    const handleClick = vi.fn();
    render(<CatSprite cat={mockCat} onClick={handleClick} />);
    
    expect(screen.getByRole('button', { name: /Select Whiskers/i })).toBeInTheDocument();
  });

  it('does not have button role when not clickable', () => {
    render(<CatSprite cat={mockCat} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows selected state', () => {
    const { container } = render(<CatSprite cat={mockCat} selected />);
    // Selected cats have a transform scale applied
    const sprite = container.firstChild as HTMLElement;
    expect(sprite.style.transform).toContain('scale(1.15)');
  });
});
