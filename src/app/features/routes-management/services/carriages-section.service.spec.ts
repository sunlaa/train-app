import { TestBed } from '@angular/core/testing';
import { MockCarriagesFacade } from '@/testing/mocks';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';

import {
  MockCarriagesData,
  MockCarriagesState,
} from '@/testing/mocks/carriages';
import { CarriagesSectionService } from './carriages-section.service';

describe('CarriagesSectionService', () => {
  let service: CarriagesSectionService;
  let carriagesFacade: MockCarriagesFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
      ],
    });
    service = TestBed.inject(CarriagesSectionService);
    carriagesFacade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load carriages and populate carriageOptions', () => {
    const expectedOptions = MockCarriagesData.carriages.map((carriage) => ({
      label: carriage.name,
      value: carriage.code,
    }));

    service.loadCarriages();
    carriagesFacade.setState(MockCarriagesState.successState);

    expect(service.carriages).toEqual(MockCarriagesData.carriages);
    expect(service.carriageOptions).toEqual(expectedOptions);
  });

  it('should call load method on carriagesFacade', () => {
    jest.spyOn(carriagesFacade, 'load');
    service.loadCarriages();
    expect(carriagesFacade.load).toHaveBeenCalled();
  });
});
