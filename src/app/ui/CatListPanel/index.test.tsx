import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CatListPanel from '.';
import { createMockCat } from '@/test/helpers.ts';

describe('CatListPanel', () => {
  it('renders panel with title', () => {
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText('Your Cats')).toBeInTheDocument();
  });

  it('displays cat count', () => {
    render(
      <CatListPanel 
        cats={[createMockCat(), createMockCat({ id: 'cat-2', name: 'Fluffy' })]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText('2 cats')).toBeInTheDocument();
  });

  it('shows empty message when no cats', () => {
    render(
      <CatListPanel 
        cats={[]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText(/don't have any cats/i)).toBeInTheDocument();
  });

  it('displays cat names and traits', () => {
    render(
      <CatListPanel 
        cats={[createMockCat({ name: 'Mittens' })]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getAllByText('Mittens')).toHaveLength(2); // Once in sprite, once in info
    expect(screen.getByText(/large, long tail/i)).toBeInTheDocument();
  });

  it('calls onSelectCat when cat card is clicked', () => {
    const onSelectCat = vi.fn();
    const cat = createMockCat();
    render(
      <CatListPanel 
        cats={[cat]} 
        onSelectCat={onSelectCat} 
        onClose={() => {}} 
      />
    );
    // Click on the cat card (with role="button")
    const catCard = screen.getByRole('button', { name: /Whiskers/i });
    fireEvent.click(catCard);
    expect(onSelectCat).toHaveBeenCalledWith(cat);
  });

  it('calls onClose when cat is selected', () => {
    const onClose = vi.fn();
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onClose={onClose} 
      />
    );
    const catCard = screen.getByRole('button', { name: /Whiskers/i });
    fireEvent.click(catCard);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onClose={onClose} 
      />
    );
    fireEvent.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });

  it('displays cat age and happiness', () => {
    render(
      <CatListPanel 
        cats={[createMockCat({ age: 5, happiness: 75 })]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText('Age: 5 weeks')).toBeInTheDocument();
    expect(screen.getByText('Happiness: 75%')).toBeInTheDocument();
  });

  it('shows star button when onToggleFavourite is provided', () => {
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onToggleFavourite={() => {}}
        onClose={() => {}} 
      />
    );
    expect(screen.getByRole('button', { name: /Add .* to favourites/i })).toBeInTheDocument();
  });

  it('does not show star button when onToggleFavourite is not provided', () => {
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={() => {}} 
        onClose={() => {}} 
      />
    );
    expect(screen.queryByRole('button', { name: /favourites/i })).not.toBeInTheDocument();
  });

  it('calls onToggleFavourite when star button is clicked', () => {
    const onToggleFavourite = vi.fn();
    const cat = createMockCat({ id: 'cat-123' });
    render(
      <CatListPanel 
        cats={[cat]} 
        onSelectCat={() => {}} 
        onToggleFavourite={onToggleFavourite}
        onClose={() => {}} 
      />
    );
    const starButton = screen.getByRole('button', { name: /Add .* to favourites/i });
    fireEvent.click(starButton);
    expect(onToggleFavourite).toHaveBeenCalledWith('cat-123');
  });

  it('shows filled star for favourite cats', () => {
    render(
      <CatListPanel 
        cats={[createMockCat({ favourite: true })]} 
        onSelectCat={() => {}} 
        onToggleFavourite={() => {}}
        onClose={() => {}} 
      />
    );
    expect(screen.getByRole('button', { name: /Remove .* from favourites/i })).toBeInTheDocument();
  });

  it('does not call onSelectCat when star button is clicked', () => {
    const onSelectCat = vi.fn();
    render(
      <CatListPanel 
        cats={[createMockCat()]} 
        onSelectCat={onSelectCat} 
        onToggleFavourite={() => {}}
        onClose={() => {}} 
      />
    );
    const starButton = screen.getByRole('button', { name: /favourites/i });
    fireEvent.click(starButton);
    // onSelectCat should NOT be called (stopPropagation)
    expect(onSelectCat).not.toHaveBeenCalled();
  });

  it('selects cat when Enter key is pressed on cat card', () => {
    const onSelectCat = vi.fn();
    const cat = createMockCat();
    render(
      <CatListPanel 
        cats={[cat]} 
        onSelectCat={onSelectCat} 
        onClose={() => {}} 
      />
    );
    const catCard = screen.getByRole('button', { name: /Whiskers/i });
    fireEvent.keyDown(catCard, { key: 'Enter' });
    expect(onSelectCat).toHaveBeenCalledWith(cat);
  });
});
