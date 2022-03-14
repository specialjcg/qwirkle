import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-code',
    templateUrl: './dialog-code.component.html',
    styleUrls: ['./dialog-code.component.css']
})
export class DialogCodeComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }) {}

    ngOnInit(): void {}
}
