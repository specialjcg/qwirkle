import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackSupportComponent } from './rack-support.component';

describe('RackSupportComponent', () => {
  let component: RackSupportComponent;
  let fixture: ComponentFixture<RackSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RackSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RackSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
