import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GameConfigService } from './game-config.service';
import { TETROMINOS, EXT_TETROMINOS } from '../data';
import { Injectable } from '@angular/core';
import { Piece } from '../models/Piece';
import { Tetromino } from '../defs';
import { Observable } from 'rxjs';
import { IConfig } from '../models/GameConfig';

@Injectable({
    providedIn: 'root'
})

export class PieceService {

    /**
     * Current Piece BehaviorSubjects to notify subscribers of changes
     */
    private pieceSubject: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(this.piece!)

    /**
     * Next Piece BehaviorSubjects to notify subscribers of changes
     */
    private nextPieceSubject: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(null);

    /**
     * The current piece instance
     */
    private piece?: Piece;

    /**
     * The next piece instance
     */
    private nextPiece?: Piece;

    private config!: IConfig;

    constructor(private configService: GameConfigService) {
        this.subscribeToConfig();
    }

    /**
     * Subscribe to the configuration updates from the GameConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        // Subscribe to the getConfigObservable() method of the GameConfigService
        this.configService.getConfigObservable().subscribe((config: IConfig) => {
            this.config = config;
        });
    }

    /**
     * Get the observable that emits the current Piece
     *
     * @returns {Observable<Piece | null>} An observable of the current Piece
     */
    pieceObservable(): Observable<Piece | null> {
        return this.pieceSubject.asObservable();
    }

    /**
     * Set the current Piece and notify subscribers
     *
     * @param piece
     */
    setPiece(piece: Piece, type: string = 'current'): void {
        if (type === 'current') {
            this.piece = piece;
            this.pieceSubject.next(piece);
        }
        else if (type === 'next') {
            this.nextPiece = piece;
        }
    }

    /**
       * Generates a new Piece with a random Tetromino and returns it.
       *
       * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
       * @returns {Piece} A newly generated Piece instance.
       */
    getPiece(ctx: CanvasRenderingContext2D, isExtended: boolean = false): Piece {
        const randomTetromino = this.getRandomTetromino(isExtended);
        return new Piece(ctx, randomTetromino, this.config);
    }


    // getPiece(ctx: CanvasRenderingContext2D, isExtended: boolean = false): void {
    //     const randomTetromino = this.getRandomTetromino(isExtended);
    //     const newPiece = new Piece(ctx, randomTetromino, this.config);

    //     // Emit the new piece as the next piece
    //     this.nextPieceSubject.next(newPiece);

    //     // If there is an existing current piece, emit it as the current piece
    //     if (this.currentPiece) {
    //         this.currentPieceSubject.next(this.currentPiece);
    //     }

    //     // Update the current piece with the new piece
    //     this.currentPiece = newPiece;
    // }

    /**
     * Get a random Tetromino object
     *
     * @param {boolean} extended - Whether to include extended Tetrominos
     * @returns {Tetromino} A randomly selected Tetromino object
     */
    private getRandomTetromino(extended: boolean = false): Tetromino {
        const shapes = this.getGameShapes(extended);
        const shapeKeys = Object.keys(shapes);
        const randomIndex = Math.floor(Math.random() * shapeKeys.length);
        let randomShapeKey = shapeKeys[randomIndex];
        return shapes[randomShapeKey];
    }

    /**
     * Get the available Tetromino shapes based on the game mode
     *
     * @param {boolean} extended - Whether to include extended Tetrominos
     * @returns {Object.<string, Tetromino>} An object containing the available Tetromino shapes
     */
    private getGameShapes(extended: boolean): { [key: string]: Tetromino } {
        return extended ? { ...TETROMINOS, ...EXT_TETROMINOS } : { ...TETROMINOS };
    }

    /**
     *
     *
     *
     * REVIEW AND MOVE THIS
     *
     *
     *
     *
     *
     *
     */
    moveUp(): void {
        // if (this.piece?.canMove(this.piece)) {
        this.piece!.move('rotate');
        // }
    }

    moveLeft(): void {
        // if (this.piece?.canMove(this.piece)) {
        this.piece!.move('left');
        // }
    }

    moveRight(): void {
        // if (this.piece?.canMove(this.piece)) {
        this.piece!.move('right');
        // }
    }

    moveDown(): void {
        // if (this.piece?.canMove(this.piece)) {
        this.piece!.move('down');
        // }
    }


}
