import { Component, Input } from '@angular/core';
import { Tile, toNameImage, toPlate } from '../../domain/Tile';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-pick',
    templateUrl: './pick.component.html',
    styleUrls: ['./pick.component.css']
})
export class PickComponent {
    @Input() plate: Tile[][] = [];

    @Input() board: Tile[] = [];

    voidTile: Tile[] = [{ disabled: false, shape: 0, color: 0, y: 0, x: 0 }];

    @Input() bag: Tile[] = [];

    getPawStyle(index: number): string {
        return 'translate(' + -index * 65 + 'px,' + index * 15 + 'px)';
    }

    getRackTileImage(tile: Tile): string {
        return '../../assets/img/' + toNameImage(tile);
    }

    dropempty(event: CdkDragDrop<Tile[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    dropResult(event: CdkDragDrop<Tile[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            this.board = this.board.filter(
                (tile) => tile !== event.previousContainer.data[event.previousIndex]
            );
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.plate = toPlate(this.board);
        }
    }
}
