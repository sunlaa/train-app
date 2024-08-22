import { createReducer, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { TCarriage } from '@/core/models/carriages.model';
import {
  createCarriage,
  createCarriageError,
  createCarriageSuccess,
  deleteCarriage,
  deleteCarriageError,
  deleteCarriageSuccess,
  loadCarriages,
  loadCarriagesError,
  loadCarriagesSuccess,
  updateCarriage,
  updateCarriageError,
  updateCarriageSuccess,
} from '../actions/carriages.actions';

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

export const carriagesReducer = createReducer(
  initialState,
  // Load carriages
  on(
    loadCarriages,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    loadCarriagesSuccess,
    (state, { carriages }): CarriagesState => ({
      carriages,
      error: null,
      status: 'success',
    }),
  ),
  on(
    loadCarriagesError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create carriage
  on(
    createCarriage,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    createCarriageSuccess,
    (state, { carriage }): CarriagesState => ({
      carriages: [...state.carriages, carriage],
      error: null,
      status: 'success',
    }),
  ),
  on(
    createCarriageError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Update carriage
  on(
    updateCarriage,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    updateCarriageSuccess,
    (state, { carriage }): CarriagesState => ({
      carriages: state.carriages.map((storeCarriage) =>
        storeCarriage.code === carriage.code ? carriage : storeCarriage,
      ),
      error: null,
      status: 'success',
    }),
  ),
  on(
    updateCarriageError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete carriage
  on(
    deleteCarriage,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    deleteCarriageSuccess,
    (state, { code }): CarriagesState => ({
      carriages: state.carriages.filter((carriage) => carriage.code !== code),
      error: null,
      status: 'success',
    }),
  ),
  on(
    deleteCarriageError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
);
