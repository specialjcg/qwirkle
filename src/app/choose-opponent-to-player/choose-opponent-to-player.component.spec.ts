import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChooseOpponentToPlayerComponent} from './choose-opponent-to-player.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('ChooseOpponentToPlayerComponent', () => {
  let component: ChooseOpponentToPlayerComponent;
  let fixture: ComponentFixture<ChooseOpponentToPlayerComponent>;

    beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseOpponentToPlayerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
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
