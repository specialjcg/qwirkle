import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilePawnComponent } from './tile-pawn.component';

describe('MyButtonComponent', () => {
  let component: TilePawnComponent;
  let fixture: ComponentFixture<TilePawnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilePawnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilePawnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
