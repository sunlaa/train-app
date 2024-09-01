import { ProfileModel } from '@/core/models/profile.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  public loadProfile(): Observable<ProfileModel> {
    return this.http.get<ProfileModel>('/api/profile');
  }

  public updateProfile(
    data: Omit<ProfileModel, 'role'>,
  ): Observable<ProfileModel> {
    return this.http.put<ProfileModel>('/api/profile', data);
  }

  public updatePassword(password: string): Observable<void> {
    return this.http.put<void>('/api/profile/password', { password });
  }

  public logout(): Observable<void> {
    return this.http.delete<void>('/api/logout');
  }
}
