import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProfileFacadeService } from './features/profile/services/profile-facade.service';
import { MockProfileFacade } from './testing/mocks';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ProfileFacadeService, useClass: MockProfileFacade },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the 'train-app' title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('train-app');
  });
});
