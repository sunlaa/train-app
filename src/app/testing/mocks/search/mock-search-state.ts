import { SearchState } from '@/redux/reducers/search.reducer';
import { handledMockResponse } from './mock-search-data';

export class MockSearchState {
  static successState: SearchState = {
    tickets: handledMockResponse,
    status: 'success',
    error: null,
    isLoading: false,
  };

  static loadingState: SearchState = {
    tickets: [],
    status: null,
    error: null,
    isLoading: true,
  };

  static errorState: SearchState = {
    tickets: [],
    status: 'error',
    error: { message: 'Some error', reason: 'someError' },
    isLoading: false,
  };
}
