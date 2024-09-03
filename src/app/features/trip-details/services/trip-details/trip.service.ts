import { CarriageMap } from '@/core/models/carriages.model';
import { StationMap } from '@/core/models/stations.model';
import { RidePageData, RideResponse } from '@/core/models/trip.model';
import { getRideCarriagesData } from '@/shared/utils';
import getRideHeaderData from '@/shared/utils/rideHeader';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripDetailsService {
  private http = inject(HttpClient);

  private router = inject(Router);

  private baseUrl = '/api/search';

  getRideDetails(
    id: number,
    fromId: number,
    toId: number,
    carriageMap: CarriageMap,
    stationMap: StationMap,
  ) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<RideResponse>(url).pipe(
      map((response) =>
        this.handleRideData(response, fromId, toId, carriageMap, stationMap),
      ),
      catchError(() => {
        this.router.navigate(['**'], { skipLocationChange: true });
        return of({} as RidePageData);
      }),
    );
  }

  private handleRideData(
    response: RideResponse,
    fromId: number,
    toId: number,
    carriageMap: CarriageMap,
    stationMap: StationMap,
  ): RidePageData {
    const { path, carriages, rideId, routeId } = response;
    const route = response.schedule.segments;

    const startRide = path.indexOf(fromId);
    const endRide = path.indexOf(toId);

    const ridePath = route.slice(startRide, endRide);
    const ridePathIds = path.slice(startRide, endRide + 1);

    const header = getRideHeaderData(
      routeId,
      rideId,
      ridePath,
      ridePathIds,
      stationMap,
    );
    const carriageList = getRideCarriagesData(carriages, carriageMap, ridePath);

    return { header, carriageList, carriages, carriageMap };
  }
}
