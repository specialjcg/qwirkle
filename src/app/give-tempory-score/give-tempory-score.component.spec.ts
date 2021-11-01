import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveTemporyScoreComponent } from './give-tempory-score.component';

describe('GiveTemporyScoreComponent', () => {
  let component: GiveTemporyScoreComponent;
  let fixture: ComponentFixture<GiveTemporyScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveTemporyScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveTemporyScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
