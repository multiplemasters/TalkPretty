import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../src/App';

const renderGuide = () => {
  const user = userEvent.setup();
  return { user, ...render(<App />) };
};

describe('communication framework guide', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('searches frameworks, filters by category, and keeps result counts accurate', async () => {
    const { user } = renderGuide();

    expect(screen.getByRole('heading', { name: '28 frameworks' })).toBeTruthy();

    await user.type(screen.getByTestId('input-search-frameworks'), 'SWOT');
    expect(screen.getByRole('heading', { name: '1 framework' })).toBeTruthy();
    expect(screen.getByTestId('card-framework-swot')).toBeTruthy();

    await user.click(screen.getByTestId('button-clear-search'));
    await user.click(screen.getByTestId('button-filter-strategy'));

    const strategyFilter = screen.getByTestId('button-filter-strategy');
    expect(strategyFilter.getAttribute('aria-pressed')).toBe('true');
    expect(strategyFilter.getAttribute('aria-label')).toBe('Strategy: 4 frameworks');
    expect(screen.getByRole('heading', { name: '4 frameworks' })).toBeTruthy();
  });

  it('persists favorites and can narrow the library to saved frameworks', async () => {
    const { user, unmount } = renderGuide();
    const favorite = screen.getByTestId('button-favorite-swot');

    expect(favorite.getAttribute('aria-label')).toBe('Save SWOT');
    await user.click(favorite);
    expect(favorite.getAttribute('aria-label')).toBe('Remove SWOT');
    expect(localStorage.getItem('communication-guide-favorites')).toBe('["swot"]');

    unmount();
    const nextRender = renderGuide();
    expect(screen.getByTestId('button-favorite-swot').getAttribute('aria-label')).toBe('Remove SWOT');

    await nextRender.user.click(screen.getByTestId('button-toggle-favorites'));
    expect(screen.getByRole('heading', { name: '1 framework' })).toBeTruthy();
    expect(screen.getByTestId('card-framework-swot')).toBeTruthy();
    expect(screen.queryByTestId('card-framework-star')).toBeNull();
  });

  it('switches themes from the keyboard and restores the choice after refresh', async () => {
    const { user, unmount } = renderGuide();
    const themeToggle = screen.getByTestId('button-theme-toggle');

    expect(themeToggle.getAttribute('aria-label')).toBe('Switch to dark theme');
    expect(themeToggle.getAttribute('aria-pressed')).toBe('false');

    themeToggle.focus();
    await user.keyboard('{Enter}');

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(themeToggle.getAttribute('aria-label')).toBe('Switch to light theme');
    expect(themeToggle.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('communication-guide-theme')).toBe('dark');

    unmount();
    renderGuide();

    expect(screen.getByTestId('button-theme-toggle').getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('shows and clears the empty state when no framework matches', async () => {
    const { user } = renderGuide();

    await user.type(screen.getByTestId('input-search-frameworks'), 'no framework matches this');
    expect(screen.getByRole('heading', { name: '0 frameworks' })).toBeTruthy();
    expect(screen.getByText('Nothing in this pocket.')).toBeTruthy();

    await user.click(screen.getByTestId('button-empty-clear'));
    expect(screen.getByRole('heading', { name: '28 frameworks' })).toBeTruthy();
    expect(screen.queryByText('Nothing in this pocket.')).toBeNull();
  });

  it('opens from a keyboard-focused card, copies its guide, and closes the detail view', async () => {
    const { user } = renderGuide();
    const card = screen.getByTestId('card-framework-swot');

    expect(card.getAttribute('tabindex')).toBe('0');
    card.focus();
    await user.keyboard('{Enter}');

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByRole('heading', { name: /Strengths, Weaknesses, Opportunities, Threats/ })).toBeTruthy();

    await user.click(screen.getByTestId('button-copy-framework'));
    expect(await screen.findByText('Copied')).toBeTruthy();

    await user.click(screen.getByTestId('button-close-framework'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the filter strip scrollable and the detail layout readable on narrow screens', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    const { user } = renderGuide();

    const filterStrip = document.querySelector('.filter-strip');
    expect(filterStrip).toBeTruthy();
    expect(filterStrip?.classList.contains('overflow-x-auto')).toBe(true);
    expect(Array.from(filterStrip?.querySelectorAll('button') ?? []).every((button) => button.className.includes('shrink-0'))).toBe(true);

    await user.click(screen.getByTestId('card-framework-swot'));

    const detailSheet = document.querySelector('.detail-sheet');
    const title = within(screen.getByRole('dialog')).getByRole('heading', { name: /Strengths, Weaknesses, Opportunities, Threats/ });
    expect(detailSheet?.classList.contains('w-full')).toBe(true);
    expect(detailSheet?.classList.contains('max-h-[94dvh]')).toBe(true);
    expect(title.className).toContain('text-3xl');
    expect(title.className).toContain('leading-tight');
  });
});