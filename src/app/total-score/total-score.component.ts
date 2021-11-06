import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-total-score',
  templateUrl: './total-score.component.html',
  styleUrls: ['./total-score.component.css']
})
export class TotalScoreComponent {
  @Input() totalScore: number = 0;


}
