import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickComponent } from './pick.component';
import { Tile } from '../../domain/Tile';
import { DebugElement } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { never } from 'rxjs';

describe('PickComponent', () => {
    let component: PickComponent;
    let fixture: ComponentFixture<PickComponent>;
    let de: DebugElement;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PickComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PickComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should init plate to empty at first', () => {
        expect(component.plate).toEqual([]);
        expect(component.board).toEqual([]);
        expect(component.voidTile).toEqual([
            { disabled: false, shape: 0, color: 0, y: 0, x: 0 }
        ]);
        expect(component.swap).toEqual([]);
        expect(component).toBeTruthy();
    });
    it('should return the good position of paw in style', () => {
        expect(component.getPawStyle(1)).toEqual('example-container');
    });

    it('should return true if   image is not empty', () => {
        const tile: Tile = {
            color: 6,
            disabled: true,
            shape: 2,
            x: 2,
            y: 0
        };

        expect(component.getRackTileImage(tile)).toEqual(
            '../../assets/img/YellowSquare.svg'
        );
    });
    it('should drop a tile when empty ', () => {
        const tile: Tile[] = [
            {
                color: 6,
                disabled: true,
                shape: 2,
                x: 2,
                y: 0
            }
        ];
    });
});
