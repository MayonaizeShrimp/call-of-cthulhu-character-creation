import { DashboardCommand } from '@core/display/dashboard';
import { createTestInvestigator, type Investigator } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import { createDashboardStore } from './Dashboard.store';

const investigators: Investigator[] = [createTestInvestigator({ id: '1', name: 'Harvey Walters' })];

describe('createDashboardStore', () => {
  it('starts from the initial dashboard state', () => {
    const store = createDashboardStore();
    expect(store.getState()).toMatchObject({
      investigators: [],
      command: DashboardCommand.noop(),
    });
  });

  it('runs dispatched actions through the reducer', () => {
    const store = createDashboardStore();
    const { dispatch } = store.getState();

    dispatch.startGetInvestigators();
    expect(store.getState().command).toEqual(DashboardCommand.getInvestigators());

    dispatch.finishGetInvestigators(investigators);
    expect(store.getState()).toMatchObject({ investigators, command: DashboardCommand.noop() });
  });

  it('keeps dispatch after reducer updates', () => {
    const store = createDashboardStore();
    const { dispatch } = store.getState();

    dispatch.startGetInvestigators();

    expect(store.getState().dispatch).toBe(dispatch);
  });

  it('gives each store its own state', () => {
    const first = createDashboardStore();
    const second = createDashboardStore();

    first.getState().dispatch.startGetInvestigators();

    expect(second.getState().command).toEqual(DashboardCommand.noop());
  });
});
