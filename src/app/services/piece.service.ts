import { Injectable } from '@angular/core';
import { TETROMINOS, EXT_TETROMINOS } from '../data';
import { GameConfig, Tetromino } from '../defs';
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
    private nextPieceSubject: BehaviorSubject<Piece | null> = new BehaviorSubject<Piece | null>(this.nextPiece!)

    /**
     * The current piece instance
     */
    private piece?: Piece;

    // The next piece instance; For testing purposes
    private nextPiece?: Piece;

    private gameConfig!: GameConfig;

    constructor(private configService: GameConfigService) {
        this.subscribeToConfig();
    }

    /**
     * Subscribe to the configuration updates from the GameConfigService.
     * When the configuration changes, the callback function is triggered.
     */
    subscribeToConfig(): void {
        // Subscribe to the getConfigObservable() method of the GameConfigService
        this.configService.getConfigObservable().subscribe((config: GameConfig) => {
            this.gameConfig = config;
        });
    }

    /**
     * Get the observable that emits the current Piece
     *
     * @returns {Observable<Piece | null>} An observable of the current Piece
     */
    getPieceObservable(): Observable<Piece | null> {
        return this.pieceSubject.asObservable();
    }

    // Get the observable that emits the next Piece; For testing purposes
    getNextPieceObservable(): Observable<Piece | null> {
        return this.nextPieceSubject.asObservable();
    }

    /**
     * Set the current Piece and notify subscribers
     *
     * @param piece
     */
    setCurrentPiece(piece: Piece, type: string = 'current'): void {
        if (type === 'current') 
        {            
        this.piece = piece;
        this.pieceSubject.next(piece);
        }
        else if ( type === 'next') 
        {
            this.nextPiece = piece;
            this.nextPieceSubject.next(piece);
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
        console.log('Calling current piece');
        return new Piece(ctx, randomTetromino, this.gameConfig);
    }

    // Generates a new Piece with a random Tetromino and returns it; For testing purposes
    getNextPiece(ctx: CanvasRenderingContext2D): Piece {
        const randomTetromino = this.getRandomTetromino(false);
        console.log('Calling next piece');
        return new Piece(ctx, randomTetromino, this.gameConfig);
    }

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
