import { Injectable } from '@nestjs/common';
import * as fluent_ffmpeg from 'fluent-ffmpeg';
import { Inputs } from 'src/controllers/videos/videos.controller';
import { createUtilsFolder, ffmpegDurationToSeconds, removeUtilsFolder } from 'src/utils/utils';

@Injectable()
export class VideosService {

  createVideo(inputs: Inputs): void {
    const timestamp: number = new Date().getTime();

    let videoInput = inputs.video.path;
    let audioInput = inputs.song.path;
    let videoDuration = 0;
    let songDuration = 0;
    let numberOfTimesVideo = 0;
    let numberOfTimesSong = 0;

    let goodQuality: boolean = false;

    createUtilsFolder();

    fluent_ffmpeg(videoInput)
      .preset(videoDurationPreset)

    /**
     * Checks the duration of the video then call the next step of the process
     */
    function videoDurationPreset(command: any): any {
      command.addOption('-f', 'null')
      command.on('codecData', (data: any) => {
        videoDuration = ffmpegDurationToSeconds(data.duration);
        console.log('Getting video informations');
        if(!data.video_details.includes('1920x1080')) {
          videoInput = inputs.video.path.replace(".mp4", "_new.mp4");
          fluent_ffmpeg(inputs.video.path)
            .preset(videoQualityPreset)
        } else {
          goodQuality = true;
        }
      })
      command.output('/dev/null')
      command.on('end', () => {
        if(goodQuality)
          fluent_ffmpeg(audioInput)
            .preset(audioDurationPreset)
      })
      command.run();
    }

    /**
     * Convert the quality of the video then call the next step of the process
     */
    function videoQualityPreset(command: any): any {
      command.size('1920x1080')
      command.on('start', () => {
        console.log("Incompatible quality, trying to convert ...");
      })
      command.on('progress', (progress: any) => {
        console.log('Fixing quality ' + Math.floor(progress.percent) + "% done")
      })
      command.output(videoInput)
      command.on('end', () => {
        console.log("Quality downgraded to 1920x1080");
        fluent_ffmpeg(audioInput)
          .preset(audioDurationPreset)
      })
      command.run()
    }

    function audioDurationPreset(command: any): any {
      command.addOption('-f', 'null')
      command.on('codecData', (data: any) => {
        songDuration = ffmpegDurationToSeconds(data.duration);
        numberOfTimesSong = inputs.duration % songDuration > 0 ? Math.ceil(inputs.duration / songDuration) : inputs.duration / songDuration;
        console.log('Getting song informations');
      })
      command.output('/dev/null')
      command.on('end', () => {
        fluent_ffmpeg()
          .preset(videoPreset)
      })
      command.run()
    }

    function videoPreset(command: any): any {
      let videoConcatedDuration = 0;
      while (songDuration * numberOfTimesSong > videoConcatedDuration) {
        command.addInput(videoInput);
        videoConcatedDuration += videoDuration;
        numberOfTimesVideo++;
      }
      command.mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`, process.env.TEMP_FOLDER);
      command.on('start', () => {
        console.log('Starting video processing');
      })
      command.on('progress', (progress: any) => {
        console.log('Processing video: ' + Math.floor(progress.percent / numberOfTimesVideo) + '% done');
      })
      command.on('error', (err: any) => {
        console.log('An error occurred: ' + err.message);
      })
      command.on('end', () => {
        console.log('Video processing finished !');
        fluent_ffmpeg()
          .preset(songPreset)
      });
    }

    function songPreset(command: any): any {
      for (let i = 0; i < numberOfTimesSong; i++) {
        command.addInput(audioInput);
      }
      command.mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`, process.env.TEMP_FOLDER);
      command.on('start', () => {
        console.log('Starting song processing');
      })
      command.on('progress', (progress: any) => {
        console.log('Processing song: ' + Math.floor(progress.percent / numberOfTimesSong) + '% done');
      })
      command.on('error', (err: any) => {
        console.log('An error occurred: ' + err.message);
      })
      command.on('end', () => {
        console.log('Song processing finished !');
        console.log('Merging ...');

        // Start merging video and audio
        fluent_ffmpeg()
          .preset(mergingPreset)
      });
    }

    function mergingPreset(command: any): any {
      command
        .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`)
        .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`)
        .outputOptions('-shortest')
        .saveToFile(`${process.env.SAVE_FOLDER}${inputs.outputName}.mp4`)
        .on('start', () => {
          console.log('Merging ...');
        })
        .on('error', (err: any) => {
          console.log('An error occurred: ' + err.message);
        })
        .on('end', () => {
          console.log('Merge processing finished !');
          removeUtilsFolder();
        })
    }
  }
}