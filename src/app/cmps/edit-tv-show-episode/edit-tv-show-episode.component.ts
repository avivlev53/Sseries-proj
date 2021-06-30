import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CalendarService } from 'src/app/services/calendar.service';
import { SeriesService } from 'src/app/services/series.service';
@Component({
  selector: 'app-edit-tv-show-episode',
  templateUrl: './edit-tv-show-episode.component.html',
  styleUrls: ['./edit-tv-show-episode.component.scss']
})
export class EditTvShowEpisodeComponent implements OnInit {
  episodeNote;
  constructor(private calendarService: CalendarService,public seriesService:SeriesService,public dialogRef: MatDialogRef<EditTvShowEpisodeComponent>,@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }
  submitForm(value){
    console.log(value)
    if (!value.note||!value.note.length) return
    this.calendarService.addNoteToEpisode(this.data.tvShow,value.note)
  }
}
