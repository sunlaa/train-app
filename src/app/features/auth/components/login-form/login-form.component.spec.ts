import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockAuthService } from '@/testing/mocks';
import { AuthService } from '../../services/auth.service';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
