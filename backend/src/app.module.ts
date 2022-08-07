import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosService } from './services/videos/videos.service';
import { VideosController } from './controllers/videos/videos.controller';

@Module({
  imports: [],
  controllers: [AppController, VideosController],
  providers: [AppService, VideosService],
})
export class AppModule {}
