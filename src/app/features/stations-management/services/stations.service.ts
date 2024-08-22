import { TStationCreation, TStationListed } from '@/core/models/stations.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private baseURL = '/api/station';

  private httpClient = inject(HttpClient);

  public getStations() {
    return this.httpClient.get<TStationListed[]>(this.baseURL);
  }

  public createStation(station: TStationCreation) {
    return this.httpClient.post<TStationCreation>(this.baseURL, station);
  }

  public deleteStation(id: number) {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }
}
