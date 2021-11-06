import {Component, Input} from '@angular/core';
import {Rack} from '../../domain/player';

@Component({
  selector: 'app-give-tempory-score',
  templateUrl: './give-tempory-score.component.html',
  styleUrls: ['./give-tempory-score.component.css']
})
export class GiveTemporyScoreComponent {
  @Input() score: Rack = {code: 0, tilesPlayed: [], newRack: [], points: 0};


}
