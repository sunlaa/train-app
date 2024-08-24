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
      date: '2024-08-25',
      tickets: [
        {
          departureDate: new Date('2024-08-25T08:00:00'),
          arrivalDate: new Date('2024-08-25T12:00:00'),
          startCity: 'New York',
          endCity: 'Boston',
          tripDuration: 14400000,
          firstRouteStation: 'London',
          lastRouteStation: 'Minsk',
          carriages: [
            { type: 'Economy', price: 50, freeSeats: 30 },
            { type: 'Business', price: 100, freeSeats: 10 },
            { type: 'Economy', price: 50, freeSeats: 30 },
            { type: 'Business', price: 100, freeSeats: 10 },
            { type: 'Economy', price: 50, freeSeats: 30 },
          ],
          routeDetails: {
            routeId: 1,
            stopInfo: [
              {
                station: 'New York',
                departureTime: '08:00',
                arrivalTime: undefined,
                duration: 'First station',
              },
              {
                station: 'New Haven',
                departureTime: '10:00',
                arrivalTime: '09:45',
                duration: 900000,
              },
              {
                station: 'Providence',
                departureTime: '11:15',
                arrivalTime: '11:00',
                duration: 600000,
              },
              {
                station: 'Boston',
                departureTime: undefined,
                arrivalTime: '12:00',
                duration: 'Last station',
              },
            ],
          },
        },
        {
          departureDate: new Date('2024-08-25T10:00:00'),
          arrivalDate: new Date('2024-08-25T14:00:00'),
          startCity: 'Chicago',
          endCity: 'Detroit',
          tripDuration: 14400000,
          firstRouteStation: 'Paris',
          lastRouteStation: 'Amsterdam',
          carriages: [
            { type: 'Economy', price: 55, freeSeats: 25 },
            { type: 'Business', price: 110, freeSeats: 8 },
          ],
          routeDetails: {
            routeId: 2,
            stopInfo: [
              {
                station: 'Chicago',
                departureTime: '10:00',
                arrivalTime: undefined,
                duration: 'First station',
              },
              {
                station: 'South Bend',
                departureTime: '12:15',
                arrivalTime: '12:00',
                duration: 600000,
              },
              {
                station: 'Toledo',
                departureTime: '13:15',
                arrivalTime: '13:00',
                duration: 600000,
              },
              {
                station: 'Detroit',
                departureTime: undefined,
                arrivalTime: '14:00',
                duration: 'Last station',
              },
            ],
          },
        },
        {
          departureDate: new Date('2024-08-25T16:00:00'),
          arrivalDate: new Date('2024-08-25T19:30:00'),
          startCity: 'Philadelphia',
          endCity: 'Washington D.C.',
          tripDuration: 12600000,
          firstRouteStation: 'Philadelphia',
          lastRouteStation: 'Washington D.C.',
          carriages: [
            { type: 'Economy', price: 50, freeSeats: 20 },
            { type: 'Business', price: 100, freeSeats: 7 },
          ],
          routeDetails: {
            routeId: 3,
            stopInfo: [
              {
                station: 'Philadelphia',
                departureTime: '16:00',
                arrivalTime: undefined,
                duration: 'First station',
              },
              {
                station: 'Baltimore',
                departureTime: '18:00',
                arrivalTime: '17:45',
                duration: 900000,
              },
              {
                station: 'South Bend',
                departureTime: '12:15',
                arrivalTime: '12:00',
                duration: 600000,
              },
              {
                station: 'Toledo',
                departureTime: '13:15',
                arrivalTime: '13:00',
                duration: 600000,
              },
              {
                station: 'Washington D.C.',
                departureTime: undefined,
                arrivalTime: '19:30',
                duration: 'Last station',
              },
            ],
          },
        },
      ],
    },
    {
      date: '2024-08-26',
      tickets: [
        {
          departureDate: new Date('2024-08-26T09:00:00'),
          arrivalDate: new Date('2024-08-26T13:00:00'),
          startCity: 'San Francisco',
          endCity: 'Los Angeles',
          tripDuration: 14400000,
          firstRouteStation: 'San Francisco',
          lastRouteStation: 'Los Angeles',
          carriages: [
            { type: 'Economy', price: 70, freeSeats: 20 },
            { type: 'Business', price: 140, freeSeats: 5 },
          ],
          routeDetails: {
            routeId: 4,
            stopInfo: [
              {
                station: 'San Francisco',
                departureTime: '09:00',
                arrivalTime: undefined,
                duration: 'First station',
              },
              {
                station: 'San Jose',
                departureTime: '11:00',
                arrivalTime: '10:45',
                duration: 900000,
              },
              {
                station: 'Bakersfield',
                departureTime: '12:45',
                arrivalTime: '12:30',
                duration: 900000,
              },
              {
                station: 'Los Angeles',
                departureTime: undefined,
                arrivalTime: '13:00',
                duration: 'Last station',
              },
            ],
          },
        },
        {
          departureDate: new Date('2024-08-26T15:00:00'),
          arrivalDate: new Date('2024-08-26T19:00:00'),
          startCity: 'Seattle',
          endCity: 'Portland',
          tripDuration: 14400000,
          firstRouteStation: 'Seattle',
          lastRouteStation: 'Portland',
          carriages: [
            { type: 'Economy', price: 65, freeSeats: 15 },
            { type: 'Business', price: 130, freeSeats: 6 },
          ],
          routeDetails: {
            routeId: 5,
            stopInfo: [
              {
                station: 'Seattle',
                departureTime: '15:00',
                arrivalTime: undefined,
                duration: 'First station',
              },
              {
                station: 'Tacoma',
                departureTime: '17:00',
                arrivalTime: '16:45',
                duration: 900000,
              },
              {
                station: 'Vancouver',
                departureTime: '18:15',
                arrivalTime: '18:00',
                duration: 900000,
              },
              {
                station: 'Portland',
                departureTime: undefined,
                arrivalTime: '19:00',
                duration: 'Last station',
              },
            ],
          },
        },
      ],
    },
    { date: '2024-08-27', tickets: [] },
    { date: '2024-08-28', tickets: [] },
    { date: '2024-08-29', tickets: [] },
    { date: '2024-08-30', tickets: [] },
    { date: '2024-09-01', tickets: [] },
    { date: '2024-09-02', tickets: [] },
    { date: '2024-09-03', tickets: [] },
    { date: '2024-09-04', tickets: [] },
    { date: '2024-09-05', tickets: [] },
    { date: '2024-09-06', tickets: [] },
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
