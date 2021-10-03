import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import HttpTileRepositoryService from 'src/infra/httpRequest/http-tile-repository.service';
import {ListGamedId} from '../../infra/httpRequest/player';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})


export class NewGameComponent implements OnInit {
  @Input() game: number;
  @Output() gameChange = new EventEmitter<number>();
  games: ListGamedId;
  constructor(public service: HttpTileRepositoryService) {

  }

  async ngOnInit(): Promise<void> {
    this.games = await this.service.getListGames();
  }

  newGame(): void {
    this.gameChange.emit(this.game);
  }
}
