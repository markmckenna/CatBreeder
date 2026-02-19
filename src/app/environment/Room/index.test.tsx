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

  it('renders owned toys', () => {
    render(<Room furniture={{ toys: 2, beds: 0 }} />);
    const toys = screen.getAllByTestId('furniture-toy');
    expect(toys).toHaveLength(2);
  });

  it('renders owned beds', () => {
    render(<Room furniture={{ toys: 0, beds: 3 }} />);
    const beds = screen.getAllByTestId('furniture-bed');
    expect(beds).toHaveLength(3);
  });

  it('renders both toys and beds', () => {
    render(<Room furniture={{ toys: 1, beds: 2 }} />);
    expect(screen.getAllByTestId('furniture-toy')).toHaveLength(1);
    expect(screen.getAllByTestId('furniture-bed')).toHaveLength(2);
  });

  it('renders no furniture when not provided', () => {
    render(<Room />);
    expect(screen.queryAllByTestId('furniture-toy')).toHaveLength(0);
    expect(screen.queryAllByTestId('furniture-bed')).toHaveLength(0);
  });
});
