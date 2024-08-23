import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchState } from '../reducers/search.reducer';

export const selectSearchFeature = createFeatureSelector<SearchState>('search');

export const selectSearchTickets = createSelector(
  selectSearchFeature,
  ({ tickets }) => tickets,
);

export const selectSearchStatus = createSelector(
  selectSearchFeature,
  ({ status }) => status,
);

export const selectSearchError = createSelector(
  selectSearchFeature,
  ({ error }) => error,
);
