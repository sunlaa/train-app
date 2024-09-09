import { TestBed } from '@angular/core/testing';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';

import { TStationListed } from '@/core/models/stations.model';
import { MockStationsData, MockStationsFacade } from '@/testing/mocks/stations';
import { StationsSectionService } from './stations-section.service';

describe('StationsSectionService', () => {
  let service: StationsSectionService;
  let stationsFacade: MockStationsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    });
    service = TestBed.inject(StationsSectionService);
    stationsFacade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load stations and update stationOptions', () => {
    const mockStations: TStationListed[] = MockStationsData.listedStations;

    service.loadStations();

    stationsFacade.setStations(mockStations);

    expect(service.stations).toEqual(mockStations);
    expect(service.stationOptions.length).toBeGreaterThan(0);
  });

  it('should update station options based on selected stations', () => {
    const mockStations: TStationListed[] = MockStationsData.listedStations;

    service.loadStations();

    stationsFacade.setStations(mockStations);

    const selectedOptions = [mockStations[0].id];

    service.updateStationOptions(selectedOptions);

    const expectedOptions = mockStations[0].connectedTo.map((s) => {
      const station = mockStations.find(({ id }) => id === s.id);
      const option = { value: station!.id, label: station!.city };
      expect.objectContaining({ value: station!.id, label: station!.city });
      return option;
    });
    expect(service.stationOptions[1]).toEqual(expectedOptions);
  });

  it('should update station options based on previous and next stations', () => {
    const mockStations: TStationListed[] = MockStationsData.listedStations;

    service.loadStations();

    stationsFacade.setStations(mockStations);

    const selectedOptions = [
      mockStations[0].id,
      mockStations[1].id,
      mockStations[2].id,
    ];

    service.updateStationOptions(selectedOptions);

    expect(service.stationOptions[0]).toEqual([{ label: 'city 1', value: 1 }]);
    expect(service.stationOptions[1]).toEqual([{ label: 'city 2', value: 2 }]);
    expect(service.stationOptions[2]).toEqual([{ label: 'city 3', value: 3 }]);
  });

  it('should handle empty station selection', () => {
    service.loadStations();
    service.updateStationOptions([]);

    expect(service.stationOptions[0].length).toEqual(service.stations.length);
  });
});
