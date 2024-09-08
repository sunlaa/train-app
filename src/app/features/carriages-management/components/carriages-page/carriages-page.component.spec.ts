import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockCarriagesFacade } from '@/testing/mocks';
import { MessageService } from 'primeng/api';

import {
  MockCarriagesData,
  MockCarriagesState,
} from '@/testing/mocks/carriages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { CarriagesFacadeService } from '../../services/carriages-facade.service';
import { CarriagesPageComponent } from './carriages-page.component';

describe('CarriagesPageComponent', () => {
  let component: CarriagesPageComponent;
  let fixture: ComponentFixture<CarriagesPageComponent>;
  let facade: MockCarriagesFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesPageComponent, BrowserAnimationsModule],
      providers: [
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesPageComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner when no carriages are available', () => {
    component.totalCarriages = 0;
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('p-progressSpinner');
    expect(spinner).toBeTruthy();
  });

  it('should display carriages when data is available', () => {
    const { carriages } = MockCarriagesData;
    facade.setState({ ...MockCarriagesState.successState, carriages });

    fixture.detectChanges();

    const carriageItems =
      fixture.nativeElement.querySelectorAll('app-carriage-item');
    expect(carriageItems.length).toBe(carriages.length);
  });

  it('should update pageCarriages on page change', () => {
    const { carriages } = MockCarriagesData;
    facade.setState({ ...MockCarriagesState.successState, carriages });
    component.onPageChange({ first: 1, rows: 1 });
    fixture.detectChanges();

    expect(component.pageCarriages.length).toBe(1);
    expect(component.pageCarriages[0].code).toBe('B2');
  });

  it('should display form for editing a carriage', () => {
    facade.setState(MockCarriagesState.successState);
    const mockCarriage = MockCarriagesData.carriages[0];
    component.editCarriageClick(mockCarriage);
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('app-carriage-form'));
    expect(form).toBeTruthy();
    expect(component.formCarriage).toEqual(mockCarriage);
  });

  it('should show form when "Create" button is clicked', () => {
    component.createCarriageClick();

    expect(component.formToggle).toBeTruthy();
    expect(component.formCarriage).toBeUndefined();
  });

  it('should remove carriage and hide form when a carriage is deleted', () => {
    const mockCarriage = MockCarriagesData.carriages[0];
    component.formCarriage = mockCarriage;
    component.formToggle = true;
    component.deleteCarriage(mockCarriage);
    fixture.detectChanges();

    expect(component.formCarriage).toBeUndefined();
    expect(component.formToggle).toBeFalsy();
  });
});
