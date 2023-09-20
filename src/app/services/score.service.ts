import { BehaviorSubject, Observable } from 'rxjs';
import { IGameStats } from '../interfaces/Score';
import { GAME_STATS, POINTS } from '../data';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ScoreService {

    /**
     * BehaviorSubject to hold and broadcast the game scoring stats.
     */
    private scoreSubject$ = new BehaviorSubject<IGameStats>(GAME_STATS);

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
     * Get the current score.
     * @returns {number} The current score.
     */
    getScore(): number {
        const score = this.scoreSubject$.value;
        return score.score;
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
        updatedGameStats.level = Math.floor(
            updatedGameStats.lines / updatedGameStats.levelUp + 1
        );
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

}
