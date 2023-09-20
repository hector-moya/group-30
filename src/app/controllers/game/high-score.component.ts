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
    <div *ngIf="finalScore > 0 && !isTopScore(finalScore)">
      <h5>Your final score was: {{ finalScore }}</h5>
      <p>You did not make it to the top 10. Better luck next time!</p>
    </div>
    <div *ngIf="finalScore > 0 && isTopScore(finalScore) && !scoreSaved">
      <input [(ngModel)]="playerName" placeholder="Enter your name" />
      <button
        *ngIf="finalScore > 0 && isTopScore(finalScore)"
        (click)="saveScore()"
      >
        Save Score
      </button>
    </div>
    <div *ngIf="scoreSaved || finalScore == 0">
      <div *ngFor="let hs of highScores; let i = index">
        <div class="flex space-between">
          <span>{{ i + 1 }}. {{ hs.playerName }}</span>
          <span> {{ hs.score }}</span>
        </div>
      </div>
    </div>
  `,
})
export class HighScoreComponent {
  highScores: HighScore[] = HIGH_SCORES;
  finalScore: number = 0;
  playerName: string = '';
  scoreSaved: boolean = false;

  private scoreService = inject(ScoreService);

  constructor() {
    this.init();
  }

  init() {
    this.sortHighScores();
    this.getScore();
  }

  sortHighScores() {
    this.highScores.sort((a, b) => b.score - a.score);
  }

  /**
   * Get the final score from the score service.
   */
  getScore(): void {
    const finalScore = this.scoreService.getFinalScore();
    if (finalScore) {
      this.finalScore = finalScore;
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

  /**
   * Save the score to the high scores list.
   */
  saveScore(): void {
    if (this.isTopScore(this.finalScore)) {
      this.highScores.push({
        playerName: this.playerName || 'Unknown',
        score: this.finalScore,
      });
      this.sortHighScores();
      this.keepTopTen();
      this.playerName = '';
      this.finalScore = 0;
      this.scoreSaved = true;
    }
  }
}
