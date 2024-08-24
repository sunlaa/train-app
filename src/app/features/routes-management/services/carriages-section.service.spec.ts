import { TestBed } from '@angular/core/testing';

import { CarriagesSectionService } from './carriages-section.service';

describe('CarriagesSectionService', () => {
  let service: CarriagesSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarriagesSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
