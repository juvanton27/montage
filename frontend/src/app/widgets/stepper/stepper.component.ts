import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VideosService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    duration: ['', Validators.required],
    vod: [true, Validators.required],
    short: [false, Validators.required]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private videosService: VideosService
  ) {}

  onFileSelected(event: any) {
    if(event.target.files[0].type === 'video/mp4')
      this.firstFormGroup.value.firstCtrl = webkitURL.createObjectURL(new Blob([event.target.files[0]], {type: 'video/mp4'}));
    if(event.target.files[0].type === 'audio/mpeg')
      this.secondFormGroup.value.secondCtrl = webkitURL.createObjectURL(event.target.files[0]);
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log(e.target.result);
      };
      reader.readAsArrayBuffer(event.target.files[0]);
    }
  }

  toggleVOD(e: any) {
    this.thirdFormGroup.value.vod = e.checked;
  }

  toggleShort(e: any) {
    this.thirdFormGroup.value.short = e.checked;
  }

  createVideo(): void {
    const body = {
      video: {
        path: this.firstFormGroup.value.firstCtrl
      },
      song: {
        path: this.secondFormGroup.value.secondCtrl
      },
      duration: this.thirdFormGroup.value.duration,
      outputName: this.thirdFormGroup.value.name
    }
    this.videosService.createVideo(body).subscribe();
  }
}
