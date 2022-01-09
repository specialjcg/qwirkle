import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-tile-in-bag',
    templateUrl: './tile-in-bag.component.html',
    styleUrls: ['./tile-in-bag.component.css']
})
export class TileInBagComponent implements OnInit {
    @Input() Bag: number = 108;

    constructor() {}

    ngOnInit(): void {}
}
