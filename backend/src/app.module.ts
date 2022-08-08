import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosService } from './services/videos/videos.service';
import { VideosController } from './controllers/videos/videos.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: './config/dev.env'
  })],
  controllers: [AppController, VideosController],
  providers: [AppService, VideosService],
})
export class AppModule {}
