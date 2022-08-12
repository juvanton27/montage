import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileNode, FilesService } from 'src/services/files/files.service';

@Controller('api/files')
export class FilesController {

  constructor(private filesService: FilesService) { }

  @Get()
  getFiles(@Query('type') type?: string): Observable<FileNode> {
    return this.filesService.getFiles(type);
  }

  @Post('/path')
  getAbsolutePath(@Body('relativePath') relativePath: string): Observable<{absolutePath: string}> {
    return this.filesService.getAbsolutePath(relativePath);
  }
}
