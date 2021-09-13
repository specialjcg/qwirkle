import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import HttpTileRepositoryService from 'src/infra/httpRequest/http-tile-repository.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})


export class NewGameComponent implements OnInit {
  @Input() game: number;
  @Output() gameChange = new EventEmitter<number>();
games: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  constructor(public service: HttpTileRepositoryService) { }

  ngOnInit(): void {

  }

  newGame(): void {
    this.gameChange.emit(this.game);
  }
}
