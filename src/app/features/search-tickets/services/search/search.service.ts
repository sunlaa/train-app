import {
  FilteredTickets,
  SearchRequest,
  SearchResponse,
  Ticket,
} from '@/core/models/search.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import {
  getGeneralCarriageData,
  getRideDates,
  getRouteDetails,
} from '@/shared/utils';
import isSameDay from '../../utils/isSameDays';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseURL: string = '/api/search';

  private http: HttpClient = inject(HttpClient);

  private stationsFacade = inject(StationsFacadeService);

  private carriageFacade = inject(CarriagesFacadeService);

  public search(params: SearchRequest): Observable<FilteredTickets> {
    return this.http.get<SearchResponse>(this.baseURL, { params }).pipe(
      map((data) => {
        return this.filterTicketsByDate(this.getTicketsData(data), params.time);
      }),
    );
  }

  private getTicketsData(response: SearchResponse) {
    const { routes, from, to } = response;
    const { stationId: fromId, city: startCity } = from;
    const { stationId: toId, city: endCity } = to;

    const ticketsData: Ticket[] = routes.flatMap((route) => {
      const routeId = route.id;
      const stationMap = this.stationsFacade.stationMap();
      const carriageMap = this.carriageFacade.carriageMap();

      if (!stationMap) throw Error('No station map in store.');
      if (!carriageMap) throw Error('No carriage map in store.');

      const firstRouteStation = stationMap[route.path[0]].city;
      const lastRouteStation =
        stationMap[route.path[route.path.length - 1]].city;

      const startRide = route.path.indexOf(fromId);
      const endRide = route.path.indexOf(toId);
      if (startRide === -1 || endRide === -1) {
        throw Error('The start or end point of the ride was not found.');
      }

      const ridePathIds = route.path.slice(startRide, endRide + 1);

      return route.schedule.map((ride) => {
        const { rideId } = ride;
        const ridePath = ride.segments.slice(startRide, endRide);

        const { departureDate, arrivalDate } = getRideDates(ridePath);
        const tripDuration = arrivalDate - departureDate;

        const stopInfo = getRouteDetails(ridePath, ridePathIds, stationMap);

        const carriages = getGeneralCarriageData(
          route.carriages,
          carriageMap,
          ridePath,
        );

        return {
          rideId,
          fromId,
          toId,
          departureDate,
          arrivalDate,
          startCity,
          endCity,
          tripDuration,
          firstRouteStation,
          lastRouteStation,
          carriages,
          routeDetails: { routeId, stopInfo },
        };
      });
    });

    return ticketsData;
  }

  private filterTicketsByDate(
    tickets: Ticket[],
    minDate: number,
  ): FilteredTickets {
    const ticketsMap = new Map<number, Ticket[]>();

    if (tickets.length === 0) return [];

    const maxDate = Math.max(...tickets.map((ticket) => ticket.departureDate));

    const dates: number[] = [];

    const currentDate: Date = new Date(minDate);
    const endDate: Date = new Date(maxDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.getTime());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    dates.forEach((date) => {
      ticketsMap.set(
        date,
        tickets.filter((ticket) => isSameDay(date, ticket.departureDate)),
      );
    });

    const filteredTickets: FilteredTickets = [];

    ticketsMap.forEach((t, date) => {
      filteredTickets.push({ date, tickets: t });
    });

    return filteredTickets;
  }
}
