import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr"; 
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SignalRService {

private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:5001/hubGame')
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))

    this.hubConnection.on("ReceivePlayersInGame", function (playersIds: any[]) { receivePlayersInGame(playersIds); });
    this.hubConnection.on("ReceiveTilesPlayed", function (playerId: number, tilesPlayed : any[]) { receiveTilesPlayed(playerId, tilesPlayed); });
    this.hubConnection.on("ReceiveTilesSwapped", function (playerId: number) { receiveTilesSwapped(playerId); });
    this.hubConnection.on("ReceivePlayerIdTurn", function (playerId: number) { receivePlayerIdTurn(playerId); });
  }
    
  public sendPlayerInGame(gameId: number, playerId: number) {
    this.hubConnection.invoke("PlayerInGame", gameId, playerId).catch(function (err) { return console.error(err.toString()); });
  }

}

function receivePlayersInGame(players: any[]) {
  players.forEach(player => { console.log("playerId " + player.playerId + " is in the game"); 
  });
}

function receiveTilesPlayed(playerId: number, tilesPlayed: any[]) {
  console.log(playerId + " has played:")
  tilesPlayed.forEach(tilePlayed => { console.log("color: " + tilePlayed.color + " form: " + tilePlayed.form + " x: " + tilePlayed.coordinates.x + " y: " + tilePlayed.coordinates.y); 
  });
}

function receiveTilesSwapped(playerId: number): void {
  console.log("player " + playerId + "has swapped some tiles");
}

function receivePlayerIdTurn(playerId: number) {
  console.log("it's playerId " + playerId + " turn");
}

