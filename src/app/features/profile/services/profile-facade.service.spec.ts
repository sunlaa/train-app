import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { ProfileFacadeService } from './profile-facade.service';

describe('ProfileFacadeService', () => {
  let service: ProfileFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})],
    });
    service = TestBed.inject(ProfileFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
