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

@NgModule({
  declarations: [
    AppComponent,
    MyButtonComponent,
    TotalScoreComponent,
    ResultScoreComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, HttpClientModule, DragDropModule, MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
