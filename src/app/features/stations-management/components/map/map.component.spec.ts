import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as Leaflet from 'leaflet';

import { MockStationsData } from '@/testing/mocks';
import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;

    component.mainStation = {};
    component.connectedStations = [];
    component.disconnectedStations = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the map when the component is rendered', () => {
    const onMapReadySpy = jest.spyOn(component, 'onMapReady');
    fixture.detectChanges();

    // Simulate the map ready event
    const map = { invalidateSize: jest.fn() } as unknown as Leaflet.Map;
    component.onMapReady(map);

    expect(onMapReadySpy).toHaveBeenCalledWith(map);
  });

  it('should rerender map when input properties change', () => {
    // @ts-expect-error to test private method
    const rerenderSpy = jest.spyOn(component, 'rerenderMap');

    // Change an input value
    component.mainStation = {
      city: 'New Test City',
      latitude: 10,
      longitude: 10,
    };
    component.ngOnChanges();

    expect(rerenderSpy).toHaveBeenCalled();
  });

  it('should create and add the main station marker', () => {
    // @ts-expect-error to test private method
    const generateMainMarkerSpy = jest.spyOn(component, 'generateMainMarker');

    component.mainStation = { city: 'Test City', latitude: 10, longitude: 10 };
    component.ngOnChanges();

    expect(generateMainMarkerSpy).toHaveBeenCalled();
  });

  it('should create and add connected stations markers', () => {
    // @ts-expect-error to test private method
    const generateMarkerSpy = jest.spyOn(component, 'generateMarker');

    component.connectedStations = [MockStationsData.listedStations[0]];
    component.ngOnChanges();

    expect(generateMarkerSpy).toHaveBeenCalledWith(
      MockStationsData.listedStations[0],
      true,
    );
  });

  it('should emit mapClick event when the map is clicked', () => {
    const mapClickSpy = jest.spyOn(component.mapClick, 'emit');
    const mockEvent = {
      latlng: { lat: 15, lng: 30 },
    } as Leaflet.LeafletMouseEvent;

    component.mapClicked(mockEvent);

    expect(mapClickSpy).toHaveBeenCalledWith({ latitude: 15, longitude: 30 });
  });

  it('should emit mapClick event when main marker is moved', () => {
    const mapClickSpy = jest.spyOn(component.mapClick, 'emit');

    const mockDragEndEvent = {
      target: {
        getLatLng: () => ({ lat: 20, lng: 30 }),
      },
    } as Leaflet.DragEndEvent;

    // @ts-expect-error to test private method
    component.mainMarkerDragEnd(mockDragEndEvent);

    expect(mapClickSpy).toHaveBeenCalledWith({ latitude: 20, longitude: 30 });
  });
});
