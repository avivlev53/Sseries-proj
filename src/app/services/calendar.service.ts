import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UtilService } from 'src/app/services/util-service'

const MAT = []
@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private _calendar$ = new BehaviorSubject(MAT)
  public calendar$ = this._calendar$.asObservable()

  constructor(private http: HttpClient, private utilService: UtilService) { }
  year;
  month;
  day;
  addYear = 0;
  addMonth = 0;
  calendarDates = [];
  series = [];
  public changeDate(year, month) {
    this.addYear += year
    this.addMonth += month

    this.query(this.year, this.month, 0, this.addYear, this.addMonth)
  }
  public query(year, month, day = 0, addYear = 0, addMonth = 0) {
    this.year = year
    this.month = month
    this.day = day
    let calendar = this._calendar$.getValue();
    if (new Date().getFullYear() === year && new Date().getMonth() === month) {
      day = new Date().getDate()
    }
    calendar = this._creatMat(year + addYear, month + addMonth, day)
    this._calendar$.next(JSON.parse(JSON.stringify(calendar)))
    this.addSeiresToCalendar()
  }
  public addSeriesToList() {
    let series = this.utilService.loadFromStorage('addSeriesToList')

    let checkSeries = this.utilService.loadFromStorage('series')
    let isSeriesOnList = this.isSeriesOnList(series)

    if (!checkSeries || !checkSeries.length) {
      this.series.push(JSON.parse(JSON.stringify(series)))
      this.utilService.saveToStorage('series', this.series)
    } else if (!isSeriesOnList) {
      checkSeries.push(JSON.parse(JSON.stringify(series)))
      this.utilService.saveToStorage('series', checkSeries)
      this.series = JSON.parse(JSON.stringify(checkSeries))
    } else if (isSeriesOnList) return
    this.addSeiresToCalendar()
  }
  public isSeriesOnList(newseries) {
    let checkSeries = this.utilService.loadFromStorage('series')
    if (!checkSeries) return false
    const isfound = checkSeries.filter(series => series.name === newseries.name || series.description === newseries.description)
    return isfound.length ? true : false
  }
  public addSeiresToCalendar() {
    let seriesList = this.utilService.loadFromStorage('series')
    if (!seriesList || !seriesList.length) {
      seriesList = JSON.parse(JSON.stringify(this.series))
    }
    let calendar = this._calendar$.getValue();
    const thisMonthSeries = []
    for (let n = 0; n < seriesList.length; n++) {
      const series = seriesList[n]
      const { name, description, pics } = series
      if (series.episodes || series.episodes.length) {
        for (let i = 0; i < series.episodes.length; i++) {
          let year = parseInt(series.episodes[i].air_date.substring(0, 4))
          let month = parseInt(series.episodes[i].air_date.substring(5, 7))
          let day = parseInt(series.episodes[i].air_date.substring(8, 10))
          if (year !== calendar[0][6].fullDate.yearNum || month !== calendar[0][6].fullDate.monthNum + 1) continue
          else {
            thisMonthSeries.push({ yearNum: year, monthNum: month - 1, dayNum: day, episodeInfo: series.episodes[i], name, description, pics, notes: [] })
          }
        }
        for (let i = 0; i < calendar.length; i++) {
          let week = calendar[i]
          for (let j = 0; j < calendar[0].length; j++) {
            let day = week[j]
            for (let k = 0; k < thisMonthSeries.length; k++) {
              if (day.fullDate.monthNum === thisMonthSeries[k].monthNum && day.fullDate.dayNum === thisMonthSeries[k].dayNum) {
                let checkIfNotExist = day.tvShows.filter(tvShow => {
                  return (tvShow.name === thisMonthSeries[k].name && tvShow.episodeInfo.episode === thisMonthSeries[k].episodeInfo.episode && tvShow.episodeInfo.season === thisMonthSeries[k].episodeInfo.season)
                })
                if (!checkIfNotExist.length) {
                  day.tvShows.push(thisMonthSeries[k])
                }

              }
            }
          }
        }
      }

    }
    this._calendar$.next(JSON.parse(JSON.stringify(calendar)))
  }
  public deleteSeriesFromCalendar(seriesToRemove) {
    let calendar = this._calendar$.getValue();
    for (let n = 0; n < seriesToRemove.length; n++) {
      const seriesNameToRemove = seriesToRemove[n]
      for (let i = 0; i < calendar.length; i++) {
        let week = calendar[i]
        for (let j = 0; j < calendar[0].length; j++) {
          let day = week[j]
          if (!day.tvShows.length) continue
          let tvShow = day.tvShows.filter(tvShow => tvShow.name !== seriesNameToRemove)
          day.tvShows = tvShow
        }
      }
    }
    this._calendar$.next(JSON.parse(JSON.stringify(calendar)))
  }
  public addNoteToEpisode(episodeInfo, noteTxt) {
    console.log('episodeInfo', episodeInfo, 'noteTxt', noteTxt)
    let calendar = this._calendar$.getValue();
    for (let i = 0; i < calendar.length; i++) {
      let week = calendar[i]
      for (let j = 0; j < calendar[0].length; j++) {
        let day = week[j]
        if (day.fullDate.dayNum===episodeInfo.dayNum &&day.fullDate.monthNum===episodeInfo.monthNum){
          for (let n=0;n<day.tvShows.length;n++){
            day.tvShows[n].notes.push(noteTxt)
          }
        }
      }
    }
    this._calendar$.next(JSON.parse(JSON.stringify(calendar)))
  }
  public setBackgroundImg() {
    let calendar = this._calendar$.getValue();
    for (let i = 0; i < calendar.length; i++) {
      let week = calendar[i]
      for (let j = 0; j < calendar[0].length; j++) {
        let day = week[j]
        if (day.isToday && day.isCurrMonth) {
          if (day.tvShows.length) {
            return day.tvShows[0].pics[0]
          } else {
            return '../../../assets/img/moon.jpg'
          }
        }
      }
    }
  }

  private _creatMat(year, month, day = 0) {
    let mat = []
    let fixedMonth = this._arrangementYearMonth(year, month)[1]
    let fixedYear = this._arrangementYearMonth(year, month)[0]
    let checkIfLeap = this._isLeapYear(fixedYear)
    let getNumDaysInMonth = this._getNumDaysInMonth(checkIfLeap, fixedMonth)
    let firstDayNum = this._firstDayOfMonth(fixedYear, fixedMonth)
    let counter = 0
    let rightMonth = fixedMonth
    let rightYear = fixedYear
    for (let i = 0; i < 6; i++) {
      mat[i] = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j === firstDayNum) || (i >= 4 && counter > getNumDaysInMonth)) {
          counter = 1
          rightMonth = fixedMonth
          if (i >= 4) {
            rightMonth = fixedMonth + 1
            if (rightMonth === 12) {
              rightMonth = 1
              rightYear++
            }
          }
          if (rightYear != fixedYear) {
            rightYear++
          }
        } else if (i === 0 && j < firstDayNum && j === 0) {
          if (fixedMonth === 0) {
            counter = this._getNumDaysInMonth(checkIfLeap, 11) - firstDayNum + 1
            rightMonth = 11
            rightYear--
          } else {
            counter = this._getNumDaysInMonth(checkIfLeap, fixedMonth - 1) - firstDayNum + 1
            rightMonth = fixedMonth - 1
          }

        } else if (i === 5 && counter > 6 && counter < 29) {
          mat.pop()
          break;
        }
        var dayDetails = {
          tvShows: [],
          fullDate: {
            dayNum: counter,
            monthNum: rightMonth,
            yearNum: rightYear
          },
          isCurrMonth: (fixedMonth === rightMonth) ? true : false,
          isToday: (new Date().getFullYear() === fixedYear && new Date().getMonth() === fixedMonth && new Date().getDate() === day && counter === day) ? true : false
        }
        counter++
        mat[i][j] = dayDetails;
      }
    }
    console.table(mat)
    return mat
  }
  private _firstDayOfMonth(year, month) {
    var firstDayNum = new Date(year, month, 1).getDay()
    return firstDayNum
  }
  private _isLeapYear(year) {
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? true : false
  }
  private _getNumDaysInMonth(isLeap, month) {
    var days = 0
    switch (month) {
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        days = 31;
        break;
      case 3:
      case 5:
      case 8:
      case 10:
        days = 30;
        break;
      case 1:
        days = isLeap ? 29 : 28
    }
    return days
  }
  private _arrangementYearMonth(year, month) {
    var rightMonth = 0
    var rightYear = 0
    rightYear = Math.floor(month / 12) + year
    switch (month % 12) {
      case 0:
      case -0:
        rightMonth = 0
        break;
      case -11:
      case 1:
        rightMonth = 1
        break;
      case -10:
      case 2:
        rightMonth = 2
        break;
      case -9:
      case 3:
        rightMonth = 3
        break;
      case -8:
      case 4:
        rightMonth = 4
        break;
      case -7:
      case 5:
        rightMonth = 5
        break;
      case -6:
      case 6:
        rightMonth = 6
        break;
      case -5:
      case 7:
        rightMonth = 7
        break;
      case -4:
      case 8:
        rightMonth = 8
        break;
      case -3:
      case 9:
        rightMonth = 9
        break;
      case -2:
      case 10:
        rightMonth = 10
        break;
      case -1:
      case 11:
        rightMonth = 11
        break;
    }
    return [rightYear, rightMonth]
  }

}