/**
 * Tests for CatView component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CatView } from './CatView.tsx';
import type { Cat } from '../logic/cats';

describe('CatView', () => {
  const mockCat: Cat = {
    id: 'test-cat-1',
    name: 'Whiskers',
    genotype: 'BbLlTtEe',
    happiness: 75,
    age: 2,
  };

  it('renders the cat name', () => {
    render(<CatView cat={mockCat} />);
    expect(screen.getByText('Whiskers')).toBeInTheDocument();
  });

  it('displays the cat phenotype information', () => {
    render(<CatView cat={mockCat} />);
    expect(screen.getByText(/Color:/)).toBeInTheDocument();
    expect(screen.getByText(/Size:/)).toBeInTheDocument();
    expect(screen.getByText(/Tail:/)).toBeInTheDocument();
    expect(screen.getByText(/Ears:/)).toBeInTheDocument();
  });

  it('displays the cat happiness level', () => {
    render(<CatView cat={mockCat} />);
    expect(screen.getByText('Happiness: 75')).toBeInTheDocument();
  });

  it('applies cat-view class to container', () => {
    const { container } = render(<CatView cat={mockCat} />);
    expect(container.querySelector('.cat-view')).toBeInTheDocument();
  });
});
