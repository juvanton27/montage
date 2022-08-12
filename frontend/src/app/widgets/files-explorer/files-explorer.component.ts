import { Component, Inject, OnInit } from '@angular/core';
import {NestedTreeControl, TreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { FilesService } from 'src/app/services/files.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs';

export interface FileNode {
  name: string;
  children?: FileNode[];
}

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss']
})
export class FilesExplorerComponent implements OnInit {
  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();

  constructor(
    private filesService: FilesService,
    public dialogRef: MatDialogRef<FilesExplorerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {type: string},
  ) { }

  ngOnInit(): void {
    this.filesService.getFiles(this.data.type).subscribe(
      tree => this.dataSource.data = [tree]
    );
  }

  hasChild = (_: number, node: FileNode) => !!node.children && node.children.length > 0;

  fileClick(tree: any) {
    const relativePath = Array.from(tree.expansionModel._selection).reduce<string>((p: any, c: any) => `${p}/${c.name}`, "");    
    this.filesService.getAbsolutePath(relativePath).subscribe(
      ({absolutePath}) => this.dialogRef.close({absolutePath})
    )
  }
}
