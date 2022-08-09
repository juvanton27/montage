import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-progress',
  templateUrl: './video-progress.component.html',
  styleUrls: ['./video-progress.component.scss']
})
export class VideoProgressComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<VideoProgressComponent>,
  ) {}

  ngOnInit(): void {
    const eventSource = new EventSource('/api/videos/sse');
    eventSource.onopen = () => console.log("je suis connecté")
    eventSource.onmessage = (message) => console.log(message)
  }

}
