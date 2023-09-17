import { IPosition } from '../interfaces/Position';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { IConfig } from '../interfaces/Config';
import { Injectable } from '@angular/core';
import { GRID, TETROMINOS } from '../data';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    /**
     * Next Piece BehaviorSubjects to notify subscribers of changes
     */
    private gridSubject$: BehaviorSubject<Matrix | null> = new BehaviorSubject<Matrix | null>(GRID)

    private config!: IConfig;

    constructor(private configService: ConfigService) {
        this.subscribeToConfig();
    }

    observeGrid(): Observable<Matrix | null> {
        return this.gridSubject$.asObservable();
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

    canMove(shape: Matrix, position: IPosition): boolean {
        // `shape.every` checks if every row of the shape meets the conditions
        return shape.every((row, rowIndex) => {
            // `row.every` checks if every value (cell) in the row meets the conditions.
            return row.every((tetVal, columnIndex) => {
                // Calculate the actual x and y position on the grid for this cell
                let x = position.x + columnIndex;
                let y = position.y + rowIndex;
                return tetVal === 0 ||
                    this.isInBoundary({ x, y });
            });
        });
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

}
