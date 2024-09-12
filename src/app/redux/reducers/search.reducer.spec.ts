import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@/core/models/api.model';
import { DayTickets, Ticket } from '@/core/models/search.model';
import { searchFeature, SearchState } from './search.reducer';
import { searchActions } from '../actions/search.actions';

describe('SearchReducer', () => {
  let initialState: SearchState;
  const genericApiError: ApiError = {
    message: 'Error with search',
    reason: 'searchError',
  };

  const ticket: Ticket = {
    rideId: 123,
    fromId: 1,
    toId: 2,
    departureDate: Date.now(),
    arrivalDate: Date.now() + 3600000,
    startCity: 'City A',
    endCity: 'City B',
    tripDuration: 3600000,
    firstRouteStation: 'Station A',
    lastRouteStation: 'Station B',
    carriages: [
      {
        name: 'Carriage 1',
        price: 50,
        freeSeats: 10,
      },
      {
        name: 'Carriage 2',
        price: 75,
        freeSeats: 5,
      },
    ],
    routeDetails: {
      routeId: 456,
      stopInfo: [
        {
          station: 'Station A',
          arrivalOnStation: undefined,
          departureFromStation: '2024-09-15T10:00:00Z',
          stopDuration: 'First station',
        },
        {
          station: 'Station B',
          arrivalOnStation: '2024-09-15T11:00:00Z',
          departureFromStation: undefined,
          stopDuration: 'Last station',
        },
      ],
    },
  };

  const dayTickets: DayTickets[] = [
    {
      date: Date.now(),
      tickets: [ticket],
    },
  ];

  beforeEach(() => {
    initialState = {
      tickets: [],
      error: null,
      status: null,
      isLoading: false,
    };
  });

  // Search actions

  it('should set loading status when search action is dispatched', () => {
    const action = searchActions.search({
      params: {
        fromLatitude: 1,
        fromLongitude: 1,
        toLatitude: 2,
        toLongitude: 2,
        time: 1000,
      },
    });
    const state = searchFeature.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should update tickets and set success status when searchSuccess action is dispatched', () => {
    const state = searchFeature.reducer(
      initialState,
      searchActions.searchSuccess({ tickets: dayTickets }),
    );

    expect(state).toEqual({
      tickets: dayTickets,
      error: null,
      status: 'success',
      isLoading: false,
    });
  });

  it('should set error and status when searchError action is dispatched', () => {
    const error = new HttpErrorResponse({ error: genericApiError });

    const state = searchFeature.reducer(
      initialState,
      searchActions.searchError({ error }),
    );

    expect(state).toEqual({
      ...initialState,
      error: genericApiError,
      status: 'error',
    });
  });

  it('should reset state to initial when reset action is dispatched', () => {
    const state = searchFeature.reducer(initialState, searchActions.reset());

    expect(state).toEqual(initialState);
  });
});
