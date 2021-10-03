import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListNamePlayer, Player} from '../../infra/httpRequest/player';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';

@Component({
  selector: 'app-chose-player',
  templateUrl: './chose-player.component.html',
  styleUrls: ['./chose-player.component.css']
})
export class ChosePlayerComponent implements OnInit {
  @Input() player: Player;
  @Input() gameId: number;
  @Output() playerChange = new EventEmitter<Player>();
  players: Player[] = [];
  names: ListNamePlayer = {listNamePlayer: []};

  constructor(public service: HttpTileRepositoryService) {

  }

  async ngOnInit(): Promise<void> {
    this.players = await this.service.getPlayers(this.gameId);
    this.names = await this.service.getPlayerName(this.gameId);
  }

  newPlayer(): void {
    this.playerChange.emit(this.player);
  }

}
