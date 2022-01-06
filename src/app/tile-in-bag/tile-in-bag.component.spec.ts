import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileInBagComponent } from './tile-in-bag.component';

describe('TileInBagComponent', () => {
  let component: TileInBagComponent;
  let fixture: ComponentFixture<TileInBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TileInBagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TileInBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
