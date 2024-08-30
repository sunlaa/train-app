import { CarriageMap } from '@/core/models/carriages.model';
import { RideResponse } from '@/core/models/trip.model';
import { getRideCarriagesData } from '@/shared/utils';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripDetailsService {
  private http = inject(HttpClient);

  private baseUrl = '/api/search';

  getRideDetails(
    id: string,
    fromId: number,
    toId: number,
    carriageMap: CarriageMap,
  ) {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .get<RideResponse>(url)
      .pipe(
        map((response) =>
          this.handleRideData(response, fromId, toId, carriageMap),
        ),
      );
  }

  private handleRideData(
    response: RideResponse,
    fromId: number,
    toId: number,
    carriageMap: CarriageMap,
  ) {
    const { path, carriages } = response;
    const route = response.schedule.segments;

    const ridePath = route.slice(path.indexOf(fromId), path.indexOf(toId) + 1);

    return getRideCarriagesData(carriages, carriageMap, ridePath);
  }
}
