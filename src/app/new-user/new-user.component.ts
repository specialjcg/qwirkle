import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { ListUsersId } from 'src/infra/httpRequest/player';
import HttpTileRepositoryService from 'src/infra/httpRequest/http-tile-repository.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @Input() userId: number;
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
