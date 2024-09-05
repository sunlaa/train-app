import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockCarriagesFacade } from '@/testing/mocks';
import { MessageService } from 'primeng/api';

import { CarriagesPageComponent } from './carriages-page.component';
import { CarriagesFacadeService } from '../../services/carriages-facade.service';

describe('CarriagesPageComponent', () => {
  let component: CarriagesPageComponent;
  let fixture: ComponentFixture<CarriagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesPageComponent],
      providers: [
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
