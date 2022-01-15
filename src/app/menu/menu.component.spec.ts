import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';
import { AuthGuard } from '../auth/auth.guard';
import { MatMenuModule } from '@angular/material/menu';

describe('MenuComponent', () => {
    let component: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MenuComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, MatMenuModule],
            providers: [HttpTileRepositoryService, AuthGuard]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
