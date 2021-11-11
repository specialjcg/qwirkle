import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tile-pawn',
  templateUrl: './tile-pawn.component.html',
  styleUrls: ['./tile-pawn.component.css']
})
export class TilePawnComponent {
  @Input() image: string = '';
  @Input() style: string = '';
  @Input() isDrag: boolean = false;
  @Input() scale: number = 0;
  isImg = () => this.image !== '../../assets/img/';

  getclassbox2dDrag(scale: number) {
    return scale*100+'px';
  }
getclassboxTranslate(scale:number){
    return 'translate(' + -scale * 50 + 'px,' + -scale*50 + 'px)';
}
  getclassbtn2dDrag(scale: number) {
    return scale*100+'px';
  }
}
