import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  apiUrl: string = 'http://localhost:3000/api/videos';

  constructor(private http: HttpClient) { }

  createVideo(body: any): Observable<void> {
    return this.http.post<void>(this.apiUrl, body);
  }

  cancelVideo(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/cancel`);
  }
}
