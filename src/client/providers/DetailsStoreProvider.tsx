import {
  createDetailsStore,
  type DetailsStore,
  type DetailsStoreState,
} from '@client/containers/details/Details.store';
import { createContext, type FC, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

const DetailsStoreContext = createContext<DetailsStore | null>(null);

type DetailsStoreProviderProps = {
  children: ReactNode;
};

// One store per details visit: created on mount, discarded on unmount.
export const DetailsStoreProvider: FC<DetailsStoreProviderProps> = ({ children }) => {
  const [store] = useState(createDetailsStore);
  return <DetailsStoreContext.Provider value={store}>{children}</DetailsStoreContext.Provider>;
};

export function useDetailsState<T>(selector: (state: DetailsStoreState) => T): T {
  const store = useContext(DetailsStoreContext);
  if (!store) {
    throw new Error('Details hooks must be used inside <DetailsStoreProvider>');
  }
  return useStore(store, selector);
}

export const useDetailsDispatch = () => useDetailsState((state) => state.dispatch);
