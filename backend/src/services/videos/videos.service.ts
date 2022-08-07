import { Injectable } from '@nestjs/common';
import * as fluent_ffmpeg from 'fluent-ffmpeg';
import { Inputs } from 'src/controllers/videos/videos.controller';

@Injectable()
export class VideosService {

  createVideo(inputs: Inputs): void {
    let videoDuration: number = inputs.videos[0].duration;
    let songDuration: number = inputs.songs[0].duration;
    let numberOfTimesVideo: number = inputs.duration%videoDuration>0?Math.ceil(inputs.duration/videoDuration):inputs.duration/videoDuration;
    let numberOfTimesSong: number = inputs.duration%songDuration>0?Math.ceil(inputs.duration/songDuration):inputs.duration/songDuration;
    console.log(videoDuration, songDuration, numberOfTimesVideo, numberOfTimesSong)
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
            new fluent_ffmpeg('/Users/juvanton/tmp.mp4')
              .preset(mergingPreset)
              .on('progress', (progress: any) => {
                console.log('Processing song: ' + Math.floor(progress.percent/numberOfTimesSong) + '% done');
              })
              .on('error', (err: any) => {
                console.log('An error occurred: ' + err.message);
              })
              .on('end', () => {
                console.log('Song processing finished !');
              })
          })
      });

    function videoPreset(command: any): any {
      numberOfTimesVideo = 1
      for(let i=0; i<numberOfTimesVideo; i++) {
        command.addInput(inputs.videos[0].path);
      }
      command.mergeToFile('/Users/juvanton/tmp.mp4', '/Users/juvanton/tmp/video');
    }

    function songPreset(command: any): any {
      for(let i=0; i<numberOfTimesSong; i++) {
        command.addInput(inputs.songs[0].path);
      }
      command.getAvailableCodecs(function(err, codecs) {
        console.log('Available codecs:');
        console.log(codecs);
        
        console.log(Object.keys(codecs).filter(cs=>codecs[cs].type == 'audio' && codecs[cs].canDecode == true && codecs[cs].canEncode == true));
      });
      command.mergeToFile('/Users/juvanton/tmp.mp3', '/Users/juvanton/tmp/song');
    }

    function mergingPreset(command: any): any {
      command
        .addInput('/Users/juvanton/tmp.mp4')
        .addInput('/Users/juvanton/tmp.mp3')
        .saveToFile('/Users/juvanton/video.mp4')
    }
  }
}