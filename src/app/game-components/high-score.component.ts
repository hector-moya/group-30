import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HIGH_SCORES } from '../data';
import { HighScore } from '../defs';

@Component({
    selector: 'app-high-score',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngFor="let hs of highScores">
        <div class="flex space-between">
            <span> {{hs.playerName}}</span>
            <span> {{hs.score}}</span>
        </div>
    </div>
    `,
})
export class HighScoreComponent {

    highScores: HighScore[] = HIGH_SCORES;

    constructor() {
        this.init();
    }

    init() {
        this.sortHighScores();
    }

    sortHighScores() {
        this.highScores.sort((a, b) => b.score - a.score);
    }
}
