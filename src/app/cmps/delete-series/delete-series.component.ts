import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { SeriesService } from 'src/app/services/series.service';
import { UtilService } from 'src/app/services/util-service';
import { NgEventBus } from 'ng-event-bus';

@Component({
  selector: 'app-delete-series',
  templateUrl: './delete-series.component.html',
  styleUrls: ['./delete-series.component.scss']
})
export class DeleteSeriesComponent implements OnInit {
  seriesList : string[];
  seriesToDelete = new FormControl();
  selectedSeries;
  constructor(public utilService: UtilService,public dialogRef: MatDialogRef<DeleteSeriesComponent>,public seriesService:SeriesService,private eventBus: NgEventBus) { }

  ngOnInit(): void {
    this.seriesList=this.seriesService.getSeriesNameList()
  }
  submitForm(value){
    this.seriesService.deleteSeries(value)
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  // toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
}
