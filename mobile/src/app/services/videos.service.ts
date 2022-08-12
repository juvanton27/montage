import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private apiUrl = 'http://localhost:3000/api/videos';

  constructor(private http: HTTP) { }

  createVideo(body: any): Observable<void> {
    return from(this.http.post(this.apiUrl, body, {})).pipe(
      map(() => {})
    );
  }

  cancelVideo(): Observable<void> {
    return from(this.http.get(`${this.apiUrl}/cancel`, {}, {})).pipe(
      map(() => {})
    );
  }
}
