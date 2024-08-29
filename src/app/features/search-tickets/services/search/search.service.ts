import {
  CarriageData,
  FilteredTickets,
  SearchRequest,
  SearchResponse,
  Segment,
  StopInfo,
  Ticket,
} from '@/core/models/search.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StationsFacadeService } from '@/features/stations-management/services/stations-facade.service';
import { StationMap } from '@/core/models/stations.model';
import { CarriagesFacadeService } from '@/features/carriages-management/services/carriages-facade.service';
import { CarriageMap } from '@/core/models/carriages.model';

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
        const ridePath = ride.segments.slice(startRide, endRide + 1);

        const departureDate = new Date(ridePath[0].time[0]);
        const arrivalDate = new Date(ridePath[ridePath.length - 1].time[1]);
        const tripDuration = arrivalDate.getTime() - departureDate.getTime();

        const stopInfo = this.getRouteDetails(
          ridePath,
          ridePathIds,
          stationMap,
        );

        const carriages = this.getCarriageData(
          route.carriages,
          carriageMap,
          ridePath,
        );

        return {
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

  private getRouteDetails(
    ridePath: Segment[],
    ridePathIds: number[],
    stationsMap: StationMap,
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

  private countEmptySeats(
    trainCarriages: string[],
    occupiedSeats: number[],
    carriageMap: CarriageMap,
  ) {
    const trainSeats = trainCarriages.map((code) => carriageMap[code].seats);
    const freeSeats: number[] = [];
    let firstCarriageSeat = 1;

    trainSeats.forEach((maxSeats) => {
      const lastCarriageSeat = firstCarriageSeat + maxSeats - 1;

      const occupiedInCarriage = occupiedSeats.filter(
        (seat) => seat >= firstCarriageSeat && seat <= lastCarriageSeat,
      ).length;

      const emptyInCarriage = maxSeats - occupiedInCarriage;
      freeSeats.push(emptyInCarriage);

      firstCarriageSeat = lastCarriageSeat + 1;
    });

    return freeSeats.reduce<{ [code: string]: number }>((acc, value, i) => {
      const code = trainCarriages[i];
      acc[code] = (acc[code] || 0) + value;
      return acc;
    }, {});
  }

  private getCarriageData(
    trainCarriages: string[],
    carriageMap: CarriageMap,
    ridePath: Segment[],
  ): CarriageData[] {
    const allOccupiedSeats = ridePath.reduce<number[]>((acc, segment) => {
      const { occupiedSeats } = segment;
      return Array.from(new Set(acc.concat(occupiedSeats)));
    }, []);

    const freeSeats = this.countEmptySeats(
      trainCarriages,
      allOccupiedSeats.sort((a, b) => a - b),
      carriageMap,
    );

    const ridePriceForCarriages = ridePath.reduce<{ [code: string]: number }>(
      (acc, { price }) => {
        Object.entries(price).forEach(([code, cost]) => {
          acc[code] = (acc[code] || 0) + cost;
        });
        return acc;
      },
      {},
    );

    const uniqueTrainCarriages = Object.keys(ridePriceForCarriages);
    return uniqueTrainCarriages.map((code) => {
      return {
        name: carriageMap[code].name,
        price: ridePriceForCarriages[code],
        freeSeats: freeSeats[code],
      };
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
      date.setUTCDate(minDate.getDate() + i);
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
