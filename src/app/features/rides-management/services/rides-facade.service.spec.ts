import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { RidesFacadeService } from './rides-facade.service';

describe('RidesFacadeService', () => {
  let service: RidesFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(RidesFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
