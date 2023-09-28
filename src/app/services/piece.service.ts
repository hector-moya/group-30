import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ITetromino } from '../interfaces/Tetromino';
import { TETROMINOS, EXT_TETROMINOS } from '../data';
import { IPosition } from '../interfaces/Position';
import { ConfigService } from './config.service';
import { Observable, Subscription } from 'rxjs';
import { IConfig } from '../interfaces/Config';
import { Injectable } from '@angular/core';
import { Piece } from '../models/Piece';

@Injectable({
    providedIn: 'root'
})

export class PieceService {

    /**
     * Current Piece BehaviorSubjects to notify subscribers of changes
     */
    pieceSubject$: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(null)

    /**
     * Next Piece BehaviorSubjects to notify subscribers of changes
     */
    nextPieceSubject$: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(null);

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
     * Get a new Piece instance and notify subscribers
     * @param {CanvasRenderingContext2D} ctx The 2D rendering context for the canvas.
     * @param {string} type The type of piece to generate (current or next)
     * @returns {Piece} A newly generated Piece instance.
     */
    getPiece(ctx: CanvasRenderingContext2D, type: string = 'current'): Piece {
        this.initConfig(); // will only run once
        const randomTetromino = this.getRandomTetromino(this.config.extended);
        const piece = new Piece(ctx, randomTetromino, this.config, type);
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
     * Move the current piece to the specified position and notify subscribers
     * of the change.
     * @param {Matrix} shape The update shape of the piece
     * @param {Position} position The updated position
     */
    move(shape: Matrix, position: IPosition) {
        const currentPiece = this.pieceSubject$.value;
        currentPiece?.move(shape, position);
        this.pieceSubject$.next(currentPiece);
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
     * Initialise the configuration and subscribe to changes
     */
    private initConfig(): void {
        if (!this.configSubscription) {
            this.configSubscription = this.configService.observeConfig().subscribe({
                next: (config: IConfig) => {
                    this.config = config;
                    // Unsubscribe after the first emission because the
                    // configuration is not expected to change during the
                    // subsequent calls to getPiece.
                    this.configSubscription?.unsubscribe();
                },
                error: (error: any) => {
                    console.error('Failed to fetch configuration:', error);
                },
            });
        }
    }
}
