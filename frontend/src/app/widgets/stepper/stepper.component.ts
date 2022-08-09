import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VideosService } from 'src/app/services/videos.service';
import { VideoProgressComponent } from '../video-progress/video-progress.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {

  firstFormGroup = this._formBuilder.group({
    video: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    audio: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    duration: ['', Validators.required],
    vod: [true, Validators.required],
    short: [false, Validators.required]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private videosService: VideosService,
    private dialog: MatDialog
  ) {}

  toggleVOD(e: any) {
    this.thirdFormGroup.value.vod = e.checked;
  }

  toggleShort(e: any) {
    this.thirdFormGroup.value.short = e.checked;
  }

  createVideo(): void {
    const body = {
      video: {
        path: this.firstFormGroup.value.video
      },
      song: {
        path: this.secondFormGroup.value.audio
      },
      duration: this.thirdFormGroup.value.duration,
      outputName: this.thirdFormGroup.value.name
    }
    this.videosService.createVideo(body).subscribe(
      () => {
        this.dialog
          .open(VideoProgressComponent)
          .afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
          });
      }
    );
  }
}
