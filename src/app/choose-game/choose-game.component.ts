import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from 'src/infra/httpRequest/http-tile-repository.service';
import { ListGamedId } from 'src/infra/httpRequest/player';

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent implements OnInit {
  @Input() userId: number;
  @Output() gameSelectChange = new EventEmitter<number>();
  games: ListGamedId = {listGameId: []};
  gameId: number;

  constructor(public service: HttpTileRepositoryService) {
  }

  async ngOnInit(): Promise<void> {
    this.games = await this.service.getGamesByUserId(this.userId);
  }


  gameChoice(gameId: number): void {
    console.log('game selected : ' + gameId + ' user : ' + this.userId)
    this.gameSelectChange.emit(gameId);
  }

}
