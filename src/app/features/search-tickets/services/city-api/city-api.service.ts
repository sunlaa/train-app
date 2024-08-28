import { SearchStation } from '@/core/models/search.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

type ResponseCityApi = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  population: number;
  is_capital: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class CityApiService {
  private baseURL = 'https://api.api-ninjas.com/v1/city';

  private http: HttpClient = inject(HttpClient);

  searchCity(query: string): Observable<SearchStation[]> {
    const params = { name: query, limit: 10 };
    return this.http.get<ResponseCityApi[]>(this.baseURL, { params }).pipe(
      map((res) =>
        res.map(({ name, latitude, longitude }) => ({
          city: name,
          latitude,
          longitude,
        })),
      ),
    );
  }
}
