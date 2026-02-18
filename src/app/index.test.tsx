import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './index.tsx';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /catbreeder/i })).toBeInTheDocument();
  });

  it('renders the welcome message', () => {
    render(<App />);
    expect(screen.getByText(/welcome to your new react application/i)).toBeInTheDocument();
  });

  it('starts counter at 0', () => {
    render(<App />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments counter when + button is clicked', () => {
    render(<App />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decrements counter when - button is clicked', () => {
    render(<App />);
    const decrementButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(decrementButton);
    expect(screen.getByText('-1')).toBeInTheDocument();
  });
});
