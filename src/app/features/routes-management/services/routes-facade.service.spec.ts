import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { MockRoutesData, MockRoutesState } from '@/testing/mocks/routes';
import { routesFeature } from '@/redux/reducers';
import { routesActions } from '@/redux/actions';
import { RoutesFacadeService } from './routes-facade.service';

describe('RoutesFacadeService', () => {
  let service: RoutesFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockRoutesState = MockRoutesState.successState;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideMockStore({}) });
    service = TestBed.inject(RoutesFacadeService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(routesFeature.selectRoutesState, mockRoutesState);
    store.overrideSelector(routesFeature.selectRoutes, mockRoutesState.routes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch load action on load()', () => {
    service.load();
    expect(dispatchSpy).toHaveBeenCalledWith(routesActions.load());
  });

  it('should dispatch create action on create()', () => {
    const route = MockRoutesData.routes[0];

    service.create(route).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(routesActions.create({ route }));
  });

  it('should dispatch update action on update()', () => {
    const route = MockRoutesData.routes[0];

    service.update(route).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(routesActions.update({ route }));
  });

  it('should dispatch delete action on delete()', () => {
    const id = 1;

    service.delete(id).subscribe();

    expect(dispatchSpy).toHaveBeenCalledWith(routesActions.delete({ id }));
  });

  it('should return state$ observable from store', () => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockRoutesState);
    });
  });

  it('should return routes$ observable from store', () => {
    service.routes$.subscribe((routes) => {
      expect(routes).toEqual(mockRoutesState.routes);
    });
  });
});
