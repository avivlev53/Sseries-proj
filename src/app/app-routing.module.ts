import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './cmps/login/login.component';
import { MainContentComponent } from './cmps/main-content/main-content.component';

const routes: Routes = [
  {path:'calendar',component:MainContentComponent},
  {path:'',component:LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
