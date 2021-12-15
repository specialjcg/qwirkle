import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOpponentToPlayerComponent } from './choose-opponent-to-player.component';
import { ChoosePlayerComponent } from '../choose-player/choose-player.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('ChooseOpponentToPlayerComponent', () => {
    let component: ChooseOpponentToPlayerComponent;
    let fixture: ComponentFixture<ChooseOpponentToPlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChooseOpponentToPlayerComponent],
            imports: [HttpClientTestingModule, RouterTestingModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChooseOpponentToPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
