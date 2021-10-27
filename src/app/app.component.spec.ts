import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
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
import {toRarrange} from '../domain/SetPositionTile';
import {Tiles, TileViewModel, toTileviewModel} from '../infra/httpRequest/tiles';
import {Player} from '../infra/httpRequest/player';




describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ], imports: [
        BrowserModule, NgxPanZoomModule,
        BrowserAnimationsModule,
        MatButtonModule, HttpClientModule, DragDropModule, MatIconModule, MatOptionModule, MatSelectModule, MatCardModule
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'qwirkle'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('qwirkle');
  });


  it('should rearrange rack ', () => {
    const rack = [
      {
        rackPosition: 5,
        id: 71,
        color: 2,
        form: 3
      },
      {
        rackPosition: 1,
        id: 5,
        color: 1,
        form: 4
      },
      {
        rackPosition: 0,
        id: 31,
        color: 6,
        form: 2
      },
      {
        rackPosition: 1,
        id: 105,
        color: 5,
        form: 6
      },
      {
        rackPosition: 0,
        id: 87,
        color: 2,
        form: 6
      },
      {
        rackPosition: 2,
        id: 77,
        color: 1,
        form: 3
      }
    ];
    expect(toRarrange(rack)).toEqual([
      {
        rackPosition: 0,
        id: 71,
        color: 2,
        form: 3
      },
      {
        rackPosition: 1,
        id: 5,
        color: 1,
        form: 4
      },
      {
        rackPosition: 2,
        id: 31,
        color: 6,
        form: 2
      },
      {
        rackPosition: 3,
        id: 105,
        color: 5,
        form: 6
      },
      {
        rackPosition: 4,
        id: 87,
        color: 2,
        form: 6
      },
      {
        rackPosition: 5,
        id: 77,
        color: 1,
        form: 3
      }
    ]);
    const player: Player = {
      id: 3,
      pseudo: 'Thomas',
      gameId: 3,
      gamePosition: 1,
      points: 17,
      lastTurnPoints: 0,
      rack: {
        tiles: [
          {
            rackPosition: 5,
            id: 71,
            color: 2,
            form: 3
          },
          {
            rackPosition: 1,
            id: 5,
            color: 1,
            form: 4
          },
          {
            rackPosition: 0,
            id: 31,
            color: 6,
            form: 2
          },
          {
            rackPosition: 1,
            id: 105,
            color: 5,
            form: 6
          },
          {
            rackPosition: 2,
            id: 77,
            color: 1,
            form: 3
          },
          {
            rackPosition: 0,
            id: 87,
            color: 2,
            form: 6
          }
        ]
      },

      isTurn: true
    };
    expect(toTileviewModel(toRarrange(rack), player)).toEqual([
      {
        TileId: 71,
        X: 0,
        Y: 0,
        playerId: 1
      },
      {
        TileId: 5,
        X: 1,
        Y: 0,
        playerId: 1
      },
      {
        TileId: 31,
        X: 2,
        Y: 0,
        playerId: 1
      },
      {
        TileId: 105,
        X: 3,
        Y: 0,
        playerId: 1
      },
      {
        TileId: 87,
        X: 4,
        Y: 0,
        playerId: 1
      },
      {
        TileId: 77,
        X: 5,
        Y: 0,
        playerId: 1
      }
    ]);
  });
});
