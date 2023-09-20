import { CommonModule } from '@angular/common';
import { HighScore } from '../../interfaces/Score';
import { Component, inject } from '@angular/core';
import { HIGH_SCORES } from '../../data';
import { ScoreService } from 'src/app/services/score.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-high-score',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h5 *ngIf="finalScore > 0">Your final score was: {{finalScore}}</h5>
    <input *ngIf="finalScore > 0 && isTopScore(finalScore)" [(ngModel)]="playerName" placeholder="Enter your name">
    <button *ngIf="finalScore > 0 && isTopScore(finalScore)" (click)="saveScore()">Save Score</button>
    <div *ngFor="let hs of highScores; let i = index">
        <div class="flex space-between">
            <span>{{i + 1 }}. {{hs.playerName}}</span>
            <span> {{hs.score}}</span>
        </div>
    </div>
    `,
})
export class HighScoreComponent {

    highScores: HighScore[] = HIGH_SCORES;
    finalScore: number = 0;
    playerName: string = '';

    private scoreService = inject(ScoreService);
    private router = inject(Router);

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
        const finalScore = this.scoreService.getFinalScore();
            if (finalScore) {
                this.finalScore = finalScore;
                if (!this.isTopScore(this.finalScore)) {
                    setTimeout(() => {
                        this.redirect();
                    }, 3000);
                }
            }
        
    }


    /**
     * Redirect to the start page if finalScore not in top 10.
     */
    redirect(): void {
        // this.scoreService.setFinalScore(0);
        this.playerName = '';
        this.router.navigate(['/start']);
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

    saveScore(): void {
        console.log('updateHighScores', this.finalScore);
        if (this.isTopScore(this.finalScore)) {
            this.highScores.push({ playerName: this.playerName || 'Unknown', score: this.finalScore });
            this.sortHighScores();
            this.keepTopTen();
            this.redirect();
        }
    }
}
