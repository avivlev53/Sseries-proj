import { Component, OnInit,Inject ,Input } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import {matInput} from '@angular/material/input';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-add-series',
  templateUrl: './add-series.component.html',
  styleUrls: ['./add-series.component.scss']
})
export class AddSeriesComponent implements OnInit {
  seriesName;
  constructor( public dialogRef: MatDialogRef<AddSeriesComponent>, public seriesService:SeriesService,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submitForm(value) {
    if(!value.seriesName || !value.seriesName.length) return
    this.seriesService.addSeriesToCalendar(value)
    console.log('formValue',value);
  }
}
