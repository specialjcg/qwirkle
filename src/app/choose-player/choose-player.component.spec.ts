import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePlayerComponent as ChoosePlayerComponent } from './choose-player.component';
import {BrowserModule} from "@angular/platform-browser";
import {NgxPanZoomModule} from "ngx-panzoom";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";

describe('ChoosePlayerComponent', () => {
  let component: ChoosePlayerComponent;
  let fixture: ComponentFixture<ChoosePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePlayerComponent ],
      imports: [
        BrowserModule, NgxPanZoomModule,
        BrowserAnimationsModule,
        MatButtonModule, HttpClientModule, DragDropModule, MatIconModule, MatOptionModule, MatSelectModule, MatCardModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
