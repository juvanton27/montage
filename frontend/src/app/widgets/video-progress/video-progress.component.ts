import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../stepper/stepper.component';

@Component({
  selector: 'app-video-progress',
  templateUrl: './video-progress.component.html',
  styleUrls: ['./video-progress.component.scss']
})
export class VideoProgressComponent implements OnInit {
  type: string = "";
  step: string = "";
  progress: number = 0;
  
  constructor(
    public dialogRef: MatDialogRef<VideoProgressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    const eventSource = new EventSource('/api/videos/sse');
    eventSource.addEventListener('step', ({type, data}) => {
      this.type = type;
      this.step = data;
    });
    eventSource.addEventListener('progress', ({type, data}) => {
      this.type = type;
      this.step = JSON.parse(data).label;
      this.progress = JSON.parse(data).percent;
    });
    eventSource.addEventListener('end', () => this.dialogRef.close({succeed: true}));
    eventSource.addEventListener('error', ({data}: any) => this.dialogRef.close({succeed: false, message: data}));
  }
}
