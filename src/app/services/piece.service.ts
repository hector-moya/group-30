import { Injectable } from '@angular/core';
import { TETROMINOS, EXT_TETROMINOS } from '../data';
import { Tetromino } from '../defs';
import { Piece } from '../models/Piece';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { GameConfigService } from './game-config.service';

@Injectable({
    providedIn: 'root'
})

export class PieceService {


    /**
     * BehaviorSubject to hold and broadcast the current Piece
     * @private
     */
    private pieceSubject: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(this.piece!)

    /**
     * The current piece instance
     */
    private piece?: Piece;

    // Inject the GameConfigService
    constructor(private gameConfigService: GameConfigService) { }

    /**
     * Get the observable that emits the current Piece
     *
     * @returns {Observable<Piece | null>} An observable of the current Piece
     */
    getPieceObservable(): Observable<Piece | null> {
        return this.pieceSubject.asObservable();
    }

    /**
     * Set the current Piece and notify subscribers
     *
     * @param piece
     */
    setCurrentPiece(piece: Piece): void {
        this.piece = piece;
        this.pieceSubject.next(piece);
    }

    /**
       * Generates a new Piece with a random Tetromino and returns it.
       *
       * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
       * @returns {Piece} A newly generated Piece instance.
       */
    getPiece(ctx: CanvasRenderingContext2D): Piece {
        const randomTetromino = this.getRandomTetromino(false);
        return new Piece(ctx, randomTetromino);
    }

    moveUp(): void {
        this.piece!.rotate();
    }

    moveLeft(): void {
        this.piece!.moveLeft();
    }

    moveRight(): void {
        this.piece!.moveRight();
    }

    moveDown(): void {
        this.piece!.moveDown();
    }

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
}
