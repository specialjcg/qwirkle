import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveTemporyScoreComponent } from './give-tempory-score.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgxPanZoomModule} from 'ngx-panzoom';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';

describe('GiveTemporyScoreComponent', () => {
  let component: GiveTemporyScoreComponent;
  let fixture: ComponentFixture<GiveTemporyScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveTemporyScoreComponent ],
      imports: [
        BrowserModule, NgxPanZoomModule,
        BrowserAnimationsModule,
        MatButtonModule, HttpClientModule, DragDropModule, MatIconModule, MatOptionModule, MatSelectModule, MatCardModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveTemporyScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.score).toEqual({code: 0, tilesPlayed: [], newRack: [], points: 0})
    expect(component).toBeTruthy();
  });
});
