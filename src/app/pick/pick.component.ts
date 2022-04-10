import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileFront, toNameImage, toPlate } from '../../domain/Tile';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-pick',
    templateUrl: './pick.component.html',
    styleUrls: ['./pick.component.css']
})
export class PickComponent {
    @Input() plate: TileFront[][] = [];

    @Input() board: TileFront[] = [];

    voidTile: TileFront[] = [{ disabled: false, shape: 0, color: 0, y: 0, x: 0 }];

    @Input() swap: TileFront[] = [];

    @Output() swapClick = new EventEmitter<TileFront[]>();

    @Input() swapEvent = false;

    @Input() bagLength = 108;

    getPawStyle(index: number): string {
        if (index <= 3) return 'example-container';
        return 'example-container2';
    }

    getPawStyletest(number: number): string {
        return 'example-container3';
    }

    getRackTileImage(tile: TileFront): string {
        return '../../assets/img/' + toNameImage(tile);
    }

    dropempty(event: CdkDragDrop<TileFront[]>): void {
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

    dropResult(event: CdkDragDrop<TileFront[]>): void {
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

    swapchange() {
        this.swapClick.emit(this.swap);
    }
}
