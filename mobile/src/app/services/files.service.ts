import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FileNode {
  name: string;
  children?: FileNode[];
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private apiUrl = 'http://localhost:3000/api/files';

  constructor(private http: HTTP) { }

  getFiles(type?: string): Observable<FileNode> {
    return from(this.http.get(`${this.apiUrl}?type=${type?type:""}`, {}, {})).pipe(
      map(data => JSON.parse(data.data))
    );
  }

  getAbsolutePath(relativePath: string): Observable<{absolutePath: string}> {
    return from(this.http.post(`${this.apiUrl}/path`, {relativePath}, {})).pipe(
      map(data => JSON.parse(data.data))
    );
  }
}
