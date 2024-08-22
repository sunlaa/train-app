import { TCarriage } from '@/core/models/carriages.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarriagesService {
  private baseURL = '/api/carriage';

  private httpClient = inject(HttpClient);

  public getCarriages() {
    return this.httpClient.get<TCarriage[]>(this.baseURL);
  }

  public createCarriage(carriage: Omit<TCarriage, 'code'>) {
    return this.httpClient.post<Pick<TCarriage, 'code'>>(
      this.baseURL,
      carriage,
    );
  }

  public updateCarriage(carriage: TCarriage) {
    const { code, ...body } = carriage;
    return this.httpClient.put<Pick<TCarriage, 'code'>>(
      `${this.baseURL}/${code}`,
      body,
    );
  }

  public deleteCarriage(code: string) {
    return this.httpClient.delete<void>(`${this.baseURL}/${code}`);
  }
}
