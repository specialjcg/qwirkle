import {Component, EventEmitter, Input, Output} from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import {ListGamedId, Player} from '../../domain/player';

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent {
  @Input() userId: number = 0;

  @Output() gameSelectChange = new EventEmitter<number>();
  @Input() games: ListGamedId = {listGameId: []};
  @Input() gameId: number = 0;
  players: Player[] = [];

  constructor(public service: HttpTileRepositoryService) {
  }


  async ngOnInit(): Promise<void> {
    this.games = await this.service.getUserGames()
  }



  async gameChoice(gameId: number): Promise<void> {
    console.log('game selected : ' + gameId + ' user : ' + this.userId);
    this.gameSelectChange.emit(gameId);
  }

}
