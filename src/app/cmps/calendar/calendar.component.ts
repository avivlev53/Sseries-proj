import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import{CalendarService} from 'src/app/services/calendar.service'
import {SeriesService} from 'src/app/services/series.service'
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor(private calendarService :CalendarService,private seriesService: SeriesService) { }
  calendar$;
  subscription;
  calendar;
  defaultSeries;
  currYear = new Date().getFullYear()
  currMonth = new Date().getMonth()
  currDay = new Date().getDate()//המספר הנכון של היום
  ngOnInit(): void {
    this.calendar$=this.calendarService.calendar$
    this.subscription = this.calendarService.calendar$.subscribe(calendar => {
      console.log('Got calendar!', calendar);
      this.calendar = JSON.parse(JSON.stringify(calendar))
    })
    this.loadCalendar(this.currYear, this.currMonth, this.currDay)
    this.loadDefaultSeries()
  }
  loadCalendar(year,month,day){
    this.calendarService.query(year,month,day)
  }
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  loadDefaultSeries(){
    this.seriesService.get('https://www.episodate.com/api/show-details?q=lucifer')
      .subscribe(
        data => {
          // console.log(data.tvShow);
          this.defaultSeries=data.tvShow
          this.seriesService.addDefaultSeriesToCalendar(data.tvShow)
        },
        err => {
          console.log(err);
        }
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
