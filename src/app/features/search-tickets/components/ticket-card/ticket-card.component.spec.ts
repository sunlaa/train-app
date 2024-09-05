import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketCardComponent } from './ticket-card.component';

describe('TicketCardComponent', () => {
  let component: TicketCardComponent;
  let fixture: ComponentFixture<TicketCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCardComponent);
    component = fixture.componentInstance;

    component.ticket = {
      rideId: 1,
      fromId: 1,
      toId: 1,
      departureDate: 0,
      arrivalDate: 0,
      startCity: 'test',
      endCity: 'test',
      tripDuration: 0,
      firstRouteStation: 'test',
      lastRouteStation: 'test',
      carriages: [],
      routeDetails: { routeId: 1, stopInfo: [] },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
