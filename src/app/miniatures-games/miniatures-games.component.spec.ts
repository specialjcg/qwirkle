import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniaturesGamesComponent } from './miniatures-games.component';
import {MenuComponent} from "../menu/menu.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MatMenuModule} from "@angular/material/menu";
import HttpTileRepositoryService from "../../infra/httpRequest/http-tile-repository.service";
import {AuthGuard} from "../auth/auth.guard";

describe('MiniaturesGamesComponent', () => {
  let component: MiniaturesGamesComponent;
  let fixture: ComponentFixture<MiniaturesGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniaturesGamesComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, MatMenuModule],
      providers: [HttpTileRepositoryService, AuthGuard]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniaturesGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
