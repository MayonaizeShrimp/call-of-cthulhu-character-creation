import { describe, expect, it } from 'vitest';
import { CHARACTER_STORAGE_KEY, createCharacterStore } from './character-store';

describe('character store', () => {
  it('starts with an empty name', () => {
    expect(createCharacterStore().getState().name).toBe('');
  });

  it('updates the name', () => {
    const store = createCharacterStore();
    store.getState().setName('Harvey Walters');
    expect(store.getState().name).toBe('Harvey Walters');
  });

  it('persists to localStorage under the versioned key', () => {
    createCharacterStore().getState().setName('Harvey Walters');

    const saved = JSON.parse(localStorage.getItem(CHARACTER_STORAGE_KEY) ?? 'null');
    expect(saved).toEqual({ state: { name: 'Harvey Walters' }, version: 1 });
  });

  it('rehydrates a fresh store from localStorage', () => {
    createCharacterStore().getState().setName('Harvey Walters');
    expect(createCharacterStore().getState().name).toBe('Harvey Walters');
  });
});
