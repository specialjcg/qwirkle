import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import {ListUsersId} from '../../domain/player';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent  {
  @Input() userId: number=0;
  @Output() userChange = new EventEmitter<number>();
  @Input() users: ListUsersId = {listUsersId: []};





  userChoice(user: number): void {
    this.userChange.emit(user);
  }

}
