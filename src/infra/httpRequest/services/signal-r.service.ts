import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { backurl } from '../http-tile-repository.service';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    hubConnection!: HubConnection;

    public startConnection = () => {
        const builder = new HubConnectionBuilder();
        this.hubConnection = builder.withUrl(backurl + '/hubGame').build();
    };

    public sendPlayerInGame = (gameId: number, playerId: number) => {
        this.hubConnection
            .invoke('PlayerInGame', gameId, playerId)
            .catch((error) => console.error(error.toString()));
    };

    public sendUserWaitingInstantGame = (
        playerNumberForStartGame: number,
        userName: string
    ) => {
        this.hubConnection
            .invoke('UserWaitingInstantGame', playerNumberForStartGame, userName)
            .catch((error) => console.error(error.toString()));
    };
}
