import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tile } from '../../domain/Tile';

@Component({
    selector: 'app-tile-in-bag',
    templateUrl: './tile-in-bag.component.html',
    styleUrls: ['./tile-in-bag.component.css']
})
export class TileInBagComponent implements OnInit {
    @Input() Bag = 108;

    @Input() swap: Tile[] = [];

    @Output() swapEvent = new EventEmitter();

    ngOnInit(): void {}

    Swap() {
        this.swapEvent.emit();
    }
}
