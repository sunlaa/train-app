import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from '@/shared/services/notification.service';
import {
  MockNotificationService,
  MockStationsData,
  MockStationsFacade,
  MockStationsState,
} from '@/testing/mocks';

import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { StationFormComponent } from './station-form.component';
import { StationsFacadeService } from '../../services/stations-facade.service';

describe('StationFormComponent', () => {
  let component: StationFormComponent;
  let fixture: ComponentFixture<StationFormComponent>;
  let facade: MockStationsFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationFormComponent],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: StationsFacadeService, useClass: MockStationsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StationFormComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(
      StationsFacadeService,
    ) as unknown as MockStationsFacade;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.mapData.controls.name.value).toBe('');
    expect(component.mapData.controls.latitude.value).toBe(null);
    expect(component.mapData.controls.longitude.value).toBe(null);
    expect(component.connections.controls.length).toBe(1);
  });

  it('should disable the submit button if the form is invalid', () => {
    component.mapData.controls.name.setValue('Test');
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('p-button.save button'),
    ).nativeElement;
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should call submitForm when form is valid and submit button is clicked', () => {
    jest.spyOn(component, 'submitForm');
    const station = MockStationsData.listedStations[0];
    component.mapData.controls.name.setValue('Test Station');
    component.mapData.controls.latitude.setValue(0);
    component.mapData.controls.longitude.setValue(0);
    component.connect(station);
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('p-button.save button'),
    ).nativeElement;

    submitButton.click();
    fixture.detectChanges();
    expect(component.submitForm).toHaveBeenCalled();
  });

  it('should handle map click to set latitude and longitude', () => {
    const location = { latitude: 12.34, longitude: 56.78 };
    component.mapClick(location);
    expect(component.mapData.controls.latitude.value).toBe(12.34);
    expect(component.mapData.controls.longitude.value).toBe(56.78);
  });

  it('should add a new connection when connectionChange is called with a new value', () => {
    component.connect(MockStationsData.listedStations[0]);
    component.connectionChange(2, 0);
    expect(component.connections.length).toBe(2);
  });

  it('should remove a connection when removeConnection is called', () => {
    const station = MockStationsData.listedStations[0];
    component.connect(station);
    expect(component.connections.length).toBe(2);
    component.removeConnection(0);
    expect(component.connections.length).toBe(1);
  });

  it('should reset form and connections on submitForm', () => {
    const station = MockStationsData.listedStations[0];
    component.mapData.controls.name.setValue('Test Station');
    component.mapData.controls.latitude.setValue(0);
    component.mapData.controls.longitude.setValue(0);
    component.connect(station);
    component.submitForm();
    expect(component.mapData.controls.name.value).toBe(null);
    expect(component.mapData.controls.latitude.value).toBe(null);
    expect(component.mapData.controls.longitude.value).toBe(null);
    expect(component.connections.length).toBe(1);
  });

  it('should call facade create when form is valid and submitForm is called', () => {
    const newStation = MockStationsData.creationStations[0];
    const connectedStations = MockStationsData.listedStations.filter(({ id }) =>
      newStation.relations.includes(id),
    );

    const facadeSpy = jest.spyOn(facade, 'create');

    component.mapData.controls.name.setValue(newStation.city);
    component.mapData.controls.latitude.setValue(newStation.latitude);
    component.mapData.controls.longitude.setValue(newStation.longitude);
    connectedStations.forEach((station) => {
      component.connect(station);
    });

    component.submitForm();

    expect(facadeSpy).toHaveBeenCalledWith(newStation);
  });

  it('should call stationConnections methods with correct parameters', () => {
    const connectSpy = jest.spyOn(
      // @ts-expect-error to test private method
      component.stationConnections,
      'connectStation',
    );
    const disconnectSpy = jest.spyOn(
      // @ts-expect-error to test private method
      component.stationConnections,
      'disconnectStation',
    );

    const station = MockStationsData.listedStations[0];
    component.connect(station);
    expect(connectSpy).toHaveBeenCalledWith(station.id);

    component.disconnect(station);
    expect(disconnectSpy).toHaveBeenCalledWith(station.id);
  });

  it('should handle errors from createStation correctly', () => {
    jest
      .spyOn(facade, 'create')
      .mockReturnValue(of(MockStationsState.errorState));
    // @ts-expect-error to test private method
    const errorSpy = jest.spyOn(component.notificationService, 'messageError');

    const station = MockStationsData.creationStations[0];
    component.mapData.controls.name.setValue(station.city);
    component.mapData.controls.latitude.setValue(station.latitude);
    component.mapData.controls.longitude.setValue(station.longitude);
    component.connect(MockStationsData.listedStations[0]);

    component.submitForm();

    expect(errorSpy).toHaveBeenCalledWith('Some error');
  });
});
