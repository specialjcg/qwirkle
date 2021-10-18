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
  players: Player[] = [];
  names: ListNamePlayer = {listNamePlayer: []};
  nameToPlay = '';


  constructor(public service: HttpTileRepositoryService) {

  }

  async ngOnInit(): Promise<void> {
    this.players = await this.service.getPlayers(this.gameId);
    this.names = await this.service.getPlayerName(this.gameId);

  }


  playerToTurnClass(name: string): string {
      return name === this.nameToTurn ? 'card-group colorTurnOn' : 'card-group colorTurnOff';
  }

  playerChoice(player: Player, name: string): void {
    this.nameToPlay = name;
    this.playerSelectChange.emit(player);
  }

  isNameTurn(): boolean {
    console.log(this.nameToTurn);
    return this.nameToTurn !== '' && this.nameToTurn !== null;
  }
}
