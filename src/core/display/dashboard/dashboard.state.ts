import type { Investigator } from '@game-rules/investigator';
import { match } from 'ts-pattern';
import { DashboardAction, type DashboardActions } from './dashboard.action';
import { DashboardCommand, type DashboardCommands } from './dashboard.command';

export type DashboardState = {
  investigators: Investigator[];
  command: DashboardCommands;
};

export const initializeDashboardState = (): DashboardState => ({
  investigators: [],
  command: DashboardCommand.noop(),
});

export const dashboardReducer = (state: DashboardState, action: DashboardActions): DashboardState =>
  match(action)
    .returnType<DashboardState>()
    .with({ type: DashboardAction.startGetInvestigators.type }, () => ({
      ...state,
      command: DashboardCommand.getInvestigators(),
    }))
    .with({ type: DashboardAction.finishGetInvestigators.type }, ({ investigators }) => ({
      ...state,
      investigators,
      command: DashboardCommand.noop(),
    }))
    .with({ type: DashboardAction.resetCommand.type }, () => ({
      ...state,
      command: DashboardCommand.noop(),
    }))
    .exhaustive();
