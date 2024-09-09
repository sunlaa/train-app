import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { RidesService } from '@/features/rides-management/services/rides.service';
import { MockRidesData } from '@/testing/mocks/rides';
import { TRide } from '@/core/models/rides.model';
import { RidesEffects } from './rides.effects';
import { ridesActions } from '../actions';

describe('RidesEffects', () => {
  let actions$: Actions<Action<string>>;
  let effects: RidesEffects;
  let ridesService: jest.Mocked<RidesService>;

  const mockRoute = MockRidesData.routeRides;

  beforeEach(() => {
    const ridesServiceMock = {
      getRouteRides: jest.fn(),
      createRide: jest.fn(),
      updateRide: jest.fn(),
      deleteRide: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RidesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: RidesService, useValue: ridesServiceMock },
      ],
    });

    effects = TestBed.inject(RidesEffects);
    ridesService = TestBed.inject(RidesService) as jest.Mocked<RidesService>;
  });

  it('should dispatch loadSuccess on successful route rides load', (done) => {
    ridesService.getRouteRides.mockReturnValue(of(mockRoute));
    actions$ = of(ridesActions.load({ routeId: mockRoute.id }));

    effects.loadRouteRides$.subscribe((result) => {
      expect(result).toEqual(ridesActions.loadSuccess({ route: mockRoute }));
      done();
    });
  });

  it('should dispatch loadError on failed route rides load', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    ridesService.getRouteRides.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(ridesActions.load({ routeId: mockRoute.id }));

    effects.loadRouteRides$.subscribe((result) => {
      expect(result).toEqual(ridesActions.loadError({ error: errorResponse }));
      done();
    });
  });

  it('should dispatch createSuccess on successful ride creation', (done) => {
    const ride = MockRidesData.rides[0];
    ridesService.createRide.mockReturnValue(of(mockRoute));
    actions$ = of(ridesActions.create({ routeId: mockRoute.id, ride }));

    effects.createRide$.subscribe((result) => {
      expect(result).toEqual(ridesActions.createSuccess({ ride }));
      done();
    });
  });

  it('should dispatch createError on failed ride creation', (done) => {
    const ride = MockRidesData.rides[0];
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    ridesService.createRide.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(
      ridesActions.create({
        routeId: mockRoute.id,
        ride,
      }),
    );

    effects.createRide$.subscribe((result) => {
      expect(result).toEqual(
        ridesActions.createError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch updateSuccess on successful ride update', (done) => {
    const { rideId, ...rideBody } = mockRoute.schedule[0];
    const ride: TRide = {
      ...rideBody,
      id: rideId,
    };
    ridesService.updateRide.mockReturnValue(of(undefined));
    actions$ = of(
      ridesActions.update({
        routeId: mockRoute.id,
        ride,
      }),
    );

    effects.updateRide$.subscribe((result) => {
      expect(result).toEqual(ridesActions.updateSuccess({ ride }));
      done();
    });
  });

  it('should dispatch updateError on failed ride update', (done) => {
    const { rideId, ...rideBody } = mockRoute.schedule[0];
    const ride: TRide = {
      ...rideBody,
      id: rideId,
    };
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    ridesService.updateRide.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(
      ridesActions.update({
        routeId: mockRoute.id,
        ride,
      }),
    );

    effects.updateRide$.subscribe((result) => {
      expect(result).toEqual(
        ridesActions.updateError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch deleteSuccess on successful ride deletion', (done) => {
    const { rideId } = mockRoute.schedule[0];
    ridesService.deleteRide.mockReturnValue(of({ id: rideId }));
    actions$ = of(ridesActions.delete({ routeId: mockRoute.id, rideId }));

    effects.deleteRide$.subscribe((result) => {
      expect(result).toEqual(ridesActions.deleteSuccess({ rideId }));
      done();
    });
  });

  it('should dispatch deleteError on failed ride deletion', (done) => {
    const { rideId } = mockRoute.schedule[0];
    const errorResponse = new HttpErrorResponse({ error: 'Delete Error' });
    ridesService.deleteRide.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(ridesActions.delete({ routeId: mockRoute.id, rideId }));

    effects.deleteRide$.subscribe((result) => {
      expect(result).toEqual(
        ridesActions.deleteError({ error: errorResponse }),
      );
      done();
    });
  });
});
