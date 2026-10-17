import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { AppProviders } from './providers/AppProviders';

const renderApp = () =>
  render(
    <AppProviders>
      <App />
    </AppProviders>,
  );

describe('App', () => {
  it('renders the heading and characteristics', () => {
    renderApp();
    expect(
      screen.getByRole('heading', { name: 'Call of Cthulhu 7e — Character Creation' }),
    ).toBeInTheDocument();
    expect(screen.getByText('EDU')).toBeInTheDocument();
  });

  it('greets the investigator by the typed name', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText('Investigator name'), 'Harvey');

    expect(screen.getByLabelText('Investigator name')).toHaveValue('Harvey');
    expect(screen.getByText('Hello, Harvey')).toBeInTheDocument();
  });
});
