import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCodeComponent } from './dialog-code.component';

describe('DialogCodeComponent', () => {
  let component: DialogCodeComponent;
  let fixture: ComponentFixture<DialogCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
