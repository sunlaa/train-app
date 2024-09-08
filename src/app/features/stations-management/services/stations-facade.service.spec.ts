import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { stationsFeature } from '@/redux/reducers';
import { stationsActions } from '@/redux/actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { MockStationsData, MockStationsState } from '@/testing/mocks';
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
