import { TRoute } from '@/core/models/routes.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  private baseURL = '/api/route';

  private httpClient = inject(HttpClient);

  public getRoutes() {
    return this.httpClient.get<TRoute[]>(this.baseURL);
  }

  public createRoute(route: Omit<TRoute, 'id'>) {
    return this.httpClient.post<Pick<TRoute, 'id'>>(this.baseURL, route);
  }

  public updateRoute(route: TRoute) {
    const { id, ...body } = route;
    return this.httpClient.put<Pick<TRoute, 'id'>>(
      `${this.baseURL}/${id}`,
      body,
    );
  }

  public deleteRoute(id: number) {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }
}
