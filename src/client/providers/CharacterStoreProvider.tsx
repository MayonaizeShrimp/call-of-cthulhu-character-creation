import { type CharacterState, type CharacterStore, createCharacterStore } from '@core/index';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

const CharacterStoreContext = createContext<CharacterStore | null>(null);

interface CharacterStoreProviderProps {
  children: ReactNode;
  /** Inject a store (e.g. in tests); a new persisted store is created otherwise. */
  store?: CharacterStore;
}

export function CharacterStoreProvider({ children, store }: CharacterStoreProviderProps) {
  const [value] = useState(() => store ?? createCharacterStore());
  return <CharacterStoreContext.Provider value={value}>{children}</CharacterStoreContext.Provider>;
}

export function useCharacterStore<T>(selector: (state: CharacterState) => T): T {
  const store = useContext(CharacterStoreContext);
  if (!store) {
    throw new Error('useCharacterStore must be used inside <CharacterStoreProvider>');
  }
  return useStore(store, selector);
}
