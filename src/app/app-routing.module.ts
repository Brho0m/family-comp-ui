import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CompetitionComponent } from './competition/competition.component';
import { AdminComponent } from './admin/admin.component';
import { ScoresComponent } from './scores/scores.component';
import { ClickOrderComponent } from './click-order/click-order.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'competition', component: CompetitionComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'scores', component: ScoresComponent },
  { path: 'click-order', component: ClickOrderComponent },
  { path: '**', redirectTo: '' } ,// Redirect unknown paths to home

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
