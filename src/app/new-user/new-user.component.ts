import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import {ListUsersId} from '../../domain/player';
import { Login } from '../../domain/Tile';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit{
  @Input() userId: number=0;
  @Output() userChange = new EventEmitter<number>();
  @Input() users: ListUsersId = {listUsersId: []};
constructor(public service: HttpTileRepositoryService) {
}


   ngOnInit(): void{
    // await this.service.LogoutUser();
    let login: Login;
    login = {pseudo: 'jc11', password:'qwirkle', isRemember:true}
    this.service.LoginUser(login).subscribe( res => {
      console.log(res);
      this.service.whoAmI().subscribe(resa=>{this.userId=resa; this.service.getUsers().then(res1=>this.users =res1);});

    });
  }



  userChoice(user: number): void {
    this.userChange.emit(user);
  }

}

