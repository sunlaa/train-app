import { StationsService } from '@/features/stations-management/services/stations.service';
import { MockStationsData } from '@/testing/mocks';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { stationsActions } from '../actions';
import { StationsEffects } from './stations.effects';

describe('StationsEffects', () => {
  let actions$: Actions<Action<string>>;
  let effects: StationsEffects;
  let stationsService: jest.Mocked<StationsService>;

  const mockStations = MockStationsData.listedStations;

  const newStation = MockStationsData.creationStations[0];

  beforeEach(() => {
    const stationsServiceMock = {
      getStations: jest.fn(),
      createStation: jest.fn(),
      deleteStation: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        StationsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: StationsService, useValue: stationsServiceMock },
      ],
    });

    effects = TestBed.inject(StationsEffects);
    stationsService = TestBed.inject(
      StationsService,
    ) as jest.Mocked<StationsService>;
  });

  it('should dispatch loadSuccess on successful station load', (done) => {
    stationsService.getStations.mockReturnValue(of(mockStations));
    actions$ = of(stationsActions.load());

    effects.loadStations$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.loadSuccess({ stations: mockStations }),
      );
      done();
    });
  });

  it('should dispatch loadError on failed station load', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    stationsService.getStations.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(stationsActions.load());

    effects.loadStations$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.loadError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch createSuccess on successful station creation', (done) => {
    stationsService.createStation.mockReturnValue(of(newStation));
    stationsService.getStations.mockReturnValue(of(mockStations));
    actions$ = of(
      stationsActions.create({
        station: newStation,
      }),
    );

    effects.createStation$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.createSuccess({ stations: mockStations }),
      );
      done();
    });
  });

  it('should dispatch createError on failed station creation', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Create Error' });
    stationsService.createStation.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(
      stationsActions.create({
        station: MockStationsData.creationStations[0],
      }),
    );

    effects.createStation$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.createError({ error: errorResponse }),
      );
      done();
    });
  });

  it('should dispatch deleteSuccess on successful station deletion', (done) => {
    stationsService.deleteStation.mockReturnValue(of(undefined));
    actions$ = of(stationsActions.delete({ id: 1 }));

    effects.deleteStation$.subscribe((result) => {
      expect(result).toEqual(stationsActions.deleteSuccess({ id: 1 }));
      done();
    });
  });

  it('should dispatch deleteError on failed station deletion', (done) => {
    const errorResponse = new HttpErrorResponse({ error: 'Delete Error' });
    stationsService.deleteStation.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(stationsActions.delete({ id: 1 }));

    effects.deleteStation$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.deleteError({ error: errorResponse }),
      );
      done();
    });
  });
});
