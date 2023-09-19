import { EXT_TETROMINOS, GRID, TETROMINOS } from '../data';
import { IPosition } from '../interfaces/Position';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { IConfig } from '../interfaces/Config';
import { Injectable } from '@angular/core';
import { ScoreService } from './score.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    /**
     * Next Piece BehaviorSubjects to notify subscribers of changes
     */
    private gridSubject$: BehaviorSubject<Matrix | null> = new BehaviorSubject<Matrix | null>(GRID)
    private playStateSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    private config!: IConfig;

    constructor(private configService: ConfigService, private scoreService: ScoreService) {
        this.subscribeToConfig();
    }

    /**
     * Get the observable that emits the game grid.
     * @returns An observable of the game grid.
     */
    observeGrid(): Observable<Matrix | null> {
        return this.gridSubject$.asObservable();
    }

    /**
     * Get the observable that emits the game play state.
     * @returns An observable of the game play state.
     */
    observePlayState(): Observable<boolean> {
        return this.playStateSubject$.asObservable();
    }

    /**
     * Render the grid with the game state
     * @param {CanvasRenderingContext2D} ctx The canvas context
     * @returns {void}
     */
    renderGrid(ctx: CanvasRenderingContext2D): void {
        const grid = this.gridSubject$.value;
        grid!.forEach((row, y) => {
            // tetVal represents the tetromino value. I = 1, J=2 ... Z=7
            row.forEach((tetVal, x) => {
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 0.005;
                ctx.strokeRect(x, y, 1, 1);
                ctx.stroke();
                if (tetVal > 0) {
                    // fetch the tetromino object from either the TETROMINOS or EXT_TETROMINOS object
                    const tetromino = Object.values({ ...TETROMINOS, ...EXT_TETROMINOS }).find(t => t.id === tetVal);
                    ctx.fillStyle = tetromino!.color;
                    ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    /**
     * Check if there is a top collision to end the game
     * @param {Matrix} shape The shape to check
     */
    isTopCollision(shape: Matrix, position: IPosition): boolean {
        return shape.some((row, rowIndex) => {
            return row.some((tetVal) => {
                return tetVal > 0 && position.y + rowIndex <= 1;
            });
        });
    }

    /**
     * Check if the shape can move to the position
     * @param {matrix} shape The shape to check
     * @param {position} position The position to check
     * @returns {boolean} Whether the shape can move to the position
     */
    canMove(shape: Matrix, position: IPosition): boolean {
        // `shape.every` checks if every row of the shape meets the conditions
        return shape.every((row, rowIndex) => {
            // `row.every` checks if every value (cell) in the row meets the conditions.
            return row.every((tetVal, columnIndex) => {
                // Calculate the actual x and y position on the grid for this cell
                let x = position.x + columnIndex;
                let y = position.y + rowIndex;
                return tetVal === 0 ||
                    this.isInBoundary({ x, y }) && this.isVacant({ x, y });
            });
        });
    }

    /**
     * Lock the piece in place on the game board
     * @param matrix
     * @param position
     */
    lock(matrix: Matrix, position: IPosition): void {
        const currentGrid = this.gridSubject$.value;
        matrix.forEach((row, rowIndex) => {
            row.forEach((tetVal, columnIndex) => {
                if (tetVal > 0) {
                    let x = position.x + columnIndex;
                    let y = position.y + rowIndex;
                    currentGrid![y][x] = tetVal;
                }
            });
        });
    }

    /**
     * Clear the rows that are filled
     */
    clearRows(): void {
        const grid = this.gridSubject$.value;
        let linesCleared = 0;
        grid!.forEach((row, y) => {
            if (row.every(cell => cell > 0)) {
                grid!.splice(y, 1);
                grid!.unshift(Array(this.config.columns).fill(0));
                linesCleared++;
            }
        });
        if (linesCleared > 0) {
            this.scoreService.updateGameStats(linesCleared);
        }
    }

    /**
     * Check if the position is within the grid boundaries
     * @param {IPosition} position The position to check
     * @returns {boolean} Whether the position is within the grid boundaries
     */
    private isInBoundary(position: IPosition): boolean {
        return position.x >= 0
            && position.x < this.config.columns
            && position.y < this.config.rows;
    }

    /**
     * Check if the position is vacant
     * @param {IPosition} position The position to check
     * @returns {boolean} Whether the position is vacant
     */
    private isVacant(position: IPosition): boolean {
        const grid = this.gridSubject$.value;
        const { x, y } = position;
        return grid![x] && grid![y][x] === 0;
    }

    /**
     * Update the play state of the game
     * @param {boolean} state
     */
    setGameState(state: boolean): void {
        this.playStateSubject$.next(state);
    }

    /**
     * Subscribe to the configuration updates from the ConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    private subscribeToConfig(): void {
        this.configService.observeConfig().subscribe((config: IConfig) => {
            this.config = config;
        });
    }
}
