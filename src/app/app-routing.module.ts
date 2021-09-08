import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './cmps/login/login.component';
import { MainContentComponent } from './cmps/main-content/main-content.component';

const routes: Routes = [
  // {path:'calendar/guest',component:MainContentComponent},
  // {path:'',component:LoginComponent}
  {path:'',component:MainContentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
