import { TestBed } from '@angular/core/testing';

import { StationsSectionService } from './stations-section.service';

describe('StationsSectionService', () => {
  let service: StationsSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationsSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
