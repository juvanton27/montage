import { Injectable } from '@nestjs/common';
import * as fluent_ffmpeg from 'fluent-ffmpeg';
import { Inputs } from 'src/controllers/videos/videos.controller';
import { createUtilsFolder } from 'src/utils/utils';

@Injectable()
export class VideosService {

  createVideo(inputs: Inputs): void {
    const timestamp: number = new Date().getTime();

    let videoDuration: number = inputs.video.duration;
    let songDuration: number = inputs.song.duration;
    let numberOfTimesVideo = 0;
    let numberOfTimesSong: number = inputs.duration%songDuration>0?Math.ceil(inputs.duration/songDuration):inputs.duration/songDuration;

    createUtilsFolder();

    new fluent_ffmpeg()
      .preset(videoPreset)
      .on('progress', (progress: any) => {
        console.log('Processing video: ' + Math.floor(progress.percent/numberOfTimesVideo) + '% done');
      })
      .on('error', (err: any) => {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', () => {
        console.log('Video processing finished !');
        new fluent_ffmpeg()
          .preset(songPreset)
          .on('progress', (progress: any) => {
            console.log('Processing song: ' + Math.floor(progress.percent/numberOfTimesSong) + '% done');
          })
          .on('error', (err: any) => {
            console.log('An error occurred: ' + err.message);
          })
          .on('end', () => {
            console.log('Song processing finished !');
            console.log('Merging ...');
            new fluent_ffmpeg()
              .preset(mergingPreset)
              .on('progress', (progress: any) => {
                console.log('Processing song: ' + Math.floor(progress.percent) + '% done');
              })
              .on('error', (err: any) => {
                console.log('An error occurred: ' + err.message);
              })
              .on('end', () => {
                console.log('Merge processing finished !');
              })
          })
      });

    function videoPreset(command: any): any {
      let videoConcatedDuration = 0;
      while(songDuration*numberOfTimesSong>videoConcatedDuration) {
        command.addInput(inputs.video.path);
        videoConcatedDuration += videoDuration;
        numberOfTimesVideo++;
      }
      command.mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`, `${process.env.TEMP_FOLDER}`);
    }

    function songPreset(command: any): any {
      for(let i=0; i<numberOfTimesSong; i++) {
        command.addInput(inputs.song.path);
      }
      command.mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`, `${process.env.TEMP_FOLDER}`);
    }

    function mergingPreset(command: any): any {
      command
        .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`)
        .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`)
        .outputOptions('-shortest')
        .saveToFile(`${process.env.SAVE_FOLDER}${inputs.outputName}.mp4`)
    }
  }
}