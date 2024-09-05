import { TestBed } from '@angular/core/testing';
import { MockCarriagesFacade } from '@/testing/mocks';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';

import { CarriagesSectionService } from './carriages-section.service';

describe('CarriagesSectionService', () => {
  let service: CarriagesSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
      ],
    });
    service = TestBed.inject(CarriagesSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
