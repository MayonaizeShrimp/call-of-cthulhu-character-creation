import type { Investigator } from '@game-rules/index';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { AppProviders } from './providers/AppProviders';
import type { Datagateways } from './providers/DatagatewaysProvider';

type RenderOptions = {
  route?: string;
  datagateways?: Datagateways;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', datagateways }: RenderOptions = {},
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProviders datagateways={datagateways}>{ui}</AppProviders>
    </MemoryRouter>,
  );
}

// In-memory stand-in for the localStorage gateways.
export const createFakeDatagateways = (initial: Investigator[] = []): Datagateways => {
  let investigators = [...initial];
  return {
    getInvestigators: async () => investigators,
    upsertInvestigator: async (input) => {
      const saved = { ...input, id: input.id ?? `fake-${investigators.length + 1}` };
      investigators = [...investigators.filter(({ id }) => id !== saved.id), saved];
      return saved;
    },
    deleteInvestigator: async (id) => {
      const before = investigators.length;
      investigators = investigators.filter((investigator) => investigator.id !== id);
      return investigators.length < before;
    },
  };
};
