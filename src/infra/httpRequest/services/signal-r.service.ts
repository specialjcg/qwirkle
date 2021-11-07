import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})

export class SignalRService {

  hubConnection!: HubConnection;


  public startConnection = () => {
    const builder = new HubConnectionBuilder();
    this.hubConnection = builder
      .withUrl('https://qwirkleapi.newtomsoft.fr/hubGame')
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


