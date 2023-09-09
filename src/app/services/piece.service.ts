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
        this.configService.getConfigObservable().subscribe((config: IConfig) => {
            this.config = config;
        });
    }

    /**
     * Get the observable that emits the current Piece
     * @returns {Observable<Piece | null>} An observable of the current Piece
     */
    pieceObservable(): Observable<Piece | null> {
        return this.pieceSubject.asObservable();
    }

    /**
     * Get the observable that emits the next Piece
     * @returns {Observable<Piece | null>} An observable of the next Piece
     */
    nextPieceObservable(): Observable<Piece | null> {
        return this.nextPieceSubject.asObservable();
    }

    /**
     * Set the current or next Piece and notify subscribers
     * @param piece - The Piece instance to set as current or next
     * @param type - The type of piece to set (current or next)
     */
    setPiece(piece: Piece, type: string = 'current'): void {
        if (type === 'next') {
            this.nextPiece = piece;
            this.nextPieceSubject.next(piece);
        } else {
            this.piece = piece;
            this.pieceSubject.next(piece);
        }
    }

    /**
     * Generates a new Piece with a random Tetromino and returns it.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
     * @returns {Piece} A newly generated Piece instance.
     */
    getPiece(ctx: CanvasRenderingContext2D, isExtended: boolean = false): Piece {
        const randomTetromino = this.getRandomTetromino(isExtended);
        return new Piece(ctx, randomTetromino, this.config);
    }

    /**
     * Get a random Tetromino object
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
