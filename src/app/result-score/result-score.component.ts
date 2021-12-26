import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-result-score',
    templateUrl: './result-score.component.html',
    styleUrls: ['./result-score.component.css']
})
export class ResultScoreComponent {
    @Input() score = 0;
}
