import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { CalendarService } from "./calendar.service";
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgComponent } from "../cmps/error-msg/error-msg.component";
import { UtilService } from '../services/util-service'
// Set the http options
const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

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

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.error.message);
        } else {
            // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
        }
        // return an observable with a user-facing error message
        return throwError(error);
    }
    private extractData(res: Response) {
        let body = res;
        return body || {};
    }
    public get(url: string): Observable<any> {
        return this.http.get(url, httpOptions).pipe(
            map(this.extractData),
            catchError(this.handleError)
        );
    }
    public addSeriesToCalendar({ seriesName }) {
        const fixedSeriesName = seriesName.split(' ').join('-')
        this.get(`https://www.episodate.com/api/show-details?q=${fixedSeriesName}`)
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