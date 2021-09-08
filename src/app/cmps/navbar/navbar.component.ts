import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgEventBus } from 'ng-event-bus';
import { CalendarService } from 'src/app/services/calendar.service';
import { SeriesService } from 'src/app/services/series.service';
import { AddSeriesComponent } from '../add-series/add-series.component';
import { DeleteSeriesComponent } from '../delete-series/delete-series.component';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  month;
  year;
  calendar$;
  subscription;
  name;
  isDeleted=true;
  constructor(private calendarService: CalendarService, public dialog: MatDialog,private eventBus: NgEventBus) { }
  @Output() toChangeCalendar = new EventEmitter()
  ngOnInit(): void {

  }
  changeCalendar(year, month) {
    this.toChangeCalendar.emit({ year, month })
  }
  addSeries(): void {
    const dialogRef = this.dialog.open(AddSeriesComponent);

  }
  deleteSeries(): void {
    const dialogRef = this.dialog.open(DeleteSeriesComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result.length){
      console.log("🚀 ~ file: navbar.component.ts ~ line 38 ~ NavbarComponent ~ dialogRef.afterClosed ~ result", result)
        this.calendarService.deleteSeriesFromCalendar(result)
      }
    });
  }
  infoSeries(){
    const dialogRef = this.dialog.open(InfoComponent);
  }
  get monthToShow() {
    this.calendar$ = this.calendarService.calendar$
    this.subscription = this.calendarService.calendar$.subscribe(calendar => {
      this.month = calendar[0][6].fullDate.monthNum + 1
    })
    if (this.month < 10) {
      this.month = "0" + this.month;
    }
    return this.month;
  }
  get yearToShow() {
    this.calendar$ = this.calendarService.calendar$
    this.subscription = this.calendarService.calendar$.subscribe(calendar => {
      this.year = calendar[0][6].fullDate.yearNum
    })
    return this.year
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
