import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import {ListUsersId} from '../../domain/player';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @Input() userId: number=0;
  @Output() userChange = new EventEmitter<number>();
  users: ListUsersId = {listUsersId: []};
  constructor(public service: HttpTileRepositoryService) {
  }

  async ngOnInit(): Promise<void> {
    this.users = await this.service.getUsers();
    console.log(this.userId);
  }


  userChoice(user: number): void {
    this.userChange.emit(user);
  }

}
