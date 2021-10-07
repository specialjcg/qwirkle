import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player-turn',
  templateUrl: './player-turn.component.html',
  styleUrls: ['./player-turn.component.css']
})
export class PlayerTurnComponent implements OnInit {

  @Input() playerName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
