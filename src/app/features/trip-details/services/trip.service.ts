import { RideResponse } from '@/core/models/trip.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TripDetailsService {
  private http = inject(HttpClient);

  private baseUrl = '/api/search';

  getRide(id: string) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<RideResponse>(url);
  }
}
