import { Injectable } from "@angular/core";
// import { Observable, throwError } from "rxjs";
// import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
// import { catchError, map } from "rxjs/operators";
import { CalendarService } from "./calendar.service";
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgComponent } from "../cmps/error-msg/error-msg.component";
import { UtilService } from '../services/util-service'
import{HttpService} from '../services/http.service'
// Set the http options
// const httpOptions = {
//     headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
// };

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
    constructor(public httpService:HttpService, private calendarService: CalendarService, public dialog: MatDialog, public utilService: UtilService) { }
    public addSeriesToCalendar({ seriesName }) {
        const fixedSeriesName = seriesName.split(' ').join('-')
        this.httpService.get(`https://www.episodate.com/api/show-details?q=${fixedSeriesName}`)
            .subscribe(
                data => {
                    this.newSeries = data.tvShow
                    if (!data.tvShow.name || !data.tvShow.episodes.length) {
                        this.dialog.open(ErrorMsgComponent);
                        return
                    }else {
                        this._arrangeSeriesDefault(data.tvShow)
                        this.utilService.saveToStorage('addSeriesToList',this.seriesDefault)
                        this.calendarService.addSeriesToList()
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }
    public async searchSeries(seriesName){
        // console.log("🚀seriesName", seriesName)
        // let series;
        return this.httpService.get (`https://www.episodate.com/api/search?q=${seriesName}&page=1`)
        .subscribe(
            data=>{
                const seriesNames=data.tv_shows.map(series=>series.name)
                // console.log('seriesNames',seriesNames)
                // series=JSON.parse(JSON.stringify(seriesNames)) 
                // console.log('series',series)
                return seriesNames
            }
        )

        // console.log('series',series)
        // return series
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
    // public addNoteToEpisode(episodeInfo,noteTxt){
    //     console.log('episodeInfo',episodeInfo,'noteTxt',noteTxt)
        // // להוסיף נוטס שיהיו גם בלוקל סטורג
        // const seriesList = this.utilService.loadFromStorage('series')
        // const newSeriesList = seriesList.map(series=>{
        //     if (series.name===episodeInfo.name){
        //         for (let i =0; i<series.episodes.length;i++){
        //             if (series.episodes[i].episode===episodeInfo.episodeInfo.episode &&series.episodes[i].season===episodeInfo.episodeInfo.season){
        //                 console.log('series.episodes[i]',series.episodes[i])
        //             }
        //         }
        //     }
        // })
    // }
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
        console.log(this.seriesDefault)
    }

}