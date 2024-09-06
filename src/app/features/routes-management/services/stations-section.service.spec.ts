import { TestBed } from '@angular/core/testing';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { MockStationsFacade } from '@/testing/mocks';

import { StationsSectionService } from './stations-section.service';

describe('StationsSectionService', () => {
  let service: StationsSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    });
    service = TestBed.inject(StationsSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
