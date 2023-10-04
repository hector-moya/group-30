import { ScoreService } from 'src/app/services/score.service';
import { HighScore } from '../../interfaces/Score';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-high-score',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngFor="let hs of highScores; let i = index ">
            <div class="flex space-between">
                <div class="flex">
                <div class="w-2">{{ i + 1 }}.</div>
                <p> {{hs.playerName}}</p>
                </div>
                <span> {{hs.score}}</span>
            </div>
        </div>
    `,
})
export class HighScoreComponent {

    highScores: HighScore[] = [];

    private scoreService = inject(ScoreService)

    ngOnInit() {
        this.highScores = this.scoreService.getHighScores()
    }

    ngDoCheck(): void {
        console.log(this.highScores);

    }
}


