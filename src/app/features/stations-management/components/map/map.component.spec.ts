import { ComponentFixture, TestBed } from '@angular/core/testing';

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

    component.mainStation = { city: 'test', latitude: 0, longitude: 0 };
    component.connectedStations = [];
    component.disconnectedStations = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
