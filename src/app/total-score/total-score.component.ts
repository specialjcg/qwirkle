import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-total-score',
  templateUrl: './total-score.component.html',
  styleUrls: ['./total-score.component.css']
})
export class TotalScoreComponent implements OnInit {
  @Input() totalScore: number=0;
  constructor() { }

  ngOnInit(): void {
  }

}
