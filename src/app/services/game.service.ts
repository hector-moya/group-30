import { EXT_TETROMINOS, GRID, TETROMINOS } from '../data';
import { IPosition } from '../interfaces/Position';
import { ConfigService } from './config.service';
import { IConfig } from '../interfaces/Config';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    grid: Matrix = [];

    /**
     * Local reference to the current configuration
     */
    private config!: IConfig;

    /**
     * Subscription to the configuration observable
     */
    private configSubscription: Subscription | undefined;

    constructor(private configService: ConfigService) { }

    /**
     * Initialises the configuration and the game grid
     * @param ctx The canvas rendering context.
     */
    initGrid(ctx: CanvasRenderingContext2D): void {
        if (!this.configSubscription) {
            this.configSubscription = this.configService.observeConfig().subscribe({
                next: (config: IConfig) => {
                    // this.grid = this.getEmptyGrid(config.rows, config.columns);
                    // this.resetGrid(config.rows, config.columns);
                    this.grid = GRID;
                    this.renderGrid(ctx);
                    this.config = config;
                },
                error: (error: any) => {
                    console.error('Failed to fetch configuration:', error);
                },
            });
        }
    }

    /**
     * Render the grid with the game state
     * @param {CanvasRenderingContext2D} ctx The canvas context
     * @returns {void}
     */
    renderGrid(ctx: CanvasRenderingContext2D): void {
        this.grid!.forEach((row, y) => {
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
        matrix.forEach((row, rowIndex) => {
            row.forEach((tetVal, columnIndex) => {
                if (tetVal > 0) {
                    let x = position.x + columnIndex;
                    let y = position.y + rowIndex;
                    this.grid![y][x] = tetVal;
                }
            });
        });
    }

    /**
     * Clear the rows that are filled
     */
    clearRows(): void {
        this.grid!.forEach((row, y) => {
            if (row.every(cell => cell > 0)) {
                this.grid!.splice(y, 1);
                this.grid!.unshift(Array(this.config.columns).fill(0));
            }
        });
    }

    /**
     * Reset the game grid
     * @returns {void}
     */
    resetGrid(rows: number, columns: number): void {
        this.grid = this.getEmptyGrid(rows, columns);
    }

    /**
     * Create an empty grid to store the game state
     * @returns {matrix} An empty grid
     */
    getEmptyGrid(rows: number, columns: number): Matrix {
        return Array.from(
            { length: rows }, () => Array(columns).fill(0)
        );
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
        const { x, y } = position;
        return this.grid![x] && this.grid![y][x] === 0;
    }
}
