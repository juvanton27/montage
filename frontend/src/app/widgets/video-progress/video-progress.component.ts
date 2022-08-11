import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-video-progress',
  templateUrl: './video-progress.component.html',
  styleUrls: ['./video-progress.component.scss']
})
export class VideoProgressComponent implements OnInit {
  type: string = "";
  step: string = "";
  progress: number = 0;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.data.type.subscribe((type: string) => this.type = type);
    this.data.step.subscribe((step: string) => this.step = step);
    this.data.progress.subscribe((progress: number) => this.progress = progress);
  }
}
