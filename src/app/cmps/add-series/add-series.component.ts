import { Component, OnInit,Inject ,Input } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import {matInput} from '@angular/material/input';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-add-series',
  templateUrl: './add-series.component.html',
  styleUrls: ['./add-series.component.scss']
})
export class AddSeriesComponent implements OnInit {
  seriesName;
  control = new FormControl();
  series
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue']
  filteredStreets: Observable<string[]>;
  constructor( public dialogRef: MatDialogRef<AddSeriesComponent>, public seriesService:SeriesService,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submitForm(value) {
    if(!value.seriesName || !value.seriesName.length) return
    this.seriesService.addSeriesToCalendar(value)
    console.log('formValue',value);
  }
  async searchSeries(text){
    console.log("text",text)
    var series=this.seriesService.searchSeries(text).then(series=>this.series=series)
    console.log("🚀 this.series",  this.series)//לא מקבל מידע כמו שצריך
  }
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
