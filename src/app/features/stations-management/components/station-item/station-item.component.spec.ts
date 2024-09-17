import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MockNotificationService,
  MockStationsData,
  MockStationsFacade,
  MockStationsState,
} from '@/testing/mocks';
import { NotificationService } from '@/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { StationsFacadeService } from '../../services/stations-facade.service';

import { StationItemComponent } from './station-item.component';

describe('StationItemComponent', () => {
  let component: StationItemComponent;
  let fixture: ComponentFixture<StationItemComponent>;
  let facade: MockStationsFacade;
  let notificationService: MockNotificationService;
  let confirmationService: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationItemComponent, NoopAnimationsModule],
      providers: [
        ConfirmationService,
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StationItemComponent);
    component = fixture.componentInstance;
    component.station = MockStationsData.listedStations[0];

    facade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
    notificationService = TestBed.inject(
      NotificationService,
    ) as unknown as MockNotificationService;
    confirmationService = TestBed.inject(ConfirmationService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display connected stations', () => {
    facade.setStations(MockStationsData.listedStations);
    fixture.detectChanges();
    const connectedStationsText = fixture.nativeElement
      .querySelector('.stations')
      .textContent.trim();
    expect(connectedStationsText).toBe('city 2 city 3');
  });

  it('should call deleteClick when delete button is clicked', () => {
    const deleteClickSpy = jest.spyOn(component, 'deleteClick');
    const deleteButton = fixture.debugElement.query(
      By.css('.p-panel-header-icon'),
    ).nativeElement;
    deleteButton.click();
    expect(deleteClickSpy).toHaveBeenCalled();
  });

  it('should confirm deletion and call facade.delete on accept', () => {
    const facadeDeleteSpy = jest.spyOn(facade, 'delete');
    const notificationSpy = jest.spyOn(notificationService, 'messageConfirm');

    // Spy on the confirmationService.confirm method
    const confirmSpy = jest.spyOn(confirmationService, 'confirm');

    // Trigger deleteClick to open the confirmation dialog
    const deleteButton = fixture.debugElement.query(
      By.css('.p-panel-header-icon'),
    ).nativeElement;
    deleteButton.click();

    // Simulate the confirmation dialog
    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    facade.setState(MockStationsState.successState);

    expect(facadeDeleteSpy).toHaveBeenCalledWith(component.station.id);
    expect(notificationSpy).toHaveBeenCalledWith('Station deleted');
  });

  it('should show an error message if deletion fails', () => {
    const facadeDeleteSpy = jest
      .spyOn(facade, 'delete')
      .mockReturnValue(of(MockStationsState.errorState));
    const errorSpy = jest.spyOn(notificationService, 'messageError');

    // Spy on the confirmationService.confirm method
    const confirmSpy = jest.spyOn(confirmationService, 'confirm');

    // Trigger deleteClick to open the confirmation dialog
    const deleteButton = fixture.debugElement.query(
      By.css('.p-panel-header-icon'),
    ).nativeElement;
    deleteButton.click();

    // Simulate the confirmation dialog
    const confirmationArgs = confirmSpy.mock.calls[0][0];
    if (confirmationArgs.accept) {
      confirmationArgs.accept();
    }

    expect(facadeDeleteSpy).toHaveBeenCalledWith(component.station.id);
    expect(errorSpy).toHaveBeenCalledWith('Some error');
  });
});
