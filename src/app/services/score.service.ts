import { HighScore, IGameStats } from '../interfaces/Score';
import { BehaviorSubject, Observable } from 'rxjs';
import { HIGH_SCORES, POINTS } from '../data';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ScoreService {

    /**
     * BehaviorSubject to hold and broadcast the game scoring stats.
     */
    private scoreSubject$ = new BehaviorSubject<IGameStats>({ score: 0, lines: 0, level: 1, levelUp: 1 });

    constructor() {
        if (!localStorage.getItem('highScores')) {
            localStorage.setItem('highScores', JSON.stringify(HIGH_SCORES));
        }
    }

    /**
     * Observe the game scoring stats.
     * @returns An observable of the game scoring stats.
     */
    observeScore(): Observable<IGameStats> {
        return this.scoreSubject$.asObservable();
    }

    /**
     * Sets the game scoring stats subject.
     * @param {IGameStats} gameStats
     */
    setGameStats(gameStats: IGameStats) {
        this.scoreSubject$.next(gameStats);
    }

    /**
     * Calculate the speed of the game based on the current level.
     * @returns {number} The speed of the game.
     */
    getLevelSpeed(): number {
        const level = this.scoreSubject$.value.level;
        let speed = 1000 - (level * 50);
        return speed <= 50 ? 50 : speed; // set a max speed of 50ms
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
        return this.scoreSubject$.value.score;
    }

    /**
    * Check if the final score is in the top 10 highest scores.
    * @returns boolean
    */
    isTopScore(score: number): boolean {
        const hs = this.getHighScores();
        const lowestScore = Math.min(...hs.map(score => score.score));
        return score > lowestScore;
    }

    /**
     * Add a new high score to storage.
     * @param {string} name The name of the player.
     * @param {number} score The score of the player.
     */
    addHighScore(name: string, score: number) {
        const hs = this.getHighScores();

        if (hs.length >= 10) {
            // Remove all elements after the 9th element, keeping only the top
            // 9 scores, then add the new score
            hs.splice(9);
            hs.push({ playerName: name, score: score });
        }

        // update the high scores in storage
        localStorage.setItem('highScores', JSON.stringify(hs));
    }

    /**
     * Get the high scores from storage and sort them in descending order.
     * @returns {HighScore[]} The top 10 high scores.
     */
    getHighScores(): HighScore[] {
        const hsJson = localStorage.getItem('highScores');
        if (!hsJson) throw new Error('No high scores found in storage');
        const hs = JSON.parse(hsJson);
        hs.sort((a: any, b: any) => b.score - a.score);
        return hs;
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
}
