import { AuthResponse } from '@/core/models/auth.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  public signup(email: string, password: string) {
    return this.httpClient.post<AuthResponse>('/api/signup', {
      email,
      password,
    });
  }

  public signin(email: string, password: string) {
    return this.httpClient.post<AuthResponse>('/api/signin', {
      email,
      password,
    });
  }
}
