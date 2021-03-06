import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalScoreComponent } from './total-score.component';

describe('TotalScoreComponent', () => {
    let component: TotalScoreComponent;
    let fixture: ComponentFixture<TotalScoreComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TotalScoreComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TotalScoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component.totalScore).toEqual(0);
        expect(component).toBeTruthy();
    });
});
