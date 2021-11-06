import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickComponent } from './pick.component';
import {Tile} from "../../domain/Tile";
import {Color} from "../../domain/Color";

describe('PickComponent', () => {
  let component: PickComponent;
  let fixture: ComponentFixture<PickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should display an empty pickaxe at the start with six emplacement', () => {
  //   expect(component.bag).toEqual([]);
  // });
  // it('should display an  pickaxe when put tile on pick', () => {
  //   const tile: Tile = {id: 1, shape: 0, color: Color.Purple, x: 0, y: 0, disabled: true};
  //   component.dropResult(tile)
  //   expect(component.bag).toEqual([]);
  // });
});
