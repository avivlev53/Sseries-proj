import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContentComponent } from './cmps/main-content/main-content.component';
import { NavbarComponent } from './cmps/navbar/navbar.component';
import { CalendarComponent } from './cmps/calendar/calendar.component';
import { DailyDetailsComponent } from './cmps/daily-details/daily-details.component';
import { AddSeriesComponent } from './cmps/add-series/add-series.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMsgComponent } from './cmps/error-msg/error-msg.component';
import { DeleteEpisodeComponent } from './cmps/delete-episode/delete-episode.component';
import { ClickStopPropagation } from './directives/click-stop-propagation.directive';
import { EditTvShowEpisodeComponent } from './cmps/edit-tv-show-episode/edit-tv-show-episode.component';
import {MatSelectModule} from '@angular/material/select';
import { DeleteSeriesComponent } from './cmps/delete-series/delete-series.component';
import { NgEventBus } from 'ng-event-bus';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoginComponent } from './cmps/login/login.component';
import {MatIconModule} from '@angular/material/icon';
import { InfoComponent } from './cmps/info/info.component';


@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    NavbarComponent,
    CalendarComponent,
    DailyDetailsComponent,
    AddSeriesComponent,
    ErrorMsgComponent,
    DeleteEpisodeComponent,
    ClickStopPropagation,
    EditTvShowEpisodeComponent,
    DeleteSeriesComponent,
    LoginComponent,
    InfoComponent,
    
  ],
 
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  providers: [
    NgEventBus,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
