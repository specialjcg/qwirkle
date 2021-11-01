import {Component, Input, OnInit} from '@angular/core';
import {Rack} from "../../infra/httpRequest/player";

@Component({
  selector: 'app-give-tempory-score',
  templateUrl: './give-tempory-score.component.html',
  styleUrls: ['./give-tempory-score.component.css']
})
export class GiveTemporyScoreComponent implements OnInit {
  @Input() score: Rack;
  constructor() { }

  ngOnInit(): void {
  }

}
