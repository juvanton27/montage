"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const fluent_ffmpeg = require("fluent-ffmpeg");
let VideosService = class VideosService {
    createVideo(inputs) {
        let videoDuration = inputs.videos[0].duration;
        let songDuration = inputs.songs[0].duration;
        let numberOfTimesVideo = inputs.duration % videoDuration > 0 ? Math.ceil(inputs.duration / videoDuration) : inputs.duration / videoDuration;
        let numberOfTimesSong = inputs.duration % songDuration > 0 ? Math.ceil(inputs.duration / songDuration) : inputs.duration / songDuration;
        console.log(videoDuration, songDuration, numberOfTimesVideo, numberOfTimesSong);
        new fluent_ffmpeg()
            .preset(videoPreset)
            .on('progress', (progress) => {
            console.log('Processing video: ' + Math.floor(progress.percent / numberOfTimesVideo) + '% done');
        })
            .on('error', (err) => {
            console.log('An error occurred: ' + err.message);
        })
            .on('end', () => {
            console.log('Video processing finished !');
            new fluent_ffmpeg()
                .preset(songPreset)
                .on('progress', (progress) => {
                console.log('Processing song: ' + Math.floor(progress.percent / numberOfTimesSong) + '% done');
            })
                .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            })
                .on('end', () => {
                console.log('Song processing finished !');
                console.log('Merging ...');
                new fluent_ffmpeg('/Users/juvanton/tmp.mp4')
                    .preset(mergingPreset)
                    .on('progress', (progress) => {
                    console.log('Processing song: ' + Math.floor(progress.percent / numberOfTimesSong) + '% done');
                })
                    .on('error', (err) => {
                    console.log('An error occurred: ' + err.message);
                })
                    .on('end', () => {
                    console.log('Song processing finished !');
                });
            });
        });
        function videoPreset(command) {
            numberOfTimesVideo = 1;
            for (let i = 0; i < numberOfTimesVideo; i++) {
                command.addInput(inputs.videos[0].path);
            }
            command.mergeToFile('/Users/juvanton/tmp.mp4', '/Users/juvanton/tmp/video');
        }
        function songPreset(command) {
            for (let i = 0; i < numberOfTimesSong; i++) {
                command.addInput(inputs.songs[0].path);
            }
            command.getAvailableCodecs(function (err, codecs) {
                console.log('Available codecs:');
                console.log(codecs);
                console.log(Object.keys(codecs).filter(cs => codecs[cs].type == 'audio' && codecs[cs].canDecode == true && codecs[cs].canEncode == true));
            });
            command.mergeToFile('/Users/juvanton/tmp.mp3', '/Users/juvanton/tmp/song');
        }
        function mergingPreset(command) {
            command
                .addInput('/Users/juvanton/tmp.mp4')
                .addInput('/Users/juvanton/tmp.mp3')
                .saveToFile('/Users/juvanton/video.mp4');
        }
    }
};
VideosService = __decorate([
    (0, common_1.Injectable)()
], VideosService);
exports.VideosService = VideosService;
//# sourceMappingURL=videos.service.js.map