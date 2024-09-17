import { TestBed } from '@angular/core/testing';
import { searchActions } from '@/redux/actions/search.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { searchFeature } from '@/redux/reducers/search.reducer';
import { mockParams, MockSearchState } from '@/testing/mocks';

import { SearchFacadeService } from './search-facade.service';

describe('SearchFacadeService', () => {
  let service: SearchFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockSearchState = MockSearchState.successState;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({})] });
    service = TestBed.inject(SearchFacadeService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(searchFeature.selectSearchState, mockSearchState);

    store.overrideSelector(
      searchFeature.selectTickets,
      mockSearchState.tickets,
    );
    store.overrideSelector(searchFeature.selectStatus, mockSearchState.status);
    store.overrideSelector(searchFeature.selectError, mockSearchState.error);
    store.overrideSelector(
      searchFeature.selectIsLoading,
      mockSearchState.isLoading,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch search action on search()', () => {
    service.search(mockParams);
    expect(dispatchSpy).toHaveBeenCalledWith(
      searchActions.search({ params: mockParams }),
    );
  });

  it('should dispatch reset action on resetResults()', () => {
    service.resetResults();
    expect(dispatchSpy).toHaveBeenCalledWith(searchActions.reset());
  });

  it('should return state$ observable from store', () => {
    service.state$.subscribe((state) => {
      expect(state).toEqual(mockSearchState);
    });
  });

  it('should return tickets$ observable from store', () => {
    service.tickets$.subscribe((tickets) => {
      expect(tickets).toEqual(mockSearchState.tickets);
    });
  });

  it('should return status$ observable from store', () => {
    service.status$.subscribe((status) => {
      expect(status).toEqual(mockSearchState.status);
    });
  });

  it('should return isLoading$ observable from store', () => {
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toEqual(mockSearchState.isLoading);
    });
  });
});
