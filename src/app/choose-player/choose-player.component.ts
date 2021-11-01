import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListNamePlayer, Player} from '../../infra/httpRequest/player';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';

@Component({
  selector: 'app-choose-player',
  templateUrl: './choose-player.component.html',
  styleUrls: ['./choose-player.component.css']
})
export class ChoosePlayerComponent implements OnInit {
  @Input() gameId: number;
  @Input() nameToTurn: string;
  @Input() score: number;
  @Output() playerSelectChange = new EventEmitter<Player>();
  @Input() players: Player[];
  names: ListNamePlayer = {listNamePlayer: []};
  nameToPlay = '';


  constructor(public service: HttpTileRepositoryService) {

  }

  async ngOnInit(): Promise<void> {
    this.service.getGames(this.gameId).then(boards => this.players = boards.players);
    this.names = await this.service.getPlayerName(this.gameId).then();
  }


  playerToTurnClass(name: string): string {
      return name === this.nameToTurn ? 'card-group colorTurnOn' : 'card-group colorTurnOff';
  }


  isNameTurn(): boolean {
    return this.nameToTurn !== '' && this.nameToTurn !== null;
  }
}
