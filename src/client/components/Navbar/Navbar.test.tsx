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

  it('shows no buttons when there is no call-to-action or back handler', () => {
    render(<Navbar title="Investigator" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows a back button that calls onBack', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<Navbar title="Investigator" onBack={onBack} />);

    await user.click(screen.getByRole('button', { name: 'Go back' }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
