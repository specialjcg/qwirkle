import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import HttpTileRepositoryService from '../../infra/httpRequest/http-tile-repository.service';

@Component({
    selector: 'app-waiting-player',
    templateUrl: './waiting-player.component.html',
    styleUrls: ['./waiting-player.component.css']
})
export class WaitingPlayerComponent implements OnInit {
    @Input() userName: string[] = [];


    constructor(private changeDetector: ChangeDetectorRef,) {}

    ngOnInit(): void {
        this.changeDetector.detectChanges();
    }
}
