import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tripQueryGuard } from './trip-query.guard';

describe('tripQueryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => tripQueryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
