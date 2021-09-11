import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-my-button',
  templateUrl: './my-button.component.html',
  styleUrls: ['./my-button.component.css']
})
export class MyButtonComponent implements OnInit {
  @Input() image: string;
  @Input() style: string;
  constructor() { }

  ngOnInit(): void {
  }

  isImg = () => this.image !== '../../assets/img/';
}
