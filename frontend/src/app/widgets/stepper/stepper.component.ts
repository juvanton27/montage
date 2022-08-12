import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { VideosService } from 'src/app/services/videos.service';
import { FilesExplorerComponent } from '../files-explorer/files-explorer.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  videoName: string | undefined;
  audioName: string | undefined;

  firstFormGroup = this._formBuilder.group({
    video: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    audio: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    duration: ['', Validators.required],
  });
  @ViewChild('type') type: any;

  constructor(
    private _formBuilder: FormBuilder,
    private videosService: VideosService,
    public dialog: MatDialog
  ) { }

  createVideo(): void {
    const body = {
      video: {
        path: this.firstFormGroup.value.video
      },
      song: {
        path: this.secondFormGroup.value.audio
      },
      duration: this.type.value==='short'?1:this.thirdFormGroup.value.duration,
      outputName: this.thirdFormGroup.value.name
    }
    this.videosService.createVideo(body).subscribe();
  }

  handleFile(e: any) {
    const ext = (e.target.files[0].path as string).split('.').pop();
    if(ext === 'mp4') {
      this.firstFormGroup.value.video = e.target.files[0].path;
      this.videoName = this.firstFormGroup.value.video?.split('/').pop();
    } else {
      this.secondFormGroup.value.audio = e.target.files[0].path;
      this.audioName = this.secondFormGroup.value.audio?.split('/').pop();
    }
  }

  videoInput(type: string): void {
    this.dialog.open(FilesExplorerComponent, {
      width: '50%',
      height: '80%',
      disableClose: true,
      data: {type}
    }).afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }
}
