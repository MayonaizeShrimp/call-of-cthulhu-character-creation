import { type BoundTagged, bindTagged } from '@core/common/entities/tagged';
import {
  DetailsAction,
  type DetailsState,
  detailsReducer,
  initializeDetailsState,
} from '@core/display/details';
import { createStore } from 'zustand/vanilla';

export type DetailsDispatch = BoundTagged<typeof DetailsAction>;

export type DetailsStoreState = DetailsState & {
  dispatch: DetailsDispatch;
};

// `set` merges, so `dispatch` survives every reducer result.
export const createDetailsStore = () =>
  createStore<DetailsStoreState>()((set) => ({
    ...initializeDetailsState(),
    dispatch: bindTagged(DetailsAction, (action) => set((state) => detailsReducer(state, action))),
  }));

export type DetailsStore = ReturnType<typeof createDetailsStore>;
