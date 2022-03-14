import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCodeComponent } from './dialog-code.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('DialogCodeComponent', () => {
    let component: DialogCodeComponent;
    let fixture: ComponentFixture<DialogCodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogCodeComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} }
            ]
        }).compileComponents();
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
