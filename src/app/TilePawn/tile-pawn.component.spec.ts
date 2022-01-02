import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilePawnComponent } from './tile-pawn.component';

describe('MyButtonComponent', () => {
    let component: TilePawnComponent;
    let fixture: ComponentFixture<TilePawnComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TilePawnComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TilePawnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component.image).toEqual('');
        expect(component.style).toEqual('');
        expect(component.isDrag).toEqual(false);
        expect(component.scale).toEqual(1);
        expect(component).toBeTruthy();
    });
    it('should return true if   image is not empty', () => {
        component.image = '../../assets/img/tile.svg';

        expect(component.isImg()).toBeTruthy();
    });
    it('should return false if   image is  empty', () => {
        component.image = '../../assets/img/';

        expect(component.isImg()).toBeFalsy();
    });
    it('should return style witdh to set', () => {
        component.scale = 0.7;

        expect(component.getclassbox2dDrag(component.scale)).toEqual('70px');
    });
    it('should return style height to set', () => {
        component.scale = 0.7;

        expect(component.getclassbtn2dDrag(component.scale)).toEqual('70px');
    });
    it('should return style translate pawn by style ', () => {
        component.scale = 0.7;

        expect(component.getclassboxTranslate(component.scale)).toEqual(
            'translate(-35px,-35px)'
        );
    });
});
