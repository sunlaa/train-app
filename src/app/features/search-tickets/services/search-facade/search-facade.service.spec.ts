import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SearchFacadeService } from './search-facade.service';

describe('SearchFacadeService', () => {
  let service: SearchFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({})] });
    service = TestBed.inject(SearchFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
