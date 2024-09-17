import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TicketCardComponent } from './ticket-card.component';

describe('TicketCardComponent', () => {
  let component: TicketCardComponent;
  let fixture: ComponentFixture<TicketCardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCardComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCardComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
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
      carriages: [
        { name: 'First Class', freeSeats: 5, price: 1050 },
        { name: 'Second Class', freeSeats: 10, price: 500 },
      ],
      routeDetails: { routeId: 1, stopInfo: [] },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to trip when card is clicked', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const card = fixture.debugElement.query(By.css('p-card'));

    card.triggerEventHandler('click', {});
    expect(navigateSpy).toHaveBeenCalledWith(
      ['/trip', component.ticket.rideId],
      {
        queryParams: {
          from: component.ticket.fromId,
          to: component.ticket.toId,
        },
      },
    );
  });

  it('should open modal when Route button is clicked', () => {
    const button = fixture.debugElement.query(By.css('.interact p-button'));

    expect(component.modalVisible).toBe(false);

    button.triggerEventHandler('onClick', new Event('click'));
    fixture.detectChanges();

    expect(component.modalVisible).toBe(true);
  });
});
