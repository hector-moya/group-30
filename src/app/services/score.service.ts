import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GameStats } from '../defs';
import { POINTS } from '../data';

@Injectable({
    providedIn: 'root'
})
export class ScoreService {

    gameStats: GameStats = { score: 0, lines: 0, level: 1, levelUp: 10 };

    /**
     * BehaviorSubject to hold and broadcast the game stats
     */
    private scoreSubject = new BehaviorSubject<GameStats>(this.gameStats);

    /**
     * Get the observable that emits the game scoring stats.
     * @returns An observable of the game scoring stats.
     */
    getScoreObservable(): Observable<GameStats> {
        return this.scoreSubject.asObservable();
    }

    /**
     * Update the game score and statistics based on cleared lines.
     * @param linesCleared The number of lines cleared.
     */
    updateScore(linesCleared: number): void {
        this.updateGameStats(linesCleared);
        this.scoreSubject.next(this.gameStats);
    }

    /**
     * Update the game statistics based on cleared lines.
     * @param linesCleared The number of lines cleared.
     */
    private updateGameStats(linesCleared: number): void {
        this.setScore(linesCleared);
        this.setLines(linesCleared);
        this.setLevel();
    }

    /**
     * Set the game score based on cleared lines.
     * @param linesCleared The number of lines cleared.
     */
    private setScore(linesCleared: number): void {
        this.gameStats.score += this.getScore(linesCleared);
    }

    /**
     * Get the score based on the number of cleared lines.
     * @param linesCleared The number of lines cleared.
     * @returns The calculated score.
     */
    private getScore(linesCleared: number): number {
        return POINTS[linesCleared] ?? 0;
    }

    /**
     * Update the number of cleared lines in the game statistics.
     * @param linesCleared The number of lines cleared.
     */
    private setLines(linesCleared: number): void {
        this.gameStats.lines += linesCleared;
    }

    /**
     * Update the game level in the game statistics.
     */
    private setLevel(): void {
        this.gameStats.level = Math.floor(this.gameStats.lines / this.gameStats.levelUp + 1);
    }

}


