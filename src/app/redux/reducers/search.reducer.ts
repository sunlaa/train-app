import { ApiError } from '@/core/models/api.model';
import { FilteredTickets } from '@/core/models/search.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { searchActions } from '../actions/search.actions';

export type SearchState = {
  tickets: FilteredTickets;
  error: ApiError | Error | null;
  status: null | 'error' | 'success';
  isLoading: boolean;
};

const initialState: SearchState = {
  tickets: [],
  error: null,
  status: null,
  isLoading: false,
};

const searchReducer = createReducer(
  initialState,
  on(
    searchActions.search,
    (state): SearchState => ({ ...state, isLoading: true }),
  ),
  on(
    searchActions.searchSuccess,
    (_, { tickets }): SearchState => ({
      tickets,
      error: null,
      status: 'success',
      isLoading: false,
    }),
  ),
  on(searchActions.searchError, (state, { error }): SearchState => {
    let errorObj: Error | ApiError;
    if (error instanceof Error) {
      errorObj = error;
    } else {
      errorObj = error.error;
    }
    return {
      ...state,
      error: errorObj,
      status: 'error',
      isLoading: false,
    };
  }),
  on(searchActions.reset, (): SearchState => ({ ...initialState })),
);

export const searchFeature = createFeature({
  name: 'search',
  reducer: searchReducer,
});
