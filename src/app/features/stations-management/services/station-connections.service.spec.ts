import { TestBed } from '@angular/core/testing';

import { StationConnectionsService } from './station-connections.service';

describe('StationConnectionsService', () => {
  let service: StationConnectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationConnectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
