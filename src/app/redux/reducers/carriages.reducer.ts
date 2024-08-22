import { createFeature, createReducer, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { TCarriage } from '@/core/models/carriages.model';
import { carriagesActions } from '../actions';

export type CarriagesState = {
  carriages: TCarriage[];
  error: ApiError | null;
  status: 'loading' | 'error' | 'success';
};

const initialState: CarriagesState = {
  carriages: [],
  error: null,
  status: 'loading',
};

const carriagesReducer = createReducer(
  initialState,
  // Load carriages
  on(
    carriagesActions.loadCarriages,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.loadCarriagesSuccess,
    (state, { carriages }): CarriagesState => ({
      carriages,
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.loadCarriagesError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create carriage
  on(
    carriagesActions.createCarriage,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.createCarriageSuccess,
    (state, { carriage }): CarriagesState => ({
      carriages: [...state.carriages, carriage],
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.createCarriageError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Update carriage
  on(
    carriagesActions.updateCarriage,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.updateCarriageSuccess,
    (state, { carriage }): CarriagesState => ({
      carriages: state.carriages.map((storeCarriage) =>
        storeCarriage.code === carriage.code ? carriage : storeCarriage,
      ),
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.updateCarriageError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete carriage
  on(
    carriagesActions.deleteCarriage,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.deleteCarriageSuccess,
    (state, { code }): CarriagesState => ({
      carriages: state.carriages.filter((carriage) => carriage.code !== code),
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.deleteCarriageError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);

export const carriagesFeature = createFeature({
  name: 'carriages',
  reducer: carriagesReducer,
});
