import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit {
  @Input() winner: string='';
  constructor() { }

  ngOnInit(): void {
  }

}
