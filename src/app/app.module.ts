import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TotalScoreComponent} from './total-score/total-score.component';
import {MatIconModule} from '@angular/material/icon';
import {ResultScoreComponent} from './result-score/result-score.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {ChoosePlayerComponent} from './choose-player/choose-player.component';
import {TilePawnComponent} from './TilePawn/tile-pawn.component';
import {NgxPanZoomModule} from 'ngx-panzoom';
import {NewGameComponent} from './new-game/new-game.component';


export class MyAppModule {
}

@NgModule({
  declarations: [
    AppComponent,
    TilePawnComponent,
    TotalScoreComponent,
    ResultScoreComponent,
    NewGameComponent,
    ChoosePlayerComponent,

  ],
  imports: [
    BrowserModule, NgxPanZoomModule,
    BrowserAnimationsModule,
    MatButtonModule, HttpClientModule, DragDropModule, MatIconModule, MatOptionModule, MatSelectModule, MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule {
}
