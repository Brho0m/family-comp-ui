import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  recordClick(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/clicks`, userId);
  }

  getClicks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clicks`);
  }

  resetClicks(): Observable<any> {
    return this.http.post(`${this.baseUrl}/clicks/reset`, {});
  }

  updateScore(userId: number, score: number): Observable<any> {
    console.log('Sending update score for userId:', userId, 'with score:', score);  // Log the userId and score
    return this.http.post(`${this.baseUrl}/update`, { userId, score });
  }
}
