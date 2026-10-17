import { type BoundTagged, bindTagged } from '@core/common/entities/tagged';
import {
  DashboardAction,
  type DashboardState,
  dashboardReducer,
  initializeDashboardState,
} from '@core/display/dashboard';
import { createStore } from 'zustand/vanilla';

export type DashboardDispatch = BoundTagged<typeof DashboardAction>;

export type DashboardStoreState = DashboardState & {
  dispatch: DashboardDispatch;
};

// `set` merges, so `dispatch` survives every reducer result.
export const createDashboardStore = () =>
  createStore<DashboardStoreState>()((set) => ({
    ...initializeDashboardState(),
    dispatch: bindTagged(DashboardAction, (action) =>
      set((state) => dashboardReducer(state, action)),
    ),
  }));

export type DashboardStore = ReturnType<typeof createDashboardStore>;
