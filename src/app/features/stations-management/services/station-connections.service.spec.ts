import { TestBed } from '@angular/core/testing';
import { MockStationsData, MockStationsFacade } from '@/testing/mocks';
import { StationsFacadeService } from './stations-facade.service';

import { StationConnectionsService } from './station-connections.service';

describe('StationConnectionsService', () => {
  let service: StationConnectionsService;
  let facade: MockStationsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    });
    service = TestBed.inject(StationConnectionsService);
    facade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with stations', () => {
    const mockLength = MockStationsData.listedStations.length;
    facade.setStations(MockStationsData.listedStations);
    expect(service.stations.length).toBe(mockLength);
  });

  it('should connect a station', () => {
    facade.setStations(MockStationsData.listedStations);
    const mockLength = MockStationsData.listedStations.length;
    const stationId = 1;
    service.connectStation(stationId);
    expect(service.connectedStations.length).toBe(1);
    expect(service.disconnectedStations.length).toBe(mockLength - 1);
  });

  it('should disconnect a station', () => {
    facade.setStations(MockStationsData.listedStations);
    const mockLength = MockStationsData.listedStations.length;
    const stationId = 1;
    service.connectStation(stationId);
    service.disconnectStation(stationId);
    expect(service.connectedStations.length).toBe(0);
    expect(service.disconnectedStations.length).toBe(mockLength);
  });

  it('should reconnect a station', () => {
    facade.setStations(MockStationsData.listedStations);
    const mockLength = MockStationsData.listedStations.length;
    const connectId = 1;
    const reconnectId = 2;
    service.connectStation(connectId);
    service.reconnectStation(reconnectId, 0);
    expect(service.connectedStations.length).toBe(1);
    expect(service.disconnectedStations.length).toBe(mockLength - 1);
  });

  it('should reset connections', () => {
    facade.setStations(MockStationsData.listedStations);
    const mockLength = MockStationsData.listedStations.length;
    const stationId = 1;
    service.connectStation(stationId);
    service.resetConnections();
    expect(service.connectedStations.length).toBe(0);
    expect(service.disconnectedStations.length).toBe(mockLength);
  });

  it('should update station options correctly', () => {
    facade.setStations(MockStationsData.listedStations);
    service.connectStation(1);
    const options = service.stationOptions;
    expect(options.length).toBe(2);
  });
});
