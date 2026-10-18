import type { Datagateways } from '@client/providers/DatagatewaysProvider';
import { createFakeDatagateways, renderWithProviders } from '@client/test-utils';
import { CHARACTERISTICS, createTestInvestigator } from '@game-rules/index';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Details } from './Details';

// Shows the current URL so tests can check where the page navigated to.
const CurrentPath = () => <output aria-label="current path">{useLocation().pathname}</output>;

const renderDetails = (route: string, datagateways: Datagateways = createFakeDatagateways()) =>
  renderWithProviders(
    <>
      <Routes>
        <Route path="investigators/:id?" element={<Details />} />
      </Routes>
      <CurrentPath />
    </>,
    { route, datagateways },
  );

const stepButton = (name: string) => screen.getByRole('button', { name });

describe('Details', () => {
  it('starts a new investigator on the Basics step', () => {
    renderDetails('/investigators');
    expect(screen.getByRole('heading', { name: 'New investigator' })).toBeInTheDocument();
    expect(screen.getByLabelText('Investigator name')).toBeInTheDocument();
  });

  // A full walk through all five steps with simulated typing takes a few seconds.
  it('creates an investigator through every step and saves it', async () => {
    const user = userEvent.setup();
    const datagateways = createFakeDatagateways();
    renderDetails('/investigators', datagateways);

    // Basics
    await user.type(screen.getByLabelText('Investigator name'), 'Sari Wulandari');
    await user.click(stepButton('Next'));

    // Occupation: Jurnalistik, one interpersonal skill, two others
    await user.click(screen.getByRole('combobox', { name: 'Occupation' }));
    await user.click(await screen.findByTitle('Jurnalistik (School Press)'));
    await user.click(screen.getByRole('checkbox', { name: 'Persuade' }));
    // The skill list is long and virtualised, so filter it by typing, as a player would.
    const otherSkills = screen.getByRole('combobox', { name: 'Other occupation skills' });
    await user.type(otherSkills, 'Spot');
    await user.click(await screen.findByTitle('Spot Hidden'));
    await user.type(otherSkills, 'Listen');
    await user.click(await screen.findByTitle('Listen'));
    await user.click(stepButton('Next'));

    // Characteristics and Luck
    for (const characteristic of CHARACTERISTICS) {
      await user.type(screen.getByRole('spinbutton', { name: characteristic }), '50');
    }
    await user.type(screen.getByRole('spinbutton', { name: 'Luck' }), '45');
    await user.click(stepButton('Next'));

    // Skills: raise Charm from 15 to 40
    const charm = screen.getByRole('spinbutton', { name: 'Charm' });
    await user.clear(charm);
    await user.type(charm, '40');
    await user.click(stepButton('Next'));

    // Summary
    expect(screen.queryByText('Fix these before saving')).not.toBeInTheDocument();
    await user.click(stepButton('Save'));

    expect(await screen.findByText('Saved')).toBeInTheDocument();
    const [saved] = await datagateways.getInvestigators();
    expect(saved).toMatchObject({
      name: 'Sari Wulandari',
      occupation: {
        occupationId: 'jurnalistik',
        choiceSkillIds: [['persuade']],
        anySkillIds: ['spot-hidden', 'listen'],
      },
      luck: 45,
      skills: [{ skillId: 'charm', value: 40 }],
    });
    // The router applies the URL change just after the save renders, so wait for it.
    await waitFor(() =>
      expect(screen.getByLabelText('current path')).toHaveTextContent(
        `/investigators/${saved?.id}`,
      ),
    );
  }, 15_000);

  it('blocks saving while there are problems and links to the step to fix them', async () => {
    const user = userEvent.setup();
    renderDetails('/investigators');

    await user.click(screen.getByText('Summary'));

    const problems = screen.getByRole('alert');
    expect(within(problems).getByText('Give your investigator a name.')).toBeInTheDocument();
    expect(within(problems).getByText('Choose an occupation.')).toBeInTheDocument();
    expect(stepButton('Save')).toBeDisabled();

    await user.click(within(problems).getByText('Choose an occupation.'));
    expect(screen.getByRole('combobox', { name: 'Occupation' })).toBeInTheDocument();
  });

  it('opens an existing investigator on the Summary', async () => {
    renderDetails(
      '/investigators/1',
      createFakeDatagateways([createTestInvestigator({ id: '1', name: 'Harvey Walters' })]),
    );

    expect(await screen.findByRole('heading', { name: 'Harvey Walters' })).toBeInTheDocument();
    expect(screen.getByText('Jurnalistik (School Press)')).toBeInTheDocument();
    expect(stepButton('Save')).toBeEnabled();
  });

  it('shows not found for an unknown investigator', async () => {
    renderDetails('/investigators/missing');
    expect(await screen.findByText('Investigator not found')).toBeInTheDocument();
  });
});
