import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {NgxPanZoomModule} from 'ngx-panzoom';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {toRarrange} from '../domain/SetPositionTile';
import {Tiles, TileViewModel, toTileviewModel} from '../domain/tiles';
import {Player} from '../domain/player';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';




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
        shape: 3
      },
      {
        rackPosition: 1,
        id: 5,
        color: 1,
        shape: 4
      },
      {
        rackPosition: 0,
        id: 31,
        color: 6,
        shape: 2
      },
      {
        rackPosition: 1,
        id: 105,
        color: 5,
        shape: 6
      },
      {
        rackPosition: 0,
        id: 87,
        color: 2,
        shape: 6
      },
      {
        rackPosition: 2,
        id: 77,
        color: 1,
        shape: 3
      }
    ];
    expect(toRarrange(rack)).toEqual([

        {
          color: 2,
          disabled: true,
          id: 71,
          shape: 3,
          x: 0,
          y: 0
        },
        {
          color: 1,
          disabled: true,
          id: 5,
          shape: 4,
          x: 1,
          y: 0
        },
        {
          color: 6,
          disabled: true,
          id: 31,
          shape: 2,
          x: 2,
          y: 0
        },
        {
          color: 5,
          disabled: true,
          id: 105,
          shape: 6,
          x: 3,
          y: 0
        },
        {
          color: 2,
          disabled: true,
          id: 87,
          shape: 6,
          x: 4,
          y: 0
        },
        {
          color: 1,
          disabled: true,
          id: 77,
          shape: 3,
          x: 5,
          y: 0
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
            shape: 3
          },
          {
            rackPosition: 1,
            id: 5,
            color: 1,
            shape: 4
          },
          {
            rackPosition: 0,
            id: 31,
            color: 6,
            shape: 2
          },
          {
            rackPosition: 1,
            id: 105,
            color: 5,
            shape: 6
          },
          {
            rackPosition: 2,
            id: 77,
            color: 1,
            shape: 3
          },
          {
            rackPosition: 0,
            id: 87,
            color: 2,
            shape: 6
          }
        ]
      },

      isTurn: true
    };
    expect(toTileviewModel(player)).toEqual([
      {
        TileId: 71,
        X: 5,
        Y: 0,
        playerId: 3
      },
      {
        TileId: 5,
        X: 1,
        Y: 0,
        playerId: 3
      },
      {
        TileId: 31,
        X: 0,
        Y: 0,
        playerId: 3
      },
      {
        TileId: 105,
        X: 1,
        Y: 0,
        playerId: 3
      },
      {
        TileId: 77,
        X: 2,
        Y: 0,
        playerId: 3
      },
      {
        TileId: 87,
        X: 0,
        Y: 0,
        playerId: 3
      }
    ]);
  });
});
