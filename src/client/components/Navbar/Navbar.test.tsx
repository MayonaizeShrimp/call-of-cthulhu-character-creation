import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from './Navbar';

const renderNavbar = (onClick = vi.fn()) =>
  render(<Navbar title="Investigators" cta={{ label: 'New Investigator', onClick }} />);

describe('Navbar', () => {
  it('renders the title as a heading', () => {
    renderNavbar();
    expect(screen.getByRole('heading', { name: 'Investigators' })).toBeInTheDocument();
  });

  it('renders the call-to-action button with its label', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: 'New Investigator' })).toBeInTheDocument();
  });

  it('calls the call-to-action handler when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderNavbar(onClick);

    await user.click(screen.getByRole('button', { name: 'New Investigator' }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
