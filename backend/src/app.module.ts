import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosController } from './controllers/videos/videos.controller';
import { VideosService } from './services/videos/videos.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/dev.env'
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [
    AppController, 
    VideosController
  ],
  providers: [
    AppService, 
    VideosService
  ],
})
export class AppModule {}
