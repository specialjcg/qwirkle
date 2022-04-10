import { Component, Input } from '@angular/core';
import { TileFront } from '../../domain/Tile';

@Component({
    selector: 'app-tile-pawn',
    templateUrl: './tile-pawn.component.html',
    styleUrls: ['./tile-pawn.component.css']
})
export class TilePawnComponent {
    @Input() image = '';

    @Input() style = '';

    @Input() isDrag = false;

    @Input() scale = 1;

    isImg = () => this.image !== '../../assets/img/';

    @Input() isLastPlayer = false;

    getclassbox2dDrag(scale: number) {
        if (Number.isNaN(scale) || scale === 0) scale = 1;
        return scale * 100 + 'px';
    }

    getclassboxTranslate(scale: number) {
        return 'translate(' + -scale * 50 + 'px,' + -scale * 50 + 'px)';
    }

    getclassbtn2dDrag(scale: number) {
        if (Number.isNaN(scale) || scale === 0) scale = 1;
        return scale * 100 + 'px';
    }

    border(isLastPlayer: boolean): string {
        return isLastPlayer ? 'img2d borderTilePlayed' : 'img2d';
    }
}
