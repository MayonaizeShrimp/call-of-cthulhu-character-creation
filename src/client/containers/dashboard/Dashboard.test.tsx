import { createFakeDatagateways, renderWithProviders } from '@client/test-utils';
import { createTestInvestigator } from '@game-rules/index';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('shows the empty state when there are no investigators', async () => {
    renderWithProviders(<Dashboard />, { datagateways: createFakeDatagateways([]) });

    expect(screen.getByRole('heading', { name: 'Investigators' })).toBeInTheDocument();
    expect(await screen.findByText('No investigators yet')).toBeInTheDocument();
  });

  it('lists saved investigators as links to their details', async () => {
    renderWithProviders(<Dashboard />, {
      datagateways: createFakeDatagateways([
        createTestInvestigator({ id: '1', name: 'Harvey Walters' }),
        createTestInvestigator({ id: '2', name: 'Lydia Lau' }),
      ]),
    });

    expect(await screen.findByRole('link', { name: 'Harvey Walters' })).toHaveAttribute(
      'href',
      '/investigators/1',
    );
    expect(screen.getByRole('link', { name: 'Lydia Lau' })).toHaveAttribute(
      'href',
      '/investigators/2',
    );
    expect(screen.queryByText('No investigators yet')).not.toBeInTheDocument();
  });

  it('navigates to create mode from the navbar call-to-action', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="investigators" element={<p>Create page</p>} />
      </Routes>,
      { datagateways: createFakeDatagateways([]) },
    );

    await user.click(screen.getByRole('button', { name: 'New Investigator' }));

    expect(screen.getByText('Create page')).toBeInTheDocument();
  });
});
