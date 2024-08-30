import { TRide, TRouteRides } from '@/core/models/rides.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RidesService {
  private baseURL = '/api/route';

  private httpClient = inject(HttpClient);

  public getRouteRides(routeId: TRouteRides['id']) {
    return this.httpClient.get<TRouteRides>(`${this.baseURL}/${routeId}`);
  }

  public createRide(routeId: TRouteRides['id'], ride: Omit<TRide, 'id'>) {
    return this.httpClient.post<Pick<TRide, 'id'>>(
      `${this.baseURL}/${routeId}/ride`,
      ride,
    );
  }

  public updateRide(routeId: TRouteRides['id'], ride: TRide) {
    const { id, ...body } = ride;
    return this.httpClient.put<void>(
      `${this.baseURL}/${routeId}/ride/${id}`,
      body,
    );
  }

  public deleteRide(routeId: TRouteRides['id'], rideId: TRide['id']) {
    return this.httpClient.delete<Pick<TRide, 'id'>>(
      `${this.baseURL}/${routeId}/ride/${rideId}`,
    );
  }
}
