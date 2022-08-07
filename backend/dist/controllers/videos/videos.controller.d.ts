import { VideosService } from 'src/services/videos/videos.service';
export interface Media {
    path: string;
    duration: number;
}
export interface Inputs {
    videos: Media[];
    songs: Media[];
    duration: number;
}
export declare class VideosController {
    private videosService;
    constructor(videosService: VideosService);
    createVideo(inputs: Inputs): void;
}
