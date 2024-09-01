import { TUser } from '@/core/models/users.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseURL = '/api/users';

  private httpClient = inject(HttpClient);

  public getUsers() {
    return this.httpClient.get<TUser[]>(this.baseURL);
  }
}
