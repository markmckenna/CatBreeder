/**
 * Tests for Room component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Room from '.';
import type { FurniturePosition } from '../positions.ts';

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

  it('renders owned toys', () => {
    const toyPositions: FurniturePosition[] = [
      { type: 'toy', index: 0, x: 25, y: 80 },
      { type: 'toy', index: 1, x: 75, y: 80 },
    ];
    render(<Room furniturePositions={toyPositions} />);
    const toys = screen.getAllByTestId('furniture-toy');
    expect(toys).toHaveLength(2);
  });

  it('renders owned beds', () => {
    const bedPositions: FurniturePosition[] = [
      { type: 'bed', index: 0, x: 30, y: 83 },
      { type: 'bed', index: 1, x: 70, y: 83 },
      { type: 'bed', index: 2, x: 50, y: 90 },
    ];
    render(<Room furniturePositions={bedPositions} />);
    const beds = screen.getAllByTestId('furniture-bed');
    expect(beds).toHaveLength(3);
  });

  it('renders both toys and beds', () => {
    const positions: FurniturePosition[] = [
      { type: 'toy', index: 0, x: 25, y: 80 },
      { type: 'bed', index: 0, x: 30, y: 83 },
      { type: 'bed', index: 1, x: 70, y: 83 },
    ];
    render(<Room furniturePositions={positions} />);
    expect(screen.getAllByTestId('furniture-toy')).toHaveLength(1);
    expect(screen.getAllByTestId('furniture-bed')).toHaveLength(2);
  });

  it('renders no furniture when not provided', () => {
    render(<Room />);
    expect(screen.queryAllByTestId('furniture-toy')).toHaveLength(0);
    expect(screen.queryAllByTestId('furniture-bed')).toHaveLength(0);
  });
});
