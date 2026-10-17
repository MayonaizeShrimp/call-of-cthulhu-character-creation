import { renderWithProviders } from '@client/test-utils';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('renders the title and empty state', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByRole('heading', { name: 'Investigators' })).toBeInTheDocument();
    expect(screen.getByText('No investigators yet')).toBeInTheDocument();
  });

  it('offers to create an investigator', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByRole('button', { name: 'Create investigator' })).toBeInTheDocument();
  });
});
