import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CalendarService } from "./calendar.service";
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgComponent } from "../cmps/error-msg/error-msg.component";
import { UtilService } from '../services/util-service'


const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 70seuvwxujxp6o8t6yjs7nmvsor4q1',
      'Client-ID': 'lizc8ir800t1td4mjslkh08r1m8x51'
    })
  }
@Injectable({
    providedIn: "root"
})

export class SeriesService {
    seriesDefault = {
        name: null,
        description: null,
        genres: [],
        pics: [],
        episodes: []
    };
    newSeries;
    deletedEpisode=[]
    constructor(private http: HttpClient, private calendarService: CalendarService, public dialog: MatDialog, public utilService: UtilService) { }
    public addSeriesToCalendar({ seriesName }) {
        const fixedSeriesName = seriesName.split(' ').join('-')
        this.http.get(`https://www.episodate.com/api/show-details?q=${fixedSeriesName}`,httpOptions)
            .subscribe(
                data => {
                    // console.log('data',{...data})
                    this.newSeries = {...data}
                    if (!this.newSeries.tvShow.name || !this.newSeries.tvShow.episodes.length) {
                        this.dialog.open(ErrorMsgComponent);
                        return
                    }else {
                        this._arrangeSeriesDefault(this.newSeries.tvShow)
                        this.utilService.saveToStorage('addSeriesToList',this.seriesDefault)
                        this.calendarService.addSeriesToList()
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    public changeStarOnEpisode(seriesName, seasonNum, episodeNum) {
        let isLoved=null
        const seriesList = this.utilService.loadFromStorage('series')
        const newSeriesList = seriesList.map(series => {
            if (series.name === seriesName) {
                series.episodes.map(episode => {
                    if (episode.season === seasonNum && episode.episode === episodeNum) {
                        episode.isFavorite = !episode.isFavorite
                        isLoved=episode.isFavorite
                    }
                    return episode
                })
            }
            return series
        })
        this.calendarService.changeStarOnEpisode(seriesName, seasonNum, episodeNum)
        this.utilService.saveToStorage('series', newSeriesList)
        return isLoved
    }
    public deleteEpisode({seriesName,seasonNum,episodeNum,tvShow}){
        let deletedEpisode=this.utilService.loadFromStorage('deletedEpisode')
        if(!deletedEpisode||!deletedEpisode.length){
            deletedEpisode=[]
        }
        const seriesList = this.utilService.loadFromStorage('series')
        const newSeriesList = seriesList.map(series =>{
            if (series.name === seriesName) {
                var newEpisodes=series.episodes.filter(episode=>{
                    if (episode.season !== seasonNum || episode.episode !== episodeNum){
                        return episode
                    }else {
                        deletedEpisode.push(tvShow)
                        this.utilService.saveToStorage('deletedEpisode',deletedEpisode)
                        return
                    }
                })
                series.episodes= JSON.parse(JSON.stringify(newEpisodes))
            }
            return series
        })
        this.utilService.saveToStorage('series', newSeriesList)
    }
    
    public getSeriesNameList(){
        const seriesList = this.utilService.loadFromStorage('series')
        const newSeriesList = seriesList.map(series=>series.name)
        return newSeriesList
    }
    public deleteSeries(value){
        const seriesList = this.utilService.loadFromStorage('series')
        const newSeriesList = seriesList.filter(series=>!value.includes(series.name) )
        this.utilService.saveToStorage('series', newSeriesList)
        const deletedEpisode=this.utilService.loadFromStorage('deletedEpisode')
        const newDeletedEpisode = deletedEpisode.filter(epidose=>!value.includes(epidose.name) )
        this.utilService.saveToStorage('deletedEpisode', newDeletedEpisode)
    }
    private _arrangeSeriesDefault(seriesInfo) {
        this.seriesDefault.name = seriesInfo.name
        this.seriesDefault.description = seriesInfo.description
        this.seriesDefault.genres = seriesInfo.genres
        this.seriesDefault.pics = seriesInfo.pictures
        this.seriesDefault.episodes = seriesInfo.episodes
        for (let i = 0; i < this.seriesDefault.episodes.length; i++) {
            this.seriesDefault.episodes[i].isFavorite = false
        }
        // console.log(this.seriesDefault)
    }

}