import { TestBed } from '@angular/core/testing';
import { MockStationsData, MockStationsFacade } from '@/testing/mocks';
import { StationsFacadeService } from './stations-facade.service';

import { StationConnectionsService } from './station-connections.service';

describe('StationConnectionsService', () => {
  let service: StationConnectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    });
    service = TestBed.inject(StationConnectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with stations', () => {
    const mockLength = MockStationsData.listedStations.length;
    expect(service.stations.length).toBe(mockLength);
  });

  it('should connect a station', () => {
    const mockLength = MockStationsData.listedStations.length;
    const stationId = 1;
    service.connectStation(stationId);
    expect(service.connectedStations.length).toBe(1);
    expect(service.disconnectedStations.length).toBe(mockLength - 1);
  });

  it('should disconnect a station', () => {
    const mockLength = MockStationsData.listedStations.length;
    const stationId = 1;
    service.connectStation(stationId);
    service.disconnectStation(stationId);
    expect(service.connectedStations.length).toBe(0);
    expect(service.disconnectedStations.length).toBe(mockLength);
  });

  it('should reconnect a station', () => {
    const mockLength = MockStationsData.listedStations.length;
    const connectId = 1;
    const reconnectId = 2;
    service.connectStation(connectId);
    service.reconnectStation(reconnectId, 0);
    expect(service.connectedStations.length).toBe(1);
    expect(service.disconnectedStations.length).toBe(mockLength - 1);
  });

  it('should reset connections', () => {
    const mockLength = MockStationsData.listedStations.length;
    const stationId = 1;
    service.connectStation(stationId);
    service.resetConnections();
    expect(service.connectedStations.length).toBe(0);
    expect(service.disconnectedStations.length).toBe(mockLength);
  });

  it('should update station options correctly', () => {
    service.connectStation(1);
    const options = service.stationOptions;
    expect(options.length).toBe(2);
  });
});
