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

  it('renders SVG background', () => {
    render(<Room />);
    const room = screen.getByTestId('room');
    expect(room.querySelector('svg')).toBeInTheDocument();
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

  it('renders with default cozy style', () => {
    render(<Room />);
    expect(screen.getByTestId('room')).toBeInTheDocument();
  });
});
