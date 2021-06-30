import { Component, EventEmitter, Input, OnInit,Output } from '@angular/core';
import { SeriesService } from 'src/app/services/series.service';
import { DeleteEpisodeComponent } from '../delete-episode/delete-episode.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTvShowEpisodeComponent } from '../edit-tv-show-episode/edit-tv-show-episode.component';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-daily-details',
  templateUrl: './daily-details.component.html',
  styleUrls: ['./daily-details.component.scss']
})
export class DailyDetailsComponent implements OnInit {
  @Input() day;
  constructor(public seriesService: SeriesService,public dialog: MatDialog) { }
  stared=[];
  afterDelete=[];
  editedDay;
  isOpenNotes={isOpen:false,index:-1}
  addNote
  ngOnInit(): void {
    
  }
  ngOnChanges(){
    this.stared=this.day.tvShows.map(tvShow=> tvShow.episodeInfo.isFavorite);
  }
  timeOfTheShow(tvShows){
    const date=tvShows.episodeInfo.air_date.substring(11,16)
    return date
  }
  lovedEpisode(index,showName,seasonNum,episodeNum){
    let loved = this.seriesService.changeStarOnEpisode(showName,seasonNum,episodeNum)
    this.stared.splice(index,1,loved) 
  }
  addNotes(index,tvShow){
    const dialogRef = this.dialog.open(EditTvShowEpisodeComponent,{
      data:{tvShow,seriesName:tvShow.name,episodeName:tvShow.episodeInfo.name,seasonNum:tvShow.episodeInfo.season,episodeNum:tvShow.episodeInfo.episode,notes:tvShow.notes}
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        tvShow.notes.push(result.note)
      }
    });
  }
  openNotes(index){
    if (this.isOpenNotes.index===index){
      this.isOpenNotes={isOpen:false,index:-1}
    }else {
      this.isOpenNotes.isOpen=!this.isOpenNotes.isOpen
      this.isOpenNotes.index=index
    }
  }
  deleteEpisode(i,tvShow){
    const dialogRef = this.dialog.open(DeleteEpisodeComponent,{
      data:{tvShow,seriesName:tvShow.name,episodeName:tvShow.episodeInfo.name,seasonNum:tvShow.episodeInfo.season,episodeNum:tvShow.episodeInfo.episode}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.editedDay=this.day
        this.afterDelete=this.day.tvShows.filter((tvShow,index)=> index!==i);
        this.editedDay.tvShows=this.afterDelete
      }
    });
  }

}
