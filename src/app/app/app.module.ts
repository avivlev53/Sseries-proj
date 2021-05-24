import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContentComponent } from './cmps/main-content/main-content.component';
import { NavbarComponent } from './cmps/navbar/navbar.component';
import { CalendarComponent } from './cmps/calendar/calendar.component';
import { DailyDetailsComponent } from './cmps/daily-details/daily-details.component';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    NavbarComponent,
    CalendarComponent,
    DailyDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
