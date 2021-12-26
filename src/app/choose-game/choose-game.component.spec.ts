import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ChooseGameComponent } from './choose-game.component';
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
import { EventEmitter, Input, Output } from '@angular/core';
import { ListGamedId, Player } from '../../domain/player';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import HttpTileRepositoryService from "../../infra/httpRequest/http-tile-repository.service";
import {AuthGuard} from "../auth/auth.guard";

describe('ChooseGameComponent', () => {
    let component: ChooseGameComponent;
    let fixture: ComponentFixture<ChooseGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChooseGameComponent],
          imports: [HttpClientTestingModule, RouterTestingModule],
          providers: [HttpTileRepositoryService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChooseGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component.games).toEqual({ listGameId: [] });
        expect(component.gameId).toEqual(0);
        expect(component).toBeTruthy();
    });
    it('should emit on click  for game choice', fakeAsync(async () => {
        component.games = { listGameId: [1, 2] };
        component.gameId = 1;
        jest.spyOn(component.gameSelectChange, 'emit');
        console.log = jest.fn();
        await component.gameChoice(component.gameId);
        fixture.detectChanges();
        expect(component.gameSelectChange.emit).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('game selected : 1');
    }));
});
