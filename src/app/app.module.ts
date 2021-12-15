import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TotalScoreComponent } from './total-score/total-score.component';
import { ResultScoreComponent } from './result-score/result-score.component';
import { ChoosePlayerComponent } from './choose-player/choose-player.component';
import { TilePawnComponent } from './TilePawn/tile-pawn.component';

import { ChooseGameComponent } from './choose-game/choose-game.component';
import { NewGameComponent } from './new-game/new-game.component';
import { GiveTemporyScoreComponent } from './give-tempory-score/give-tempory-score.component';
import { WinnerComponent } from './winner/winner.component';
import { PickComponent } from './pick/pick.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GameqwirkleComponent } from './components/gameqwirkle/gameqwirkle.component';
import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from '@angular/material/input';
import HttpTileRepositoryService from '../infra/httpRequest/http-tile-repository.service';
import { ChooseOpponentToPlayerComponent } from './choose-opponent-to-player/choose-opponent-to-player.component';

export class MyAppModule {}

@NgModule({
    declarations: [
        AppComponent,
        TilePawnComponent,
        TotalScoreComponent,
        ResultScoreComponent,
        ChoosePlayerComponent,
        ChooseGameComponent,
        NewGameComponent,
        GiveTemporyScoreComponent,
        WinnerComponent,
        PickComponent,
        LogInComponent,
        RegisterComponent,
        GameqwirkleComponent,
        ChooseOpponentToPlayerComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        AppRoutingModule,
        MatInputModule
    ],
    providers: [HttpTileRepositoryService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
