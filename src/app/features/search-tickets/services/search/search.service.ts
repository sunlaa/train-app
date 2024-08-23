import {
  FilteredTickets,
  SearchRequest,
  SearchResponse,
  Ticket,
} from '@/core/models/search.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseURL: string = '/api/search';

  http: HttpClient = inject(HttpClient);

  search(params: SearchRequest): Observable<FilteredTickets> {
    return this.http.get<SearchResponse>('/api/search', { params }).pipe(
      map((data) => {
        return this.filterTicketsByDate(this.getTicketsData(data));
      }),
    );
  }

  getTicketsData(response: SearchResponse) {
    const { routes, from, to } = response;
    const { stationId: fromStationId, city: startCity } = from;
    const { stationId: toStationId, city: endCity } = to;

    const ticketsData: Ticket[] = routes.flatMap((route) => {
      // change to the city string using selectors
      const firstRouteStationId = route.path[0];
      const lastRouteStationId = route.path[route.path.length - 1];

      const startRide = route.path.indexOf(fromStationId);
      const endRide = route.path.indexOf(toStationId);

      return route.schedule.map((ride) => {
        const wholePath = ride.segments.slice(startRide, endRide + 1);

        const departureDate = new Date(wholePath[0].time[0]);
        const arrivalDate = new Date(wholePath[wholePath.length - 1].time[1]);
        const tripDuration = arrivalDate.getTime() - departureDate.getTime();

        return {
          departureDate,
          arrivalDate,
          startCity,
          endCity,
          tripDuration,
          firstRouteStation: `${firstRouteStationId}`,
          lastRouteStation: `${lastRouteStationId}`,
        };
      });
    });

    return ticketsData;
  }

  filterTicketsByDate(tickets: Ticket[]): FilteredTickets {
    const ticketsMap = new Map<string, Ticket[]>();

    if (tickets.length === 0) return [];

    const minDate = new Date(
      Math.min(...tickets.map((ticket) => ticket.departureDate.getTime())),
    );

    const dates: string[] = [];

    for (let i = 0; i < 10; i += 1) {
      const date = new Date(minDate);
      date.setDate(minDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    dates.forEach((date) => {
      ticketsMap.set(
        date,
        tickets.filter(
          (ticket) => date === ticket.departureDate.toISOString().split('T')[0],
        ),
      );
    });

    const filteredTickets: FilteredTickets = [];

    ticketsMap.forEach((t, date) => {
      filteredTickets.push({ date, tickets: t });
    });

    return filteredTickets;
  }
}
