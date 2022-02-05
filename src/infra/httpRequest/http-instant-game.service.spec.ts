import { TestBed } from '@angular/core/testing';

import { HttpInstantGameService } from './http-instant-game.service';
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import HttpTileRepositoryService from './http-tile-repository.service';

describe('HttpInstantGameService', () => {
    let service: HttpInstantGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                NgxPanZoomModule,
                BrowserAnimationsModule,
                MatButtonModule,
                HttpClientModule,
                DragDropModule,
                MatIconModule,
                MatOptionModule,
                MatSelectModule,
                MatCardModule,
                HttpClientTestingModule
            ],
            providers: [HttpTileRepositoryService]
        });
        service = TestBed.inject(HttpInstantGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
