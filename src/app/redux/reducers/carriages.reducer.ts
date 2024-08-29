import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ApiError } from '@/core/models/api.model';
import { CarriageMap, TCarriage } from '@/core/models/carriages.model';
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
    carriagesActions.load,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.loadSuccess,
    (state, { carriages }): CarriagesState => ({
      carriages,
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.loadError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Create carriage
  on(
    carriagesActions.create,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.createSuccess,
    (state, { carriage }): CarriagesState => ({
      carriages: [...state.carriages, carriage],
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.createError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Update carriage
  on(
    carriagesActions.update,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.updateSuccess,
    (state, { carriage }): CarriagesState => ({
      carriages: state.carriages.map((storeCarriage) =>
        storeCarriage.code === carriage.code ? carriage : storeCarriage,
      ),
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.updateError,
    (state, { error }): CarriagesState => ({
      ...state,
      error: error.error,
      status: 'error',
    }),
  ),
  // Delete carriage
  on(
    carriagesActions.delete,
    (state): CarriagesState => ({ ...state, status: 'loading' }),
  ),
  on(
    carriagesActions.deleteSuccess,
    (state, { code }): CarriagesState => ({
      carriages: state.carriages.filter((carriage) => carriage.code !== code),
      error: null,
      status: 'success',
    }),
  ),
  on(
    carriagesActions.deleteError,
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
  extraSelectors: ({ selectCarriages }) => ({
    selectCarriageMap: createSelector(selectCarriages, (carriages) => {
      return carriages.reduce<CarriageMap>((acc, carriage) => {
        const { rightSeats, leftSeats, rows } = carriage;
        const map = acc;
        const seats = (rightSeats + leftSeats) * rows;
        map[carriage.code] = { ...carriage, seats };
        return map;
      }, {});
    }),
  }),
});
