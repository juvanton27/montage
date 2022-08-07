import { Body, Controller, Post } from '@nestjs/common';
import { VideosService } from 'src/services/videos/videos.service';

export interface Media {
  path: string;
  duration: number;
}

export interface Inputs {
  videos: Media[];
  songs: Media[];
  duration: number
}

@Controller('api/videos')
export class VideosController {

  constructor(private videosService: VideosService) { }

  @Post()
  createVideo(@Body() inputs: Inputs): void {
    return this.videosService.createVideo(inputs);
  }
}
