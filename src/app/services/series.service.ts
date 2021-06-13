import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {HttpClient,HttpHeaders,HttpErrorResponse} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { CalendarService } from "./calendar.service";

// Set the http options
const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

@Injectable({
    providedIn: "root"
})

export class SeriesService {
    seriesDefault={name:null,
        description:null,
        genres:[],
        pics:[],
        episodes:[]
    };
    defaultSeries;
    constructor(private http: HttpClient,private calendarService:CalendarService) { }

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
    public addDefaultSeriesToCalendar(){
        // this.seriesService.get('https://www.episodate.com/api/show-details?q=lucifer')
        // this.seriesService.get('https://www.episodate.com/api/show-details?q=Katla') 17/6
        this.get('https://www.episodate.com/api/show-details?q=Elite')
            .subscribe(
            data => {
                console.log(data.tvShow);
                this.defaultSeries=data.tvShow
                this._arrangeSeriesDefault(data.tvShow)
                this.calendarService.addSeiresToCalendar(this.seriesDefault)
             },
            err => {
            console.log(err);
            }
      );
    }
    private _arrangeSeriesDefault(seriesInfo){
        this.seriesDefault.name=seriesInfo.name
        this.seriesDefault.description=seriesInfo.description
        this.seriesDefault.genres=seriesInfo.genres
        this.seriesDefault.pics=seriesInfo.pictures
        this.seriesDefault.episodes=seriesInfo.episodes
        console.log(this.seriesDefault)
    }
}