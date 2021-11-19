import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewUserComponent } from './new-user/new-user.component';
import { GiveTemporyScoreComponent } from './give-tempory-score/give-tempory-score.component';
import { WinnerComponent } from './winner/winner.component';
import { PickComponent } from './pick/pick.component';
import { TilePawnComponent } from './TilePawn/tile-pawn.component';
import { TotalScoreComponent } from './total-score/total-score.component';
import { ResultScoreComponent } from './result-score/result-score.component';
import { ChoosePlayerComponent } from './choose-player/choose-player.component';
import { ChooseGameComponent } from './choose-game/choose-game.component';
import { NewGameComponent } from './new-game/new-game.component';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { GameqwirkleComponent } from './components/gameqwirkle/gameqwirkle.component';
import { AngularMaterialModule } from './angular-material.module';
import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let service: HttpTileRepositoryService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                TilePawnComponent,
                TotalScoreComponent,
                ResultScoreComponent,
                NewUserComponent,
                ChoosePlayerComponent,
                ChooseGameComponent,
                NewGameComponent,
                GiveTemporyScoreComponent,
                WinnerComponent,
                PickComponent,
                LogInComponent,
                RegisterComponent,
                GameqwirkleComponent
            ],
            imports: [BrowserAnimationsModule, AngularMaterialModule, RouterModule],
            providers: [HttpTileRepositoryService]
        }).compileComponents();
        service = TestBed.inject(HttpTileRepositoryService);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(app).toBeTruthy();
    });
});
