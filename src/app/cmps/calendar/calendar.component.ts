import { Component, OnInit, Input } from '@angular/core';
import { from } from 'rxjs';
import{CalendarService} from 'src/app/services/calendar.service'
import {SeriesService} from 'src/app/services/series.service'
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() calendar;
  constructor(private calendarService :CalendarService,private seriesService: SeriesService) { }

  currYear = new Date().getFullYear()
  currMonth = new Date().getMonth()
  currDay = new Date().getDate()//המספר הנכון של היום
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  backgroundUrl ;

  ngOnInit(): void {
    this.backgroundUrl=this.calendarService.setBackgroundImg()
  }
}
