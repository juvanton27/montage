import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  apiUrl: string = '/api/videos';

  constructor(private http: HttpClient) { }

  createVideo(body: any): Observable<void> {
    return this.http.post<void>(this.apiUrl, body);
  }
}
