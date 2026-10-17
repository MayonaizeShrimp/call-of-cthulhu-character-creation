import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export const CHARACTER_STORAGE_KEY = 'coc-character-creation:character';
export const CHARACTER_STORAGE_VERSION = 1;

export interface CharacterState {
  name: string;
  setName: (name: string) => void;
}

export const createCharacterStore = () =>
  createStore<CharacterState>()(
    persist(
      (set) => ({
        name: '',
        setName: (name) => set({ name }),
      }),
      {
        name: CHARACTER_STORAGE_KEY,
        version: CHARACTER_STORAGE_VERSION,
        storage: createJSONStorage(() => localStorage),
        partialize: ({ name }) => ({ name }),
      },
    ),
  );

export type CharacterStore = ReturnType<typeof createCharacterStore>;
