import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { stationsFeature } from '@/redux/reducers';
import { stationsActions } from '@/redux/actions';
import { StationsEffects } from '@/redux/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { toSignal } from '@angular/core/rxjs-interop';
import { MockStationsData, MockStationsState } from '@/testing/mocks';
import { StationsService } from './stations.service';
import { StationsFacadeService } from './stations-facade.service';

jest.mock('@angular/core/rxjs-interop', () => ({
  toSignal: jest.fn(),
}));

describe('StationsFacadeService', () => {
  let service: StationsFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockStationsState = MockStationsState.successState;

  const mockStationMap = MockStationsData.stationMaps[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(StationsFacadeService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(
      stationsFeature.selectStationsState,
      mockStationsState,
    );
    store.overrideSelector(
      stationsFeature.selectStations,
      mockStationsState.stations,
    );
    store.overrideSelector(stationsFeature.selectStationMap, mockStationMap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch load action on load()', () => {
    service.load();
    expect(dispatchSpy).toHaveBeenCalledWith(stationsActions.load());
  });

  it('should dispatch create action on create()', () => {
    const newStation = MockStationsData.creationStations[0];

    service.create(newStation).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      stationsActions.create({ station: newStation }),
    );
  });

  it('should dispatch delete action on delete()', () => {
    const stationId = 1;

    service.delete(stationId).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      stationsActions.delete({ id: stationId }),
    );
  });

  it('should update stationMap signal on updateMap()', () => {
    (toSignal as jest.Mock).mockReturnValue(() => mockStationMap);

    service.updateMap();

    expect(service.stationMap()).toEqual(mockStationMap);
  });

  it('should return state$ observable from store', () => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockStationsState);
    });
  });

  it('should return stations$ observable from store', () => {
    service.stations$.subscribe((stations) => {
      expect(stations).toEqual(mockStationsState.stations);
    });
  });

  it('should return stationsMap$ observable from store', () => {
    service.stationsMap$.subscribe((stationMap) => {
      expect(stationMap).toEqual(mockStationMap);
    });
  });
});

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

  it('should dispatch loadSuccess on successful station load', () => {
    stationsService.getStations.mockReturnValue(of(mockStations));
    actions$ = of(stationsActions.load());

    effects.loadStations$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.loadSuccess({ stations: mockStations }),
      );
    });
  });

  it('should dispatch loadError on failed station load', () => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    stationsService.getStations.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(stationsActions.load());

    effects.loadStations$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.loadError({ error: errorResponse }),
      );
    });
  });

  it('should dispatch createSuccess on successful station creation', () => {
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
    });
  });

  it('should dispatch createError on failed station creation', () => {
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
    });
  });

  it('should dispatch deleteSuccess on successful station deletion', () => {
    stationsService.deleteStation.mockReturnValue(of());
    actions$ = of(stationsActions.delete({ id: 1 }));

    effects.deleteStation$.subscribe((result) => {
      expect(result).toEqual(stationsActions.deleteSuccess({ id: 1 }));
    });
  });

  it('should dispatch deleteError on failed station deletion', () => {
    const errorResponse = new HttpErrorResponse({ error: 'Delete Error' });
    stationsService.deleteStation.mockReturnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(stationsActions.delete({ id: 1 }));

    effects.deleteStation$.subscribe((result) => {
      expect(result).toEqual(
        stationsActions.deleteError({ error: errorResponse }),
      );
    });
  });
});
