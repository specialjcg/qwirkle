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
    expect(component.image).toEqual('')
    expect(component.style).toEqual('')
    expect(component).toBeTruthy();
  });
  it('should return true if   image is not empty', () => {
    component.image='../../assets/img/tile.svg'

    expect(component.isImg()).toBeTruthy()
  });
  it('should return false if   image is  empty', () => {
    component.image='../../assets/img/'

    expect(component.isImg()).toBeFalsy()
  });
});
