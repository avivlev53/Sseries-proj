import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
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
  @Output() addFavoritEpisode = new EventEmitter()

  constructor(private calendarService :CalendarService,private seriesService: SeriesService) { }

  currYear = new Date().getFullYear()
  currMonth = new Date().getMonth()
  currDay = new Date().getDate()//המספר הנכון של היום
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  backgroundUrl ;
  dayInfo=null;
  clickedDay={i:'',j:''}

  ngOnInit(): void {
  }
  ngAfterContentInit(){
    this.backgroundUrl=`background-image: linear-gradient(#34343440, #343434),url(${this.calendarService.setBackgroundImg()});`
  }
  
  showDayDetails(dayInfo,indexI,indexJ){
    console.log('dayInfo',dayInfo)
    if(this.dayInfo=dayInfo && this.clickedDay.i===indexI&&this.clickedDay.j===indexJ){
      this.dayInfo=''
      this.clickedDay.i=''
      this.clickedDay.j=''
    }else {
      this.clickedDay.i=indexI
      this.clickedDay.j=indexJ
      this.dayInfo=dayInfo
    }
  }
  
}
