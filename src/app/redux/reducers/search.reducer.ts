import { ApiError } from '@/core/models/api.model';
import { FilteredTickets } from '@/core/models/search.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { searchActions } from '../actions/search.actions';

export type SearchState = {
  tickets: FilteredTickets;
  error: ApiError | null;
  status: 'loading' | 'error' | 'success';
};

const initialState: SearchState = {
  tickets: [
    {
      date: '2024-10-08',
      tickets: [
        {
          departureDate: new Date('2024-10-08T08:00:00'),
          arrivalDate: new Date('2024-10-08T10:00:00'),
          startCity: 'New York',
          endCity: 'Boston',
          tripDuration: 12354678,
          firstRouteStation: 'Minsk',
          lastRouteStation: 'Amsterdam',
        },
        {
          departureDate: new Date('2024-10-08T14:00:00'),
          arrivalDate: new Date('2024-10-08T18:00:00'),
          startCity: 'Washington D.C.',
          endCity: 'Philadelphia',
          tripDuration: 34786867,
          firstRouteStation: 'Paris',
          lastRouteStation: 'Dubai',
        },
        {
          departureDate: new Date('2024-10-08T20:00:00'),
          arrivalDate: new Date('2024-10-08T23:30:00'),
          startCity: 'Los Angeles',
          endCity: 'San Francisco',
          tripDuration: 6325524,
          firstRouteStation: 'Berlin',
          lastRouteStation: 'London',
        },
      ],
    },
    {
      date: '2024-10-09',
      tickets: [
        {
          departureDate: new Date('2024-10-09T09:00:00'),
          arrivalDate: new Date('2024-10-09T13:00:00'),
          startCity: 'Chicago',
          endCity: 'Detroit',
          tripDuration: 14400000,
          firstRouteStation: 'Chicago',
          lastRouteStation: 'Detroit',
        },
        {
          departureDate: new Date('2024-10-09T15:30:00'),
          arrivalDate: new Date('2024-10-09T18:00:00'),
          startCity: 'Houston',
          endCity: 'Dallas',
          tripDuration: 9000000,
          firstRouteStation: 'Houston Station',
          lastRouteStation: 'Dallas',
        },
      ],
    },
    {
      date: '2024-10-10',
      tickets: [
        {
          departureDate: new Date('2024-10-10T07:00:00'),
          arrivalDate: new Date('2024-10-10T09:30:00'),
          startCity: 'Miami',
          endCity: 'Orlando',
          tripDuration: 9000000,
          firstRouteStation: 'Miami',
          lastRouteStation: 'Orlando',
        },
        {
          departureDate: new Date('2024-10-10T12:00:00'),
          arrivalDate: new Date('2024-10-10T16:00:00'),
          startCity: 'Seattle',
          endCity: 'Portland',
          tripDuration: 14400000,
          firstRouteStation: 'Seattle',
          lastRouteStation: 'Portland',
        },
        {
          departureDate: new Date('2024-10-10T18:00:00'),
          arrivalDate: new Date('2024-10-10T20:00:00'),
          startCity: 'Las Vegas',
          endCity: 'Los Angeles',
          tripDuration: 7200000,
          firstRouteStation: 'Las Vegas',
          lastRouteStation: 'LA',
        },
      ],
    },
  ],
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
