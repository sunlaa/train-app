import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SearchService } from '@/features/search-tickets/services/search/search.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { handledMockResponse, mockParams } from '@/testing/mocks';
import { searchActions } from '../actions/search.actions';

import { SearchEffects } from './search.effects';

describe('StationsEffects', () => {
  let effects: SearchEffects;
  let actions$: Actions<Action<string>>;
  let searchService: jest.Mocked<SearchService>;

  beforeEach(() => {
    const searchServiceMock = {
      search: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        provideMockStore({}),
        { provide: SearchService, useValue: searchServiceMock },
      ],
    });

    effects = TestBed.inject(SearchEffects);
    searchService = TestBed.inject(SearchService) as jest.Mocked<SearchService>;
  });

  it('should dispatch updateProfileSuccess on successful search', async () => {
    searchService.search.mockReturnValue(of(handledMockResponse));

    actions$ = of(searchActions.search({ params: mockParams }));

    const result = firstValueFrom(effects.search$);

    expect(await result).toEqual(
      searchActions.searchSuccess({ tickets: handledMockResponse }),
    );
  });

  it('should dispatch searchError on failed search', async () => {
    const errorResponse = new HttpErrorResponse({ error: 'Error' });
    searchService.search.mockReturnValue(throwError(() => errorResponse));
    actions$ = of(searchActions.search({ params: mockParams }));

    const result = firstValueFrom(effects.search$);

    expect(await result).toEqual(
      searchActions.searchError({ error: errorResponse }),
    );
  });
});
