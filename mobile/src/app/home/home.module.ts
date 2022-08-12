import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SwiperModule } from 'swiper/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { FilesService } from '../services/files.service';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { VideosService } from '../services/videos.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SwiperModule,
  ],
  declarations: [
    HomePage
  ],
  providers: [
    FilesService, VideosService, HTTP
  ]
})
export class HomePageModule {}
