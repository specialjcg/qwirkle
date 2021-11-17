import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {NewUserComponent} from './new-user.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgxPanZoomModule} from 'ngx-panzoom';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import HttpTileRepositoryService from "../../infra/httpRequest/http-tile-repository.service";

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let service: HttpTileRepositoryService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewUserComponent],
      imports: [
        BrowserModule, NgxPanZoomModule,
        BrowserAnimationsModule,
        MatButtonModule, HttpClientModule, DragDropModule, MatIconModule, MatOptionModule, MatSelectModule, MatCardModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(HttpTileRepositoryService)
    fixture = TestBed.createComponent(NewUserComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.users).toEqual({listUsersId: []})
    expect(component).toBeTruthy();
  });
  it('should emit on click  user', fakeAsync(async () => {
    component.users = {listUsersId: [10, 11]};
    component.userId = 0;
    jest.spyOn(component.userChange, 'emit');

    component.userChoice(10);
    fixture.detectChanges();
    expect(component.userChange.emit).toHaveBeenCalledWith(10);
  }));

});
