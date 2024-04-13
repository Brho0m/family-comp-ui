import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CompetitionComponent } from './competition/competition.component';
import { AdminComponent } from './admin/admin.component';
import { ScoresComponent } from './scores/scores.component';
import { HttpClientModule } from '@angular/common/http';
import { ClickOrderComponent } from './click-order/click-order.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompetitionComponent,
    AdminComponent,
    ScoresComponent,
    ClickOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
