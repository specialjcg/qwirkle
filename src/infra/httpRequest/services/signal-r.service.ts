import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {backurl} from "../http-tile-repository.service";

@Injectable({
  providedIn: 'root'
})

export class SignalRService {

  hubConnection!: HubConnection;


  public startConnection = () => {
    const builder = new HubConnectionBuilder();
    this.hubConnection = builder
      .withUrl(backurl+'/hubGame')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

  }

  public sendPlayerInGame = (gameId: number, playerId: number) => {
    this.hubConnection.invoke('PlayerInGame', gameId, playerId).catch(err => console.error(err.toString()));
  }

}


