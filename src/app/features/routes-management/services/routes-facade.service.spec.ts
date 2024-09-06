import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { RoutesFacadeService } from './routes-facade.service';

describe('RoutesFacadeService', () => {
  let service: RoutesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({})] });
    service = TestBed.inject(RoutesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
