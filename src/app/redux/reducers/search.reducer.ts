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
  tickets: {
    '2024-10-08': [
      {
        departureDate: new Date('2024-10-08T08:00:00'),
        arrivalDate: new Date('2024-10-08T10:00:00'),
        startCity: 'New York',
        endCity: 'Boston',
        tripDuration: 7200000, // 2 часа в миллисекундах
        firstRouteStation: 'NY Penn Station',
        lastRouteStation: 'Boston South Station',
      },
      {
        departureDate: new Date('2024-10-08T14:00:00'),
        arrivalDate: new Date('2024-10-08T18:00:00'),
        startCity: 'Washington D.C.',
        endCity: 'Philadelphia',
        tripDuration: 14400000, // 4 часа в миллисекундах
        firstRouteStation: 'Union Station',
        lastRouteStation: '30th Street Station',
      },
      {
        departureDate: new Date('2024-10-08T20:00:00'),
        arrivalDate: new Date('2024-10-08T23:30:00'),
        startCity: 'Los Angeles',
        endCity: 'San Francisco',
        tripDuration: 12600000, // 3.5 часа в миллисекундах
        firstRouteStation: 'Union Station',
        lastRouteStation: 'SF Ferry Building',
      },
    ],
    '2024-10-09': [
      {
        departureDate: new Date('2024-10-09T09:00:00'),
        arrivalDate: new Date('2024-10-09T13:00:00'),
        startCity: 'Chicago',
        endCity: 'Detroit',
        tripDuration: 14400000, // 4 часа в миллисекундах
        firstRouteStation: 'Chicago Union Station',
        lastRouteStation: 'Detroit Station',
      },
      {
        departureDate: new Date('2024-10-09T15:30:00'),
        arrivalDate: new Date('2024-10-09T18:00:00'),
        startCity: 'Houston',
        endCity: 'Dallas',
        tripDuration: 9000000, // 2.5 часа в миллисекундах
        firstRouteStation: 'Houston Station',
        lastRouteStation: 'Dallas Station',
      },
    ],
    '2024-10-10': [
      {
        departureDate: new Date('2024-10-10T07:00:00'),
        arrivalDate: new Date('2024-10-10T09:30:00'),
        startCity: 'Miami',
        endCity: 'Orlando',
        tripDuration: 9000000, // 2.5 часа в миллисекундах
        firstRouteStation: 'Miami Central Station',
        lastRouteStation: 'Orlando Station',
      },
      {
        departureDate: new Date('2024-10-10T12:00:00'),
        arrivalDate: new Date('2024-10-10T16:00:00'),
        startCity: 'Seattle',
        endCity: 'Portland',
        tripDuration: 14400000, // 4 часа в миллисекундах
        firstRouteStation: 'Seattle Station',
        lastRouteStation: 'Portland Union Station',
      },
      {
        departureDate: new Date('2024-10-10T18:00:00'),
        arrivalDate: new Date('2024-10-10T20:00:00'),
        startCity: 'Las Vegas',
        endCity: 'Los Angeles',
        tripDuration: 7200000, // 2 часа в миллисекундах
        firstRouteStation: 'Las Vegas Station',
        lastRouteStation: 'LA Union Station',
      },
    ],
  },
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
