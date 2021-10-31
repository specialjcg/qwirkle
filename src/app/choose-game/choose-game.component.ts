import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import {ListGamedId, Player} from '../../infra/httpRequest/player';

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent implements OnInit {
  @Input() userId: number;

  @Output() gameSelectChange = new EventEmitter<number>();
  @Input() games: ListGamedId = {listGameId: []};
  @Input() gameId: number;
  players: Player[];

  constructor(public service: HttpTileRepositoryService) {
  }

  async ngOnInit(): Promise<void> {

    this.games = await this.service.getGamesByUserId(this.userId);
  }


  async gameChoice(gameId: number): Promise<void> {
    console.log('game selected : ' + gameId + ' user : ' + this.userId);
    this.gameSelectChange.emit(gameId);
    this.players = await this.service.getPlayers(this.gameId);
  }

}
