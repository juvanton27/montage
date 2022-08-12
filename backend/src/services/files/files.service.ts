import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Observable, of } from 'rxjs';

export interface FileNode {
  name: string;
  children?: FileNode[];
}

@Injectable()
export class FilesService {

  getFiles(type?: string): Observable<FileNode> {
    const path: string[] = process.env.FOLDER.split('/');
    const tree = this.getFilesRecursive([], type);
    tree.name = path[path.length-2 ];
    return of(tree);
  }

  private getFilesRecursive(path: string[], type?: string): FileNode {
    let tree: FileNode = { name: path.at(path.length - 1), children: [] };
    tree.children = fs.readdirSync(
      process.env.FOLDER + path.reduce((p, c) => `${p}${c}/`, ""),
      { withFileTypes: true }
    ).filter((f: fs.Dirent) => !f.name.startsWith('._'))
      .map((f: fs.Dirent) => {
        if (f.isDirectory()) {
          return this.getFilesRecursive(path.concat(f.name), type)
        } else {
          if((type && f.name.endsWith(type)) || !type)
            return { name: f.name };
        }
      }).filter(f=>f!==undefined);
    return tree;
  }

  getAbsolutePath(relativePath: string): Observable<{absolutePath: string}> {
    const absolute = process.env.FOLDER.split("/").filter(p=>p!=='');
    const relative = relativePath.split("/").filter(p=>p!=='');
    relative.shift();
    return of({absolutePath: absolute.concat(relative).reduce((p,c)=>`${p}/${c}`, '')});
  }
}
