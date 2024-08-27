import { SearchStation } from '@/core/models/search.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityApiService {
  private baseURL = 'https://api.api-ninjas.com/v1/city';

  private http: HttpClient = inject(HttpClient);

  searchCity(query: string): Observable<SearchStation[]> {
    const params = { name: query };
    return this.http.get<SearchStation[]>(this.baseURL, { params });
  }
}
