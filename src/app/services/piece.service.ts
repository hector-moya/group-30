import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ITetromino } from '../interfaces/Tetromino';
import { TETROMINOS, EXT_TETROMINOS } from '../data';
import { IPosition } from '../interfaces/Position';
import { ConfigService } from './config.service';
import { IConfig } from '../interfaces/Config';
import { Injectable } from '@angular/core';
import { Piece } from '../models/Piece';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PieceService {

    /**
     * Current Piece BehaviorSubjects to notify subscribers of changes
     */
    private pieceSubject$: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(null)

    /**
     * Next Piece BehaviorSubjects to notify subscribers of changes
     */
    private nextPieceSubject$: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(null);

    private config!: IConfig;

    constructor(private configService: ConfigService) {
        this.subscribeToConfig();
    }

    /**
     * Get the observable that emits the current Piece
     * @returns {Observable<Piece | null>} An observable of the current Piece
     */
    observePiece(): Observable<Piece | null> {
        return this.pieceSubject$.asObservable();
    }

    /**
     * Get the observable that emits the next Piece
     * @returns {Observable<Piece | null>} An observable of the next Piece
     */
    observeNextPiece(): Observable<Piece | null> {
        return this.nextPieceSubject$.asObservable();
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx The 2D rendering context for the canvas.
     * @param {boolean} isExtended Determine the available game pieces
     * @param {string} type The type of piece to generate (current or next)
     * @returns {Piece} A newly generated Piece instance.
     */
    getPiece(ctx: CanvasRenderingContext2D, isExtended: boolean, type: string = 'current'): Piece {
        const randomTetromino = this.getRandomTetromino(isExtended);
        const piece = new Piece(ctx, randomTetromino, this.config, type);
        // Update the current or next piece subject
        this.setPiece(piece, type);
        return piece;
    }

    /**
     * Set the current or next Piece and notify subscribers
     * @param {Piece} piece - The Piece instance to set as current or next
     * @param {string} type - The type of piece to set (current or next)
     */
    private setPiece(piece: Piece, type: string): void {
        const subject = type === 'next'
            ? this.nextPieceSubject$
            : this.pieceSubject$;
        subject.next(piece); // update the subject
    }

    /**
     * Check if a tetromino is allowed to move to the specified position
     * within the game board.
     * @param {Matrix} shape The shape of the tetromino (current or next shape)
     * @param {Position} position The position to check
     * @returns {boolean} Whether the tetromino can move to the specified position
     */
    canMove(shape: Matrix, position: IPosition): boolean {
        // `shape.every` checks if every row of the shape meets the conditions
        return shape.every((row, rowIndex) => {
            // `row.every` checks if every value (cell) in the row meets the conditions.
            return row.every((value, columnIndex) => {
                // Calculate the actual x and y position on the board for the current cell.
                let x = position.x + columnIndex;
                let y = position.y + rowIndex;
                return value === 0 || this.isInBoundary({ x, y });
            });
        });
    }

    /**
     * Check if the piece is within the boundary of the canvas
     * @param x The x position of the piece
     * @param y The y position of the piece
     * @returns True if the piece is within the boundary, false otherwise
     */
    private isInBoundary(position: IPosition): boolean {
        return position.x >= 0
            && position.x < this.config.columns
            && position.y < this.config.rows;
    }

    /**
     * Move the current piece to the specified position and notify subscribers
     * of the change.
     * @param {Matrix} shape The update shape of the piece
     * @param {Position} position The updated position
     */
    move(shape: Matrix, position: IPosition) {
        const currentPiece = this.pieceSubject$.value;
        currentPiece?.move(shape, position);
        // hardcode as `current` because it is the only option
        this.setPiece(currentPiece!, 'current');
    }

    /**
     * Get a rotated version of the given piece. Note: This method does not
     * update the piece subject, that is handled by the move() method.
     *
     * @param {Piece} piece The original piece to be rotated
     * @returns {Piece} The rotated piece
     */
    getRotatedPiece(piece: Piece): Piece {
        const currentMatrix = piece.shape;
        const transposedMatrix = this.transposeMatrix(currentMatrix);
        // Replace existing piece shape with the rotated transposed shape
        piece.shape = transposedMatrix;
        return piece;
    }

    /**
    * Transpose a shape by rotating it clockwise
    *
    * original         transposed
    * [a, b, c]   =>   [a, d, g]
    * [d, e, f]   =>   [b, e, h]
    * [g, h, i]   =>   [c, f, i]
    *
    * @param shape The original shape to be transposed
    * @returns The transposed shape (rotated clockwise)
    */
    private transposeMatrix(shape: Matrix): Matrix {
        const numRows = shape.length;
        const numCols = shape[0].length;

        // Create a new shape for the rotated values
        const rotatedMatrix = new Array(numCols).fill(null).map(() => new Array(numRows));

        // Loop through rows and columns to perform rotation
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                // Rotate the values by swapping rows and columns
                rotatedMatrix[col][numRows - 1 - row] = shape[row][col];
            }
        }

        return rotatedMatrix;
    }

    /**
     * Get a random Tetromino object
     * @param {boolean} extended - Whether to include extended Tetrominos
     * @returns {Tetromino} A randomly selected Tetromino object
     */
    private getRandomTetromino(extended: boolean): ITetromino {
        const shapes = this.getGameShapes(extended);
        const shapeKeys = Object.keys(shapes);
        const randomIndex = Math.floor(Math.random() * shapeKeys.length);
        let randomShapeKey = shapeKeys[randomIndex];
        return shapes[randomShapeKey];
    }

    /**
     * Get the available Tetromino shapes based on the game mode
     * @param {boolean} extended - Whether to include extended Tetrominos
     * @returns {Object.<string, Tetromino>} An object containing the available Tetromino shapes
     */
    private getGameShapes(extended: boolean): { [key: string]: ITetromino } {
        return extended ? { ...TETROMINOS, ...EXT_TETROMINOS } : { ...TETROMINOS };
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
