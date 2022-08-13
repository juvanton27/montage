import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { VideosService } from './services/videos.service';
import { VideoProgressComponent } from './widgets/video-progress/video-progress.component';


interface DialogData {
  succeed: boolean;
  message: string | {label: string, savePath: string};
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  dialogRef: any;
  eventSource = new EventSource('http://192.168.1.7:3000/api/videos/sse');

  private _type: BehaviorSubject<string> = new BehaviorSubject("");
  type$: Observable<string> = this._type.asObservable();

  private _step: BehaviorSubject<string> = new BehaviorSubject("");
  step$: Observable<string> = this._step.asObservable();

  private _progress: BehaviorSubject<number> = new BehaviorSubject(0);
  progress$: Observable<number> = this._progress.asObservable();

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private videosService: VideosService
  ) { }

  ngOnInit(): void {
    this.eventSource.addEventListener('step', ({type, data}) => {
      if(this.dialogRef?.getState() !== MatDialogState.OPEN) {
        this.openDialog();
      }
      this._type.next(type);
      this._step.next(data);
    });
    this.eventSource.addEventListener('progress', ({type, data}) => {
      if(this.dialogRef?.getState() !== MatDialogState.OPEN) {
        this.openDialog();
      }
      this._type.next(type);
      this._step.next(JSON.parse(data).label);
      this._progress.next(JSON.parse(data).percent);
    });
    this.eventSource.addEventListener('end', (data) => {
      this.dialogRef?.close({succeed: true, message: data});
    });
    this.eventSource.addEventListener('error', ({data}: any) => {
      this.dialogRef?.close({succeed: false, message: data})
    });
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(VideoProgressComponent, 
      {
        disableClose: true,
        data: {type: this.type$, step: this.step$, progress: this.progress$}
      });

    this.dialogRef.afterClosed().subscribe((result: DialogData) => {
        if(result.succeed) {
          this._snackBar.open((result.message as any).savePath, "Open");
        } else {
          if(result.message !== 'cancel') {
            this._snackBar.open((result.message as string), "Close");
          } else {
            this.videosService.cancelVideo().subscribe(
              () => {
                this._snackBar.open("Montage canceled", "Close")
              }
            );
          }
        }
      });
  }
}
