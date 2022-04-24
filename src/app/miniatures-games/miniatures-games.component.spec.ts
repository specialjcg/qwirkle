import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniaturesGamesComponent } from './miniatures-games.component';

describe('MiniaturesGamesComponent', () => {
  let component: MiniaturesGamesComponent;
  let fixture: ComponentFixture<MiniaturesGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniaturesGamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniaturesGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
