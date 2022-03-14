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
import { TileInBagComponent } from './tile-in-bag/tile-in-bag.component';
import { MenuComponent } from './menu/menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { RackSupportComponent } from './rack-support/rack-support.component';
import { WaitingPlayerComponent } from './waiting-player/waiting-player.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogCodeComponent } from './dialog-code/dialog-code.component';
import { MatDialogModule } from '@angular/material/dialog';

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
        ChooseOpponentToPlayerComponent,
        TileInBagComponent,
        MenuComponent,
        RackSupportComponent,
        WaitingPlayerComponent,
        DialogCodeComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        AppRoutingModule,
        MatInputModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    providers: [HttpTileRepositoryService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
