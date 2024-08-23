import { SearchRequest, SearchResponse } from '@/core/models/search.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export type Ticket = {
  departureDate: Date;
  arrivalDate: Date;
  startCity: string;
  endCity: string;
  tripDuration: number;
  firstRouteStation: string;
  lastRouteStation: string;
  // temporarily
  price?: { [key: string]: number };
};

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseURL: string = '/api/search';

  http: HttpClient = inject(HttpClient);

  search(params: SearchRequest): Observable<Ticket[]> {
    return this.http.get<SearchResponse>('/api/search', { params }).pipe(
      map((data) => {
        return this.getTicketsData(data);
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
}
