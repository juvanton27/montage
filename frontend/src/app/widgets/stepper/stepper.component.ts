import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VideosService } from 'src/app/services/videos.service';
import { FilesExplorerComponent } from '../files-explorer/files-explorer.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  videoPath: any;
  audioPath: any;

  formGroup = this._formBuilder.group({
    name: ['', Validators.required],
    duration: [''],
  });
  @ViewChild('type') type: any;

  constructor(
    private _formBuilder: FormBuilder,
    private videosService: VideosService,
    public dialog: MatDialog
  ) { }

  formValid(): boolean {
    return this.videoPath && this.audioPath && this.formGroup.valid
  }

  createVideo(): void {
    const body = {
      video: {
        path: this.videoPath
      },
      song: {
        path: this.audioPath
      },
      duration: this.type.value==='short'?1:this.formGroup.value.duration,
      outputName: this.formGroup.value.name
    }
    console.log(body);
    
    this.videosService.createVideo(body).subscribe();
  }

  input(format: string): void {
    this.dialog.open(FilesExplorerComponent, {
      width: '50%',
      height: '80%',
      disableClose: true,
      data: {type: format}
    }).afterClosed().subscribe(result => {
        if(format === 'mp4')
          this.videoPath = result.absolutePath;
        if(format === 'mp3')
          this.audioPath = result.absolutePath;
      });
  }
}
