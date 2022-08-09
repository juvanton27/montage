import { Injectable, MessageEvent } from '@nestjs/common';
import * as fluent_ffmpeg from 'fluent-ffmpeg';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inputs, PROGRESS_STEPS } from 'src/controllers/videos/videos.controller';
import { createUtilsFolder, ffmpegDurationToSeconds, removeUtilsFolder } from 'src/utils/utils';

@Injectable()
export class VideosService {

  private _progress: BehaviorSubject<MessageEvent> = new BehaviorSubject({data: ""});
  progress$: Observable<MessageEvent> = this._progress.asObservable();

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
      .addOption('-f', 'null')
      .on('codecData', (data: any) => {
        videoDuration = ffmpegDurationToSeconds(data.duration);
        this._progress.next({type: "step", data: PROGRESS_STEPS[0]});
        if(!data.video_details.includes('1920x1080')) {
          videoInput = inputs.video.path.replace(".mp4", "_new.mp4");
          fluent_ffmpeg(inputs.video.path)
            .size('1920x1080')
            .on('start', () => {
              this._progress.next({type: "step", data: PROGRESS_STEPS[1]});
            })
            .on('progress', (progress: any) => {
              this._progress.next({type: "progress", data: {label: 'Fixing quality ', percent: Math.floor(progress.percent)}});
            })
            .output(videoInput)
            .on('end', () => {
              this._progress.next({type: "step", data: PROGRESS_STEPS[2]});
              fluent_ffmpeg(audioInput)
                .addOption('-f', 'null')
                .on('codecData', (data: any) => {
                  songDuration = ffmpegDurationToSeconds(data.duration);
                  numberOfTimesSong = inputs.duration % songDuration > 0 ? Math.ceil(inputs.duration / songDuration) : inputs.duration / songDuration;
                  this._progress.next({type: "step", data: PROGRESS_STEPS[3]});
                })
                .output('/dev/null')
                .on('end', () => {
                  fluent_ffmpeg()
                    .preset(videoPreset)
                    .mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`, process.env.TEMP_FOLDER)
                    .on('start', () => {
                      this._progress.next({type: "step", data: PROGRESS_STEPS[4]});
                    })
                    .on('progress', (progress: any) => {
                      this._progress.next({type: "progress", data: {label: 'Processing video: ', percent: Math.floor(progress.percent / numberOfTimesVideo)}});
                    })
                    .on('error', (err: any) => {
                      this._progress.next({type: "error", data: ': ' + err.message});
                    })
                    .on('end', () => {
                      this._progress.next({type: "step", data: PROGRESS_STEPS[5]});
                      fluent_ffmpeg()
                        .preset(songPreset)
                        .mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`, process.env.TEMP_FOLDER)
                        .on('start', () => {
                          this._progress.next({type: "step", data: PROGRESS_STEPS[6]});
                        })
                        .on('progress', (progress: any) => {
                          this._progress.next({type: "progress", data: {label: 'Processing song: ', percent: Math.floor(progress.percent / numberOfTimesSong)}});
                        })
                        .on('error', (err: any) => {
                          this._progress.next({type: "error", data: ': ' + err.message});
                        })
                        .on('end', () => {
                          this._progress.next({type: "step", data: PROGRESS_STEPS[7]});
                          fluent_ffmpeg()
                            .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`)
                            .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`)
                            .outputOptions('-shortest')
                            .saveToFile(`${process.env.SAVE_FOLDER}${inputs.outputName}.mp4`)
                            .on('start', () => {
                              this._progress.next({type: "step", data: PROGRESS_STEPS[8]});
                            })
                            .on('error', (err: any) => {
                              this._progress.next({type: "error", data: ': ' + err.message});
                            })
                            .on('end', () => {
                              this._progress.next({type: "step", data: PROGRESS_STEPS[9]});
                              removeUtilsFolder();
                            });
                        });
                    });
                })
                .run();
            })
            .run();
        } else {
          goodQuality = true;
        }
      })
      .output('/dev/null')
      .on('end', () => {
        if(goodQuality)
          fluent_ffmpeg(audioInput)
            .addOption('-f', 'null')
            .on('codecData', (data: any) => {
              songDuration = ffmpegDurationToSeconds(data.duration);
              numberOfTimesSong = inputs.duration % songDuration > 0 ? Math.ceil(inputs.duration / songDuration) : inputs.duration / songDuration;
              this._progress.next({type: "step", data: PROGRESS_STEPS[3]});
            })
            .output('/dev/null')
            .on('end', () => {
              fluent_ffmpeg()
                .preset(videoPreset)
                .mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`, process.env.TEMP_FOLDER)
                .on('start', () => {
                  this._progress.next({type: "step", data: PROGRESS_STEPS[4]});
                })
                .on('progress', (progress: any) => {
                  this._progress.next({type: "progress", data: {label: 'Processing video: ', percent: Math.floor(progress.percent / numberOfTimesVideo)}});
                })
                .on('error', (err: any) => {
                  this._progress.next({type: "error", data: ': ' + err.message});
                })
                .on('end', () => {
                  this._progress.next({type: "step", data: PROGRESS_STEPS[5]});
                  fluent_ffmpeg()
                    .preset(songPreset)
                    .mergeToFile(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`, process.env.TEMP_FOLDER)
                    .on('start', () => {
                      this._progress.next({type: "step", data: PROGRESS_STEPS[6]});
                    })
                    .on('progress', (progress: any) => {
                      this._progress.next({type: "progress", data: {label: 'Processing song: ', percent: Math.floor(progress.percent / numberOfTimesSong)}});
                    })
                    .on('error', (err: any) => {
                      this._progress.next({type: "error", data: ': ' + err.message});
                    })
                    .on('end', () => {
                      this._progress.next({type: "step", data: PROGRESS_STEPS[7]});
                      this._progress.next({type: "step", data: PROGRESS_STEPS[8]});
                      fluent_ffmpeg()
                        .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp3`)
                        .addInput(`${process.env.TEMP_FOLDER}tmp_${timestamp}.mp4`)
                        .outputOptions('-shortest')
                        .saveToFile(`${process.env.SAVE_FOLDER}${inputs.outputName}.mp4`)
                        .on('error', (err: any) => {
                          this._progress.next({type: "error", data: ': ' + err.message});
                        })
                        .on('end', () => {
                          this._progress.next({type: "end", data: PROGRESS_STEPS[9]});
                          removeUtilsFolder();
                        });
                    });
                });
            })
            .run();
      })
      .run();

    function videoPreset(command: any): any {
      let videoConcatedDuration = 0;
      while (songDuration * numberOfTimesSong > videoConcatedDuration) {
        command.addInput(videoInput);
        videoConcatedDuration += videoDuration;
        numberOfTimesVideo++;
      }
    }

    function songPreset(command: any): any {
      for (let i = 0; i < numberOfTimesSong; i++) {
        command.addInput(audioInput);
      }
    }
  }
}