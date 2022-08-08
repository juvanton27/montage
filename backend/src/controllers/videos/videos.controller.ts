import { Body, Controller, Post } from '@nestjs/common';
import { VideosService } from 'src/services/videos/videos.service';

export interface Media {
  path: string;
  duration: number;
}

export interface Inputs {
  video: Media;
  song: Media;
  duration: number;
  outputName: string;
}

@Controller('api/videos')
export class VideosController {

  constructor(private videosService: VideosService) { }

  @Post()
  createVideo(@Body() inputs: Inputs): void {
    return this.videosService.createVideo(inputs);
  }
}
