import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyButtonComponent } from './my-button/my-button.component';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TotalScoreComponent } from './total-score/total-score.component';
import {MatIconModule} from "@angular/material/icon";
import { ResultScoreComponent } from './result-score/result-score.component';
import { NewGameComponent } from './new-game/new-game.component';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import { ChosePlayerComponent } from './chose-player/chose-player.component';

@NgModule({
  declarations: [
    AppComponent,
    MyButtonComponent,
    TotalScoreComponent,
    ResultScoreComponent,
    NewGameComponent,
    ChosePlayerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, HttpClientModule, DragDropModule, MatIconModule, MatOptionModule, MatSelectModule, MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
