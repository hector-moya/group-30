import { BehaviorSubject, Observable } from 'rxjs';
import { GAME_STATS, POINTS } from '../data';
import { IGameStats } from '../interfaces/Score';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ScoreService {

    /**
     * BehaviorSubject to hold and broadcast the game scoring stats.
     */
    private scoreSubject$ = new BehaviorSubject<IGameStats>(GAME_STATS);

    /**
     * BehaviorSubject to hold and broadcast the final game score.
     */
    private finalScoreSubject$ = new BehaviorSubject<number>(0);

    /**
     * Sets the observable that emits the game scoring stats.
     * @returns An observable of the game scoring stats.
     */
    observeScore(): Observable<IGameStats> {
        return this.scoreSubject$.asObservable();
    }

    /**
     * Update the game score and statistics based on cleared lines.
     * @param linesCleared The number of lines cleared.
     */
    updateGameStats(linesCleared: number): void {
        const updatedGameStats = this.calculateStats(linesCleared);
        this.scoreSubject$.next(updatedGameStats);
    }

    /**
     * Perform the score calculations to update the game statistics.
     * @param linesCleared
     * @returns
     */
    private calculateStats(linesCleared: number): IGameStats {
        const updatedGameStats = { ...this.scoreSubject$.value }; // Clone current stats
        updatedGameStats.score += this.getPoints(linesCleared);
        updatedGameStats.lines += linesCleared;
        updatedGameStats.level = Math.floor(updatedGameStats.lines / updatedGameStats.levelUp + 1);
        return updatedGameStats;
    }

    /**
     * Get the score based on the number of cleared lines.
     * @param {number} linesCleared The number of lines cleared.
     * @returns {number} Points scored.
     */
    private getPoints(linesCleared: number): number {
        return POINTS[linesCleared] ?? 0;
    }

    /**
     * Get the observable that emits the final game score.
     * @returns An observable of the final game score.
     */
    getFinalScore(): Observable<number> {
        console.log('getFinalScore', this.finalScoreSubject$.value);
        return this.finalScoreSubject$.asObservable();
    }

    /**
     * Set the final game score.
     * @param finalScore 
     */
    setFinalScore(finalScore: number): void {
        console.log('setFinalScore', finalScore);
        this.finalScoreSubject$.next(finalScore);
    }
}
