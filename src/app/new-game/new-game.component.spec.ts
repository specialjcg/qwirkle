import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { NewGameComponent } from './new-game.component';
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
import HttpTileRepositoryService from "../../infra/httpRequest/http-tile-repository.service";

describe('NewGameComponent', () => {
  let component: NewGameComponent;
  let fixture: ComponentFixture<NewGameComponent>;
  let service: HttpTileRepositoryService;
  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ NewGameComponent ],
      imports: [
        BrowserModule, NgxPanZoomModule,
        BrowserAnimationsModule,
        MatButtonModule, HttpClientModule, DragDropModule, MatIconModule, MatOptionModule, MatSelectModule, MatCardModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service=TestBed.inject(HttpTileRepositoryService)
    fixture = TestBed.createComponent(NewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.games).toEqual({listGameId:[]})
    expect(component).toBeTruthy();
  });
  it('should emit on click  game', fakeAsync( async () => {
    component.games = {listGameId: [1, 2]};
    component.game = 0;
    jest.spyOn(component.gameChange, 'emit');

    component.newGame();
    fixture.detectChanges();
    expect(component.gameChange.emit).toHaveBeenCalled();
  }));
  it('should init games when ngOnInit', () => {
    let getgame = jest.spyOn(service, 'getListGames');
    component.ngOnInit();
    expect(getgame).toHaveBeenCalled()
  });
});
