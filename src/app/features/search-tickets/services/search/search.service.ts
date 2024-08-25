import {
  FilteredTickets,
  SearchRequest,
  SearchResponse,
  SearchRoute,
  Segment,
  StopInfo,
  Ticket,
} from '@/core/models/search.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { StationsMap } from '@/core/models/stations.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseURL: string = '/api/search';

  private http: HttpClient = inject(HttpClient);

  private stationsFacade = inject(StationsFacadeService);

  public search(params: SearchRequest): Observable<FilteredTickets> {
    return this.http.get<SearchResponse>(this.baseURL, { params }).pipe(
      map((data) => {
        return this.filterTicketsByDate(this.getTicketsData(data));
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

      if (!stationMap) throw Error('No station map in store');

      const firstRouteStation = stationMap[route.path[0]].city;
      const lastRouteStation =
        stationMap[route.path[route.path.length - 1]].city;

      const startRide = route.path.indexOf(fromId);
      const endRide = route.path.indexOf(toId);
      if (startRide === -1 || endRide === -1) {
        throw Error('The start or end point of the ride was not found');
      }

      const ridePathIds = route.path.slice(startRide, endRide + 1);

      return route.schedule.map((ride) => {
        const ridePath = ride.segments.slice(startRide, endRide + 1);

        const departureDate = new Date(ridePath[0].time[0]);
        const arrivalDate = new Date(ridePath[ridePath.length - 1].time[1]);
        const tripDuration = arrivalDate.getTime() - departureDate.getTime();

        const stopInfo = this.getRouteDetails(
          ridePath,
          ridePathIds,
          stationMap,
        );

        return {
          departureDate,
          arrivalDate,
          startCity,
          endCity,
          tripDuration,
          firstRouteStation,
          lastRouteStation,
          carriages: [],
          routeDetails: { routeId, stopInfo },
        };
      });
    });

    return ticketsData;
  }

  private getRouteDetails(
    ridePath: Segment[],
    ridePathIds: number[],
    stationsMap: StationsMap,
  ): StopInfo[] {
    return ridePath.map((segment, i) => {
      const station = stationsMap[ridePathIds[i]].city;

      let arrivalOnStation: string | undefined;
      let departureFromStation: string | undefined;
      let stopDuration: number | 'First station' | 'Last station';

      const getTime = (ISOString: string) =>
        ISOString.split('T')[1].slice(0, 5);

      if (i === 0) {
        departureFromStation = getTime(segment.time[0]);
        stopDuration = 'First station';
      } else if (i === ridePath.length - 1) {
        arrivalOnStation = getTime(segment.time[1]);
        stopDuration = 'Last station';
      } else {
        arrivalOnStation = getTime(ridePath[i - 1].time[1]);
        departureFromStation = getTime(segment.time[0]);
        stopDuration =
          new Date(segment.time[0]).getTime() -
          new Date(ridePath[i - 1].time[1]).getTime();
      }

      return {
        station,
        departureFromStation,
        arrivalOnStation,
        stopDuration,
      };
    });
  }

  private getTravelDates(routes: SearchRoute[], from: number, to: number) {
    return routes.flatMap((route) => {
      const startRide = route.path.indexOf(from);
      const endRide = route.path.indexOf(to);

      return route.schedule.map((ride) => {
        const wholePath = ride.segments.slice(startRide, endRide + 1);

        const arrivalDate = new Date(wholePath[wholePath.length - 1].time[1]);
        const departureDate = new Date(wholePath[0].time[0]);
        const tripDuration = arrivalDate.getTime() - departureDate.getTime();
        return { departureDate, arrivalDate, tripDuration };
      });
    });
  }

  private filterTicketsByDate(tickets: Ticket[]): FilteredTickets {
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
