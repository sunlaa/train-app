import { TestBed } from '@angular/core/testing';

import { RidesFacadeService } from './rides-facade.service';

describe('RidesFacadeService', () => {
  let service: RidesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RidesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
