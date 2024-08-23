import { ApiError } from '@/core/models/api.model';
import { Ticket } from '@/core/models/search.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { searchActions } from '../actions/search.actions';

export type SearchState = {
  tickets: Ticket[];
  error: ApiError | null;
  status: 'loading' | 'error' | 'success';
};

const initialState: SearchState = {
  tickets: [],
  error: null,
  status: 'loading',
};

const searchReducer = createReducer(
  initialState,
  on(
    searchActions.search,
    (state): SearchState => ({ ...state, status: 'loading' }),
  ),
  on(
    searchActions.searchSuccess,
    (_, { tickets }): SearchState => ({
      tickets,
      error: null,
      status: 'success',
    }),
  ),
  on(
    searchActions.searchError,
    (state, { error }): SearchState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);

export const searchFeature = createFeature({
  name: 'search',
  reducer: searchReducer,
});
