import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { FileNode } from '../widgets/files-explorer/files-explorer.component';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  apiUrl: string = 'http://localhost:3000/api/files';

  constructor(private http: HttpClient) { }

  getFiles(type?: string): Observable<FileNode> {
    return from(this.http.get<FileNode>(`${this.apiUrl}?type=${type?type:''}`));
  }

  getAbsolutePath(relativePath: string): Observable<{absolutePath: string}> {
    return from(this.http.post<{absolutePath: string}>(`${this.apiUrl}/path`, {relativePath}));
  }
}
