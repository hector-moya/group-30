import { CommonModule } from '@angular/common';
import { HighScore } from '../../interfaces/Score';
import { Component, inject } from '@angular/core';
import { HIGH_SCORES } from '../../data';
import { ScoreService } from 'src/app/services/score.service';
import { Router } from '@angular/router';

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

    private scoreService = inject(ScoreService);
    constructor() {
        this.init();
    }

    init() {
        this.sortHighScores();
        this.subscribeToScore();
    }

    sortHighScores() {
        this.highScores.sort((a, b) => b.score - a.score);
    }

    /**
     * Subscribe to the final score and update the high scores.
     */
    subscribeToScore(): void {
        this.scoreService.getFinalScore().subscribe(finalScore => {
            if (finalScore) {
                this.updateHighScores(finalScore);
                console.log('final score', finalScore);
            }
        });
    }

    /**
     * Update the high scores with the final score.
     * @param finalScore 
     */
    updateHighScores(finalScore: number): void {
        console.log('updateHighScores', finalScore);
        if (this.isTopScore(finalScore)) {
            this.highScores.push({ playerName: 'Player', score: finalScore });
            this.sortHighScores();
            this.keepTopTen();
        }
    }

    /**
     * Check if the final score is in the top 10 highest scores.
     * @param finalScore 
     * @returns boolean 
     */
    isTopScore(finalScore: number): boolean {
        return this.highScores.length < 10 || finalScore > this.highScores[9].score;
    }

    /**
     * Keep only the top 10 highest scores.
     */
    keepTopTen(): void {
        if (this.highScores.length > 10) {
            this.highScores.pop();
        }
    }
}
