import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tile-pawn',
  templateUrl: './tile-pawn.component.html',
  styleUrls: ['./tile-pawn.component.css']
})
export class TilePawnComponent {
  @Input() image: string = '';
  @Input() style: string = '';


  isImg = () => this.image !== '../../assets/img/';
}
