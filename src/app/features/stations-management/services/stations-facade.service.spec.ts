import { TestBed } from '@angular/core/testing';

import { StationsFacadeService } from './stations-facade.service';

describe('StationsFacadeService', () => {
  let service: StationsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
