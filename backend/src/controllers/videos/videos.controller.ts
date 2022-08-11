import { Body, Controller, Post, Sse, MessageEvent, Get } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { interval, map, Observable, of } from 'rxjs';
import { VideosService } from 'src/services/videos/videos.service';

export interface Media {
  path: string;
}

export interface Inputs {
  video: Media;
  song: Media;
  duration: number;
  outputName: string;
}

export const PROGRESS_STEPS = [
  'Getting video informations',
  'Incompatible quality, trying to convert', 
  'Quality downgraded to 1920x1080',
  'Getting audio informations',
  'Starting video processing',
  'Video processing finished',
  'Starting audio processing',
  'Audio processing finished',
  'Merging ...',
  'Merge processing finished'
]

@Controller('api/videos')
export class VideosController {

  constructor(
    private videosService: VideosService
  ) { }

  @Post()
  createVideo(@Body() inputs: Inputs): void {
    return this.videosService.createVideo(inputs);
  }

  @Get('cancel')
  cancelVideo(): void {
    return this.videosService.cancelVideo();
  }

  @Sse('sse') 
  sse(): Observable<MessageEvent> {
    return this.videosService.progress$.pipe(
      map((p) => {console.log(p); return p})
    );
  }
}
