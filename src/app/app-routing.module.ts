import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { GameqwirkleComponent } from './components/gameqwirkle/gameqwirkle.component';
import { ChooseOpponentToPlayerComponent } from './choose-opponent-to-player/choose-opponent-to-player.component';
import { ChooseGameComponent } from './choose-game/choose-game.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'game' },
    { path: 'login', component: LogInComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'game/:id',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: GameqwirkleComponent
    },
    {
        path: 'game',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: GameqwirkleComponent
    },
    {
        path: 'opponents',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: ChooseOpponentToPlayerComponent
    },
    {
        path: 'chooseGame',
        canLoad: [AuthGuard],
        canActivate: [AuthGuard],
        component: ChooseGameComponent
    },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
