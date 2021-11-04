import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tile-pawn',
  templateUrl: './tile-pawn.component.html',
  styleUrls: ['./tile-pawn.component.css']
})
export class TilePawnComponent implements OnInit {
  @Input() image: string='';
  @Input() style: string='';
  constructor() { }

  ngOnInit(): void {
  }

  isImg = () => this.image !== '../../assets/img/';
}
