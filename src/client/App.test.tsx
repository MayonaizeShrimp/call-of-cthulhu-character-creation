import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { renderWithProviders } from './test-utils';

describe('App routing', () => {
  it('shows the dashboard at /', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: 'Investigators' })).toBeInTheDocument();
  });

  it('navigates from the dashboard to create mode and back', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Create investigator' }));
    expect(screen.getByRole('heading', { name: 'New investigator' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Back to dashboard' }));
    expect(screen.getByRole('heading', { name: 'Investigators' })).toBeInTheDocument();
  });

  it('shows not found for unknown paths', () => {
    renderWithProviders(<App />, { route: '/nope' });
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
