import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosePlayerComponent } from './chose-player.component';

describe('ChosePlayerComponent', () => {
  let component: ChosePlayerComponent;
  let fixture: ComponentFixture<ChosePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChosePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChosePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
