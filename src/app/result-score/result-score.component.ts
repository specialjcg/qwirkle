import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-result-score',
  templateUrl: './result-score.component.html',
  styleUrls: ['./result-score.component.css']
})
export class ResultScoreComponent implements OnInit {
  @Input() score: number=0;
  constructor() { }

  ngOnInit(): void {
  }

}
