import { TestBed } from '@angular/core/testing';

import { RoutesFacadeService } from './routes-facade.service';

describe('RoutesFacadeService', () => {
  let service: RoutesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
