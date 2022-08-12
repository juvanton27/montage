import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileNode, FilesService } from '../services/files.service';
import { VideosService } from '../services/videos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  // FileExplorer
  files: FileNode[];
  currentFolder: FileNode[];
  path: string[] = [];

  // Modal
  @ViewChild('modal') modal: any;
  @ViewChild('modalProgress') modalProgress: any;
  presentingElement = null;

  // Form
  videoPath: string = "";
  audioPath: string = "";
  typeVideo: string = "";
  @ViewChild('title') title: any; 
  @ViewChild('duration') duration: any; 

  // Slider
  swiper: any = undefined;

  // SSE
  eventSource = new EventSource('http://localhost:3000/api/videos/sse');

  private _type: BehaviorSubject<string> = new BehaviorSubject("");
  type$: Observable<string> = this._type.asObservable();

  private _step: BehaviorSubject<string> = new BehaviorSubject("");
  step$: Observable<string> = this._step.asObservable();

  private _progress: BehaviorSubject<number> = new BehaviorSubject(0);
  progress$: Observable<number> = this._progress.asObservable();

  type: string = "";
  step: string = "";
  progress: number = 0;

  constructor(
    private filesService: FilesService,
    private videosService: VideosService
  ) { }

  ngOnInit() {
    this.eventSource.addEventListener('step', ({type, data}) => {
      console.log("oui");
      // if(this.dialogRef?.getState() !== MatDialogState.OPEN) {
      //   this.openDialog();
      // }
      this._type.next(type);
      this._step.next(data);
    });
    this.eventSource.addEventListener('progress', ({type, data}) => {
      console.log("oui");
      // if(this.dialogRef?.getState() !== MatDialogState.OPEN) {
      //   this.openDialog();
      // }
      this._type.next(type);
      this._step.next(JSON.parse(data).label);
      this._progress.next(JSON.parse(data).percent);
    });
    this.eventSource.addEventListener('end', (data) => {
      console.log("oui");
      this.modalProgress.dismiss();
    });
    this.eventSource.addEventListener('error', ({data}: any) => {
      console.log("oui");
      this.modalProgress.dismiss();
    });

    this.type$.subscribe((type: string) => this.type = type);
    this.step$.subscribe((step: string) => this.step = step);
    this.progress$.subscribe((progress: number) => this.progress = progress);

    this.presentingElement = document.querySelector(':root');
    this.filesService.getFiles().subscribe(
      node => {
        this.files = [node]; 
        this.currentFolder = this.files
      }
    );
  }

  onSwiper(swiper: any) {
    this.swiper = swiper;
  }

  isFile(node: FileNode): boolean {
    return node.children === undefined
  }

  fileFormat(node: FileNode): string {
    if(node.children === undefined) {
      if(node.name.endsWith('mp3'))
        return 'musical-notes-outline';
      if(node.name.endsWith('mp4'))
        return 'videocam-outline';
    }
    return 'folder-outline';
  }

  navigateBackward(): void {
    this.path.pop();
    this.currentFolder = this.files;
    this.path.forEach(
      p => this.currentFolder = this.currentFolder.find(f=>f.name===p).children
    )
  }

  disableSelection(node: FileNode): boolean {
    return (this.fileFormat(node)==='videocam-outline' && this.swiper.activeIndex === 1) ||
    (this.fileFormat(node)==='musical-note-outline' && this.swiper.activeIndex === 0)
  }

  navigateForward(node: FileNode): void {
    if(!this.isFile(node)) {
      this.path.push(node.name);    
      this.currentFolder = node.children;
    } else {
      this.modal.dismiss();
      const relativePath = this.path.reduce((p,c)=>`${p}/${c}`, "")+`/${node.name}`;
      if(this.swiper.activeIndex === 0)
        this.filesService.getAbsolutePath(relativePath).subscribe(
          ({absolutePath}) => this.videoPath = absolutePath
        );
      if(this.swiper.activeIndex === 1) 
        this.filesService.getAbsolutePath(relativePath).subscribe(
          ({absolutePath}) => this.audioPath = absolutePath
        );
    }
  }

  videoTypeChanged(e: any) {
    this.typeVideo = e.detail.value;
  }

  formValid(): boolean {
    return this.videoPath !== "" && this.audioPath !== "" && this.title?.value && (this.typeVideo==='short' || this.duration?.value)
  }

  createVideo(): void {
    const body = {
      video: {
        path: this.videoPath
      },
      song: {
        path: this.audioPath,
      },
      outputName: this.title.value,
      duration: this.typeVideo==='short'?1:this.duration?.value
    }
    this.videosService.createVideo(body).subscribe(
      () => this.modalProgress.present()
    );
  }

  cancelVideo(): void {
    this.videosService.cancelVideo().subscribe(
      () => this.modalProgress.dismiss()
    )
  }
}
