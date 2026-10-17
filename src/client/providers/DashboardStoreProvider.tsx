import {
  createDashboardStore,
  type DashboardStore,
  type DashboardStoreState,
} from '@client/containers/dashboard/Dashboard.store';
import { createContext, type FC, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

const DashboardStoreContext = createContext<DashboardStore | null>(null);

type DashboardStoreProviderProps = {
  children: ReactNode;
};

export const DashboardStoreProvider: FC<DashboardStoreProviderProps> = ({ children }) => {
  const [store] = useState(createDashboardStore);
  return <DashboardStoreContext.Provider value={store}>{children}</DashboardStoreContext.Provider>;
};

export function useDashboardState<T>(selector: (state: DashboardStoreState) => T): T {
  const store = useContext(DashboardStoreContext);
  if (!store) {
    throw new Error('Dashboard hooks must be used inside <DashboardStoreProvider>');
  }
  return useStore(store, selector);
}

export const useDashboardDispatch = () => useDashboardState((state) => state.dispatch);
