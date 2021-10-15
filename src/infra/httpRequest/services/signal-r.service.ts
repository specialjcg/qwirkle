import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import HttpTileRepositoryService from '../http-tile-repository.service';

@Injectable({
  providedIn: 'root'
})

export class SignalRService {

  private hubConnection: HubConnection;
  private serviceHttpHub: HttpTileRepositoryService;

  constructor(private serviceHttp: HttpTileRepositoryService) {
    this.serviceHttpHub = serviceHttp;
  }

  public startConnection = () => {
    const builder = new HubConnectionBuilder();
    this.hubConnection = builder
      .withUrl('https://localhost:5001/hubGame')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('ReceivePlayersInGame', (playersIds: any[]) => {
      receivePlayersInGame(playersIds);
    });
    this.hubConnection.on('ReceiveTilesPlayed', (playerId: number, tilesPlayed: any[]) => {
      receiveTilesPlayed(playerId, tilesPlayed);
    });
    this.hubConnection.on('ReceiveTilesSwapped', (playerId: number) => {
      receiveTilesSwapped(playerId);
    });
    this.hubConnection.on('ReceivePlayerIdTurn', (playerId: number) => {
      receivePlayerIdTurn(playerId);
    });
    this.hubConnection.on('ReceiveGameOver', (winnersPlayersIds: number[]) => {
      receiveGameOver(winnersPlayersIds);
    });
  }

  public sendPlayerInGame = (gameId: number, playerId: number) => {
    this.hubConnection.invoke('PlayerInGame', gameId, playerId).catch(err => console.error(err.toString()));
  }

}

const receivePlayersInGame = (players: any[]) => {
  players.forEach(player => {
    console.log('playerId ' + player.playerId + ' is in the game');
  });
};

const receiveTilesPlayed = async (playerId: number, tilesPlayed: any[]) => {

  console.log(playerId + ' has played:');
  tilesPlayed.forEach(tilePlayed => {
    console.log('color: ' + tilePlayed.color + ' form: ' + tilePlayed.form + ' x: '
      + tilePlayed.coordinates.x + ' y: ' + tilePlayed.coordinates.y);
  });
};

const receiveTilesSwapped = (playerId: number) => {
  console.log('player ' + playerId + 'has swapped some tiles');
};

const receivePlayerIdTurn = (playerId: number) => {
  console.log('it\'s playerId ' + playerId + ' turn');
};

const receiveGameOver = (winnerPlayersIds: number[]) => {
  winnerPlayersIds.forEach(playerId => {
    console.log('playerId ' + playerId + ' has win the game');
  });
};

