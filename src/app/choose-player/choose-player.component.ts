import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Player} from '../../domain/player';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';

@Component({
  selector: 'app-choose-player',
  templateUrl: './choose-player.component.html',
  styleUrls: ['./choose-player.component.css']
})
export class ChoosePlayerComponent {
  @Input() gameId: number = 0;
  @Input() nameToTurn: string = '';
  @Input() score: number = 0;
  @Output() playerSelectChange = new EventEmitter<Player>();
  @Input() players: Player[] = [];
  nameToPlay = '';


  constructor(public service: HttpTileRepositoryService) {

  }


  playerToTurnClass(name: string): string {
    return name === this.nameToTurn ? 'card-group colorTurnOn' : 'card-group colorTurnOff';
  }


  isNameTurn(): boolean {
    return this.nameToTurn !== '';
  }
}
