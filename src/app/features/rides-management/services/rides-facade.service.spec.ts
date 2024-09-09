import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ridesFeature } from '@/redux/reducers';
import { MockRidesData, MockRidesState } from '@/testing/mocks/rides';
import { ridesActions } from '@/redux/actions';
import { RidesFacadeService } from './rides-facade.service';

describe('RidesFacadeService', () => {
  let service: RidesFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockRoutesState = MockRidesState.successState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(RidesFacadeService);
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(ridesFeature.selectRidesState, mockRoutesState);
    store.overrideSelector(ridesFeature.selectRoute, mockRoutesState.route);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch load action on load()', () => {
    const routeId = 1;
    service.load(routeId);
    expect(dispatchSpy).toHaveBeenCalledWith(ridesActions.load({ routeId }));
  });

  it('should dispatch create action on create()', () => {
    const routeId = 1;
    const ride = MockRidesData.rides[0];

    service.create(routeId, ride).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ridesActions.create({ routeId, ride }),
    );
  });

  it('should dispatch update action on update()', () => {
    const routeId = 1;
    const ride = MockRidesData.rides[0];

    service.update(routeId, ride).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ridesActions.update({ routeId, ride }),
    );
  });

  it('should dispatch delete action on delete()', () => {
    const routeId = 1;
    const rideId = 1;

    service.delete(routeId, rideId).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ridesActions.delete({ routeId, rideId }),
    );
  });

  it('should return state$ observable from store', (done) => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockRoutesState);
      done();
    });
  });

  it('should return route$ observable from store', (done) => {
    service.route$.subscribe((route) => {
      expect(route).toEqual(mockRoutesState.route);
      done();
    });
  });
});
