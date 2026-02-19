/**
 * Tests for Room component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Room from '.';

describe('Room', () => {
  it('renders room container', () => {
    render(<Room />);
    expect(screen.getByTestId('room')).toBeInTheDocument();
  });

  it('renders cat bed furniture', () => {
    render(<Room />);
    expect(screen.getByTestId('cat-bed')).toBeInTheDocument();
  });

  it('renders children inside room', () => {
    render(
      <Room>
        <div data-testid="cat">Whiskers</div>
      </Room>
    );
    expect(screen.getByTestId('cat')).toBeInTheDocument();
    expect(screen.getByText('Whiskers')).toBeInTheDocument();
  });

  it('accepts different room styles', () => {
    const { rerender } = render(<Room style="cozy" />);
    expect(screen.getByTestId('room')).toBeInTheDocument();
    
    rerender(<Room style="modern" />);
    expect(screen.getByTestId('room')).toBeInTheDocument();
    
    rerender(<Room style="rustic" />);
    expect(screen.getByTestId('room')).toBeInTheDocument();
    
    rerender(<Room style="luxury" />);
    expect(screen.getByTestId('room')).toBeInTheDocument();
  });
});
