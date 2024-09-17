import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import { MockCarriagesFacade, MockNotificationService } from '@/testing/mocks';

import {
  MockCarriagesData,
  MockCarriagesState,
} from '@/testing/mocks/carriages';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CarriagesFacadeService } from '../../services/carriages-facade.service';
import { CarriageFormComponent } from './carriage-form.component';

describe('CarriageFormComponent', () => {
  let component: CarriageFormComponent;
  let fixture: ComponentFixture<CarriageFormComponent>;
  let carriagesFacade: MockCarriagesFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriageFormComponent],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriageFormComponent);
    component = fixture.componentInstance;
    carriagesFacade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form when carriage input is provided', () => {
    const carriage = { ...MockCarriagesData.carriages[0] };
    component.carriage = carriage;
    component.ngOnChanges({
      carriage: {
        currentValue: carriage,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(component.carriageForm.value).toEqual({
      name: carriage.name,
      rows: carriage.rows,
      leftSeats: carriage.leftSeats,
      rightSeats: carriage.rightSeats,
    });
  });

  it('should disable save button if form is invalid', () => {
    component.carriageForm.controls.name.setValue('Aaa');
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(
      By.css('p-button[ng-reflect-label="Save"] button'),
    ).nativeElement;
    expect(saveButton.disabled).toBeTruthy();
  });

  it('should enable save button if form is valid', () => {
    component.carriageForm.setValue({
      name: 'New Carriage',
      rows: 10,
      leftSeats: 2,
      rightSeats: 2,
    });
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(
      By.css('p-button[ng-reflect-label="Save"]'),
    ).nativeElement;
    expect(saveButton.disabled).toBeFalsy();
  });

  it('should call create facade method on form submit if carriage is not provided', () => {
    const createSpy = jest
      .spyOn(carriagesFacade, 'create')
      .mockReturnValue(of(MockCarriagesState.successState));
    component.carriage = undefined;

    component.carriageForm.setValue({
      name: 'New Carriage',
      rows: 10,
      leftSeats: 2,
      rightSeats: 2,
    });

    component.onSubmit();

    expect(createSpy).toHaveBeenCalledWith({
      name: 'New Carriage',
      rows: 10,
      leftSeats: 2,
      rightSeats: 2,
    });
  });

  it('should call update facade method on form submit if carriage is provided', () => {
    const carriage = MockCarriagesData.carriages[0];
    const updateSpy = jest
      .spyOn(carriagesFacade, 'update')
      .mockReturnValue(of(MockCarriagesState.successState));
    component.carriage = carriage;

    component.carriageForm.setValue({
      name: 'Updated Carriage',
      rows: 10,
      leftSeats: 2,
      rightSeats: 2,
    });

    component.onSubmit();

    expect(updateSpy).toHaveBeenCalledWith({
      code: carriage.code,
      name: 'Updated Carriage',
      rows: 10,
      leftSeats: 2,
      rightSeats: 2,
    });
  });

  it('should emit closeForm when closeFormClick is called', () => {
    jest.spyOn(component.closeForm, 'emit');
    component.closeFormClick();
    expect(component.closeForm.emit).toHaveBeenCalled();
  });
});
