import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ChooseGameComponent } from './choose-game.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';

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
});
