import {Component, Input} from '@angular/core';
const SPACE = '';
@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent {

  @Input() winner: string = SPACE;


}
