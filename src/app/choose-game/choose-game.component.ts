import {Component, EventEmitter, Input, Output} from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import {BoardGame, ListGamedId} from '../../domain/player';
import {toListGamedId} from '../../domain/games';
import {Router} from '@angular/router';
import {TileFront} from "../../domain/Tile";

@Component({
  selector: 'app-choose-game',
  templateUrl: './choose-game.component.html',
  styleUrls: ['./choose-game.component.css']
})
export class ChooseGameComponent {
  @Output() gameSelectChange = new EventEmitter<number>();

  @Input() listGamedId: ListGamedId = {listGameId: []};

  @Input() gameId = 0;
  public gamesList: BoardGame[]=[];

  constructor(public service: HttpTileRepositoryService, private router: Router) {
  }

   ngOnInit() {
    this.gamesList=[];
    this.service.getGames().subscribe((games) => {
      this.listGamedId = toListGamedId(games);


   });
   }

   gameChoice(gameId: number) {
    this.router.navigate(['/game/' + gameId]).then();
  }

  getBoard(i: number): TileFront[] {

    return this.gamesList[i].boards

  }
}
