import { TestBed } from '@angular/core/testing';
import { MockStationsFacade } from '@/testing/mocks';
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
});
