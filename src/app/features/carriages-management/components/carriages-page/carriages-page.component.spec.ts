import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';

import { CarriagesPageComponent } from './carriages-page.component';

describe('CarriagesPageComponent', () => {
  let component: CarriagesPageComponent;
  let fixture: ComponentFixture<CarriagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesPageComponent],
      providers: [provideMockStore({}), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
