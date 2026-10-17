import { createTestInvestigator, type Investigator } from '@game-rules/index';
import { describe, expect, it } from 'vitest';
import { DashboardAction } from './dashboard.action';
import { DashboardCommand } from './dashboard.command';
import { dashboardReducer, initializeDashboardState } from './dashboard.state';

const investigators: Investigator[] = [createTestInvestigator({ id: '1', name: 'Harvey Walters' })];

describe('dashboardReducer', () => {
  it('starts with no investigators and nothing to do', () => {
    expect(initializeDashboardState()).toEqual({
      investigators: [],
      command: DashboardCommand.noop(),
    });
  });

  it('issues a getInvestigators command on startGetInvestigators', () => {
    const state = dashboardReducer(
      initializeDashboardState(),
      DashboardAction.startGetInvestigators(),
    );
    expect(state.command).toEqual(DashboardCommand.getInvestigators());
    expect(state.investigators).toEqual([]);
  });

  it('stores investigators and resets the command on finishGetInvestigators', () => {
    const loading = dashboardReducer(
      initializeDashboardState(),
      DashboardAction.startGetInvestigators(),
    );
    const state = dashboardReducer(loading, DashboardAction.finishGetInvestigators(investigators));
    expect(state).toEqual({ investigators, command: DashboardCommand.noop() });
  });

  it('does not mutate the previous state', () => {
    const before = initializeDashboardState();
    dashboardReducer(before, DashboardAction.startGetInvestigators());
    expect(before).toEqual(initializeDashboardState());
  });
});
