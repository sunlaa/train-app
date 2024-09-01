import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notGuestGuard } from './not-guest.guard';

describe('notGuestGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => notGuestGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
