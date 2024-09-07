import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { carriagesFeature } from '@/redux/reducers';
import {
  MockCarriagesData,
  MockCarriagesState,
} from '@/testing/mocks/carriages';
import { carriagesActions } from '@/redux/actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarriagesFacadeService } from './carriages-facade.service';

jest.mock('@angular/core/rxjs-interop', () => ({
  toSignal: jest.fn(),
}));

describe('CarriagesFacadeService', () => {
  let service: CarriagesFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockCarriagesState = MockCarriagesState.successState;

  const mockCarriageMap = MockCarriagesData.carriageMap;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideMockStore({}) });
    service = TestBed.inject(CarriagesFacadeService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(
      carriagesFeature.selectCarriagesState,
      mockCarriagesState,
    );
    store.overrideSelector(
      carriagesFeature.selectCarriages,
      mockCarriagesState.carriages,
    );
    store.overrideSelector(carriagesFeature.selectCarriageMap, mockCarriageMap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch load action on load()', () => {
    service.load();
    expect(dispatchSpy).toHaveBeenCalledWith(carriagesActions.load());
  });

  it('should dispatch create action on create()', () => {
    const carriage = MockCarriagesData.carriages[0];

    service.create(carriage).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      carriagesActions.create({ carriage }),
    );
  });

  it('should dispatch update action on update()', () => {
    const carriage = MockCarriagesData.carriages[0];

    service.update(carriage).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      carriagesActions.update({ carriage }),
    );
  });

  it('should dispatch delete action on delete()', () => {
    const carriageCode = 'A1';

    service.delete(carriageCode).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      carriagesActions.delete({ code: carriageCode }),
    );
  });

  it('should update stationMap signal on updateMap()', () => {
    (toSignal as jest.Mock).mockReturnValue(() => mockCarriageMap);

    service.updateMap();

    expect(service.carriageMap()).toEqual(mockCarriageMap);
  });

  it('should return state$ observable from store', () => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockCarriagesState);
    });
  });

  it('should return carriages$ observable from store', () => {
    service.carriages$.subscribe((carriages) => {
      expect(carriages).toEqual(mockCarriagesState.carriages);
    });
  });

  it('should return carriageMap$ observable from store', () => {
    service.carriageMap$.subscribe((carriageMap) => {
      expect(carriageMap).toEqual(mockCarriageMap);
    });
  });
});
