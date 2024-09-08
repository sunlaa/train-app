import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockCarriagesFacade, MockNotificationService } from '@/testing/mocks';
import {
  MockCarriagesData,
  MockCarriagesState,
} from '@/testing/mocks/carriages';
import { By } from '@angular/platform-browser';
import { CarriagesFacadeService } from '../../services/carriages-facade.service';

import { CarriageItemComponent } from './carriage-item.component';

describe('CarriageItemComponent', () => {
  let component: CarriageItemComponent;
  let fixture: ComponentFixture<CarriageItemComponent>;
  let notificationService: MockNotificationService;
  let carriagesFacade: MockCarriagesFacade;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriageItemComponent, NoopAnimationsModule],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: CarriagesFacadeService, useClass: MockCarriagesFacade },
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriageItemComponent);
    component = fixture.componentInstance;
    component.carriage = MockCarriagesData.carriages[0];

    notificationService = TestBed.inject(
      NotificationService,
    ) as unknown as MockNotificationService;
    carriagesFacade = TestBed.inject(
      CarriagesFacadeService,
    ) as unknown as MockCarriagesFacade;
    confirmationService = TestBed.inject(ConfirmationService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the carriage name', () => {
    const panelHeader = fixture.debugElement.query(
      By.css('.p-panel-header'),
    ).nativeElement;
    expect(panelHeader.textContent).toContain(component.carriage.name);
  });

  it('should emit editCarriageClick event on edit button click', () => {
    jest.spyOn(component.editCarriageClick, 'emit');

    const editButton = fixture.debugElement.query(
      By.css('.pi-pen-to-square'),
    ).nativeElement;
    editButton.click();

    expect(component.editCarriageClick.emit).toHaveBeenCalledWith(
      component.carriage,
    );
  });

  it('should show confirmation dialog on delete button click', () => {
    jest.spyOn(confirmationService, 'confirm');

    const deleteButton = fixture.debugElement.query(
      By.css('.pi-trash'),
    ).nativeElement;
    deleteButton.click();

    expect(confirmationService.confirm).toHaveBeenCalled();
  });

  it('should confirm deletion and call facade.delete on accept', () => {
    const facadeDeleteSpy = jest.spyOn(carriagesFacade, 'delete');
    const notificationSpy = jest.spyOn(notificationService, 'messageSuccess');

    // Spy on the confirmationService.confirm method
    const confirmSpy = jest.spyOn(confirmationService, 'confirm');

    // Trigger deleteClick to open the confirmation dialog
    const deleteButton = fixture.debugElement.query(
      By.css('.pi-trash'),
    ).nativeElement;
    deleteButton.click();

    // Simulate the confirmation dialog
    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    carriagesFacade.setState(MockCarriagesState.successState);

    expect(facadeDeleteSpy).toHaveBeenCalledWith(component.carriage.code);
    expect(notificationSpy).toHaveBeenCalledWith('Carriage deleted');
  });

  it('should confirm deletion and notify error from the state', () => {
    const notificationSpy = jest.spyOn(notificationService, 'messageError');

    const confirmSpy = jest.spyOn(confirmationService, 'confirm');

    const deleteButton = fixture.debugElement.query(
      By.css('.pi-trash'),
    ).nativeElement;
    deleteButton.click();

    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    carriagesFacade.setState(MockCarriagesState.errorState);

    expect(notificationSpy).toHaveBeenCalledWith('Some error');
  });
});
