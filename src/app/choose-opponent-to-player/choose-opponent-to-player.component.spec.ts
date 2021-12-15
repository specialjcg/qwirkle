import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOpponentToPlayerComponent } from './choose-opponent-to-player.component';

describe('ChooseOpponentToPlayerComponent', () => {
  let component: ChooseOpponentToPlayerComponent;
  let fixture: ComponentFixture<ChooseOpponentToPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseOpponentToPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseOpponentToPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
