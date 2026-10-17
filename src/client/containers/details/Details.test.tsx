import { renderWithProviders } from '@client/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Details } from './Details';

const renderDetails = (route: string) =>
  renderWithProviders(
    <Routes>
      <Route path="investigators/:id?" element={<Details />} />
    </Routes>,
    { route },
  );

describe('Details', () => {
  it.each(['/investigators', '/investigators/'])('is in create mode at %s', (route) => {
    renderDetails(route);
    expect(screen.getByRole('heading', { name: 'New investigator' })).toBeInTheDocument();
  });

  it('is in edit mode when an id is given', () => {
    renderDetails('/investigators/abc');
    expect(screen.getByRole('heading', { name: 'Investigator abc' })).toBeInTheDocument();
  });

  it('greets the investigator by the typed name', async () => {
    const user = userEvent.setup();
    renderDetails('/investigators');

    await user.type(screen.getByLabelText('Investigator name'), 'Harvey');

    expect(screen.getByLabelText('Investigator name')).toHaveValue('Harvey');
    expect(screen.getByText('Hello, Harvey')).toBeInTheDocument();
  });
});
