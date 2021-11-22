import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInComponent } from './log-in.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import HttpTileRepositoryService from "../../../infra/httpRequest/http-tile-repository.service";
import {AuthGuard} from "../../auth/auth.guard";

describe('LogInComponent', () => {
    let component: LogInComponent;
    let fixture: ComponentFixture<LogInComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            RouterTestingModule
          ],
          providers: [HttpTileRepositoryService, AuthGuard],
            declarations: [LogInComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LogInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
