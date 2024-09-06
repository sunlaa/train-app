import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestroyService } from '@/core/services/destroy/destroy.service';
import { provideRouter } from '@angular/router';
import { MockAuthService } from '@/testing/mocks';
import { AuthService } from '../../services/auth.service';

import { RegisterFormComponent } from './register-form.component';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        DestroyService,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
